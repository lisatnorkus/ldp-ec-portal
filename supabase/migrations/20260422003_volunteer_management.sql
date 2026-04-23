-- Volunteer management: Jessica's roster, the Volunteering Committee's
-- working file. Separate from ld_contacts (which is for recruiting
-- people to the EC ticket). These are people who want to help with
-- party work — canvass, phones, events, etc. — not seats.
--
-- Privacy model (enforced when magic-link auth lands):
--   - Volunteering Committee members + county officers: full PII on
--     every volunteer, plus activity log and write access.
--   - LD Chairs/VCs: read-only, their LD's volunteers, no phone/email
--     unless they're on the Volunteering Committee.
--   - Other EC members: aggregate counts only.
-- Preview-mode (passphrase gate) currently grants everyone full access;
-- the UI respects the split so the eventual RLS flip is a no-op for
-- most views.

-- ------------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_status') then
    create type volunteer_status as enum ('ACTIVE', 'LAPSED', 'PAUSED', 'DO_NOT_CONTACT');
  end if;
  if not exists (select 1 from pg_type where typname = 'volunteer_source') then
    create type volunteer_source as enum (
      'SIGNUP_FORM', 'REFERRAL', 'EVENT', 'CANVASS', 'SOCIAL', 'WALK_IN', 'OTHER'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'volunteer_activity_type') then
    create type volunteer_activity_type as enum (
      'CANVASS', 'PHONES', 'TEXTS', 'DATA', 'EVENT_HELP', 'HOSTING',
      'RIDES', 'TRANSLATION', 'SOCIAL', 'FOOD', 'WRITING', 'TECH',
      'CHILDCARE', 'ADMIN', 'OTHER'
    );
  end if;
end$$;

-- ------------------------------------------------------------------
-- Volunteers
-- ------------------------------------------------------------------
create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  preferred_name text,
  email text,
  phone text,
  address_street text,
  address_city text,
  address_zip text,
  home_ld int references legislative_districts(number),
  home_precinct text,

  status volunteer_status not null default 'ACTIVE',
  source volunteer_source not null default 'OTHER',

  -- What they LIKE to do — multi-select, free-form tags so we can add
  -- new categories without schema changes. See VOLUNTEER_INTERESTS in
  -- volunteers-types.ts for the canonical UI list.
  interest_tags text[] not null default '{}',

  -- Availability windows (WEEKDAY_DAY / WEEKDAY_EVENING / WEEKEND_DAY /
  -- WEEKEND_EVENING) plus a remote boolean.
  availability_windows text[] not null default '{}',
  remote_ok boolean not null default false,

  -- Who brought them in + who's managing the relationship day-to-day.
  recruited_by_name text,
  owner_name text,

  notes text,

  -- Maintained by trigger on volunteer_activities insert.
  last_active_at timestamptz,

  -- Preview-mode author trail; transitions to author_id uuid references
  -- ec_members(id) when magic-link auth lands.
  author_name text,
  author_role text,
  author_ld int,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_volunteers_status_lastactive
  on volunteers(status, last_active_at asc nulls first);
create index if not exists idx_volunteers_home_ld
  on volunteers(home_ld) where home_ld is not null;
create index if not exists idx_volunteers_owner
  on volunteers(owner_name) where owner_name is not null;
create index if not exists idx_volunteers_interest_tags
  on volunteers using gin (interest_tags);
create index if not exists idx_volunteers_names
  on volunteers(last_name, first_name);

-- ------------------------------------------------------------------
-- Volunteer activities — the log of what they've actually done.
-- ------------------------------------------------------------------
create table if not exists volunteer_activities (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references volunteers(id) on delete cascade,

  activity_type volunteer_activity_type not null,
  activity_date date not null default current_date,
  title text,             -- short description: "LD41 canvass, Crescent Hill"
  hours numeric(5,2),     -- optional — Jessica cares about volume, not everyone tracks hours
  related_ld int,
  notes text,

  author_name text,
  author_role text,
  author_ld int,

  created_at timestamptz not null default now()
);

create index if not exists idx_vol_activities_vol_date
  on volunteer_activities(volunteer_id, activity_date desc);
create index if not exists idx_vol_activities_date
  on volunteer_activities(activity_date desc);

-- Trigger: update volunteers.last_active_at whenever a new activity is
-- logged. Using max() over the activities table so edits/deletes stay
-- consistent (rather than naively setting to NEW.activity_date which
-- could go backwards if a later-dated activity is entered first).
create or replace function update_volunteer_last_active()
returns trigger language plpgsql as $$
begin
  update volunteers v
    set last_active_at = (
      select max(activity_date)::timestamptz
      from volunteer_activities
      where volunteer_id = v.id
    ),
    updated_at = now()
    where v.id = coalesce(new.volunteer_id, old.volunteer_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_vol_last_active_ins on volunteer_activities;
create trigger trg_vol_last_active_ins
  after insert or update or delete on volunteer_activities
  for each row execute function update_volunteer_last_active();
