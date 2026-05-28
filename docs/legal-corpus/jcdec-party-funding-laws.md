# JCDEC Party Funding Laws — Claude Code Skill

Reference markdown skill for the Jefferson County Democratic Executive Committee (JCDEC) party-funding chat feature. Covers Kentucky and federal campaign finance law as it applies to county-level Democratic party committee operations.

## Folder structure

```
jcdec-party-funding-laws/
├── SKILL.md                  # Skill entry point + routing
├── README.md                 # This file
├── all-laws-combined.md      # Single-file dump of all reference content
└── references/
    ├── 00-quick-reference.md            # Contribution limits, classification, decision tables
    ├── 01-louisville-races.md           # HB 388 + which offices are partisan/nonpartisan
    ├── 02-jcdec-can-do-matrix.md        # "Can JCDEC do X?" by race + activity
    ├── 03-state-law-krs-121.md          # KRS Chapter 121 sourcebook
    ├── 04-state-admin-regs-32-kar.md    # 32 KAR Title 32 sourcebook
    ├── 05-federal-contribution-limits.md
    ├── 06-federal-coordinated-expenditures.md
    ├── 07-federal-soft-money-and-levin.md
    ├── 08-federal-source-prohibitions.md
    ├── 09-judicial-conduct-code.md      # Canon 4 / SCR 4.300
    ├── 10-glossary.md
    ├── 11-decision-trees.md             # Multi-step decision flows
    └── 12-open-questions.md             # Gaps requiring KREF/FEC advisory opinions
```

## Usage in Claude Code

### As a skill

Place this folder in `~/.claude/skills/` or your project's skills directory. The `SKILL.md` frontmatter describes when to invoke it.

### As context for a chat

For a chat feature backed by retrieval, ingest each reference file as a separate semantic chunk. The H2 sections in each file are designed to be the retrievable unit.

For a chat feature using full-context loading, use `all-laws-combined.md` as a single document (≈30k tokens).

### As a knowledge base

The files use standardized citation formats:

- KY statute: `[KRS 121.150(6)]`
- KY admin reg: `[32 KAR 2:060]`
- KY constitution: `[KY Const. § 117]`
- KREF guidance: `[KREF Candidate Guide (Rev. 09/2025)]`
- Federal statute: `[52 USC 30125(b)(2)]`
- Federal regulation: `[11 CFR 109.33(a)]`
- Judicial Conduct Code: `[Rule 4.1(A)(7), SCR 4.300]`
- Case: `[Winter v. Wolnitzek, 482 S.W.3d 768 (Ky. 2016)]`

## What's covered

### State (Kentucky) law

- KRS Chapter 121 — Campaign Finance Regulation (full sourcebook)
- KRS Chapter 121A — Public Financing of Gubernatorial Campaigns (noted as not applicable to JCDEC)
- 32 KAR Title 32 — Registry of Election Finance administrative regulations
- KREF guidance documents (Candidate Guide and Executive Committee Guide, Rev. 09/2025)
- Kentucky Code of Judicial Conduct, SCR 4.300 Canon 4 / Rules 4.1, 4.2, 4.3, 4.4
- HB 388 (2024) — the law making Louisville Mayor and Metro Council nonpartisan starting 2026

### Federal law

- 52 USC Chapter 301 (FECA) — full coverage of relevant sections
- 52 USC 30116 — Contribution and expenditure limits, including $35K/$62K national-cmte-to-Senate cap and coordinated party expenditure framework
- 52 USC 30118 — Corporate / labor contribution prohibition
- 52 USC 30119 — Federal contractor contribution prohibition
- 52 USC 30120 — Disclaimers
- 52 USC 30121 — Foreign national prohibition
- 52 USC 30122 — Conduit / straw donor prohibition
- 52 USC 30124 — Fraudulent misrepresentation
- 52 USC 30125 (BCRA Title I) — Soft money, Levin Amendment, Federal Election Activity
- 11 CFR Part 100 — Definitions including Federal Election Activity
- 11 CFR Part 106 — Federal / non-federal allocation
- 11 CFR Part 109 — Coordinated and independent expenditures, including 109.32 and 109.33 (state-county assignment)
- 11 CFR Part 110 — Contribution and expenditure limits
- 11 CFR Part 300 — Non-Federal Funds (BCRA Title I implementation, Levin funds, FEA reporting)

### Pending/contingent

- NRSC v. FEC (US Supreme Court, oral argument December 9, 2025; decision expected through June 2026) — could strike down coordinated party expenditure limits

## Out of scope

- Tax law (501(c) operations, 527 organization rules beyond solicitation prohibitions)
- KY Legislative Ethics Code (lobbyist rules during legislative session)
- KY Open Meetings / Open Records Act (KRS Chapter 61)
- Federal lobbying law (LDA)
- IRS form preparation
- Specific contract review
- Litigation strategy
- JCDEC and KDP internal bylaws (these vary; confirm with party officers)

## How to use this skill in a chat

1. **Route the question**: Identify whether it's about state law, federal law, judicial conduct, race classification, or operational compliance.
2. **Pull the relevant reference file**: Each file is self-contained. The `00-quick-reference.md` handles most rapid-fire questions.
3. **Cite the statute/regulation**: Always use the standardized citation format.
4. **Give the plain answer first, then citation, then practical takeaway.**
5. **Flag ambiguity**: If the question falls in a gap (see `12-open-questions.md`), say so and point to the advisory opinion path.
6. **Refer out** for bylaws (JCDEC chair / counsel / KDP), litigation (attorney), and pending SCOTUS contingencies (monitor docket).

## Maintenance notes

- **Recheck annually**: Federal contribution limits indexed in odd years; coordinated expenditure limits adjusted annually.
- **Monitor SCOTUS**: NRSC v. FEC decision will substantially affect federal coordinated expenditure rules.
- **Track KREF advisory opinions**: New AOs may clarify open questions (especially HB 388 implementation).
- **KRS amendments**: Kentucky General Assembly meets January-March (even years 60 days; odd years 30 days). Check for amendments to KRS 121 after each session.

## Authority and disclaimers

This skill is reference material derived from public statutes, regulations, and KREF/FEC guidance documents. It is NOT legal advice. For binding guidance on a specific situation:

- File a KREF advisory opinion request: KREFRequests@ky.gov, 502-573-2226
- File a FEC advisory opinion request: ao@fec.gov, 1-800-424-9530
- Consult counsel for litigation, criminal exposure, or novel transactions

## Last updated

May 2026. Reflects 2025-2026 federal contribution limits, 2026 coordinated expenditure limits, KREF Candidate Guide and Executive Committee Guide as revised September 2025, and KRS Chapter 121 as effective for the 2026 cycle.





# JCDEC Party Funding Laws — Combined Reference

Single-file dump of all reference content for the JCDEC Party Funding Laws skill. Use this file when you need broad context loaded at once. For targeted retrieval, use the individual files in `references/`.

Each section below corresponds to a separate file in `references/`. Section headers preserve the original file order.

---


---

<!-- SOURCE: references/00-quick-reference.md -->

# Quick Reference — Most Common Lookups

## Office classification in Louisville/Jefferson County

| Office | Classification | Authority |
|---|---|---|
| Louisville Metro Mayor | NONPARTISAN (starting 2026) | HB 388 (2024); KRS 67C as amended |
| Louisville Metro Council | NONPARTISAN (starting 2026) | HB 388 (2024); KRS 67C as amended |
| Circuit Court Judge | NONPARTISAN (always) | KY Const. § 117 |
| District Court Judge | NONPARTISAN (always) | KY Const. § 117 |
| Court of Appeals Judge | NONPARTISAN (always) | KY Const. § 117 |
| KY Supreme Court Justice | NONPARTISAN (always) | KY Const. § 117 |
| JCPS Board of Education | NONPARTISAN | KRS 160.210; KRS 118.025 |
| Soil & Water Conservation | NONPARTISAN | KRS 262.220 |
| Jefferson County Sheriff | PARTISAN | KRS Ch. 70 |
| Jefferson County Attorney | PARTISAN | KRS Ch. 69 |
| Jefferson County PVA | PARTISAN | KRS Ch. 132 |
| KY State House / Senate | PARTISAN | KRS Ch. 6 |
| KY Governor / Lt. Gov | PARTISAN | KY Const.; KRS Ch. 121A |
| US Senate (Booker, etc.) | PARTISAN (federal) | 52 USC |
| US House (McGarvey KY-3) | PARTISAN (federal) | 52 USC |

## Contribution limits to candidates — Kentucky state/local races

| From | To Kentucky candidate | Limit | Cite |
|---|---|---|---|
| Individual (18+) | Any candidate | $2,200 / election | KRS 121.150(6) |
| Individual (under 18) | Any candidate | $100 | KRS 121.150(5) |
| PAC / Permanent Cmte | Any candidate | $2,200 / election | KRS 121.150(6) |
| Contributing Organization | Any candidate | $2,200 / election | KRS 121.150(6) |
| Executive Committee (JCDEC, KDP) | Any candidate | UNLIMITED | KRS 121.150(6) |
| Caucus Campaign Committee | Any candidate | UNLIMITED (50% / $10K candidate-retention cap) | KRS 121.150(6), (23) |
| Corporation / LLC / LLP / union | Any candidate | PROHIBITED | KRS 121.025; 121.035 |

## Contribution limits TO JCDEC

| From | Limit to JCDEC | Cite |
|---|---|---|
| Individual | $5,000 / year | KRS 121.150(11) |
| PAC | $5,000 / year | KRS 121.150(11) |
| Contributing Organization | $5,000 / year | KRS 121.150(11) |
| Corporation / LLC | PROHIBITED | KRS 121.025 |
| Another Executive Committee (e.g., KDP) | UNLIMITED (transfer) | KRS 121.150 |
| Caucus Campaign Committee | $5,000 / year | KRS 121.150(11) |
| Partisan candidate (termination, surplus) | UNLIMITED | KRS 121.180(10)(d) |
| Nonpartisan candidate (termination, surplus) | NOT PERMITTED — must escheat or pro-rata refund | KRS 121.180(10)(d) |
| Gen. Assembly member's active campaign account | $5,000 / year | KRS 121.175(1) |
| Other partisan candidate's active campaign account | Statute silent — gap | (advisory opinion candidate) |
| Nonpartisan candidate's active campaign account | Not authorized | (advisory opinion candidate) |
| Foreign national | PROHIBITED | 52 USC 30121 (applies to all elections) |

## Cash, anonymous, ITC

| Type | Limit | Cite |
|---|---|---|
| Cash | $100 / contributor / election | KRS 121.150(4) |
| Anonymous | $100 / contributor; $2,000 / election aggregate | KRS 121.150(3) |
| ITC funds (county share) | $0.50 per $2 taxpayer designation | KRS 121.230; 141.071-.073 |
| Independent Expenditure reporting trigger | > $500 aggregate / election | KRS 121.150 |

## Federal contribution limits (2025-2026 cycle)

| From | To federal candidate | Limit | Cite |
|---|---|---|---|
| Individual | Federal candidate | $3,500 / election | 52 USC 30116(a)(1); indexed |
| Multicandidate PAC | Federal candidate | $5,000 / election | 52 USC 30116(a)(2)(A) |
| State/district/local party committee combined (KDP + JCDEC + all subordinates) | Federal candidate | $5,000 / election | 52 USC 30116(a)(2)(A); 11 CFR 110.3(b) |
| National party committee (DNC) | US Senate candidate | $35,000 base / $62,000 indexed (DNC + DSCC combined per cycle) | 52 USC 30116(h) |
| National party committee (DNC/DCCC) | US House candidate | $5,000 / election | 52 USC 30116(a)(2)(A) |
| Corporation / LLC | Federal candidate or committee | PROHIBITED (SSF/PAC carve-out) | 52 USC 30118 |
| Foreign national | Any candidate / any election | PROHIBITED | 52 USC 30121 |

## Federal coordinated party expenditure limits (2026)

| Race | KDP coordinated expenditure pool (shared with JCDEC) | Cite |
|---|---|---|
| US Senate KY (Booker) | $468,800 | 52 USC 30116(d); 11 CFR 109.32; FEC 2026 table |
| US House KY-3 (McGarvey) | $65,300 | 52 USC 30116(d); 11 CFR 109.32 |

JCDEC has zero coordinated expenditure authority unless KDP assigns it in writing under `[11 CFR 109.33(a)]`. Combined KDP + JCDEC coordinated spending cannot exceed the pool above.

## Federal Election Activity (FEA) allocation by cycle

Cycle context determines minimum federal-fund share of allocable Type 1 FEA (registration in 120-day window + voter ID + GOTV + generic campaign activity):

| Cycle | Min federal share | Cite |
|---|---|---|
| Presidential + Senate on ballot | 36% | 11 CFR 300.33(b)(2) |
| Presidential, no Senate | 28% | 11 CFR 300.33(b)(1) |
| Senate, no Presidential (e.g., 2026) | 21% | 11 CFR 300.33(b)(3) |
| Neither (e.g., 2027 if no federal special) | 15% | 11 CFR 300.33(b)(4) |

Type 2 FEA (public communication referring to clearly identified federal candidate) = 100% federal money. No allocation. `[11 CFR 300.32(a)(1)]`.

## Critical reporting triggers

| Trigger | Effect | Cite |
|---|---|---|
| $5,000 aggregate FEA receipts + disbursements in calendar year | JCDEC files MONTHLY FEC Form 3X with $200+ itemization | 11 CFR 300.36 |
| $10,000 in JCDEC account in 12 months before July 1 | Semi-annual KEFMS filing required (no certify-out) | 32 KAR 1:030 |
| > $500 IE aggregate per election | Direct IE report to KREF | KRS 121.150; 32 KAR 1:080 |
| > $1,500 ITC funds received | Mandatory annual KREF audit | KRS 121.230(5) |
| > $100 from a single donor (aggregate per election) | Itemize: name, address, occupation, employer | KRS 121.065 |
| > $25 expenditure | Pay by check / card / electronic; itemize payee | KRS 121.160(2)(c) |

## JCDEC reporting calendar

- **January 31** — Semi-annual report covering July 1 – December 31
- **July 31** — Semi-annual report covering January 1 – June 30 (OR no-report certification if under $10K)
- **30 days post-primary** — Post-primary report under 32 KAR 2:100
- **Continuing supplemental reports** after general election until debts cleared and balance disposed of
- **Monthly FEC Form 3X** if over $5,000 FEA aggregate (Federal Election Activity)
- **Quarterly Building Fund reports** — N/A; JCDEC has no building fund authority (KRS 121.172 is state-only)

## "Can JCDEC do X?" — fastest decision tree

| Question | Answer |
|---|---|
| Give unlimited $ to a Democratic candidate? | YES if state/local; NO if federal (federal cap $5K shared with KDP); NO for judicial (Canon 4 makes it functionally an endorsement). |
| Take unlimited $ from KDP? | YES — exec committee transfers are unlimited (KRS 121.150). |
| Take $ from a corporation? | NO — categorical ban in any account (KRS 121.025; 52 USC 30118 for federal). Exception: state party Building Fund only (not JCDEC). |
| Take a check from a candidate's campaign account? | Only at termination from a PARTISAN candidate's surplus (KRS 121.180(10)(d)). Or any time from a General Assembly member's active campaign ($5K/yr cap per KRS 121.175(1)). Nonpartisan candidates can't transfer to JCDEC. |
| Coordinate an ad with a candidate? | YES (with reporting); coordinated spending becomes an in-kind contribution to that candidate (KRS 121.015(6)(b)-(c)). For judicial: effectively NO under Canon 4. |
| Make a coordinated expenditure for Booker or McGarvey? | Only if KDP assigns authority in writing (11 CFR 109.33). |
| Solicit funds for or send money to a 501(c) or 527? | DANGER — personal liability trap. Need written 11 CFR 300.37 certification. Many situations prohibited. |
| Accept money from a federal contractor? | NO during the contractor's contract window (52 USC 30119). |
| Accept money from a green-card holder? | YES (lawful permanent resident OK). NOT from a tourist/work visa holder (52 USC 30121). |
| Run a GOTV mailer in a federal-ballot year? | YES, but it's Federal Election Activity (FEA). Pay 100% federal funds OR allocated federal+Levin mix. Track $5K threshold. |

## Where to ask when this skill isn't enough

- **KREF General Counsel**: KREFRequests@ky.gov, 502-573-2226. Advisory opinions per KRS 121.135 and 32 KAR 2:060.
- **FEC**: 1-800-424-9530. Advisory opinions per 52 USC 30108.
- **JCDEC counsel / chair / vice chair** for bylaw questions.
- **KDP**: for state party bylaw questions and federal coordinated expenditure authority assignments.


---

<!-- SOURCE: references/01-louisville-races.md -->

# Louisville/Jefferson County Race Classifications

## Scope

Use this file when the question turns on whether an office is partisan or nonpartisan, what changed in the 2026 cycle, or how HB 388 (2024) reshaped Louisville's local elections.

## The headline: HB 388 (2024)

