// Comprehensive v1 data extraction — candidates, transitions, events, priority
// MC races, signature event details, month-by-month playbook, content cards.
// Run after extract-v1-data.mjs and backfill-v1-detail.mjs.
//
// Usage: node scripts/extract-v1-remaining.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const HTML_PATH = resolve(repoRoot, "docs/source-data/v1-snapshot.html");
const OUT_SQL = resolve(repoRoot, "supabase/seed_v1_remaining.sql");

const html = readFileSync(HTML_PATH, "utf8");

// ─── Extract JS constant blocks ──────────────────────────────────────────
function extractBlock(src, name) {
  const re = new RegExp(`const ${name}(?=\\s|=)`);
  const match = re.exec(src);
  if (!match) throw new Error(`${name} not found`);
  const startIdx = match.index;
  let i = src.indexOf("=", startIdx) + 1;
  let depth = 0, inStr = null, escape = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") depth--;
    else if (ch === ";" && depth === 0) break;
    else if (ch === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
  }
  return src.slice(startIdx, i + 1);
}

const NAMES = ["STATE_HOUSE", "STATE_SENATE", "METRO_COUNCIL"];
const blocks = NAMES.map((n) => extractBlock(html, n)).join("\n\n");
const moduleBody = blocks + "\n\nexport { " + NAMES.join(", ") + " };\n";
const tmpFile = resolve(tmpdir(), `v1-remaining-${randomBytes(6).toString("hex")}.mjs`);
writeFileSync(tmpFile, moduleBody);
const { STATE_HOUSE, STATE_SENATE, METRO_COUNCIL } = await import(pathToFileURL(tmpFile).href);

// ─── SQL helpers ─────────────────────────────────────────────────────────
const sqlStr = (s) => s === null || s === undefined ? "NULL" : `'${String(s).replace(/'/g, "''")}'`;
const sqlStrN = (s) => s === null || s === undefined || s === "" ? "NULL" : sqlStr(s);

const sql = [];
sql.push("-- v1 remaining data: candidates, transitions, events, MC priorities, content, month cards");
sql.push("-- Generated " + new Date().toISOString());
sql.push("");
sql.push("BEGIN;");
sql.push("");

// ─── Candidates ──────────────────────────────────────────────────────────
sql.push("-- Clear existing (idempotent re-run)");
sql.push("DELETE FROM candidates WHERE cycle_year = 2026;");
sql.push("");

function buildCandidates(office, data) {
  sql.push(`-- ${office}`);
  for (const [district, info] of Object.entries(data)) {
    const districtNum = Number(district);
    const dems = info.dems ?? [];
    const incumbent = info.inc;
    const incumbentParty = info.party ?? "D";
    const onBallot = info.onBallot !== false;

    // Insert the incumbent if they're not already a D candidate in the list
    const demsNames = new Set(dems.map((d) => d.name));
    if (incumbent && !demsNames.has(incumbent)) {
      sql.push(
        `INSERT INTO candidates (office_type, district_number, cycle_year, full_name, party, is_incumbent, is_endorsed, on_primary_ballot, on_general_ballot, notes) VALUES ('${office}', ${districtNum}, 2026, ${sqlStr(incumbent)}, '${incumbentParty}', true, false, false, true, ${sqlStrN(info.note)});`
      );
    }

    // Insert all D candidates
    for (const d of dems) {
      const isIncumbent = d.name === incumbent;
      sql.push(
        `INSERT INTO candidates (office_type, district_number, cycle_year, full_name, party, is_incumbent, is_endorsed, on_primary_ballot, on_general_ballot, notes) VALUES ('${office}', ${districtNum}, 2026, ${sqlStr(d.name)}, 'D', ${isIncumbent}, ${d.endorsed === true}, ${onBallot}, true, ${sqlStrN(d.note)});`
      );
    }
  }
  sql.push("");
}

buildCandidates("STATE_HOUSE", STATE_HOUSE);
buildCandidates("STATE_SENATE", STATE_SENATE);
buildCandidates("METRO_COUNCIL", METRO_COUNCIL);

// ─── Transitions (hardcoded from v1 HTML table) ──────────────────────────
sql.push("-- Transitions since June 2025 reorg");
sql.push("DELETE FROM transitions;");

