# Highest-Leverage Move This Week — Rules Table (v1)

**Drives:** Tour Step 3 "Your highest-leverage move this week" box (per `tour-specification.md`).
**Status:** DRAFT v1 for Lisa's red-pen. Claude Code does NOT build against this until Lisa signs off.
**Filed to repo:** April 20, 2026.

---

## How this works

Every time a user loads their Step 3 / My LD / dashboard view, the portal:

1. Determines the **current cycle phase** from today's date.
2. Reads the user's `primary_role` and, if applicable, their LD's attributes (precinct strategy mix, PC vacancies, priority MC overlap).
3. Evaluates the rules table in priority order (lowest `priority` integer first).
4. Returns the FIRST matching rule's recommendation, with variables filled in from the user's LD data.

Only one recommendation shows at a time. If no rules match (shouldn't happen if rules cover all windows × all roles), the box hides silently.

---

## Cycle phases (2026, v1)

| Phase | Start | End | Key event |
|---|---|---|---|
| **PRIMARY** | today (2026-04-20) | 2026-05-19 | Primary Election Day |
| **POST_PRIMARY** | 2026-05-20 | 2026-06-30 | Recovery, committee joins, debrief |
| **SUMMER** | 2026-07-01 | 2026-08-31 | Engagement, recruiting, WDD event (August) |
| **GENERAL** | 2026-09-01 | 2026-11-02 | General-election canvass |
| **ELECTION_WEEK** | 2026-10-26 | 2026-11-03 | Final GOTV (overrides GENERAL) |
| **POST_GENERAL** | 2026-11-04 | 2026-12-31 | DatD event, wind-down, 2027 prep |

Phases after 2026-12-31 out of v1 scope — add in v1.1 once 2027 governor's race dates set.

---

## Data inputs per user

Pulled from `ec_members`, `legislative_districts`, `precincts`, `metro_races_priority`:

- `role` — OFFICER / LD_CHAIR / LD_VC / AT_LARGE / LYD_PRES / WOMENS_CLUB_PRES
- `ld.number` — user's LD (for LD officers); nullable for At-Large (their home LD is informational only)
- `ld.hold_the_line_count` — precincts with D-margin < 5pt
- `ld.power_base_count` — precincts with D+20+
- `ld.wake_the_vote_count` — Dem-leaning, primary-skipping
- `ld.plant_the_flag_count` — R-leaning
- `ld.pc_vacancy_count` — precincts with no active Precinct Captain
- `ld.priority_mc_overlap` — set of {7, 17, 21} or empty; derived from `metro_council_overlap`
- `ld.sleeper_dem_count` — sum across LD
- `ld.has_contested_primary` — boolean; true if any D primary in the LD's HD/SD/MC races has 2+ candidates
- `ld.last_meeting_date` — most recent LD meeting on record
- `event.next_signature_event` — nearest upcoming event (COD / WDD / DatD)
- `user.raise_progress` — current $120 Club raise progress as percentage

---

## The rules

Rules ordered by `priority` (1 = highest). First match wins.

### Rule 1 — Election week GOTV lockdown (all LD roles)

**Priority:** 1
**Role:** LD_CHAIR, LD_VC
**Phase:** ELECTION_WEEK
**Condition:** always matches

**Template:** "Election week. Final GOTV in LD{ld_number}. No new recruitment, no new anything — execution only. Every door, every call, every ride. After Tuesday you rest."

---

### Rule 2 — Hold-the-Line in priority MC, primary window (LD Chair/VC)

**Priority:** 10
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.hold_the_line_count >= 1 AND ld.priority_mc_overlap != {}`

**Template:** "You have {hold_the_line_count} Hold the Line precincts overlapping MC{priority_mc_list}. The primary winner here decides November. Cut turf for these before primary day — this is the highest-stakes turf in your LD."

**Why:** MC 7, 17, 21 are the countywide battlegrounds. LDs overlapping those districts are doing countywide work, not just LD work.

---

### Rule 3 — Contested primary in LD, primary window (LD Chair/VC)

**Priority:** 15
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.has_contested_primary = true`

**Template:** "A contested Democratic primary is on your LD's ballot. Primaries turn on Power Base turnout, not persuasion. Your move this week is a door shift in your {power_base_count} Power Base precincts — pull the people who always vote Democratic in November but skip May."

**Why:** Contested primaries reward the candidate whose people show up. Turnout in D-strong precincts IS the primary.

---

### Rule 4 — Hold-the-Line PC vacancies, primary window (LD Chair/VC)

**Priority:** 20
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.hold_the_line_count >= 1 AND ld.pc_vacancy_count_in_hold_the_line >= 1`

**Template:** "You have {hold_the_line_vacancy_count} Hold the Line precinct{plural} in LD{ld_number} with no active Precinct Captain. Fill those seats this week. A battleground precinct with no organizer is a seat we lose in November before we start."

**Why:** Dark battleground precincts are the single most expensive organizing failure. Fill them even if the person is imperfect.

---

### Rule 5 — No contested primary, primary window (LD Chair/VC)

**Priority:** 30
**Role:** LD_CHAIR, LD_VC
**Phase:** PRIMARY
**Condition:** `ld.has_contested_primary = false`

**Template:** "No contested Democratic primary in your LD this cycle — you get a head start. Use the primary window to shore up Power Base turnout for November. Every May voter you mobilize now is already a November voter."

**Why:** "Nothing to do" during primary is the wrong frame. Uncontested LDs get to start GOTV early.

---

### Rule 6 — Post-primary committee recruitment (LD Chair/VC)

**Priority:** 40
**Role:** LD_CHAIR, LD_VC
**Phase:** POST_PRIMARY
**Condition:** always matches

**Template:** "Primary's done. Use the next six weeks to plug into one standing committee. Committees run year-round and this is the window to join and actually contribute — the July slump is real, and a committee that loses members in June doesn't recover."

**Why:** Post-primary is the highest-leverage moment for committee engagement — before people go dark for summer.

---

### Rule 7 — Summer PC recruiting push (LD Chair/VC)

**Priority:** 50
**Role:** LD_CHAIR, LD_VC
**Phase:** SUMMER
**Condition:** `ld.pc_vacancy_count >= 1`

**Template:** "{pc_vacancy_count} precincts in LD{ld_number} are dark. Summer is recruiting season — identify Precinct Captain candidates NOW for Precinct Convention in spring 2028. Waiting until winter 2027 is too late."

**Why:** 2028 Precinct Conventions need candidates; recruitment doesn't happen in four weeks. Summer 2026 is the first real recruitment window.

---

### Rule 8 — Summer LD meeting gap (LD Chair/VC)

**Priority:** 55
**Role:** LD_CHAIR, LD_VC
**Phase:** SUMMER
**Condition:** `ld.last_meeting_date older than 60 days`

**Template:** "Your LD hasn't met in over two months. LDs that don't meet don't organize. Put any date on the calendar — 30 minutes, any format. The next event or canvass will find you whether you're ready or not."

**Why:** Inertia kills LD activity. The fix is low-stakes — just a meeting on a calendar.

---

### Rule 9 — Approaching signature event (LD Chair/VC + At-Large)

**Priority:** 60
**Role:** LD_CHAIR, LD_VC, AT_LARGE
**Phase:** SUMMER, POST_GENERAL
**Condition:** `event.next_signature_event within 30 days`

**Template:** "{event_name} is in {days_until} days. Your $120 Club raise progress: {raise_progress}. Pull one commitment this week — that's how this event lands."

**Why:** Signature events live or die on the 30-day ramp. Individual raise progress is the most concrete ask for each board member.

---

### Rule 10 — Hold-the-Line during general (LD Chair/VC)

**Priority:** 70
**Role:** LD_CHAIR, LD_VC
**Phase:** GENERAL
**Condition:** `ld.hold_the_line_count >= 1`

**Template:** "General cycle. Your {hold_the_line_count} Hold the Line precincts are the entire game. Every Sleeper Dem you turn out is the margin. Cut turf weekly — no rest until November 3."

**Why:** Battleground precincts in general election = the reason anything else matters.

---

### Rule 11 — Wake-the-Vote activation, general (LD Chair/VC)

**Priority:** 75
**Role:** LD_CHAIR, LD_VC
**Phase:** GENERAL
**Condition:** `ld.wake_the_vote_count >= 3 AND ld.hold_the_line_count = 0`

**Template:** "You have {wake_the_vote_count} Wake the Vote precincts — Dem-leaning, but most voters there skip everything but presidential years. Canvass them in the final 30 days. These are people who want to vote Democratic but need the door."

**Why:** Activate LDs (no close races, but lots of low-propensity Dems) have a different job than Defend LDs — wake the sleeping voters.

---

### Rule 12 — At-Large countywide thin-LD flag

**Priority:** 80
**Role:** AT_LARGE
**Phase:** PRIMARY, POST_PRIMARY, SUMMER, GENERAL
**Condition:** `countywide.dark_precinct_count >= 20`

**Template:** "You serve the county, not one LD. There are {dark_precinct_count} dark precincts countywide right now. Pick three LDs with the most vacancies and ask the Chairs what you can take on — that's what At-Large is for."

**Why:** At-Large exists to fill the gaps LDs can't. Making that explicit keeps the role from defaulting to "LD adjacent."

---

### Rule 13 — At-Large priority MC focus

**Priority:** 85
**Role:** AT_LARGE
**Phase:** PRIMARY, GENERAL
**Condition:** `always matches AND priority_mc_list != {}`

**Template:** "MC{priority_mc_list} decide November countywide. Pick one of the three and spend this week on its turf — doors, phones, or coordination with the LD Chairs whose LDs overlap. At-Large muscle matters most where turnout is the margin."

**Why:** Priority MC races benefit enormously from countywide muscle beyond any one LD's capacity.

---

### Rule 14 — Precinct Captain weekly nudge

**Priority:** 100
**Role:** PC *(precinct captain — add to `primary_role` enum if not present)*
**Phase:** PRIMARY, SUMMER, GENERAL
**Condition:** always matches

**Template:** "Your precinct is precinct {precinct_id}, strategy: {strategy_friendly}. This week: {phase_specific_pc_action}. Don't wait to be asked — PCs are the field."

**Variables:**
- `phase_specific_pc_action` lookup:
  - PRIMARY: "pull your precinct's Dem-strong list and make ten calls"
  - SUMMER: "identify one volunteer in your precinct willing to canvass"
  - GENERAL: "canvass one block in your precinct, any shift, any week"

**Why:** PC-role users should get something concrete every visit. Cycle-generic, role-specific.

---

### Rule 15 — Default fallback (should never match)

**Priority:** 999
**Role:** all
**Phase:** all
**Condition:** always matches (safety net)

**Template:** "Stay active. Go to the next LDPEC meeting. Pick one thing from Step 5 (Current Work) and plug in."

**Why:** If no other rule matches, degrade gracefully. Shouldn't ever trigger in practice.

---

## Conflict resolution

- **Lowest priority integer wins.** Tied priorities: first matching rule in listed order.
- **Cycle-phase overrides take precedence.** ELECTION_WEEK (rule 1) always beats GENERAL rules.
- **Role filter is strict.** A LD_CHAIR rule does not match an AT_LARGE user even if all other conditions are met — separate rules are needed.
- **Never render two recommendations.** If two rules would match at identical priority, fall through by listed order. No combination / merging.

---

## Variable reference (for template interpolation)

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
| `{raise_progress}` | `user.raise_progress` percentage | "$240 of $500" |
| `{dark_precinct_count}` | countywide count | "27" |
| `{precinct_id}` | `ec_members.precinct_id` (PC role) | "LL01" |
| `{strategy_friendly}` | friendly name of precinct strategy | "Power Base" |
| `{phase_specific_pc_action}` | lookup table above | — |
| `{plural}` | "s" if count > 1 else "" | — |

---

## Open questions for Lisa's red-pen

1. **Is the cycle-phase calendar correct?** Primary is May 19, 2026 — confirm. General is November 3, 2026 — confirm.
2. **Is the ELECTION_WEEK window right (2026-10-26 through 2026-11-03)?** Or should it start earlier (early voting starts earlier in KY)?
3. **Priority MC districts — is it just 7, 17, 21?** Or should 9, 11 also be on the list? Rules 2 and 13 depend on this.
4. **Rule 8 "LD meeting gap" threshold — 60 days right?** Or 90? Or should it be "last meeting was before [specific date]"?
5. **Rule 9 signature event lookahead — 30 days right?** Or earlier (45? 60?)? Ramps on events are usually longer.
6. **Rule 11 Wake-the-Vote threshold — 3 precincts right?** Arbitrary starting point.
7. **Rule 12 countywide dark-precinct threshold — 20?** Depends on how dark JeffCo actually is right now.
8. **Any rules missing?** Specifically: Committee Chair recommendations. The tour spec says committee-chair-only users get a placeholder page for v2.0, but do committee chairs who are also LD officers deserve a committee-oriented rule (e.g., "schedule committee meeting this month")?
9. **Tone — right?** These lean direct and a bit pointed. Keep, or soften?
10. **Recommendation length — acceptable?** Most are 2–3 sentences. Should they be tighter (one sentence) or is this right?

---

## What's NOT in v1

Deferred to v1.1+:

- 2027 governor's race rules (need date anchors before coding)
- 2028 reorg-prep rules (separate rule set, higher political stakes, needs dedicated draft)
- Member-activity-based rules (e.g., "you've missed 2 meetings — come to the next one") — requires attendance tracking sync
- Fundraising-specific rules (e.g., "you haven't raised any $120 Club money yet — ask 5 people this week")
- Role-transition rules (e.g., "your LD Chair is inactive — you should step up" for LD VCs)
