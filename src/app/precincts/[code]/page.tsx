import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubShell } from "@/components/hub/HubShell";
import {
  fetchPrecinctByCode,
  precinctCodeFrom,
  STRATEGY_COLOR_VAR,
  STRATEGY_FRIENDLY,
  STRATEGY_ONELINE,
  type Precinct,
} from "@/lib/db/precincts";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchPcsForLd,
  pcDisplayName,
  type PrecinctCaptain,
} from "@/lib/db/precinct-captains";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return { title: `Precinct ${code.toUpperCase()}` };
}

type Candidate = {
  id: string;
  office_type: string;
  district_number: number;
  full_name: string;
  party: string;
  is_incumbent: boolean;
  is_endorsed: boolean;
  notes: string | null;
  website_url: string | null;
  email: string | null;
};

async function fetchCandidates(
  hd: number | null,
  mc: number | null,
  sd: number | null,
  cd: number | null
): Promise<Candidate[]> {
  const supabase = await getSupabaseServer();
  // Every precinct in Jefferson County sees Mayor + US Senate + County
  // Offices on the ballot. HD/SD/MC/CD are precinct-specific.
  const filters: string[] = [
    "office_type.eq.MAYOR",
    "office_type.eq.US_SENATE",
    "office_type.eq.COUNTY_OFFICE",
  ];
  if (hd != null) filters.push(`and(office_type.eq.STATE_HOUSE,district_number.eq.${hd})`);
  if (mc != null) filters.push(`and(office_type.eq.METRO_COUNCIL,district_number.eq.${mc})`);
  if (sd != null) filters.push(`and(office_type.eq.STATE_SENATE,district_number.eq.${sd})`);
  if (cd != null) filters.push(`and(office_type.eq.US_HOUSE,district_number.eq.${cd})`);
  const { data } = await supabase
    .from("candidates")
    .select("*")
    .eq("cycle_year", 2026)
    .or(filters.join(","))
    .order("office_type")
    .order("is_endorsed", { ascending: false })
    .order("is_incumbent", { ascending: false });
  return (data ?? []) as Candidate[];
}

// Parse the county-office sub-type from the notes field. Candidates
// are tagged like "Sheriff", "County Clerk · ...", "Judge Executive
// · unopposed in primary". First token before "·" is the office.
function countySubOffice(notes: string | null): string {
  if (!notes) return "County Office";
  const first = notes.split("·")[0]?.trim();
  return first || "County Office";
}