const TRANSITIONS = [
  { seat: "LD33_VC", prev: "Charlie Todd", reason: "Moved out of district", departed: "2025-09-01", successor: "Larry Owens", status: "FILLED", elected: "2025-10-01" },
  { seat: "LD43_VC", prev: "Kristian Edwards", reason: null, departed: "2025-10-01", successor: "Gerald Joiner", status: "FILLED", elected: "2025-11-01" },
  { seat: "LD44_CHAIR", prev: "Shreeta Waldon", reason: null, departed: "2025-10-08", successor: "Beverly Chester Burton", status: "FILLED", elected: null },
  { seat: "LD48_CHAIR", prev: "Clifton Griffin", reason: null, departed: "2025-11-01", successor: null, status: "VACANT", elected: null },
  { seat: "LD42_VC", prev: "DeWana Hadder", reason: null, departed: "2025-12-01", successor: null, status: "VACANT", elected: null },
  { seat: "WOMENS_CLUB_PRES", prev: "Laura Lydon", reason: null, departed: "2025-11-01", successor: "Jessica Haggy", status: "FILLED", elected: "2025-11-01" },
  { seat: "LYD_PRES", prev: "Deric Senecal", reason: null, departed: "2025-12-01", successor: "Hallie Rice", status: "FILLED", elected: null },
  { seat: "VOLUNTEER_CMTE_CO_CHAIR", prev: "Teresa Macobin", reason: null, departed: "2026-04-01", successor: "Jessica Haggy", status: "FILLED", elected: null },
];
for (const t of TRANSITIONS) {
  const successorIdLookup = t.successor
    ? `(SELECT id FROM ec_members WHERE (first_name || ' ' || last_name) = ${sqlStr(t.successor)} LIMIT 1)`
    : "NULL";
  sql.push(
    `INSERT INTO transitions (seat_code, previous_holder_name, departure_reason, departed_date, successor_name, successor_id, status, elected_date) VALUES (${sqlStr(t.seat)}, ${sqlStr(t.prev)}, ${sqlStrN(t.reason)}, ${t.departed ? sqlStr(t.departed) : "NULL"}, ${sqlStrN(t.successor)}, ${successorIdLookup}, '${t.status}', ${t.elected ? sqlStr(t.elected) : "NULL"});`
  );
}
sql.push("");

// ─── Events ───────────────────────────────────────────────────────────────
sql.push("-- Signature Events");
sql.push("DELETE FROM events;");

const EVENTS = [
  {
    type: "CELEBRATION_OF_DEMOCRACY",
    name: "Celebration of Democracy Dinner",
    date: "2027-03-27",
    window: "Spring gala · Last Saturday in March",
    drive: "https://drive.google.com/drive/folders/17KbK3cR3NVLep_o5PbY8t_bKm43ki7dM",
    tickets: null,
  },
  {
    type: "WOMEN_DELIVER_DEMOCRACY",
    name: "Women Deliver Democracy",
    date: null,
    window: "Late summer · August 2026",
    drive: "https://drive.google.com/drive/folders/1TPT-_obSRP2STS5NteFEGFyrrmss4ueT",
    tickets: null,
  },
  {
    type: "DEMS_AT_THE_DOWNS",
    name: "Dems at the Downs",
    date: null,
    window: "Post-election · Early November 2026",
    drive: "https://drive.google.com/drive/folders/1lcYEyzGc0IHzLb51-oawE1-pNSXKwoNj",
    tickets: null,
  },
];
for (const e of EVENTS) {
  sql.push(
    `INSERT INTO events (type, name, event_date, event_window_description, drive_folder_url, tickets_url) VALUES ('${e.type}', ${sqlStr(e.name)}, ${e.date ? sqlStr(e.date) : "NULL"}, ${sqlStr(e.window)}, ${sqlStr(e.drive)}, ${sqlStrN(e.tickets)});`
  );
}
sql.push("");

// ─── Metro Races Priority ────────────────────────────────────────────────
sql.push("-- Priority Metro Council districts");
sql.push("DELETE FROM metro_races_priority;");

const MC_PRIORITY = [
  { mc: 17, tier: "HIGHEST", voters: 22782, sleeper: 3934, ind: 1930, summary: "**MC 17 · Winkler.** 22,782 voters · 6 DEFEND precincts · 3,934 sleeper Dems · 1,930 Independents. 3,934 sleeper Dems are the margin. This is the seat where one summer of disciplined work flips the council." },
  { mc: 7, tier: "HIGH", voters: null, sleeper: null, ind: null, summary: "**MC 7 · McCraney.** Power Base district — the job is keeping reliable Dems voting and pulling the chase list to the polls." },
  { mc: 21, tier: "HIGH", voters: 23367, sleeper: 4081, ind: 1978, summary: "**MC 21 · Ruhe.** 23,367 voters · 18 of 25 ACTIVATE precincts · 4,081 sleeper Dems · 1,978 Independents. Wake the Vote district — biggest pool of sleeper Dems in any single MC. Owned by the November cycle." },
];
for (const r of MC_PRIORITY) {
  sql.push(
    `INSERT INTO metro_races_priority (mc_number, tier, voter_count, sleeper_dems, independents, strategy_summary_md) VALUES (${r.mc}, '${r.tier}', ${r.voters ?? "NULL"}, ${r.sleeper ?? "NULL"}, ${r.ind ?? "NULL"}, ${sqlStr(r.summary)});`
  );
}
sql.push("");

