-- Seed: realistic LDPEC + committee meeting records so /official-records
-- and the YIR briefing aren't empty on day-one demo. Idempotent via
-- NOT EXISTS guards on (meeting_date, meeting_type, committee_code) —
-- safe to re-apply.
--
-- Designed to survive partial environments: if Secretary/Chair seats
-- aren't filled yet, the LDPEC block silently no-ops. Same for the
-- committee blocks if a chair_id hasn't been wired.

do $$
declare
  v_secretary uuid;
  v_chair uuid;
  v_author uuid;
  v_comms_chair_id uuid;
  v_comms_chair_name text;
  v_finance_chair_id uuid;
  v_minutes_post_id uuid;
begin
  -- ── Resolve the LDPEC-record author ────────────────────────────────
  -- Secretary first (the natural minutes-owner per CLAUDE.md), fall
  -- back to LDP Chair. If neither seat is filled, skip LDPEC seeds.

  select id into v_secretary
  from ec_members
  where primary_role = 'OFFICER' and officer_role = 'SECRETARY' and active
  limit 1;

  select id into v_chair
  from ec_members
  where primary_role = 'OFFICER' and officer_role = 'CHAIR' and active
  limit 1;

  v_author := coalesce(v_secretary, v_chair);

  -- ── LDPEC monthly meetings, Jan–May 2026 ───────────────────────────
  -- Past months APPROVED at the next month's meeting; May 27 is still
  -- PUBLISHED, demo-ready for the "Approve" button click.

  if v_author is not null then
    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-05-27' and meeting_type = 'LDPEC'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code, status, created_by_member_id
      )
      values ('2026-05-27', 'LDPEC', null, 'PUBLISHED', v_author);
    end if;

    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-04-22' and meeting_type = 'LDPEC'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code, status,
        approved_at, approved_by_member_id, created_by_member_id
      )
      values (
        '2026-04-22', 'LDPEC', null, 'APPROVED',
        '2026-05-27 18:00:00-04', coalesce(v_chair, v_author), v_author
      );
    end if;

    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-03-25' and meeting_type = 'LDPEC'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code, status,
        approved_at, approved_by_member_id, created_by_member_id
      )
      values (
        '2026-03-25', 'LDPEC', null, 'APPROVED',
        '2026-04-22 18:00:00-04', coalesce(v_chair, v_author), v_author
      );
    end if;

    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-02-25' and meeting_type = 'LDPEC'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code, status,
        approved_at, approved_by_member_id, created_by_member_id
      )
      values (
        '2026-02-25', 'LDPEC', null, 'APPROVED',
        '2026-03-25 18:00:00-04', coalesce(v_chair, v_author), v_author
      );
    end if;

    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-01-28' and meeting_type = 'LDPEC'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code, status,
        approved_at, approved_by_member_id, created_by_member_id
      )
      values (
        '2026-01-28', 'LDPEC', null, 'APPROVED',
        '2026-02-25 18:00:00-04', coalesce(v_chair, v_author), v_author
      );
    end if;
  end if;

  -- ── Communications committee — fully stocked demo row ─────────────
  -- NOTES post (the minutes) + APPROVED meeting_record pointing at it.
  -- Demonstrates the click-through: record → minutes post → committee
  -- workspace.

  select c.chair_id,
         coalesce(m.preferred_name, m.first_name) || ' ' || m.last_name
  into v_comms_chair_id, v_comms_chair_name
  from committees c
  join ec_members m on m.id = c.chair_id
  where c.code = 'COMMUNICATIONS';

  if v_comms_chair_id is not null then
    select id into v_minutes_post_id
    from workspace_posts
    where committee_code = 'COMMUNICATIONS'
      and post_type = 'NOTES'
      and title = 'Communications · April 15, 2026 minutes'
    limit 1;

    if v_minutes_post_id is null then
      insert into workspace_posts (
        committee_code, author_member_id, author_display_name, post_type,
        title, content_md, meeting_date, is_pinned
      )
      values (
        'COMMUNICATIONS', v_comms_chair_id, v_comms_chair_name, 'NOTES',
        'Communications · April 15, 2026 minutes',
        E'## Attendees\n- ' || v_comms_chair_name || ' (chair)\n- 5 members present, 2 excused\n\n## Decisions\n- Approved the May social calendar.\n- Approved spend on May Derby canvass graphics.\n\n## Action items\n- ' || v_comms_chair_name || ': ship the May newsletter by May 5.\n- Committee: post 4 weekly Derby-week explainers.',
        '2026-04-15', false
      )
      returning id into v_minutes_post_id;
    end if;

    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-04-15'
        and meeting_type = 'COMMITTEE'
        and committee_code = 'COMMUNICATIONS'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code,
        minutes_post_id, status,
        approved_at, approved_by_member_id, created_by_member_id
      )
      values (
        '2026-04-15', 'COMMITTEE', 'COMMUNICATIONS',
        v_minutes_post_id, 'APPROVED',
        '2026-05-13 19:00:00-04', v_comms_chair_id, v_comms_chair_id
      );
    end if;
  end if;

  -- ── Finance committee — PUBLISHED, no minutes attached ────────────
  -- Demo target for the "Approve" flow (chair clicks Approve at the
  -- next meeting) and the "no minutes attached" empty-state.

  select chair_id into v_finance_chair_id
  from committees
  where code = 'FINANCE';

  if v_finance_chair_id is not null then
    if not exists (
      select 1 from meeting_records
      where meeting_date = '2026-05-20'
        and meeting_type = 'COMMITTEE'
        and committee_code = 'FINANCE'
    ) then
      insert into meeting_records (
        meeting_date, meeting_type, committee_code, status,
        created_by_member_id
      )
      values (
        '2026-05-20', 'COMMITTEE', 'FINANCE', 'PUBLISHED',
        v_finance_chair_id
      );
    end if;
  end if;
end $$;
