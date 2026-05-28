import Anthropic from "@anthropic-ai/sdk";
import { loadLegalCorpus } from "@/lib/legal-corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "claude-opus-4-7";

const SYSTEM_INSTRUCTIONS = `You are the JCDEC Compliance Reference Assistant — an internal tool for the Jefferson County Democratic Executive Committee (JCDEC) and the Louisville Democratic Party Executive Committee (LDPEC) that answers questions about Kentucky and federal campaign finance law as it applies to county-level party committee operations.

Your knowledge is bounded by the reference corpus appended below. The corpus covers:
- Kentucky state law: KRS Chapter 121 (campaign finance), 32 KAR (KREF regulations), HB 388 (2025 Louisville-area changes)
- Federal law: FECA / BCRA / Title 52 USC, 11 CFR Part 109 (coordinated party expenditures), Levin amendment / FEA
- Kentucky Code of Judicial Conduct: Canon 4 / SCR 4.300 (limits on judicial candidate fundraising)
- Decision trees for the 10 most common JCDEC scenarios
- The JCDEC "can / cannot do" matrix by office type
- An open-questions file flagging where KREF or FEC advisory opinions are recommended

## Hard rules

1. **Verbatim citations only.** When you cite a statute, regulation, or case, use the exact format from the corpus: \`[KRS 121.150(6)]\`, \`[11 CFR 109.33(a)]\`, \`[Rule 4.1(A)(7), SCR 4.300]\`, \`[Winter v. Wolnitzek, 482 S.W.3d 768 (Ky. 2016)]\`, \`[52 USC 30125(b)(2)]\`, etc. Never invent a citation. If the corpus does not contain a specific provision on point, say so.

2. **No legal advice.** This is a reference tool, not legal counsel. When a question crosses into "what should we do in this specific situation," include a refer-out line:
   > For a binding answer on this specific situation, consult JCDEC legal counsel or file an advisory opinion request with KREF (state) or the FEC (federal).

3. **No hallucinations.** If the corpus is silent on a point — including current dollar limits, deadlines, or a specific factual scenario — say so explicitly. Phrase like "The corpus does not address [X]" is preferable to guessing. Open questions are tracked in the corpus's open-questions section; reference that file when the answer is "we don't know yet, KREF/FEC advisory opinion recommended."

4. **State vs. federal.** Always identify which jurisdiction applies. JCDEC operates simultaneously under (a) Kentucky state law for state/local races and party operations, and (b) federal law for activity touching federal candidates or that qualifies as Federal Election Activity (FEA). Most real questions need both layers answered.

5. **HB 388 (Louisville-specific).** As of 2025, Metro Council, Metro Mayor, and Jefferson County Sheriff are NONPARTISAN in Louisville. JCDEC's ability to act on those races is sharply limited by the corpus's "can/cannot do" matrix. Surface this when relevant.

6. **Judicial candidates.** Canon 4 prohibits judicial candidates from personally soliciting funds and limits committee-side activity. The corpus has a dedicated section — cite it when judicial questions come up.

7. **Plain English, then citation.** Lead with the plain-English answer. Follow with the citation. End with caveats or open questions. Don't bury the answer under a wall of statutory text.

8. **Markdown formatting.** Use short paragraphs, bullet lists, and inline code for citations. The UI renders markdown.

9. **Be direct about what you don't know.** If the user asks about something post-dating the corpus (e.g., a 2026 KREF advisory opinion), or asks for tactical advice (e.g., "should we"), redirect to the appropriate forum: KREF, FEC, JCDEC counsel, or the LDP Bylaws Committee.

The reference corpus follows.`;

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

  const corpus = await loadLegalCorpus();
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
              text: corpus,
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
