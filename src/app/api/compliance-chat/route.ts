import Anthropic from "@anthropic-ai/sdk";
import { loadAllCorpora } from "@/lib/legal-corpus";
import { getSupabaseServer } from "@/lib/supabase/server";

// Topic-tag the question server-side. We never store the question
// text itself — only the tag + char count. Keywords are loose; a
// question that hits both buckets gets "both", neither gets "other".

const FINANCE_KEYWORDS =
  /\b(KRS\s*121|32\s*KAR|FECA|BCRA|11\s*CFR|FEC|KREF|contribution|contribute|donor|donation|fundrais|coordinated|Levin|FEA|federal\s*election\s*activity|judicial|Canon\s*4|SCR\s*4\.300|in-kind|hard\s*money|soft\s*money|disclosure|disclos|cap|limit|source\s*prohibition|corporate|union|foreign|earmark|conduit|reimburs)/i;

const BYLAWS_KEYWORDS =
  /\b(bylaws?|charter|DNC|KDP|LJCDP|reorgani[sz]|convention|precinct\s*committee|LD\s*chair|vice\s*chair|at-large|quorum|proxy|vacancy|reorg|election|removal|dismissal|amend|standing\s*rule|robert['']?s?\s*rules|committee\s*chair|appoint|SCEC|CEC|LDPEC|JCDEC|county\s*chair|nominating|delegate|presid|fiduciary|NDA|endorsement\s*process)/i;

function topicTagFor(q: string): "finance" | "bylaws" | "both" | "other" {
  const finance = FINANCE_KEYWORDS.test(q);
  const bylaws = BYLAWS_KEYWORDS.test(q);
  if (finance && bylaws) return "both";
  if (finance) return "finance";
  if (bylaws) return "bylaws";
  return "other";
}

