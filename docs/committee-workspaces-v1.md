# Committee Workspaces + Official Records + Leadership Transition

**Version 1.0 — Approved**
**Date:** May 29, 2026
**Status:** In build — Phase 1 (data layer landed; UI in flight)

This is the working spec being built against. The original approval doc is in chat history; this file is the source of truth going forward and supersedes any earlier draft.

---

## 1. Goals

- Solve recurring chair pain: no central place for agendas, running notes, ideas, accountability on action items.
- Create recurring value so members come back between meetings.
- Support smooth leadership transition after the upcoming Chair election.
- Reduce manual chair work (pre-meeting email bundles) by making official records and tasks visible in-app.

## 2. Scope

**In v1:**
- Per-committee workspaces with message-board posts (AGENDA, NOTES, IDEA, DECISION, ACTION_ITEM, LINK, FILE).
- Action Items with per-assignee accept/reject + required rejection reason.
- Meeting Setter (next meeting + reminders surfaced on the role-aware dashboard).
- Official Records (Secretary uploads minutes; Treasurer uploads reports; status DRAFT → PUBLISHED → APPROVED/AMENDED).
- Year in Review / Leadership Transition Brief.
- Tour integration.

**Deferred to v2:** threaded replies, Google Meet integration, automated notifications, VoteBuilder embed, deeper analytics.

## 3. Data model

See `supabase/migrations/20260529001_committee_workspaces.sql` for the authoritative schema. Summary:

- **`workspace_posts`** — one row per post, scoped to a committee (`committee_code`). Post types: AGENDA, NOTES, IDEA, DECISION, ACTION_ITEM, LINK, FILE. `meeting_date` is populated on AGENDA posts (upcoming meetings) and NOTES posts (minutes for a given meeting). Author identity is soft (`author_member_id` nullable + `author_display_name` required) until OAuth.
- **`post_assignments`** — one row per (post, assignee). Status: PENDING → ACCEPTED / REJECTED → IN_PROGRESS → DONE. Rejection requires a `rejection_reason`.
- **`meeting_records`** — historical record of LDPEC or committee meetings. Points to the minutes post + treasurer report post. Status: DRAFT → PUBLISHED → APPROVED / AMENDED.

### Spec deltas from the original v1 doc

| Original spec | What we built | Reason |
|---|---|---|
| `committee_workspaces` table | Dropped — `committee_code` on posts/records directly | Overengineering; workspace is implicit |
| `workspace_posts.assigned_to uuid[]` + single `status` | Separate `post_assignments` table | Per-assignee accept/reject requires per-assignee state |
| `author_id uuid NOT NULL` | `author_member_id` nullable + `author_display_name` text not null | Identity is localStorage-soft until OAuth |
| `committee_meetings` (implied for Meeting Setter) | Use `workspace_posts` type=AGENDA with `meeting_date` | One fewer table; same query shape |
| `gen_random_uuid()` | `uuid_generate_v4()` | Match existing migration convention |
| `CREATE TABLE` uppercase | lowercase | Match existing migration style |
| RLS policies in v1 | Deferred to OAuth migration | Matches the v2.0 RLS-disabled posture |

## 4. Permission model

Roles resolved by `src/lib/auth/roles.ts` from the `ec_members` row. Single source of truth for both UI gating and the (future) RLS policies.

| Role | Post | Assign | Accept/Reject own | Publish minutes | Publish treasurer report | View YIR |
|---|---|---|---|---|---|---|
| Committee Member | ✓ | — | ✓ | — | — | — |
| Committee Chair | ✓ | ✓ | ✓ | — | — | — |
| Secretary | ✓ | ✓ | ✓ | ✓ | — | — |
| Treasurer | ✓ | ✓ | ✓ | — | ✓ | — |
| Officers (Chair, VC) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Incoming** Chair / VC | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Incoming detection:** an `ec_members` row with `term_start > today` and `officer_role IN ('CHAIR', 'VICE_CHAIR')` is treated as incoming leadership and gets elevated permissions during the handoff window.

