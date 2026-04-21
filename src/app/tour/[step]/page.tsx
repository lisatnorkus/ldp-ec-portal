import { notFound } from "next/navigation";
import { getStep } from "@/lib/tour/steps";
import { TourShell } from "@/components/tour/TourShell";

export default async function TourStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepParam } = await params;
  const stepNum = Number(stepParam);
  const step = getStep(stepNum);
  if (!step) notFound();

  return (
    <TourShell step={step}>
      <StepBody stepNum={step.num} />
    </TourShell>
  );
}

function StepBody({ stepNum }: { stepNum: number }) {
  switch (stepNum) {
    case 1:
      return (
        <>
          <p>
            Before 2003, Jefferson County and the City of Louisville had separate governments, and the
            local Democratic Party was the <strong>Jefferson County Democratic Party (JCDP)</strong>.
            In 2003 the two governments merged into Louisville Metro, and the party&apos;s formal name
            became the <strong>Louisville-Jefferson County Democratic Party (LJCDP)</strong> to
            reflect the merged jurisdiction. Today the party is commonly known as the{" "}
            <strong>Louisville Democratic Party (LDP)</strong> — that&apos;s the public-facing brand,
            and it&apos;s the name we use here.
          </p>
          <p>
            You will see all three names — JCDP, LJCDP, LDP — in older documents and in the bylaws.{" "}
            <strong>They all mean the same party.</strong> Bylaws citations keep the formal name;
            day-to-day copy uses LDP.
          </p>
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm italic text-white/70">
            Full Step 1 content — &ldquo;Five things every EC owes its county,&rdquo; the $120 Club math,
            the DNC → KDP → LDP → 629 Precincts framing, the &ldquo;what this portal is and isn&apos;t&rdquo;
            two-paragraph — lands in the next commit. Today this step shows the history paragraph only.
          </p>
        </>
      );
    case 2:
      return <Placeholder title="Your Role" note="Role one-pagers render here, tailored to your primary_role. Source: docs/role_one_pagers_v2.2.md." />;
    case 3:
      return <Placeholder title="Your District" note="Three-layer applied-education view — primer, precincts, races, highest-leverage move this week — lands once Supabase is seeded with LD data." />;
    case 4:
      return <Placeholder title="How We Meet" note="Cadence, Zoom, proxy, Robert's Rules, voting, quarterly LD reports, bylaws link." />;
    case 5:
      return <Placeholder title="Current Work & Plug-In Points" note="Current month, primary canvass progress, priority MC districts, volunteer pipeline, next signature event, open slots." />;
    case 6:
      return <Placeholder title="The 2028 Cycle & Reorg" note="Timeline, reorg flow, DNC/SCEC track distinction, role-specific 2028 responsibility. Source: docs/reorg-delegate-selection.md." />;
    default:
      return null;
  }
}

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
        Placeholder
      </div>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{note}</p>
    </div>
  );
}

export async function generateStaticParams() {
  return [1, 2, 3, 4, 5, 6].map((n) => ({ step: String(n) }));
}
