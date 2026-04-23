import { notFound } from "next/navigation";
import { HubShell } from "@/components/hub/HubShell";
import { fetchVolunteerById, fetchVolunteerActivities } from "@/lib/db/volunteers";
import { VolunteerDetail } from "@/components/volunteers/VolunteerDetail";
import { volunteerDisplayName } from "@/lib/db/volunteers-types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const v = await fetchVolunteerById(id);
  return { title: v ? `${volunteerDisplayName(v)} · Volunteer` : "Volunteer not found" };
}

export default async function VolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [volunteer, activities] = await Promise.all([
    fetchVolunteerById(id),
    fetchVolunteerActivities(id),
  ]);
  if (!volunteer) notFound();

  return (
    <HubShell
      eyebrow="Volunteers"
      title={volunteerDisplayName(volunteer)}
      subtitle="Contact, interests, and activity log."
      maxWidthClass="max-w-6xl"
    >
      <VolunteerDetail volunteer={volunteer} activities={activities} />
    </HubShell>
  );
}
