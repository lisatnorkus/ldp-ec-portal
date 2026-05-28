# Decision Trees

Procedural flows for recurring questions. Each tree starts with a question, walks through the bylaws-driven branches, and ends with the operational answer + citation.

## 1. "Is this proxy valid?"

```
START
  │
  ▼
Is the meeting taking up the election or dismissal of a Party officer?
  ├── YES → INVALID. No proxies allowed for election/dismissal.
  │       [LJCDP §23.1], [KDP Art. III.A.a]
  │
  └── NO ▼
       │
       Who is assigning the proxy?
       │
       ├── LD Chair, LD Vice Chair, or LD At-Large member
       │   ▼
       │   Is the proxy in writing or electronic, specifying:
       │     (a) the specific meeting, AND
       │     (b) the specific CEC member it's assigned to?
       │   ├── NO → INVALID. [LJCDP §23.2]
       │   └── YES ▼
       │        Is the proxy assignee a member of the CEC?
       │        ├── NO → INVALID. [LJCDP §23.2]
       │        └── YES ▼
       │             Is the proxy assignee present at LJCDP HQ
       │             by the start of the meeting?
       │             ├── NO → INVALID. [LJCDP §23.3]
       │             └── YES → VALID for general business.
       │                       (May also be assigned for limited purpose
       │                        during specific meeting per [LJCDP §23.2.1])
       │
       ├── Young Democrats Club President or Women's Club President
       │   ▼
       │   LJCDP §23.2: "No other member of the County Executive Committee
       │   may assign their proxy, including the President of the Jefferson
       │   County Young Democrats Club and the representative of the
       │   Jefferson County Democratic Women's Club."
       │   →  INVALID under LJCDP.
       │   (DRIFT: [KDP Art. III.A.a.ii] would allow assignment to chapter
       │   officer with notice to Secretary. LJCDP is stricter.)
       │
       └── County Chair, County VC, Secretary, Treasurer, or any other
           non-LD-officer member
           → INVALID. [LJCDP §23.2] permits proxy only for LD Chair, LD VC,
           and LD At-Large.
```

## 2. "How do we fill this vacancy?"

```
START — vacancy exists.
  │
  ▼
What seat?
  │
  ├── County Chair, County VC, LD Chair, LD VC, or At-Large member
  │   ▼
  │   Schedule CEC meeting within 30 days [LJCDP §21.1].
  │   ├── Quorum: 40% of LD Chairs + LD VCs + LD At-Large present IN PERSON
  │   │   (proxies don't count for officer election) [LJCDP §22.1.1]
  │   ├── Vote: majority of voting CEC members present and voting [LJCDP §21.1]
  │   │   (no proxies for the vote itself) [LJCDP §23.1]
  │   ├── If County Chair vacancy + successor is different sex from incumbent
  │   │   County VC → VC seat automatically vacates [LJCDP §19.1]
  │   ├── If County VC vacancy → successor must be a current LD Chair of
  │   │   different sex than County Chair [LJCDP §10.2]
  │   └── If CEC misses 90-day envelope → SCEC Chair fills
  │       [KDP Art. III.D.h.i]
  │
  ├── Precinct Committee member
  │   ▼
  │   LD Chair notifies SCEC of vacancy [KDP Art. III.B.c].
  │   ├── CEC has 90 days from notification to fill
  │   └── If unfilled → SCEC Chair fills [KDP Art. III.B.c]
  │
  ├── Redistricting vacancy (new LD maps drawn — automatic July 1)
  │   ▼
  │   CEC has 60 days to fill [KDP Art. III.D.i.i]
  │   ├── Quorum: 50% of remaining non-vacated positions [KDP Art. III.D.i.ii]
  │   ├── Special preservation rule: County Chair retains seat even if their
  │   │   simultaneously-held LD position is vacated [KDP Art. III.D.i.iii]
  │   ├── County VC: if their LD Chair position is vacated, County VC seat
  │   │   also vacates; new VC elected from LD Chairs of different sex than
  │   │   County Chair [KDP Art. III.D.i.iv]
  │   └── If unfilled → SCEC Chair fills [KDP Art. III.D.i.i]
  │
  └── SCEC seat
       ▼
       See 02-kdp-bylaws.md → Article IV.H process at the state level.
       Not a CEC operational concern; involved only insofar as State
       Delegates from JeffCo contribute to SCEC composition.
```

