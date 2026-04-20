# CLAUDE.md — ldp-ec-portal

**This is a project-scoped context file for Claude Code working on `ldp-ec-portal`. Drop it at the root of the repo. This file governs all code and documentation inside this repository.**

---

## What this project is

The **LDP Executive Committee Portal** (`ldp-ec-portal`) is an internal web tool for the 56+ members of the Jefferson County / Louisville Democratic Party Executive Committee. Audience is EC-only: four countywide officers, 18 LD Chairs, 18 LD Vice Chairs, 18 At-Large Chairs, plus the LYD and JCDWC Presidents who hold voting seats.

It is **party infrastructure**. Distinct from the public LouisvilleDems.com website re-do that sits inside the Communications Committee's separate roadmap — treat the two as separate initiatives.

Live URL: https://ldp-ec-portal.vercel.app

### Primary jobs-to-be-done

**The portal is primarily an instructional tool.** The current LDPEC is almost entirely first-term: KDP postponed the 2024 reorg to 2025, so most members were elected in the 2025 cycle and have never been through a presidential-year reorg. They are learning their roles in real time. The portal exists to teach them what they are supposed to be doing and to keep that knowledge accessible between monthly LDPEC meetings. It is a companion to Google Drive (where documents live) and the public louisvilledems.com website (where the party talks to voters) — the portal is where LDPEC members come to learn the job.

Three user patterns, ordered by weight:

1. **First-term LDPEC members (dominant persona)** — "I just got elected, what am I supposed to be doing?" They need the Tour, role one-pagers, and the Reorg & Delegate Selection reference card. This is what v2.0 exists to serve.
2. **Seasoned LDPEC members** — "I need to move fast." Directory lookups, Drive finder, canvass tools, cross-LD coordination.
3. **Anyone between meetings** — "What's happening this month?" This Month card, proxy form, meeting Zoom.

---

## v2.0 scope (ship target: end of May 2026)

**Ship constraint**: Logan Gatti is the current LDP Chair. v2.0 must ship and be demoed to the LDP Chair during his tenure so the sitting chair blesses it as EC infrastructure before the next chair election. That blessing is what makes it durable across leadership transitions.

### Nine items IN scope

1. **Data layer on Supabase.** All LDPEC members, LDs, committees, precincts, transitions, events, and content cards live in Postgres tables. No more hand-authored HTML data.
2. **Google OAuth authentication.** Replaces the current passphrase. Users authenticate with their LDP-invited Google account. Short transition window (~2 weeks) where passphrase works as fallback, then retired.
3. **Role-aware home screen.** On login, the portal detects the user's role from their `ec_members` row and routes them to a dashboard tailored to that role.
4. **Role one-pagers.** Five cards (LD Chair, LD VC, At-Large, Precinct Captain, Committee Chair + Member packaged as one). Source content: `role_one_pagers_v2.2.md` (see `/docs`). Resolve the four open v2.2 questions during build — flagged below. This is **Tour Step 2** content.
5. **LD page with applied education layer.** Three-layer design (primer → applied → action). See detailed spec below. This is **Tour Step 3** content.
6. **Mobile-first redesign of the daily-use surfaces.** After the tour completes (or the user skips it), the daily surface is a **role-aware dashboard** plus a **six-item section nav**: Plan & Map, My LD, This Month, Canvass Tools, People, Drive. All six need to work on a phone. "This Month" and the role-aware dashboard do not exist in v1 — v2.0 is building them, not redesigning.
7. **Content corrections.** Committee count to 8 standing + 3 ad hoc. Beth's title to "Communications Chair" (not Director). Lede corrections ("Nine" → "Eight" standing committees). Hallie Rice At-Large chip clarified. Duplicate "Endorsement" standing committee removed. Full content-correction checklist in `/docs/content-fixes-v2.md`.
8. **Vercel Analytics on.** Privacy-respecting page-view tracking so v2.1 scope is evidence-based.
9. **Instructional Tour (Steps 1–6) — first-time onboarding, not daily navigation.** On first sign-in, a user is placed in Step 1 and walked through the six steps. Progress tracks per-user in Supabase. After completion — or anytime they skip ahead — the role-aware dashboard (item 3) becomes their default landing, and the section nav (item 6) becomes their daily surface. The tour stays accessible from a menu so anyone can revisit any step.
   - **Step 1 — Orientation.** DNC→KDP→LDP→629 Precincts framing, "five things every EC owes its county," $120 Club math, "what this portal is and isn't." Most content reused from v1.
   - **Step 2 — Your Role** (see item 4). Role-aware — surfaces ONLY the signed-in user's role card, with "Other roles" expander.
   - **Step 3 — Your District (or Your Committee)** (see item 5). The applied-education layer. Uses the user's own LD numbers to teach targeting (Power Base / Hold the Line / Wake the Vote / Plant the Flag). Includes the "highest-leverage move this week" box driven by a rules table (drafted pre-build, Lisa sign-off).
   - **Step 4 — How We Meet.** Cadence, Zoom, proxy, Robert's Rules basics, voting procedures (majority vs. endorsement 60% via ElectionRunner), Quarterly LD Reports (LD officers only), bylaws link with §26 drift flag.
   - **Step 5 — Current Work & Plug-In Points.** Current month card, primary canvass program, priority Metro Council districts, volunteer pipeline, next signature event, open committee slots, PC vacancies, top Drive folders. Also functions as daily-use surface.
   - **Step 6 — The 2028 Cycle & Reorg.** Timeline card, reorg flow, DNC vs SCEC track distinction, role-specific 2028 responsibility, documentation ask, 2027 governor's race context. Source content: `reorg-delegate-selection.md`. Load-bearing because the current LDPEC has zero collective experience with presidential-year reorg.

   **Tour shell behaviors:** progress indicator; persistent "Skip to dashboard" at every step; step-by-step completion state persisted in Supabase so users resume across devices; first-session completion rate is the target metric in Vercel Analytics post-launch (a Step-3 drop-off signals the applied-education layer needs restructuring).

   **Authoritative spec:** `/docs/tour-specification.md`. Do not deviate from that spec without Lisa's explicit sign-off.

