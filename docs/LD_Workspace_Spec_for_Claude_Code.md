# LD Workspace — Feature Spec for Claude Code
**Project:** ldp-ec-portal (Next.js / Supabase / Vercel)  
**Repo:** github.com/lisatnorkus/ldp-ec-portal  
**Database:** Supabase project `ldp-ec-portal` (write), `kypolitics` (read-only)  
**Prepared by:** Lisa Norkus / Claude — April 2026

---

## What you already built (current state)

Before adding anything, understand the existing architecture so nothing conflicts:

- **Framework:** Next.js App Router, TypeScript, Tailwind, shadcn/ui
- **Shell:** `HubShell` — persistent left sidebar (mobile: drawer), breadcrumbs on every interior page
- **Nav color groups:** command navy, plan red, people violet, governance cyan, resources amber
- **Auth:** Google OAuth via Supabase Auth. Users must exist in `ec_members` table. RLS: authenticated = full read; writes currently admin-only.
- **`/my-ld/[n]`** already exists with: precinct playbook (4 strategy buckets from kypolitics), PC captain coverage math, early voting inside LD, 2026 ballot races, strategy mix tiles, leadership display
- **Dashboard:** WorkingSet widget + Right Now panel (live kypolitics precinct data)
- **Other live pages:** /candidates, /this-month (live iCal), /events, /transitions, /drive, /committees, /people, /partners, /endorsement, /comms, /canvass-tools, /early-voting, /vacancies/legislative, /plan-map

---

## What to build: LD Workspace

### The problem being solved
Every LD chair starts from scratch after reorganization. Recruiting contacts, precinct history, past canvass results, notes from prior chairs — all of it disappears with the outgoing chair. This feature set makes `/my-ld/[n]` the institutional memory layer that survives leadership transitions.

### Core principle: data belongs to the LD, not the chair
Nothing is owned by a user. A chair gets access to their LD's workspace. When a new chair takes over, they inherit all prior history. Past notes/tasks/contacts are read-only history — never deleted.

---

## Feature 1: Notes

**Where it lives:** New section on `/my-ld/[n]`, below Leadership and above Precinct Captains. Also surfaces on individual contact records (see Feature 2).

### UX
- "LD Notes" section header with a "+ Add note" button (navy accent)
- Notes render as a chronological stack, newest first
- Each note shows: body text, author name, timestamp (relative: "3 days ago"), and a subtle pinned indicator if pinned
- Pinned notes always float to the top of the stack regardless of timestamp
- Long notes truncate at ~4 lines with a "Read more" toggle
- Edit: note author can edit their own notes. Admin can edit any note.
- No delete — notes are permanent record. Admin can archive (soft hide).

### Component structure
```
src/
  components/
    ld-workspace/
      LdNotes.tsx          ← container for the notes section
      NoteCard.tsx         ← individual note display
      NoteComposer.tsx     ← add/edit note form (textarea + submit)
  lib/
    db/
      ld-notes.ts          ← fetchNotesByLd(), addNote(), updateNote(), pinNote()
  app/
    my-ld/
      [number]/
        page.tsx           ← add <LdNotes ldNumber={n} /> to the page
```

### Auth behavior
- Any authenticated EC member can READ all notes for any LD
- Only the chair/VC of that LD (or admin) can WRITE notes to it
- Check `ec_members.ld_number` + `ec_members.primary_role` against the LD number from the URL

---

## Feature 2: Tasks / Todo List

**Where it lives:** New section on `/my-ld/[n]`, immediately below the "Highest leverage move" block at the top of the page. This is intentional — it's where the chair looks first.

### UX
- "Open tasks" header with count badge (navy pill, e.g. "3 open")
- Tasks grouped: Overdue (red tint) → Due this week → Due later → No due date
- Each task row: checkbox (complete) + title + due date chip + priority dot
- Clicking a task expands it inline to show description and a "mark done" / "edit" / "defer" set of actions
- Completed tasks collapse into a "Completed (12)" disclosure at the bottom, not deleted
- "+ Add task" button opens a simple inline form: title (required), due date (optional), priority (low/medium/high), notes (optional)
- Task templates: a "New chair setup" button that bulk-inserts 8 standard onboarding tasks with preset titles and due dates

