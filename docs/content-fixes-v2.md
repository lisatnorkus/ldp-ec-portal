# Content fixes: v1 → v2.0

Enumerated corrections from the v1 portal (`docs/v1-snapshot.html`) that must land in v2.0. All line numbers reference `docs/v1-snapshot.html` at snapshot time (April 20, 2026). Lines will drift during migration — use these as starting anchors, then search by content, not by line.

Each fix below follows the same shape:
- **Issue** — what the v1 copy says
- **Fix** — what v2.0 should render
- **Where** — concrete locations
- **Why** — the source of truth backing the fix

Organized highest-stakes first.

---

## 1. Beth Thorpe's title: "Director" → "Chair"

**Issue:** v1 labels Beth Thorpe as "Communications **Director**" in multiple places. She is the **Communications Chair** of a standing committee, not a director on party staff.

**Fix:** Replace every user-facing instance of "Communications Director" with "Communications Chair." Update the source data so derived pages (committee listings, member directory, role chips) all render consistently.

**Where:**
- Line 2423 — section lede: `<strong>Beth Thorpe (Communications Director)</strong>`
- Line 3685 — committee data object: `chairTitle: "Communications Director"`
- Line 2024 — masthead-social-label describes Beth's section; verify the anchor copy doesn't also use "Director" anywhere in the live DOM (the grep only hit "Beth Thorpe" there, not "Director" — confirm during migration)
- Any places the `chairTitle` string from line 3685 is rendered downstream — those will auto-fix once the data field is corrected

**Why:** Beth is an elected chair of a standing committee (Communications). "Director" implies a staff role the LDP does not have. This is the single highest-priority content fix — Beth has explicitly flagged it.

---

## 2. Committee count: "Nine standing" → "Eight standing"

**Issue:** v1's committee section lede reads "Nine standing committees plus three ad-hoc (Branding, Endorsement Process, Platform)."

**Fix:** "**Eight** standing committees plus three ad-hoc (Branding, Endorsement Process, Platform)."

**Where:**
- Line 2413 — section-lede paragraph on the Committees section
- Any summary cards, dashboards, or nav items that reference a committee count
- Any prose descriptions of "the eight standing committees" or "the eleven LDP committees" should be consistent

**Why:** The 8 standing committees (per April 2026 practice) are:
Bylaws, Candidate Recruitment, Communications, Events, Facilities, Finance, Training, Volunteer.
The 3 ad hoc are: Branding, Endorsement Process, Platform.
Total running: **11.** See CLAUDE.md § Committees for the canonical list.

---

## 3. §26 bylaws drift — surface as footnote, do not silently "fix"

**Issue:** LJCDP bylaws §26 lists **Youth** and **Labor** as standing committees, and omits **Branding, Endorsement Process, Platform** (which ARE running in 2026 practice). v1 does not surface this drift at all.

**Fix:** Near any canonical committee listing (committee directory, committee chair roster), render a small "known bylaw issue" sidenote explaining that §26 is out of date and needs amendment. Do NOT silently render §26's list over the real list, and do NOT rewrite §26 to match practice in-portal.

**Where:**
- Committees section (around line 2413 in v1 — in v2.0, wherever the committee directory renders)
- Bylaws reference panels, if any

**Why:** The portal is an operations tool, not a bylaws arbiter. Showing practice without flagging the drift would mislead EC members about what the bylaws actually say. Flagging it helps the Bylaws Committee prioritize the amendment.

---

## 4. Maggie Jo Hilliard (Branding Chair) — placeholder treatment

**Issue:** v1 treats Maggie Jo Hilliard as the Branding Committee chair with normal prominence.

**Fix:** Render her in the committee listing (she is technically the current chair), but do NOT route Branding strategy, Branding committee pages, or Branding deliverables through her. Beth is identifying a replacement. Minimal prominence.

**Where:**
- Line 3814 — Branding committee object: `chair: "Maggie Jo Hilliard"`
- Line 3904 — contact email: `"Maggie Jo Hilliard":"mjh@maggiejo.com"`
- Any Branding committee detail page

**Why:** Placeholder chair status. Do not invest portal surface area in a role that is actively being replaced.

---

## 5. Dual-role rendering — Jessica Haggy

**Issue:** v1 renders Jessica Haggy in multiple places but may not surface both roles consistently.

**Fix:** Everywhere Jessica Haggy appears, her role should render as: **Volunteer Chair** AND **Jefferson County Democratic Women's Club President** (voting EC seat). Both roles.

**Where (in v1):**
- Line 3177 — transitions table: Women's Club President (Filled)
- Line 3189 — transitions table: Volunteer Committee Solo Chair
- Line 3848 — Volunteer committee object: `chair: "Jessica Haggy"`
- Line 4033 — voting additions: `add("Jessica Haggy", "Women's Club President (voting)")`

**Why:** She holds both roles and both should be visible in the directory, role chip, and any hover card. The data model in `CLAUDE.md` supports this via the `primary_role` + `committee_chair_codes` combination on `ec_members`.

---

## 6. Dual-role rendering — Carolyn Benedict

**Issue:** Carolyn Benedict is LD35 VC AND Facilities Chair. Verify both render in v1 and both render in v2.0.

**Fix:** Everywhere Carolyn Benedict appears, render as **LD35 Vice Chair** AND **Facilities Chair** (where relevant). Both roles.

**Where (in v1):**
- Line 3874 — LD list: `{ld:"35", chair:"Mike Goetz", vc:"Carolyn Benedict"}`
- Facilities committee chair/members — **verify** that v1 correctly lists her as chair of Facilities (grep for "Facilities" in v1-snapshot.html during migration; if her chair assignment is missing or wrong, correct it in the new data).

