import Link from "next/link";
import { ExternalLink, Megaphone, Mail, Camera, FolderOpen, Radio, Share2 } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/content/social-platforms";
import { SocialIcon } from "@/components/social/SocialIcon";
import { DriveAccessNote } from "@/components/drive/DriveAccessNote";

export const metadata = { title: "Communications Committee" };

// Platform brand colors. Kept in this page (not in the shared data
// file) because the data file is sourced-of-truth for v1 and any
// edit there goes through Beth; these colors are purely presentational.
const PLATFORM_COLOR: Record<SocialPlatform["key"], { bg: string; ring: string }> = {
  facebook: { bg: "#1877F2", ring: "#1877F2" },
  instagram: {
    bg: "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
    ring: "#DD2A7B",
  },
  tiktok: { bg: "#000000", ring: "#25F4EE" },
  twitter: { bg: "#000000", ring: "#1DA1F2" },
  threads: { bg: "#000000", ring: "#0095F6" },
  bluesky: { bg: "#0085FF", ring: "#0085FF" },
  youtube: { bg: "#FF0000", ring: "#FF0000" },
};

export default function CommsPage() {
  return (
    <HubShell
      eyebrow="Communications Committee"
      title="How the party gets heard."
      subtitle="Owned channels (social, email), earned media (press), paid digital. Anything with the LDP brand on it runs through Comms."
    >
      {/* Brand strip — the colors and mark that carry through every
          piece Comms ships. Makes 'this is a brand' visible. */}
      <section className="mb-8 space-y-2">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-3">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded bg-[var(--color-ldp-navy-900)]" aria-label="LDP Navy" />
            <span className="size-8 rounded bg-[var(--color-ldp-red)]" aria-label="LDP Red" />
            <span className="size-8 rounded bg-[var(--color-ldp-gold)]" aria-label="LDP Gold" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-ink-700)]">
              LDP brand
            </span>
            <span className="text-[11px] text-[var(--color-ldp-ink-700)]">
              Navy · Red · Gold. Kicking-donkey mark. Set in Inter.
            </span>
          </div>
          <Link
            href="/drive"
            className="ml-auto inline-flex items-center gap-1 rounded border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] font-medium text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
          >
            <FolderOpen aria-hidden="true" className="size-3" />
            Brand assets in Drive
          </Link>
        </div>
        <DriveAccessNote />
      </section>

      {/* Social hero — the thing every board member actually interacts
          with. Promoted to the top, full-color, large. */}
      <section className="mb-10">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Follow the seven official handles
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            One reshare · 5–10× reach
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SOCIAL_PLATFORMS.map((p) => {
            const color = PLATFORM_COLOR[p.key];
            return (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: color.ring }}
                title={`${p.label} · ${p.handle}`}
              >
                <div
                  className="flex items-center justify-center py-6 text-white"
                  style={{ background: color.bg }}
                >
                  <SocialIcon platform={p.key} className="size-10" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
                      {p.label}
                    </div>
                    <div className="truncate text-[11px] text-[var(--color-ldp-ink-700)]">
                      {p.handle}
                    </div>
                  </div>
                  <ExternalLink
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-[var(--color-ldp-ink-700)] transition-colors group-hover:text-[var(--color-ldp-navy-900)]"
                  />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Three ways to help — kept, it's scannable and action-oriented. */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          Three ways the board can help Comms
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <AskCard
            icon={<Share2 aria-hidden="true" className="size-4" />}
            tag="Amplify on social"
            title="One reshare = free reach."
            body="The cheapest amplification the party has is the board itself. When 50 members reshare a post, organic reach 5–10× overnight."
          />
          <AskCard
            icon={<Megaphone aria-hidden="true" className="size-4" />}
            tag="Fund the ad program"
            title="$100 = sponsored post. $500 = targeted week."
            body="Earmark 'Ad Fund' via ActBlue or flag it through Comms. Separate line from $120 Club dues and the $500 annual raise target."
          />
          <AskCard
            icon={<Mail aria-hidden="true" className="size-4" />}
            tag="Route through intake"
            title="Use the form."
            body="All comms asks — graphics, social posts, calendar listings, printed materials, volunteer leads — go through the Event Request form."
            cta={{ label: "Event Request form", href: "https://loukydemparty.fillout.com/eventrequest" }}
          />
        </div>
      </section>

      {/* What Comms runs — scope cards, already visual, keep. */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          What Comms actually runs
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ScopeCard
            icon={<Megaphone aria-hidden="true" className="size-4" />}
            title="Social media"
            body="All 7 channels. Engagement, graphics, video, rapid response. Session coverage from Frankfort."
          />
          <ScopeCard
            icon={<Mail aria-hidden="true" className="size-4" />}
            title="Writing + email"
            body="Press releases, mass emails (Campaign Deputy), fundraising copy, volunteer outreach."
          />
          <ScopeCard
            icon={<Radio aria-hidden="true" className="size-4" />}
            title="Paid digital"
            body="Targeted Meta ads, boosted posts, candidate-aligned creative. Fundraised separately from HQ ops."
          />
          <ScopeCard
            icon={<Camera aria-hidden="true" className="size-4" />}
            title="Photography"
            body="Events, fundraisers, portraits. Archive of elected officials — Governor, Lt. Gov, state leg, Metro Council."
          />
          <ScopeCard
            icon={<FolderOpen aria-hidden="true" className="size-4" />}
            title="Data + digital"
            body="Membership, Google admin, security, ArcGIS mapping, Campaign Deputy, Zapier. With Robert + Josh on LD data."
          />
          <ScopeCard
            icon={<Megaphone aria-hidden="true" className="size-4" />}
            title="Website + printed"
            body="louisvilledems.com, booklets, invitations, fliers, yard signs. Brand consistency across everything."
          />
        </div>
      </section>

      {/* Working with Comms — compressed to 3 tight blocks. */}
      <section className="mb-10 grid gap-3 md:grid-cols-3">
        <ProtocolCard
          badgeColor="var(--color-ldp-red)"
          label="Intake"
          body={
            <>
              Use the{" "}
              <a
                href="https://loukydemparty.fillout.com/eventrequest"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--color-ldp-navy-700)] underline"
              >
                Event Request form
              </a>
              . One place, tracked, assignable.
            </>
          }
        />
        <ProtocolCard
          badgeColor="var(--color-ldp-navy-800)"
          label="Press"
          body={
            <>
              Forward to{" "}
              <a
                href="mailto:communications@louisvilledems.com"
                className="font-medium text-[var(--color-ldp-navy-700)] underline"
              >
                communications@louisvilledems.com
              </a>
              . Comms drafts; officers sign off.
            </>
          }
        />
        <ProtocolCard
          badgeColor="var(--color-ldp-navy-800)"
          label="Speed"
          body={
            <>
              Time-sensitive? Flag it in the form. 24-hour turnaround target during primary and
              general windows.
            </>
          }
        />
      </section>

      {/* Ideas being discussed — keep, still useful as a list. */}
      <section className="rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Ideas being discussed
          </span>
          <span className="rounded-full bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Draft · pending committee input
          </span>
        </div>
        <ul className="mt-3 grid gap-1.5 text-[var(--color-ldp-ink-900)] md:grid-cols-2">
          <li>• Social media amplifier team (&ldquo;better than postcards&rdquo;)</li>
          <li>• Rapid-response moderators during Frankfort session</li>
          <li>• Deep-dive writers (running, filing, elected-official interviews)</li>
          <li>• Web tool kits: running for office, KREF filing, ballot lookup</li>
          <li>• Podcast / TikToks / livestreams — depends on talent</li>
          <li>• Discord or Signal for internal board comms</li>
          <li>• Louisville Democratic Party historical archives</li>
        </ul>
        <p className="mt-3 text-xs italic text-[var(--color-ldp-ink-700)]">
          Want in? Email{" "}
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

function AskCard({
  icon,
  tag,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
        {icon}
        {tag}
      </div>
      <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
      {cta && (
        <a
          href={cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
        >
          {cta.label} <ExternalLink aria-hidden="true" className="size-3" />
        </a>
      )}
    </article>
  );
}

function ScopeCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        {icon}
        {title}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
    </article>
  );
}

function ProtocolCard({
  badgeColor,
  label,
  body,
}: {
  badgeColor: string;
  label: string;
  body: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4">
      <span
        className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
        style={{ backgroundColor: badgeColor }}
      >
        {label}
      </span>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
    </article>
  );
}