### Explicitly NOT in v2.0 (deferred to v2.1+)

- Committee workspaces (per-committee pages with running agendas/minutes)
- Precinct captain recruitment workflow
- Deep integrations with VoteBuilder / Mobilize / Campaign Deputy
- Offline / PWA mode
- Admin UI for non-technical editors (v2.0 editors work directly in Supabase via the Supabase dashboard)
- Public-facing surfaces / volunteer-facing features
- SMS/notification system

Do not expand scope mid-build without the maintainer's explicit yes.

---

## Tech stack (locked)

- **Framework**: Next.js (App Router). TypeScript.
- **Hosting**: Vercel. The existing `ldp-ec-portal` Vercel project is already deployed; connect to it via `vercel link` rather than creating a new one. Connection metadata (team ID, project ID) lives in `.vercel/project.json` locally and is gitignored.
- **Database**: Supabase (Postgres). Create a dedicated project named `ldp-ec-portal` — do NOT reuse the `kypolitics` project's database even though it has related precinct data. Instead, read precinct data from `kypolitics` via a read-only service role or via nightly sync into `ldp-ec-portal`. Lock the write path to the portal's own tables.
- **Auth**: Google OAuth via Supabase Auth (native integration). Users sign in with their **personal Gmail** — the same account LDP invited them with. Restrict access by matching the signed-in email against `ec_members.google_oauth_email`. No match → render a "request access" screen pointing at `communications@louisvilledems.com`. Match → route to dashboard.
- **Explicitly deferred for v2.0**: **Google Workspace / `@louisvilledems.com` domain integration is OUT of v2.0 scope.** Beth has indicated it's possible to add the portal to the LDP domain later, but that's a v2.1+ conversation. Do NOT configure Workspace-level OAuth restrictions, domain-wide policies, or `hd=` parameter enforcement. Just allowlist by email column. When/if the portal moves to a Workspace domain later, we revisit — the OAuth code will largely survive the change; only the enforcement layer shifts.
- **Styling**: Tailwind + shadcn/ui. Keep the visual language of v1 (navy/red/white, clean typography) but modernize spacing and mobile behavior.
- **Repo**: GitHub. Create the repo under the appropriate GitHub account — if an LDP-owned GitHub org exists, use it; otherwise, create under the maintainer's personal account. Repo name: `ldp-ec-portal`. Connect to Vercel for auto-deploy on push to `main`. Use feature branches for non-trivial work.
- **Analytics**: Vercel Analytics.