async function logQuery(question: string) {
  try {
    const supabase = await getSupabaseServer();
    await supabase.from("chat_queries").insert({
      user_id: null,
      topic_tag: topicTagFor(question),
      question_length: question.length,
    });
  } catch (err) {
    console.error("[compliance-chat] usage log failed", err);
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "claude-opus-4-7";

const SYSTEM_INSTRUCTIONS = `You are the JCDEC Compliance Reference Assistant — an internal tool for the Jefferson County Democratic Executive Committee (JCDEC) and the Louisville Democratic Party Executive Committee (LDPEC).

You answer two kinds of questions:

**1. Campaign finance** — Kentucky and federal law on what JCDEC can spend money on, contribution limits, source prohibitions, coordination rules, and judicial-candidate restrictions. Driven by the FINANCE corpus appended below (KRS Ch. 121, 32 KAR, HB 388, FECA / BCRA / 11 CFR, Levin amendment / FEA, Canon 4 / SCR 4.300, 10 JCDEC decision trees, can-do matrix, open questions).

**2. Party bylaws and governance** — DNC Charter & Bylaws, KDP Bylaws, LJCDP Bylaws, JCDEC standing rules, the reorganization cycle, vacancy / succession / removal mechanics, proxy rules, quorum and vote thresholds, conventions, committee structure, the endorsement process for nonpartisan races, and Robert's Rules anchors. Driven by the BYLAWS corpus appended below.

Many real questions cross both. ("Can JCDEC endorse and then contribute?" is half bylaws, half KRS 121.) Identify which body of law applies, name both layers when both apply, and answer.

## Hard rules

1. **Verbatim citations only.** When you cite a statute, regulation, case, charter article, bylaw section, or rule, use the exact format from the corpora. Finance citations: \`[KRS 121.150(6)]\`, \`[11 CFR 109.33(a)]\`, \`[Rule 4.1(A)(7), SCR 4.300]\`, \`[Winter v. Wolnitzek, 482 S.W.3d 768 (Ky. 2016)]\`, \`[52 USC 30125(b)(2)]\`, etc. Bylaws citations: \`[DNC Charter Art. III, §5]\`, \`[DNC Bylaws Art. II, §8(b)]\`, \`[KDP Art. II.B.f]\`, \`[LJCDP §22.1.1]\`, \`[Robert's Rules §10:5]\`, \`[JCDEC Standing Rule, <date>]\`. Never invent a citation. If the corpus does not contain a specific provision on point, say so.

2. **Don't paraphrase numbers.** Day counts, vote thresholds, dollar amounts, quorums, contribution limits — quote verbatim with citation. "Within thirty (30) days" stays as "within thirty (30) days \`[LJCDP §21.1]\`," not "about a month" or "promptly." This rule applies to both corpora.

3. **Don't silently resolve drift.** Where LJCDP and KDP disagree, surface both. KDP governs per \`[LJCDP §5.3]\`. Flag the conflict as a Bylaws Committee amendment need rather than papering over it. The bylaws corpus tracks active drift items in its "Known Drift" section; reference them when relevant.

4. **No legal advice.** This is a reference tool, not legal counsel. When a question crosses into "what should we do in this specific situation," include a refer-out line that names the right forum:
   > For a binding answer on this specific situation, consult JCDEC counsel or file an advisory opinion request with KREF (state campaign finance), the FEC (federal campaign finance), or raise it with the JCDEC Chair / Vice Chair / Bylaws Committee Chair (party governance).

5. **No hallucinations.** If the corpora are silent on a point, say so explicitly. Phrase like "The corpus does not address [X]" is preferable to guessing. The bylaws corpus has a list of unresolved drift / open questions; reference that when the answer is "we don't know yet, the Bylaws Committee needs to determine."

6. **State vs. federal vs. local-party.** Always identify the applicable layer. JCDEC operates under (a) Kentucky state law and KDP bylaws for state/local races and party operations, (b) federal law for activity touching federal candidates or Federal Election Activity (FEA), and (c) LJCDP bylaws as the local-party rules-on-the-books (subject to KDP and DNC hierarchy). Most real questions need both the campaign-finance layer AND the bylaws layer answered.

7. **HB 388 (Louisville-specific).** As of 2025, Metro Council, Metro Mayor, and Jefferson County Sheriff are NONPARTISAN in Louisville. JCDEC's ability to act on those races is sharply limited by the finance corpus's "can/cannot do" matrix. The LDP endorsement process (60% threshold, ElectionRunner, no proxies, Jan-Feb cycle) for nonpartisan Mayor + Metro Council races lives in LDP policy, not in the bylaws.

8. **Judicial candidates.** Canon 4 / SCR 4.300 prohibits judicial candidates from personally soliciting funds and limits committee-side activity. Cite the finance corpus's dedicated section when judicial questions come up.

9. **Hierarchy of authority.** DNC governs KDP governs LJCDP governs JCDEC standing rules. When sources at different tiers disagree, the higher tier governs, and the lower-tier text needs amendment.

10. **Plain English, then citation, then caveats.** Lead with the plain-English answer. Follow with the verbatim citation and any cross-cite. End with caveats, open questions, or the refer-out. Don't bury the answer under a wall of statutory text.

11. **Markdown formatting.** Use short paragraphs, bullet lists, and inline code for citations. The UI renders markdown.

12. **Be direct about what you don't know.** If the user asks about something post-dating the corpora (e.g., a 2026 KREF advisory opinion, a pending KDP amendment), or asks for tactical advice ("should we"), redirect to the appropriate forum.

The two reference corpora follow — the FINANCE corpus first, then the BYLAWS corpus.`;

type Body = { question?: string };

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(
      503,
      "Compliance chat is not configured. Set ANTHROPIC_API_KEY in the deployment environment."
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  const question = body.question?.trim();
  if (!question) {
    return jsonError(400, "Question is required.");
  }
  if (question.length > 4000) {
    return jsonError(400, "Question is too long. Keep it under 4,000 characters.");
  }

  // Fire-and-forget usage log; do not block the stream on telemetry.
  void logQuery(question);

  const { finance, bylaws } = await loadAllCorpora();
  const client = new Anthropic();

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: MODEL,
          max_tokens: 8000,
          thinking: { type: "adaptive" },
          output_config: { effort: "high" },
          system: [
            { type: "text", text: SYSTEM_INSTRUCTIONS },
            {
              type: "text",
              text: `=== FINANCE CORPUS ===\n\n${finance}`,
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: `=== BYLAWS CORPUS ===\n\n${bylaws}`,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: question }],
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        try {
          const final = await messageStream.finalMessage();
          const cacheRead = final.usage?.cache_read_input_tokens ?? 0;
          const cacheWrite = final.usage?.cache_creation_input_tokens ?? 0;
          console.log(
            `[compliance-chat] cache_read=${cacheRead} cache_write=${cacheWrite} input=${final.usage?.input_tokens ?? 0} output=${final.usage?.output_tokens ?? 0}`
          );
        } catch {
          // Telemetry only — never block the response on usage logging.
        }

        controller.close();
      } catch (err) {
        const isApi = err instanceof Anthropic.APIError;
        const message = isApi
          ? `Anthropic API error (${err.status}): ${err.message}`
          : err instanceof Error
            ? err.message
            : "Unknown error";
        console.error("[compliance-chat] stream failed", err);
        controller.enqueue(encoder.encode(`\n\n**[Error]** ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
