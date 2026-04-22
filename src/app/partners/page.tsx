import { ExternalLink, Phone, Mail, MapPin } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Partners" };

type OrgCategory =
  | "LABOR"
  | "ADVOCACY"
  | "FAITH"
  | "POLITICAL_TRAINING"
  | "NEWS_MEDIA"
  | "DEMOCRATIC_CLUB";

type Org = {
  id: string;
  name: string;
  category: OrgCategory;
  local_number: string | null;
  affiliation: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website_url: string | null;
  political_active: boolean;
  notes: string | null;
};

const CATEGORY_META: Record<
  OrgCategory,
  { label: string; blurb: string; accent: string }
> = {
  LABOR: {
    label: "Labor · Louisville-area unions",
    blurb:
      "Louisville-based locals plus the KY-level umbrella bodies that endorse and fund in Jefferson County. Labor is LDPEC's biggest and most consistent political partnership.",
    accent: "var(--color-ldp-red)",
  },
  DEMOCRATIC_CLUB: {
    label: "Democratic clubs",
    blurb:
      "Louisville Democratic affinity clubs — grassroots organizing outside the formal LDPEC structure. Good door-in for new volunteers.",
    accent: "var(--color-ldp-navy-900)",
  },
  ADVOCACY: {
    label: "Advocacy organizations",
    blurb:
      "Issue-based groups that share the party's values and are active in Louisville-area electoral and policy work.",
    accent: "var(--color-ldp-navy-800)",
  },
  POLITICAL_TRAINING: {
    label: "Candidate & organizer training",
    blurb:
      "Pipelines that move Democrats from interested to running, and organizers from informal to trained.",
    accent: "var(--color-ldp-navy-700)",
  },
  FAITH: {
    label: "Faith partners",
    blurb: "Progressive faith organizations active in Louisville advocacy.",
    accent: "var(--color-ldp-navy-700)",
  },
  NEWS_MEDIA: {
    label: "News & analysis",
    blurb:
      "Dem-leaning newsrooms that cover Kentucky politics substantively. Share, cite, support.",
    accent: "var(--color-ldp-navy-700)",
  },
};

const CATEGORY_ORDER: OrgCategory[] = [
  "LABOR",
  "DEMOCRATIC_CLUB",
  "ADVOCACY",
  "POLITICAL_TRAINING",
  "FAITH",
  "NEWS_MEDIA",
];

async function fetchPartners(): Promise<Org[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("partner_organizations")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Org[];
}

export default async function PartnersPage() {
  const orgs = await fetchPartners();
  const byCategory: Record<OrgCategory, Org[]> = {
    LABOR: [],
    ADVOCACY: [],
    FAITH: [],
    POLITICAL_TRAINING: [],
    NEWS_MEDIA: [],
    DEMOCRATIC_CLUB: [],
  };
  for (const o of orgs) byCategory[o.category].push(o);

  return (
    <HubShell
      eyebrow="Partners"
      title="Organizations we work with in and around Louisville."
      subtitle="Labor unions, advocacy groups, Democratic clubs, and training pipelines that endorse, fund, or organize alongside the Louisville Democratic Party."
    >
        <p className="mb-8 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
          Contact information here is for official coordination — not for solicitation. If a line
          is missing or wrong, send corrections to{" "}
          <a href="mailto:communications@louisvilledems.com" className="text-[var(--color-ldp-navy-700)] underline">
            communications@louisvilledems.com
          </a>
          .
        </p>

        {CATEGORY_ORDER.map((cat) => {
          const items = byCategory[cat];
          if (items.length === 0) return null;
          const meta = CATEGORY_META[cat];
          return (
            <section key={cat} className="mb-10">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
                    {meta.label}
                  </h2>
                  <p className="mt-0.5 max-w-3xl text-xs text-[var(--color-ldp-ink-700)]">
                    {meta.blurb}
                  </p>
                </div>
                <div className="shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  {items.length}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {items.map((o) => (
                  <article
                    key={o.id}
                    className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4"
                    style={{ borderLeftWidth: 3, borderLeftColor: meta.accent }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                          {o.name}
                        </div>
                        {(o.affiliation || o.city) && (
                          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
                            {[o.affiliation, [o.city, o.state].filter(Boolean).join(", ")]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
                      </div>
                      {o.website_url && (
                        <a
                          href={o.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${o.name} website`}
                          className="shrink-0 rounded p-1 text-[var(--color-ldp-navy-700)] hover:bg-[var(--color-ldp-line)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)]"
                        >
                          <ExternalLink aria-hidden="true" className="size-4" />
                        </a>
                      )}
                    </div>

                    {(o.contact_name || o.contact_phone || o.contact_email || o.address) && (
                      <ul className="mt-3 space-y-1 text-xs text-[var(--color-ldp-ink-900)]">
                        {o.contact_name && (
                          <li className="text-[var(--color-ldp-ink-700)]">
                            <span className="font-medium text-[var(--color-ldp-navy-900)]">
                              Contact:
                            </span>{" "}
                            {o.contact_name}
                          </li>
                        )}
                        {o.contact_phone && (
                          <li className="flex items-center gap-1.5 text-[var(--color-ldp-ink-700)]">
                            <Phone aria-hidden="true" className="size-3 text-[var(--color-ldp-navy-700)]" />
                            <a href={`tel:${o.contact_phone.replace(/\D/g, "")}`} className="hover:underline">
                              {o.contact_phone}
                            </a>
                          </li>
                        )}
                        {o.contact_email && (
                          <li className="flex items-center gap-1.5 text-[var(--color-ldp-ink-700)]">
                            <Mail aria-hidden="true" className="size-3 text-[var(--color-ldp-navy-700)]" />
                            <a
                              href={`mailto:${o.contact_email}`}
                              className="truncate text-[var(--color-ldp-navy-700)] hover:underline"
                            >
                              {o.contact_email}
                            </a>
                          </li>
                        )}
                        {o.address && (
                          <li className="flex items-start gap-1.5 text-[var(--color-ldp-ink-700)]">
                            <MapPin aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-[var(--color-ldp-navy-700)]" />
                            <span>{o.address}</span>
                          </li>
                        )}
                      </ul>
                    )}

                    {o.notes && (
                      <p className="mt-2 border-t border-[var(--color-ldp-line)] pt-2 text-xs italic text-[var(--color-ldp-ink-700)]">
                        {o.notes}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            About this list
          </div>
          <p className="mt-1 text-[var(--color-ldp-ink-900)]">
            Labor entries are sourced from LDP&apos;s Kentucky PACs outreach list and filtered to
            unions that are Louisville-based or endorse/fund in Jefferson County. Advocacy and
            training entries seeded from widely-recognized partners; the list is expected to grow.
            Corrections or additions:{" "}
            <a
              href="mailto:communications@louisvilledems.com"
              className="text-[var(--color-ldp-navy-700)] underline"
            >
              communications@louisvilledems.com
            </a>
            .
          </p>
        </section>
    </HubShell>
  );
}
