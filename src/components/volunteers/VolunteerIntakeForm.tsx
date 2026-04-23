"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/userContext";
import {
  AVAILABILITY_LABEL,
  VOLUNTEER_INTERESTS,
  type AvailabilityWindow,
} from "@/lib/db/volunteers-types";
import { createVolunteer, submitVolunteerSignup } from "./volunteer-actions";

// One form component, two modes. Admin mode gets extra fields (owner,
// recruited_by, notes, status override); public mode is a simpler
// flow for people signing themselves up.
export function VolunteerIntakeForm({ mode }: { mode: "admin" | "public" }) {
  const router = useRouter();
  const { profile, hydrated } = useUserProfile();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [homeLd, setHomeLd] = useState("");
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<Set<AvailabilityWindow>>(new Set());
  const [remoteOk, setRemoteOk] = useState(false);
  const [notes, setNotes] = useState("");

  // Admin-only state
  const [ownerName, setOwnerName] = useState("");
  const [recruitedBy, setRecruitedBy] = useState("");

  function toggleInterest(k: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function toggleAvail(w: AvailabilityWindow) {
    setAvailability((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      return next;
    });
  }

  function submit() {
    setErr(null);
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone: phone || null,
      address_zip: zip || null,
      home_ld: homeLd ? Number(homeLd) : null,
      interest_tags: [...interests],
      availability_windows: [...availability],
      remote_ok: remoteOk,
      notes: notes || null,
      recruited_by_name: recruitedBy || null,
      owner_name: ownerName || null,
    };

    startTransition(async () => {
      const res =
        mode === "admin"
          ? await createVolunteer(payload, {
              name: profile.display_name ?? "",
              role: profile.role,
              ld: profile.ld_number,
            })
          : await submitVolunteerSignup(payload);
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      if (mode === "admin") {
        router.push(`/volunteers/${res.id}`);
      } else {
        setDone(
          "Thanks for signing up. Someone from the Volunteering Committee will reach out within a few days."
        );
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setZip("");
        setHomeLd("");
        setInterests(new Set());
        setAvailability(new Set());
        setRemoteOk(false);
        setNotes("");
      }
    });
  }

  const isAdmin = mode === "admin";
  const canWriteAdmin = isAdmin ? hydrated && !!profile.display_name : true;

  return (
    <div className="space-y-6">
      {done && (
        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 p-4 text-sm text-emerald-900">
          {done}
        </div>
      )}

      {isAdmin && !canWriteAdmin && (
        <div className="rounded-lg border border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-3 text-xs text-[var(--color-ldp-ink-900)]">
          Set your name in the portal (via any page that asks) before entering volunteers, so the
          intake is attributed.
        </div>
      )}

      <Field label="First name *">
        <Text value={firstName} onChange={setFirstName} required />
      </Field>
      <Field label="Last name *">
        <Text value={lastName} onChange={setLastName} required />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={`Email${isAdmin ? "" : " (email or phone required)"}`}>
          <Text type="email" value={email} onChange={setEmail} />
        </Field>
        <Field label="Phone">
          <Text type="tel" value={phone} onChange={setPhone} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="ZIP code">
          <Text value={zip} onChange={setZip} />
        </Field>
        <Field label="Home LD (if known)">
          <select
            value={homeLd}
            onChange={(e) => setHomeLd(e.target.value)}
            className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          >
            <option value="">—</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>LD{n}</option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          What do you like to do? {isAdmin ? "(what they said)" : "(pick any)"}
        </legend>
        <div className="grid gap-2 md:grid-cols-2">
          {VOLUNTEER_INTERESTS.map((i) => (
            <label
              key={i.key}
              className="flex cursor-pointer items-start gap-2 rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1.5 text-sm hover:border-[var(--color-ldp-navy-700)]"
            >
              <input
                type="checkbox"
                checked={interests.has(i.key)}
                onChange={() => toggleInterest(i.key)}
                className="mt-0.5"
              />
              <span>
                <span className="font-medium text-[var(--color-ldp-navy-900)]">{i.label}</span>
                <span className="ml-1 text-xs text-[var(--color-ldp-ink-700)]">· {i.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          When are you free?
        </legend>
        <div className="grid gap-2 md:grid-cols-2">
          {(Object.keys(AVAILABILITY_LABEL) as AvailabilityWindow[]).map((w) => (
            <label
              key={w}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1.5 text-sm hover:border-[var(--color-ldp-navy-700)]"
            >
              <input
                type="checkbox"
                checked={availability.has(w)}
                onChange={() => toggleAvail(w)}
              />
              {AVAILABILITY_LABEL[w]}
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1.5 text-sm hover:border-[var(--color-ldp-navy-700)]">
            <input
              type="checkbox"
              checked={remoteOk}
              onChange={(e) => setRemoteOk(e.target.checked)}
            />
            Open to remote work
          </label>
        </div>
      </fieldset>

      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Recruited by (who brought them in)">
            <Text value={recruitedBy} onChange={setRecruitedBy} />
          </Field>
          <Field label="Relationship owner (who manages this person)">
            <Text value={ownerName} onChange={setOwnerName} />
          </Field>
        </div>
      )}

      <Field label={isAdmin ? "Notes (context for Jessica)" : "Anything else we should know?"}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
        />
      </Field>

      {err && (
        <div className="rounded-md border border-[var(--color-ldp-red)] bg-[#FFF5F6] p-2 text-xs text-[var(--color-ldp-red)]">
          {err}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={submit}
          disabled={pending || (isAdmin && !canWriteAdmin)}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {pending ? "Saving…" : isAdmin ? "Add volunteer" : "Sign me up"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Text({
  value,
  onChange,
  type = "text",
  required = false,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
    />
  );
}
