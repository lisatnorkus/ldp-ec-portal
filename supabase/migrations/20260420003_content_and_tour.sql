-- ldp-ec-portal v2.0 — content, events, tour state, recommendation rules.

create type event_type as enum (
  'CELEBRATION_OF_DEMOCRACY',
  'WOMEN_DELIVER_DEMOCRACY',
  'DEMS_AT_THE_DOWNS',
  'OTHER'
);

create type cycle_phase as enum (
  'PRIMARY',
  'POST_PRIMARY',
  'SUMMER',
  'GENERAL',
  'ELECTION_WEEK',
  'POST_GENERAL'
);

-- ─── content_cards (static/semi-static orientation content) ────────────────

create table content_cards (
  slug text primary key,              -- e.g. "step-1-how-we-fit", "120-club-math"
  title text not null,
  section text,                       -- e.g. "tour_step_1", "tour_step_4"
  body_md text not null,
  published boolean not null default true,
  display_order smallint not null default 0,
  updated_at timestamptz not null default now()
);

create index content_cards_section_idx on content_cards(section) where published = true;

-- ─── month_cards (what's happening this month) ─────────────────────────────

create table month_cards (
  id uuid primary key default uuid_generate_v4(),
  month smallint not null check (month between 1 and 12),
  year  smallint not null,
  content_md text not null,
  theme_tag text,                     -- e.g. "PRIMARY_WINDOW", "SUMMER_ENGAGEMENT"
  published boolean not null default true,
  unique (year, month)
);

create index month_cards_year_month_idx on month_cards(year, month);

-- ─── events ────────────────────────────────────────────────────────────────

create table events (
  id uuid primary key default uuid_generate_v4(),
  type event_type not null,
  name text not null,
  event_date date,
  event_window_description text,      -- e.g. "Last Saturday in March 2027"
  venue text,
  drive_folder_url text,
  chair_id uuid references ec_members(id) on delete set null,
  tickets_url text,
  individual_raise_target_cents int,  -- $120 Club aligned
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index events_date_idx on events(event_date) where event_date is not null;
create index events_active_idx on events(active) where active = true;

-- ─── tour_progress (per-user tour state) ──────────────────────────────────

create table tour_progress (
  user_id uuid primary key,           -- ec_members.id; FK omitted so passphrase-era can write arbitrary UUIDs
  current_step smallint not null default 1 check (current_step between 1 and 6),
  completed_steps smallint[] not null default '{}',
  first_seen_at timestamptz not null default now(),
  completed_at timestamptz,
  last_seen_step smallint check (last_seen_step between 1 and 6),
  device_hint text,
  updated_at timestamptz not null default now()
);

create trigger tour_progress_set_updated_at
  before update on tour_progress
  for each row execute function set_updated_at();

-- ─── highest_leverage_rules (Step 3 recommendation engine) ────────────────

create table highest_leverage_rules (
  rule_id smallint primary key,
  priority smallint not null,
  role_filter primary_role[] not null,   -- empty = all roles
  phase_filter cycle_phase[] not null,   -- empty = all phases
  condition_expression text not null,     -- SQL-fragment expression evaluated per-user
  template text not null,                 -- user-facing string with {placeholders}
  rationale text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index highest_leverage_rules_priority_idx
  on highest_leverage_rules(priority) where active = true;

-- ─── settings (singleton key/value) ────────────────────────────────────────

create table settings (
  key text primary key,
  value text,
  description text,
  updated_at timestamptz not null default now()
);

create trigger settings_set_updated_at
  before update on settings
  for each row execute function set_updated_at();

insert into settings (key, value, description) values
  ('zoom_link', 'https://us02web.zoom.us/j/89692618777', 'Permanent LDPEC meeting Zoom URL'),
  ('zoom_meeting_id', '896 9261 8777', 'Zoom meeting ID for display'),
  ('comms_email', 'communications@louisvilledems.com', 'Comms committee intake email'),
  ('strategy_map_url', 'https://26ldp-strategy-map.vercel.app', '2026 LDP Strategy Map deep-link base'),
  ('primary_date_2026', '2026-05-19', '2026 Kentucky primary election day'),
  ('general_date_2026', '2026-11-03', '2026 general election day'),
  ('120_club_floor_cents', '62000', 'Minimum $120 Club commitment per EC member, in cents ($120 personal + $500 raise = $620 floor)')
on conflict (key) do nothing;