---

## Data model (sketch — refine during build)

Primary tables:

```
ec_members
  id (uuid pk)
  first_name, last_name, preferred_name, suffix
  email (contact)
  google_oauth_email (auth identity — can differ from contact email)
  phone
  ld_number (nullable — officers + At-Large may be null or store home LD)
  primary_role (enum: OFFICER | LD_CHAIR | LD_VC | AT_LARGE | LYD_PRES | WOMENS_CLUB_PRES)
  officer_role (enum, nullable: CHAIR | VICE_CHAIR | SECRETARY | TREASURER)
  committee_chair_codes (array — a member can chair multiple)
  committee_member_codes (array)
  profile_photo_url
  term_start, term_end
  active (boolean)
  notes (internal, never rendered in UI)

legislative_districts
  number (pk, 28..48 where applicable)
  chair_id, vc_id (fk -> ec_members)
  precinct_count
  state_senate_overlap (array)
  metro_council_overlap (array)
  us_house_overlap (array)

committees
  code (pk, e.g. "COMMUNICATIONS")
  name
  type (enum: STANDING | AD_HOC)
  chair_id
  drive_folder_url
  description_md
  active

precincts
  id (pk)
  ld_number
  metro_council, state_senate, us_house
  strategy_tag (enum: PRIMARY | DEFEND | ACTIVATE | GROW)
  friendly_name_cached (derived: Power Base | Hold the Line | Wake the Vote | Plant the Flag)
  registered_dems, registered_reps, registered_ind
  sleeper_dems
  turnout_2024_general, turnout_2024_primary, turnout_2022_general
  notes

transitions
  id (pk)
  seat_code (e.g. "LD33_VC")
  previous_holder_name, previous_holder_id (fk nullable)
  departed_date, departure_reason
  successor_id (fk nullable)
  status (enum: VACANT | FILLED)
  elected_date

month_cards
  id (pk)
  month, year
  content_md
  published (boolean)
  created_by, updated_at

events
  id (pk)
  type (enum: CELEBRATION_OF_DEMOCRACY | WOMEN_DELIVER_DEMOCRACY | DEMS_AT_THE_DOWNS | OTHER)
  name, date, venue
  drive_folder_url
  chair_id (fk)
  tickets_url

metro_races_priority
  mc_number (pk)
  tier (enum: HIGHEST | HIGH | NOVEMBER | STANDARD)
  voter_count, sleeper_dems, independents
  strategy_summary_md
```

RLS policies: authenticated users with `ec_members` rows can READ everything. Writes restricted to a `role = 'admin'` claim (the portal maintainer, initially) until v2.1 introduces scoped editing.

---

## Content rules (what the portal renders)

### Organizational terminology — the names we use

| Public / user-facing | Formal name | Use when |
|---|---|---|
| **LDP** | Louisville Democratic Party (aka Louisville-Jefferson County Democratic Party / LJCDP / Jefferson County Democratic Party / JCDP) | Referring to the party itself. "LDP" is the brand. |
| **LDPEC** | LDP Executive Committee (aka County Executive Committee / CEC / Jefferson County Democratic Executive Committee / JCDEC) | Referring to the governing committee. This is the audience of this portal. |
| **LD** | Legislative District | Always. "LD41" not "HD41" or "District 41." |
| **PC** | Precinct Captain | Working term in JeffCo. State bylaws say "Precinct Committee member." Use PC. |
| **SCEC** | State Central Executive Committee | The KDP statewide body. |
| **KDP** | Kentucky Democratic Party | The state party. |

Use **LDP** for the party and **LDPEC** for the committee consistently in user-facing copy. Do NOT use JCDP, JCDEC, LJCDP, CEC, or bare "EC" in rendered UI strings — those are internal-bylaws terminology. Bylaws references (e.g., "per LJCDP §26") keep the formal name because they're citations.

### Strategy-tag terminology

