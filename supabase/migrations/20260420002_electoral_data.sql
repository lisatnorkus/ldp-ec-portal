-- ldp-ec-portal v2.0 — electoral data: precincts, candidates, priority races, transitions.

create type strategy_tag as enum ('PRIMARY', 'DEFEND', 'ACTIVATE', 'GROW');
create type race_tier as enum ('HIGHEST', 'HIGH', 'NOVEMBER', 'STANDARD');
create type office_type as enum ('STATE_HOUSE', 'STATE_SENATE', 'METRO_COUNCIL', 'US_HOUSE');
create type party as enum ('D', 'R', 'I', 'L', 'OTHER');
create type seat_status as enum ('VACANT', 'FILLED');

-- ─── precincts ─────────────────────────────────────────────────────────────

create table precincts (
  id text primary key,                -- e.g. "LL01"
  ld_number smallint references legislative_districts(number) on delete set null,
  metro_council smallint,
  state_senate  smallint,
  us_house      smallint,
  strategy_tag  strategy_tag,
  friendly_name_cached text generated always as (
    case strategy_tag
      when 'PRIMARY' then 'Power Base'
      when 'DEFEND' then 'Hold the Line'
      when 'ACTIVATE' then 'Wake the Vote'
      when 'GROW' then 'Plant the Flag'
    end
  ) stored,
  registered_dems int not null default 0,
  registered_reps int not null default 0,
  registered_ind  int not null default 0,
  sleeper_dems    int not null default 0,
  turnout_2024_general  numeric(5,2),
  turnout_2024_primary  numeric(5,2),
  turnout_2022_general  numeric(5,2),
  d_margin_2024         numeric(5,2),
  notes text,
  updated_at timestamptz not null default now()
);

create index precincts_ld_idx on precincts(ld_number);
create index precincts_strategy_idx on precincts(strategy_tag);
create index precincts_metro_council_idx on precincts(metro_council);

-- ─── candidates (state house / state senate / metro council / us house) ───

create table candidates (
  id uuid primary key default uuid_generate_v4(),
  office_type office_type not null,
  district_number smallint not null,
  cycle_year smallint not null default 2026,
  full_name text not null,
  party party not null default 'D',
  is_incumbent boolean not null default false,
  is_endorsed boolean not null default false,
  on_primary_ballot boolean not null default false,
  on_general_ballot boolean not null default false,
  website_url text,
  notes text,
  created_at timestamptz not null default now()
);

create index candidates_office_district_cycle_idx
  on candidates(office_type, district_number, cycle_year);
create index candidates_endorsed_idx on candidates(is_endorsed) where is_endorsed = true;

-- ─── metro_races_priority ─────────────────────────────────────────────────

create table metro_races_priority (
  mc_number     smallint primary key,
  tier          race_tier not null,
  voter_count   int,
  sleeper_dems  int,
  independents  int,
  strategy_summary_md text,
  updated_at    timestamptz not null default now()
);

-- ─── transitions ───────────────────────────────────────────────────────────

create table transitions (
  id uuid primary key default uuid_generate_v4(),
  seat_code text not null,            -- e.g. "LD33_VC", "WOMENS_CLUB_PRES"
  previous_holder_name text,
  previous_holder_id uuid references ec_members(id) on delete set null,
  departed_date date,
  departure_reason text,
  successor_id uuid references ec_members(id) on delete set null,
  successor_name text,
  status seat_status not null default 'VACANT',
  elected_date date,
  notes text,
  created_at timestamptz not null default now()
);

create index transitions_status_idx on transitions(status);
create index transitions_seat_code_idx on transitions(seat_code);

create trigger precincts_set_updated_at
  before update on precincts
  for each row execute function set_updated_at();

create trigger metro_races_priority_set_updated_at
  before update on metro_races_priority
  for each row execute function set_updated_at();
