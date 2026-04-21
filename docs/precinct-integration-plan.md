# Precinct Integration Plan

**Goal:** Surface Jefferson County's 629 precincts — with strategy tags (DEFEND / ACTIVATE / PRIMARY / GROW), voter counts, sleeper Dem counts, turnout history, and d-margin — on LD pages and in Canvass Tools.
**Status:** Draft plan, pending sign-off before implementation.
**Filed to repo:** April 21, 2026.

---

## What exists today

### `kypolitics` Supabase project (Lisa's, already live)

The 2026 LDP Strategy Map (`26ldp-strategy-map.vercel.app`) pulls from this project.

Two relevant tables in `kypolitics.public`:

**`jeffco_voter_targeting`** — 629 rows. The richest source. Columns:
- Identity: `precinct` (text like "LL01"), `hd`, `sd`, `cd`, `metro_council`
- Registration: `total_voters`, `dem_total`, `rep_total`, `ind_total`
- Primary turnout tiers (Dem/Rep/Ind × 0/1/2/3-of-last-3 primaries)
- General turnout tiers (same × generals)
- Targeting rollups: `dem_primary_high`, `dem_general_high`, `dem_gen_not_pri` (≈ sleeper Dems), `dem_gotv_targets`, `ind_general_voters`
- Strategy: `d_margin_pct`, `strategy` (DEFEND / ACTIVATE / PRIMARY / GROW), `priority_score`

**`precincts`** — 629 rows. Simpler schema, overlap with `jeffco_voter_targeting`. Less useful than the targeting table for v2.0 purposes.

### `ldp-ec-portal` (this project)

Has an empty `precincts` table with a matching-ish schema — but we should NOT dual-source. The portal should read from kypolitics, not duplicate it.

---

## The three options

### Option A — Foreign Data Wrapper (postgres_fdw)

**What:** Set up `kypolitics` as a foreign Postgres server in `ldp-ec-portal`. Query `jeffco_voter_targeting` as a foreign table (`kypolitics.jeffco_voter_targeting`) from within `ldp-ec-portal`'s SQL.

**Pros:**
- Single Supabase client in the app; queries go through one connection
- Live data, zero sync latency
- Simple ORM integration (just another table)

**Cons:**
- Cross-project Postgres coupling: `ldp-ec-portal`'s queries depend on `kypolitics` uptime
- Supabase's FDW support requires extra setup (usually via SQL extensions); not all operations work via FDW
- Credentials management: kypolitics connection string lives in ldp-ec-portal's SQL
- Hard to test locally if kypolitics is unreachable
- Couples two otherwise-independent projects at the DB layer

### Option B — Nightly ETL into `ldp-ec-portal.precincts`

**What:** A scheduled job (Supabase Edge Function + `pg_cron`, or external cron calling the Supabase REST API) dumps `jeffco_voter_targeting` from kypolitics into `ldp-ec-portal.precincts` nightly.

**Pros:**
- Fully owned data inside the portal; no runtime dependency on kypolitics
- Fast reads (local table, local indexes)
- Can survive outages of the source

**Cons:**
- Data is stale up to 24 hours (acceptable for precinct targeting, not for live voter registration edits)
- ETL code to write, schedule, monitor, alert
- Schema drift risk: if kypolitics changes `jeffco_voter_targeting`, the sync breaks silently
- Two copies to reconcile

### Option C — Query kypolitics directly from the Next.js server

**What:** A second Supabase client in `ldp-ec-portal` points at kypolitics (with a read-only publishable key or a limited service role). Server components in the portal's LD/Canvass pages call it directly.

**Pros:**
- Clean data-model boundary: the portal owns only portal data
- No cross-project Postgres coupling
- No ETL, no FDW, no new infrastructure
- Easy to swap source later (LOJIC direct, different dataset) without a schema migration in the portal
- Stays within Next.js server components — no client-side exposure
- Local dev works by setting a second env var

**Cons:**
- Two network hops per page that shows precinct data (one to portal DB, one to kypolitics)
- kypolitics credentials need to be added to Vercel env vars
- If kypolitics is down, precinct sections of LD pages show an error state (but portal core still works)

---

## Recommendation: Option C

