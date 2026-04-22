import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { LdContact, LdInteraction } from "./ld-contacts-types";

// Re-export so existing server-side imports keep working. Client
// components should import from ld-contacts-types directly.
export type {
  LdContact,
  LdInteraction,
  PipelineStage,
  ContactSource,
  ContactMethod,
  InteractionOutcome,
} from "./ld-contacts-types";
export { STAGE_LABEL, STAGE_COLOR } from "./ld-contacts-types";

export async function fetchContactsByLd(ld_number: number): Promise<LdContact[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_contacts")
    .select("*")
    .eq("ld_number", ld_number)
    .order("last_contacted_at", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchContactsByLd error", error);
    return [];
  }
  return (data ?? []) as LdContact[];
}

export async function fetchInteractionsForContact(
  contact_id: string
): Promise<LdInteraction[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_interactions")
    .select("*")
    .eq("contact_id", contact_id)
    .order("contacted_at", { ascending: false });
  if (error) {
    console.error("fetchInteractionsForContact error", error);
    return [];
  }
  return (data ?? []) as LdInteraction[];
}

export function countStaleContacts(contacts: LdContact[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return contacts.filter((c) => {
    if (c.pipeline_stage === "NOT_INTERESTED" || c.pipeline_stage === "EC_MEMBER")
      return false;
    if (!c.last_contacted_at) return true;
    return new Date(c.last_contacted_at).getTime() < cutoff;
  }).length;
}