// ─── Content Cards (Tour Step 1 orientation content) ────────────────────
sql.push("-- Content cards for Tour Step 1 orientation");
sql.push("DELETE FROM content_cards WHERE section IN ('tour_step_1', 'tour_step_5', 'commitments');");

const CONTENT = [
  {
    slug: "how-we-fit",
    title: "How we fit",
    section: "tour_step_1",
    body: "The Democratic National Committee sets national strategy and funds key priorities. The Kentucky Democratic Party runs statewide elections and provides the playbooks, tools, and legal infrastructure counties operate within. The Louisville Democratic Party is the county-level Executive Committee — we're the ones who actually organize the 629 precincts in Jefferson County, recruit and endorse local candidates, and deliver turnout in the only place where Kentucky Democrats consistently win.",
    order: 10,
  },
  {
    slug: "five-things-ec-owes",
    title: "Five things every Executive Committee owes its county",
    section: "tour_step_1",
    body: "1. **Organize precincts.** Keep Precinct Captains filled and active across all 629 precincts.\n2. **Recruit and endorse candidates.** Every winnable seat needs a credible Democrat on the ballot.\n3. **Run voter contact.** Canvass, phonebank, and GOTV at scale — both in primaries and November.\n4. **Fundraise locally.** KDP and the DNC together cover less than a fifth of party operating costs. The rest is raised in-county.\n5. **Train the next generation.** LD Chairs, Precinct Captains, canvassers, and candidates all need onboarding — not assumed competence.",
    order: 20,
  },
  {
    slug: "120-club",
    title: "The $120 Club",
    section: "commitments",
    body: "Every Executive Committee member is expected to join the $120 Club: a minimum personal give of $10 a month plus $500 raised for the party each year. This is the operational baseline — the floor, not the ceiling. Signature events and everything else the party does run on every board member pulling their weight here.\n\n**The math:** $120/year personal + $500/year raise = **$620 per board member floor**. With 55+ voting members, that's north of $34,000/year just from the floor — and it's the baseline before any signature event revenue.",
    order: 10,
  },
  {
    slug: "what-this-portal-is",
    title: "What this portal is and isn't",
    section: "tour_step_1",
    body: "**This portal is:** the internal playbook for LDPEC members. A companion to Google Drive (where working docs live) and louisvilledems.com (where the party talks to voters). Source of truth for roster, monthly work, and what's live this cycle.\n\n**This portal is not:** the public-facing website. That's louisvilledems.com — different audience, different management, owned by the Communications Committee. If you need something published to voters, route through Comms.",
    order: 30,
  },
  {
    slug: "volunteer-pipeline",
    title: "Volunteer pipeline",
    section: "tour_step_5",
    body: "The Volunteer Committee is the LDP's countywide deployment system. Jessica Haggy intakes new volunteers, matches them to a committee or LD that fits, plugs them into the Facebook group and Mobilize, and routes them to the priority districts where countywide volunteer hours move the most votes — Metro Council 17 (Winkler), 21 (Ruhe), and 7 (McCraney). LD Chairs and Vice Chairs are the front door of this pipeline. If you don't pass a volunteer up, they vanish.\n\n1. **Volunteer signs up** (canvass, event, or website form)\n2. **Send to Jessica within 7 days** — forward contact + interest\n3. **Jessica onboards** — interest survey, LD introduction, Mobilize + FB group\n4. **Volunteer gets deployed** — most go to MC17/21/7; some stay in your LD if you have active canvasses.",
    order: 10,
  },
];
for (const c of CONTENT) {
  sql.push(
    `INSERT INTO content_cards (slug, title, section, body_md, display_order, published) VALUES (${sqlStr(c.slug)}, ${sqlStr(c.title)}, ${sqlStr(c.section)}, ${sqlStr(c.body)}, ${c.order}, true) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, section = EXCLUDED.section, body_md = EXCLUDED.body_md, display_order = EXCLUDED.display_order;`
  );
}
sql.push("");

// ─── Month cards (Rock Star Playbook) ────────────────────────────────────
sql.push("-- Month cards (Rock Star Playbook)");
sql.push("DELETE FROM month_cards WHERE year = 2026;");

