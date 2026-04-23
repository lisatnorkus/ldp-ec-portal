"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  VolunteerActivityType,
  VolunteerSource,
  VolunteerStatus,
} from "@/lib/db/volunteers-types";

type Author = { name: string; role: string | null; ld: number | null };

export type VolunteerInput = {
  first_name: string;
  last_name: string;
  preferred_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address_street?: string | null;
  address_city?: string | null;
  address_zip?: string | null;
  home_ld?: number | null;
  home_precinct?: string | null;
  status?: VolunteerStatus;
  source?: VolunteerSource;
  interest_tags?: string[];
  availability_windows?: string[];
  remote_ok?: boolean;
  recruited_by_name?: string | null;
  owner_name?: string | null;
  notes?: string | null;
};

function cleanString(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t ? t : null;
}

export async function createVolunteer(
  input: VolunteerInput,
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  if (!input.first_name.trim() || !input.last_name.trim())
    return { ok: false, error: "First and last name required." };

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteers")
    .insert({
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      preferred_name: cleanString(input.preferred_name),
      email: cleanString(input.email),
      phone: cleanString(input.phone),
      address_street: cleanString(input.address_street),
      address_city: cleanString(input.address_city),
      address_zip: cleanString(input.address_zip),
      home_ld: input.home_ld ?? null,
      home_precinct: cleanString(input.home_precinct),
      status: input.status ?? "ACTIVE",
      source: input.source ?? "OTHER",
      interest_tags: input.interest_tags ?? [],
      availability_windows: input.availability_windows ?? [],
      remote_ok: input.remote_ok ?? false,
      recruited_by_name: cleanString(input.recruited_by_name),
      owner_name: cleanString(input.owner_name),
      notes: cleanString(input.notes),
      author_name: author.name.trim(),
      author_role: author.role,
      author_ld: author.ld,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/volunteers");
  return { ok: true, id: data.id as string };
}

// Anonymous signup submission from the public form. No author identity
// required (signer isn't logged in), but we still stamp source so
// Jessica's review queue knows to verify.
export async function submitVolunteerSignup(
  input: VolunteerInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!input.first_name.trim() || !input.last_name.trim())
    return { ok: false, error: "First and last name required." };
  // Very light email-or-phone requirement so Jessica has a way to contact
  if (!cleanString(input.email) && !cleanString(input.phone))
    return { ok: false, error: "Give us an email or a phone — otherwise we can't reach you." };

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteers")
    .insert({
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      preferred_name: cleanString(input.preferred_name),
      email: cleanString(input.email),
      phone: cleanString(input.phone),
      address_street: cleanString(input.address_street),
      address_city: cleanString(input.address_city),
      address_zip: cleanString(input.address_zip),
      home_ld: input.home_ld ?? null,
      home_precinct: cleanString(input.home_precinct),
      status: "ACTIVE",
      source: "SIGNUP_FORM",
      interest_tags: input.interest_tags ?? [],
      availability_windows: input.availability_windows ?? [],
      remote_ok: input.remote_ok ?? false,
      notes: cleanString(input.notes),
      author_name: "[self-signup]",
      author_role: null,
      author_ld: null,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/volunteers");
  return { ok: true, id: data.id as string };
}

export async function updateVolunteer(
  id: string,
  patch: Partial<VolunteerInput>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const trimmed: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    if (typeof v === "string") trimmed[k] = v.trim() ? v.trim() : null;
    else trimmed[k] = v;
  }
  const { error } = await supabase.from("volunteers").update(trimmed).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/volunteers");
  revalidatePath(`/volunteers/${id}`);
  return { ok: true };
}

export async function setVolunteerStatus(
  id: string,
  status: VolunteerStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("volunteers")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/volunteers");
  revalidatePath(`/volunteers/${id}`);
  return { ok: true };
}

export async function logActivity(
  volunteer_id: string,
  input: {
    activity_type: VolunteerActivityType;
    activity_date?: string; // YYYY-MM-DD
    title?: string | null;
    hours?: number | null;
    related_ld?: number | null;
    notes?: string | null;
  },
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteer_activities")
    .insert({
      volunteer_id,
      activity_type: input.activity_type,
      activity_date: input.activity_date ?? new Date().toISOString().slice(0, 10),
      title: cleanString(input.title),
      hours: input.hours ?? null,
      related_ld: input.related_ld ?? null,
      notes: cleanString(input.notes),
      author_name: author.name.trim(),
      author_role: author.role,
      author_ld: author.ld,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/volunteers");
  revalidatePath(`/volunteers/${volunteer_id}`);
  return { ok: true, id: data.id as string };
}

export async function deleteActivity(
  activity_id: string,
  volunteer_id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("volunteer_activities")
    .delete()
    .eq("id", activity_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/volunteers/${volunteer_id}`);
  return { ok: true };
}
