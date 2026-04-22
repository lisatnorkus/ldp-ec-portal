import Link from "next/link";
import { Scale } from "lucide-react";
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

export default async function TransitionsPage() {
  const all = await fetchTransitions();
  const vacant = all.filter((t) => t.status === "VACANT");
  const filled = all.filter((t) => t.status === "FILLED");

  return (
    <HubShell
      eyebrow="Transitions"
      title="Seats that have changed hands since the June 2025 reorg."
      subtitle={`${vacant.length} seat${vacant.length === 1 ? "" : "s"} still vacant · ${filled.length} filled. CEC has 90 days from notification to fill LD vacancies per state bylaws (KDP Art. III.B).`}
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

        {vacant.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Vacant · {vacant.length}
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
                        {t.departed_date ?? "—"}
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
                            Elected {t.elected_date}
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
                      {t.departed_date && <> · departed {t.departed_date}</>}
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

function formatSeat(code: string): string {
  return code
    .replace(/_GAP$/, "")
    .replace(/_/g, " ")
    .replace(/\bVC\b/, "Vice Chair")
    .replace(/\bPRES\b/i, "President")
    .replace(/\bCHAIR\b/i, "Chair");
}
