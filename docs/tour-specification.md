# Tour Specification — ldp-ec-portal v2.0

**Authoritative source for the six-step instructional tour. Lisa's spec, April 20, 2026.**

---

## Architectural call (read first)

The tour is **first-time-user onboarding, not daily navigation**. On first sign-in, a user is placed in Step 1 and walked through the six steps. Their progress tracks in Supabase. After completion — or anytime they skip ahead — the **role-aware dashboard** becomes their default landing, and the **section nav** (Plan & Map, My LD, This Month, Canvass Tools, People, Drive) becomes their daily surface. The tour stays accessible from a menu so anyone can revisit any step.

This resolves the apparent mismatch between v2.2 (references Tour Steps) and v1 (section nav): **both are in v2.0** — the tour is onboarding, the sections are working tools.

## Reuse vs new content

Most of the content in Steps 1, 3, 4, 5 already exists in v1. Step 2 is new (v2.2 role one-pagers). Step 6 is new. The rest is mostly restructuring existing content into a guided flow.

---

## Step 1 — Orientation: Why we're here and how this fits

**Purpose:** Set the frame every EC member needs before anything else. Answers "what IS this body, and what does it owe the county."

### Content

- The DNC → KDP → LDP → 629 Precincts framing (already in v1's "How we fit" section, reuse as-is)
- "Five things every Executive Committee owes its county" per the KDP guide (already in v1, reuse)
- "What KDP gives us / What we deliver / What the party achieves" three-column breakdown (already in v1, reuse)
- The $120 Club commitment — minimum personal give + minimum raise target, with math showing what the full board produces at floor (already in v1, reuse)
- Two-paragraph "what this portal is and isn't" — EC-only tool, Drive link hub, source of truth for roster and monthly work. Flag that public-facing LouisvilleDems.com is different and managed by the Comms Committee.

### Data dependencies

Static/semi-static content pulled from a `content_cards` table. $120 Club live-calculates from `ec_members` table (count × $620).

### UX

Single scroll, moderate length. Ends with "Now: let's talk about YOUR role →" → Step 2.

### Questions answered

What is this body? Why does it exist? What does every EC member owe it? What is this portal?

---

## Step 2 — Your Role

**Purpose:** Answer "what am I specifically supposed to do." The single highest-leverage step for first-term EC members.

### Content

The five role one-pagers from `role_one_pagers_v2.2.md`:

- LD Chair
- LD Vice Chair
- At-Large CEC Member
- Precinct Captain
- Committee Chair + Committee Member (one page, two sub-sections)

Each one-pager renders the four-section structure from v2.2: Who you are / What this role actually does / If you haven't been doing it, start here / Your 2028 responsibility.

### Smart default

The tour surfaces ONLY the role card matching the signed-in user's `primary_role`. An "Other roles" expander at the bottom lets them view any of the other four if curious (an At-Large might want to read the LD Chair page to understand their peers, a new LD VC should read the LD Chair page for context).

### Data dependencies

`ec_members.primary_role` of signed-in user. Role card content pulled from static MD files in `/docs/` rendered via MDX.

### UX

One card, prominent. Scan-scrollable. Ends with "Next: let's look at YOUR district →" → Step 3. For Committee Chairs who aren't also LD officers, Step 3 reframes as "Your Committee."

### Questions answered

What is MY job? What are the specific expectations? What does 2028 look like for me?

---

## Step 3 — Your District (or Your Committee, depending on role)

**Purpose:** Apply targeting framework and data to THEIR specific LD. Turn abstract concepts into concrete action.

This is the hardest step to build and the biggest lift for first-term LD Chairs. It's the applied-education layer discussed earlier — teaching targeting through their LD, not separately from it.

### Content for LD Chair / LD VC

- Their LD Chair and VC identities (names, emails, profile photos)
- Their LD stats at a glance — precinct count, overlapping Senate / Metro Council / US House districts
- **Targeting primer, applied.** Four collapsible sections, one per friendly name (Power Base, Hold the Line, Wake the Vote, Plant the Flag), using THEIR numbers. Example: "LD41 has 12 Power Base precincts — here's what that means and here's what to do about them." Open by default for first-time users; collapsed for returning.
- **Precinct breakdown** — list or grid of all precincts in their LD, each with strategy tag, voter counts, sleeper Dem count, and a deep-link to the Strategy Map
- **Races on the ballot this cycle that their LD's work moves** — THIS is where the rebuild happens. Organized by canvass priority (contested → protect → informational), not by chamber. Cut the prose intro.
- **Precinct Captain status** — how many of their 25-49 precincts have PCs, how many are dark. Flag this as the biggest organizing gap. (In v2.0 this is status-only; v2.1 adds the recruitment flow.)
- **"Your highest-leverage move this week" box** — one recommended action, computed from cycle phase × LD strategy mix

### Content for At-Large Chairs

Reframed as a countywide view. Their home LD is surfaced (so they know where they vote / who their Chair+VC are), but the primary view is the whole county — which LDs are thin, which precincts are priority countywide, where their skills plug in.

### Content for Committee Chair-only (rare — most committee chairs also hold LD or At-Large seats)

Redirects to "Your Committee" — a placeholder page for v2.0 that lists committee members, drive folder, meeting cadence. Full committee workspaces are v2.1.

### Data dependencies

Most complex step. Queries `legislative_districts`, `precincts`, `ec_members` (for LD leadership), `metro_races_priority`, and optionally reads from `kypolitics` Supabase for precinct-level turnout history.

### UX

Longer step. Break into three collapsible sub-sections — Who / Where (precincts) / What (races this cycle) — so mobile users aren't scrolling endlessly. Step ends with "Next: how we meet →" → Step 4.

### Questions answered

Where do I fit? What does my LD actually look like? What do the strategy terms mean for me specifically? What's on the ballot? What do I do this week?

---

## Step 4 — How We Meet

**Purpose:** Demystify EC meetings for newcomers. Remove the "I don't know how this works" barrier to attending and participating.

### Content

- Monthly EC meeting cadence — typically last Wed of the month (confirm with Logan / Brook)
- The permanent Zoom link (already in v1)
- Attendance expectations and how it's tracked (live count visible on board member profiles)
- Proxy form — when to use, when NOT to use (endorsement votes: no proxies allowed)
- Robert's Rules basics for newcomers — 4-5 key procedural things an EC member needs to know (motion, second, discussion, vote, amendment). Brief, not a full primer.
- Voting procedures — standard votes (majority), endorsement votes (60% threshold via ElectionRunner, secret ballot, no proxies)
- Quarterly LD Reports — what they are, template link, when they're due (for LD officers only — hide for At-Large / Committee Chairs)
- Bylaws quick reference — LJCDP bylaws link + flag that §26 has known drift from practice

### Data dependencies

Mostly static content. Live Zoom link from a settings table. Quarterly report template URL from same.

### UX

Moderate length. Role-conditional — quarterly reports only appear for LD officers. Ends with "Next: what's happening right now →" → Step 5.

### Questions answered

When do we meet? What happens in meetings? How do I vote? What if I can't make it? What am I on the hook for (reports, proxies)?

---

## Step 5 — Current Work & Plug-In Points

**Purpose:** Show the new EC member what's live right now and how to get in on it. The most time-sensitive step — contents update monthly.

### Content

- **Current month card** — what's happening this month from the Rock Star Playbook (already in v1 for the year-long roadmap; Step 5 surfaces just the current month, with the next month teed up)
- **The 2026 Primary Canvass program** — status (e.g., "27 days to primary"), your LD's progress, how to plug in, links to Canvass Guide and Volunteer Briefing
- **Priority Metro Council districts (7, 17, 21)** — voter counts, strategy notes, who's leading, coordination instructions (already in v1's Canvass Tools, move here)
- **Volunteer Pipeline** — the four-step Jessica Haggy flow (capture → send within 7 days → onboard → deploy). Already in v1, reuse.
- **Signature Events** — next event up (Celebration of Democracy Dinner if Q1, WDD if summer, Dems at the Downs if fall), ticket-sales link, individual raise progress
- **Open committee slots** — committees currently recruiting, with "ask the chair" intros
- **Open PC vacancies** in user's LD (for LD officers) or countywide (for At-Large)
- **Drive folder hubs** — three or four highest-traffic Drive folders (Canvass Guide, Volunteer Guide, Brand Kit, latest EC minutes)