### Task template: new chair setup
Pre-defined tasks to insert when a new chair takes over:
1. Confirm your LD's precinct captain list is current (due: 2 weeks)
2. Schedule your first LD meeting (due: 1 month)
3. Review past LD notes from prior chair (no due date)
4. Contact your top 3 recruiting prospects (due: 3 weeks)
5. Connect with your assigned Metro Council candidate (due: 1 month)
6. Register on Mobilize for upcoming canvasses (due: 1 week)
7. Review your LD's strategy mix and dark precincts (due: 2 weeks)
8. Introduce yourself to LDP Volunteer Coordinator (due: 2 weeks)

### Component structure
```
src/
  components/
    ld-workspace/
      LdTasks.tsx           ← container
      TaskRow.tsx           ← individual task with expand/complete
      TaskComposer.tsx      ← add/edit task inline form
      NewChairTemplateBtn.tsx ← bulk-insert onboarding tasks
  lib/
    db/
      ld-tasks.ts           ← fetchTasksByLd(), addTask(), completeTask(), deferTask()
```

---

## Feature 3: Recruiting CRM

**Where it lives:** New top-level page at `/my-ld/[n]/recruiting` with a card link from the main `/my-ld/[n]` page. Also a new nav item under the "people violet" color group in HubShell — but only visible when a user's profile LD matches the page (or user is admin).

