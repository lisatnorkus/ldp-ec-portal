"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import { VOTER_REG_TARGETS } from "@/lib/db/voter-reg-events-types";
import { createVoterRegEvent } from "./voter-reg-event-actions";

export function VoterRegEventForm() {
  const { profile, hydrated } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [ld, setLd] = useState("");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerCommittee, setOrganizerCommittee] = useState("");
  const [signupUrl, setSignupUrl] = useState("");
  const [targets, setTargets] = useState<Set<string>>(new Set());

  const canWrite = hydrated && !!profile.display_name;

  function toggleTarget(k: string) {
    setTargets((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await createVoterRegEvent(
        {
          name,
          starts_at: startsAt,
          ends_at: endsAt || null,
          location,
          address: address || null,
          ld_number: ld ? Number(ld) : null,
          description: description || null,
          organizer_name: organizerName || null,
          organizer_committee: organizerCommittee || null,
          signup_url: signupUrl || null,
          target_populations: [...targets],
        },
        { name: profile.display_name ?? "", role: profile.role, ld: profile.ld_number }
      );
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      setOpen(false);
      setName("");
      setStartsAt("");
      setEndsAt("");
      setLocation("");
      setAddress("");
      setLd("");
      setDescription("");
      setOrganizerName("");
      setOrganizerCommittee("");
      setSignupUrl("");
      setTargets(new Set());
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-800)] hover:text-white"
      >
        <Plus aria-hidden="true" className="size-3.5" />
        Schedule a voter reg event
      </button>
    );
  }

  return (
    <section className="rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
          Schedule a voter registration event
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded p-1 text-[var(--color-ldp-ink-700)] hover:bg-[#FAFBFC]"
          aria-label="Close"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>

      {!canWrite && (
        <p className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
          Set your name in the portal first so the event is attributed.
        </p>
      )}

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Field label="Event name *">
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
        </Field>
        <Field label="Organizing committee">
          <select
            value={organizerCommittee}
            onChange={(e) => setOrganizerCommittee(e.target.value)}
            className={INPUT}
          >
            <option value="">—</option>
            <option value="VOLUNTEERING">Volunteering</option>
            <option value="EVENTS">Events</option>
            <option value="COMMUNICATIONS">Communications</option>
            <option value="CANDIDATE_RECRUITMENT">Candidate Recruitment</option>
            <option value="AD_HOC">Ad hoc</option>
          </select>
        </Field>
        <Field label="Start *">
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="End">
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Location *">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. NuLu Farmers Market"
            className={INPUT}
          />
        </Field>
        <Field label="Street address">
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={INPUT} />
        </Field>
        <Field label="LD (if scoped)">
          <select value={ld} onChange={(e) => setLd(e.target.value)} className={INPUT}>
            <option value="">Countywide</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>LD{n}</option>
            ))}
          </select>
        </Field>
        <Field label="Organizer contact name">
          <input
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Signup URL (Mobilize, Fillout, etc.)">
          <input
            type="url"
            value={signupUrl}
            onChange={(e) => setSignupUrl(e.target.value)}
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={INPUT}
        />
      </Field>

      <fieldset className="mt-3">
        <legend className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          Target populations
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {VOTER_REG_TARGETS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => toggleTarget(t.key)}
              className={`rounded-full border px-2 py-0.5 text-[11px] ${
                targets.has(t.key)
                  ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                  : "border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-900)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {err && (
        <div className="mt-3 rounded-md border border-[var(--color-ldp-red)] bg-[#FFF5F6] p-2 text-xs text-[var(--color-ldp-red)]">
          {err}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!canWrite || pending}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Schedule event"}
        </button>
      </div>
    </section>
  );
}

const INPUT =
  "w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm";

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