export default async function PrecinctDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  if (!/^L\d+$/.test(code)) notFound();

  const precinct = await fetchPrecinctByCode(code);
  if (!precinct) notFound();

  const ldNumber = precinct.hd ? parseInt(precinct.hd, 10) : null;
  const mcNumber = precinct.metro_council ? parseInt(precinct.metro_council, 10) : null;
  const sdNumber = precinct.sd ? parseInt(precinct.sd, 10) : null;
  const cdNumber = precinct.cd ? parseInt(precinct.cd, 10) : null;

  const [ldPcs, candidates] = await Promise.all([
    ldNumber != null ? fetchPcsForLd(ldNumber) : Promise.resolve([]),
    fetchCandidates(ldNumber, mcNumber, sdNumber, cdNumber),
  ]);
  const precinctPcs = ldPcs.filter((p) => p.precinct_code === code);

  const margin = precinct.d_margin_pct ?? 0;
  const marginLabel = precinct.d_margin_pct != null
    ? `${margin > 0 ? "+" : ""}${margin}%`
    : "—";
  const marginColor = margin >= 0 ? "var(--color-strategy-power-base)" : "#7a5a1f";
  const strategy = precinct.strategy;
  const strategyColor = strategy ? STRATEGY_COLOR_VAR[strategy] : "var(--color-ldp-ink-700)";

  return (
    <HubShell
      eyebrow={`Precinct · ${code}${ldNumber != null ? ` · LD${ldNumber}` : ""}`}
      title={`Precinct ${code}.`}
      maxWidthClass="max-w-4xl"
      actions={
        <Button asChild variant="ldp" size="sm" className="border border-white/20 bg-white/10 hover:bg-white/20">
          <a
            href={`https://26ldp-strategy-map.vercel.app/map.html?precinct=${encodeURIComponent(code)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin aria-hidden="true" className="mr-1 size-3.5" />
            Open on Strategy Map
            <ExternalLink aria-hidden="true" className="ml-1 size-3" />
          </a>
        </Button>
      }
    >
      {/* Back nav */}
      {ldNumber != null && (
        <div className="mb-5">
          <Link
            href={`/my-ld/${ldNumber}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to LD{ldNumber}
          </Link>
        </div>
      )}

      {/* Strategy header */}
      {strategy && (
        <div
          className="mb-6 overflow-hidden rounded-xl border-2 bg-white shadow-sm"
          style={{ borderColor: strategyColor }}
        >
          <div className="h-1.5 w-full" style={{ backgroundColor: strategyColor }} />
          <div className="p-5">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: strategyColor }}
            >
              Strategy · {strategy}
            </div>
            <h2 className="mt-1 text-2xl font-black text-[var(--color-ldp-navy-900)]">
              {STRATEGY_FRIENDLY[strategy]}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
              {STRATEGY_ONELINE[strategy]}
            </p>
          </div>
        </div>
      )}

      {/* Voter counts */}
      <section className="mb-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Voters
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="Total" value={precinct.total_voters?.toLocaleString() ?? "—"} />
          <Stat label="D" value={precinct.dem_total?.toLocaleString() ?? "—"} color="#059669" />
          <Stat label="R" value={precinct.rep_total?.toLocaleString() ?? "—"} color="var(--color-ldp-red)" />
          <Stat label="Ind" value={precinct.ind_total?.toLocaleString() ?? "—"} />
          <Stat label="D margin" value={marginLabel} color={marginColor} />
        </div>
      </section>

      {/* Sleeper dems — the margin that decides November */}
      <section className="mb-6 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Sleeper Dems in this precinct
            </div>
            <div className="mt-1 text-4xl font-black text-[var(--color-ldp-navy-900)]">
              {precinct.dem_gen_not_pri?.toLocaleString() ?? "—"}
            </div>
          </div>
          <p className="max-w-md text-sm text-[var(--color-ldp-ink-700)]">
            Registered Democrats who vote in November but skip primaries. The margin that decides
            close Metro Council races — and the voters most responsive to a personal knock.
          </p>
        </div>
      </section>

      {/* District overlaps */}
      <section className="mb-6 rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 text-sm">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          District overlaps
        </div>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[var(--color-ldp-ink-900)]">
          {ldNumber != null && (
            <span>
              <span className="text-xs text-[var(--color-ldp-ink-700)]">State House:</span>{" "}
              <Link href={`/my-ld/${ldNumber}`} className="font-semibold text-[var(--color-ldp-navy-700)] hover:underline">
                HD{ldNumber}
              </Link>
            </span>
          )}
          {mcNumber != null && (
            <span>
              <span className="text-xs text-[var(--color-ldp-ink-700)]">Metro Council:</span>{" "}
              <span className="font-semibold text-[var(--color-ldp-navy-900)]">MC{mcNumber}</span>
            </span>
          )}
          {sdNumber != null && (
            <span>
              <span className="text-xs text-[var(--color-ldp-ink-700)]">State Senate:</span>{" "}
              <span className="font-semibold text-[var(--color-ldp-navy-900)]">SD{sdNumber}</span>
            </span>
          )}
          {precinct.cd && (
            <span>
              <span className="text-xs text-[var(--color-ldp-ink-700)]">US House:</span>{" "}
              <span className="font-semibold text-[var(--color-ldp-navy-900)]">CD{precinct.cd}</span>
            </span>
          )}
        </div>
      </section>

      {/* Races on the ballot — every office this precinct votes on in the
          2026 primary. Ordered top of ticket to local. */}
      {candidates.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            On your precinct&apos;s 2026 ballot
          </h2>
          <div className="space-y-3">
            {(() => {
              const blocks: React.ReactNode[] = [];

              // U.S. Senate (statewide)
              const usSenate = candidates.filter((c) => c.office_type === "US_SENATE");
              if (usSenate.length > 0) {
                blocks.push(
                  <RaceBlock
                    key="US_SENATE"
                    office="US_SENATE"
                    title="U.S. Senate · Kentucky"
                    candidates={usSenate}
                  />
                );
              }

              // U.S. House (by CD)
              const usHouse = candidates.filter((c) => c.office_type === "US_HOUSE");
              if (usHouse.length > 0) {
                blocks.push(
                  <RaceBlock
                    key="US_HOUSE"
                    office="US_HOUSE"
                    title={`U.S. House District ${usHouse[0].district_number}`}
                    candidates={usHouse}
                  />
                );
              }

              // State Senate (by SD)
              const stSenate = candidates.filter((c) => c.office_type === "STATE_SENATE");
              if (stSenate.length > 0) {
                blocks.push(
                  <RaceBlock
                    key="STATE_SENATE"
                    office="STATE_SENATE"
                    title={`State Senate District ${stSenate[0].district_number}`}
                    candidates={stSenate}
                  />
                );
              }

              // State House (by HD)
              const stHouse = candidates.filter((c) => c.office_type === "STATE_HOUSE");
              if (stHouse.length > 0) {
                blocks.push(
                  <RaceBlock
                    key="STATE_HOUSE"
                    office="STATE_HOUSE"
                    title={`State House District ${stHouse[0].district_number}`}
                    candidates={stHouse}
                  />
                );
              }

              // Mayor (countywide, nonpartisan but runs with the primary)
              const mayor = candidates.filter((c) => c.office_type === "MAYOR");
              if (mayor.length > 0) {
                blocks.push(
                  <RaceBlock
                    key="MAYOR"
                    office="MAYOR"
                    title="Louisville Metro Mayor"
                    candidates={mayor}
                  />
                );
              }

              // Metro Council (by MC)
              const mc = candidates.filter((c) => c.office_type === "METRO_COUNCIL");
              if (mc.length > 0) {
                blocks.push(
                  <RaceBlock
                    key="METRO_COUNCIL"
                    office="METRO_COUNCIL"
                    title={`Metro Council District ${mc[0].district_number}`}
                    candidates={mc}
                  />
                );
              }

              // County offices — group by sub-office parsed from notes.
              const county = candidates.filter((c) => c.office_type === "COUNTY_OFFICE");
              if (county.length > 0) {
                const groups = new Map<string, Candidate[]>();
                for (const c of county) {
                  const key = countySubOffice(c.notes);
                  const bucket = groups.get(key) ?? [];
                  bucket.push(c);
                  groups.set(key, bucket);
                }
                // Ballot order: Judge Exec, County Attorney, County Clerk, Sheriff, PVA, others
                const order = [
                  "Judge Executive",
                  "County Attorney",
                  "County Clerk",
                  "Sheriff",
                  "PVA",
                ];
                const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
                  const ai = order.indexOf(a);
                  const bi = order.indexOf(b);
                  if (ai < 0 && bi < 0) return a.localeCompare(b);
                  if (ai < 0) return 1;
                  if (bi < 0) return -1;
                  return ai - bi;
                });
                for (const subOffice of sortedKeys) {
                  blocks.push(
                    <RaceBlock
                      key={`COUNTY_${subOffice}`}
                      office="COUNTY_OFFICE"
                      title={`Jefferson County ${subOffice}`}
                      candidates={groups.get(subOffice) ?? []}
                    />
                  );
                }
              }

              return blocks;
            })()}
          </div>
        </section>
      )}

      {/* PCs on file */}
      <section className="mb-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Precinct Captains on file
          </h2>
          <span className="text-[10px] text-[var(--color-ldp-ink-700)]">
            {precinctPcs.length} of 3 seats
          </span>
        </div>
        {precinctPcs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-ldp-red)] bg-[#FFF5F6] p-4 text-sm">
            <strong className="text-[var(--color-ldp-red)]">Dark precinct — no PCs on file.</strong>{" "}
            If you know someone who should be a PC in {code}, send their name and contact to{" "}
            <a
              href="mailto:lisatnorkus@gmail.com"
              className="text-[var(--color-ldp-navy-700)] underline"
            >
              lisatnorkus@gmail.com
            </a>
            .
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-ldp-line)] rounded-lg border border-[var(--color-ldp-line)] bg-white">
            {precinctPcs.map((pc) => (
              <li key={pc.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-3 text-sm">
                <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                  {pcDisplayName(pc)}
                </span>
                {pc.role && <PcRolePill role={pc.role} />}
                {pc.email && (
                  <a
                    href={`mailto:${pc.email}`}
                    className="inline-flex items-center gap-1 text-xs text-[var(--color-ldp-navy-700)] hover:underline"
                  >
                    <Mail aria-hidden="true" className="size-3" />
                    {pc.email}
                  </a>
                )}
                {pc.phone && (
                  <a
                    href={`tel:${pc.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-1 text-xs text-[var(--color-ldp-ink-700)] hover:underline"
                  >
                    <Phone aria-hidden="true" className="size-3" />
                    {pc.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </HubShell>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </div>
      <div
        className="mt-1 text-2xl font-bold"
        style={{ color: color ?? "var(--color-ldp-navy-900)" }}
      >
        {value}
      </div>
    </div>
  );
}

function PcRolePill({ role }: { role: "MAN" | "WOMAN" | "YOUTH" }) {
  const styles: Record<typeof role, string> = {
    MAN: "bg-[var(--color-ldp-navy-800)] text-white",
    WOMAN: "bg-[var(--color-ldp-red)] text-white",
    YOUTH: "bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${styles[role]}`}
    >
      {role}
    </span>
  );
}

const OFFICE_ACCENT: Record<string, string> = {
  US_SENATE: "#0E4C9E", // federal navy
  US_HOUSE: "#0E4C9E",
  STATE_SENATE: "var(--color-ldp-navy-700)",
  STATE_HOUSE: "var(--color-ldp-navy-800)",
  MAYOR: "var(--color-ldp-red)",
  METRO_COUNCIL: "#db2777",
  COUNTY_OFFICE: "#b45309",
};

const OFFICE_LABEL: Record<string, string> = {
  US_SENATE: "U.S. Senate",
  US_HOUSE: "U.S. House",
  STATE_SENATE: "State Senate",
  STATE_HOUSE: "State House",
  MAYOR: "Mayor",
  METRO_COUNCIL: "Metro Council",
  COUNTY_OFFICE: "County office",
};

function RaceBlock({
  office,
  title,
  candidates,
}: {
  office: string;
  title: string;
  candidates: Candidate[];
}) {
  const dems = candidates.filter((c) => c.party === "D");
  const others = candidates.filter((c) => c.party !== "D");
  const hasEndorsed = dems.some((d) => d.is_endorsed);
  const accent = OFFICE_ACCENT[office] ?? "var(--color-ldp-navy-700)";
  const officeLabel = OFFICE_LABEL[office] ?? office;
  return (
    <article
      className="overflow-hidden rounded-xl border bg-white shadow-sm"
      style={{ borderColor: hasEndorsed ? "#059669" : accent, borderWidth: hasEndorsed ? 2 : 1 }}
    >
      <div
        className="flex items-center justify-between px-5 py-2 text-white"
        style={{ background: hasEndorsed ? "#059669" : accent }}
      >
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">
            {officeLabel}
          </div>
          <div className="text-sm font-bold tracking-tight">{title}</div>
        </div>
        {hasEndorsed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            <Star aria-hidden="true" className="size-3 fill-emerald-700" /> LDP Endorsed
          </span>
        )}
      </div>
      <div className="p-4">
        {others.length > 0 && (
          <div className="mb-3 text-xs text-[var(--color-ldp-ink-700)]">
            <span className="font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              R side:
            </span>{" "}
            {others
              .map((o) => `${o.full_name}${o.is_incumbent ? " (incumbent)" : ""}`)
              .join(", ")}
          </div>
        )}
        <ul className="space-y-1.5">
          {dems.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span
                className={
                  d.is_endorsed
                    ? "text-base font-bold text-[var(--color-ldp-navy-900)]"
                    : "font-medium text-[var(--color-ldp-navy-900)]"
                }
              >
                {d.full_name}
              </span>
              {d.is_endorsed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  <Star aria-hidden="true" className="size-3 fill-white" /> Endorsed
                </span>
              )}
              {d.is_incumbent && (
                <span className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  Incumbent
                </span>
              )}
              {d.website_url && (
                <a
                  href={d.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[10px] text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                >
                  <Globe aria-hidden="true" className="size-3" />
                  Website
                </a>
              )}
              {d.email && (
                <a
                  href={`mailto:${d.email}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[10px] text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                >
                  <Mail aria-hidden="true" className="size-3" />
                  {d.email}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