## 3. "Can we adopt new business at the same meeting it's introduced?"

```
START — Motion is on the floor introducing new business.
  │
  ▼
Has the new business already been introduced at a previous CEC meeting?
  ├── YES → Adopt under simple majority vote [LJCDP §25.1] (regular process)
  └── NO ▼
       │
       Is this a new-business motion AT THE SAME MEETING it was introduced?
       └── YES ▼
            │
            Special threshold required [LJCDP §25.2]:
            "approved by as many voting members as would represent two-thirds
             (2/3) of the Legislative Districts wholly or partially within
             Jefferson County"
            │
            ▼
            Count LDs represented in present-and-voting members.
            (Voting members may be LD Chairs, LD VCs, LD At-Large, or any
             combination — per [LJCDP §25.2.1])
            │
            ▼
            Are at least 2/3 of JeffCo's LDs represented?
            (JeffCo has 18 LDs → 2/3 = 12 LDs minimum)
            │
            ├── YES → Adopt at same meeting with simple majority of those
            │         present and voting [LJCDP §25.2]
            │
            └── NO → CANNOT adopt at same meeting.
                     Refer to next meeting per [LJCDP §25.1].
```

**Practical takeaway:** Adopting new business at the same meeting requires 12 of 18 LDs to be represented in the voting members present. This is a deliberate "speed bump" — same-meeting adoption is reserved for matters with broad LD representation.

## 4. "Is this convention notice valid?"

```
START — Notice has been issued for a Precinct, LD, or County Convention.
  │
  ▼
Is the notice given between 7 and 30 days before the Convention?
  ├── NO → INVALID. Must be ≥7 days and ≤30 days before [KDP Art. II.B.f].
  │       (Note: emergency waiver available per [KDP Art. II.B.e.i] for
  │        acts of God, declared emergencies, or conflicting major events.)
  └── YES ▼
       │
       Are at least 3 of the 6 advertisement methods used?
       Methods [KDP Art. II.B.f.i] through [KDP Art. II.B.f.vi]:
         (i)   Local newspapers (PSA or news item)
         (ii)  Local radio/TV (PSA or news item)
         (iii) County party social media
         (iv)  County party website
         (v)   Mobilize / Facebook Events / web event builders
         (vi)  Email to CEC + county Dem email list, OR US Mail to CEC,
               OR phone calls to CEC
       │
       ├── NO → INVALID. Must use ≥3 of 6.
       └── YES ▼
            │
            Did the CEC Chair AND the SCEC Chair both publicize widely?
            ├── NO → Notice is procedurally incomplete; may be challenged
            │       on appeal per [KDP Art. V.A] (3 days to file)
            └── YES → VALID notice. Convention may proceed.
```

## 5. "Should this CEC vote pass?"

