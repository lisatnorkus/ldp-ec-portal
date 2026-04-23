import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { BroadcastComposer } from "@/components/amplify/BroadcastComposer";

export const metadata = { title: "New Amplify Broadcast" };

export default function NewBroadcastPage() {
  return (
    <HubShell
      eyebrow="Amplify · New broadcast"
      title="Write it once, the board shares it everywhere."
      subtitle="Left side: your message. Right side: what the board sees. Publish when you're happy."
      maxWidthClass="max-w-6xl"
    >
      <div className="mb-5">
        <Link
          href="/amplify"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to Amplify
        </Link>
      </div>
      <BroadcastComposer />
    </HubShell>
  );
}
