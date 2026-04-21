-- ldp-ec-portal v2.0 — initial schema: enums, people, LDs, committees.
-- Applied to project qefnfrjvcjrkldpatkhk on 2026-04-20.
--
-- Auth posture: RLS is DISABLED on v2.0 tables. The passphrase gate at the
-- edge + a private repo + publishable key only are the security boundary.
-- When Google OAuth lands post-testing, a follow-up migration enables RLS
-- and adds policies.

create extension if not exists "uuid-ossp";

-- ─── Enums ─────────────────────────────────────────────────────────────────

create type primary_role as enum (
  'OFFICER',
  'LD_CHAIR',
  'LD_VC',
  'AT_LARGE',
  'LYD_PRES',
  'WOMENS_CLUB_PRES',
  'PRECINCT_CAPTAIN',
  'COMMITTEE_CHAIR_ONLY'
);

create type officer_role as enum (
  'CHAIR',
  'VICE_CHAIR',
  'SECRETARY',
  'TREASURER'
);

create type committee_type as enum ('STANDING', 'AD_HOC');

-- ─── ec_members ────────────────────────────────────────────────────────────

create table ec_members (
  id                uuid primary key default uuid_generate_v4(),
  first_name        text not null,
  last_name         text not null,
  preferred_name    text,
  suffix            text,
  email             text,
  google_oauth_email text,
  phone             text,
  ld_number         smallint,
  primary_role      primary_role not null,
  officer_role      officer_role,
  committee_chair_codes text[] not null default '{}',
  committee_member_codes text[] not null default '{}',
  profile_photo_url text,
  term_start        date,
  term_end          date,
  active            boolean not null default true,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index ec_members_ld_number_idx on ec_members(ld_number);
create index ec_members_primary_role_idx on ec_members(primary_role);
create index ec_members_google_oauth_email_idx on ec_members(google_oauth_email)
  where google_oauth_email is not null;

-- ─── legislative_districts ─────────────────────────────────────────────────

create table legislative_districts (
  number        smallint primary key,
  chair_id      uuid references ec_members(id) on delete set null,
  vc_id         uuid references ec_members(id) on delete set null,
  precinct_count int,
  state_senate_overlap smallint[] not null default '{}',
  metro_council_overlap smallint[] not null default '{}',
  us_house_overlap smallint[] not null default '{}',
  updated_at    timestamptz not null default now()
);

-- ─── committees ────────────────────────────────────────────────────────────

create table committees (
  code          text primary key,
  name          text not null,
  type          committee_type not null,
  chair_id      uuid references ec_members(id) on delete set null,
  chair_title_override text,
  drive_folder_url text,
  description_md text,
  adhoc_note    text,
  active        boolean not null default true,
  display_order smallint not null default 0,
  updated_at    timestamptz not null default now()
);

create index committees_type_idx on committees(type);
create index committees_active_idx on committees(active);

-- ─── Updated-at trigger ────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger ec_members_set_updated_at
  before update on ec_members
  for each row execute function set_updated_at();

create trigger legislative_districts_set_updated_at
  before update on legislative_districts
  for each row execute function set_updated_at();

create trigger committees_set_updated_at
  before update on committees
  for each row execute function set_updated_at();