Use the plain-English names in user-facing copy. Keep the DEFEND/ACTIVATE/PRIMARY/GROW technical tags visible but secondary.

| Strategy tag | Friendly name | One-line meaning |
|---|---|---|
| PRIMARY | **Power Base** | Democrats win by 20+ points. Keep them voting. |
| DEFEND | **Hold the Line** | Decided by under 5 points. These pick November. |
| ACTIVATE | **Wake the Vote** | Dem-leaning, many skip primaries. Wake them up. |
| GROW | **Plant the Flag** | R-leaning precincts. Find hidden Dems, build for 2028. |

Plus two targeting terms: **Sleeper Dem** (registered D who shows up November but skips primaries) and **GOTV Target** / "chase list" (D we know we need to drag to the polls).

These match the 2026 LDP Strategy Map (`https://26ldp-strategy-map.vercel.app`). Do not introduce new vocabulary.

### Committees (correct as of April 2026)

**8 standing**: Bylaws, Candidate Recruitment, Communications, Events, Facilities, Finance, Training, Volunteer.

**3 ad hoc**: Branding, Endorsement Process, Platform.

**Events subcommittees**: Celebration of Democracy Dinner (spring), Women Deliver Democracy (August), Dems at the Downs (early November, post-election).

**Known bylaw drift** (do NOT silently "fix" — flag as footnote): §26 lists Youth and Labor as standing (not running) and omits Branding, Endorsement Process, Platform (which ARE running). §26 needs an amendment; the portal should surface this as a "known bylaw issue" sidenote near committee listings, not pretend the bylaws already reflect practice.

### Name and title rules

- **Beth Thorpe** → "Communications Chair" (NEVER "Communications Director"). v1 portal contains the wrong title in multiple places. Fix everywhere.
- **Maggie Jo Hilliard** → listed as Branding Chair. Render the role but do not build out committee-page substance against her; coordination on Branding is in transition. Do not render internal reasoning about this in the UI or in code comments.
- **Jessica Haggy** → Volunteer Chair AND Jefferson County Democratic Women's Club President. Both roles should render.
- **Carolyn Benedict** → LD35 VC AND Facilities Chair. Render both.
- **Mike Ward** → Finance Chair. Render the role. Do NOT render any internal commentary about any officer's performance.
- Some EC members have formal and informal name variants (maiden names used on party documents, preferred first names, etc.). Treat as one entity in all lookups; the `ec_members` table has a single row per person with `first_name`, `preferred_name`, and `suffix` fields.

### Political content boundaries

The portal is operations infrastructure, not political analysis. Do NOT render anywhere in the UI, copy, code comments, commit messages, or documentation:

- Assessments of any EC member's reliability, alignment, competence, or performance
- Chair race dynamics, candidate support patterns, factional analysis
- Strategic intelligence about individuals or coalitions
- Personal commentary of any kind about named members
- Anyone's private contributions, donations, or political support patterns

If content that feels like political analysis starts creeping into copy during the build, stop and route the question to the maintainer out of band. **That content does not belong in this repo at all — not in code, not in comments, not in docs, not in commit messages.** The repo is party infrastructure only.

---

## Role-aware home screen

On post-login redirect:

1. Look up `ec_members` row by `google_oauth_email`.
2. If no match → render a "Request Access" card with the `communications@louisvilledems.com` contact path. Do not allow proceeding.
3. If match → route to `/dashboard` and render one of five dashboards based on `primary_role`:

| Role | Dashboard emphasis |
|---|---|
| OFFICER | Countywide operations — transitions tracker, full committee status, upcoming EC meeting agenda, finance dashboard |
| LD_CHAIR | Your LD page shortcut, this-week's-action, your Q report status, signature event ticket link, Canvass Tools |
| LD_VC | Same as LD_CHAIR but with "Is your chair active? If not, here's what you should be running" framing |
| AT_LARGE | Cross-LD view — which LDs are thin, your committee work, countywide priorities |
| COMMITTEE_CHAIR (when combined with LD or AL roles) | Your committee workspace (v2.1) stub + your LD/AL dashboard above |

Officers' dashboards also surface the $120 Club progress, signature-event countdown, and the EC attendance tracker at the top of the page.

---

## LD page: applied education layer

