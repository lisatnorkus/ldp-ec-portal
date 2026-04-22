import Link from "next/link";
import { CalendarClock, Scale } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Transitions" };

type Transition = {
  id: string;
  seat_code: string;
  previous_holder_name: string | null;
  previous_holder_id: string | null;
  successor_name: string | null;
  successor_id: string | null;
  departed_date: string | null;
  departure_reason: string | null;
  elected_date: string | null;
  status: "VACANT" | "FILLED";
  recommended_action: string | null;
  notes: string | null;
};

async function fetchTransitions(): Promise<Transition[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("transitions")
    .select("*")
    .order("status", { ascending: false }) // VACANT before FILLED
    .order("departed_date", { ascending: false, nullsFirst: false });
  return (data ?? []) as Transition[];
}

// A transition with status=VACANT but a future departed_date is a
// planned/announced departure — the seat isn't actually open yet.
// Split those out so they don't read as currently-vacant.
function isAnnounced(t: Transition, today: string): boolean {
  return t.status === "VACANT" && t.departed_date != null && t.departed_date > today;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(iso: string | null, today: string): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00").getTime();
  const t = new Date(today + "T00:00:00").getTime();
  return Math.round((d - t) / (1000 * 60 * 60 * 24));
}

export default async function TransitionsPage() {
  const all = await fetchTransitions();
  const today = new Date().toISOString().slice(0, 10);
  const announced = all.filter((t) => isAnnounced(t, today));
  const vacant = all.filter((t) => t.status === "VACANT" && !isAnnounced(t, today));
  const filled = all.filter((t) => t.status === "FILLED");

  const subtitleParts: string[] = [];
  if (vacant.length > 0)
    subtitleParts.push(`${vacant.length} seat${vacant.length === 1 ? "" : "s"} vacant now`);
  if (announced.length > 0)
    subtitleParts.push(
      `${announced.length} announced departure${announced.length === 1 ? "" : "s"}`
    );
  if (filled.length > 0) subtitleParts.push(`${filled.length} filled`);
  const subtitle =
    subtitleParts.length > 0
      ? `${subtitleParts.join(" · ")}. CEC has 90 days from notification to fill LD vacancies per state bylaws (KDP Art. III.B).`
      : "CEC has 90 days from notification to fill LD vacancies per state bylaws (KDP Art. III.B).";

  return (
    <HubShell
      eyebrow="Transitions"
      title="Seats that have changed hands since the June 2025 reorg."
      subtitle={subtitle}
      maxWidthClass="max-w-5xl"
    >
        <div className="mb-8 rounded-xl border border-[var(--color-ldp-navy-800)] bg-white p-5">
          <div className="flex items-start gap-3">
            <Scale aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--color-ldp-navy-800)]" />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                Different process: state House / Senate vacancies
              </div>
              <p className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
                When a Kentucky General Assembly Democrat vacates their seat mid-term, the
                replacement nominee is selected by a Nominating Committee per{" "}
                <strong>KDP Bylaws Article VI</strong> — a separate process from CEC vacancies.
                Different people vote depending on whether it&apos;s a State House or State Senate
                seat.
              </p>
              <Link
                href="/vacancies/legislative"
                className="mt-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
              >
                Read the process →
              </Link>
            </div>
          </div>
        </div>

        {announced.length > 0 && (
          <section className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock aria-hidden="true" className="size-4 text-amber-700" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Announced · {announced.length}
              </h2>
            </div>
            <p className="mb-3 text-xs text-[var(--color-ldp-ink-700)]">
              Transitions that have been announced but haven&apos;t taken effect yet. The seat is
              still held by the current person until the effective date.
            </p>
            <div className="space-y-3">
              {announced.map((t) => (
                <AnnouncedCard key={t.id} t={t} today={today} />
              ))}
            </div>
          </section>
        )}

        {vacant.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Vacant now · {vacant.length}
            </h2>
            <div className="space-y-3">
              {vacant.map((t) => (
                <VacantCard key={t.id} t={t} />
              ))}
            </div>
          </section>
        )}

        {filled.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Recently filled · {filled.length}
            </h2>
            <div className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
              {/* Desktop table */}
              <table className="hidden w-full text-sm md:table">
                <thead className="bg-[#FAFAFA] text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Seat</th>
                    <th className="px-4 py-2.5 text-left">Previous</th>
                    <th className="px-4 py-2.5 text-left">Departed</th>
                    <th className="px-4 py-2.5 text-left">Now held by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-ldp-line)]">
                  {filled.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-2.5 font-medium text-[var(--color-ldp-navy-900)]">
                        {formatSeat(t.seat_code)}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[var(--color-ldp-ink-700)]">
                        {t.previous_holder_name ?? "—"}
                        {t.departure_reason && <div className="italic">{t.departure_reason}</div>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[var(--color-ldp-ink-700)]">
                        {formatDate(t.departed_date)}
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        {t.successor_id ? (
                          <Link
                            href={`/people/${t.successor_id}`}
                            className="font-semibold text-[var(--color-ldp-navy-900)] hover:underline"
                          >
                            {t.successor_name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                            {t.successor_name}
                          </span>
                        )}
                        <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                          Filled
                        </span>
                        {t.elected_date && (
                          <div className="mt-0.5 text-[var(--color-ldp-ink-700)]">
                            Elected {formatDate(t.elected_date)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="divide-y divide-[var(--color-ldp-line)] md:hidden">
                {filled.map((t) => (
                  <li key={t.id} className="p-4 text-sm">
                    <div className="font-semibold text-[var(--color-ldp-navy-900)]">
                      {formatSeat(t.seat_code)}
                    </div>
                    <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
                      {t.previous_holder_name ?? "—"}
                      {t.departed_date && <> · departed {formatDate(t.departed_date)}</>}
                      {t.departure_reason && (
                        <div className="italic">{t.departure_reason}</div>
                      )}
                    </div>
                    <div className="mt-2 text-xs">
                      {t.successor_id ? (
                        <Link
                          href={`/people/${t.successor_id}`}
                          className="font-semibold text-[var(--color-ldp-navy-900)] hover:underline"
                        >
                          → {t.successor_name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                          → {t.successor_name}
                        </span>
                      )}
                      <span className="ml-2 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                        Filled
                      </span>
                    </div>
                    {t.elected_date && (
                      <div className="mt-1 text-[10px] text-[var(--color-ldp-ink-700)]">
                        Elected {t.elected_date}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
    </HubShell>
  );
}

function VacantCard({ t }: { t: Transition }) {
  return (
    <article className="rounded-xl border-l-4 border-[var(--color-ldp-red)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-[var(--color-ldp-navy-900)]">
            {formatSeat(t.seat_code)}
          </div>
          {t.previous_holder_name && (
            <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
              Previously: {t.previous_holder_name}
              {t.departure_reason && <> · {t.departure_reason}</>}
              {t.departed_date && <> · departed {t.departed_date}</>}
            </div>
          )}
          {t.notes && !t.previous_holder_name && (
            <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">{t.notes}</div>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-[var(--color-ldp-red)] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
          Vacant
        </span>
      </div>
      {t.recommended_action && (
        <div className="mt-3 rounded border border-dashed border-[var(--color-ldp-gold)] bg-[#EFF6FF] p-3 text-sm">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
            Recommended action
          </span>
          <div className="mt-1 text-[var(--color-ldp-ink-900)]">{t.recommended_action}</div>
        </div>
      )}
    </article>
  );
}

function AnnouncedCard({ t, today }: { t: Transition; today: string }) {
  const days = daysUntil(t.departed_date, today);
  return (
    <article className="overflow-hidden rounded-xl border-2 border-amber-500 bg-white shadow-sm">
      <div aria-hidden="true" className="h-1.5 w-full bg-amber-500" />
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                Announced
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                Effective {formatDate(t.departed_date)}
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-[var(--color-ldp-navy-900)]">
              {formatSeat(t.seat_code)}
            </h3>
            <div className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
              <span className="text-[var(--color-ldp-ink-700)]">Currently held by:</span>{" "}
              {t.previous_holder_id ? (
                <Link
                  href={`/people/${t.previous_holder_id}`}
                  className="font-semibold hover:underline"
                >
                  {t.previous_holder_name}
                </Link>
              ) : (
                <span className="font-semibold">{t.previous_holder_name ?? "—"}</span>
              )}
              {t.departure_reason && <> · {t.departure_reason.toLowerCase()}</>}
            </div>
            {t.successor_name && (
              <div className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
                <span className="text-[var(--color-ldp-ink-700)]">Successor:</span>{" "}
                {t.successor_id ? (
                  <Link
                    href={`/people/${t.successor_id}`}
                    className="font-semibold hover:underline"
                  >
                    {t.successor_name}
                  </Link>
                ) : (
                  <span className="font-semibold">{t.successor_name}</span>
                )}
              </div>
            )}
          </div>
          {days != null && days >= 0 && (
            <div className="shrink-0 rounded-lg border-2 border-amber-500 bg-white px-3 py-1.5 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                In
              </div>
              <div className="text-2xl font-black text-amber-700">{days}</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                day{days === 1 ? "" : "s"}
              </div>
            </div>
          )}
        </div>
        {t.recommended_action && (
          <div className="mt-4 rounded-lg border border-dashed border-amber-400 bg-amber-50 p-3 text-sm">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-700">
              Transition plan
            </div>
            <div className="mt-1 text-[var(--color-ldp-ink-900)]">{t.recommended_action}</div>
          </div>
        )}
        {t.notes && (
          <div className="mt-2 text-[11px] italic text-[var(--color-ldp-ink-700)]">
            {t.notes}
          </div>
        )}
      </div>
    </article>
  );
}

function formatSeat(code: string): string {
  return code
    .replace(/_GAP$/, "")
    .replace(/_/g, " ")
    .replace(/\bVC\b/, "Vice Chair")
    .replace(/\bPRES\b/i, "President")
    .replace(/\bCHAIR\b/i, "Chair");
}
