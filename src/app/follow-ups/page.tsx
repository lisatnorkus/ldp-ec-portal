import { HubShell } from "@/components/hub/HubShell";
import { fetchAllContacts } from "@/lib/db/ld-contacts";
import { FollowUpQueue } from "@/components/follow-ups/FollowUpQueue";

export const dynamic = "force-dynamic";
export const metadata = { title: "Follow-Ups · Layering Queue" };

export default async function FollowUpsPage() {
  const contacts = await fetchAllContacts();

  return (
    <HubShell
      eyebrow="Follow-Ups · Layering Queue"
      title="Who needs a next touch."
      subtitle="Per the DNC Playbook: every contact triggers the next one. Track 10–20 working relationships per captain and review weekly. This page shows contacts in a working stage (Contacted → Active) who haven't heard from us recently."
      maxWidthClass="max-w-5xl"
    >
      <section className="mb-6 rounded-md border-l-4 border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-3 text-xs text-[var(--color-ldp-ink-900)]">
        <strong className="text-[var(--color-ldp-navy-900)]">
          Why this page exists:
        </strong>{" "}
        VAN / VoteBuilder is not built as a CRM. It doesn&apos;t surface who you contacted three
        weeks ago and haven&apos;t touched since. The DNC 2026 Playbook calls this out
        explicitly — until better tools exist, every captain maintains a manual working-relationships
        file of 10-20 people and reviews it weekly. This queue is that file for Jefferson County.
      </section>

      <FollowUpQueue contacts={contacts} />

      <section className="mt-8 rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          How to use this queue
        </h2>
        <ol className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            1. Set &ldquo;Mine only&rdquo; so you see the relationships you own (contacts you
            entered or that are assigned to you).
          </li>
          <li>
            2. Start with the 14-day window. That&apos;s the skill&apos;s default layering cadence.
          </li>
          <li>
            3. Pick one, send the text / make the call / schedule the meet, then click{" "}
            <strong>Log touch</strong> to open the recruiting page and record the interaction.
          </li>
          <li>
            4. If the relationship should wind down, move the stage to <em>Cold</em>,{" "}
            <em>Paused</em>, or <em>Not Interested</em> so it drops out of the queue.
          </li>
        </ol>
      </section>
    </HubShell>
  );
}
