import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { fetchContactsByLd, fetchInteractionsForContact } from "@/lib/db/ld-contacts";
import { PipelineTable } from "@/components/ld-workspace/PipelineTable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  return { title: `LD${number} · Recruiting` };
}

export default async function RecruitingPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number: numberParam } = await params;
  const ld_number = Number(numberParam);
  if (Number.isNaN(ld_number)) notFound();

  const contacts = await fetchContactsByLd(ld_number);

  // Pre-fetch interactions for every contact so the drawer is instant on
  // open. At typical pipeline sizes (dozens, not hundreds) this is cheap
  // enough to eagerly load.
  const interactionsByContact = new Map<string, Awaited<ReturnType<typeof fetchInteractionsForContact>>>();
  await Promise.all(
    contacts.map(async (c) => {
      interactionsByContact.set(c.id, await fetchInteractionsForContact(c.id));
    })
  );

  return (
    <HubShell
      eyebrow={`LD${ld_number} · Recruiting`}
      title="Prospect pipeline."
      subtitle={`${contacts.length} contact${contacts.length === 1 ? "" : "s"} · sorted oldest-contact first so nothing falls through the cracks.`}
      maxWidthClass="max-w-6xl"
    >
      <div className="mb-5">
        <Link
          href={`/my-ld/${ld_number}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to LD{ld_number}
        </Link>
      </div>

      <PipelineTable
        ldNumber={ld_number}
        contacts={contacts}
        interactionsByContact={Object.fromEntries(interactionsByContact)}
      />
    </HubShell>
  );
}
