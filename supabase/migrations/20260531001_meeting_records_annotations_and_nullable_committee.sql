-- Two related schema changes that together unblock the full-year
-- LDPEC minutes backfill:
--
-- 1. workspace_posts.committee_code → nullable.
--    LDPEC plenary minutes and treasurer reports are countywide; they
--    don't belong to a single committee. The FK stays in place but
--    NULL is now allowed, matching the existing nullability on
--    meeting_records.committee_code for meeting_type='LDPEC'.
--
-- 2. meeting_records.annotations JSONB column.
--    The canonical record is the full minutes text on the linked
--    workspace_post. Annotations are the parsed/derived structure
--    (motions, decisions, action items, attendance) layered on top so
--    the YIR rollup tiles + future filtering can run without re-
--    parsing on every page load. The verbatim minutes remain the
--    source of truth — annotations never replace them.

alter table workspace_posts
  alter column committee_code drop not null;

comment on column workspace_posts.committee_code is
  'NULL = LDPEC-wide post (plenary minutes, treasurer reports). FK to committees(code) still enforced when set.';

alter table meeting_records
  add column if not exists annotations jsonb not null default '{}'::jsonb;

comment on column meeting_records.annotations is
  'Parsed annotations layered on the linked minutes/treasurer-report posts: { motions: [], decisions: [], action_items: [], attendance: { present: [], proxy: [], absent: [] } }. The minutes content_md remains the canonical record.';

-- GIN index so the YIR-page rollups can count e.g. all decisions in
-- the last 12 months in a single query.
create index if not exists meeting_records_annotations_gin
  on meeting_records using gin (annotations);
