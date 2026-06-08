// LLM-based annotation pass. Takes parsed minutes + the parser's raw
// motion captures and returns a structured MeetingAnnotations object
// matching the schema in src/lib/db/meeting-records-shared.ts.
//
// Why LLM here:
//   - Decisions and action items aren't tagged in Brook's minutes.
//     Heuristics miss nuance; quality matters since this becomes the
//     official record.
//   - Motion attribution is mixed-case (ROZ WELCH / Roz Welch / Roz);
//     LLM normalizes to canonical first+last + resolves first-name-only
//     mentions to the right person using attendance as context.
//
// Cost: one Anthropic call per meeting (~5-10K input tokens), ~$0.05
// each. Twelve months of LDPEC plenary = $0.60 total for the backfill.
//
// Requires ANTHROPIC_API_KEY in the environment.

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You extract structured annotations from LDPEC (Louisville Democratic Party Executive Committee) meeting minutes.

The user message will contain:
  - The full meeting minutes text
  - The parser's raw motion captures (names captured verbatim from the doc)
  - The full roster of names mentioned in the attendance section

Your job: return a JSON object matching this shape exactly:

{
  "motions": [
    {
      "text": "Plain English summary of what was moved (e.g. 'Approve $2,010 budget for new front-door keypad lock')",
      "section": "Source section key (e.g. 'facilities', 'chair_report', 'new_business')",
      "motion_by_name": "First Last (canonicalized)",
      "seconded_by_name": "First Last (canonicalized) or null",
      "passed": true | false | null
    }
  ],
  "decisions": [
    {
      "text": "Plain English summary of the decision that was made (only for motions that PASSED + explicit approvals)",
      "section": "Source section key",
      "related_motion_index": 0  // index into motions[] above, if applicable
    }
  ],
  "action_items": [
    {
      "text": "Plain English action with verb + who (e.g. 'Carolyn to post a SignUp Genius for renovation volunteer slots')",
      "section": "Source section key (e.g. 'facilities', 'volunteers')",
      "owner_name": "First Last (canonicalized) or null if not specified",
      "due_date": "YYYY-MM-DD if extractable, else null"
    }
  ],
  "attendance": {
    "present": ["First Last", ...],
    "proxy": ["First Last", ...],
    "absent": ["First Last", ...]
  }
}

Rules:
  - Canonicalize names: ALLCAPS → Title Case. First-name-only → match against the roster provided to recover the last name. If unresolvable, keep the first name only.
  - Do NOT invent action items. Only include items that are EXPLICITLY future-oriented commitments in the minutes (e.g. "Carolyn putting a Sign-up Genius out", "Phone banking opportunities will be sent"). Skip past-tense reporting ("Beth made an app").
  - Decisions are ONLY motions that passed + explicit approval lines like "VOTING ON: ... Motion passed".
  - Attendance: normalize names to "First Last" (Title Case). Use the roster context to fix typos (e.g. "Heathen Ryan Sexton" → "Heather Ryan Sexton", "Idiris Ali" → "Idris Ali").
  - Output ONLY the JSON object, no surrounding prose, no markdown fence.`;

// Build the user message from parsed minutes.
function buildUserMessage(parsed) {
  const rosterFromAttendance = [
    ...(parsed.attendance?.present ?? []),
    ...(parsed.attendance?.proxy ?? []),
    ...(parsed.attendance?.absent ?? []),
  ];
  return `Meeting date: ${parsed.meeting_date}
Meeting type: ${parsed.meeting_type}

==== ROSTER (from attendance) ====
${rosterFromAttendance.join(", ") || "(no attendance parsed)"}

==== PARSER RAW MOTIONS ====
${JSON.stringify(parsed.raw_motions, null, 2)}

==== FULL MINUTES TEXT ====
${parsed.full_text}`;
}

export async function annotateMinutes(parsed, { apiKey = process.env.ANTHROPIC_API_KEY } = {}) {
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY not set. Export it before running the ingest, or pass apiKey to annotateMinutes()."
    );
  }
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(parsed) }],
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("LLM returned no text block");
  }
  const raw = block.text.trim();
  // Strip ```json fences if the model added them despite instructions.
  const stripped = raw
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  let parsedJson;
  try {
    parsedJson = JSON.parse(stripped);
  } catch (err) {
    throw new Error(
      `LLM did not return valid JSON for ${parsed.meeting_date}. First 400 chars:\n${stripped.slice(0, 400)}\n---\nError: ${err.message}`
    );
  }

  // Defensive normalization — ensure all fields exist even if the LLM
  // omitted them.
  return {
    motions: Array.isArray(parsedJson.motions) ? parsedJson.motions : [],
    decisions: Array.isArray(parsedJson.decisions) ? parsedJson.decisions : [],
    action_items: Array.isArray(parsedJson.action_items) ? parsedJson.action_items : [],
    attendance: parsedJson.attendance ?? {
      present: [],
      proxy: [],
      absent: [],
    },
  };
}
