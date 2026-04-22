import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubShell } from "@/components/hub/HubShell";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fetchPrecinctsForMcPriority, countByStrategy } from "@/lib/db/precincts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Canvass Tools" };

type McPriority = {
  mc_number: number;
  tier: "HIGHEST" | "HIGH" | "NOVEMBER" | "STANDARD";
  voter_count: number | null;
  sleeper_dems: number | null;
  independents: number | null;
  strategy_summary_md: string | null;
};

type Candidate = {
  id: string;
  office_type: string;
  district_number: number;
  full_name: string;
  party: string;
  is_incumbent: boolean;
  is_endorsed: boolean;
  notes: string | null;
};

async function fetchCanvassData() {
  const supabase = await getSupabaseServer();
  const [mcs, candidates, volunteerCard, settings] = await Promise.all([
    supabase.from("metro_races_priority").select("*").order("tier").order("mc_number"),
    supabase
      .from("candidates")
      .select("*")
      .eq("office_type", "METRO_COUNCIL")
      .eq("is_endorsed", true)
      .eq("cycle_year", 2026),
    supabase.from("content_cards").select("*").eq("slug", "volunteer-pipeline").maybeSingle(),
    supabase.from("settings").select("key, value").in("key", ["volunteer_signup_url", "event_intake_url"]),
  ]);
  return {
    mcs: (mcs.data ?? []) as McPriority[],
    endorsedMc: (candidates.data ?? []) as Candidate[],
    volunteerCard: volunteerCard.data as { title: string; body_md: string } | null,
    settings: new Map((settings.data ?? []).map((s: { key: string; value: string }) => [s.key, s.value])),
  };
}