In 2024 the Kentucky General Assembly passed **House Bill 388** (signed into law over Gov. Beshear's veto). The bill stripped party affiliation from the ballot for Louisville Metro Mayor and Metro Council races, making both nonpartisan starting with the **2026 election cycle**.

**Citations:**
- HB 388 (2024 Reg. Sess.): https://apps.legislature.ky.gov/record/24rs/hb388.html
- Amendments to KRS Chapter 67C (Louisville Metro government)

**Effect on primaries:** In nonpartisan primaries, all registered voters (including independents) vote on the same ballot. If more than two candidates file, the top two advance to the general. If only one or two file, the race skips the primary and goes directly to November. Straight-party voting does not apply to nonpartisan offices.

**First nonpartisan cycle**: May 19, 2026 primary was Louisville's first nonpartisan primary for Mayor and Metro Council.

## Race-by-race classification

### Nonpartisan, non-judicial

| Office | Authority | Notes |
|---|---|---|
| Louisville Metro Mayor | HB 388 (2024); KRS 67C | Nonpartisan starting 2026 |
| Louisville Metro Council (all 26 districts) | HB 388 (2024); KRS 67C | Nonpartisan starting 2026 |
| JCPS Board of Education (7 sub-districts) | KRS 160.210; KRS 118.025 | Always nonpartisan |
| Soil & Water Conservation District | KRS 262.220 | Always nonpartisan |

### Nonpartisan judicial (KY Const. § 117)

| Office | Authority |
|---|---|
| District Court Judge | KY Const. § 117; KRS Ch. 23A |
| Circuit Court Judge | KY Const. § 117; KRS Ch. 23A |
| Court of Appeals Judge | KY Const. § 117; KRS Ch. 22A |
| Kentucky Supreme Court Justice | KY Const. § 117; KRS Ch. 21A |

Judicial candidates are subject not only to KRS Chapter 121 / KREF rules but also to the **Kentucky Code of Judicial Conduct, Canon 4** (SCR 4.300), which adds substantial restrictions on political and campaign activity. See `references/09-judicial-conduct-code.md`.

### Partisan offices in Louisville/Jefferson County (for comparison)

| Office | Authority |
|---|---|
| Jefferson County Sheriff | KRS Ch. 70 |
| Jefferson County Attorney | KRS Ch. 69 |
| Jefferson County PVA (Property Valuation Administrator) | KRS Ch. 132 |
| Jefferson County Circuit Clerk | KRS Ch. 30A |
| Coroner | KRS Ch. 72 |
| State House and State Senate (Louisville districts) | KRS Ch. 6; KY Const. § 32 |
| Statewide constitutional offices (Governor, Lt. Gov, AG, SOS, Treasurer, Auditor, Agriculture Commissioner) | KY Const. |

### Federal (always partisan)

| Office | 2026 KY incumbent / candidate |
|---|---|
| US Senate | Mitch McConnell (open seat 2026); Charles Booker (D nominee) |
| US House KY-3 | Morgan McGarvey (D incumbent) |
| US President | Quadrennial, not on 2026 ballot |

## Why classification matters

The partisan/nonpartisan classification determines:

1. **Whether the party may legally support the candidate** under KRS Chapter 121 and JCDEC/KDP bylaws.
2. **Whether the candidate may transfer surplus campaign funds to JCDEC** at termination. `[KRS 121.180(10)(d)]` permits this transfer only for "partisan candidates." Nonpartisan candidates must escheat to State Treasury or refund pro rata.
3. **Whether judicial conduct rules apply** (judicial races only).
4. **Whether the office is on a federal ballot**, which triggers Federal Election Activity (FEA) rules for JCDEC voter contact in those cycles. See `references/07-federal-soft-money-and-levin.md`.
5. **What goes on a slate card or sample ballot**. Slate cards naming nonpartisan candidates allocate as in-kind contributions to each named candidate. See `references/06-federal-coordinated-expenditures.md` and `references/02-jcdec-can-do-matrix.md`.

## KREF guidance on party support of nonpartisan candidates

From the official KREF Contribution Limits page:

> "The contributions given by Caucus Campaign Committees are unlimited. **Party rules and or by-laws may prohibit Executive Committees and Caucus Campaign Committees from making contributions to candidates in non-partisan races.** For more information, you may contact these committees."

Translation: KREF/KRS 121 does NOT prohibit JCDEC from contributing to nonpartisan candidates. The constraint, if any, lives in JCDEC's own bylaws or KDP's bylaws. Audit those bylaws before cutting checks to a nonpartisan candidate.

## What HB 388 did NOT change

- **KRS 121.150(6)** contribution limits — executive committees still may contribute unlimited amounts to candidates (state/local), and the statute does not distinguish partisan vs. nonpartisan candidates.
- **KRS 121.180(10)(d)** surplus disposition — the partisan-only restriction on surplus transfer to party committees was already in statute. HB 388 didn't amend it. Result: post-2026 nonpartisan candidates for Mayor and Metro Council can no longer route surplus to JCDEC at termination, where they could (as partisan candidates) before HB 388.
- **JCDEC's own structure** — JCDEC remains the county-level subdivision of KDP. Its registration, reporting, and operational rules are unchanged.

## Practical implications for JCDEC going into 2026

1. JCDEC can give unlimited dollars to a nonpartisan Mayor or Metro Council candidate per `[KRS 121.150(6)]`. Bylaws are the constraint.
2. Nonpartisan candidates cannot give their surplus back to JCDEC. This closes a historical money flow.
3. Slate cards naming nonpartisan candidates become in-kind contributions to those candidates (allocated). Plan cost-allocation methodology in advance.
4. Judicial races remain functionally walled off — Canon 4 makes party endorsement and party money toxic for judicial candidates even though KREF rules would permit them.


---

<!-- SOURCE: references/02-jcdec-can-do-matrix.md -->

# "Can JCDEC do X?" — Rule Matrix by Race Type

## Scope

Use this file when the question is "Can JCDEC [activity] for a [race type] candidate?" or "Can a [race type] candidate [activity] with JCDEC?" This is the operational matrix combining KRS 121, 32 KAR, KREF guidance, and (for judicial) Canon 4.

Status legend:
- **ALLOWED** — Permitted under KREF rules / KY statute. No statutory restriction.
- **LIMITED** — Permitted but with a dollar cap, reporting requirement, or condition.
- **PROHIBITED** — Forbidden by KREF, KRS 121, Judicial Conduct Code, or directly prohibitive bylaws.
- **AMBIGUOUS** — Statute silent or unclear. Advisory opinion recommended.

## Group A — Nonpartisan non-judicial (Mayor, Metro Council, JCPS, Soil & Water)

| Activity | Status | Citation / Rule |
|---|---|---|
| Receive $ from JCDEC | ALLOWED, UNLIMITED | KRS 121.150(6). BUT JCDEC bylaws may prohibit (per KREF guidance). |
| Receive $ from state party / DNC / caucus cmte | ALLOWED, UNLIMITED | KRS 121.150(6). Same caveat re bylaws. |
| Be subject of an independent expenditure by JCDEC | ALLOWED, UNLIMITED | KRS 121.015(12); >$500 reported. |
| Coordinate ad / mailer with JCDEC | LIMITED — becomes in-kind contribution | KRS 121.015(6)(b)-(c). Reported by both. |
| Appear on a party slate card / sample ballot | ALLOWED with in-kind reporting | KREF Exec Cmte Guide Ch. 2; in-kind to named candidates. |
| Accept formal party endorsement | ALLOWED | No KREF rule. JCDEC bylaws and endorsement process control. |
| Appear at JCDEC-sponsored event (fundraiser, GOTV rally) | ALLOWED | Party-paid event for the candidate = in-kind contribution. |
| Personally solicit contributions | ALLOWED | KRS 121.150 does not bar personal solicitation by non-judicial candidates. |
| Transfer campaign surplus TO JCDEC at termination | **PROHIBITED** | KRS 121.180(10)(d): partisan-only option. Surplus must escheat to State Treasury or pro-rata refund to contributors. |
| Give from active campaign account TO JCDEC mid-cycle | **PROHIBITED** | Only General Assembly members are authorized (KRS 121.175(1), $5K/yr cap). No other authorization in statute. |
| Coordinate joint GOTV / canvass with JCDEC | LIMITED — coordination converts party-funded portion to in-kind | KRS 121.015(6); KREF guidance. |
| Be listed on party-funded literature naming the candidate | LIMITED — per KREF: an ad for fewer than ALL candidates on party's ballot is in-kind OR independent expenditure | KREF Exec Cmte Guide Ch. 2. |

## Group B — Nonpartisan judicial (Circuit / District / COA / Supreme)

| Activity | Status | Citation / Rule |
|---|---|---|
| Receive $ from JCDEC | **PROHIBITED** | KREF would permit, BUT Rule 4.1(A)(7) (SCR 4.300) bars accepting party endorsement; party $ functions as endorsement per Comment [10]. |
| Receive $ from state party / DNC / caucus cmte | **PROHIBITED** | Same. Rule 4.1(A)(7). |
| Be subject of an independent expenditure by JCDEC | LIMITED — risky | Rule 4.1(B): candidate must take reasonable measures so others don't do prohibited acts on their behalf. |
| Coordinate ad / mailer with JCDEC | **PROHIBITED** | Coordination = in-kind contribution from political org; prohibited under Rule 4.1(A)(4), (A)(7). |
| Appear on a party slate card / sample ballot | **PROHIBITED** | Appearing on party slate = party endorsement. Rule 4.1(A)(6), (A)(7); Comment [10]. |
| Accept formal party endorsement | **PROHIBITED** | Rule 4.1(A)(7); KY Const. § 117. |
| Appear at JCDEC-sponsored event | LIMITED | Rule 4.1(A)(5): may attend, may speak on own behalf, may buy tickets for self + 1 guest. May NOT host. May NOT have it be a fundraiser for them. |
| Personally solicit contributions | **PROHIBITED** | Rule 4.1(A)(8); Rule 4.4 — judicial candidates may only solicit/accept through a campaign committee. |
| Transfer campaign surplus TO JCDEC at termination | **PROHIBITED** | Rule 4.1(A)(4) bars contributions to political organizations. KRS 121.180(10)(d) is partisan-only anyway. |
| Give from active campaign account TO JCDEC mid-cycle | **PROHIBITED** | Same. Rule 4.1(A)(4). |
| Coordinate joint GOTV / canvass with JCDEC | **PROHIBITED** | Joint coordination with party = de facto endorsement and contribution. Rule 4.1(A)(4), (A)(7); Comment [4]. |
| Be listed on party-funded literature naming the judicial candidate | **PROHIBITED** | Party-paid literature naming the judicial candidate = party endorsement. Rule 4.1(A)(7). |

## Group C — Partisan (for comparison: Sheriff, County Attorney, PVA, State House/Senate)

| Activity | Status | Citation / Rule |
|---|---|---|
| Receive $ from JCDEC | ALLOWED, UNLIMITED | KRS 121.150(6). |
| Receive $ from state party / DNC / caucus cmte | ALLOWED, UNLIMITED | KRS 121.150(6). |
| Be subject of an independent expenditure by JCDEC | ALLOWED, UNLIMITED | KRS 121.015(12); >$500 reported. |
| Coordinate ad / mailer with JCDEC | LIMITED — in-kind contribution | KRS 121.015(6). |
| Appear on a party slate card / sample ballot | ALLOWED | Standard for partisan races. |
| Accept formal party endorsement | ALLOWED | Standard for partisan races. JCDEC bylaws and state party rules apply. |
| Appear at JCDEC event | ALLOWED | Standard for partisan races. |
| Personally solicit contributions | ALLOWED | No KREF bar. |
| Transfer campaign surplus TO JCDEC at termination | ALLOWED, UNLIMITED | KRS 121.180(10)(d). |
| Give from active campaign account TO JCDEC mid-cycle | LIMITED (GA members only confirmed) | KRS 121.175(1): General Assembly members $5,000/yr. Other partisan candidates: statute gap. |
| Coordinate joint GOTV / canvass with JCDEC | ALLOWED with in-kind reporting | Coordinated portion = in-kind. |
| Be listed on party-funded literature | ALLOWED | Standard partisan party advertising. |

## Group D — Federal candidates (Booker for Senate, McGarvey for House)

Federal candidates are a different framework. See `references/05-federal-contribution-limits.md` and `references/06-federal-coordinated-expenditures.md` for the full rules. Quick summary:

| Activity | Status | Citation |
|---|---|---|
| Receive direct contribution from JCDEC | LIMITED — $5,000/election cap SHARED across KDP + JCDEC + all KY subordinate Dem committees combined | 52 USC 30116(a)(2)(A); 11 CFR 110.3(b) |
| Receive a coordinated expenditure from JCDEC | PROHIBITED unless KDP assigns authority in writing | 11 CFR 109.33(a). Combined KDP+JCDEC cannot exceed $468,800 (Senate KY) or $65,300 (House KY-3) for 2026. |
| Be subject of JCDEC independent expenditure | ALLOWED, UNLIMITED if genuinely independent | 52 USC 30116(d); 11 CFR 109. Strict firewall required. >$250 itemized. |
| Be on a JCDEC slate card naming federal candidate | LIMITED — communication becomes Type 2 FEA; must be 100% federal money | 52 USC 30125(b); 11 CFR 300.32(a)(1). See `references/07-federal-soft-money-and-levin.md`. |
| Transfer campaign surplus to JCDEC | LIMITED — federal candidate committees may transfer to party committee at same level OR up. Federal-to-non-federal account restrictions apply. | 52 USC 30116; 11 CFR 102.5 |

## Pattern: "Can JCDEC give money to candidate X?"

1. Identify the race type (Group A / B / C / D).
2. Look up "Receive $ from JCDEC" in the corresponding table above.
3. If ALLOWED: confirm JCDEC bylaws don't prohibit it (especially for Group A nonpartisan races).
4. If LIMITED (federal): coordinate with KDP first — KDP and JCDEC share contribution and coordinated expenditure pools for federal candidates.
5. Document the transaction in the next KREF report (or FEC report for federal).

## Pattern: "Can candidate X give money to JCDEC?"

1. Identify the race type AND timing (during active campaign vs. at termination).
2. During active campaign:
   - General Assembly member's campaign account → JCDEC: $5,000/yr cap (KRS 121.175(1)).
   - Any other partisan candidate's active account → JCDEC: statute silent / gap.
   - Any nonpartisan candidate's active account → JCDEC: not authorized.
   - Judicial candidate's account → JCDEC: PROHIBITED (Rule 4.1(A)(4)).
3. At termination:
   - Partisan candidate's surplus → JCDEC: UNLIMITED (KRS 121.180(10)(d)).
   - Nonpartisan candidate's surplus → JCDEC: PROHIBITED. Must escheat or refund.
   - Judicial candidate's surplus → JCDEC: PROHIBITED.

## Pattern: "Can JCDEC put X on a slate card?"

1. Is X a partisan Democrat? → YES, standard.
2. Is X a nonpartisan candidate (Mayor / Metro / JCPS / S&W)?
   - Yes → YES with in-kind reporting. Party-funded portion attributable to naming X = in-kind contribution to X. Allocate cost across named candidates (pro rata by name is the common method; document the methodology).
3. Is X a judicial candidate? → NO. Listing on a party slate is a party endorsement (Rule 4.1(A)(7)).
4. Is X a federal candidate (Booker, McGarvey)? → YES, but the slate card naming a federal candidate becomes Type 2 Federal Election Activity (FEA) and must be paid 100% with FEC-compliant federal funds (52 USC 30125(b); 11 CFR 300.32(a)(1)).

## Critical reporting note for slate cards

From the KREF Executive Committee Guide (Rev. 09/2025), Chapter 2:

> "An 'ad' for a specific candidate or candidates would also be either an in-kind contribution or an independent expenditure from the committee to the candidate or candidates if not for all the candidates on the party's ballot."

Operational implication: An ad listing fewer than ALL Democrats on the ballot becomes in-kind (if coordinated) OR independent expenditure (if not coordinated). With Mayor and Metro Council now NOT on the party ballot post-HB 388, what counts as "the party's ballot" for these purposes is itself a candidate for advisory opinion. See `references/12-open-questions.md`.


---

<!-- SOURCE: references/03-state-law-krs-121.md -->

# Kentucky State Law — KRS Chapter 121 (Campaign Finance Regulation)

## Scope

Use this file for questions answered by Kentucky statute. KRS 121 is the master campaign finance statute in Kentucky and governs every aspect of JCDEC's funding life. KRS 121A (public financing for gubernatorial campaigns) is largely irrelevant to JCDEC.

## KRS 121.015 — Definitions

The definitional bedrock of Chapter 121. Key terms:

**"Executive committee"** — `[KRS 121.015(3)(f)]`: "an organizational unit or affiliate recognized within the document governing a political party, that raises and spends funds to promote political party nominees, and performs other activities commensurate with the day-to-day operation of a political party, including voter registration drives, assisting candidate fundraising efforts, holding state conventions or local meetings, and nominating candidates for local, state, and federal office."

JCDEC fits squarely as the county-level executive committee of the Kentucky Democratic Party. Auxiliary groups (women's clubs, Young Dems, etc.) are NOT executive committees.

**"Caucus campaign committee"** — `[KRS 121.015(3)(c)]`: the four legislative caucus committees (House Dem, House Rep, Senate Dem, Senate Rep). JCDEC is NOT one of these.

**"Contribution"** — `[KRS 121.015(6)]`: any payment, loan, deposit, gift of money or thing of value; compensation paid for another's services rendered to the committee; or goods/advertising/services worth more than $100 in the aggregate per election furnished free or at a discount.

**"Expenditure"** — `[KRS 121.015(7)]`: payment/distribution/loan made to advocate election or defeat of a candidate or slate, including in-kind transfers. Excludes bank loans in the ordinary course and independent expenditures.

**"Independent expenditure"** — `[KRS 121.015(12)]`: a communication expressly advocating election/defeat of a clearly identified candidate, made without coordination with the candidate.

**"Political party"** — a party that polled at least 20% in the last presidential election (sets the threshold for KDP/RPK status).

## KRS 121.025 — Corporate contributions prohibited

Corporations may not contribute money or anything of value to influence an election. "Corporation" is read broadly to include any corporation, company, partnership, joint stock company, association, LLC, LLP, S-corp, PSC, not-for-profit corporation, or union.

**Application to JCDEC**: JCDEC may NOT accept any monetary or in-kind contribution from any incorporated entity. The ONE exception (state party Building Fund under KRS 121.172) does NOT apply to JCDEC because building funds are state-only.

**Practical takeaway**: Treasurer reviews every check for "Inc.," "LLC," "Corp.," or "Co." before depositing. Verify entity status via KY Secretary of State business database (sos.ky.gov) when in doubt. Refund within 30 days of deposit to avoid violation (32 KAR 2:130).

## KRS 121.035 — Soliciting corporate contributions / unauthorized contributions

Companion to 121.025. It is unlawful for any officer, agent, or person acting on behalf of any corporation to give or contribute corporate funds, AND unlawful for any committee or candidate to solicit or accept such contributions. The prohibition runs in both directions: soliciting is a violation even if no money is accepted.

Corporations may contribute to: (1) political issues committees (ballot questions); (2) a state executive committee building fund (state party only); and may sponsor/administer a PAC.

**Application to JCDEC**: JCDEC officers — chair, vice chair, treasurer — cannot ask a corporation, LLC, or union for money for the general account. Train fundraising volunteers on what "corporate" means under KY law (broader than federal).

## KRS 121.045 (codified at KRS 121.150(12)) — Contributions in the name of another

"A contribution made by one person in the name of another is prohibited." No person may give money to another with the expectation that the second person will donate it. No business may use bonuses, raises, or reimbursements to fund employee contributions. Parents may not give in the name of a minor child.

**Application to JCDEC**: JCDEC cannot accept a contribution if facts suggest the named donor is a pass-through. If a donor has already maxed at $5,000/year, they cannot route additional funds through a spouse, employee, or relative.

**Practical takeaway**: When a donor's contribution arrives bundled with multiple smaller checks from associated parties, document independent donative intent. Bonus-funded employee contributions are a federal-style red flag; refuse and refund.

## KRS 121.055 (codified at KRS 121.150(3)-(4)) — Anonymous and cash limits

- Anonymous contributions: $100/contributor/election; $2,000 aggregate per committee per election (KRS 121.150(3)).
- Cash contributions: $100/contributor/election (KRS 121.150(4)).
- Cashier's checks and money orders treated as cash UNLESS both payer and payee are identified on the instrument.

**Application to JCDEC**: JCDEC may not accept more than $100 cash from any one person at any event per election. Pass-the-hat, raffles, untracked merchandise sales = anonymous and must be aggregated. Once $2,000 anonymous is hit, stop.

## KRS 121.065 — Identification of contributors / political advertising rate non-discrimination

Two parts:

1. **Non-discrimination**: Vendors selling political advertising space or time may not charge rates not comparable to those charged other advertisers.
2. **Itemization triggers**: A committee must record name, address, occupation, and employer for every contributor whose aggregate contributions exceed $100 in an election; if self-employed, list the business name. PAC contributions must be itemized regardless of amount, with description of the PAC's major interest.

**Application to JCDEC**: Itemize every contributor who exceeds $100 cumulative in a calendar year. Vague occupation entries ("businessman," "self-employed") are insufficient.

## KRS 121.120 — Registry of Election Finance (KREF) powers

Establishes KREF and grants it broad regulatory authority. Powers include:

- Receiving reports
- Conducting random audits (KRS 121.120(1)(j))
- Investigating complaints
- Holding hearings
- Issuing subpoenas
- Promulgating administrative regulations (Title 32 KAR)
- Publishing delinquent filers (KRS 121.120(6)(i))
- Reports are public records (KRS 121.120(4)(d))

KRS 121.120(6)(i) is the source of the electronic filing mandate.

**Application to JCDEC**: KREF is JCDEC's primary regulator. All registrations, officer changes, and reports go through KEFMS at secure.kentucky.gov/kref/financial/committee.

## KRS 121.135 — Advisory opinion process

Any person or group facing a specific planned activity or transaction can request a written advisory opinion from KREF General Counsel.

- **Submission**: 140 Walnut Street, Frankfort, KY 40601, or KREFRequests@ky.gov.
- **Procedure**: 32 KAR 2:060 (10-day public comment period).
- **Effect**: An opinion provides safe harbor for the requester on the facts presented; published opinions guide other committees but are not binding on different facts.

**Application to JCDEC**: Before doing anything novel — joint events with affiliated clubs, in-kind support arrangements with candidates, headquarters cost-sharing, unusual fundraising structures — JCDEC may (and should) request an advisory opinion. Reliance on a written AO insulates JCDEC from penalty if facts as represented were complete and accurate.

## KRS 121.150 — Contribution limits

The master contribution limits statute. See `references/00-quick-reference.md` for the full table.

Key provisions for JCDEC:

- **121.150(3)**: Anonymous contribution limits ($100/contributor, $2,000 aggregate per election).
- **121.150(4)**: Cash contribution limit ($100/contributor per election).
- **121.150(5)**: Minor (under 18) contribution limit ($100).
- **121.150(6)**: Individual / PAC / contributing org limit to candidate ($2,200/election). Executive committees and caucus campaign committees may contribute UNLIMITED amounts to candidates. Statute does not distinguish partisan vs. nonpartisan.
- **121.150(11)**: $5,000/year limit on contributions to state executive committees, subdivisions/affiliates (including JCDEC), and caucus campaign committees from individuals, PACs, and contributing orgs.
- **121.150(12)**: Conduit / name-of-another prohibition.
- **121.150(23)**: Caucus campaign committee retention cap — what a candidate may retain from caucus committees is capped at the greater of 50% of total contributions or $10,000 per election.

## KRS 121.160 — Treasurer duties / records / joint expenditures

The master treasurer statute. Key duties:

- **121.160(2)(a)**: Deposit all contributions into the committee bank account.
- **121.160(2)(b)**: Keep detailed records — contributions over $100 aggregate require name, address, occupation, employer (or DBA if self-employed), date, and amount.
- **121.160(2)(c)-(d)**: Make/authorize all expenditures from the committee account; expenditures over $25 must be by check, debit card, or electronic payment; itemize payee name, address, occupation, date, amount, purpose; receipt bill required.
- **121.160(2)(d)**: Retain all records for SIX (6) YEARS from date of last report.
- **121.160(2)(e)** — **JOINT EXPENDITURES**: If two or more committees jointly buy an ad, each must pay its share directly with a SEPARATE CHECK. One committee may NOT front the cost and get reimbursed.
- **121.160(4)**: New treasurer must be appointed and reported within three days of vacancy.
- **121.160(6)**: Treasurer salary is allowed.

**Application to JCDEC**: The joint-expenditure rule is the one that most often trips up county parties. If JCDEC and KDP (or an LD committee, or a caucus committee) co-sponsor a mailer, EACH must cut its own check to the printer. Single invoice paid by one + reimbursement from others = violation.

## KRS 121.170 — Committee registration / treasurer requirements / PAC formation

Every committee — executive, caucus, PAC, political issues, IE-only, inaugural, contributing organization — must register with KREF before receiving or spending funds.

Registration requires: committee name and address, chairperson and treasurer names/addresses, depository bank, statement of purpose. Treasurer must be a registered Kentucky voter. Registration is electronic via KEFMS.

`[KRS 121.170(7)]`: Members of the General Assembly are barred from organizing, forming, or registering a PAC.

**Application to JCDEC**: When JCDEC elects new officers in reorganization years, the chair must immediately update KREF registration via KEFMS. If treasurer resigns or is removed, file replacement within three days (per KRS 121.160(4)).

## KRS 121.172 — State Party Building Fund — STATE PARTY ONLY

Only the STATE executive committee may establish a building fund. Receives unlimited contributions (including corporate). Restricted to HQ-building expenses. CANNOT fund candidates.

**Application to JCDEC**: JCDEC CANNOT establish a building fund. There is no county equivalent under Kentucky law. If JCDEC ever buys HQ, federal building rules apply for any federally-related portion (11 CFR 300.35).

## KRS 121.175 — General Assembly campaign account transfers

`[KRS 121.175(1)]`: Members of the General Assembly may use funds in their campaign account to contribute up to $5,000 per year to a political party or caucus campaign committee.

**Application to JCDEC**: This is the ONLY explicit statutory authorization for a sitting candidate to give from an active campaign account to a party committee mid-cycle. It applies only to General Assembly members (state senators and representatives). It does NOT extend to:
- Nonpartisan candidates (Mayor, Metro, JCPS, judicial)
- Other partisan candidates (Sheriff, County Attorney, PVA)
- Federal candidates (different framework — see federal files)

## KRS 121.180 — Reporting requirements + surplus disposition

The master reporting statute. Key provisions:

- **121.180(2)**: All filings must be submitted electronically (KEFMS).
- **121.180(3)**: Defines required report contents.
- **121.180(5)**: Reportable events — testimonials, dinners, rallies, ticket sales, mass collections, paraphernalia sales — must be itemized with gross receipts and expenses.
- **121.180(6)**: Reporting schedule for executive committees and caucus committees is semi-annual: January 1–June 30 due July 31; July 1–December 31 due January 31. Reports required whether or not there was financial activity. An executive committee with less than $10,000 in the prior 12 months may certify-out of the July 31 report via KEFMS.
- **121.180(7)**: Debts and obligations — unpaid contracts must be reported as debts.
- **121.180(8)**: Reports are public records.
- **121.180(10)(b)**: Candidate may use campaign funds to attend testimonial/fundraiser events for other candidates within individual limits.
- **121.180(10)(d)** — **SURPLUS DISPOSITION**: Surplus funds "shall escheat to State Treasury, be returned pro rata to all contributors, OR, **in the case of a partisan candidate**, be transferred to a caucus campaign committee, or to the state or county executive committee of the political party." Party-transfer is PARTISAN-ONLY. Nonpartisan candidates cannot transfer surplus to JCDEC.

**Practical takeaway**: Put July 31 and January 31 on every JCDEC chair, vice-chair, and treasurer calendar with a 14-day reminder. Late filing triggers automatic publication as a delinquent filer (KRS 121.120(6)(i)).

## KRS 121.190 — Disclaimers on political advertising

All newspaper or magazine advertising, posters, circulars, billboards, handbills, sample ballots, and paid-for television or radio announcements that expressly advocate election or defeat of a clearly identified candidate must include **"paid for by"** followed by the **name AND ADDRESS** of the individual or committee that paid for it. Disclaimer must be "clear and conspicuous."

Exemptions (per 32 KAR 2:110): items smaller than 3.5" x 5" — calling cards, pencils, pens, emery boards, matchbooks, bumper stickers, balloons, hats, shirts. Multi-page mailings comply if one page bears the disclaimer.

**Application to JCDEC**: Any JCDEC-paid express-advocacy ad — print, digital, radio, TV, billboards, direct mail — must read: "Paid for by Jefferson County Democratic Executive Committee, [street address]." Address is mandatory; name alone is insufficient.

## KRS 121.200 — Prohibited contributions (omnibus)

Reinforces and extends the prohibited-source list:

- Corporate contributions (KRS 121.025/035)
- Foreign nationals (52 USC 30121; 22 USC 611)
- Contributions in name of another (KRS 121.150(12))
- Anonymous over the $100/$2,000 caps (KRS 121.150(3))
- Cash over $100 (KRS 121.150(4))
- Contributions to circumvent limits (KRS 121.150(9))
- Solicitation of state employees as state employees (KRS 121.150(2); 121.320)
- Contributions from KY-licensed gaming entities and lobbyists during legislative session (KY Legislative Ethics Code)

## KRS 121.215 — Civil penalties

KREF may assess civil penalties for violations of Chapter 121. Penalties may be imposed after a hearing or via Conciliation Agreement (32 KAR 2:040, 2:050).

Failure to comply with a Registry document request within 90 days carries a fine of not less than $1,000 and not more than $10,000 per full month of noncompliance.

Failure to pay a civil penalty disqualifies the person from filing for public office until the penalty is paid.

**Application to JCDEC**: As an entity, JCDEC and its officers can be assessed civil penalties for late reports, prohibited contributions accepted, missing disclaimers, incomplete itemization, or failure to produce records. Most JCDEC enforcement risk is administrative and resolves through Conciliation Agreements.

## KRS 121.220 — Bank depository requirements

Every committee must designate a single primary depository at a financial institution authorized to do business in Kentucky and insured by FDIC, before receiving or spending any money. All contributions deposited into that account; all expenditures over $25 made from it by check or electronic payment.

**Application to JCDEC**: One designated FDIC-insured KY bank account before any activity. ITC funds and general account funds may share the account but must be reported separately; best practice is separate accounts.

## KRS 121.230 — Income Tax Check-Off (ITC) funds

Under KRS 141.071–.073, Kentucky taxpayers may designate $2.00 on their income tax return to a political party of their choice.

- **Allocation**: $0.50 goes to the executive committee in the taxpayer's county of residence; remaining $1.50 goes to the designated state party's executive committee.
- **Permissible use**: ONLY for (1) supporting the party's candidates in the general election, AND (2) administrative costs of maintaining a political party headquarters.
- **Audit**: KREF must annually audit ITC records of any executive committee receiving over $1,500 in ITC funds (KRS 121.230(5)).
- **Records retention**: Cancelled checks retained 4 years.
- **Reporting**: ITC receipts and expenditures must be reported as a separate entry on KREF reports.

**Application to JCDEC**: JCDEC reliably exceeds $1,500 in ITC, so annual KREF audit is mandatory. ITC funds CANNOT be used for primary-election candidate support, building purchases (county committees have no building fund authority), or non-headquarters operational purposes.

## KRS 121.990 — Criminal penalties

Most knowing violations of Chapter 121 are misdemeanors. Specific Class D felony exposures (1-5 years imprisonment + fines) include:

1. Elected/appointed state officeholders who knowingly award contracts in violation of KRS 121.056(2);
2. Any person who knowingly receives such a contract;
3. Knowing violations of KRS 121.056(3) (pay-to-play restrictions).

Conviction can result in forfeiture of office.

**Application to JCDEC**: Officer criminal exposure realistic mainly in extreme cases — knowing acceptance of corporate funds, knowing falsification of reports, or pay-to-play structures. Officers should never treat criminal penalties as theoretical.

## Statute numbers Lisa sometimes sees that DON'T EXIST as standalone

- **KRS 121.235** (electronic filing) — content lives in KRS 121.120(6)(i) and 121.180(2).
- **KRS 121.310** (enforcement/complaints) — content lives in KRS 121.120, 121.140, 121.215; 32 KAR 2:040.
- **KRS 121.330** (confidentiality) — no counterpart; public-disclosure presumption governs (KRS 121.120(4)(d); 121.180(8)).

Criminal penalties are at **KRS 121.990**, not KRS 121.215 or 121.220.

## KRS Chapter 121A — Public Financing of Gubernatorial Campaigns

Voluntary partial public financing program for slates of candidates for Governor and Lieutenant Governor. $1,800,000 cap ($600,000 raised privately + $1,200,000 disbursed from Public Financing Campaign Fund). Donors above the limit barred from gubernatorial appointive office during that term.

**Application to JCDEC**: KRS Chapter 121A does NOT touch JCDEC. The DEC has no filing, accounting, or eligibility obligations under 121A.


---

<!-- SOURCE: references/04-state-admin-regs-32-kar.md -->

# Kentucky Administrative Regulations — Title 32 KAR (KREF)

## Scope

Use this file for the operational regulations implementing KRS Chapter 121. Title 32 KAR has only two chapters, both administered by KREF.

**Important threshold finding**: Kentucky has NO Title 32 reg on federal/non-federal account allocation. For any federally-related party activity, allocation rules come from 11 CFR Part 106 (FEC). See `references/07-federal-soft-money-and-levin.md`.

## Chapter 1 — Reports and Forms

Chapter 1 begins at 1:020 (there is no 1:010).

### 32 KAR 1:020 — Statement of spending intent and appointment of campaign treasurer

Implements KRS 121.160(1) and 121.180(1)(a). CANDIDATE reg (not committee). Requires candidates to designate a campaign treasurer or self-designate, and to declare spending intent / reporting-exemption status, through KEFMS before campaigning.

**Application to JCDEC**: Indirect. Reg governs candidates JCDEC may endorse or coordinate with, not the DEC itself. JCDEC's treasurer obligations come from KRS 121.170 and the registration step in 32 KAR 1:050.

**Practical takeaway**: Confirm any JCDEC-endorsed candidate has filed their treasurer designation in KEFMS before booking in-kind support.

### 32 KAR 1:030 — Campaign finance statements

Implements KRS 121.180. All candidates, slates, contributing organizations, and committees — including executive committees — file campaign finance reports electronically through KEFMS.

**Critical for DECs**: If an executive committee has **$10,000 or more** in its campaign account at any time in the 12 months before July 1, it must file SEMIANNUALLY under KRS 121.180(2)(c). Tax-checkoff (ITC) funds count toward the threshold. Executive committees under $10,000 must affirmatively certify in KEFMS by July 31 each year that no report is due.

**Application to JCDEC**: Directly governs JCDEC's filing cadence. If JCDEC raises and holds even one mid-sized event's gross over $10K within the 12-month look-back, it triggers semiannual filing for the rest of that cycle.

**Practical takeaway**: Track JCDEC's running balance against the $10,000 trigger. If under, do not skip the July 31 "no-report" certification.

### 32 KAR 1:050 — Political organization registration

Implements KRS 121.015(3),(4), 121.170, 121.180. The foundational reg that establishes the legal identity of executive committees, caucus campaign committees, political issues committees, permanent committees (PACs), inaugural committees, executive committees, and contributing organizations. All register through KEFMS at kref.ky.gov. Last amended effective 1/2/2024.

Quotes the "executive committee" definition from KRS 121.015(3)(f) verbatim.

**Application to JCDEC**: This is the foundational reg that establishes JCDEC's legal identity as an "executive committee" under KRS 121 and forces it to register and maintain registration via KEFMS.

**Practical takeaway**: Confirm JCDEC's KEFMS registration is current. Officer/treasurer info must match the DEC bylaws/governing document.

### 32 KAR 1:080 — Report of an independent expenditure

Implements KRS 121.150 and 121.180. Establishes the electronic report used by any individual, committee, or other group that makes independent expenditures exceeding **$500 in aggregate per election** to report directly to KREF. Filed in KEFMS.

**Application to JCDEC**: A DEC's coordinated expenditures on behalf of party nominees are NOT independent expenditures by definition — they're coordinated. But if JCDEC ever spends on a race outside coordination with a candidate, or if JCDEC's name is invoked by an outside spender, this reg defines the reporting trigger.

**Practical takeaway**: Avoid the IE label entirely; coordinated party support is reported on the regular committee report, not as an IE.

### 32 KAR 1:090 / 1:100 / 1:190 — Financial disclosure / slate software / gubernatorial slate forms

Disclosure for candidates/officeholders; gubernatorial slate-related forms.

**Application to JCDEC**: Not directly applicable to JCDEC operations.

## Chapter 2 — Practice and Procedure

### 32 KAR 2:020 — General provisions

Implements KRS 121.120 and 121.140. Defines Chapter 2 terms ("Chairman," "Complainant," "Complaint"), adopts KRS 446.030 for time computation, and provides that enforcement matters may be initiated either by a written complaint or by KREF internally on information gained in the normal course of duties.

### 32 KAR 2:030 — Complaints; internally-generated matters

Written complaints alleging Title 32 / KRS 121 violations are filed with KREF's General Counsel. Respondents get notice and **15 days** to respond. KREF's General Counsel determines whether to open an investigation. Complaints must be filed within **one year** of the alleged violation (or, for continuing violations, before the practice ends or the complaint is filed).

**Practical takeaway**: Calendar the 15-day response window the moment any KREF complaint notice arrives.

### 32 KAR 2:040 — Investigatory procedures (KREF audits flow from here)

Establishes KREF's investigation toolkit: field investigations, AUDITS, written questions under oath, subpoenas (issued by Chairman or General Counsel), depositions, briefing procedures, and probable-cause findings. KREF audits are conducted under THIS reg — there is no separate "audit procedures" reg.

**Application to JCDEC**: Defines what KREF can demand from JCDEC during a probe — books, depositions, sworn statements from officers including the Vice Chair.

**Practical takeaway**: Maintain audit-ready records (bank statements, KEFMS entries, contribution receipts, vendor invoices) so a subpoena response is mechanical, not panicked.

### 32 KAR 2:050 — Conciliation

After a probable-cause finding, General Counsel and Executive Director attempt informal conciliation. The window is at least 15 days when probable cause is found within 45 days of an election, otherwise at least 30 days. Agreements are non-binding until signed by respondent, General Counsel, Executive Director, AND approved by the registry, then made public.

**Application to JCDEC**: This is the off-ramp from formal adjudication. Most DEC matters can and should be resolved here.

### 32 KAR 2:060 — Advisory opinions

Implements KRS 121.135. Any person may request a written advisory opinion. Requests go to KREF General Counsel; KREF posts qualifying requests publicly and accepts comment for **10 calendar days**, then issues the opinion.

**Application to JCDEC**: The safest path when facing a novel question (e.g., a particular in-kind arrangement, a fundraising structure, coordination with an LD committee) is a written AO request before acting.

### 32 KAR 2:070 — Fundraiser registration

Paid/professional fundraisers operating under KRS Chapter 121 must register.

**Application to JCDEC**: Relevant only if JCDEC retains a paid outside fundraiser.

### 32 KAR 2:080 — Political activities of registry members and employees

Internal-conduct rule limiting political activity of KREF commissioners and staff.

**Application to JCDEC**: Applies to the regulator, not the regulated.

### 32 KAR 2:100 — Postelection and supplemental reports

Implements KRS 121.180(4) and (7). The 30-day post-primary report covers contributions/expenditures/debts through midnight of primary election day. Post-regular-election supplemental reports continue until debts are paid/assumed and balance is transferred or otherwise disposed of.

**Note**: This reg is "Postelection and supplemental reports," NOT allocation between federal and non-federal accounts. Kentucky has no Title 32 reg on federal/non-federal account allocation.

**Practical takeaway**: Don't stop filing just because election day passed — supplemental reports continue until the books are clean.

### 32 KAR 2:110 — Disclaimers

Implements KRS 121.190(1). Extends statutory disclaimer requirements to additional ad formats. Disclaimer = "paid for by" identification. Exempts items smaller than 3.5" x 5" calling cards, plus pens, pencils, emery boards, fly swatters, matchbooks, bumper stickers, and clothing. Multi-page mailers comply if at least one page bears the disclaimer.

**Application to JCDEC**: Every DEC-funded mailer, digital ad, robocall, yard sign, and printed handbill needs a "Paid for by Jefferson County Democratic Executive Committee" line.

### 32 KAR 2:130 — Monetary contributions in non-cash format / refunds

Prohibits accepting any non-cash monetary contribution above the KRS 121.150(4) cash limit unless the payment generates a paper or electronic record clearly identifying payor and payee. Also addresses refund mechanics.

**Application to JCDEC**: Every DEC contribution above the cash cap must come through a traceable channel (check, ACH, card processor). Stripe/ActBlue/checks only above the cash threshold.

### 32 KAR 2:170 — In-kind contributions

Adopts KRS 121.015(6)(b),(c) definitions. Prohibits disguising illegal contributions as in-kind. UNINCORPORATED business enterprises may give in-kind; corporate owners may give in-kind ONLY with personal funds and full reimbursement to the corporation, capped at the individual contribution limit. Discounts below normal commercial rates are valued at the spread (the discount = in-kind contribution).

**Application to JCDEC**: Volunteers' personal donations of food, printing, venue space, etc., must be valued at fair market and reported. Vendor "comps" = reportable in-kind.

**Practical takeaway**: Establish a written intake form for every in-kind donation with valuation, donor info, and corporate-status check.

### 32 KAR 2:180 — Extension of credit

Deferred billing or unpaid vendor debt to a candidate or committee can be recharacterized as a contribution if the totality of evidence shows the terms are not commercially reasonable. Factors: vendor's political ties to recipient, whether credit exceeds amounts extended to non-political customers, and whether terms differ from arm's-length norms.

**Application to JCDEC**: Vendors who let DEC invoices age beyond normal commercial terms create reclassification risk.

**Practical takeaway**: Pay vendors on terms identical to their non-political customers; document terms in writing.

### 32 KAR 2:190 — Committee affiliation

Implements KRS 121.150 contribution limits across affiliated committees. KREF treats committees as one for contribution-limit purposes if they share bylaws, structure, or registration; common control; overlapping officers/decision-makers; shared funds; or alter-ego indicia.

**Application to JCDEC**: CRITICAL for any structural relationship between JCDEC and LD committees, the KDP, or affiliated PACs. If KREF determines affiliation, contribution caps AGGREGATE across the affiliated committees from a single donor.

**Practical takeaway**: Document the operational independence of JCDEC from LDs and any caucus committees — separate bank accounts, separate decision-making, separate registration.

### 32 KAR 2:200 — Allowable campaign expenditures

Lists allowable categories: items bearing candidate name/likeness for distribution, charitable/civic donations that advance the candidacy via advertising, GOTV transportation, distribution and staff services directly tied to candidacy, and event tickets the candidate or representative actually attends. Prohibits: dues to organizations the individual wants to join, and expenditures to defray costs of officeholder duties. If KREF questions an expenditure, the burden is on the spender to prove direct/primary relation to the candidacy.

**Application to JCDEC**: Although the reg's phrasing is candidate-centered, KREF applies the "direct and primary relation" standard to executive committee expenditures (substitute "party purpose" for "candidacy").

**Practical takeaway**: Keep a one-line "party purpose" memo on each non-routine expenditure to preserve the record.

### 32 KAR 2:210 — Judicial hearing procedures

Procedures for KREF hearings under KRS 121.140(4).

### 32 KAR 2:230 — Open records / Processing of records requests

KREF's procedures for Open Records Act requests. Registrations, reports, advisory opinions, and conciliation agreements are public.

**Application to JCDEC**: All JCDEC KEFMS filings, registration data, and any signed conciliation agreement are public.

## Regulations that DON'T EXIST

- **32 KAR 1:010** — does not exist; Chapter 1 begins at 1:020.
- **32 KAR 1:045** — repealed.
- **32 KAR 1:046** — expired.
- **32 KAR 1:070** — repealed.
- **32 KAR 2:140** — does not exist (gap in numbering). Independent expenditures are governed by 32 KAR 1:080 (reporting) and KRS 121.150/121.180.
- **32 KAR 2:220 / 2:221** — repealed.

If you see these reg numbers referenced anywhere, treat as obsolete.

## Quick reference — the 8 regs JCDEC actually lives by

1. **32 KAR 1:050** — register and maintain "executive committee" status in KEFMS.
2. **32 KAR 1:030** — file campaign finance reports (semiannual if ≥$10K; otherwise annual no-report certification by July 31).
3. **32 KAR 2:100** — keep filing supplemental reports post-election until books are clean.
4. **32 KAR 2:110** — disclaimer on every paid communication.
5. **32 KAR 2:130** — only traceable money above the cash cap.
6. **32 KAR 2:170** — value and report all in-kind donations including vendor discounts.
7. **32 KAR 2:190** — preserve operational independence from LDs/KDP/caucus committees to avoid contribution-limit aggregation.
8. **32 KAR 2:060** — request an advisory opinion before doing anything novel.


---

<!-- SOURCE: references/05-federal-contribution-limits.md -->

# Federal Contribution Limits (2025-2026 Cycle)

## Scope

Use this file for any question about federal contribution limits — to or from federal candidates, party committees, PACs. Federal limits are governed by 52 USC 30116 and 11 CFR Part 110. Limits indexed for inflation in odd-numbered years.

## Master table — 2025-2026 federal contribution limits

| Donor | Federal candidate | PAC (SSF / nonconnected) | State/district/local party (KDP/JCDEC combined) | National party | National party additional accounts |
|---|---|---|---|---|---|
| Individual | $3,500 / election | $5,000 / year | $10,000 / year (combined) | $44,300 / year | $132,900 per account / year |
| Candidate committee | $2,000 / election | $5,000 / year | Unlimited transfers | Unlimited transfers | — |
| Multicandidate PAC | $5,000 / election | $5,000 / year | $5,000 / year (combined) | $15,000 / year | $45,000 per account / year |
| Non-multicandidate PAC | $3,500 / election | $5,000 / year | $10,000 / year (combined) | $44,300 / year | $132,900 per account / year |
| State/district/local party | $5,000 / election (combined) | $5,000 / year (combined) | Unlimited transfers | Unlimited transfers | — |
| National party | $5,000 / election (House); $35,000 base / $62,000 indexed combined (Senate) | $5,000 / year | Unlimited transfers | Unlimited transfers | — |

\* Indexed for inflation in odd-numbered years.
\*\* National party + Senatorial Campaign Committee combined to a Senate candidate.

**Cite**: `[52 USC 30116]`, `[11 CFR 110.1]`, `[11 CFR 110.2]`, `[11 CFR 110.3]`. FEC chart: https://www.fec.gov/help-candidates-and-committees/taking-receipts-political-party/contribution-limits-party-committees/

## The $35,000 / $62,000 combined Senate limit (52 USC 30116(h))

**Statutory text** (52 USC 30116(h)):
> "Notwithstanding any other provision of this Act, amounts totaling not more than $35,000 may be contributed to a candidate for nomination for election, or for election, to the United States Senate during the year in which an election is held in which he is such a candidate, by the Republican or Democratic Senatorial Campaign Committee, or the national committee of a political party, or any combination of such committees."

- **Base statutory amount**: $35,000 (from BCRA 2002).
- **2025-2026 indexed amount**: **$62,000 combined** from DNC + DSCC per cycle.
- **Applies to**: U.S. Senate candidates only.
- **House**: No equivalent special cap. National party limit to House candidate = $5,000 per election (standard 30116(a)(2)(A)).

**Application to Booker (US Senate KY 2026)**: DNC and DSCC combined can give Booker's principal campaign committee no more than $62,000 for the 2025-2026 cycle (across primary and general combined). Separate from coordinated party expenditures (different framework, see `references/06-federal-coordinated-expenditures.md`).

**Application to JCDEC**: This is not JCDEC's limit. It governs what the national-level Democratic apparatus can contribute directly to Booker. But it bounds the federal-money flow available to support him.

## The shared $5,000 per-election state/local party limit

**Statutory cite**: `[52 USC 30116(a)(2)(A)]`; `[11 CFR 110.3(b)]`.

A state party committee and ALL its subordinate state, district, and local committees that are AFFILIATED with one another share a SINGLE $5,000 per-election limit to any federal candidate.

Affiliation per 11 CFR 100.5(g) and 110.3(b): committees of the same political party operating at state and local levels within a state are presumptively affiliated and share contribution limits.

**Application to JCDEC**: KDP + JCDEC + every other Kentucky Democratic LD committee + every other KY county DEC = ONE combined $5,000 limit per federal candidate per election. If KDP already gave Booker $5,000 in the primary, neither JCDEC nor any other KY Dem subordinate may give Booker any additional money in the primary.

**Practical takeaway**: Before any JCDEC check to a federal candidate, coordinate with KDP. There's a single shared pool.

## Individual contribution limits — federal

| To | Limit | Cite |
|---|---|---|
| Federal candidate | $3,500 / election (primary + general count separately = $7,000 / cycle) | 52 USC 30116(a)(1)(A); indexed |
| Multicandidate PAC | $5,000 / year | 52 USC 30116(a)(1)(C) |
| Non-multicandidate PAC | $3,500 / year | 52 USC 30116(a)(1)(A) |
| State/district/local party committees (KDP + JCDEC + all subordinates combined) | $10,000 / year combined | 52 USC 30116(a)(1)(D); 11 CFR 110.3(b) |
| National party committee | $44,300 / year | 52 USC 30116(a)(1)(B); indexed |
| National party additional accounts (convention, recount, HQ building) | $132,900 per account / year | 52 USC 30116(a)(9); indexed |

## $100 cash limit, $50 anonymous limit (federal)

- Cash contributions of currency from any one source: capped at $100. Excess returned. `[11 CFR 110.4(c)]`.
- Anonymous contribution limit: $50. Any amount above must be "promptly disposed of" — used for any lawful purpose unrelated to any federal election, candidate, or campaign. `[11 CFR 110.4(c)]`.

(Kentucky state limit is $100 anonymous per contributor / $2,000 aggregate per election. Federal floor is lower for anonymous.)

## In-kind contributions — federal

The value of an in-kind contribution counts against the contribution limit as a gift of money does. Includes goods, services, advertising, anything of value, including coordinated expenditures.

**Application to JCDEC**: A JCDEC coordinated communication naming Booker (subject to the federal coordinated party expenditure framework) does not count against the affiliated $5,000 contribution limit if treated as a coordinated party expenditure under 11 CFR 109.33. But if treated as an in-kind contribution (e.g., not made under the coordinated party expenditure framework), it counts against the $5,000 affiliated cap. The two pools are separate.

## Candidate-to-candidate / candidate-to-party transfers (federal)

- Federal candidate's principal campaign committee may contribute up to **$2,000 per election** to another federal candidate. `[52 USC 30116(a)(8)]`.
- Federal candidate's principal campaign committee may contribute **$5,000 per year** to a multicandidate PAC.
- Federal candidate's principal campaign committee may make **UNLIMITED transfers** to a party committee.
- Note: "Unlimited transfers" applies only between federal accounts. Federal candidate funds may not be used to support state/non-federal accounts directly without separate state-source accounting.

## Joint fundraising committees (JFCs)

Common structure: KDP + JCDEC + a federal candidate's principal campaign committee jointly raise funds through a Joint Fundraising Committee, with proceeds allocated per a written JFC agreement, each participant subject to its own individual contribution limits.

**Cite**: `[11 CFR 102.17]`.

**Application to JCDEC**: JFCs are a legitimate way to do joint fundraising with KDP and federal candidates, BUT each donor's contribution must still respect all individual limits (e.g., $3,500/election to the candidate, $10,000/year combined to KDP+JCDEC, etc.). JFCs amplify reach, not limits.

## Indexed limits — what changes in odd years

Per 52 USC 30116 inflation indexing:

- Individual → candidate
- Individual → party committee
- Non-multicandidate PAC → candidate
- National party committee receipt limits

NOT indexed (statutory fixed):
- Multicandidate PAC → candidate ($5,000)
- Federal candidate → another candidate ($2,000)
- Federal candidate → multicandidate PAC ($5,000)

## Quick reference — Booker (US Senate KY 2026)

| Donor | To Booker | Limit |
|---|---|---|
| Individual | Booker | $3,500 / election ($7K cycle) |
| Multicandidate PAC | Booker | $5,000 / election |
| KDP + JCDEC + all KY Dem subordinates combined | Booker | $5,000 / election |
| DNC + DSCC combined (direct contribution) | Booker | $62,000 / cycle |
| Corporation / LLC / labor org | Booker (direct contribution) | PROHIBITED |
| KDP coordinated party expenditure | Booker | $468,800 (separate from contribution limits) |

## Quick reference — McGarvey (US House KY-3 2026)

| Donor | To McGarvey | Limit |
|---|---|---|
| Individual | McGarvey | $3,500 / election ($7K cycle) |
| Multicandidate PAC | McGarvey | $5,000 / election |
| KDP + JCDEC + all KY Dem subordinates combined | McGarvey | $5,000 / election |
| DNC / DCCC | McGarvey | $5,000 / election (no special Senate-style cap) |
| Corporation / LLC / labor org | McGarvey (direct contribution) | PROHIBITED |
| KDP coordinated party expenditure | McGarvey | $65,300 (separate from contribution limits) |


---

<!-- SOURCE: references/06-federal-coordinated-expenditures.md -->

# Federal Coordinated Party Expenditures

## Scope

Use this file when the question involves coordinated party expenditures for FEDERAL candidates — the framework where state and county parties share a single pool per candidate. Statutory home: **52 USC 30116(d)**. Regulatory home: **11 CFR 109.32 and 109.33**.

## What "coordinated party expenditure" means

A coordinated party expenditure (also called a "441a(d) expenditure," from the pre-recodification cite) is spending by a party committee on behalf of a federal candidate that:

1. May be coordinated with the candidate (consultation, cooperation, request);
2. Is reported only by the party committee, not by the candidate;
3. Is subject to a separate statutory dollar limit by state and office; and
4. Does not count against the standard contribution limit ($5,000 per election from a state/local party committee to a federal candidate).

**Cite**: `[52 USC 30116(d)]`; `[11 CFR 109.32]`; `[11 CFR 109.37]` (reporting on Form 3X line 25, Schedule F).

## The pool: who shares with whom

Under `[52 USC 30116(d)(3)]` and `[11 CFR 109.32(b)]`:

- **National party committee** has its own coordinated expenditure pool per federal candidate.
- **State party committee** has its own SEPARATE coordinated expenditure pool per federal candidate seeking election in that state.
- **District or local party committee** (e.g., JCDEC, an LD committee) has NO independent pool — it may only spend coordinated dollars if the state or national committee assigns authority in writing.

**Verbatim from 11 CFR 109.33(b)**:
> "State committees and subordinate State committees and such district or local committees combined shall not exceed the coordinated party expenditure limits set forth in 11 CFR 109.32."

This is the "state party + county party compete for the same pool" rule. KDP holds the pool; JCDEC can only spend out of it by assignment.

## Authority to make coordinated party expenditures

| Type of party committee | Authority |
|---|---|
| National party committee (DNC, etc.) | May make expenditures on behalf of Senate, House, and Presidential nominees. May authorize other party committees to make expenditures against its own spending limits. Shares limits with national congressional and senatorial campaign committees. |
| State party committee (KDP) | May make expenditures on behalf of Senate and House nominees seeking election in the committee's state. May authorize other party committees to make expenditures against its own spending limits. May be authorized by national committee to make expenditures on behalf of presidential nominee that count against the national committee's limit. |
| Local party committee (JCDEC) | May be authorized by national or state party committee to make expenditures against its limits. |

**Cite**: FEC Coordinated Party Expenditure Limits page; `[11 CFR 109.32]`.

## The assignment rule (11 CFR 109.33(a))

**Verbatim**:
> "The national committee of a political party and a State committee of a political party, including any subordinate committee of a State committee, may assign its authority to make coordinated party expenditures authorized by 11 CFR 109.32 to another political party committee. Such an assignment must be made in writing, must state the amount of the authority assigned, and must be received by the assignee committee before any coordinated party expenditure is made pursuant to the assignment."

Recordkeeping under `[11 CFR 109.33(c)]`: Both the assignor and assignee must maintain the written assignment for at least 3 years.

**Application to JCDEC**: Before JCDEC makes any coordinated party expenditure for a federal candidate, KDP must provide a written assignment specifying the dollar amount. JCDEC keeps the letter for 3 years.

## Combined limit enforcement (11 CFR 109.33(b))

State committee compliance options:

1. **Consolidated reporting**: The state committee (KDP) is responsible for ensuring that the coordinated party expenditures of the entire party organization are within the coordinated party expenditure limits, including receiving reports from any subordinate committee (JCDEC, LD committees) and filing consolidated reports with the FEC.
2. **Alternative method**: Any other method submitted in advance and approved by the FEC that permits control over coordinated party expenditures.

**Application to JCDEC**: JCDEC must report its coordinated expenditures to KDP for KDP's consolidated FEC report. KDP, not JCDEC, files Schedule F for the state-level coordinated expenditure pool.

## 2026 coordinated party expenditure limits — Kentucky

From the FEC's 2026 published table (March 3, 2026):

| Race | KY voting age population | KDP coordinated expenditure pool |
|---|---|---|
| U.S. Senate (Booker) | 3,590,081 | **$468,800** |
| U.S. House KY-3 (McGarvey) | n/a | **$65,300** |

**Senate formula**: VAP × $0.02 × COLA. 2026 COLA = 6.52944. 3,590,081 × $0.02 × 6.52944 ≈ $468,800.

**House formula**: Flat. $65,300 for House nominees in states with multiple representatives (KY has 6 House seats). $130,600 for House nominees in states with one representative.

**Cite**: `[52 USC 30116(d)]`; `[11 CFR 109.32]`; FEC 2026 limits at https://www.fec.gov/help-candidates-and-committees/making-disbursements-political-party/coordinated-party-expenditures/coordinated-party-expenditure-limits/

## Senate coordinated limits — full 2026 table

| State | VAP | 2026 Senate limit |
|---|---|---|
| Alabama | 4,075,161 | $532,200 |
| Alaska | 565,570 | $130,600 |
| Arizona | 6,026,503 | $787,000 |
| Arkansas | 2,416,023 | $315,500 |
| California | 31,180,511 | $4,071,800 |
| Colorado | 4,792,358 | $625,800 |
| Connecticut | 2,970,201 | $387,900 |
| Delaware | 849,963 | $130,600 |
| Florida | 19,019,796 | $2,483,800 |
| Georgia | 8,796,778 | $1,148,800 |
| Hawaii | 1,151,103 | $150,300 |
| Idaho | 1,557,631 | $203,400 |
| Illinois | 10,100,540 | $1,319,000 |
| Indiana | 5,397,168 | $704,800 |
| Iowa | 2,518,739 | $328,900 |
| Kansas | 2,294,452 | $299,600 |
| **Kentucky** | **3,590,081** | **$468,800** |
| Louisiana | 3,568,234 | $466,000 |
| Maine | 1,170,629 | $152,900 |
| Maryland | 4,928,480 | $643,600 |
| Massachusetts | 5,826,510 | $760,900 |
| Michigan | 8,065,114 | $1,053,200 |
| Minnesota | 4,547,092 | $593,800 |
| Mississippi | 2,295,720 | $299,800 |
| Missouri | 4,910,413 | $641,200 |
| Montana | 913,041 | $130,600 |
| Nebraska | 1,538,757 | $200,900 |
| Nevada | 2,603,663 | $340,000 |
| New Hampshire | 1,170,277 | $152,800 |
| New Jersey | 7,557,289 | $986,900 |
| New Mexico | 1,686,046 | $220,200 |
| New York | 16,097,036 | $2,102,100 |
| North Carolina | 8,838,026 | $1,154,100 |
| North Dakota | 616,388 | $130,600 |
| Ohio | 9,368,603 | $1,223,400 |
| Oklahoma | 3,165,587 | $413,400 |
| Oregon | 3,461,772 | $452,100 |
| Pennsylvania | 10,488,801 | $1,369,700 |
| Rhode Island | 916,867 | $130,600 |
| South Carolina | 4,421,834 | $577,400 |
| South Dakota | 714,952 | $130,600 |
| Tennessee | 5,739,349 | $749,500 |
| Texas | 24,109,307 | $3,148,400 |
| Utah | 2,616,637 | $341,700 |
| Vermont | 535,049 | $130,600 |
| Virginia | 7,019,802 | $916,700 |
| Washington | 6,366,184 | $831,400 |
| West Virginia | 1,421,798 | $185,700 |
| Wisconsin | 4,750,680 | $620,400 |
| Wyoming | 461,419 | $130,600 |

## Coordinated party expenditure vs. contribution — the distinction

| | Contribution | Coordinated party expenditure |
|---|---|---|
| Money flows to candidate? | Yes, direct | No, party spends on behalf |
| Limit | $5,000 / election (shared KDP+JCDEC) | State pool: $468,800 (Senate KY) / $65,300 (House) |
| Reported by | Candidate AND party | Party only (FEC Form 3X line 25, Schedule F) |
| Counts against contribution cap | Yes | No (separate pool) |
| Coordination with candidate allowed? | N/A (it's a direct transfer) | Yes — that's the whole point |

## The state-vs-county pool dynamics — practical flow

Step 1: KDP has its own coordinated expenditure authority for each federal nominee.

Step 2: KDP decides whether to spend the full amount itself or assign part to subordinate committees.

Step 3: If assigning to JCDEC, KDP gives written assignment specifying the amount BEFORE JCDEC makes any coordinated expenditure. JCDEC keeps the letter for 3 years.

Step 4: KDP + JCDEC + any other KY subordinate committees combined coordinated expenditures on behalf of the same federal candidate cannot exceed the state pool ($468,800 Senate / $65,300 House for 2026).

Step 5: KDP files consolidated reports showing all coordinated expenditures statewide OR submits FEC-approved alternative compliance method in advance.

Step 6: National committees (DNC, DSCC, DCCC) may also spend coordinated dollars. National + state share national limits for presidential; Senate and House have separate state-level pools.

## Coordinated vs. independent expenditures — bright line

**Independent expenditure** (52 USC 30116(d) does NOT cap these): Communication expressly advocating election/defeat of a clearly identified federal candidate, made WITHOUT coordination, consultation, or cooperation. No dollar limit. Reporting required (>$250 itemized for party committees per 11 CFR 109).

**Coordinated party expenditure**: Subject to the state pool above. Made WITH coordination.

**Crucial**: A communication that is intended to be independent but contains indicators of coordination (e.g., shared vendors with the candidate, shared political strategy meetings, the candidate's authorization or knowledge) can be reclassified as an in-kind contribution or coordinated expenditure. See 11 CFR 109.20-109.23 for coordination criteria.

**Application to JCDEC**: JCDEC IEs for Booker or McGarvey require a strict firewall — no shared staff/vendors with the candidate's campaign, no coordination meetings, no advance approval by the candidate. Document the firewall.

## NRSC v. FEC (pending at SCOTUS)

**Case**: National Republican Senatorial Committee, et al. v. Federal Election Commission, No. 24-621.

**Status**: Oral argument December 9, 2025. Decision expected anytime through June 2026.

**Question**: Constitutionality of the coordinated party expenditure limits in 52 USC 30116(d).

**Possible outcome**: If SCOTUS strikes the limits, the entire framework above goes away. KDP would have UNLIMITED coordinated capacity for Booker, McGarvey, and other federal candidates. JCDEC's role and the assignment requirement under 11 CFR 109.33 could be reshaped.

**Source**: https://www.fec.gov/legal-resources/court-cases/national-republican-senatorial-committee-et-al-v-federal-election-commission-et-al-22-639/

**Practical takeaway**: Calendar monthly check of SCOTUS docket. If limits fall mid-cycle, JCDEC and KDP should be prepared to revisit coordinated expenditure strategy.

## Summary for the chat feature

If user asks: "Can JCDEC make coordinated party expenditures for Booker / McGarvey?"

**Answer**:
- Only if KDP assigns authority in writing under 11 CFR 109.33(a).
- Combined KDP + JCDEC + all KY subordinate Dem committees cannot exceed:
  - **$468,800** for Booker (US Senate KY)
  - **$65,300** for McGarvey (US House KY-3)
- JCDEC keeps the written assignment letter for 3 years.
- KDP files consolidated FEC reports showing all coordinated expenditures statewide.
- Pending NRSC v. FEC could strike these limits in 2026.

If user asks: "What's the difference between a coordinated expenditure and a direct contribution to a federal candidate?"

**Answer**:
- Direct contribution: $5,000 per election, shared across KDP + JCDEC + all KY Dem subordinates.
- Coordinated party expenditure: $468,800 (Senate KY) / $65,300 (House) — separate pool, KDP holds, JCDEC needs assignment.
- They are DIFFERENT pools and DO NOT count against each other.


---

<!-- SOURCE: references/07-federal-soft-money-and-levin.md -->

# Federal Soft Money, Levin Funds, and Federal Election Activity (FEA)

## Scope

Use this file for questions involving 52 USC 30125 (BCRA Title I — the soft money ban), Levin funds, Federal Election Activity (FEA), and the federal account structure required of state and local party committees that engage in federal-related activity. This is the most consequential federal framework for JCDEC's operational life.

## The big picture

After BCRA (2002), state, district, and local party committees can no longer freely use "soft money" (non-federal funds) for any activity that touches a federal election. They must:

1. Use federal (FECA-compliant) funds for any "Federal Election Activity" (FEA);
2. EXCEPT they may use a limited "Levin fund" mix for narrow categories of FEA;
3. Maintain a structured account system to keep federal, Levin, and non-federal money separate;
4. Once $5,000 of FEA receipts + disbursements in a calendar year, file MONTHLY FEC reports.

## Who's covered (52 USC 30101(14)-(15); 11 CFR 100.14)

JCDEC is a "local committee of a political party" under 30101(14). It is therefore governed by 52 USC 30125(b) (state/local party rules), NOT the 30125(a) flat ban that governs the DNC, DCCC, DSCC.

## 52 USC 30125(a) — National party total soft money ban

**Verbatim core**:
> "A national committee of a political party (including a national congressional campaign committee of a political party) may not solicit, receive, or direct to another person a contribution, donation, or transfer of funds or any other thing of value, or spend any funds, that are not subject to the limitations, prohibitions, and reporting requirements of this Act."

Extends to officers, agents, and any entity "directly or indirectly established, financed, maintained, or controlled by" a national committee.

**Application to JCDEC**: Does not directly govern JCDEC, but JCDEC cannot be treated as DNC-controlled or it gets swept into the flat ban. JCDEC also cannot jointly fundraise with national party committees for Levin or non-federal money (30125(b)(2)(C); 11 CFR 300.31(e)-(f)).

**Practical takeaway**: Keep clear organizational separation from the DNC, DCCC, DSCC. Money from a national committee to JCDEC must be 100% federally compliant hard dollars.

## 52 USC 30125(b)(1) — State/local party FEA must be hard money

**Verbatim**:
> "An amount that is expended or disbursed for Federal election activity by a State, district, or local committee of a political party … shall be made from funds subject to the limitations, prohibitions, and reporting requirements of this Act."

**Application to JCDEC**: Any JCDEC spending that meets the FEA definition must be paid from a FECA-compliant federal account (or a properly allocated federal + Levin mix). The Levin exception in 30125(b)(2) is the only relief.

## What is "Federal Election Activity" (FEA)?

**Statutory cite**: `[52 USC 30101(20)(A)]`. **Regulatory cite**: `[11 CFR 100.24]`.

Four categories:

### Type 1 FEA — Voter registration in the 120-day window

Voter registration activity during the **120 days ending on the date of a regularly scheduled federal election**. Per 11 CFR 100.24(a)(2), includes urging registration by mail, e-mail, phone, in-person; preparing/distributing forms; transporting potential registrants. Does NOT include an incidental "register to vote" exhortation tucked into an unrelated event.

### Type 1 FEA (continued) — Voter ID / GOTV / generic campaign activity

Voter identification, GOTV, or generic campaign activity conducted "in connection with an election in which a candidate for Federal office appears on the ballot" (regardless of whether a state or local candidate is also on the ballot).

"Generic campaign activity" defined at 11 CFR 100.25 as activity that promotes a political party and does not promote any specific candidate.

### Type 2 FEA — Public communications referring to a clearly identified federal candidate

Public communications that refer to a clearly identified federal candidate AND promote/support/attack/oppose any candidate for that office (regardless of whether the communication expressly advocates).

"Public communications" defined at 11 CFR 100.26: broadcast, cable, satellite, newspaper, magazine, outdoor advertising, mass mailing (>500 substantially similar pieces), phone bank (>500 substantially similar calls), or any other form of general public political advertising.

### Salaries/wages (Type 4)

Salaries or wages for any party employee who spends more than 25% of compensated time in a given month on activities in connection with a federal election (treated as full federal — see 11 CFR 300.33(d)(2)).

## Application to JCDEC's Louisville operations

Because Kentucky's U.S. House races (KY-3 covers Louisville) occur every two years, and Senate races every six, **almost every JCDEC voter contact, registration, and GOTV activity in any even-numbered year is FEA**. Even in odd-numbered years (Louisville Metro Mayor, Council, JCPS), if a special federal election is on the ballot, FEA rules attach.

**Treat as FEA**:
- All voter registration in the 120 days before a federal election
- All GOTV in any federal-ballot election year
- All generic "Vote Democrat" mail/digital ads in a federal year
- All communications naming a federal candidate (Booker, McGarvey)
- Salaries of JCDEC employees spending >25% time/month on federal-connected work

## 52 USC 30125(b)(2) — The Levin Amendment exception

**What it permits**: Local/state/district committees may use a federal/non-federal ALLOCATED MIX to pay for Type 1 FEA (voter registration in the 120-day window + voter ID/GOTV/generic campaign activity) — instead of 100% federal funds.

**Four statutory conditions (30125(b)(2)(B))**:

1. Activity does NOT refer to a clearly identified federal candidate.
2. The disbursement is NOT for any broadcasting/cable/satellite communication (except one referring solely to a clearly identified state/local candidate).
3. The non-federal share is "donated in accordance with State law" AND **no donor may give more than $10,000 of Levin funds per calendar year** to a particular state, district, or local party committee. Per 11 CFR 300.31(d)(2), if Kentucky law sets a lower limit it controls; if higher, the $10,000 federal cap controls.
4. The funds must be raised by the **same committee** that spends them — no transfers in from other party committees, the national party, or their agents/affiliates.

**Anti-coordination rule (30125(b)(2)(C))**: Levin funds must not be solicited, received, directed, transferred, or spent "by or in the name of" any person covered by 30125(a) (national parties) or 30125(e) (federal candidates/officeholders). No joint fundraising for Levin across two or more state/district/local committees.

**Application to JCDEC**: JCDEC may open a Levin account and raise up to $10,000/donor/year to allocate a portion of voter registration, voter ID, GOTV, and generic campaign costs.

**Critical**: JCDEC must raise its own Levin money. CANNOT use Levin dollars routed from KDP, another county party, the DNC, or any federal candidate.

A federal officeholder MAY attend or speak at a Levin fundraiser but CANNOT solicit the Levin money (30125(e)(3) carve-out).

## Permissible Levin spending categories (11 CFR 300.32(b))

Only on:
1. Voter registration in the 120-day pre-federal-election window, AND
2. Voter ID / GOTV / generic campaign activity in an election with a federal candidate on the ballot.

Subject to subsection (c) conditions (no reference to federal candidate; no broadcasting/cable/satellite; raised under 300.31; allocable per 300.33).

Levin may ALSO be used for any non-federal activity lawful under state law (300.32(b)(2)), except FEA Types 3 and 4.

## 11 CFR 300.30 — Required account structure

Any state, district, or local party committee that has receipts or makes disbursements for FEA must establish one of three account structures:

**Option 1**: Single federal account that pays everything (with non-federal/Levin shares transferred in).

**Option 2**: Three separate accounts (Federal + Levin + Non-Federal).

**Option 3**: Two accounts (Federal + combined Non-Federal/Levin account, managed by an FEC-approved accounting method).

Allocation accounts may also be established at the committee's discretion for paying allocable expenses.

**Account rules**:
- Non-Federal account: governed by state law (KRS 121). Cannot pay any disbursement in connection with a federal election except as allowed under 11 CFR 102.5(a)(4), 106.7(d)(1)(i), 300.33, 300.34.
- Levin account: must comply with 300.31 (raising) and may only fund 300.32(b) activities.
- Federal account: receives only FECA-compliant contributions. Treated as a separate political committee for registration/reporting under 11 CFR Parts 102 and 104.

**Application to JCDEC**: Once JCDEC does any FEA — even a single GOTV mailer in a federal election year — it must structure its bank accounts under one of these three models.

## 11 CFR 300.31 — Receipt of Levin funds

Key rules:

- **(a) Self-raised requirement**: Levin funds must be raised "solely by the committee that expends or disburses them."
- **(b) State-law compliance**: Each Levin donation must be lawful under state where committee is organized (KY for JCDEC).
- **(c) Source rule**: If KY law allows donations from a source that FECA prohibits (e.g., corporate funds to a party committee), the source is permissible as Levin — EXCEPT foreign nationals (52 USC 30121) are always prohibited.
- **(d) $10,000 per donor per calendar year cap** (KY-law cap controls if lower).
- **(e) No Levin from national party committees or federal candidates/officeholders** (and no joint fundraising with them for Levin).
- **(f) No joint fundraising for Levin between two or more state/district/local committees.**
- **(g) Safe harbor**: Sharing a common fundraising vendor is NOT joint fundraising.

**Critical for Kentucky**: KRS 121.025 prohibits corporate contributions to candidates AND to party committees. So while federal law would allow corporate Levin contributions to JCDEC IF state law allowed them, Kentucky law DOES NOT. JCDEC cannot accept corporate Levin contributions.

**Practical takeaway**: Build a Levin solicitation script that (a) names the $10,000 donor cap, (b) confirms the contribution is for JCDEC only, (c) screens out national-party-affiliated donors and federal-officeholder-controlled entities, and (d) screens out corporations under KRS 121.025.

## 11 CFR 300.32 — Expenditures and disbursements (FEA spending rules)

**(a)(1) Type 2 FEA** (public communications referring to a clearly identified federal candidate): Must be paid with **100% federal funds**. No allocation, no Levin.

**(a)(2) Type 1 FEA** (registration in 120-day window, voter ID, GOTV, generic campaign activity): Federal funds OR allocated federal-plus-Levin under 11 CFR 300.33.

**(a)(3) Direct fundraising costs of a federal-only fundraiser**: Federal funds only.

**(a)(4) Direct fundraising costs of a Levin fundraiser**: Federal OR Levin funds.

**(b)(1) Permissible Levin spending**: Only on Type 1 FEA categories (above), subject to (c) conditions.

**(b)(2) Non-FEA state/local activity**: Levin may also be used for any non-federal activity lawful under state law, except FEA Types 3 and 4.

**(c) Levin conditions on FEA spending**:
1. Activity must not refer to a clearly identified federal candidate.
2. No part of broadcasting/cable/satellite costs (except a communication referring solely to a state/local candidate).
3. Funds must be raised under 300.31.
4. Allocable disbursements paid 100% federal or federal-plus-Levin per 300.33.

**Treasurer's pre-disbursement checklist**:
1. Does it name a federal candidate? → If yes: 100% FEDERAL ONLY.
2. Is it broadcast/cable/satellite? → If yes AND names any federal candidate: 100% FEDERAL ONLY.
3. Is it a Type 1 activity in the window? → If yes: federal-only OR allocated federal + Levin.

## 11 CFR 300.33 — Allocation percentages

Required minimum federal-fund shares of allocable Type 1 FEA:

| Cycle | Min federal share | Cite |
|---|---|---|
| Presidential + Senate on ballot | 36% | 11 CFR 300.33(b)(2) |
| Presidential, no Senate | 28% | 11 CFR 300.33(b)(1) |
| Senate, no Presidential | 21% | 11 CFR 300.33(b)(3) |
| Neither Presidential nor Senate | 15% | 11 CFR 300.33(b)(4) |

**Applied to KY cycles**:

- **2026**: Senate (Booker for McConnell's open seat) + no Presidential → **21% federal minimum.**
- **2028**: Presidential + Senate (Rand Paul's seat up) → **36% federal minimum.**
- **2030**: Senate only → **21% federal minimum.**
- **2032**: Presidential + Senate (McConnell open seat cycle?) → **36% federal minimum.**
- **Odd years (2027, 2029, 2031)**: If no federal-ballot election → no FEA; if federal special on ballot → 15% federal.

**Other 300.33 rules**:
- **(c)**: Public communications referring to a federal candidate that PASO any federal candidate → 100% federal, no allocation.
- **(d) Salary/wage rules**:
  - ≤25% monthly time on FEA or federal-election-connected work: federal account only OR allocate as administrative cost under 106.7(d)(2).
  - >25%: federal account only.
  - 0%: state-law-compliant funds only.
- **(e) Transfer timing**: Levin transfers into federal/allocation account no more than 10 days before or 60 days after the underlying payment (vendor pre-payment exception applies).

**Practical takeaway**: Build a year-by-year allocation reference table into the treasurer's procedures. Lock the percentage at the first allocated disbursement of each calendar year (disclosed in the first FEC report of the year per 11 CFR 300.36(b)(2)(i)(A)).

## 11 CFR 300.34 — Transfers (the no-funneling rule)

The federal component of any FEA disbursement must be raised by the spending committee itself. A state/district/local party may NOT use federal funds transferred in from another committee as the federal share of FEA. Levin funds may NEVER be transferred in from any other committee.

**Application to JCDEC**: KDP cannot funnel federal money to JCDEC to cover the 21%/36% federal share of JCDEC's Levin-allocated GOTV. JCDEC must raise its own federal share.

**Practical takeaway**: Either (a) demonstrate by FEC-approved accounting that transferred federal funds are not used as the FEA federal share, or (b) maintain a sub-account of "self-raised federal funds" from which all FEA federal-share disbursements come.

## 11 CFR 300.35 — Office buildings

A state or local party committee may purchase or construct its office building with federal funds OR with non-federal funds not subject to FECA limits/prohibitions/disclosure (subject to state law and the foreign-national ban). The building cannot be purchased "for the purpose of influencing the election of any candidate in any particular election for Federal office." Levin funds may be used for an office building if state law permits. Rental income from a non-federal-funded building goes to the non-federal account.

**Application to JCDEC**: If JCDEC ever buys HQ, broad source flexibility for the capital — but must check KY law (KRS 121.025 corporate ban applies). Foreign-national money is always prohibited.

## 11 CFR 300.36 — Reporting Federal Election Activity (THE $5,000 THRESHOLD)

**THE CRITICAL OPERATIONAL TRIGGER**:

A state/district/local party committee that is a political committee under 11 CFR 100.5 AND has **$5,000 or more aggregate FEA receipts and disbursements in a calendar year** must report all FEA receipts and disbursements (both federal and Levin) on FEC monthly reports per 11 CFR 104.5(c)(3).

A committee with <$5,000 FEA receipts/disbursements: Reports only federal funds for FEA, not Levin.

**Reporting specifics for allocated disbursements**:
- First report of the calendar year discloses the allocation percentage applied.
- Each subsequent itemized report states the FEA category and year-to-date totals from federal and Levin funds per category.
- Allocation-account transfers reported in the period they occur with memo entry explaining the underlying disbursement.
- All FEA receipts/disbursements of $200+ from/to any person are itemized.

**Application to JCDEC**: Cross $5,000 and JCDEC moves from minimal recordkeeping to MONTHLY FEC reporting on Form 3X with full itemization. A single significant Type 1 GOTV mail piece can blow through $5,000.

**Practical takeaway**: Track FEA receipts and disbursements separately from non-FEA from January 1 forward. Set an internal alert at the $4,000 cumulative mark to confirm with counsel whether the next disbursement will push JCDEC into monthly reporting status. Once a political committee, file Form 1 registration with the FEC and use FECFile or another approved e-filing tool.

## 52 USC 30125(d) + 11 CFR 300.37 — Solicitations and donations to 501(c)/527

**Rule**: Party committees (national, state, district, AND local) and their officers/agents may NOT solicit funds for, or make/direct donations to:

1. Any 501(c) tax-exempt that makes expenditures or disbursements in connection with a federal election (including FEA); OR
2. Any 527 organization, UNLESS the 527 is itself a political committee, a state/district/local party committee, an authorized state/local candidate committee, or a state political committee that supports only state/local candidates and makes no federal-election disbursements.

**Safe harbor** (300.37(c)-(d)): A JCDEC officer can rely on a written certification from the recipient organization that it does not make federal-election expenditures, signed under penalty of perjury by a responsible officer, renewed annually.

**Application to JCDEC**: JCDEC officers (including Vice Chair) personally exposed. Before JCDEC writes a check to ANY outside nonprofit, get a written certification under 11 CFR 300.37 or confirm the entity falls in one of the safe-harbor categories.

**THIS IS A PERSONAL LIABILITY TRAP FOR OFFICERS.**

## 52 USC 30125(e) — Federal candidate and officeholder solicitation rules

**Core rule (e)(1)**: A federal candidate, officeholder, agent, or controlled entity may not solicit, receive, direct, transfer, or spend any funds in connection with a federal election (including any FEA) unless they are FECA-compliant federal funds.

**(e)(3) carve-out**: A federal candidate or officeholder MAY "attend, speak, or be a featured guest" at a state/district/local party fundraising event — including one raising Levin or non-federal funds — but CANNOT do the actual solicitation of non-federal money.

**Application to JCDEC**: When JCDEC hosts a fundraiser featuring McGarvey or Booker:
- The federal officeholder may headline and speak.
- The solicitation language (invitations, asks from the podium) cannot put the federal officeholder's "ask" on non-federal/Levin money.
- If a Member of Congress signs a fundraising email asking for non-federal/Levin money for JCDEC, that's a 30125(e)(1) violation by the Member.

**Practical takeaway**: When using a federal officeholder as a draw, structure so the federal officeholder is only "attending/speaking" not soliciting non-federal money. Have separate ask cards or links for the federal account.

## 52 USC 30125(f) — State candidate / officeholder rules

A state or local candidate or officeholder may not spend any funds for a "public communication" that promotes/supports/attacks/opposes a clearly identified federal candidate UNLESS the funds are FECA-compliant federal funds. Exception: a communication referring only to the state/local candidate and other candidates for the same state/local office.

**Application to JCDEC**: A state senator, state rep, or Metro Council member endorsing or co-branding a JCDEC mailer that names a federal candidate must do so only with federal funds. JCDEC's joint pieces with state candidates that mention a federal candidate cannot be funded out of the non-federal/Levin pool.

**Practical takeaway**: A slate card listing federal + state candidates = 100% federal money. A piece naming only state/local Dems and never naming a federal candidate may use Levin or non-federal.

## 11 CFR 106.7 — Federal/Non-Federal allocation for state and local parties (different from 300.33)

While 300.33 handles federal/Levin allocation for FEA, **106.7** handles routine federal/non-federal allocation of NON-FEA expenses (administrative overhead, joint fundraising, etc.).

Categories under 106.7:

- **(d)(1) Salaries** for employees who spend 25% or less of compensated time on federal-election activities AND zero time on FEA: allocated as administrative costs.
- **(d)(2) Administrative costs** (rent, utilities, supplies, office equipment not connected to specific federal/non-federal activity): allocated by a "reasonable method" reflecting actual proportion of federal/non-federal activity.
- **(d)(3) Costs of fundraising programs/events**: allocated by funds-received method.
- **(d)(4) Joint fundraising for federal and non-federal**: funds-received method.
- **(d)(5) Voter drives that are NOT FEA**: allocated by ballot composition or funds-received.

**Application to JCDEC**: Office rent, treasurer software, year-round staff salaries (under 25% FEA), routine printing, and non-event fundraising costs are 106.7 allocations.

**Practical takeaway**: Adopt a written allocation policy at the start of each calendar year specifying the 106.7 method (typically funds-received for fundraising, reasonable-method for admin), and document the percentages applied to each allocable invoice.

## Cross-cutting practice rules for JCDEC

1. **Account discipline is everything.** Be able to recite which JCDEC account paid for any disbursement and why under the 30125/Part 300/106.7 framework.

2. **The $5,000 FEA reporting trigger is the single most consequential operational threshold.** Tracking FEA-by-category from January 1 prevents an inadvertent mid-year promotion to monthly federal reporting.

3. **Federal candidates can headline but cannot solicit non-federal/Levin money.** Structure every fundraiser with a federal officeholder accordingly.

4. **State law matters for Levin.** Kentucky's source rules (KRS 121.025 corporate ban) determine permissible Levin donors. The $10,000 federal cap is a ceiling, not necessarily a floor.

5. **Allocation percentages reset annually and are disclosed in the first FEC report.** Lock them at the year's first allocated disbursement.

6. **The 501(c)/527 donation prohibition is a personal liability trap for officers.** Always get a written 11 CFR 300.37 certification before JCDEC sends money to any outside nonprofit.

7. **The foreign-national ban applies to every JCDEC account, not just federal.** See `references/08-federal-source-prohibitions.md`.


---

<!-- SOURCE: references/08-federal-source-prohibitions.md -->

# Federal Source Prohibitions and Disclaimer Rules

## Scope

Use this file for questions about prohibited sources of contributions to federal accounts and federal disclaimer requirements. Source rules: 52 USC 30118-30122; 11 CFR 110.4, 110.20, 114, 115. Disclaimers: 52 USC 30120; 11 CFR 110.11.

## 52 USC 30118 — Corporate and labor contribution prohibition

**Verbatim core**: It is unlawful for any corporation, national bank, or labor organization to make a contribution or expenditure in connection with any federal election, and for any candidate, political committee, or other person to knowingly accept any such contribution.

**Carve-out (30118(b)(2)(C))**: Separate Segregated Funds (SSFs) / connected PACs of corporations and unions may contribute, subject to applicable limits.

**See also**: `[11 CFR 114.2]`.

**Application to JCDEC**: JCDEC's federal account cannot accept ANY corporate or labor-organization general-treasury contribution. A corporate PAC (SSF) can contribute to JCDEC's federal account up to applicable limits. Corporate in-kind contributions (free office space from a business, free graphic design from an LLC) are prohibited for the federal account but may be permissible for the non-federal/Levin account IF KY law allows. **For Kentucky: KRS 121.025 also bans corporate contributions to JCDEC's non-federal account.** So corporate contributions are prohibited at every JCDEC account.

**Practical takeaway**: Bank deposit slips for every JCDEC account should be screened against the contributor name to flag corporate checks (LLC, Inc., Corp., LLP) for return.

## 52 USC 30119 — Federal contractor contribution prohibition

**Verbatim core**:
> "It shall be unlawful for any person … who enters into any contract with the United States … if payment for the performance of such contract … is to be made in whole or in part from funds appropriated by the Congress, at any time between the commencement of negotiations for such contract and either the completion of performance under, or the termination of negotiations for, such contract, directly or indirectly to make any contribution of money or other things of value … to any political party, committee, or candidate for public office or to any person for any political purpose or use."

**Implementing regulation**: `[11 CFR 115.2]`.

**Application to JCDEC**: JCDEC's federal account cannot accept contributions from federal contractor entities during their prohibited window.

The ban applies to the contractor entity. For partnerships and sole proprietors, individual partners and sole proprietors are personally covered. For corporations and LLCs, the entity is covered; employees, officers, and shareholders are NOT personally covered for their individual contributions.

**Louisville context**: Many federal contractors operate in Louisville — UPS Worldport (federal mail and shipping contracts), Humana (federal Medicare contracts), GE Appliances historically, defense subcontractors, and Louisville-area university research contractors.

**Practical takeaway**: Add a federal-contractor screen to the JCDEC donor intake form: "Are you a federal contractor with a contract currently in negotiation or performance?" Return any contribution from a covered contractor entity within 30 days.

## 52 USC 30121 — Foreign national prohibition

**Statutory text**: Foreign nationals are prohibited from directly or indirectly making contributions or donations or expenditures or independent expenditures or disbursements in connection with any federal, state, or local election.

It is also unlawful for any person to solicit, accept, or receive such contributions, or to provide substantial assistance in their making.

**Implementing regulation**: `[11 CFR 110.20]`.

**Definition of "foreign national"**:
- Non-U.S. citizens who are not lawfully admitted for permanent residence (i.e., not green card holders);
- Foreign governments;
- Foreign political parties;
- Foreign corporations;
- Foreign partnerships;
- Foreign associations;
- Foreign LLCs;
- Foreign other entities.

**Permitted**:
- Lawful permanent residents (green card holders) MAY contribute.
- Dual citizens who are U.S. citizens MAY contribute.

**Critical scope**: Unlike most FECA provisions, the foreign-national ban applies to **state and local elections**, not just federal. It also applies to **Levin funds** and to non-federal party funds (see 11 CFR 300.35(a) cross-reference).

**Application to JCDEC**: NO contribution from a non-green-card holder, foreign corporation, foreign government, or foreign-source entity — for ANY JCDEC account: federal, non-federal, or Levin.

**Practical takeaway**: Add a foreign-national affirmation to every contribution form: "I am a U.S. citizen or lawfully admitted permanent resident. The funds are not from a foreign source." Watch for indirect contributions (a U.S. citizen donating money provided by a foreign parent or spouse — that's also a 30122 conduit violation).

## 52 USC 30122 — Contributions in the name of another (conduit / straw donor)

**Verbatim**:
> "No person shall make a contribution in the name of another person or knowingly permit his name to be used to effect such a contribution, and no person shall knowingly accept a contribution made by one person in the name of another person."

**Penalties**: This is a FELONY with criminal penalties. FEC also imposes civil penalties. Recent enforcement has been aggressive on reimbursement schemes (employer reimburses employees, spouse reimburses other spouse).

**Application to JCDEC**: JCDEC cannot knowingly accept a contribution where the true source is concealed behind a straw donor.

**Practical takeaway**: If any contribution shows a pattern that suggests reimbursement (multiple maximum contributions on the same date from related parties, contributions from individuals whose income doesn't support the amount), the treasurer should hold the funds pending verification and decline if unable to confirm true source. Document all such decisions.

## 52 USC 30124 — Fraudulent misrepresentation of campaign authority

**Rule**:
- (a) No candidate for federal office or employee/agent thereof may fraudulently misrepresent themselves as speaking, writing, or acting for or on behalf of another candidate or political party on a matter damaging to such other candidate or party, or fraudulently solicit contributions on behalf of another candidate or party.
- (b) Same prohibition on willingly and knowingly participating in fraudulent misrepresentation.

**Application to JCDEC**: Two-way protection:
- JCDEC and its officers cannot impersonate the Republican Party of Kentucky or its candidates in dirty-tricks operations.
- Outside actors cannot fraudulently solicit money "for JCDEC" without authority. If JCDEC discovers a third party soliciting donations claiming to be on JCDEC's behalf, the statute supports cease-and-desist and FEC referral.

**Practical takeaway**: Monitor for unauthorized fundraising or communications using "Jefferson County Democratic Party" or similar branding. Maintain a clear, published list of authorized JCDEC fundraising channels (committee's federal account name, official PayPal/ActBlue link) so donors can verify legitimacy.

## 52 USC 30120 — Disclaimers on public communications

**Rule**: Whenever a political committee makes a "public communication" or any communication expressly advocating the election or defeat of a clearly identified candidate, or solicits contributions, the communication must include a disclaimer stating:

- Authorized by the candidate's committee, OR
- Paid for by [committee] and authorized by [candidate's committee], OR
- Paid for by [committee] and not authorized by any candidate or candidate's committee (for independent expenditures).

**Implementing regulation**: `[11 CFR 110.11]`.

**Format rules (11 CFR 110.11(c))**:
- Printed comms: box, contrasting color, readable type.
- Radio: at least 4 seconds, clearly spoken.
- TV: at least 4 seconds, readable for the duration, with personal "stand by your ad" statement for candidate-authorized ads.

**Application to JCDEC**: Every JCDEC mail piece, palm card, paid social ad over the public-communication threshold, yard sign, billboard, and email solicitation that meets the public-communication definition needs:

> "Paid for by Jefferson County Democratic Executive Committee. Not authorized by any candidate or candidate's committee."

(Or equivalent depending on coordination/authorization status.)

Even endorsement slates need disclaimers.

**Practical takeaway**: Build a JCDEC disclaimer template into every Canva/design file. Vice Chair or Communications Chair should pre-clear every public communication for disclaimer compliance before release.

## Comparison: Federal vs. Kentucky source prohibitions

| Source | Federal account | KY state account (KRS 121) |
|---|---|---|
| Individual citizen or green-card holder | OK to limits | OK to limits |
| Individual under 18 | $100 limit (KRS 121.150(5)) | $100 limit (KRS 121.150(5)) |
| Foreign national (non-green-card) | PROHIBITED (52 USC 30121) | PROHIBITED (52 USC 30121 covers all elections; KRS 121.200) |
| Corporation, LLC, LLP, union, partnership | PROHIBITED (52 USC 30118); PAC OK | PROHIBITED (KRS 121.025); PAC OK |
| Federal contractor (entity in contract window) | PROHIBITED (52 USC 30119) | Not specifically prohibited at state level, but contractor's officers may be subject to KY ethics rules |
| State employee solicited as state employee | OK if solicited as general public | PROHIBITED (KRS 121.150(2); 121.320) |
| Straw donor / conduit | PROHIBITED (52 USC 30122) | PROHIBITED (KRS 121.150(12)) |
| Anonymous over cap | $50 federal max | $100/contributor; $2,000 aggregate per election (KRS 121.150(3)) |
| Cash over cap | $100 federal max | $100/contributor per election (KRS 121.150(4)) |

## Summary for chat feature

If user asks: "Can a corporation give to JCDEC?"

**Answer**: NO. Categorically prohibited under both federal law (52 USC 30118) and Kentucky law (KRS 121.025). LLCs, LLPs, S-corps, not-for-profit corporations, unions, partnerships all included. The ONLY exception is the state party Building Fund under KRS 121.172 — and JCDEC has no Building Fund authority (state party only). Corporate PACs (SSFs) may contribute up to applicable limits.

If user asks: "Can a federal contractor give to JCDEC?"

**Answer**: Not during the contract negotiation/performance window. 52 USC 30119 prohibits contributions from federal contractor entities. Apply a contractor screen at donor intake.

If user asks: "Can a green card holder give to JCDEC?"

**Answer**: YES. Lawful permanent residents may contribute under 52 USC 30121. Tourist visa, student visa, work visa holders cannot.

If user asks: "What disclaimer goes on JCDEC mail pieces?"

**Answer**: "Paid for by Jefferson County Democratic Executive Committee, [street address]. Not authorized by any candidate or candidate's committee." Address is mandatory under KRS 121.190; "not authorized" language required under 52 USC 30120 / 11 CFR 110.11 for federal-related communications.


---

<!-- SOURCE: references/09-judicial-conduct-code.md -->

# Kentucky Code of Judicial Conduct — Canon 4

## Scope

Use this file for questions about what judicial candidates (Circuit, District, Court of Appeals, Supreme Court) can and cannot do with party support. The Judicial Conduct Code OVERLAYS KREF rules — KREF would permit many things that the Judicial Conduct Code prohibits for judicial candidates.

**Source**: Kentucky Supreme Court Rules, SCR 4.300; effective January 31, 2018. Compiled in the Kentucky Code of Judicial Conduct.

## Constitutional foundation

**Kentucky Constitution § 117**: All justices of the Supreme Court and judges of the Court of Appeals, Circuit, and District Courts shall be elected from their respective districts on a NONPARTISAN basis.

This nonpartisan mandate is the constitutional driver of Canon 4's restrictions on party-related activity by judicial candidates.

## Canon 4 — Political and Campaign Activities

**Verbatim**:
> "A JUDGE OR CANDIDATE FOR JUDICIAL OFFICE SHALL NOT ENGAGE IN POLITICAL OR CAMPAIGN ACTIVITY THAT IS INCONSISTENT WITH THE INDEPENDENCE, INTEGRITY, OR IMPARTIALITY OF THE JUDICIARY. THIS CANON IS TO BE INTERPRETED CONSISTENT WITH THE FIRST AMENDMENT TO THE UNITED STATES CONSTITUTION, OTHER CONSTITUTIONAL REQUIREMENTS, STATUTES, OTHER COURT RULES, AND DECISIONAL LAW."

## Key definitions

**"Judicial candidate"**:
> "Any person, including a sitting judge, who is seeking selection for judicial office by election or appointment. A person becomes a candidate for judicial office as soon as he or she makes a public announcement of candidacy, declares or files as a candidate with the election or appointment authority, authorizes or, where permitted, engages in solicitation or acceptance of contributions or support, or is nominated for election or appointment to office."

**"Political organization"**:
> "A political party or other group sponsored by or affiliated with a political party or candidate, the principal purpose of which is to further the election or appointment of candidates for partisan political office. For purposes of this Code, the term does not include a judicial candidate's campaign committee created as authorized by Rule 4.4."

JCDEC fits squarely as a "political organization" under this definition.

**"Personally solicit"**:
> "A direct request made by a judge or a judicial candidate for financial support or in-kind services, whether made by letter, telephone, social media, or any other means of communication."

**"Contribution"**:
> "Both financial and in-kind contributions, such as goods, professional or volunteer services, advertising, and other types of assistance, which, if obtained by the recipient otherwise, would require a financial expenditure."

## Rule 4.1 — Political and Campaign Activities of Judges and Judicial Candidates in General

**Verbatim** (the master prohibition list):
> "(A) Except as permitted by law, or by Rules 4.2, 4.3, and 4.4, a judge or a judicial candidate shall not:
>
> (1) act as a leader in, or hold an office in, a political organization;
> (2) make speeches on behalf of a political organization;
> (3) publicly endorse or oppose a candidate for any public office;
> (4) solicit funds for, pay an assessment to, or make a contribution to a political organization or a candidate for public office;
> (5) attend or purchase tickets for dinners or other events sponsored by a political organization or a candidate for public office, except that a judge or judicial candidate may purchase tickets to political gatherings for the judge or candidate and one guest, may attend political gatherings, and may speak to such gatherings on the judge's or candidate's own behalf;
> (6) publicly identify himself or herself as a nominee of a political organization;
> (7) seek, accept, or use endorsements from a political organization;
> (8) personally solicit or accept financial or in-kind campaign contributions other than through a campaign committee authorized by Rule 4.4;
> (9) use or permit the use of campaign contributions for the private benefit of the judge, the candidate, or others;
> (10) use court staff, facilities, or other court resources in a campaign for judicial office;
> (11) knowingly, or with reckless disregard for the truth, make any false statement of material fact;
> (12) make any statement that would reasonably be expected to affect the outcome or impair the fairness of a matter pending in any court; or
> (13) in connection with cases, controversies, or issues that are likely to come before the court, make pledges, promises, or commitments that are inconsistent with the impartial performance of the adjudicative duties of judicial office.
>
> (B) A judge or judicial candidate shall take reasonable measures to ensure that other persons do not undertake, on behalf of the judge or judicial candidate, any activities prohibited under paragraph (A)."

### Key commentary

**Comment [3]**: "Although judges and judicial candidates may register to vote as members of a political party, they are prohibited by paragraph (A)(1) from assuming leadership roles in political organizations."

**Comment [4] — on "acting as a leader"**:
> "Paragraph (A)(1)'s proscription against acting as a leader of a political organization furthers this compelling interest in diminishing reliance on political parties in judicial selection... Acting as a leader involves 'advanc[ing] the political agenda of the party in a less formal way [than holding an office] through proactive planning, organizing, directing, and controlling of party functions with the goal of achieving success for the political party. These less formalized, leader-without-title, positions would include, for example, acting formally or informally as a party spokesperson; organizing, managing, or recruiting new members; organizing or managing campaigns; fundraising; and performing other roles exerting influence or authority over the rank and file membership albeit without a formal title...' [Winter v. Wolnitzek, 482 S.W.3d 768, 777-78 (Ky. 2016)]. A judge or judicial candidate also is prohibited from hosting political events. In addition to fund raisers for other candidates, political events include events sponsored by or associated with political organizations."

**Comment [6] — family exception**:
> "Although members of the families of judges and judicial candidates are free to engage in their own political activity, including running for public office, no 'family exception' exists to the prohibition in paragraph (A)(3) against a judge or candidate publicly endorsing candidates for public office."

**Comment [7]**: "Judges and judicial candidates retain the right to participate in the political process as voters in both primary and general elections."

**Comment [8]**: "Paragraph A(4) does not prohibit a judge or judicial candidate from making contributions to his or her own campaign."

**Comment [10] — endorsements (CRITICAL FOR PARTY MONEY)**:
> "By prohibiting a judge or judicial candidate from seeking, accepting, or using endorsements from a political organization, paragraph (A)(7) is designed to further this right and the requirement in Section 117 of the Kentucky Constitution that judges be elected on a nonpartisan basis. **A political organization's endorsement of a candidate is but slightly removed from the judge or candidate's nomination as the political organization's official candidate.** Candidates remain free to announce their party affiliation but cannot render hollow the right of 'citizens of the Commonwealth ... to vote for their judges in nonpartisan elections.'"

This is why party MONEY = effectively an endorsement = prohibited. A direct party contribution to a judicial candidate's committee functions as a party endorsement (the slight remove from being the party's nominee), which Rule 4.1(A)(7) categorically forbids.

## Rule 4.2 — Campaign Activities of Judicial Candidates in Public Elections

**Verbatim**:
> "(A) A judicial candidate shall:
> (1) act at all times in a manner consistent with the independence, integrity, and impartiality of the judiciary;
> (2) comply with all applicable election, election campaign, and election campaign fund-raising laws and regulations;
> (3) review and approve the content of all campaign statements and materials produced by the candidate or his or her campaign committee, as authorized by Rule 4.4, before their dissemination; and
> (4) take reasonable measures to ensure that other persons do not undertake on behalf of the candidate activities, other than those described in Rule 4.4, that the candidate is prohibited from doing by Rule 4.1.
>
> (B) A candidate for elective judicial office may, unless prohibited by law,
> (1) establish a campaign committee pursuant to the provisions of Rule 4.4; and
> (2) speak on behalf of his or her candidacy through any medium, including but not limited to advertisements, websites, or other campaign literature."

### Comment [1] — extension to proxies

> "The restrictions on political and campaign activities by judges and judicial candidates lose efficacy if their proxies engage in the prohibited conduct. Accordingly, judges and judicial candidates shall ensure that anyone speaking on behalf of or acting for the judge or judicial candidate, such as the judge or judicial candidate's Campaign Committee, campaign manager, or official proxy, not take any actions that the judge or judicial candidate is prohibited from doing. The judge or judicial candidate shall encourage members of the candidate's family as well as friends and colleagues to adhere to the same standards of political conduct in support of the candidate as apply to the candidate. A judge or judicial candidate shall prohibit public officials or employees subject to the candidate's direction and control from doing for the candidate what the candidate is prohibited from doing under this Canon."

## Rule 4.3 — Activities of Applicants for Appointive Judicial Office

**Verbatim**:
> "An applicant for appointment to judicial office may:
> (A) communicate with the appointing or confirming authority, including any selection, screening, or nominating commission or similar agency; and
> (B) seek endorsements for the appointment from any person or organization."

Note: This rule applies to APPOINTIVE judicial office, not elective. Most KY judicial positions are elective.

## Rule 4.4 — Campaign Committees

**Verbatim**:
> "(A) A judicial candidate may establish a campaign committee to manage and conduct a campaign for the candidate, subject to the provisions of this Code. The candidate is responsible for taking reasonable measures to ensure that his or her campaign committee complies with applicable provisions of this Code and other applicable law.
>
> (B) A judicial candidate shall direct his or her campaign committee:
> (1) to solicit and accept only such campaign contributions as are permitted by law;
> (2) not to solicit or accept contributions for a candidate's current campaign more than 200 days before the applicable primary or general election;
> (3) not to solicit contributions after a general election (see KRS 121.150); and
> (4) to comply with all applicable statutory requirements for disclosure, reporting, and divestiture of campaign contributions."

### Comment [1]

> "Judicial candidates are prohibited from personally soliciting campaign contributions or personally accepting campaign contributions. See Rule 4.1(A)(8); see also [Williams-Yulee v. Fla. Bar, 135 S. Ct. 1656 (2015)] (upholding ban on personal solicitation of campaign contributions by judges or judicial candidates). This Rule recognizes that judicial candidates must raise campaign funds to support their candidacies, and permits candidates, other than candidates for appointive judicial office, to establish campaign committees to solicit and accept reasonable financial contributions or in-kind contributions."

## What judicial candidates CAN do

Compiled from Rule 4.1 exceptions, Rule 4.2, and commentary:

1. Register to vote as a member of a political party. Comment [3].
2. Vote in primary and general elections. Comment [7].
3. Make contributions to their own campaign. Comment [8].
4. Purchase tickets to political gatherings for themselves + one guest. Rule 4.1(A)(5).
5. Attend political gatherings. Rule 4.1(A)(5).
6. Speak to political gatherings on their own behalf. Rule 4.1(A)(5).
7. Announce their party affiliation (but not seek/accept party endorsement). Comment [10].
8. Establish a campaign committee under Rule 4.4.
9. Speak on behalf of their candidacy through any medium (advertisements, websites, literature). Rule 4.2(B).

## What judicial candidates CANNOT do — comprehensive list

1. **Act as a leader in or hold office in a political organization.** Rule 4.1(A)(1). Per Comment [4], includes informal roles: party spokesperson, recruiter, campaign organizer, fundraiser, host of political events.
2. **Make speeches on behalf of a political organization.** Rule 4.1(A)(2).
3. **Publicly endorse or oppose another candidate.** Rule 4.1(A)(3). No family exception (Comment [6]).
4. **Solicit funds for, pay an assessment to, or make a contribution to a political organization or another candidate.** Rule 4.1(A)(4). **This is what blocks judicial candidates from giving money to JCDEC.**
5. **Attend or purchase tickets for political organization events** beyond the candidate-plus-one carve-out. Rule 4.1(A)(5).
6. **Publicly identify as a nominee of a political organization.** Rule 4.1(A)(6).
7. **Seek, accept, or use endorsements from a political organization.** Rule 4.1(A)(7). **This is the basis for the "JCDEC money = endorsement = prohibited" rule per Comment [10].**
8. **Personally solicit or accept campaign contributions other than through a Rule 4.4 campaign committee.** Rule 4.1(A)(8).
9. **Use campaign contributions for private benefit.** Rule 4.1(A)(9).
10. **Use court staff, facilities, or resources in a campaign.** Rule 4.1(A)(10).
11. **Knowingly make false statements of material fact.** Rule 4.1(A)(11).
12. **Make statements expected to affect outcome of pending matters.** Rule 4.1(A)(12).
13. **Make pledges, promises, or commitments inconsistent with impartial judicial duties.** Rule 4.1(A)(13).
14. **Host political events** (per Comment [4]).
15. **Permit proxies / campaign committee / family to do any of the above on their behalf.** Rule 4.1(B); Rule 4.2(A)(4); Rule 4.2 Comment [1].

## Application to JCDEC

**JCDEC cannot endorse judicial candidates.** Even if JCDEC bylaws would permit it, the candidate cannot ACCEPT the endorsement (Rule 4.1(A)(7)). A purported JCDEC endorsement of a judicial candidate would not survive ethical review and the candidate would be required to disavow it. (Comment [10]: "A judge or judicial candidate is not required to disavow an endorsement to avoid being deemed to have accepted it.")

**JCDEC cannot give money to a judicial candidate.** Even though KRS 121.150(6) would permit unlimited contributions from JCDEC to any candidate, Rule 4.1(A)(7) treats party money as a party endorsement, which the judicial candidate cannot accept.

**JCDEC cannot list judicial candidates on a slate card.** A party slate card listing a judicial candidate operates as a party endorsement (Rule 4.1(A)(6), (A)(7)).

**JCDEC cannot include judicial candidates in coordinated GOTV efforts.** Coordination would be either an in-kind contribution from a political org or a de facto endorsement.

**JCDEC may invite a judicial candidate to attend a JCDEC event** as long as:
- The candidate is one of multiple invited guests
- The candidate does not headline / host
- The event is not designed as a fundraiser FOR the judicial candidate
- The candidate may purchase tickets for self + 1 guest (Rule 4.1(A)(5))
- The candidate may speak only on their own behalf

**A judicial candidate cannot transfer surplus campaign funds to JCDEC.** Rule 4.1(A)(4) directly prohibits contributions from the candidate (and per Comment [1] to Rule 4.4, the candidate is responsible for the committee's compliance) to a political organization.

## Sources

- Kentucky Code of Judicial Conduct, SCR 4.300 (Supreme Court Order 2018-03, eff. 1/31/2018)
- Kentucky Constitution § 117
- [Winter v. Wolnitzek, 482 S.W.3d 768 (Ky. 2016)]
- [Williams-Yulee v. Florida Bar, 575 U.S. 433 (2015)]

## Summary for chat feature

If user asks: "Can JCDEC endorse a judicial candidate?"

**Answer**: No, in practical effect. KREF/KRS 121 does not prohibit JCDEC from issuing an endorsement, but the judicial candidate cannot ACCEPT or USE the endorsement under Rule 4.1(A)(7), SCR 4.300. The candidate would have to disavow it publicly. Per Comment [10], "A political organization's endorsement of a candidate is but slightly removed from the judge or candidate's nomination as the political organization's official candidate" — which KY Const. § 117 forbids.

If user asks: "Can JCDEC give money to a judicial candidate?"

**Answer**: No, in practical effect. KRS 121.150(6) would permit unlimited contributions, but accepting party money would constitute accepting a party endorsement under Rule 4.1(A)(7). The judicial candidate's campaign committee should not accept the contribution and would need to return it.

If user asks: "Can a judicial candidate give money to JCDEC?"

**Answer**: No. Rule 4.1(A)(4) directly prohibits judicial candidates from contributing to a political organization. The candidate's campaign committee is bound by the same restriction (Rule 4.4(B); Rule 4.2(A)(4)).

If user asks: "Can a judicial candidate attend a JCDEC event?"

**Answer**: Yes, with limits. Rule 4.1(A)(5) permits the candidate to attend, buy tickets for self + 1 guest, and speak on their own behalf. The candidate may NOT host the event, may NOT have it be a fundraiser for them, and may NOT speak on behalf of the party or solicit support for other candidates.


---

<!-- SOURCE: references/10-glossary.md -->

# Glossary

## Use

Defined terms used throughout this skill. When the chat needs to explain or check a term, this is the source.

## Federal terms

**BCRA**: Bipartisan Campaign Reform Act of 2002. The federal law that introduced the soft money ban (Title I), Levin funds, and Federal Election Activity framework.

**Coordinated Party Expenditure**: Spending by a party committee on behalf of a federal candidate, with coordination permitted, subject to state-by-state and office-specific dollar limits under 52 USC 30116(d).

**FEA (Federal Election Activity)**: Four categories defined at 52 USC 30101(20)(A) and 11 CFR 100.24. See `references/07-federal-soft-money-and-levin.md`.

**FEC (Federal Election Commission)**: Federal regulator of federal campaign finance. www.fec.gov.

**FECA (Federal Election Campaign Act)**: The base federal campaign finance statute, codified at 52 USC Chapter 301. Amended by BCRA (2002) and other acts.

**Federal account**: A bank account used by a party committee to receive and disburse only FECA-compliant federal funds.

**Hard money**: FECA-compliant funds — subject to limits, prohibitions, and reporting requirements of federal law.

**In-kind contribution**: A non-monetary contribution consisting of goods or services, offered free or at less than the usual charge. Coordinated communications become in-kind contributions.

**Independent expenditure (IE)**: A communication expressly advocating election or defeat of a clearly identified candidate, made WITHOUT coordination with the candidate. No federal dollar limit; reporting required.

**Joint Fundraising Committee (JFC)**: A federal political committee that raises funds for two or more participating committees, with funds allocated per a written agreement. 11 CFR 102.17.

**Levin Amendment / Levin funds**: Exception in 52 USC 30125(b)(2) permitting state and local party committees to use a federal/non-federal allocated mix for certain Type 1 FEA, with conditions including a $10,000 per donor per calendar year cap.

**National party committee**: The DNC, RNC, DCCC, NRCC, DSCC, NRSC. Subject to flat soft money ban under 52 USC 30125(a).

**Non-federal account**: A party committee bank account governed by state law, used for non-federal activity. Cannot pay for federal election activity except as allowed under 11 CFR 102.5(a)(4), 106.7(d)(1)(i), 300.33, 300.34.

**PASO**: Promote, support, attack, or oppose. The test under 52 USC 30125(b)(1)(B) for whether a public communication is FEA.

**Public communication**: Defined at 11 CFR 100.26 — broadcast, cable, satellite, newspaper, magazine, outdoor advertising, mass mailing (>500 substantially similar pieces), phone bank (>500 substantially similar calls), or any other form of general public political advertising.

**SSF (Separate Segregated Fund)**: A PAC sponsored and administered by a corporation, labor organization, or other entity prohibited from making direct contributions. Carve-out under 52 USC 30118(b)(2)(C).

**Soft money**: Funds NOT subject to FECA limits, prohibitions, and reporting requirements. After BCRA, national parties cannot use soft money at all; state/local parties cannot use soft money for FEA except in the Levin allocation.

## Kentucky terms

**32 KAR**: Kentucky Administrative Regulations, Title 32 — Registry of Election Finance.

**Caucus Campaign Committee**: One of four legislative caucus committees: House Dem, House Rep, Senate Dem, Senate Rep. KRS 121.015(3)(c).

**Contributing Organization**: A registered membership organization (not a corporation) that makes contributions from its membership dues / treasury. Subject to KRS 121.150 limits.

**DEC (Democratic Executive Committee)**: A unit of the Democratic Party at the county or LD level. JCDEC is the county-level DEC for Jefferson County.

**Executive Committee**: An organizational unit or affiliate recognized within the document governing a political party, that raises and spends funds to promote political party nominees. KRS 121.015(3)(f).

**ITC (Income Tax Check-Off)**: KY taxpayers may designate $2 on their state income tax return to a party. KRS 141.071–.073. 50¢ goes to taxpayer's county DEC; $1.50 to state party.

**JCDEC (Jefferson County Democratic Executive Committee)**: The county-level executive committee of the Kentucky Democratic Party for Jefferson County (Louisville).

**JCPS**: Jefferson County Public Schools. Board of Education seats are nonpartisan.

**JFC**: See "Joint Fundraising Committee" under federal terms.

**KAR**: Kentucky Administrative Regulations.

**KDP (Kentucky Democratic Party)**: The state-level executive committee of the Democratic Party in Kentucky. Parent of JCDEC and the LD committees.

**KEFMS**: Kentucky Election Finance Management System. The electronic filing platform at secure.kentucky.gov/kref/financial. All registrations and reports filed here.

**KREF (Kentucky Registry of Election Finance)**: The state regulator of Kentucky campaign finance. kref.ky.gov. Office at 140 Walnut Street, Frankfort, KY 40601. Phone 502-573-2226. Email KREFRequests@ky.gov.

**KRS**: Kentucky Revised Statutes.

**LD (Legislative District)**: Kentucky has 100 state House districts and 38 state Senate districts. Each LD has its own DEC (Legislative District Committee). LD 41 covers parts of Louisville's east end (Lisa's district).

**LDP (Louisville/Jefferson County Democratic Party)**: Sometimes used synonymously with JCDEC; sometimes refers to the broader Louisville Democratic apparatus.

**Permanent Committee / PAC**: A permanent organization functioning year-round whose primary purpose is electing candidates. KRS 121.015(3)(d); 121.170(7). General Assembly members may not form or register a PAC.

**Political Issues Committee**: A committee organized to support or oppose ballot questions (not candidates). KRS 121.

**Political Party**: A party that polled at least 20% in the last presidential election. KRS 121.015.

**Slate**: Kentucky Constitution requires Governor and Lt. Governor to run together as a slate. KRS 121.015(9).

**Subdivision / affiliate of a state political party**: A county or LD DEC. KRS 121.015. JCDEC is a subdivision/affiliate of KDP.

## Judicial conduct terms

**Canon 4**: The portion of the Kentucky Code of Judicial Conduct addressing political and campaign activities. SCR 4.300.

**Judicial candidate**: Any person seeking judicial office, including a sitting judge running for re-election. SCR 4.300 definitions.

**Personally solicit**: A direct request by a judge or judicial candidate for financial support or in-kind services. Prohibited under Rule 4.1(A)(8) except through Rule 4.4 campaign committee.

**Political organization**: A political party or other group affiliated with a political party, the principal purpose of which is to further election of partisan candidates. SCR 4.300. JCDEC is a political organization.

**Rule 4.1**: General prohibitions on political/campaign activities by judges and judicial candidates.

**Rule 4.2**: Affirmative duties and permissions for judicial candidates in elections.

**Rule 4.3**: Activities of applicants for appointive judicial office.

**Rule 4.4**: Campaign committee requirements for judicial candidates.

**SCR 4.300**: Supreme Court Rule 4.300 — the Kentucky Code of Judicial Conduct.

## Louisville/Kentucky political terms

**HB 388 (2024)**: Kentucky House Bill 388, which (among other things) made Louisville Metro Mayor and Metro Council races nonpartisan starting with the 2026 cycle.

**Louisville Metro / Metro Government**: The consolidated Louisville/Jefferson County local government created in 2003. KRS Chapter 67C.

**Metro Council**: The 26-member legislative body of Louisville Metro Government.

**Nonpartisan election**: An election where party labels do not appear on the ballot. Per HB 388 starting 2026, includes Louisville Mayor, Metro Council, and judicial races (judicial always nonpartisan under KY Const. § 117). JCPS School Board nonpartisan under KRS 160.210; KRS 118.025.

**Partisan election**: An election where party labels appear on the ballot. Includes Sheriff, County Attorney, PVA, State House/Senate, federal offices, statewide constitutional offices.

**Sheriff / County Attorney / PVA**: Remain partisan offices in Jefferson County under their respective statutory chapters.

## Roles

**Booker (Charles)**: Democratic candidate for U.S. Senate from Kentucky in 2026.

**McConnell (Mitch)**: Senior U.S. Senator from Kentucky (retiring; seat open 2026).

**McGarvey (Morgan)**: Democratic U.S. Representative for Kentucky's 3rd Congressional District (covers Louisville).

**Paul (Rand)**: Junior U.S. Senator from Kentucky (seat up 2028).

**Beshear (Andy)**: Governor of Kentucky (Democrat).


---

<!-- SOURCE: references/11-decision-trees.md -->

# Decision Trees for Common Questions

## Scope

Use this file when the chat needs to walk through a multi-step decision. Each tree starts from a common user question and routes through the relevant statutes/regulations.

## Tree 1: "Can JCDEC give money to candidate X?"

```
Q1: Is X a federal candidate (US House, US Senate, US President)?
├─ YES → Go to Tree 1A (federal candidate)
└─ NO → Q2

Q2: Is X a judicial candidate (Circuit, District, COA, Supreme)?
├─ YES → Go to Tree 1B (judicial)
└─ NO → Q3

Q3: Is X a partisan KY state/local candidate (Sheriff, County Attorney, PVA, State House/Senate, Statewide)?
├─ YES → Tree 1C (state partisan)
└─ NO → X is a nonpartisan candidate (Mayor, Metro, JCPS, Soil & Water). Go to Tree 1D (nonpartisan).
```

### Tree 1A: JCDEC → federal candidate

```
Q1A.1: Has KDP + JCDEC + any other KY Dem subordinate already given X up to $5,000 in this election (primary or general)?
├─ YES → STOP. Combined affiliated limit reached. 52 USC 30116(a)(2)(A); 11 CFR 110.3(b).
└─ NO → JCDEC may give the unused balance up to $5,000 minus what KDP+other subordinates already gave.

Then: coordinate with KDP BEFORE writing the check to ensure the affiliated limit is correctly tracked.
```

### Tree 1B: JCDEC → judicial candidate

```
STOP. Functionally prohibited.

KREF/KRS 121 would permit unlimited contribution.
BUT Rule 4.1(A)(7), SCR 4.300: judicial candidate cannot "seek, accept, or use endorsements from a political organization."
Comment [10]: party contribution = "but slightly removed from" being party's nominee = effective endorsement.
The candidate's committee cannot accept the money without violating Canon 4.

If JCDEC sends a check, candidate must return it.
```

### Tree 1C: JCDEC → state partisan KY candidate

```
Q1C.1: Is there a JCDEC bylaw or KDP bylaw restriction?
├─ YES → Comply with bylaws first.
└─ NO → Q1C.2

Q1C.2: KRS 121.150(6): UNLIMITED amount permitted.

Then:
- Treasurer records contribution
- Reported on next semi-annual KREF report (Jan 31 or Jul 31)
- Coordinated communications become in-kind contributions (KRS 121.015(6)(b)-(c))
```

### Tree 1D: JCDEC → nonpartisan non-judicial candidate (Mayor, Metro Council, JCPS, Soil & Water)

```
Q1D.1: Do JCDEC bylaws OR KDP bylaws prohibit contributions to nonpartisan candidates?
├─ YES → STOP. Bylaw violation.
└─ NO → Q1D.2

Q1D.2: KRS 121.150(6) does not distinguish partisan/nonpartisan; UNLIMITED amount permitted at state level.

Per KREF guidance: "Party rules and or by-laws may prohibit Executive Committees and Caucus Campaign Committees from making contributions to candidates in non-partisan races."

Then:
- Treasurer records contribution
- Reported on next semi-annual KREF report
- Coordinated communications become in-kind contributions
```

## Tree 2: "Can candidate X give money to JCDEC?"

```
Q2.1: Is this a transfer from candidate's PERSONAL funds or from their CAMPAIGN account?
├─ Personal → Q2.2 (personal contribution)
└─ Campaign account → Q2.3 (campaign-account transfer)

Q2.2: Personal contribution.
└─ Subject to standard $5,000/yr individual limit to JCDEC (KRS 121.150(11)). 
   Includes if candidate has previously contributed personally during the year — must aggregate.

Q2.3: Campaign-account transfer. Timing matters.
├─ At TERMINATION (surplus disposition) → Q2.3.A
└─ MID-CYCLE (while campaign active) → Q2.3.B

Q2.3.A: At termination — surplus disposition under KRS 121.180(10)(d).
├─ X is partisan candidate → UNLIMITED transfer permitted. KRS 121.180(10)(d).
├─ X is nonpartisan candidate → PROHIBITED. Surplus must escheat to State Treasury or pro-rata refund to contributors.
└─ X is judicial candidate → PROHIBITED. Also prohibited by Rule 4.1(A)(4), SCR 4.300.

Q2.3.B: Mid-cycle — while campaign is active.
├─ X is a General Assembly member → UP TO $5,000/year permitted. KRS 121.175(1).
├─ X is any other partisan candidate → Statute silent. Likely not authorized. ADVISORY OPINION recommended.
├─ X is a nonpartisan candidate → Not authorized.
└─ X is a judicial candidate → PROHIBITED. Rule 4.1(A)(4), SCR 4.300.
```

## Tree 3: "Can JCDEC put candidate X on a slate card?"

```
Q3.1: Is X a partisan Democratic candidate?
├─ YES → Standard. Q3.4.
└─ NO → Q3.2

Q3.2: Is X a federal candidate?
├─ YES → Q3.3 (federal slate card rules)
└─ NO → Q3.6 (state-only slate card rules)

Q3.3: Federal candidate on slate card.
└─ Slate card naming federal candidate = Type 2 FEA (public communication referring to clearly identified federal candidate).
└─ Must be paid 100% with FEC-compliant federal funds. 52 USC 30125(b)(1); 11 CFR 300.32(a)(1).
└─ Cannot use Levin or non-federal funds.
└─ Reported under FEC rules.

Q3.4: Standard partisan slate card.
└─ Coordinated portion = in-kind contribution to each named candidate.
└─ Cost allocation per name. Document methodology (pro rata by name count is common).
└─ JCDEC reports as in-kind to each named candidate.
└─ Disclaimer required: "Paid for by Jefferson County Democratic Executive Committee, [address]." KRS 121.190.

Q3.5: Is X a judicial candidate?
├─ YES → STOP. Cannot include judicial candidate on a party slate card. Rule 4.1(A)(6), (A)(7), SCR 4.300. Party slate = party endorsement.

Q3.6: Is X a nonpartisan non-judicial candidate (Mayor, Metro, JCPS, S&W)?
└─ YES → Permitted under KRS, BUT each named nonpartisan candidate's share is an in-kind contribution to that candidate.
└─ Confirm JCDEC bylaws allow contributions to nonpartisan candidates.
└─ Document allocation methodology.
└─ Both JCDEC and the nonpartisan candidate report the in-kind.

Q3.7: Per KREF Exec Cmte Guide Ch. 2: "An ad for a specific candidate or candidates would also be either an in-kind contribution or an independent expenditure from the committee to the candidate or candidates if not for all the candidates on the party's ballot."

WITH HB 388 (2026), Mayor and Metro Council are OFF the "party's ballot." What counts as "party's ballot" for in-kind vs. IE analysis is itself a candidate for advisory opinion.
```

## Tree 4: "Can JCDEC accept this contribution?"

```
Q4.1: Is the donor a corporation, LLC, LLP, S-corp, not-for-profit corp, union, partnership, or association?
├─ YES → PROHIBITED. KRS 121.025; 52 USC 30118. Return within 30 days.
└─ NO → Q4.2

Q4.2: Is the donor a foreign national (non-citizen, not lawful permanent resident, or foreign entity)?
├─ YES → PROHIBITED. 52 USC 30121 (applies to ALL elections — federal, state, local — and ALL JCDEC accounts). Return.
└─ NO → Q4.3

Q4.3: Is the donor a federal contractor in an active contract window?
├─ YES → PROHIBITED for federal account contributions. 52 USC 30119. Return.
└─ NO → Q4.4

Q4.4: Is the donor a minor (under 18)?
├─ YES → $100/election limit. KRS 121.150(5).
└─ NO → Q4.5

Q4.5: Are there red flags suggesting straw donor / conduit?
(Multiple max contributions same date from related parties; contributions disproportionate to known income; bonuses/reimbursements)
├─ YES → Hold pending verification. Decline if cannot confirm true source. KRS 121.150(12); 52 USC 30122.
└─ NO → Q4.6

Q4.6: Is the contribution in cash?
├─ YES → $100/contributor/election max. KRS 121.150(4); 11 CFR 110.4(c) (federal: $100 cash, $50 anonymous).
└─ NO → Q4.7

Q4.7: Is the contribution anonymous?
├─ YES → $100/contributor; $2,000 aggregate per election under KRS 121.150(3). Federal: $50 anonymous max.
└─ NO → Q4.8

Q4.8: Has this donor already contributed at the annual cap?
(Individuals: $5,000/year to JCDEC per KRS 121.150(11). Federal account: $10,000/year combined to all KY Dem state/local committees per 52 USC 30116(a)(1)(D).)
├─ YES → Return the excess.
└─ NO → Q4.9

Q4.9: Did the donor provide name, address, occupation, employer for any $100+ contribution?
├─ NO → Request the information before depositing. KRS 121.065.
└─ YES → Deposit and record.
```

## Tree 5: "Is this Federal Election Activity (FEA)?"

```
Q5.1: Does the activity occur in an election year where a federal candidate is on the ballot?
├─ NO → Generally not FEA. (Exception: voter registration in 120 days before federal special election.)
└─ YES → Q5.2

Q5.2: Does the activity reference a clearly identified federal candidate?
├─ YES → Type 2 FEA. 100% federal funds required. 11 CFR 300.32(a)(1).
└─ NO → Q5.3

Q5.3: Is the activity voter registration in the 120 days before the federal election?
├─ YES → Type 1 FEA. Federal-only OR federal+Levin allocated.
└─ NO → Q5.4

Q5.4: Is the activity voter ID, GOTV, or generic campaign activity in an election with a federal candidate on the ballot?
├─ YES → Type 1 FEA. Federal-only OR federal+Levin allocated.
└─ NO → Q5.5

Q5.5: Is the activity a salary/wage for an employee who spends >25% of monthly compensated time on federal-connected work?
├─ YES → Federal account only (Type 4 FEA).
└─ NO → Not FEA. KY state-law rules apply.

If FEA → also check Q5.6 (allocation %).

Q5.6: What's the cycle?
├─ Presidential + Senate on ballot → 36% minimum federal share. 11 CFR 300.33(b)(2).
├─ Presidential, no Senate → 28% minimum federal. 11 CFR 300.33(b)(1).
├─ Senate, no Presidential (e.g., 2026) → 21% minimum federal. 11 CFR 300.33(b)(3).
└─ Neither → 15% minimum federal. 11 CFR 300.33(b)(4).

If FEA → track against $5,000 calendar-year threshold (Q5.7).

Q5.7: Will this FEA push JCDEC over $5,000 aggregate FEA receipts + disbursements for the calendar year?
├─ YES → JCDEC moves to MONTHLY FEC Form 3X reporting. 11 CFR 300.36.
└─ NO → Continue current reporting cadence.
```

## Tree 6: "Can JCDEC make a coordinated expenditure for Booker / McGarvey?"

```
Q6.1: Has KDP assigned coordinated party expenditure authority to JCDEC in WRITING?
├─ NO → STOP. JCDEC has zero coordinated authority. 11 CFR 109.33(a).
└─ YES → Q6.2

Q6.2: Has KDP + JCDEC + any other KY subordinate already used the state's coordinated expenditure pool?
(2026: $468,800 for Booker; $65,300 for McGarvey.)
├─ YES (pool exhausted) → STOP. 11 CFR 109.33(b).
└─ NO → JCDEC may spend up to the assigned amount.

Then:
- Keep KDP's written assignment letter for 3 years. 11 CFR 109.33(c).
- Report to KDP for KDP's consolidated FEC report. 11 CFR 109.33(b)(1).

WATCH: NRSC v. FEC pending at SCOTUS could strike these limits anytime through June 2026.
```

## Tree 7: "Can JCDEC give money to a 501(c) or 527 nonprofit?"

```
Q7.1: Does the nonprofit make any expenditures or disbursements in connection with a federal election (including FEA)?
├─ YES → PROHIBITED unless safe-harbor written certification. 52 USC 30125(d); 11 CFR 300.37.
└─ NO → Q7.2

Q7.2: Get a written certification under 11 CFR 300.37(c)-(d), signed under penalty of perjury by responsible officer, stating that the nonprofit does not make federal-election expenditures. Renew annually.

If certification obtained → JCDEC may donate.
If certification refused → PROHIBITED.

WARNING: This is a personal liability trap for JCDEC officers (including Vice Chair). Never send JCDEC money to a 501(c)(3), (c)(4), or 527 without the certification or clear safe-harbor status.
```

## Tree 8: "What reports does JCDEC need to file?"

```
Q8.1: Calendar year reports — KEFMS:
├─ Semi-annual report Jan 31 (covers Jul 1 – Dec 31). Required regardless of activity.
├─ Semi-annual report Jul 31 (covers Jan 1 – Jun 30). May certify out if under $10K threshold per 32 KAR 1:030.
└─ Post-primary supplemental within 30 days of primary day.
└─ Post-general supplemental until books are clean. 32 KAR 2:100.

Q8.2: Independent expenditures > $500/election → direct IE report to KREF via KEFMS. 32 KAR 1:080.

Q8.3: ITC funds > $1,500/year → mandatory annual KREF audit. KRS 121.230(5).

Q8.4: FEA receipts + disbursements > $5,000/year → MONTHLY FEC Form 3X with $200+ itemization. 11 CFR 300.36.

Q8.5: Itemize every individual contributor with $100+ aggregate per election: name, address, occupation, employer. KRS 121.065; 121.180(3).

Q8.6: Itemize every expenditure >$25 with payee name, address, occupation, date, amount, purpose. KRS 121.160(2)(c)-(d).

Q8.7: Retain records for 6 years from date of last report. KRS 121.160(2)(d).
```

## Tree 9: "Does JCDEC need a Levin account?"

```
Q9.1: Will JCDEC do any voter registration in the 120 days before a federal election, OR any voter ID / GOTV / generic campaign activity in a federal-ballot election year?
├─ NO → No Levin account needed.
└─ YES → Q9.2

Q9.2: Does JCDEC want to use NON-FEDERAL money for any portion of those activities?
├─ NO → Pay 100% with federal-account funds. No Levin needed.
└─ YES → Open a Levin account. Q9.3.

Q9.3: Set up Levin account structure under 11 CFR 300.30:
├─ Option 1: Single federal account (with Levin and non-federal transferred in).
├─ Option 2: Three separate accounts (Federal + Levin + Non-Federal).
└─ Option 3: Two accounts (Federal + combined Non-Federal/Levin with FEC-approved accounting).

Then:
- Raise Levin funds only from KY-legal sources (no corporations under KRS 121.025; no foreign nationals; no national party; no other state/local committees).
- $10,000 / donor / calendar year cap. 11 CFR 300.31(d).
- No joint fundraising with KDP, other DECs, or federal candidates for Levin. 11 CFR 300.31(e)-(f).
- Levin only for Type 1 FEA categories, never Type 2. 11 CFR 300.32.
- Apply correct allocation %: 2026 = 21% federal minimum. 11 CFR 300.33(b)(3).
```

## Tree 10: "Can JCDEC accept this corporate sponsorship of our event?"

```
Q10.1: Is the sponsorship a contribution of money or anything of value (free venue, free printing, discounted catering, sponsorship payment)?
├─ YES → Q10.2
└─ NO → Not a contribution. No issue.

Q10.2: Is the contributor a corporation, LLC, LLP, S-corp, not-for-profit corp, partnership, or union?
├─ YES → PROHIBITED. KRS 121.025; 52 USC 30118.

   Workarounds:
   - The business owner may contribute personally up to applicable limits (individual not entity).
   - The business may sponsor a corporate PAC (SSF) which then contributes to JCDEC.
   - The business may purchase advertising in JCDEC's printed materials at fair market rates if those materials are not contributions (rare; ask legal).

   Otherwise: politely decline.

└─ NO → Acceptable subject to individual / PAC contribution limits and source vetting (Tree 4).
```


---

<!-- SOURCE: references/12-open-questions.md -->

# Open Questions — Where the Law Is Silent or Ambiguous

## Scope

Use this file when the chat answer is "the law isn't clear; here's why; here's what to do." These are gaps in the statutory/regulatory framework that JCDEC should resolve via KREF advisory opinion (KRS 121.135; 32 KAR 2:060) or FEC advisory opinion (52 USC 30108) before relying on a position.

## How to file an advisory opinion request

### Kentucky (KREF)
- **To**: KREF General Counsel, 140 Walnut Street, Frankfort, KY 40601
- **Email**: KREFRequests@ky.gov
- **Phone**: 502-573-2226
- **Process**: 32 KAR 2:060. KREF posts qualifying requests publicly, accepts comment for 10 calendar days, then issues a written opinion.
- **Effect**: Safe harbor for the requester on facts presented.

### Federal (FEC)
- **To**: Federal Election Commission, Office of General Counsel
- **Email**: ao@fec.gov
- **Phone**: 1-800-424-9530
- **Process**: 11 CFR 112. FEC publishes draft AO, votes by Commission.
- **Effect**: Safe harbor for the requester; precedential for others on similar facts.

## Q1: Can a Louisville nonpartisan candidate transfer surplus campaign funds to JCDEC?

**Statutory text**: KRS 121.180(10)(d) provides that surplus campaign funds "shall escheat to the State Treasury, be returned pro rata to all contributors, OR, in the case of a partisan candidate, be transferred to a caucus campaign committee, or to the state or county executive committee of the political party of which the candidate or committee is a member."

**Plain reading**: Party-transfer is the partisan-only option. Nonpartisan candidates (Mayor, Metro Council, JCPS, judicial) cannot route surplus to JCDEC. They must escheat or refund.

**Why an advisory opinion may still be worth filing**: Plain reading is clear, but with Mayor and Metro Council newly nonpartisan under HB 388 (2024) — and with no prior KREF advisory opinions interpreting the partisan/nonpartisan classification post-HB 388 — locking in the interpretation prevents challenge.

**Recommended advisory opinion question**:
> "Please confirm that a candidate for Louisville Metro Mayor or Metro Council, which became nonpartisan under HB 388 (2024), may not transfer unexpended campaign funds to a county executive committee under KRS 121.180(10)(d), and that surplus must be disposed of by escheat or pro rata refund."

## Q2: Can a non-General-Assembly partisan or nonpartisan candidate transfer funds from an active campaign account to JCDEC mid-cycle?

**Statutory text**: KRS 121.175(1) explicitly authorizes General Assembly members to transfer up to $5,000/year from their campaign account to a party/caucus committee.

**Gap**: Statute is silent on whether any OTHER candidate (state House primary loser, Metro Council candidate, judicial candidate, Sheriff, etc.) may make mid-cycle transfers from an active campaign account to JCDEC.

**Operational risk**: If candidates assume mid-cycle transfers are permitted and they're not, both the candidate's committee and JCDEC could be liable.

**Recommended advisory opinion question**:
> "May a candidate for [Mayor / Metro Council / JCPS Board / Sheriff / etc.], who is not a member of the General Assembly, utilize funds in his or her campaign account during the campaign cycle to make contributions to a county executive committee under any provision of KRS Chapter 121?"

## Q3: Does JCDEC need explicit bylaw authorization to make contributions to candidates in nonpartisan races, or is silence sufficient?

**KREF guidance**: From the KREF Contribution Limits page:
> "Party rules and or by-laws may prohibit Executive Committees and Caucus Campaign Committees from making contributions to candidates in non-partisan races. For more information, you may contact these committees."

**Translation**: KREF says BYLAWS are the constraint, not statute. Bylaws "may prohibit" — implying default is permitted unless prohibited. But:

**Gap**: Is silence in JCDEC bylaws sufficient authorization? Or does JCDEC need explicit affirmative authorization to contribute to nonpartisan candidates? This question is internal to the party but matters for legal compliance.

**Recommended internal action**: Audit JCDEC bylaws (and KDP state bylaws as parent document) for any language addressing nonpartisan candidate contributions. If unclear, request KDP guidance OR amend JCDEC bylaws to explicitly authorize before the 2026 general.

## Q4: What level of "coordination" on a slate card triggers the in-kind contribution analysis for a nonpartisan candidate?

**KREF guidance**: KREF Executive Committee Guide (Rev. 09/2025), Chapter 2:
> "An 'ad' for a specific candidate or candidates would also be either an in-kind contribution or an independent expenditure from the committee to the candidate or candidates if not for all the candidates on the party's ballot."

**The post-HB 388 problem**: Mayor and Metro Council are now OFF the party ballot. JCDEC sample ballots / slate cards have historically listed party-line candidates from top of ticket through local races. With Mayor and Metro Council excluded from "party's ballot" status, what counts as "ALL candidates on the party's ballot"?

**Two possible readings**:
- **Reading A**: A slate card listing all PARTISAN Dems is "all candidates on the party's ballot" — no in-kind / IE allocation needed. Adding nonpartisan Dems creates allocation duty for the nonpartisan portion.
- **Reading B**: A slate card listing Dems generally (partisan + nonpartisan) is treated as if "the party's ballot" includes those Dems by association — and in-kind allocation runs across the whole list.

**Recommended advisory opinion question**:
> "How does the in-kind / independent expenditure analysis in KREF guidance for partisan slate cards apply where the candidates listed include nonpartisan offices not assigned to the party on the ballot under HB 388 (2024)?"

## Q5: Can JCDEC list nonpartisan candidates on GOTV materials WITHOUT the candidate's coordination?

**Statutory framework**: If no coordination, this is an independent expenditure subject only to >$500 reporting (KRS 121.150). If any coordination, it becomes an in-kind contribution to that candidate.

**Operational question**: JCDEC will produce GOTV materials (door hangers, sample ballots, mailers) that list candidates. If JCDEC consults with the Mayor's campaign about which mailing universes to target, is that coordination triggering in-kind treatment?

**Best practice**: Establish a firewall. JCDEC's IE program runs separately from any candidate-coordinated work. Document the firewall. Don't share staff, vendors, or strategic information between IE and coordinated tracks.

**Recommended advisory opinion question**:
> "Please describe the level of consultation that constitutes 'coordination' for purposes of KRS 121.015(6)(b)-(c) between an executive committee and a nonpartisan candidate when the committee includes the candidate's name on GOTV materials."

## Q6: Can the JCDEC General Account fund mailers / GOTV in a federal-ballot year without triggering federal FEA rules?

**Federal framework**: 52 USC 30125(b)(1) provides that any "Federal election activity" by a state/local party committee must be paid from FECA-compliant federal funds (or properly allocated federal + Levin per 11 CFR 300.33).

**FEA includes** (52 USC 30101(20)(A); 11 CFR 100.24):
- Voter registration in the 120 days before a federal election;
- Voter ID / GOTV / generic campaign activity in an election with a federal candidate on ballot;
- Public communications referring to a clearly identified federal candidate;
- Salaries of staff spending >25% time on federal-connected work.

**Operational question**: JCDEC's General Account is a state-account governed by KRS 121. If JCDEC uses General Account funds for a "Vote Democrat" GOTV mailer in November 2026 (a federal-ballot year with Booker and McGarvey on the ballot), JCDEC has used non-federal money for FEA — a 30125(b) violation.

**Practical fix**:
- Establish a federal account (or use existing federal account if JCDEC has one).
- Track Levin fund threshold.
- Apply correct allocation percentage (21% federal for 2026 cycle).
- Track $5,000 FEA threshold; cross it = monthly FEC reporting.

**Advisory opinion may not be needed** — the federal rules are clear. But JCDEC should confirm internally that the General Account is not being used for FEA in federal-ballot years.

## Q7: Are there any KREF or FEC advisory opinions directly addressing HB 388 or the 2026 Louisville nonpartisan races?

**Research gap**: KREF's advisory opinion archive is searchable by year and category but not full-text. The FEC's AO database is full-text searchable but unlikely to address Louisville specifically.

**Recommended action**: Direct outreach.
- Call KREF General Counsel at 502-573-2226 and ask whether any advisory opinions issued 2024–2026 address Louisville Metro nonpartisan elections under HB 388. Request copies of any on point.
- Search FEC AO database for any opinions involving Kentucky state party committee structure or county committee assignments.

## Q8: How should JCDEC handle a federal officeholder (McGarvey) headlining a JCDEC fundraiser that has BOTH federal-account and Levin/non-federal asks?

**Federal framework**: 52 USC 30125(e)(1) prohibits federal candidates/officeholders from soliciting non-federal funds. 30125(e)(3) carve-out: may "attend, speak, or be a featured guest" at state/local party fundraiser raising Levin/non-federal funds.

**Operational question**: At an event where McGarvey speaks, are the AUDIENCE remarks (his stump speech) "solicitation" if JCDEC's solicitation materials reference Levin/non-federal funds? Where's the line between "headlining" and "soliciting"?

**Best practice from FEC guidance**:
- McGarvey may speak, attend, and be featured.
- McGarvey may NOT make the actual "ask" for non-federal/Levin money — that ask must come from JCDEC.
- Separate solicitation materials by account: federal-account asks signed by McGarvey OK; non-federal/Levin asks signed by JCDEC officer.

**Recommended advisory opinion question** (if novel circumstances arise):
> "When a federal officeholder speaks at a state/local party fundraising event raising both federal and Levin/non-federal funds, what specific language and roles for the federal officeholder remain within the 'attend, speak, or be a featured guest' carve-out of 52 USC 30125(e)(3)?"

## Q9: What happens to JCDEC's existing federal coordinated party expenditure authority if NRSC v. FEC strikes 52 USC 30116(d)?

**Current situation**: NRSC v. FEC argued at SCOTUS December 9, 2025. Decision expected through June 2026. May strike down the coordinated party expenditure limits in 52 USC 30116(d).

**If struck down**:
- KDP no longer has a state coordinated expenditure pool ($468,800 Senate / $65,300 House for 2026).
- JCDEC's role under 11 CFR 109.33 changes — there's no pool to assign.
- Direct contribution limits ($5,000 affiliated combined to federal candidates) likely remain unaffected (those are 52 USC 30116(a), not (d)).
- Coordination/in-kind framework remains (11 CFR 109.20-23).

**Monitoring approach**: Calendar monthly check of SCOTUS docket. If decision lands, contact KDP within 48 hours to discuss capacity reallocation for remaining 2026 cycle (primary done May 19; general November 3).

## Summary table — advisory opinion candidates

| # | Question | Recommended action | Audience |
|---|---|---|---|
| Q1 | Nonpartisan surplus transfer | File KREF AO to confirm partisan-only reading | KREF |
| Q2 | Non-GA candidate mid-cycle transfers | File KREF AO to clarify scope of 121.175 | KREF |
| Q3 | JCDEC bylaw authorization for nonpartisan contributions | Internal bylaw audit | JCDEC / KDP |
| Q4 | Slate card in-kind / IE allocation post-HB 388 | File KREF AO | KREF |
| Q5 | Coordination threshold for slate cards | File KREF AO | KREF |
| Q6 | General Account vs. FEA | No AO needed; internal compliance check | JCDEC treasurer |
| Q7 | Existing HB 388 AOs | Direct outreach call to KREF | KREF |
| Q8 | Federal officeholder at mixed-account fundraiser | File FEC AO if novel | FEC |
| Q9 | NRSC v. FEC contingency | Monitor docket; pre-position with KDP | SCOTUS / KDP |