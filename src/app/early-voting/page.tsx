import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Clock, Car, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Early Voting Locations" };

type EvLocation = {
  id: string;
  cycle_year: number;
  election_type: "PRIMARY" | "GENERAL";
  name: string;
  address: string;
  zip: string | null;
  neighborhood: string | null;
  hours_note: string | null;
  date_window: string | null;
  source_url: string | null;
  display_order: number;
};

async function fetchLocations(): Promise<EvLocation[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("early_voting_locations")
    .select("*")
    .eq("active", true)
    .eq("election_type", "PRIMARY")
    .eq("cycle_year", 2026)
    .order("display_order", { ascending: true });
  return (data ?? []) as EvLocation[];
}

async function fetchVoterGuideUrl(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "voter_guide_url")
    .maybeSingle();
  return (data?.value as string | undefined) ?? null;
}

export default async function EarlyVotingPage() {
  const [locations, voterGuideUrl] = await Promise.all([
    fetchLocations(),
    fetchVoterGuideUrl(),
  ]);
  const dateWindow = locations[0]?.date_window ?? "May 14 – 16, 2026";
  const hours = locations[0]?.hours_note ?? "8:00 am – 6:00 pm";

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded text-sm text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Early voting · 2026 Primary
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            24 early voting locations across Jefferson County.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            <strong>Any Jefferson County voter can use any of these 24 locations</strong> during
            the early-voting window — you don&apos;t have to vote at the one in your LD. Share
            the location nearest to each voter&apos;s home or workplace.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <InfoTile icon={<Clock aria-hidden="true" className="size-4" />} label="Dates" value={dateWindow} sub="Thursday – Saturday" />
            <InfoTile icon={<Vote aria-hidden="true" className="size-4" />} label="Hours" value={hours} sub="All 24 sites" />
            <InfoTile icon={<Car aria-hidden="true" className="size-4" />} label="Ride to the polls" value="(502) 582-1999" sub="LDP transportation line" />
          </div>

          {voterGuideUrl && (
            <div className="mt-4">
              <a
                href={voterGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ldp-red)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-red)] focus-visible:ring-offset-2"
              >
                Open the 2026 LDP Voter Guide <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            </div>
          )}
        </div>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            All 24 locations
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => {
              const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;
              return (
                <article
                  key={loc.id}
                  className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4"
                >
                  <div className="flex items-start gap-2">
                    <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-red)]" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                        {loc.name}
                      </div>
                      {loc.neighborhood && (
                        <div className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-[var(--color-ldp-navy-700)]">
                          {loc.neighborhood}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
                        {loc.address}
                      </div>
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
                      >
                        Open in Maps <ExternalLink aria-hidden="true" className="size-3" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Source & freshness
          </div>
          <p className="mt-1 text-[var(--color-ldp-ink-900)]">
            Pulled from the Jefferson County Clerk&apos;s office —{" "}
            <a
              href="https://elections.jeffersoncountyclerk.org/inhouse_absentee/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ldp-navy-700)] underline"
            >
              elections.jeffersoncountyclerk.org/inhouse_absentee
            </a>
            . <strong>General-election locations often change</strong> — we&apos;ll add them here
            once the Clerk publishes the list for October 29 – 31, 2026.
          </p>
        </section>
      </main>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">{value}</div>
      <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>
    </div>
  );
}