**Enforcement caveat (Phase 1):** the portal is on passphrase auth; identity is set in localStorage via the dashboard "Edit profile" flow. Permission checks are advisory, not enforced. The schema and resolver are correct; RLS will lock things down when OAuth lands. Don't treat workspace posts as audit-grade until then.

## 5. Action Item workflow

1. An authorized role creates a post with `post_type = 'ACTION_ITEM'` and adds N assignees.
2. The migration trigger seeds one `post_assignments` row per assignee with `status = 'PENDING'`.
3. Each assignee independently sees the task in their dashboard and clicks **Accept** or **Reject**.
   - **Accept** → status `ACCEPTED`, `responded_at = now()`. The assignee can later move it to `IN_PROGRESS` or `DONE`.
   - **Reject** → status `REJECTED`, requires `rejection_reason` (enforced at the API layer; not a DB CHECK so existing accepted rows can later be soft-rejected without backfilling reasons).
4. The post-level "rollup" status (for list views) is computed client-side: any DONE → "Done"; any IN_PROGRESS → "In progress"; all PENDING → "Awaiting acceptance"; mixed → "Partial."

## 6. Year in Review / Leadership Transition Brief

**Route:** `/leadership-transition` (Phase 1 also reachable from the dashboard for eligible roles).

**Audience:** incoming Chair + VC + current Officers (resolved by `canViewYearInReview()` in `src/lib/auth/roles.ts`).

**Content:**
- Last year's `meeting_records` (with links to minutes posts).
- Calendar of upcoming meetings (forward-looking AGENDA posts).
- Unique Chair / VC capabilities in the app (auto-generated from the permission table).
- Full committee permission overview.
- Note that proper system use reduces the chair's pre-meeting email burden.

**Welcome message:** `Welcome to your workspace, [Name]. As [Role], everything you need to be an effective board member is in this app.`

**Curation:** Lisa reviews and approves the curated YIR before the transition. Phase 1 ships with auto-generated sections; curation is a manual content sweep before the handoff.

## 7. Routes & components

```
src/app/
├── committees/[code]/workspace/page.tsx       # main committee workspace
├── leadership-transition/page.tsx              # YIR (gated to authorized roles)
├── official-records/page.tsx                   # public-to-EC list of LDPEC + committee meeting records
└── dashboard/                                  # updated to surface upcoming meetings + my action items

src/components/workspace/
├── WorkspacePostComposer.tsx                   # all post types; ACTION_ITEM is special-cased
├── ActionItemCard.tsx                          # per-assignee state + Accept/Reject buttons
├── MeetingSetter.tsx                           # form → creates an AGENDA post
└── PostList.tsx                                # filter by post_type, pinned-first

src/lib/auth/roles.ts                           # role resolver — single source of truth
src/lib/db/workspace.ts                         # all workspace_posts + post_assignments queries
src/lib/db/meeting-records.ts                   # meeting_records CRUD
```

## 8. Implementation phases

**Phase 1 (in flight — through launch):**
1. ✅ Migration `20260529001_committee_workspaces.sql`
2. ✅ `src/lib/auth/roles.ts` role resolver
3. Workspace UI: post composer, post list, pinning
4. Action Item: composer, per-assignee state, Accept/Reject flow with rejection reason
5. Meeting Setter + dashboard "Upcoming for you" strip
6. Official Records: upload minutes + treasurer report; DRAFT → PUBLISHED → APPROVED workflow
7. `/leadership-transition` YIR page
8. Tour updates for the new surfaces

**Phase 2 (after launch):**
- Threaded replies on posts
- Google Meet integration
- Automated notifications (email digest of action items, meeting reminders)
- VoteBuilder embed
- Deeper YIR automation (delta vs prior year, attendance graphs)

## 9. Resolved open decisions (from the original spec)

1. **Rejection reason required?** Yes — enforced at the API layer. Half the value is the disagreement being visible; optional reasons get skipped.
2. **Initial YIR access?** Incoming Chair + VC + current Officers. Officers gate-keep the curation step so they need read access during prep.
3. **Meeting reminders on dashboard?** Single "Upcoming for you" strip — surfaces (a) the next LDPEC meeting and (b) any committee meeting where you're a member or chair. Two queries, one card. Pushed below the existing "needs attention" section.
