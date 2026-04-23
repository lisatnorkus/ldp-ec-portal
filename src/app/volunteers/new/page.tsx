import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { VolunteerIntakeForm } from "@/components/volunteers/VolunteerIntakeForm";

export const metadata = { title: "Add Volunteer" };

export default function NewVolunteerPage() {
  return (
    <HubShell
      eyebrow="Volunteers · New intake"
      title="Add a volunteer."
      subtitle="Use this when Jessica is entering someone from a signup sheet or a committee referral. If the volunteer signed up themselves via the public form, they're already in the roster — find them there."
      maxWidthClass="max-w-3xl"
    >
      <div className="mb-5">
        <Link
          href="/volunteers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to roster
        </Link>
      </div>
      <VolunteerIntakeForm mode="admin" />
    </HubShell>
  );
}
