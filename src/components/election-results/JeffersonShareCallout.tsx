import { MapPin, TrendingUp } from "lucide-react";
import type { EnrichedCandidate } from "@/lib/db/candidate-results";

// Headline board-facing framing: "Of Booker's 155K statewide votes, 37%
// came from Jefferson." Surfaces the top statewide races by Jefferson
// share so the EC can see how much Louisville drove each campaign.

type Props = {
  candidates: EnrichedCandidate[];
};

type Row = {
  full_name: string;
  party: string;
  office_label: string;
  jeff_votes: number;
  statewide_votes: number;
  share_pct: number;
  advances: boolean;
  is_endorsed: boolean;
};

function officeLabel(c: EnrichedCandidate): string {
  switch (c.office_type) {
    case "US_SENATE":
      return "U.S. Senate (KY)";
    case "US_HOUSE":
      return `U.S. House KY-${c.district_number}`;
    case "STATE_SENATE":
      return `State Senate SD${c.district_number}`;
    case "STATE_HOUSE":
      return `State House HD${c.district_number}`;
    default:
      return "";
  }
}

// Only races where the universe extends beyond Jefferson are worth
// framing as "Jefferson's share of statewide." Wholly-Jefferson races
// (KY-3, every State Senate / State House district that lives entirely
// inside the county) trivially come in at ~100% Jefferson and the share
// number is meaningless to a board.
const SHARE_MEANINGFUL_THRESHOLD = 95;

export function JeffersonShareCallout({ candidates }: Props) {
  // Only candidates whose statewide universe is larger than Jefferson —
  // i.e., U.S. Senate (KY-wide) and races that span counties beyond
  // Jefferson (KY-2). Drop any candidate whose Jefferson share is at or
  // above the threshold because that means the race is effectively
  // contained in Jefferson.
  const rows: Row[] = candidates
    .filter(
      (c) =>
        c.statewide_votes != null &&
        c.statewide_votes > 0 &&
        c.votes != null &&
        c.jefferson_share_pct != null &&
        c.jefferson_share_pct < SHARE_MEANINGFUL_THRESHOLD
    )
    .map((c) => ({
      full_name: c.full_name,
      party: c.party,
      office_label: officeLabel(c),
      jeff_votes: c.votes!,
      statewide_votes: c.statewide_votes!,
      share_pct: c.jefferson_share_pct!,
      advances: c.advances,
      is_endorsed: c.is_endorsed,
    }));

  if (rows.length === 0) return null;

  // Headline picks: top three rows by share.
  const top = [...rows]
    .sort((a, b) => b.share_pct - a.share_pct)
    .slice(0, 3);

  // US Senate primary winners get a dedicated card because that's the
  // biggest stat the board needs to hear.
  const usSenWinners = rows.filter(
    (r) => r.office_label.startsWith("U.S. Senate") && r.advances
  );

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--color-ldp-navy-700)] bg-white shadow-sm">
      <header className="bg-gradient-to-r from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-700)] px-6 py-4 text-white">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-gold,#c89a3b)]">
          <TrendingUp aria-hidden className="size-3.5" />
          Jefferson&apos;s share of statewide races
        </div>
        <h2 className="mt-1 text-xl font-bold tracking-tight">
          How much Louisville drove each campaign.
        </h2>
        <p className="mt-1 text-sm text-white/85">
          Every statewide and federal candidate had a number that came in part
          from Jefferson County. This is how big that part was.
        </p>
      </header>

      <div className="space-y-6 px-6 py-5">
        {usSenWinners.length > 0 && (
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-700)]">
              U.S. Senate · the headline race
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {usSenWinners.map((r) => (
                <BigShareCard key={`${r.party}-${r.full_name}`} row={r} />
              ))}
            </div>
          </div>
        )}

        {top.length > 0 && (
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-700)]">
              Highest Jefferson contribution to a statewide-counted race
            </div>
            <ol className="space-y-2">
              {top.map((r) => (
                <li
                  key={`${r.party}-${r.full_name}`}
                  className="flex flex-wrap items-baseline justify-between gap-3 rounded-lg border bg-[var(--color-ldp-cream,#fbf8f1)] px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
                      {r.full_name}
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                        {r.office_label}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--color-ldp-ink-700)]">
                      {r.jeff_votes.toLocaleString()} Jefferson · {" "}
                      {r.statewide_votes.toLocaleString()} statewide
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-2xl font-black tabular-nums leading-none text-[var(--color-ldp-navy-900)]">
                      {r.share_pct.toFixed(0)}%
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                      from Jefferson
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="text-[11px] italic text-[var(--color-ldp-ink-700)]">
          Statewide totals from the Kentucky Secretary of State&apos;s live
          results.{" "}
          <a
            href="https://vrsws.sos.ky.gov/liveresults/Statewide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-navy-700)] underline"
          >
            Source: vrsws.sos.ky.gov/liveresults/Statewide
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function BigShareCard({ row }: { row: Row }) {
  const accent =
    row.party === "D"
      ? "var(--color-ldp-navy-700)"
      : row.party === "R"
        ? "var(--color-ldp-red)"
        : "var(--color-ldp-ink-400, #7a808b)";
  return (
    <article
      className="flex flex-col rounded-xl border bg-[var(--color-ldp-cream,#fbf8f1)] p-4"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: accent }}
        >
          {row.party === "D" ? "Democrat" : row.party === "R" ? "Republican" : "—"}
        </span>
        <span className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
          {row.full_name}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-black tabular-nums leading-none text-[var(--color-ldp-navy-900)]">
          {row.share_pct.toFixed(0)}%
        </span>
        <span className="text-sm text-[var(--color-ldp-ink-700)]">
          of their statewide vote came from Jefferson
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--color-ldp-ink-700)]">
        <MapPin aria-hidden className="size-3.5" />
        {row.jeff_votes.toLocaleString()} Jefferson votes ·{" "}
        {row.statewide_votes.toLocaleString()} statewide
      </div>
    </article>
  );
}