**Why:**
- Clean separation of concerns — portal data stays in portal; source data stays at source
- No new infrastructure to build or monitor (no FDW, no ETL, no cron)
- Reversible — swap the source later without touching the portal's schema
- Matches CLAUDE.md's original guidance: "read precinct data from kypolitics via a read-only service role or via nightly sync into ldp-ec-portal. Lock the write path to the portal's own tables."
- The "two network hops" concern is negligible for v2.0 load; cache is easy to add (Next.js fetch revalidation, or `unstable_cache`) if performance becomes an issue.

---

## Implementation sketch (Option C)

**1. Env vars (add to `.env.local` + Vercel):**

```
NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL=https://hhcsklwkkvsfleegtxue.supabase.co
NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY=<publishable key, read-only>
```

**2. New client file (`src/lib/supabase/kypolitics.ts`):**

```typescript
"use client"; // for browser use; also expose a server variant
import { createBrowserClient } from "@supabase/ssr";

export function getKypoliticsBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY!
  );
}
```

Plus a server variant using `createServerClient` for SSR pages.

**3. Drop the unused `precincts` table from `ldp-ec-portal`:**
```sql
DROP TABLE IF EXISTS precincts CASCADE;
```
(Optional — could also leave it empty; but dropping is cleaner once we commit to Option C.)

**4. Query patterns (used on `/my-ld/[ld]` and `/canvass-tools`):**

```typescript
// Get all precincts in a specific LD
const { data } = await kypolitics
  .from("jeffco_voter_targeting")
  .select("precinct, metro_council, strategy, dem_total, rep_total, ind_total, dem_gen_not_pri, d_margin_pct, priority_score")
  .eq("hd", String(ld_number))
  .order("priority_score", { ascending: false });
```

**5. Type mapping (in `src/lib/db/precincts.ts`):**

Define a `JeffcoPrecinct` type matching `jeffco_voter_targeting` columns, with helpers for:
- `strategy` → friendly name ("Power Base" / "Hold the Line" / "Wake the Vote" / "Plant the Flag")
- Deep-link URL for the strategy map: `https://26ldp-strategy-map.vercel.app/?precinct={precinct}`

**6. Where precincts surface:**
- `/my-ld` — the three-layer applied-education view per `tour-specification.md` Step 3
- `/canvass-tools` — priority MC × Hold-the-Line intersection
- Dashboard (for LD Chairs) — the "highest-leverage move this week" recommendation engine inputs

**7. Read-only enforcement:**
- Use the kypolitics **publishable key**, not service_role
- Kypolitics' tables have RLS enabled — verify the public anon role has SELECT only on `jeffco_voter_targeting` and `precincts`

---

## What this unblocks

- **Tour Step 3 (Your District)** — the applied-education layer with real precinct-level numbers
- **LD Chair dashboard** — "your LD has N Hold-the-Line precincts" populated from real data
- **Highest-leverage rules engine** — the rules in `docs/highest-leverage-rules.md` can evaluate against live data
- **Priority MC cross-reference** — e.g. "LD32 overlaps MC17 and has 4 Hold-the-Line precincts there"

---

## Open questions for Lisa before we implement

1. **Publishable key availability.** Does the kypolitics project's publishable key have SELECT access on `jeffco_voter_targeting` with its current RLS policies? If not, we need to either add a policy or use a limited service role.
2. **Rate limiting.** Expected daily page views on LD pages is low (50+ LDPEC members × a few views/week). Should be well within Supabase free-tier request limits on kypolitics — but worth a sanity check before we ship.
3. **Strategy map URL parameter.** Does the 2026 Strategy Map (`26ldp-strategy-map.vercel.app`) accept a `?precinct=` deep-link parameter? I'll need to check or add one to make precinct tiles in the portal jump to the matching pin on the map.
4. **Turnout / d-margin freshness.** Is `jeffco_voter_targeting` updated from new VoteBuilder exports periodically, or is it a one-time import? If periodic, the portal will show the latest cut automatically. If one-time, the "2024" labeling in v2.0 copy should not age.

---

## If we later need Option B instead (nightly ETL)

If Option C turns out to be too slow or too coupled, the migration is straightforward:
1. Populate the portal's local `precincts` table via a one-time sync from kypolitics.
2. Schedule nightly refreshes via a Supabase scheduled Edge Function.
3. Swap `kypolitics` client calls for local portal queries — a code change, no schema change.

No other option requires a lock-in.
