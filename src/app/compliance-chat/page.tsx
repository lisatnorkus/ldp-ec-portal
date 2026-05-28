import { HubShell } from "@/components/hub/HubShell";
import { ChatInterface } from "@/components/compliance-chat/ChatInterface";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compliance Q&A" };

export default function ComplianceChatPage() {
  return (
    <HubShell
      eyebrow="Compliance Q&A"
      title="Finance + bylaws, citation-first."
      subtitle="Campaign finance (KRS 121, 32 KAR, HB 388, FECA/BCRA, 11 CFR, Canon 4) and party governance (DNC Charter, KDP, LJCDP, Robert's Rules). Ask a question, get verbatim citations from the JCDEC reference corpora."
      maxWidthClass="max-w-4xl"
      accent="#b45309"
    >
      <ChatInterface />
    </HubShell>
  );
}
