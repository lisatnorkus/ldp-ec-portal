-- Voter registration events. Scheduled by the Events Committee or the
-- Volunteering Committee and surfaced on the public /voter-registration
-- page so that anyone looking at the KY rules also sees when/where
-- they can actually register in person.
--
-- Separate from `events` (which is fundraising signature events) and
-- from `volunteer_activities` (which is a past-tense activity log).

create table if not exists voter_reg_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null,
  address text,
  ld_number int references legislative_districts(number),
  description text,

  -- Who's running it — surface on the page so the ask is attributable.
  organizer_name text,
  organizer_committee text, -- e.g. 'VOLUNTEERING', 'EVENTS', 'AD_HOC'

  signup_url text,

  -- Target populations for this drive — college students, new movers,
  -- returning citizens, etc. Free-form tags; see VOTER_REG_TARGETS in
  -- the types file for the canonical UI list.
  target_populations text[] not null default '{}',

  is_published boolean not null default true,

  author_name text,
  author_role text,
  author_ld int,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vrevents_starts_at
  on voter_reg_events(starts_at);
create index if not exists idx_vrevents_published_upcoming
  on voter_reg_events(is_published, starts_at)
  where is_published = true;