```
START — CEC is taking a vote.
  │
  ▼
What is the vote about?
  │
  ├── Bylaws amendment ──────────────────────────────────────────────
  │   Required: majority at meeting with quorum present
  │   AND either:
  │     (a) ≥2 weeks written notice to all CEC members, OR
  │     (b) action introduced at previous CEC meeting
  │   Cite: [LJCDP §29.1]
  │
  ├── New business adopted at same meeting it's introduced ─────────
  │   Required: 2/3 of JeffCo LDs represented in voting members present
  │   Cite: [LJCDP §25.2]
  │   See tree #3 above for details.
  │
  ├── Removal of County Chair (without cause) ──────────────────────
  │   Required: majority of voting CEC members
  │   No proxies count for this vote [LJCDP §22.1.1], [LJCDP §23.1]
  │   Cite: [LJCDP §16.1] (LJCDP), [KDP Art. III.D.f.i] (KDP)
  │   Quorum: 40% in person of LD Chairs + LD VCs + LD At-Large
  │
  ├── Removal of County VC (without cause) ─────────────────────────
  │   Same as Chair removal.
  │   Cite: [LJCDP §18.1]
  │
  ├── Removal of any Party Officer (for failure to support or disavowal)
  │   Required: majority of voting CEC, after hearing
  │   Cite: [LJCDP §15.1], [LJCDP §15.2], [KDP Art. I.K.f], [KDP Art. I.K.g]
  │   Note: removal for non-support requires findings on BOTH:
  │     (1) Did officer fail to support? AND
  │     (2) Was failure inappropriate?
  │   Per [KDP Art. I.K.f].
  │
  ├── Filling officer vacancy ─────────────────────────────────────
  │   Required: majority of voting CEC, within 30 days
  │   No proxies for the vote
  │   Cite: [LJCDP §21.1]
  │   See tree #2 above.
  │
  ├── Sanctioning a new Women's or Young Dems Club ─────────────────
  │   Required: majority of voting CEC
  │   Vote occurs 6 months after application
  │   Cite: [LJCDP §3.4]
  │
  ├── Designating honorary titles ─────────────────────────────────
  │   Required: majority of voting CEC
  │   Cite: [LJCDP §11.8]
  │
  ├── Expansion of CEC membership (counties ≤6 LDs only — not JeffCo)
  │   Required: 75% of full Executive Committee
  │   Cite: [KDP Art. III.D.b.vi.2]
  │
  ├── Electronic voting (email or other) ─────────────────────────
  │   Permitted per [LJCDP §27.1]
  │   Threshold per the underlying matter being voted on
  │
  ├── Endorsement of a Mayor or Metro Council candidate (nonpartisan)
  │   Required: 60% of votes cast, secret ballot via ElectionRunner,
  │             no proxies
  │   Cite: [LDP Endorsement Process Policy] (NOT in bylaws)
  │   See `06-endorsement-process.md`
  │
  ├── Tie vote on any matter ──────────────────────────────────────
  │   Broken by vote of State Central Committee [LJCDP §24.1]
  │
  └── Anything else covered by Robert's Rules ─────────────────────
      Apply per [LJCDP §28.1], [KDP Art. I.Q]
      Standard parliamentary motion procedure applies.
```

## 6. "Is the County Chair's office vacant?"

```
START — Question raised about County Chair's continued tenure.
  │
  ▼
Has the County Chair held at least one CEC meeting per quarter?
(Quarters: Q1 = Jan-Mar, Q2 = Apr-Jun, Q3 = Jul-Sep, Q4 = Oct-Dec)
(Per [KDP Art. III.D.e.i.1.c] quarterly meetings shall occur during
 February, May, August, and November)
  │
  ├── NO → Office DECLARED VACANT [LJCDP §17.1]
  │       (No CEC vote required to accept — automatic mechanic.)
  │       Proceed to vacancy fill per tree #2.
  │
  └── YES ▼
       │
       Has the County Chair missed 2 successive CEC meetings
       (in person or by written proxy)?
       ├── YES → Office DECLARED VACANT [LJCDP §20.1], [KDP Art. III.D.g]
       └── NO ▼
            │
            Has the County Chair missed 50% of annual CEC meetings
            in person?
            ├── YES → Office DECLARED VACANT [LJCDP §20.1], [KDP Art. III.D.g]
            └── NO ▼
                 │
                 Has the CEC voted majority to remove for:
                   (a) Failure to support Dem nominees, after hearing
                       [LJCDP §15.1]?
                   (b) Disavowal of allegiance, after hearing
                       [LJCDP §15.2]?
                   (c) Without cause [LJCDP §16.1]?
                   (d) KDP confidentiality breach [KDP Art. I.K.a]?
                   (e) KDP intentional bylaw non-compliance [KDP Art. I.K.b]?
                 ├── YES → Office VACANT after the vote.
                 │       Proceed to vacancy fill per tree #2.
                 └── NO → Office not vacant. Status quo continues.
```

## 7. "Whose Nominating Committee fills this seat?" (special elections)

