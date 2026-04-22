"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Download,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Star,
  X,
} from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  STAGE_COLOR,
  STAGE_LABEL,
  type LdContact,
  type LdInteraction,
  type PipelineStage,
  type ContactMethod,
  type ContactSource,
  type InteractionOutcome,
} from "@/lib/db/ld-contacts-types";
import {
  createContact,
  logInteraction,
  toggleKeyRelationship,
  updateContact,
} from "./crm-actions";

const STAGES: PipelineStage[] = [
  "IDENTIFIED",
  "CONTACTED",
  "WARM",
  "COMMITTED",
  "ACTIVE",
  "EC_MEMBER",
  "COLD",
  "PAUSED",
  "NOT_INTERESTED",
];

const METHODS: ContactMethod[] = ["CALL", "TEXT", "DOOR", "EMAIL", "IN_PERSON", "EVENT", "OTHER"];

const OUTCOMES: InteractionOutcome[] = [
  "LEFT_VOICEMAIL",
  "HAD_CONVERSATION",
  "NOT_HOME",
  "AGREED_TO",
  "DECLINED",
  "OTHER",
];

const SOURCES: ContactSource[] = ["CANVASS", "REFERRAL", "EVENT", "SOCIAL", "WALK_IN", "OTHER"];

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDaysSince(iso: string | null): string {
  const d = daysSince(iso);
  if (d == null) return "Never";
  if (d === 0) return "Today";
  if (d === 1) return "1d ago";
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.round(d / 30)}mo ago`;
  return `${Math.round(d / 365)}y ago`;
}

function prettyLabel(s: string): string {
  return s.replace(/_/g, " ").toLowerCase();
}

export function PipelineTable({
  ldNumber,
  contacts,
  interactionsByContact,
}: {
  ldNumber: number;
  contacts: LdContact[];
  interactionsByContact: Record<string, LdInteraction[]>;
}) {
  const { profile, hydrated } = useUserProfile();
  const [addingContact, setAddingContact] = useState(false);
  const [openContactId, setOpenContactId] = useState<string | null>(null);
  const canWrite = hydrated && !!profile.display_name;
  const author = {
    name: profile.display_name ?? "",
    role: profile.role,
    ld: profile.ld_number,
  };

  const openContact = contacts.find((c) => c.id === openContactId) ?? null;
  const openInteractions = openContactId
    ? interactionsByContact[openContactId] ?? []
    : [];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-[var(--color-ldp-ink-700)]">
          Click a row for details. Log an interaction to update the last-contacted timestamp.
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportCsvButton contacts={contacts} ldNumber={ldNumber} />
          {canWrite && (
            <button
              type="button"
              onClick={() => setAddingContact(true)}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
            >
              <Plus aria-hidden="true" className="size-3.5" />
              Add prospect
            </button>
          )}
        </div>
      </div>

      {!canWrite && (
        <div className="mb-3 rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-3 text-xs text-[var(--color-ldp-ink-700)]">
          Set your name on the dashboard to add or update prospects.
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-10 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No prospects yet. Click &ldquo;Add prospect&rdquo; to start building your pipeline.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFA] text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
              <tr>
                <th className="w-8 px-2 py-2"></th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Stage</th>
                <th className="px-4 py-2 text-left">Last contacted</th>
                <th className="hidden px-4 py-2 text-left lg:table-cell">Contact</th>
                <th className="hidden px-4 py-2 text-left md:table-cell">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-ldp-line)]">
              {contacts.map((c) => {
                const d = daysSince(c.last_contacted_at);
                const stale = d == null || d >= 60;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setOpenContactId(c.id)}
                    className="cursor-pointer hover:bg-[#FAFBFC]"
                  >
                    <td className="px-2 py-2.5 text-center">
                      {c.is_key_relationship && (
                        <Star
                          aria-label="Key relationship"
                          className="inline size-3.5 fill-[var(--color-ldp-gold)] text-[var(--color-ldp-gold)]"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-[var(--color-ldp-navy-900)]">
                      {c.first_name} {c.last_name}
                      {c.home_precinct && (
                        <span className="ml-2 text-[10px] text-[var(--color-ldp-ink-700)]">
                          {c.home_precinct}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <StagePill stage={c.pipeline_stage} />
                    </td>
                    <td
                      className={`px-4 py-2.5 ${
                        stale ? "text-[var(--color-ldp-red)]" : "text-[var(--color-ldp-ink-700)]"
                      }`}
                    >
                      {formatDaysSince(c.last_contacted_at)}
                    </td>
                    <td className="hidden px-4 py-2.5 text-xs text-[var(--color-ldp-ink-700)] lg:table-cell">
                      {c.phone && (
                        <span className="mr-3 inline-flex items-center gap-1">
                          <Phone aria-hidden="true" className="size-3" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail aria-hidden="true" className="size-3" />
                          {c.email}
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-2.5 text-xs text-[var(--color-ldp-ink-700)] md:table-cell">
                      {prettyLabel(c.source)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {addingContact && (
        <ContactFormDrawer
          ldNumber={ldNumber}
          author={author}
          onClose={() => setAddingContact(false)}
        />
      )}

      {openContact && (
        <ContactDetailDrawer
          ldNumber={ldNumber}
          contact={openContact}
          interactions={openInteractions}
          author={author}
          canWrite={canWrite}
          onClose={() => setOpenContactId(null)}
        />
      )}
    </>
  );
}

function StagePill({ stage }: { stage: PipelineStage }) {
  const color = STAGE_COLOR[stage];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white"
      style={{ backgroundColor: color }}
    >
      {STAGE_LABEL[stage]}
    </span>
  );
}

function DrawerShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        aria-label="Close drawer"
        onClick={onClose}
        className="flex-1 bg-black/40"
      />
      <aside className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-ldp-line)] bg-white px-5 py-3">
          <h2 className="text-base font-bold text-[var(--color-ldp-navy-900)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-[var(--color-ldp-ink-700)] hover:bg-[var(--color-ldp-line)]"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="flex-1 p-5">{children}</div>
      </aside>
    </div>
  );
}

function ContactFormDrawer({
  ldNumber,
  author,
  onClose,
}: {
  ldNumber: number;
  author: { name: string; role: string | null; ld: number | null };
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [precinct, setPrecinct] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Louisville");
  const [zip, setZip] = useState("");
  const [stage, setStage] = useState<PipelineStage>("IDENTIFIED");
  const [source, setSource] = useState<ContactSource>("OTHER");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!firstName.trim() || !lastName.trim()) {
      setErr("First and last name required.");
      return;
    }
    setErr(null);
    startTransition(async () => {
      const res = await createContact(
        ldNumber,
        {
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          home_precinct: precinct,
          address_street: street,
          address_city: city,
          address_zip: zip,
          pipeline_stage: stage,
          source,
          notes,
        },
        author
      );
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      onClose();
    });
  }

  return (
    <DrawerShell title="Add prospect" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput label="First name" value={firstName} onChange={setFirstName} required />
          <LabeledInput label="Last name" value={lastName} onChange={setLastName} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput label="Phone" value={phone} onChange={setPhone} type="tel" />
          <LabeledInput label="Email" value={email} onChange={setEmail} type="email" />
        </div>
        <LabeledInput label="Home precinct (e.g. L204)" value={precinct} onChange={setPrecinct} />
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Address · for VoteBuilder import matching
          </div>
          <LabeledInput label="Street" value={street} onChange={setStreet} />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <LabeledInput label="City" value={city} onChange={setCity} />
            <LabeledInput label="Zip" value={zip} onChange={setZip} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <LabeledSelect
            label="Stage"
            value={stage}
            onChange={(v) => setStage(v as PipelineStage)}
            options={STAGES.map((s) => ({ value: s, label: STAGE_LABEL[s] }))}
          />
          <LabeledSelect
            label="Source"
            value={source}
            onChange={(v) => setSource(v as ContactSource)}
            options={SOURCES.map((s) => ({ value: s, label: prettyLabel(s) }))}
          />
        </div>
        <LabeledTextarea label="Notes" value={notes} onChange={setNotes} rows={3} />
        {err && <p className="text-xs text-[var(--color-ldp-red)]">{err}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isPending || !firstName.trim() || !lastName.trim()}
            className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Add prospect"}
          </button>
        </div>
      </div>
    </DrawerShell>
  );
}

function ContactDetailDrawer({
  ldNumber,
  contact,
  interactions,
  author,
  canWrite,
  onClose,
}: {
  ldNumber: number;
  contact: LdContact;
  interactions: LdInteraction[];
  author: { name: string; role: string | null; ld: number | null };
  canWrite: boolean;
  onClose: () => void;
}) {
  const [logging, setLogging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggleKey() {
    startTransition(async () => {
      await toggleKeyRelationship(contact.id, ldNumber, !contact.is_key_relationship);
    });
  }

  return (
    <DrawerShell
      title={`${contact.first_name} ${contact.last_name}`}
      onClose={onClose}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StagePill stage={contact.pipeline_stage} />
        <span className="text-xs text-[var(--color-ldp-ink-700)]">
          Last contacted: {formatDaysSince(contact.last_contacted_at)}
        </span>
        <button
          type="button"
          onClick={handleToggleKey}
          disabled={isPending || !canWrite}
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
            contact.is_key_relationship
              ? "bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]"
              : "border border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-gold)]"
          } disabled:opacity-50`}
        >
          <Star
            aria-hidden="true"
            className={`size-3 ${contact.is_key_relationship ? "fill-[var(--color-ldp-navy-900)]" : ""}`}
          />
          {contact.is_key_relationship ? "Key relationship" : "Flag as key"}
        </button>
      </div>

      <dl className="mb-4 grid grid-cols-2 gap-3 text-xs">
        {contact.phone && (
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">Phone</dt>
            <dd>
              <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="text-[var(--color-ldp-navy-700)] hover:underline">
                {contact.phone}
              </a>
            </dd>
          </div>
        )}
        {contact.email && (
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`} className="text-[var(--color-ldp-navy-700)] hover:underline">
                {contact.email}
              </a>
            </dd>
          </div>
        )}
        {contact.home_precinct && (
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">Precinct</dt>
            <dd>{contact.home_precinct}</dd>
          </div>
        )}
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">Source</dt>
          <dd>{prettyLabel(contact.source)}</dd>
        </div>
        {(contact.address_street || contact.address_city) && (
          <div className="col-span-2">
            <dt className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">Address</dt>
            <dd>
              {[contact.address_street, contact.address_city, contact.address_zip]
                .filter(Boolean)
                .join(", ")}
            </dd>
          </div>
        )}
      </dl>

      {contact.notes && (
        <div className="mb-4 rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Background
          </div>
          <p className="whitespace-pre-wrap text-sm text-[var(--color-ldp-ink-900)]">{contact.notes}</p>
        </div>
      )}

      {canWrite && !logging && !editing && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLogging(true)}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
          >
            <MessageCircle aria-hidden="true" className="size-3.5" />
            Log interaction
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
          >
            Edit contact
          </button>
        </div>
      )}

      {logging && (
        <InteractionComposer
          ldNumber={ldNumber}
          contactId={contact.id}
          author={author}
          onClose={() => setLogging(false)}
        />
      )}

      {editing && (
        <EditContactInline
          ldNumber={ldNumber}
          contact={contact}
          onClose={() => setEditing(false)}
        />
      )}

      <div className="mt-4">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Interaction log · {interactions.length}
        </div>
        {interactions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-3 text-xs text-[var(--color-ldp-ink-700)]">
            No interactions logged yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {interactions.map((i) => (
              <li
                key={i.id}
                className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-xs"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--color-ldp-navy-800)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white">
                    {prettyLabel(i.contact_method)}
                  </span>
                  <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                    {prettyLabel(i.outcome)}
                  </span>
                  <span className="ml-auto text-[10px] text-[var(--color-ldp-ink-700)]">
                    {new Date(i.contacted_at).toLocaleDateString()}
                  </span>
                </div>
                {i.outcome_detail && (
                  <p className="mt-1 text-[var(--color-ldp-ink-900)]">{i.outcome_detail}</p>
                )}
                {i.notes && (
                  <p className="mt-1 text-[var(--color-ldp-ink-700)]">{i.notes}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[var(--color-ldp-ink-700)]">
                  {i.new_stage && (
                    <span>→ moved to <strong>{STAGE_LABEL[i.new_stage]}</strong></span>
                  )}
                  {i.follow_up_task_id && <span>· follow-up task created</span>}
                  {i.author_name && <span>· by {i.author_name}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DrawerShell>
  );
}

function InteractionComposer({
  ldNumber,
  contactId,
  author,
  onClose,
}: {
  ldNumber: number;
  contactId: string;
  author: { name: string; role: string | null; ld: number | null };
  onClose: () => void;
}) {
  const [method, setMethod] = useState<ContactMethod>("CALL");
  const [outcome, setOutcome] = useState<InteractionOutcome>("HAD_CONVERSATION");
  const [outcomeDetail, setOutcomeDetail] = useState("");
  const [newStage, setNewStage] = useState<PipelineStage | "">("");
  const [notes, setNotes] = useState("");
  const [createFollowUp, setCreateFollowUp] = useState(false);
  const [followUpTitle, setFollowUpTitle] = useState("");
  const [followUpDue, setFollowUpDue] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await logInteraction(
        contactId,
        ldNumber,
        {
          contact_method: method,
          outcome,
          outcome_detail: outcomeDetail,
          new_stage: newStage || null,
          notes,
          follow_up:
            createFollowUp && followUpTitle.trim()
              ? {
                  title: followUpTitle,
                  due_date: followUpDue || null,
                  priority: "MEDIUM",
                }
              : null,
        },
        author
      );
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      onClose();
    });
  }

  return (
    <div className="mb-4 rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        Log interaction
      </div>
      <div className="grid grid-cols-2 gap-2">
        <LabeledSelect
          label="Method"
          value={method}
          onChange={(v) => setMethod(v as ContactMethod)}
          options={METHODS.map((m) => ({ value: m, label: prettyLabel(m) }))}
        />
        <LabeledSelect
          label="Outcome"
          value={outcome}
          onChange={(v) => setOutcome(v as InteractionOutcome)}
          options={OUTCOMES.map((o) => ({ value: o, label: prettyLabel(o) }))}
        />
      </div>
      <LabeledInput label="Detail (optional)" value={outcomeDetail} onChange={setOutcomeDetail} />
      <LabeledTextarea label="Notes" value={notes} onChange={setNotes} rows={2} />
      <LabeledSelect
        label="Move to stage (optional)"
        value={newStage}
        onChange={(v) => setNewStage(v as PipelineStage | "")}
        options={[
          { value: "", label: "— leave unchanged —" },
          ...STAGES.map((s) => ({ value: s, label: STAGE_LABEL[s] })),
        ]}
      />
      <label className="mt-2 flex items-center gap-2 text-xs text-[var(--color-ldp-ink-900)]">
        <input
          type="checkbox"
          checked={createFollowUp}
          onChange={(e) => setCreateFollowUp(e.target.checked)}
          className="size-3.5"
        />
        Create follow-up task
      </label>
      {createFollowUp && (
        <div className="mt-2 space-y-2">
          <LabeledInput
            label="Follow-up title"
            value={followUpTitle}
            onChange={setFollowUpTitle}
            placeholder={`Follow up`}
          />
          <LabeledInput
            label="Due date (optional)"
            value={followUpDue}
            onChange={setFollowUpDue}
            type="date"
          />
        </div>
      )}
      {err && <p className="mt-2 text-xs text-[var(--color-ldp-red)]">{err}</p>}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Log interaction"}
        </button>
      </div>
    </div>
  );
}

function EditContactInline({
  ldNumber,
  contact,
  onClose,
}: {
  ldNumber: number;
  contact: LdContact;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState(contact.first_name);
  const [lastName, setLastName] = useState(contact.last_name);
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [precinct, setPrecinct] = useState(contact.home_precinct ?? "");
  const [street, setStreet] = useState(contact.address_street ?? "");
  const [city, setCity] = useState(contact.address_city ?? "");
  const [zip, setZip] = useState(contact.address_zip ?? "");
  const [stage, setStage] = useState<PipelineStage>(contact.pipeline_stage);
  const [source, setSource] = useState<ContactSource>(contact.source);
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setErr(null);
    startTransition(async () => {
      const res = await updateContact(contact.id, ldNumber, {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        home_precinct: precinct,
        address_street: street,
        address_city: city,
        address_zip: zip,
        pipeline_stage: stage,
        source,
        notes,
      });
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      onClose();
    });
  }

  return (
    <div className="mb-4 space-y-3 rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        Edit contact
      </div>
      <div className="grid grid-cols-2 gap-2">
        <LabeledInput label="First name" value={firstName} onChange={setFirstName} required />
        <LabeledInput label="Last name" value={lastName} onChange={setLastName} required />
        <LabeledInput label="Phone" value={phone} onChange={setPhone} type="tel" />
        <LabeledInput label="Email" value={email} onChange={setEmail} type="email" />
      </div>
      <LabeledInput label="Home precinct" value={precinct} onChange={setPrecinct} />
      <LabeledInput label="Street" value={street} onChange={setStreet} />
      <div className="grid grid-cols-2 gap-2">
        <LabeledInput label="City" value={city} onChange={setCity} />
        <LabeledInput label="Zip" value={zip} onChange={setZip} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <LabeledSelect
          label="Stage"
          value={stage}
          onChange={(v) => setStage(v as PipelineStage)}
          options={STAGES.map((s) => ({ value: s, label: STAGE_LABEL[s] }))}
        />
        <LabeledSelect
          label="Source"
          value={source}
          onChange={(v) => setSource(v as ContactSource)}
          options={SOURCES.map((s) => ({ value: s, label: prettyLabel(s) }))}
        />
      </div>
      <LabeledTextarea label="Notes" value={notes} onChange={setNotes} rows={3} />
      {err && <p className="text-xs text-[var(--color-ldp-red)]">{err}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isPending || !firstName.trim() || !lastName.trim()}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function ExportCsvButton({
  contacts,
  ldNumber,
}: {
  contacts: LdContact[];
  ldNumber: number;
}) {
  function handleExport() {
    if (contacts.length === 0) return;
    // Columns matched to VoteBuilder's MyCampaign/MyVoters importer.
    // When we get VAN API access, swap this function to POST to the
    // API — the data shape already matches.
    const header = [
      "First Name",
      "Last Name",
      "Street",
      "City",
      "State",
      "Zip",
      "Phone",
      "Email",
      "VAN ID",
      "Stage",
      "Source",
      "Home Precinct",
      "Last Contacted",
      "Notes",
    ];
    const rows = contacts.map((c) => [
      c.first_name,
      c.last_name,
      c.address_street ?? "",
      c.address_city ?? "",
      c.address_city ? "KY" : "",
      c.address_zip ?? "",
      c.phone ?? "",
      c.email ?? "",
      c.voter_file_id ?? "",
      STAGE_LABEL[c.pipeline_stage],
      prettyLabel(c.source),
      c.home_precinct ?? "",
      c.last_contacted_at ? c.last_contacted_at.slice(0, 10) : "",
      (c.notes ?? "").replace(/\n/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell ?? "");
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ld${ldNumber}-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={contacts.length === 0}
      className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
    >
      <Download aria-hidden="true" className="size-3.5" />
      Export for VoteBuilder
    </button>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
      />
    </label>
  );
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