const MONTHS = [
  { m: 1, theme: "OFF_CYCLE", body: "**January — Planning & refresh.** File your Q4 LD report (due this month). Build next year's LD calendar. Set personal $120 Club raise target. Platform Committee opens for revision." },
  { m: 2, theme: "PRIMARY_WINDOW", body: "**February — Primary prep.** Candidates file; Endorsement process activates. Training Committee runs new LD chair + canvass basics. Celebration of Democracy Dinner ticket push opens." },
  { m: 3, theme: "PRIMARY_WINDOW", body: "**March — Canvass kickoff + dinner.** Celebration of Democracy Dinner last Saturday of the month — sell tickets, host a table, bring guests. Canvass waves begin in priority MC overlap districts." },
  { m: 4, theme: "PRIMARY_WINDOW", body: "**April — Full canvass cadence.** Weekly canvass shifts in priority MC precincts. Volunteer pipeline in full motion. Endorsements finalize before May." },
  { m: 5, theme: "PRIMARY_WINDOW", body: "**May — Primary week + GOTV.** Primary is May 19. Final GOTV in contested districts. File your Q1 LD report. Debrief early in the month." },
  { m: 6, theme: "POST_PRIMARY", body: "**June — Regroup + committee joins.** Post-primary debrief at LDPEC. Recruit volunteers who showed up in May onto committees. Plan summer engagement." },
  { m: 7, theme: "SUMMER", body: "**July — Registration drives + PC recruiting.** Summer voter registration campaigns. Start recruiting PC candidates for 2028 Precinct Conventions. File Q2 LD report." },
  { m: 8, theme: "SUMMER", body: "**August — Women Deliver Democracy.** WDD this month — push tickets, bring guests, host a table. Continue canvass prep for general election ramp." },
  { m: 9, theme: "GENERAL", body: "**September — General canvass kickoff.** Full canvass cadence restarts. Hold the Line precincts get weekly attention. Volunteer pipeline refills for November." },
  { m: 10, theme: "GENERAL", body: "**October — Peak GOTV prep.** Daily canvass shifts in priority districts. Early voting starts late-month — drive turnout. File Q3 LD report." },
  { m: 11, theme: "ELECTION_WEEK", body: "**November — Election week + Dems at the Downs.** General election November 3. Final GOTV. Dems at the Downs post-election — celebrate, close out the cycle, thank everyone who showed up." },
  { m: 12, theme: "POST_GENERAL", body: "**December — Annual wrap.** Annual LD data review with the LDP Chair. Volunteer appreciation outreach. File Q4 LD report. Set goals for next year. Optional: holiday community engagement." },
];
for (const m of MONTHS) {
  sql.push(
    `INSERT INTO month_cards (month, year, content_md, theme_tag, published) VALUES (${m.m}, 2026, ${sqlStr(m.body)}, ${sqlStr(m.theme)}, true);`
  );
}
sql.push("");

// ─── Settings — social media URLs + event ticket links ──────────────────
sql.push("-- Additional settings");
const SOCIAL_SETTINGS = [
  { key: "social_facebook", value: "https://www.facebook.com/louisvilledems", desc: "Facebook page" },
  { key: "social_instagram", value: "https://www.instagram.com/louisvilledems/", desc: "Instagram" },
  { key: "social_twitter", value: "https://x.com/louisvilledems", desc: "Twitter / X" },
  { key: "social_bluesky", value: "https://bsky.app/profile/louisvilledems.com", desc: "Bluesky" },
  { key: "social_threads", value: "https://www.threads.net/@louisvilledems", desc: "Threads" },
  { key: "social_tiktok", value: "https://www.tiktok.com/@louisvilledems", desc: "TikTok" },
  { key: "event_intake_url", value: "https://loukydemparty.fillout.com/eventrequest", desc: "One-stop event/comms/asset request form (Beth's intake)" },
  { key: "volunteer_signup_url", value: "https://act.campaigndeputy.com/LDPVounteerSignup", desc: "Public volunteer intake form" },
  { key: "proxy_form_url", value: "https://forms.gle/dac7EBMbZXMMdMs59", desc: "CEC meeting proxy form" },
  { key: "public_calendar_url", value: "https://www.louisvilledems.com/calendar", desc: "Public party calendar" },
];
for (const s of SOCIAL_SETTINGS) {
  sql.push(
    `INSERT INTO settings (key, value, description) VALUES (${sqlStr(s.key)}, ${sqlStr(s.value)}, ${sqlStr(s.desc)}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;`
  );
}
sql.push("");

sql.push("COMMIT;");

writeFileSync(OUT_SQL, sql.join("\n"));
console.log(`Wrote ${OUT_SQL}`);
console.log(`  ${Object.keys(STATE_HOUSE).length} HD, ${Object.keys(STATE_SENATE).length} SD, ${Object.keys(METRO_COUNCIL).length} MC races`);
console.log(`  ${TRANSITIONS.length} transitions, ${EVENTS.length} events, ${MC_PRIORITY.length} priority MCs`);
console.log(`  ${CONTENT.length} content cards, ${MONTHS.length} month cards, ${SOCIAL_SETTINGS.length} settings`);
