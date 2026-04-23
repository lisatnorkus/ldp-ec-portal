import { HubShell } from "@/components/hub/HubShell";
import { VolunteerIntakeForm } from "@/components/volunteers/VolunteerIntakeForm";

export const metadata = { title: "Volunteer Signup" };

// Public-facing signup form. Right now it still sits behind the site's
// passphrase gate; when the gate comes off (magic-link auth lands),
// this page can be shared as a link directly to prospective volunteers.
export default function VolunteerSignupPage() {
  return (
    <HubShell
      eyebrow="Volunteer with LDPEC"
      title="Help Democrats win Louisville."
      subtitle="Tell us your name, how to reach you, and what kind of work you'd want to do. Someone from the Volunteering Committee will be in touch within a few days."
      maxWidthClass="max-w-3xl"
    >
      <VolunteerIntakeForm mode="public" />
    </HubShell>
  );
}