**Why:** Same as Jessica Haggy — dual-role surfacing matters for directory accuracy.

---

## 7. Mike Ward (Finance Chair) — render the role, not the assessment

**Issue:** Internal political context about Mike Ward's reliability exists in strategy notes (outside this repo). Some of that context must NOT leak into portal copy.

**Fix:** Render Mike Ward's role as **Finance Chair** in the committee directory, member roster, and any transitions/assignments views. Do not add any editorial copy about his activity level, reliability, or political alignment. The portal surfaces the role; the `louisville-dems` chat project handles assessment.

**Where:**
- Line 3781 — Finance committee: `chair: "Mike Ward"`
- Line 3895 — LD41 members: `["Seth Drake","Mike Ward","Rick Adams"]`
- Any member directory card for Mike Ward

**Why:** Political neutrality in the codebase — see CLAUDE.md § Political content boundaries.

---

## 8. Lisa Norkus == Lisa Tanner Norkus (one entity)

**Issue:** Formal party documents sometimes use "Lisa Tanner Norkus" (maiden name). Casual references use "Lisa Norkus." In data these must map to the same `ec_members` row.

**Fix:** During data migration, fold any "Lisa Tanner Norkus" occurrences to the same `ec_members` row as "Lisa Norkus." Member lookup, committee membership, and directory rendering must all resolve to one person.

**Where:**
- Line 3708, 3746, 3782, 3832 — various committee member arrays include "Lisa Norkus"
- **Verify** during migration whether any v1 source treats "Lisa Tanner Norkus" as a distinct string (grep for "Tanner" during migration)

**Why:** One human, one row. Directory and activity rollups must aggregate correctly.

---

## 9. Hallie Rice — At-Large chip clarification

**Issue:** Hallie Rice is LYD President (voting seat on the EC). CLAUDE.md flags that her "At-Large chip" needs clarification — the concern is whether v1 mislabels her as At-Large somewhere when her voting seat comes from the LYD presidency, not from an At-Large election.

**Fix:** Every role chip, directory card, and transitions entry for Hallie Rice should render as **LYD President (voting)**. Do NOT render her as "At-Large" unless Lisa confirms she also holds an At-Large seat (she is also resident in LD37 per line 3892 but that's residency, not role).

**Where:**
- Line 3183 — transitions: LYD President Filled
- Line 3892 — LD assignments: `["Hallie Rice","37"]` (residency)
- Line 4032 — voting additions: `add("Hallie Rice", "LYD President (voting)")` — correct, keep
- Line 2322 — `<div class="aff-person">Hallie Rice</div>` — verify surrounding section context during migration; fix chip if it says At-Large

**Why:** Chip correctness matters for role-aware routing. If the dashboard thinks Hallie Rice is At-Large, she'll get the At-Large dashboard instead of the appropriate LYD/committee-member one.

---

## 10. "Director" vs "Chair" — global sweep

**Issue:** v1 uses "Director" for Beth (see #1). There may be other spots where "Director" leaks in (e.g., old title migration from 2024 reorg). The LDP does not have paid staff directors — every committee leader is an elected or appointed **Chair**.

**Fix:** Grep v1-snapshot.html and every new data row for the word "Director." Each hit gets reviewed: is this someone's actual title on an external body (e.g., "Kentucky Democratic Party Executive Director") or is it a misapplied LDP-internal label? Misapplied LDP labels become "Chair."

---

## 11. Duplicate "Endorsement" committee in v1 data

**Issue:** v1's `COMMITTEES` array (lines 3651–3863) contains NINE standing committees, not eight. The ninth is a duplicate entry: "Endorsement" (standing, Chair: Logan Gatti) appears alongside "Endorsement Process" (ad hoc, Chair: Logan Gatti). Same chair, same work, counted twice. This is why the lede (fix #2) reads "Nine standing committees plus three ad-hoc" — the data supported it even though the real count is 8+3.

**Fix:** In the v2.0 Supabase migration, seed only the 8 standing committees listed in `CLAUDE.md § Committees`. Do NOT migrate a standing "Endorsement" row. The ad hoc "Endorsement Process" (Logan Gatti chair, "Reconvenes after 2026 Primary") is the correct entry — keep that one only.

**Where:**
- Lines 3651–3863 in v1 — the `COMMITTEES` array defines both entries
- Committee grid rendering on the Committees section (around line 2413) renders whatever the array contains, so fixing the source data fixes the UI

**Why:** Logan chairs one endorsement-related body, and it's the ad hoc Endorsement Process. The standing "Endorsement" entry in v1 is orphaned data — likely a holdover from an earlier iteration. Removing it is what makes fix #2 (lede: "Nine" → "Eight") structurally true, not just cosmetic.

---

## Sweep checklist for migration PR

Before the v2.0 data migration PR merges, confirm each of the below is true. Check each off in the PR body.

- [ ] Grep for "Communications Director" → 0 hits in rendered output
- [ ] Grep for "Nine standing" / "nine standing" → 0 hits in rendered output
- [ ] §26 drift sidenote renders next to committee directory
- [ ] Maggie Jo Hilliard appears as Branding Chair but no Branding detail page ships
- [ ] Jessica Haggy renders with both roles everywhere she appears
- [ ] Carolyn Benedict renders with both roles everywhere she appears
- [ ] Mike Ward renders as Finance Chair with no reliability/alignment copy
- [ ] "Lisa Tanner Norkus" and "Lisa Norkus" resolve to the same `ec_members` row
- [ ] Hallie Rice renders as LYD President, not At-Large
- [ ] Sweep for stray "Director" usages complete; each remaining instance justified
- [ ] Only 8 standing committees + 3 ad hoc seeded in Supabase; no duplicate "Endorsement" row
