"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  ACTIVITY_LABEL,
  AVAILABILITY_LABEL,
  SOURCE_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
  VOLUNTEER_INTERESTS,
  interestLabel,
  volunteerDisplayName,
  type AvailabilityWindow,
  type Volunteer,
  type VolunteerActivity,
  type VolunteerActivityType,
  type VolunteerStatus,
} from "@/lib/db/volunteers-types";
import {
  deleteActivity,
  logActivity,
  setVolunteerStatus,
  updateVolunteer,
} from "./volunteer-actions";

const ACTIVITY_TYPES: VolunteerActivityType[] = [
  "CANVASS",
  "PHONES",
  "TEXTS",
  "DATA",
  "EVENT_HELP",
  "HOSTING",
  "RIDES",
  "TRANSLATION",
  "SOCIAL",
  "FOOD",
  "WRITING",
  "TECH",
  "CHILDCARE",
  "ADMIN",
  "OTHER",
];

const STATUS_OPTIONS: VolunteerStatus[] = ["ACTIVE", "LAPSED", "PAUSED", "DO_NOT_CONTACT"];

export function VolunteerDetail({
  volunteer,
  activities,
}: {
  volunteer: Volunteer;
  activities: VolunteerActivity[];
}) {
  const { profile, hydrated } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const canWrite = hydrated && !!profile.display_name;
  const author = {
    name: profile.display_name ?? "",
    role: profile.role,
    ld: profile.ld_number,
  };

  return (
    <div>
      <div className="mb-5">
        <Link
          href="/volunteers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to Volunteers
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ldp-navy-900)]">
            {volunteerDisplayName(volunteer)}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-ldp-ink-700)]">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white"
              style={{ backgroundColor: STATUS_COLOR[volunteer.status] }}
            >
              {STATUS_LABEL[volunteer.status]}
            </span>
            {volunteer.home_ld != null && <span>LD{volunteer.home_ld}</span>}
            <span>·</span>
            <span>From: {SOURCE_LABEL[volunteer.source]}</span>
            {volunteer.owner_name && (
              <>
                <span>·</span>
                <span>Owner: {volunteer.owner_name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusMenu
            currentStatus={volunteer.status}
            onChange={(s) => void setVolunteerStatus(volunteer.id, s)}
          />
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)]"
          >
            {editing ? "Close edit" : "Edit"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_3fr]">
        {/* Left: identity + interests + notes */}
        <div className="space-y-4">
          <section className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Contact
            </h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              {volunteer.email && (
                <Row icon={<Mail className="size-3.5" />} label="Email">
                  <a href={`mailto:${volunteer.email}`} className="text-[var(--color-ldp-navy-700)] underline">
                    {volunteer.email}
                  </a>
                </Row>
              )}
              {volunteer.phone && (
                <Row icon={<Phone className="size-3.5" />} label="Phone">
                  {volunteer.phone}
                </Row>
              )}
              {(volunteer.address_street || volunteer.address_city || volunteer.address_zip) && (
                <Row label="Address">
                  {[
                    volunteer.address_street,
                    [volunteer.address_city, volunteer.address_zip].filter(Boolean).join(" "),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Row>
              )}
              {volunteer.home_precinct && (
                <Row label="Precinct">{volunteer.home_precinct}</Row>
              )}
              {volunteer.recruited_by_name && (
                <Row label="Recruited by">{volunteer.recruited_by_name}</Row>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Likes to do
            </h2>
            <div className="mt-2 flex flex-wrap gap-1">
              {volunteer.interest_tags.length === 0 ? (
                <span className="text-xs italic text-[var(--color-ldp-ink-700)]">
                  No interests recorded yet.
                </span>
              ) : (
                volunteer.interest_tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-ldp-navy-800)] bg-white px-2 py-0.5 text-[11px] text-[var(--color-ldp-navy-900)]"
                  >
                    {interestLabel(t)}
                  </span>
                ))
              )}
            </div>
            {(volunteer.availability_windows.length > 0 || volunteer.remote_ok) && (
              <>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                  Availability
                </h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {volunteer.availability_windows.map((w) => (
                    <span
                      key={w}
                      className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-2 py-0.5 text-[11px] text-[var(--color-ldp-ink-900)]"
                    >
                      {AVAILABILITY_LABEL[w as AvailabilityWindow] ?? w}
                    </span>
                  ))}
                  {volunteer.remote_ok && (
                    <span className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-2 py-0.5 text-[11px] text-[var(--color-ldp-ink-900)]">
                      Remote OK
                    </span>
                  )}
                </div>
              </>
            )}
          </section>

          {volunteer.notes && (
            <section className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                Notes
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ldp-ink-900)]">
                {volunteer.notes}
              </p>
            </section>
          )}

          {editing && <EditForm volunteer={volunteer} onDone={() => setEditing(false)} />}
        </div>

        {/* Right: activity log + quick-log */}
        <div className="space-y-4">
          <QuickLog volunteerId={volunteer.id} author={author} canWrite={canWrite} />

          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Activity log · {activities.length} entr{activities.length === 1 ? "y" : "ies"}
            </h2>
            {activities.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5 text-center text-sm text-[var(--color-ldp-ink-700)]">
                No activities logged yet. Use the quick-log above.
              </div>
            ) : (
              <ul className="space-y-2">
                {activities.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                        <span>{ACTIVITY_LABEL[a.activity_type]}</span>
                        <span className="text-[var(--color-ldp-ink-700)]">
                          {new Date(a.activity_date + "T00:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {a.hours != null && (
                          <span className="text-[var(--color-ldp-ink-700)]">· {a.hours}h</span>
                        )}
                        {a.related_ld != null && (
                          <span className="text-[var(--color-ldp-ink-700)]">· LD{a.related_ld}</span>
                        )}
                      </div>
                      {a.title && (
                        <div className="mt-1 text-sm font-medium text-[var(--color-ldp-navy-900)]">
                          {a.title}
                        </div>
                      )}
                      {a.notes && (
                        <p className="mt-1 whitespace-pre-wrap text-xs text-[var(--color-ldp-ink-900)]">
                          {a.notes}
                        </p>
                      )}
                      {a.author_name && (
                        <div className="mt-1 text-[10px] italic text-[var(--color-ldp-ink-700)]">
                          logged by {a.author_name}
                        </div>
                      )}
                    </div>
                    <DeleteActivityButton id={a.id} volunteerId={volunteer.id} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <dt className="flex min-w-20 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {icon}
        {label}
      </dt>
      <dd className="flex-1 text-[var(--color-ldp-ink-900)]">{children}</dd>
    </div>
  );
}

