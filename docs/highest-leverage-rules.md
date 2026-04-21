# Highest-Leverage Move This Week — Rules Table (v1)

**Drives:** Tour Step 3 "Your highest-leverage move this week" box (per `tour-specification.md`).
**Status:** v1 — Lisa's red-pen applied April 21, 2026. Tone softened throughout (LDPEC is a volunteer + political org; recommendations are supportive, not calling out). Claude Code can build against this.
**Filed to repo:** April 20, 2026. Red-penned April 21, 2026.

---

## How this works

Every time a user loads their Step 3 / My LD / dashboard view, the portal:

1. Determines the **current cycle phase** from today's date.
2. Reads the user's `primary_role` and, if applicable, their LD's attributes (precinct strategy mix, PC vacancies, priority MC overlap).
3. Evaluates the rules table in priority order (lowest `priority` integer first).
4. Returns the FIRST matching rule's recommendation, with variables filled in from the user's LD data.

Only one recommendation shows at a time. If no rules match (shouldn't happen if rules cover all windows × all roles), the box hides silently.

---

## Cycle phases (2026)

Updated per red-pen: ELECTION_WEEK now spans early voting + election day for BOTH primary and general. Kentucky allows 3-day no-excuse early voting (Thu/Fri/Sat before Election Day). Portal treats the whole Thu→Tue window as "lockdown" mode.

| Phase | Start | End | Key event |
|---|---|---|---|
| **PRIMARY** | today (2026-04-21) | 2026-05-13 | Primary campaign window |
| **PRIMARY_LOCKDOWN** | 2026-05-14 | 2026-05-19 | Early voting + Primary Day (overrides PRIMARY) |
| **POST_PRIMARY** | 2026-05-20 | 2026-06-30 | Recovery, committee joins, debrief |
| **SUMMER** | 2026-07-01 | 2026-08-31 | Engagement, recruiting, WDD event (August) |
| **GENERAL** | 2026-09-01 | 2026-10-28 | General-election canvass |
| **GENERAL_LOCKDOWN** | 2026-10-29 | 2026-11-03 | Early voting + Election Day (overrides GENERAL) |
| **POST_GENERAL** | 2026-11-04 | 2026-12-31 | DatD event, wind-down, 2027 prep |

Phases after 2026-12-31 out of v1 scope — add in v1.1 once 2027 governor's race dates set.

**Note on early voting:** KY early voting runs the Thursday, Friday, and Saturday before Election Day (no-excuse in-person). LOCKDOWN phases start Thursday to match the actual voter-contact intensity window, not just election day itself.

---

## Data inputs per user

Pulled from `ec_members`, `legislative_districts`, `precincts`, `metro_races_priority`:

- `role` — OFFICER / LD_CHAIR / LD_VC / AT_LARGE / LYD_PRES / WOMENS_CLUB_PRES / PRECINCT_CAPTAIN / COMMITTEE_CHAIR_ONLY
- `ld.number` — user's LD (for LD officers); nullable for At-Large (home LD is informational only)
- `ld.hold_the_line_count` — precincts with D-margin < 5pt
- `ld.power_base_count` — precincts with D+20+
- `ld.wake_the_vote_count` — Dem-leaning, primary-skipping
- `ld.plant_the_flag_count` — R-leaning
- `ld.pc_vacancy_count` — precincts with no active Precinct Captain
- `ld.priority_mc_overlap` — set of {7, 17, 21} or empty; derived from `metro_council_overlap`
- `ld.sleeper_dem_count` — sum across LD
- `ld.has_contested_primary` — boolean; true if any D primary in the LD's HD/SD/MC races has 2+ candidates
- `event.next_signature_event` — nearest upcoming event (COD / WDD / DatD)
- `user.raise_progress_dollars` — current $500 annual raise progress in dollars (sum of tickets sold via personalized links)

**Note on the $120 Club math:** Red-pen clarified — it's **$120/year personal give** ($10/month auto-pay) PLUS **$500/year raised** for the party. The $500 raise is driven primarily by **personalized ticket-sale links** that go out 30 days before each signature event (COD Dinner, WDD, Dems at the Downs). Ticket sales through your link count toward your $500.

---

## The rules

Rules ordered by `priority` (1 = highest). First match wins.

**Tone rule (applies to all):** LDPEC is a volunteer org and a political org. Recommendations are framed as opportunities and supportive nudges, not obligations or call-outs. "A shift or two this week would help" instead of "you have to cut turf." The audience is mostly first-term members doing this on top of day jobs.

---

### Rule 1 — Election week (primary or general)

**Priority:** 1
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY_LOCKDOWN, GENERAL_LOCKDOWN
**Condition:** always matches during these phases

**Template:** "Election week — early voting is open through {end_date}, and Election Day is {election_day}. The most important thing you can do is show up: doors, phones, rides to the polls, anything. Your {ld_number} overlaps some real turf this cycle. After Tuesday, rest."

---

### Rule 2 — Hold-the-Line in priority MC, primary window

**Priority:** 10
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.hold_the_line_count >= 1 AND ld.priority_mc_overlap != {}`

**Template:** "Your LD overlaps MC{priority_mc_list}, one of the three priority districts countywide. The {hold_the_line_count} Hold the Line precincts there are where turnout decides the primary winner — any time you can give to doors in those precincts before May 19 would make a real difference."

**Why:** MC 7, 17, 21 are the countywide battlegrounds. LDs overlapping those districts are doing countywide work, not just LD work. Frame as opportunity, not obligation.

---

### Rule 3 — Contested primary in LD, primary window

**Priority:** 15
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.has_contested_primary = true`

**Template:** "A contested Democratic primary is on your LD's ballot. Primaries are decided by turnout, not persuasion — the voters who already lean Democratic but don't always show up in May. Your {power_base_count} Power Base precincts are where those voters live. A door shift there this week would help."

**Why:** Contested primaries reward the candidate whose people show up. Turnout in D-strong precincts IS the primary.

---

### Rule 4 — Hold-the-Line PC vacancies, primary window

**Priority:** 20
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.hold_the_line_count >= 1 AND ld.pc_vacancy_count_in_hold_the_line >= 1`

**Template:** "You have {hold_the_line_vacancy_count} Hold the Line precinct{plural} in LD{ld_number} without an active Precinct Captain. Those are battleground precincts — filling even one this week would be a real win, and the person you find doesn't have to be perfect to start."

**Why:** Dark battleground precincts are the single most expensive organizing failure. Soften "start even if imperfect" — these are volunteers.

---

### Rule 5 — No contested primary, primary window

**Priority:** 30
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.has_contested_primary = false`

**Template:** "No contested Democratic primary in your LD this cycle — which is actually a gift. You can start November work early. Any Power Base voter you help mobilize in May is already a November voter."

**Why:** "Nothing to do" during primary is the wrong frame. Uncontested LDs get to start GOTV early.

---

### Rule 6 — Post-primary committee recruitment

**Priority:** 40
**Role:** LD_CHAIR, LD_VC
**Phase:** POST_PRIMARY
**Condition:** always matches

**Template:** "Primary's done. The next six weeks are a great window to plug into one standing committee if you haven't already. Committees run year-round and this is when people are most available to join and actually contribute."

**Why:** Post-primary is the highest-leverage moment for committee engagement — before people go dark for summer.

---

### Rule 7 — Summer PC recruiting push

**Priority:** 50
**Role:** LD_CHAIR, LD_VC
**Phase:** SUMMER
**Condition:** `ld.pc_vacancy_count >= 1`

**Template:** "{pc_vacancy_count} precincts in LD{ld_number} are currently dark. Summer is a good season to identify Precinct Captain candidates for the 2028 Precinct Conventions — a conversation or two now can plant the seed."

**Why:** 2028 Precinct Conventions need candidates; recruitment doesn't happen in four weeks. Softened from "waiting until winter is too late."

---

### ~~Rule 8 — Summer LD meeting gap~~ **DELETED (April 21 red-pen)**

LDPEC meets monthly in practice, so an LD-meeting-gap alert doesn't apply the way the rule was drafted. Removed.

---

### Rule 9 — Approaching signature event → your ticket link

**Priority:** 60
**Role:** LD_CHAIR, LD_VC, AT_LARGE, OFFICER
**Phase:** any
**Condition:** `event.next_signature_event within 30 days`

**Template:** "{event_name} is in {days_until} days. Your personalized ticket link went out (or goes out soon) — every ticket sold through your link counts toward your $500 annual raise. Current raise progress: {raise_progress_dollars} of $500. Pushing the link to one new person this week is how the event lands."

**Why:** Red-pen clarified the mechanism. $120 Club = $120 personal give + $500 raised. The $500 raise is driven by ticket sales through personalized links that go out 30 days before each event. This rule is the operational prompt for that window.

**Variable note:** `raise_progress_dollars` sourced from ticket-sale-link tracking (future integration; stubbed at `$0 of $500` until that data flows in).

---

### Rule 10 — Hold-the-Line during general

**Priority:** 70
**Role:** LD_CHAIR, LD_VC
**Phase:** GENERAL
**Condition:** `ld.hold_the_line_count >= 1`

**Template:** "General cycle. Your {hold_the_line_count} Hold the Line precincts are where the margin lives. Every sleeper Dem who shows up matters. Any turf you can cut — once a week, whatever fits — makes a real difference through November 3."

**Why:** Battleground precincts in general election = the reason anything else matters. Softened "no rest until November 3" into "whatever fits."

---

### Rule 11 — Wake-the-Vote activation, general

**Priority:** 75
**Role:** LD_CHAIR, LD_VC
**Phase:** GENERAL
**Condition:** `ld.wake_the_vote_count >= 1 AND ld.hold_the_line_count = 0`

**Template:** "You have {wake_the_vote_count} Wake the Vote precinct{plural} — Dem-leaning voters who skip anything but presidential years. The final 30 days is when they need a door. Even one shift there would help."

**Why:** Red-pen lowered threshold from 3 to 1 — even a single Wake-the-Vote precinct is worth a recommendation for LDs without Hold the Line stakes.

---

### Rule 12 — At-Large countywide thin-LD flag

**Priority:** 80
**Role:** AT_LARGE
**Phase:** any
**Condition:** `countywide.dark_precinct_count >= 20`

**Template:** "You serve the county, not one LD. {dark_precinct_count} precincts countywide are currently without an active Precinct Captain. Picking three LDs with the most vacancies and asking those Chairs what you can take on is exactly what At-Large is for."

**Why:** At-Large exists to fill gaps LDs can't. Makes the role's purpose explicit. Threshold 20 kept (red-pen confirmed).

---

### Rule 13 — At-Large priority MC focus

**Priority:** 85
**Role:** AT_LARGE
**Phase:** PRIMARY, GENERAL
**Condition:** always matches

**Template:** "MC{priority_mc_list} are the three priority districts that decide November countywide. Picking one this week — doors, phones, or coordination with the LD Chairs whose LDs overlap — is high-impact At-Large work."

**Why:** Priority MC races benefit enormously from countywide muscle beyond any one LD's capacity.

---

### Rule 14 — Precinct Captain weekly nudge

**Priority:** 100
**Role:** PRECINCT_CAPTAIN
**Phase:** any
**Condition:** always matches

**Template:** "Your precinct is {precinct_id}, strategy: {strategy_friendly}. This week: {phase_specific_pc_action}. PCs are the field — your work is what turns numbers into voters."

**Variables:**
- `phase_specific_pc_action` lookup:
  - PRIMARY, PRIMARY_LOCKDOWN: "pull your precinct's Dem-strong list and make ten calls — even quick introductions count"
  - POST_PRIMARY: "debrief briefly with your LD Chair about what worked and what didn't"
  - SUMMER: "find one person in your precinct who'd be open to volunteering in the fall"
  - GENERAL, GENERAL_LOCKDOWN: "cover one block on any canvass shift that fits your schedule"
  - POST_GENERAL: "thank the volunteers who showed up in your precinct — a text is enough"

**Why:** PC-role users should get something concrete every visit. Cycle-aware, role-specific. Softened each phase action.

---

### ~~Rule 15 — Committee Chair reminders~~ **DEFERRED (red-pen)**

Placeholder acknowledged. Committee-chair-specific rules will be added after the new LDPEC Chair transition at end of June 2026. Until then, committee chairs who are also LD officers get Rules 1–11 based on their LD role. Standalone committee chairs fall through to Rule 16.

---

### Rule 16 — Default fallback

**Priority:** 999
**Role:** all
**Phase:** all
**Condition:** always matches (safety net)

**Template:** "Stay active. The next LDPEC meeting is a great place to start. Pick one thing from Current Work (Tour Step 5) and plug in."

**Why:** If no other rule matches, degrade gracefully.

---

## Conflict resolution

- **Lowest priority integer wins.** Tied priorities: first matching rule in listed order.
- **Cycle-phase overrides take precedence.** PRIMARY_LOCKDOWN and GENERAL_LOCKDOWN (Rule 1) always beat any PRIMARY or GENERAL rule.
- **Role filter is strict.** An LD_CHAIR rule does not match an AT_LARGE user even if all other conditions are met — separate rules are needed.
- **Never render two recommendations.** If two rules would match at identical priority, fall through by listed order. No combination / merging.

---

## Variable reference

| Variable | Source | Example |
|---|---|---|
| `{ld_number}` | `ec_members.ld_number` | "41" |
| `{hold_the_line_count}` | `ld.hold_the_line_count` | "3" |
| `{power_base_count}` | `ld.power_base_count` | "12" |
| `{wake_the_vote_count}` | `ld.wake_the_vote_count` | "7" |
| `{pc_vacancy_count}` | `ld.pc_vacancy_count` | "4" |
| `{hold_the_line_vacancy_count}` | computed | "2" |
| `{priority_mc_list}` | `ld.priority_mc_overlap` joined | "7 and 17" |
| `{event_name}` | `event.next_signature_event.name` | "Women Deliver Democracy" |
| `{days_until}` | computed | "21" |
| `{end_date}` | `primary_lockdown_end` or `general_lockdown_end` setting | "May 19" |
| `{election_day}` | `primary_date_2026` or `general_date_2026` setting | "May 19, 2026" |
| `{raise_progress_dollars}` | `user.raise_progress_dollars` (from ticket-link sales, future integration) | "$140" |
| `{dark_precinct_count}` | countywide count | "27" |
| `{precinct_id}` | `ec_members.precinct_id` (PC role) | "LL01" |
| `{strategy_friendly}` | friendly name of precinct strategy | "Power Base" |
| `{phase_specific_pc_action}` | lookup (see Rule 14) | — |
| `{plural}` | "s" if count > 1 else "" | — |

---

## Red-pen resolutions (April 21, 2026)

| Question | Answer |
|---|---|
| Primary / general dates correct? | Yes — May 19 primary, Nov 3 general. |
| ELECTION_WEEK window | Expanded to include early-voting. PRIMARY_LOCKDOWN = May 14–19; GENERAL_LOCKDOWN = Oct 29–Nov 3. |
| Priority MCs | Just 7 / 17 / 21 — party agreement. |
| LD meeting-gap threshold (Rule 8) | Rule deleted. LDPEC meets monthly; the gap alert doesn't apply. |
| Event lookahead (Rule 9) | Kept 30 days, AND reframed: $120 Club = $120 personal give + $500 raised; $500 raise is driven by personalized ticket-sale links that go out 30 days before each signature event. Template now says "your ticket link went out — push it." |
| Wake-the-Vote threshold (Rule 11) | Lowered from 3 to 1. Any Wake-the-Vote precinct is worth surfacing. |
| Dark-precinct countywide threshold (Rule 12) | Kept at 20. |
| Missing rules (committee chairs) | Deferred to post-June chair transition. Lisa will add. |
| Tone | Softened throughout. LDPEC is a volunteer + political org — recommendations are supportive opportunities, not obligations or call-outs. |
| Recommendation length | 2–3 sentences OK, kept. |

---

## What's NOT in v1

Deferred to v1.1+:

- Committee Chair-specific rules (post-June chair transition)
- 2027 governor's race rules (need date anchors before coding)
- 2028 reorg-prep rules (separate rule set, higher political stakes, needs dedicated draft)
- Member-activity-based rules (e.g., "you've missed 2 meetings — come to the next one") — requires attendance tracking sync
- Role-transition rules (e.g., "your LD Chair is inactive — you should step up" for LD VCs)
- Ticket-link sales data flow — stubbed at `$0 of $500` until the $500-raise tracker is wired in
