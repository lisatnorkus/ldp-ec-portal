-- LD Workspace: the institutional memory layer.
-- Notes, tasks, recruiting CRM, and continuity packages — all scoped
-- to the LD (not the user) so data survives leadership transitions.
-- No RLS yet; we're in the passphrase-gated preview. RLS lands when
-- magic-link auth lands.

-- ------------------------------------------------------------------
-- Shared author attribution (preview-mode, no auth yet)
-- ------------------------------------------------------------------
-- All writer tables carry author_name + author_role + author_ld as
-- text/int so the UI can attribute without a Supabase Auth user.
-- When auth lands we'll add an author_id uuid references ec_members(id)
-- and backfill by name match.

-- ------------------------------------------------------------------
-- Notes
-- ------------------------------------------------------------------
create table if not exists ld_notes (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  body text not null,
  author_name text,
  author_role text,
  author_ld int,
  is_pinned boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ld_notes_ld_created on ld_notes(ld_number, created_at desc);
create index if not exists idx_ld_notes_pinned on ld_notes(ld_number) where is_pinned = true;

-- ------------------------------------------------------------------
-- Tasks
-- ------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type task_status as enum ('OPEN', 'IN_PROGRESS', 'DONE', 'DEFERRED');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_priority') then
    create type task_priority as enum ('LOW', 'MEDIUM', 'HIGH');
  end if;
end$$;

create table if not exists ld_tasks (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  title text not null,
  description text,
  status task_status not null default 'OPEN',
  priority task_priority not null default 'MEDIUM',
  due_date date,
  completed_at timestamptz,
  author_name text,
  author_role text,
  author_ld int,
  is_template_task boolean not null default false,
  -- Set during continuity handoff: HAND_OFF | CLOSE | ESCALATE
  continuity_disposition text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ld_tasks_ld_status_due on ld_tasks(ld_number, status, due_date);

-- ------------------------------------------------------------------
-- Recruiting CRM: contacts + interactions
-- ------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'pipeline_stage') then
    create type pipeline_stage as enum (
      'IDENTIFIED', 'CONTACTED', 'WARM', 'COMMITTED', 'ACTIVE', 'EC_MEMBER',
      'COLD', 'PAUSED', 'NOT_INTERESTED'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'contact_source') then
    create type contact_source as enum (
      'CANVASS', 'REFERRAL', 'EVENT', 'SOCIAL', 'WALK_IN', 'OTHER'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'contact_method') then
    create type contact_method as enum (
      'CALL', 'TEXT', 'DOOR', 'EMAIL', 'IN_PERSON', 'EVENT', 'OTHER'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'interaction_outcome') then
    create type interaction_outcome as enum (
      'LEFT_VOICEMAIL', 'HAD_CONVERSATION', 'NOT_HOME', 'AGREED_TO', 'DECLINED', 'OTHER'
    );
  end if;
end$$;

create table if not exists ld_contacts (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  home_precinct text,
  -- VoteBuilder-friendly address fields so the CSV export is clean
  address_street text,
  address_city text,
  address_zip text,
  -- Optional VAN / VoteBuilder ID for exact-match imports
  voter_file_id text,
  pipeline_stage pipeline_stage not null default 'IDENTIFIED',
  interest_tags text[] not null default '{}',
  source contact_source not null default 'OTHER',
  assigned_to_name text,
  is_key_relationship boolean not null default false,
  -- last_contacted_at is maintained by trigger on ld_interactions
  last_contacted_at timestamptz,
  notes text,
  author_name text,
  author_role text,
  author_ld int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ld_contacts_ld_stage on ld_contacts(ld_number, pipeline_stage);
create index if not exists idx_ld_contacts_ld_last_contacted
  on ld_contacts(ld_number, last_contacted_at asc nulls first);
create index if not exists idx_ld_contacts_ld_key
  on ld_contacts(ld_number) where is_key_relationship = true;

create table if not exists ld_interactions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references ld_contacts(id) on delete cascade,
  -- Denormalized for fast LD scoping
  ld_number int not null,
  contact_method contact_method not null,
  contacted_at timestamptz not null default now(),
  author_name text,
  author_role text,
  author_ld int,
  outcome interaction_outcome not null,
  outcome_detail text,
  -- If this interaction moved them to a new pipeline stage
  new_stage pipeline_stage,
  -- If a follow-up task was auto-created from this interaction
  follow_up_task_id uuid references ld_tasks(id),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_ld_interactions_contact_ts
  on ld_interactions(contact_id, contacted_at desc);

-- Trigger: update contact.last_contacted_at + optional stage change
-- whenever a new interaction is logged.
create or replace function update_last_contacted()
returns trigger language plpgsql as $$
begin
  update ld_contacts
    set last_contacted_at = new.contacted_at,
        pipeline_stage = coalesce(new.new_stage, pipeline_stage),
        updated_at = now()
    where id = new.contact_id;
  return new;
end;
$$;

drop trigger if exists trg_update_last_contacted on ld_interactions;
create trigger trg_update_last_contacted
  after insert on ld_interactions
  for each row execute function update_last_contacted();

-- ------------------------------------------------------------------
-- Continuity packages
-- ------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'package_status') then
    create type package_status as enum ('DRAFT', 'SUBMITTED', 'LOCKED', 'ARCHIVED');
  end if;
end$$;

create table if not exists ld_continuity_packages (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  cycle text not null,
  outgoing_chair_name text,
  status package_status not null default 'DRAFT',
  submitted_at timestamptz,
  locked_at timestamptz,
  locked_by_name text,
  state_narrative text,
  resource_notes text,
  chair_note_to_successor text,
  key_contact_ids uuid[] not null default '{}',
  -- {task_id: 'HAND_OFF' | 'CLOSE' | 'ESCALATE'}
  task_dispositions jsonb not null default '{}',
  -- {precinct_code: {note: '', status: 'DARK' | 'COVERED' | 'STRONG'}}
  precinct_notes jsonb not null default '{}',
  -- Snapshot of the active pipeline at submission time (frozen)
  pipeline_snapshot jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ld_continuity_ld_status
  on ld_continuity_packages(ld_number, status);
create index if not exists idx_ld_continuity_ld_locked
  on ld_continuity_packages(ld_number, locked_at desc);