function StatusMenu({
  currentStatus,
  onChange,
}: {
  currentStatus: VolunteerStatus;
  onChange: (s: VolunteerStatus) => void;
}) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(e.target.value as VolunteerStatus)}
      className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)]"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          Status: {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}

function QuickLog({
  volunteerId,
  author,
  canWrite,
}: {
  volunteerId: string;
  author: { name: string; role: string | null; ld: number | null };
  canWrite: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [type, setType] = useState<VolunteerActivityType>("CANVASS");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await logActivity(
        volunteerId,
        {
          activity_type: type,
          activity_date: date,
          title: title || null,
          hours: hours ? Number(hours) : null,
          notes: notes || null,
        },
        author
      );
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      setTitle("");
      setHours("");
      setNotes("");
    });
  }

  return (
    <section className="rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        Quick-log activity
      </h2>
      {!canWrite && (
        <p className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
          Set your name in the portal before logging activity so it&apos;s attributed.
        </p>
      )}
      <div className="mt-3 grid gap-3 md:grid-cols-[auto_auto_auto_1fr]">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as VolunteerActivityType)}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          disabled={!canWrite}
        >
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>{ACTIVITY_LABEL[t]}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          disabled={!canWrite}
        />
        <input
          type="number"
          step="0.25"
          min="0"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours"
          className="w-24 rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          disabled={!canWrite}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short title (e.g. 'Crescent Hill canvass')"
          className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          disabled={!canWrite}
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="Optional notes"
        className="mt-3 w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
        disabled={!canWrite}
      />
      {err && (
        <div className="mt-2 rounded-md border border-[var(--color-ldp-red)] bg-[#FFF5F6] p-2 text-xs text-[var(--color-ldp-red)]">
          {err}
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={!canWrite || pending}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Log it"}
        </button>
      </div>
    </section>
  );
}

function DeleteActivityButton({ id, volunteerId }: { id: string; volunteerId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Delete activity"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this activity log entry?")) return;
        startTransition(async () => {
          await deleteActivity(id, volunteerId);
        });
      }}
      className="shrink-0 rounded p-1 text-[var(--color-ldp-ink-700)] hover:bg-[#FFF5F6] hover:text-[var(--color-ldp-red)] disabled:opacity-40"
    >
      <Trash2 aria-hidden="true" className="size-3.5" />
    </button>
  );
}

function EditForm({ volunteer, onDone }: { volunteer: Volunteer; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(volunteer.first_name);
  const [lastName, setLastName] = useState(volunteer.last_name);
  const [email, setEmail] = useState(volunteer.email ?? "");
  const [phone, setPhone] = useState(volunteer.phone ?? "");
  const [homeLd, setHomeLd] = useState(volunteer.home_ld != null ? String(volunteer.home_ld) : "");
  const [ownerName, setOwnerName] = useState(volunteer.owner_name ?? "");
  const [interests, setInterests] = useState<Set<string>>(new Set(volunteer.interest_tags));
  const [notes, setNotes] = useState(volunteer.notes ?? "");

  function toggleInterest(k: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await updateVolunteer(volunteer.id, {
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        home_ld: homeLd ? Number(homeLd) : null,
        owner_name: ownerName || null,
        interest_tags: [...interests],
        notes: notes || null,
      });
      if (!res.ok) setErr(res.error);
      else onDone();
    });
  }

  return (
    <section className="rounded-xl border-2 border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        Edit volunteer
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <TextField label="First name" value={firstName} onChange={setFirstName} />
        <TextField label="Last name" value={lastName} onChange={setLastName} />
        <TextField label="Email" value={email} onChange={setEmail} type="email" />
        <TextField label="Phone" value={phone} onChange={setPhone} type="tel" />
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Home LD
          </span>
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
        </label>
        <TextField label="Owner" value={ownerName} onChange={setOwnerName} />
      </div>
      <div className="mt-3">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Interests
        </span>
        <div className="flex flex-wrap gap-1">
          {VOLUNTEER_INTERESTS.map((i) => (
            <button
              key={i.key}
              type="button"
              onClick={() => toggleInterest(i.key)}
              className={`rounded-full border px-2 py-0.5 text-[11px] ${
                interests.has(i.key)
                  ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                  : "border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-900)]"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
      <label className="mt-3 block">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Notes
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
        />
      </label>
      {err && (
        <div className="mt-2 rounded-md border border-[var(--color-ldp-red)] bg-white p-2 text-xs text-[var(--color-ldp-red)]">
          {err}
        </div>
      )}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
      />
    </label>
  );
}
