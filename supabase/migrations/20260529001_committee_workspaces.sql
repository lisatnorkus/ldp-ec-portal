-- Committee Workspaces + Official Records — Phase 1 data layer.
-- Spec: docs/committee-workspaces-v1.md
--
-- Auth posture: RLS stays DISABLED on these tables, matching the rest
-- of the v2.0 schema. Permission gating is application-side via
-- src/lib/auth/roles.ts. A follow-up migration adds RLS policies when
-- Google OAuth lands.

-- ─── workspace_posts ──────────────────────────────────────────────────────
-- One row per post inside a committee's workspace. post_type drives the
-- composer + rendering. meeting_date is used on AGENDA posts (upcoming
-- meeting) and NOTES posts (which meeting these are minutes for).
--
-- Author identity is soft: author_member_id is best-effort matched from
-- the dashboard's localStorage display_name; author_display_name is the
-- string fallback that's always populated. Once OAuth lands, author_member_id
-- becomes hard-bound.

create table workspace_posts (
  id                    uuid primary key default uuid_generate_v4(),
  committee_code        text not null references committees(code) on delete cascade,
  author_member_id      uuid references ec_members(id) on delete set null,
  author_display_name   text not null,
  post_type             text not null check (post_type in
                          ('AGENDA', 'NOTES', 'IDEA', 'DECISION',
                           'ACTION_ITEM', 'LINK', 'FILE')),
  title                 text,
  content_md            text,
  tags                  text[] not null default '{}',
  meeting_date          date,
  meeting_location      text,
  link_url              text,
  is_pinned             boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index workspace_posts_committee_code_idx on workspace_posts(committee_code);
create index workspace_posts_author_member_id_idx on workspace_posts(author_member_id);
create index workspace_posts_post_type_idx on workspace_posts(post_type);
create index workspace_posts_meeting_date_idx on workspace_posts(meeting_date)
  where meeting_date is not null;
create index workspace_posts_pinned_idx on workspace_posts(committee_code, is_pinned)
  where is_pinned;

create trigger workspace_posts_set_updated_at
  before update on workspace_posts
  for each row execute function set_updated_at();

comment on table workspace_posts is
  'Committee workspace posts. post_type drives composer + rendering. Author identity is soft (localStorage-bound) until OAuth lands.';

-- ─── post_assignments ─────────────────────────────────────────────────────
-- Per-assignee state for ACTION_ITEM posts. Each assignee independently
-- accepts / rejects / progresses their copy of the task. The post-level
-- rollup status is computed client-side from these rows.
--
-- rejection_reason is NOT a NOT NULL constraint — it's enforced at the
-- API layer so existing accepted rows can be soft-rejected without
-- backfilling reasons.

create table post_assignments (
  id                    uuid primary key default uuid_generate_v4(),
  post_id               uuid not null references workspace_posts(id) on delete cascade,
  assignee_member_id    uuid not null references ec_members(id) on delete cascade,
  status                text not null default 'PENDING' check (status in
                          ('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'DONE')),
  rejection_reason      text,
  responded_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (post_id, assignee_member_id)
);

create index post_assignments_post_id_idx on post_assignments(post_id);
create index post_assignments_assignee_member_id_idx on post_assignments(assignee_member_id);
create index post_assignments_assignee_status_idx on post_assignments(assignee_member_id, status);

create trigger post_assignments_set_updated_at
  before update on post_assignments
  for each row execute function set_updated_at();

comment on table post_assignments is
  'Per-assignee state for ACTION_ITEM posts. Multiple assignees per post; each accepts/rejects independently.';

-- ─── meeting_records ──────────────────────────────────────────────────────
-- Historical record of an LDPEC or committee meeting. Points at the
-- minutes post + (optional) treasurer report post in workspace_posts.
-- Status workflow: DRAFT → PUBLISHED → APPROVED (or AMENDED if revised
-- after approval at a subsequent meeting).
--
-- committee_code is null when meeting_type='LDPEC' (countywide meeting);
-- required when meeting_type='COMMITTEE'.

create table meeting_records (
  id                       uuid primary key default uuid_generate_v4(),
  meeting_date             date not null,
  meeting_type             text not null check (meeting_type in ('LDPEC', 'COMMITTEE')),
  committee_code           text references committees(code) on delete set null,
  minutes_post_id          uuid references workspace_posts(id) on delete set null,
  treasurer_report_post_id uuid references workspace_posts(id) on delete set null,
  status                   text not null default 'DRAFT' check (status in
                             ('DRAFT', 'PUBLISHED', 'APPROVED', 'AMENDED')),
  approved_at              timestamptz,
  approved_by_member_id    uuid references ec_members(id) on delete set null,
  created_by_member_id     uuid not null references ec_members(id) on delete restrict,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  -- LDPEC meetings have no committee; committee meetings must have one.
  constraint meeting_records_committee_required check (
    (meeting_type = 'LDPEC' and committee_code is null) or
    (meeting_type = 'COMMITTEE' and committee_code is not null)
  )
);

create index meeting_records_meeting_date_idx on meeting_records(meeting_date desc);
create index meeting_records_committee_code_idx on meeting_records(committee_code)
  where committee_code is not null;
create index meeting_records_status_idx on meeting_records(status);

create trigger meeting_records_set_updated_at
  before update on meeting_records
  for each row execute function set_updated_at();

comment on table meeting_records is
  'Historical meeting records (LDPEC or committee). Links to minutes + treasurer-report posts. Status: DRAFT → PUBLISHED → APPROVED/AMENDED.';
