-- Phase 1 engagement tracking — anonymous during passphrase era,
-- per-user once OAuth lands. user_id is nullable on every event row;
-- the admin engagement page handles the "user_id null" case as
-- aggregate-only.

-- ─── auth_events ─────────────────────────────────────────────────────
create table public.auth_events (
  id bigserial primary key,
  user_id uuid references public.ec_members(id) on delete set null,
  event_type text not null check (event_type in ('signin', 'signout')),
  occurred_at timestamptz not null default now(),
  user_agent_hash text,                 -- truncated UA for rough device counting; never the full UA
  ip_truncated text                     -- /24 for v4 or /48 for v6; never the full IP
);

create index auth_events_occurred_at_idx on public.auth_events (occurred_at desc);
create index auth_events_user_id_idx on public.auth_events (user_id) where user_id is not null;

alter table public.auth_events enable row level security;

-- Anyone (including anon) can INSERT a sign-in event. The endpoint
-- gates this on the user already presenting a valid passphrase or
-- OAuth session, so the table is effectively write-from-app-only.
create policy auth_events_anon_insert on public.auth_events
  for insert to anon with check (true);

create policy auth_events_authenticated_insert on public.auth_events
  for insert to authenticated with check (true);

-- Reads are server-side only (service role bypasses RLS). No public
-- read policy — the admin page reads via the service role.

-- ─── chat_queries ────────────────────────────────────────────────────
-- Counts + topic tags only. We never store the question text or the
-- model response. Topic tag is derived server-side from a keyword
-- check in the compliance-chat API route.

create table public.chat_queries (
  id bigserial primary key,
  user_id uuid references public.ec_members(id) on delete set null,
  topic_tag text not null check (topic_tag in ('finance', 'bylaws', 'both', 'other')),
  occurred_at timestamptz not null default now(),
  question_length smallint               -- char count only; useful for distinguishing exploratory vs deep questions
);

create index chat_queries_occurred_at_idx on public.chat_queries (occurred_at desc);
create index chat_queries_user_id_idx on public.chat_queries (user_id) where user_id is not null;

alter table public.chat_queries enable row level security;

create policy chat_queries_server_only_insert on public.chat_queries
  for insert to anon, authenticated with check (true);
-- No read policy — admin reads via service role.

comment on table public.auth_events is 'Sign-in events. user_id null during passphrase era; populated once OAuth lands. Read via service role only.';
comment on table public.chat_queries is 'Compliance-chat query counts. Topic tag derived server-side. Question text + model response are NEVER stored. Read via service role only.';