export default async function CanvassToolsPage() {
  const data = await fetchCanvassData();
  const mcsWithPrecincts = await Promise.all(
    data.mcs.map(async (mc) => ({
      mc,
      precincts: await fetchPrecinctsForMcPriority(mc.mc_number),
    }))
  );
  const endorsedByMc = new Map<number, Candidate>();
  for (const c of data.endorsedMc) endorsedByMc.set(c.district_number, c);

  return (
    <HubShell
      eyebrow="Canvass Tools"
      title="Priority districts, volunteer flow, and the guides you need."
      subtitle="Where countywide volunteer hours move the most votes: Metro Council 17, 21, and 7. If your LD overlaps any of these, coordinate with the LDP chair before cutting turf."
    >
        {/* Priority MC districts */}
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Priority Metro Council districts
          </h2>
          <div className="space-y-4">
            {mcsWithPrecincts.map(({ mc, precincts }) => {
              const counts = countByStrategy(precincts);
              const endorsed = endorsedByMc.get(mc.mc_number);
              return (
                <article
                  key={mc.mc_number}
                  className={`rounded-xl border-2 bg-white p-5 ${
                    mc.tier === "HIGHEST"
                      ? "border-[var(--color-ldp-red)]"
                      : "border-[var(--color-ldp-navy-800)]"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xl font-bold text-[var(--color-ldp-navy-900)]">
                      MC {mc.mc_number}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white ${
                        mc.tier === "HIGHEST"
                          ? "bg-[var(--color-ldp-red)]"
                          : "bg-[var(--color-ldp-navy-800)]"
                      }`}
                    >
                      {mc.tier}
                    </span>
                    {endorsed && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-navy-900)]">
                        <span className="rounded-full bg-[var(--color-ldp-gold)] px-1.5 py-0.5 text-[9px] font-bold uppercase">
                          LDP
                        </span>
                        {endorsed.full_name}
                        {endorsed.is_incumbent && <span className="font-normal text-[var(--color-ldp-ink-700)]">· incumbent</span>}
                      </span>
                    )}
                  </div>

                  {mc.strategy_summary_md && (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
                      {mc.strategy_summary_md.replace(/\*\*/g, "")}
                    </p>
                  )}

                  {precincts.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
                      <Stat label="Precincts" value={counts.total} />
                      <Stat label="Hold the Line" value={counts.DEFEND} color="var(--color-strategy-hold-the-line)" />
                      <Stat label="Power Base" value={counts.PRIMARY} color="var(--color-strategy-power-base)" />
                      <Stat label="Wake the Vote" value={counts.ACTIVATE} color="var(--color-strategy-wake-the-vote)" />
                      <Stat label="Sleeper Dems" value={counts.sleeper_dems.toLocaleString()} emphasis />
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="ldp" size="sm">
                      <a
                        href={`https://26ldp-strategy-map.vercel.app/?mc=${mc.mc_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="mr-1 size-3.5" /> Open MC{mc.mc_number} on Strategy Map
                      </a>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Volunteer pipeline */}
        {data.volunteerCard && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Volunteer pipeline
            </h2>
            <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
              <h3 className="text-base font-semibold text-[var(--color-ldp-navy-900)]">
                {data.volunteerCard.title}
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
                {data.volunteerCard.body_md}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.settings.get("volunteer_signup_url") && (
                  <Button asChild variant="ldpGold" size="sm">
                    <a
                      href={data.settings.get("volunteer_signup_url")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Public volunteer sign-up form <ExternalLink className="ml-1 size-3.5" />
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://www.mobilize.us/louisvilledemocrats/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LDP on Mobilize <ExternalLink className="ml-1 size-3.5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://www.facebook.com/groups/LouisvilleDemsVolunteers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Volunteers Facebook group <ExternalLink className="ml-1 size-3.5" />
                  </a>
                </Button>
              </div>
              <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
                Mobilize is where every public LDP volunteer event lives. The Facebook group is the
                primary intake community for new volunteers.
              </p>
            </div>
          </section>
        )}

        {/* Guides */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Guides &amp; tools
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <GuideCard
              title="LDP Canvassing Guide"
              howto="One-pager every canvasser gets in their packet."
              href="https://drive.google.com/file/d/1tId_OBvdwa5TGME7LMIX26idTZ8iG_Dj/view"
            />
            <GuideCard
              title="LD Chair VoteBuilder Guide"
              howto="Core curriculum for new LD chairs on VoteBuilder basics."
              href="https://drive.google.com/file/d/1rjSsSO8b84-Gw3BhPW1A_diMNGTgY5Xo/view"
            />
            <GuideCard
              title="VoteBuilder"
              howto="If you're a PC, you're already admin. Log in to pull cuts anytime."
              href="https://votebuilder.com"
            />
            <GuideCard
              title="Training Committee Drive"
              howto="All training materials; Cassie Blausey (Chair) adds to this folder."
              href="https://drive.google.com/drive/folders/1o60CbottUKlNJL0qTOyPpxTApXOqK9ss"
            />
            <GuideCard
              title="Quarterly LD Chair Report template"
              howto="Template every LD files quarterly — meetings held, contacts made, asks."
              href="https://docs.google.com/document/d/1pKAYHlayn90PAZHZtvsKA2YgP_l0NtpC/edit"
            />
            <GuideCard
              title="2026 LDP Election Year Plan"
              howto="The year-by-year strategy tying DNC + KDP priorities to LDP execution."
              href="https://drive.google.com/drive/folders/1wNc9Ea5K-xIvuWPftgSQiqMqYiB5gscx"
            />
          </div>
        </section>
    </HubShell>
  );
}

function Stat({
  label,
  value,
  color,
  emphasis = false,
}: {
  label: string;
  value: number | string;
  color?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-lg bg-[#FAFAFA] p-2">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-ldp-ink-700)]">{label}</div>
      <div
        className={`text-base font-bold ${emphasis ? "text-[var(--color-ldp-red)]" : "text-[var(--color-ldp-navy-900)]"}`}
        style={color ? { color } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function GuideCard({
  title,
  howto,
  href,
}: {
  title: string;
  howto: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">{title}</div>
          <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">{howto}</p>
        </div>
        <ExternalLink className="size-4 shrink-0 text-[var(--color-ldp-navy-700)]" />
      </div>
    </a>
  );
}