### Data dependencies

Live data from `month_cards` (current month highlighted), `events` (next signature event), `metro_races_priority`, `ec_members` (PC vacancies via computed count). Cycle-aware — content shifts based on today's date.

### UX

Moderate length. This is also one of the most-revisited sections for seasoned users; needs to work well in the tour AND as a daily-use surface. Ends with "Last step: the long horizon →" → Step 6.

### Questions answered

What's happening right now? What can I plug into today? Where's the next event? What volunteer / committee slots are open?

---

## Step 6 — The 2028 Cycle & Reorg

**Purpose:** Orient the user to their long-horizon responsibility. The 2028 reorg is where every seat resets. New EC members especially don't know this is coming or what their role will be.

### Content

- **Timeline card** — key dates from 2026 through spring 2028 (primary May 2026, general Nov 2026, gubernatorial 2027, reorg spring 2028, state convention summer 2028)
- **The 2028 reorg flow** — Precinct Conventions elect new PCs, LD Conventions elect new Chairs + VCs, joint post-LD meeting elects new At-Large + officers, State Convention delegates selected
- **Delegate selection explainer** — the two tracks (DNC delegate selection vs SCEC elections) happen at state convention and are often confused. Brief, clear distinction.
- **User-specific 2028 responsibility** — pulled from v2.2 role one-pagers. An LD Chair sees "you call, advertise, and chair your LD's Precinct Conventions in spring 2028"; an At-Large sees "your seat resets — make yourself valuable enough to be re-elected"; a PC sees "you vote at your Precinct Convention"; etc.
- **Documentation ask** — "write down what you do now so the next person can pick it up." This is where succession planning gets seeded.
- **2027 context** — the KY governor's race, reorg prep, what the party is running toward

### Data dependencies

Role-conditional content pulled from `ec_members.primary_role`. Timeline is static / settings-driven. Full reference content in `reorg-delegate-selection.md`.

### UX

Longer step because it introduces concepts most EC members haven't thought about. Use a visual timeline near the top to anchor the 2026 → 2028 horizon. Step ends with "You're ready. Here's your dashboard →" → dashboard.

### Questions answered

What's the long game? What happens at reorg? What will I be responsible for in 2028? What should I be documenting now?

---

## Cross-cutting design notes

- Every tour step should end with a persistent **"Skip to dashboard"** option for users who've seen it. The tour serves first-timers; it shouldn't trap anyone.
- **First-session completion is the target metric** to watch in Vercel Analytics after launch — if people are dropping at Step 3, that's a signal to restructure it.

---

## Outstanding (needed before build)

- **Step 3 "highest-leverage move this week" rules table.** Given (current cycle phase, LD precinct strategy mix, overlap with priority MC districts), what's the one recommended action? For v2.0, start small — a dozen rules covering the primary window (April–May 2026), the summer engagement window (June–August), and general canvass (September–November). Lisa signs off before build. Draft in-chat, then land as `highest-leverage-rules.md`.