```
START — A Dem-held state-level seat has been vacated mid-term, and the
seat needs a Democratic nominee for the special election.
  │
  ▼
What office?
  │
  ├── US House (Congressional) — multi-county district
  │   → Nominating Committee = Dem County Chairs of each county in district
  │   → Chair = County Chair with largest Dem vote at preceding Presidential
  │   → Vote weighting: per [KDP Art. VI.D]
  │   → Cite: [KDP Art. VI.A]
  │
  ├── US House (Congressional) — single county, county has 7+ LDs
  │   (e.g. KY-3 entirely in JeffCo)
  │   → Nominating Committee = Chairs of every LD wholly or partially in
  │     district. Only LD Chairs vote.
  │   → Chair = County Chair (or VC; or senior LD Chair of largest Dem vote)
  │   → Cite: [KDP Art. VI.C.a]
  │
  ├── State Senate — multi-county
  │   → Nominating Committee = voting EC members of each county residing
  │     in district (or if <2 reside: PC members)
  │   → Chair = County Chair of largest Dem vote at preceding Presidential
  │   → Cite: [KDP Art. VI.B]
  │
  ├── State Senate — single county with 7+ LDs (e.g. JeffCo SD-26)
  │   → Same as multi-county Congressional in JeffCo: LD Chairs vote.
  │   → Chair = County Chair (or VC)
  │   → Cite: [KDP Art. VI.C.a]
  │
  ├── State House — multi-county
  │   → Voting EC members residing in district; PC members backup if <2
  │   → Chair = County Chair of largest Dem vote
  │   → Cite: [KDP Art. VI.B]
  │
  ├── State House — single LD wholly in one county with 7+ LDs
  │   (e.g. any HD wholly in JeffCo)
  │   → Nominating Committee = Precinct Committee members residing in LD.
  │     Only PC members vote.
  │   → Each PC member's vote = total registered Dems in their precinct
  │   → Chair = LD Chair (or VC; or senior At-Large residing in LD)
  │   → LD Chair convenes organizing committee of CEC members residing in
  │     LD to set date/time/location/process [KDP Art. VI.C.b.ii]
  │   → LD Chair notifies PC members [KDP Art. VI.C.b.iii]
  │   → Tie broken by County Chair [KDP Art. VI.C.b.v]
  │   → Cite: [KDP Art. VI.C.b]
  │
  ├── Metro Council — single LD or multi-LD within single county (JeffCo)
  │   → Nominating Committee = voting CEC members + LD VC residing within
  │     LDs comprising the MC district. (LD VC has a vote here.)
  │   → Vote weighting: proportional to Dem registration at preceding General
  │     within district AND within voter's LD
  │   → Chair = County Chair (or VC; or LD Chair of largest Dem vote)
  │   → Cite: [KDP Art. VI.C.c]
  │
  ├── State House/Senate — single county with ≤6 LDs
  │   → Voting CEC members residing in district (or if <3 reside: PC members)
  │   → Chair = County Chair (or VC)
  │   → Cite: [KDP Art. VI.C.d]
  │
  ├── County Commissioners (county-wide officers)
  │   → Vote weighting per registration formula at [KDP Art. VI.D]
  │
  └── Statewide elected office (Governor, Lt. Gov, Atty Gen, etc.)
       → Nominating Committee = voting members of SCEC at time of vacancy
       → Chair = KDP Chair (or VC)
       → Equal-weighted vote
       → Cite: [KDP Art. VI.E]
```

## 8. "Can the CEC waive a bylaw requirement?"

```
START — CEC wants to deviate from a bylaw or convention requirement.
  │
  ▼
What kind of waiver?
  │
  ├── Convention date/time waiver
  │   → CEC may petition SCEC Chair for extraordinary circumstances:
  │     (a) Act of God (tornado, flood, earthquake)
  │     (b) Officially declared state of emergency
  │     (c) Conflicting countrywide major event (no CEC control)
  │     (d) Any other event SCEC Chair agrees is extraordinary
  │   → Submit ≥15 days before SCEC-approved convention schedule
  │     (emergency waivers via phone/text/email ≥1 hour before)
  │   → SCEC Chair responds:
  │       - Foreseen: within 7 days
  │       - Unforeseen (<30 days before): within 24 hours
  │   → Cite: [KDP Art. II.B.e.i], [KDP Art. V.G]
  │
  ├── CEC rules waiver (deviation from county-level rules)
  │   → Requires CEC Chair OR 40% of sitting CEC to request
  │   → Submitted in writing to SCEC Chair
  │   → SCEC Chair calls Appellate and Waiver Committee
  │   → Decision communicated to county within 15 days of Committee decision
  │   → Cite: [KDP Art. V.H]
  │
  ├── Article III.D.b minimum CEC membership waiver (counties ≤6 LDs only)
  │   → Not applicable to JeffCo (7+ LDs)
  │   → Cite: [KDP Art. III.D.b.vi]
  │
  └── Anything else
       → Generally cannot waive bylaws. Bylaws can be amended per [LJCDP §29.1]
         (majority + 2 weeks notice OR previous-meeting introduction) or per
         [KDP Art. IV.A.b] (SCEC adopts/amends, ratified at next State Conv).
```