### Page structure: `/my-ld/[n]/recruiting`
- PageMasthead: eyebrow "LD [n] · Recruiting", title "Prospect Pipeline"
- Pipeline view: horizontal stage swimlanes OR a table view (toggle)
- Table view is the default: all contacts sorted by last_contacted_at ascending (oldest contact first — who's falling through the cracks)
- "+ Add prospect" button → slide-in panel or modal with the contact form
- Filter bar: stage, interest area, last contacted (30/60/90+ days)

### Pipeline stages (enum)
`IDENTIFIED → CONTACTED → WARM → COMMITTED → ACTIVE → EC_MEMBER`

Also: `COLD`, `PAUSED`, `NOT_INTERESTED` (these park a contact without deleting)

### Contact record fields
```
ld_contacts:
  id (uuid pk)
  ld_number (int, fk → legislative_districts)
  first_name, last_name
  phone (text, nullable)
  email (text, nullable)
  home_precinct (text, nullable)
  pipeline_stage (enum above)
  interest_tags (text[], e.g. ['canvassing', 'events', 'committee_seat', 'donor'])
  source (enum: CANVASS | REFERRAL | EVENT | SOCIAL | WALK_IN | OTHER)
  assigned_to (uuid fk → ec_members, nullable)
  is_key_relationship (bool default false) ← flags for continuity package
  last_contacted_at (timestamptz, computed from latest ld_interactions row)
  created_at (timestamptz)
  created_by (uuid fk → ec_members)
  notes (text, nullable) ← long-form background context
```

### Interaction log
Each contact has a thread of logged interactions:
```
ld_interactions:
  id (uuid pk)
  contact_id (uuid fk → ld_contacts)
  ld_number (int) ← denormalized for RLS queries
  contact_method (enum: CALL | TEXT | DOOR | EMAIL | IN_PERSON | EVENT | OTHER)
  contacted_at (timestamptz)
  author_id (uuid fk → ec_members)
  outcome (enum: LEFT_VOICEMAIL | HAD_CONVERSATION | NOT_HOME | AGREED_TO | DECLINED | OTHER)
  outcome_detail (text, nullable) ← "Agreed to come to April meeting"
  new_stage (enum, nullable) ← if this interaction moved them to a new stage
  follow_up_task_id (uuid fk → ld_tasks, nullable) ← auto-linked task if created
  notes (text, nullable)
  created_at (timestamptz)
```

### UX for contact detail page
Route: `/my-ld/[n]/recruiting/[contact_id]`

- Contact header: name, stage pill (color-coded), last contacted X days ago
- Tabs: Overview | Interaction log | Edit contact
- Overview: key fields, interest tags, assigned to, key relationship flag
- Interaction log: chronological thread, newest first. "+ Log interaction" button at top
- Log interaction form: method (radio), outcome (select), notes (textarea), stage change (optional select), "create follow-up task?" toggle
- When "create follow-up task?" is on: shows inline task form fields (title pre-filled as "Follow up with [name]", due date picker)
- On submit: saves interaction + optionally creates task + updates last_contacted_at on contact

### Trigger: last-contacted alerts
On the `/my-ld/[n]` page, add a small alert block between the task list and the notes section:
- If any contacts haven't been touched in 60+ days: "X prospects haven't been contacted in 60+ days → [Go to pipeline]"
- Use orange/amber tint. Only show when count > 0.

---

## Feature 4: Continuity Package

**Where it lives:** New page at `/my-ld/[n]/continuity`. Linked from `/my-ld/[n]` with a "Continuity & Handoff" card (slate/neutral color per the color system — "neutrality").

### Lifecycle states
`DRAFT → SUBMITTED → LOCKED → ARCHIVED`

- DRAFT: only the current chair/VC and admin can see and edit
- SUBMITTED: chair marks it ready; admin reviews before locking
- LOCKED: immutable. Incoming chair gets read access. Timestamp recorded.
- ARCHIVED: multiple past packages per LD; each is read-only history

### Sections of the package
All sections auto-populate from live data where possible, with an editable override field.

**1. State of the LD** (free text, required)
- "How is the district? What worked this cycle? What should the next chair know on day one?"
- No auto-population. This is the outgoing chair's voice.

**2. Key contacts** (auto-populated from recruiting CRM)
- Pulls all contacts where `is_key_relationship = true`
- Chair can add/remove from this list within the package
- Renders as: name, stage, last contacted, interest tags, one-line note

**3. Open tasks** (auto-populated from ld_tasks where status != DONE)
- For each open task, chair marks one of: HAND_OFF (transfers to new chair), CLOSE (mark as obsolete), ESCALATE (flags to LDP admin)
- Tasks marked HAND_OFF re-open in the new chair's task list automatically on handoff completion

**4. Precinct status** (auto-populated from kypolitics + ld_contacts)
- Table: precinct | captain on file | notes | status (dark/covered/strong)
- Chair can add a note per precinct

**5. Active recruiting pipeline** (auto-populated)
- Snapshot of all contacts in WARM or COMMITTED stage at time of package submission
- Read-only snapshot — freezes at submission time, doesn't update with later changes

**6. Resource notes** (free text + key-value fields)
- Meeting venue, parking, A/V contact
- Any recurring vendor or event notes
- Field for "Where are the login credentials stored?" (text only, no actual credentials)

**7. Outgoing chair's note to successor** (free text, optional)
- Personal, unstructured. "Don't schedule anything the week before Derby."
- Appears first on the incoming chair's view of the package

### Database
```
ld_continuity_packages:
  id (uuid pk)
  ld_number (int)
  cycle (text, e.g. '2025-2027')
  outgoing_chair_id (uuid fk → ec_members)
  status (enum: DRAFT | SUBMITTED | LOCKED | ARCHIVED)
  submitted_at (timestamptz, nullable)
  locked_at (timestamptz, nullable)
  locked_by (uuid fk → ec_members, nullable)
  state_narrative (text, nullable)
  resource_notes (text, nullable)
  chair_note_to_successor (text, nullable)
  key_contact_ids (uuid[]) ← snapshot of contact IDs flagged as key
  task_dispositions (jsonb) ← {task_id: 'HAND_OFF' | 'CLOSE' | 'ESCALATE'}
  precinct_notes (jsonb) ← {precinct_id: {note: '', status: ''}}
  created_at (timestamptz)
  updated_at (timestamptz)
```

### Handoff workflow
1. Chair navigates to `/my-ld/[n]/continuity` and clicks "Begin handoff package"
2. Fills all sections (auto-populated fields are editable overrides)
3. Submits — status moves to SUBMITTED
4. LDP admin (Lisa) gets a notification (or just sees it flagged in the admin view)
5. Admin reviews and clicks "Lock package" — status moves to LOCKED, timestamp recorded
6. Admin uses the member management tools (existing or new) to reassign `ec_members.ld_number` and `primary_role` for incoming/outgoing chairs
7. Incoming chair now sees the locked package on their `/my-ld/[n]/continuity` page
8. Tasks marked HAND_OFF auto-appear in incoming chair's open task list
9. All notes, contacts, and interaction history carry forward automatically (nothing moves — they already belong to the LD, not the outgoing chair)

---

## Database migration plan

Run these migrations in order. All in the `ldp-ec-portal` Supabase project (NOT kypolitics).

### Migration 1: notes
```sql
create table ld_notes (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  body text not null,
  author_id uuid not null references ec_members(id),
  is_pinned bool not null default false,
  is_archived bool not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on ld_notes(ld_number, created_at desc);
create index on ld_notes(ld_number, is_pinned) where is_pinned = true;
```

### Migration 2: tasks
```sql
create type task_status as enum ('OPEN', 'IN_PROGRESS', 'DONE', 'DEFERRED');
create type task_priority as enum ('LOW', 'MEDIUM', 'HIGH');

create table ld_tasks (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  title text not null,
  description text,
  status task_status not null default 'OPEN',
  priority task_priority not null default 'MEDIUM',
  due_date date,
  completed_at timestamptz,
  created_by uuid references ec_members(id),
  is_template_task bool not null default false,
  continuity_disposition text, -- 'HAND_OFF' | 'CLOSE' | 'ESCALATE' (set during handoff)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on ld_tasks(ld_number, status, due_date);
```

### Migration 3: recruiting CRM
```sql
create type pipeline_stage as enum (
  'IDENTIFIED', 'CONTACTED', 'WARM', 'COMMITTED', 'ACTIVE', 'EC_MEMBER',
  'COLD', 'PAUSED', 'NOT_INTERESTED'
);
create type contact_source as enum (
  'CANVASS', 'REFERRAL', 'EVENT', 'SOCIAL', 'WALK_IN', 'OTHER'
);
create type contact_method as enum (
  'CALL', 'TEXT', 'DOOR', 'EMAIL', 'IN_PERSON', 'EVENT', 'OTHER'
);
create type interaction_outcome as enum (
  'LEFT_VOICEMAIL', 'HAD_CONVERSATION', 'NOT_HOME', 'AGREED_TO', 'DECLINED', 'OTHER'
);

create table ld_contacts (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  home_precinct text,
  pipeline_stage pipeline_stage not null default 'IDENTIFIED',
  interest_tags text[] not null default '{}',
  source contact_source not null default 'OTHER',
  assigned_to uuid references ec_members(id),
  is_key_relationship bool not null default false,
  last_contacted_at timestamptz, -- updated by trigger on ld_interactions insert
  notes text,
  created_by uuid references ec_members(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on ld_contacts(ld_number, pipeline_stage);
create index on ld_contacts(ld_number, last_contacted_at asc nulls first);
create index on ld_contacts(ld_number, is_key_relationship) where is_key_relationship = true;

create table ld_interactions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references ld_contacts(id),
  ld_number int not null, -- denormalized for RLS
  contact_method contact_method not null,
  contacted_at timestamptz not null default now(),
  author_id uuid not null references ec_members(id),
  outcome interaction_outcome not null,
  outcome_detail text,
  new_stage pipeline_stage, -- if this interaction changed the stage
  follow_up_task_id uuid references ld_tasks(id),
  notes text,
  created_at timestamptz not null default now()
);
create index on ld_interactions(contact_id, contacted_at desc);

-- Trigger to update last_contacted_at on contact after interaction insert
create or replace function update_last_contacted()
returns trigger language plpgsql as $$
begin
  update ld_contacts
    set last_contacted_at = new.contacted_at, updated_at = now()
    where id = new.contact_id;
  -- Also update pipeline_stage if new_stage was set
  if new.new_stage is not null then
    update ld_contacts
      set pipeline_stage = new.new_stage
      where id = new.contact_id;
  end if;
  return new;
end;
$$;
create trigger trg_update_last_contacted
  after insert on ld_interactions
  for each row execute function update_last_contacted();
```

### Migration 4: continuity packages
```sql
create type package_status as enum ('DRAFT', 'SUBMITTED', 'LOCKED', 'ARCHIVED');

create table ld_continuity_packages (
  id uuid primary key default gen_random_uuid(),
  ld_number int not null references legislative_districts(number),
  cycle text not null, -- e.g. '2025-2027'
  outgoing_chair_id uuid references ec_members(id),
  status package_status not null default 'DRAFT',
  submitted_at timestamptz,
  locked_at timestamptz,
  locked_by uuid references ec_members(id),
  state_narrative text,
  resource_notes text,
  chair_note_to_successor text,
  key_contact_ids uuid[] not null default '{}',
  task_dispositions jsonb not null default '{}', -- {task_id: disposition}
  precinct_notes jsonb not null default '{}',    -- {precinct_id: {note, status}}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on ld_continuity_packages(ld_number, status);
create index on ld_continuity_packages(ld_number, locked_at desc);
```

---

## RLS Policies

All four new tables need RLS. Pattern is consistent:

```sql
-- Enable RLS
alter table ld_notes enable row level security;
alter table ld_tasks enable row level security;
alter table ld_contacts enable row level security;
alter table ld_interactions enable row level security;
alter table ld_continuity_packages enable row level security;

-- READ: any authenticated ec_member can read everything
create policy "read_all_notes" on ld_notes
  for select using (auth.uid() is not null);

-- WRITE to notes: only the LD's chair, VC, or admin
-- (Repeat this pattern for tasks, contacts, interactions)
create policy "write_ld_notes" on ld_notes
  for insert with check (
    exists (
      select 1 from ec_members
      where id = auth.uid()
        and (
          (ld_number = ld_notes.ld_number and primary_role in ('LD_CHAIR', 'LD_VC'))
          or officer_role = 'CHAIR' -- LDP Chair = admin access
        )
    )
  );

-- Continuity packages: DRAFT/SUBMITTED visible only to that LD's chair+VC+admin
-- LOCKED/ARCHIVED visible to all authenticated members
create policy "read_continuity" on ld_continuity_packages
  for select using (
    status in ('LOCKED', 'ARCHIVED')
    or exists (
      select 1 from ec_members
      where id = auth.uid()
        and (
          (ld_number = ld_continuity_packages.ld_number and primary_role in ('LD_CHAIR', 'LD_VC'))
          or officer_role = 'CHAIR'
        )
    )
  );
```

---

## Auth helper needed

Add a server-side utility to check if the current user has write access to a given LD:

```typescript
// src/lib/auth/ld-access.ts
export async function canWriteToLd(ldNumber: number): Promise<boolean> {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  
  const { data: member } = await supabase
    .from('ec_members')
    .select('ld_number, primary_role, officer_role')
    .eq('id', user.id) // match on google_oauth_email -> user.email
    .single()
  
  if (!member) return false
  
  const isAdmin = member.officer_role === 'CHAIR'
  const isLdOwner = member.ld_number === ldNumber && 
    ['LD_CHAIR', 'LD_VC'].includes(member.primary_role)
  
  return isAdmin || isLdOwner
}
```

---

## Navigation additions

### In HubShell sidebar
Add under the "people violet" group (where `/people` and `/my-ld` already live):

```
My LD  (already exists → /my-ld/[user's LD])
  └─ Recruiting  (new → /my-ld/[n]/recruiting)
  └─ Continuity  (new → /my-ld/[n]/continuity)
```

Only show the sub-items when the user is viewing their own LD or is admin.

### On `/my-ld/[n]` page
Add three new section cards (insert between "Leadership" and "Precinct Captains"):

1. **Open Tasks** — LdTasks component. Shows count badge. "+ Add task" inline.
2. **LD Notes** — LdNotes component. Shows pinned notes + 3 most recent. "See all notes" link.
3. **Recruiting alert** (conditional) — amber alert block if contacts not touched in 60+ days.

Add two new nav cards at the bottom of the page alongside the existing action buttons:
- "Prospect Pipeline →" links to `/my-ld/[n]/recruiting`
- "Continuity Package →" links to `/my-ld/[n]/continuity`

---

## Component file map (new files only)

```
src/
  app/
    my-ld/
      [number]/
        recruiting/
          page.tsx              ← pipeline table/kanban view
          [contact_id]/
            page.tsx            ← contact detail + interaction log
        continuity/
          page.tsx              ← package builder or locked view

  components/
    ld-workspace/
      LdNotes.tsx
      NoteCard.tsx
      NoteComposer.tsx
      LdTasks.tsx
      TaskRow.tsx
      TaskComposer.tsx
      NewChairTemplateBtn.tsx
      RecruitingAlert.tsx       ← 60-day warning block
      PipelineTable.tsx         ← contact list with stage column
      ContactCard.tsx           ← contact summary card for pipeline view
      ContactDetail.tsx         ← full contact view with interaction log
      InteractionLogEntry.tsx   ← single interaction in the thread
      InteractionComposer.tsx   ← log interaction form
      ContinuityPackage.tsx     ← package builder (draft state)
      ContinuityLocked.tsx      ← read-only view of locked package

  lib/
    db/
      ld-notes.ts
      ld-tasks.ts
      ld-contacts.ts
      ld-interactions.ts
      ld-continuity.ts
    auth/
      ld-access.ts
```

---

## Design guidance: match existing patterns

- Use `HubShell` on all new pages — do not use `PageMasthead` (that's being replaced by HubShell)
- Color: LD workspace features belong to the "people violet" color group (same as `/my-ld`)
- Pipeline stage pills: use color-coded chips — WARM = amber, COMMITTED = emerald, COLD = gray, NOT_INTERESTED = red/muted
- Note timestamps: use `formatDistanceToNow` from `date-fns` (already in the project)
- Task priority dots: HIGH = red-500, MEDIUM = amber-400, LOW = gray-300
- All new pages need loading states that match existing skeleton patterns in the project
- Mobile-first: task rows and note cards must be fully usable on phone (chairs use mobile)

---

## Build order recommendation

Do this in phases so each phase is shippable independently:

**Phase 1 (ship first):** LD Notes + Tasks on `/my-ld/[n]`
- DB migrations 1 and 2
- `ld-access.ts` auth helper
- `LdNotes`, `NoteCard`, `NoteComposer` components
- `LdTasks`, `TaskRow`, `TaskComposer`, `NewChairTemplateBtn` components
- Wire into existing `/my-ld/[n]` page

**Phase 2:** Recruiting CRM
- DB migration 3 (with trigger)
- `/my-ld/[n]/recruiting` page
- `/my-ld/[n]/recruiting/[contact_id]` page
- All Contact + Interaction components
- `RecruitingAlert` block on `/my-ld/[n]`
- Sidebar sub-nav items

**Phase 3:** Continuity Package
- DB migration 4
- `/my-ld/[n]/continuity` page (draft builder + locked view)
- Task disposition UI
- Package submission + admin lock workflow
- Sidebar sub-nav items

---

## Known constraints / don't break these

1. **kypolitics is read-only.** All new tables go in `ldp-ec-portal` only. Never write to kypolitics.
2. **The existing `/my-ld/[n]` page already has a lot.** The new sections (tasks, notes) should be collapsible or placed so they don't push the existing precinct playbook and ballot races off screen. Consider a sticky section nav at the top of the page as it grows.
3. **RLS is already set on existing tables.** Be careful not to accidentally break existing policies when adding new ones.
4. **The `ec_members.id` vs `auth.uid()` mapping.** Currently auth matches on `google_oauth_email`. Make sure ld-access.ts queries on email match, not on the uuid directly, unless the uuid is already the Supabase auth user id. Check existing auth patterns before assuming.
5. **Next.js App Router server components.** Fetch data in server components, pass as props. Don't add unnecessary client-side fetch waterfalls. The existing db layer pattern in `src/lib/db/` is the standard — follow it.

---

## Questions to resolve before starting

1. Is `ec_members.id` the Supabase Auth user UUID, or is there a separate auth mapping? (Affects all RLS policies and `ld-access.ts`.)
2. Does `legislative_districts` have a primary key of `number` (int), or is there a uuid PK with a `number` field? (Affects FK definitions in migrations.)
3. Is `HubShell` fully replacing `PageMasthead` on all interior pages, or do some pages still use `PageMasthead`? (Affects layout choice for new pages.)
4. What's the current behavior when a user has no `ld_number` set (At-Large members, officers)? Should they see `/my-ld` at all, or see a picker?

---
*End of spec. Questions → lisatnorkus@gmail.com or clarify in Claude Code session before building.*
