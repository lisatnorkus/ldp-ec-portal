import { HubShell } from "@/components/hub/HubShell";
import { ChatInterface } from "@/components/compliance-chat/ChatInterface";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compliance Q&A" };

export default function ComplianceChatPage() {
  return (
    <HubShell
      eyebrow="Compliance Q&A"
      title="Party-funding law, citation-first."
      subtitle="Kentucky (KRS 121, 32 KAR, HB 388) + federal (FECA/BCRA, 11 CFR) + judicial conduct (Canon 4). Ask a question, get an answer with verbatim citations from the JCDEC reference corpus."
      maxWidthClass="max-w-4xl"
      accent="#b45309"
    >
      <ChatInterface />
    </HubShell>
  );
}