The single most important UX lift in v2.0. Purpose: turn the LD page from a reference sheet into a coaching experience that teaches targeting to first-term Chairs through THEIR OWN data.

### Three layers per LD page

**Layer 1 — Primer.** For each of the four friendly names, a short explainer using the Chair's own LD as the example. Example: instead of "Power Base precincts are where Dems win by 20+ points," the portal says "**LD41 has 12 Power Base precincts** — your Power Base is where your D margin is 20+ points. These precincts are your foundation. The job here isn't persuasion. The job is turnout." One paragraph per strategy type, each using their numbers. Collapsible for seasoned users. First-time visitors see it expanded by default.

**Layer 2 — Applied.** The LD broken down by strategy tag with specific precinct-level detail. For each strategy type: precinct count, voter counts, sleeper Dem counts where relevant, and the 2–3 most useful actions. Each precinct tile clickable to the Strategy Map, deep-linked to that precinct.

**Layer 3 — Action.** One box at the top labeled "Your highest-leverage move this week" that takes Layer 2 data + the current point in the cycle and recommends ONE specific thing. E.g. "You have 3 Hold the Line precincts in MC17. Cut turf for these this week — Winkler's race is decided by turnout here." Driven by a small rules table in Supabase that maps (cycle_phase × strategy_tag × LD_overlap) to a recommended play.

### Races section (within the LD page)

Organize by **canvass priority**, NOT by chamber:

1. **Contested races this cycle** — any D primary with 2+ candidates or any general-vulnerable seat. Full card treatment.
2. **Protect races** — D incumbents in R-adjacent territory. Medium treatment.
3. **Safe / unopposed (informational)** — dense one-line list, no cards.

Cut the prose intro ("Every door you knock..."). The layout makes the relationship self-evident.

---

## v2.2 one-pagers — four open questions to resolve during build

From `role_one_pagers_v2.2.md`. When you hit these, pick the pragmatic path and note the choice in a visible code comment:

1. **Tone calibration** — v2.2 dialed back aggressiveness. If any role reads too soft or hand-holdy during build, flag the line to the maintainer and default to keeping v2.2's tone.
2. **SCEC cadence accuracy** — v2.2 describes SCEC as "quarterly in Frankfort plus called meetings, more formal than CEC." If the maintainer has more detail (internal committees, reporting-back expectations), incorporate it. Until then, ship v2.2's description as-is.
3. **At-Large §4.4/§6.6 bylaws parenthetical** — keep in the one-pager as a short parenthetical. Do NOT expand it into a separate section that drags attention away from the role.
4. **Committee Chair + Member** — render as ONE page with two clearly-separated sub-sections (Chair, then Member). Easier to maintain and easier to read than two separate pages.

---

## Week-by-week plan (target ship: EC meeting, late May 2026)

Adjust as needed — this is a guide, not a contract.

- **Week 1 (Apr 20–26)**: Supabase schema creation, repo init, Next.js scaffold, OAuth wire-up, initial data migration from v1 HTML → Supabase rows. Deploy a version that is content-parity with v1 but data-driven.
- **Week 2 (Apr 27–May 3)**: Role-aware home + dashboards, role one-pagers built from v2.2.
- **Week 3 (May 4–10)**: LD page rebuild — primer layer, applied layer, action layer. Races section restructure.
- **Week 4 (May 11–17)**: Mobile-first redesign of Home, My LD, This Month, Canvass Tools. Content corrections sweep. Accessibility pass.
- **Week 5 (May 18–24)**: Logan walkthrough, feedback absorption, polish, Vercel Analytics on, final QA. Retire passphrase, OAuth-only.
- **Ship**: May EC meeting demo.

---

## Governance — who decides what

### Claude Code decides autonomously
- Component structure and file organization
- TypeScript types and schema refinements
- Styling details that stay inside the established visual language
- Bug fixes, refactors, performance improvements
- Test structure and CI setup
- Accessibility improvements
- Error-handling patterns and edge cases

### Claude Code asks the maintainer before acting
- Any change to v2.0 scope (adding or removing from the 8 items)
- Any content copy change that affects meaning (not just tone)
- Tech stack changes (e.g. swapping Tailwind for something else)
- Data model changes that affect existing rows
- Anything that touches the `kypolitics` database's write path