## 9. "Has someone been improperly removed?" (appeal procedure)

```
START — Aggrieved party believes a Convention election or CEC decision
was improper.
  │
  ▼
What is the source of the grievance?
  │
  ├── Precinct Convention or Precinct Election
  │   → File written appeal with County Chair within 3 days
  │   → County Chair files with SCEC Chair same day
  │   → CEC hearing within 3 days of receipt of appeal
  │   → County Chair presides; majority of CEC decides (final at county level)
  │   → If unsatisfied: appeal to SCEC within 5 days
  │   → SCEC hearing within 7 days; majority decides (final + conclusive)
  │   → Right to counsel + documents accessible 1 day prior
  │   → Cite: [KDP Art. V.A]
  │
  ├── LD or County Convention
  │   → Written appeal to SCEC Chair within 7 days
  │   → SCEC hearing within 15 days; majority decides (final + conclusive)
  │   → Right to counsel + documents accessible 3 days prior
  │   → Cite: [KDP Art. V.B]
  │
  ├── State Convention
  │   → Written appeal to SCEC Chair within 7 days
  │   → SCEC hearing within 15 days; majority decides (final + conclusive)
  │   → Cite: [KDP Art. V.C]
  │
  ├── CD Convention
  │   → File with any Appellate Committee member upon committee's convening
  │   → Appellate Committee convenes before State Convention
  │   → SCEC review available within 7 days of Appellate decision
  │   → SCEC hearing within 30 days
  │   → Cite: [KDP Art. V.B.d]
  │
  ├── CEC decision under Article III (not addressed in V.A)
  │   → Written appeal to County Chair within 5 days
  │   → CEC hearing within 15 days; majority decides
  │   → If unsatisfied: appeal to SCEC within 7 days
  │   → SCEC hearing within 30 days; majority decides (final + conclusive)
  │   → Cite: [KDP Art. V.D]
  │
  └── Anything else under the bylaws
       → Written appeal to SCEC Chair within 5 days
       → SCEC hearing within 30 days; majority decides (final + conclusive)
       → Documents accessible 10 days prior
       → Cite: [KDP Art. V.E]

After ALL appeals exhausted:
  → Legal action permitted, BUT only in Franklin County Circuit Court, KY
  → Cite: [KDP Art. V.F]
```

## 10. "Does this committee chair appointment need CEC approval?"

```
START — County Chair wants to appoint or replace a Standing or Ad Hoc
Committee Chair.
  │
  ▼
Is the committee a Standing Committee per [LJCDP §26.1] or an Ad Hoc?
  ├── EITHER ▼
       │
       County Chair's appointment authority is granted by [LJCDP §11.6]:
       "To appoint members of the County Executive Committee to any
        Standing, Regular, Select, Special, Ad-Hoc, or any other committees
        of the County Executive Committee."
       │
       ▼
       Is the appointee a CEC member?
       ├── NO → Cannot appoint per [LJCDP §11.6] which is limited to CEC
       │       members. Find a CEC-member candidate.
       └── YES ▼
            │
            → APPOINTMENT VALID. No CEC vote required.
            County Chair has unilateral authority per [LJCDP §11.6].
            Duties of committee determined jointly by County Chair +
            Standing Committee Chair per [LJCDP §26.1.1].
            County Chair is ex-officio voting member of the committee
            per [LJCDP §11.7].
```

## See also

- `00-quick-reference.md` for the threshold and day-count tables
- `02-kdp-bylaws.md` for Article VI verbatim (Nominating Committees)
- `07-vacancies-and-transitions.md` for fuller treatment of vacancy mechanics
- `06-endorsement-process.md` for the endorsement decision tree
- `11-known-drift.md` for cases where the tree branches differently under LJCDP vs KDP