### Never belongs in this repo
These do not go in the code, the copy, the documentation, the commit messages, or anywhere else in version control:
- Political strategy (chair races, endorsements, candidate support patterns, coalition analysis)
- Assessments of any EC member's competence, reliability, or alignment
- Anyone's private contributions, donations, or political support
- Communications drafts (emails to individuals, outreach planning, relationship notes)
- Unrelated projects the maintainer works on outside this repo

If any of this content shows up in a work request to Claude Code, stop and kick it back to the maintainer out of band. It does not belong here.

---

## Known open decisions (not blocking v2.0 but decide before v2.1)

- **Custom domain** — stay on `ldp-ec-portal.vercel.app` or move to `ec.louisvilledems.com` (would require DNS coordination with whoever owns `louisvilledems.com`)?
- **Brand alignment** — adopt full LDP visual identity (logo + brand colors) or maintain the portal's current cleaner style?
- **Post-v2.0 maintenance ownership** — who inherits the repo if the current maintainer steps away, is there a designated successor, and what does that transition look like?
- **Precinct data sync** — nightly batch from kypolitics, real-time subscription, or manual refresh?

---

## Key file/URL references

- Live v1 portal: https://ldp-ec-portal.vercel.app
- 2026 Strategy Map: https://26ldp-strategy-map.vercel.app
- Vercel project: `ldp-ec-portal` (team and project ID resolved locally via `vercel link`; do not hardcode in repo)
- LDP public website: https://www.louisvilledems.com
- Zoom (permanent EC): https://us02web.zoom.us/j/89692618777
- Comms backend requests: `communications@louisvilledems.com`

## Source documents in repo

When this repo is initialized, create `/docs` and include:

- `tour-specification.md` — **authoritative six-step tour spec.** Lisa's spec of April 20, 2026. Any tour content decision not covered in that file escalates to Lisa, not a self-resolve.
- `role_one_pagers_v2.2.md` — Tour Step 2 detail content (five role one-pagers).
- `reorg-delegate-selection.md` — Tour Step 6 detail content (Presidential Reorg reference card). DRAFT pending Lisa's red-pen on the ⚠️ questions at the bottom.
- `tour-step-1-welcome.md` — supplemental Step 1 history paragraph (pre-2003 JCDP history). Fold into Step 1's "orientation" content when building.
- `highest-leverage-rules.md` — v1 rules table (15 rules) for the Step 3 "Your highest-leverage move this week" recommendation engine. DRAFT pending Lisa's red-pen. Do NOT build against this until Lisa signs off.
- Tour Step 3, 4, 5 content: mostly restructuring v1 content. The `tour-specification.md` enumerates what to pull from v1 and what's new.
- `content-fixes-v2.md` — enumerated content corrections from v1 → v2.0
- `comms-committee-scope.md` — Beth's April 2026 Comms Committee doc (reference only — it describes Beth's separate website re-do plans, NOT this portal)
- `source-data/v1-snapshot.html` — frozen copy of the live v1 portal at migration time, for reference. Contains embedded member directory (names, emails, phones) — treat as PII source.
- `source-data/LDP_Org_Chart_2025.xlsx` — authoritative member/role roster for Supabase seed. Contains PII — same handling as v1-snapshot.html.

---

## Operating principles for this codebase

1. **Ship working software weekly.** Even if the Monday deploy only advances one section, advance one section.
2. **Content correctness beats visual polish.** A wrong title is worse than an ugly page.
3. **Mobile is the stress test.** If it's bad on a phone at a 6pm canvass launch, it's bad.
4. **Every piece of data has one home in Supabase.** If you find yourself copying content across files, the data model is wrong — go fix the model.
5. **The EC member is the user.** Not the maintainer. Not Claude Code. Not the developer. Design for the first-term LD Chair opening this at 10pm Tuesday.
6. **Political neutrality in the codebase.** The repo is party operations infrastructure only. Strategic, factional, or personal political context stays out of version control entirely.

---

*Last updated: April 20, 2026. Maintained by the ldp-ec-portal maintainer. Questions about this file or the project's direction → the maintainer, out of band, before acting.*
