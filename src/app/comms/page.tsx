import Link from "next/link";
import { ExternalLink, Megaphone, Mail, Camera, FolderOpen, Radio, Share2 } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { SOCIAL_PLATFORMS } from "@/content/social-platforms";
import { SocialIcon } from "@/components/social/SocialIcon";

export const metadata = { title: "Communications Committee" };

export default function CommsPage() {
  return (
    <HubShell
      eyebrow="Communications Committee"
      title="How the party gets heard."
      subtitle="The Communications Committee runs the LDP's voice across owned channels (social, email, Mailchimp), earned media (press), and paid digital (Meta ads, boosted posts, candidate-aligned creative). If a board member, candidate, or LD posts anything with the LDP brand on it, the system Beth designed is what made it possible."
    >
        {/* Built by Beth */}
        <section className="mb-10 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Built by Beth · Infrastructure credit
          </div>
          <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
            The Drive backend that every committee runs on.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            The committee folders, document tree, brand kit, event collateral library, ad assets,
            and form-based intake that every committee uses didn&apos;t appear by accident.{" "}
            <strong>Beth Thorpe (Communications Director)</strong> designed and built the Drive
            structure on the backend of the website so that every committee, LD, and candidate
            can find what they need without asking. Every &ldquo;Open folder →&rdquo; link in this
            tool touches her work.
          </p>
          <div className="mt-4">
            <Link
              href="/drive"
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ldp-navy-900)]"
            >
              <FolderOpen aria-hidden="true" className="size-4" />
              Open the Drive shortcuts →
            </Link>
          </div>
        </section>

        {/* Three asks */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Three asks of the board this year
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <AskCard
              icon={<Share2 aria-hidden="true" className="size-4" />}
              tag="Amplify on social"
              title="One reshare = free reach."
              body="The cheapest amplification we have is the board itself. When 50 board members reshare a post, organic reach 5-10× overnight. This is the easiest unpaid lift you can do for the party — and the one Beth most consistently asks for and most consistently gets ignored on. Fix that this cycle."
            />
            <AskCard
              icon={<Megaphone aria-hidden="true" className="size-4" />}
              tag="Fund the ad program"
              title="$100 = sponsored post. $500 = targeted week."
              body="Paid digital scales when there's fuel. Earmark &ldquo;Ad Fund&rdquo; via ActBlue or tell Beth directly. Separate line from your $120 Club dues and $500 annual raise target."
            />
            <AskCard
              icon={<Mail aria-hidden="true" className="size-4" />}
              tag="Route through intake"
              title="Use the form. Not a 9pm text."
              body="All comms asks — graphics, social posts, ad content, calendar listings, printed materials, volunteer leads — go through the Event Request form. It's one place, it's tracked, and it protects Beth's time."
              cta={{ label: "Event Request form", href: "https://loukydemparty.fillout.com/eventrequest" }}
            />
          </div>
        </section>

        {/* Social channels */}
        <section className="mb-10 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Follow the official channels
          </div>
          <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
            Seven official LDP handles — follow, share, repost.
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {SOCIAL_PLATFORMS.map((p) => (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-xs font-medium text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
                title={`${p.label} · ${p.handle}`}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded bg-[var(--color-ldp-navy-800)] text-white transition-colors group-hover:bg-[var(--color-ldp-red)]">
                  <SocialIcon platform={p.key} className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[var(--color-ldp-navy-900)]">{p.label}</div>
                  <div className="truncate text-[10px] text-[var(--color-ldp-ink-700)]">{p.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* What's in scope */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            What Comms actually runs
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ScopeCard
              icon={<Megaphone aria-hidden="true" className="size-4" />}
              title="Social media"
              body="Facebook, Instagram, Twitter/X, Threads, Bluesky, TikTok, YouTube. Engagement, follower building, rapid response, graphics, video, live streams. Session coverage from Frankfort."
            />
            <ScopeCard
              icon={<Mail aria-hidden="true" className="size-4" />}
              title="Writing + email"
              body="Press releases, mass emails via Campaign Deputy, fundraising copy, volunteer outreach, advocacy messaging. Donor, voter, and GOTV targeting."
            />
            <ScopeCard
              icon={<Radio aria-hidden="true" className="size-4" />}
              title="Paid digital"
              body="Targeted Meta ads, boosted posts, candidate-aligned creative, registration push, GOTV reminders. Fundraised separately so it doesn't compete with HQ rent or canvass printing."
            />
            <ScopeCard
              icon={<Camera aria-hidden="true" className="size-4" />}
              title="Photography"
              body="Shoots for events, fundraisers, and portraits. Maintains the archive of elected-official photos: Governor Beshear, Lt. Gov, state House, state Senate, Metro Council, candidates."
            />
            <ScopeCard
              icon={<FolderOpen aria-hidden="true" className="size-4" />}
              title="Data + digital infrastructure"
              body="Membership lists, Google admin, security, ArcGIS mapping, Campaign Deputy integrations, Zapier automation. Partnering with Robert Kahne + Josh on LD precinct data."
            />
            <ScopeCard
              icon={<Megaphone aria-hidden="true" className="size-4" />}
              title="Website + printed"
              body="louisvilledems.com ongoing. Booklets, invitations, fliers, yard signs. Brand consistency across every committee's externally-facing work."
            />
          </div>
        </section>

        {/* Comms protocol */}
        <section className="mb-10 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Comms protocol — read this
          </div>
          <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
            Don&apos;t text Beth at 9pm.
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-ldp-ink-900)]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 rounded bg-[var(--color-ldp-red)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                Intake
              </span>
              <span>
                Everything routes through the{" "}
                <a
                  href="https://loukydemparty.fillout.com/eventrequest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-ldp-navy-700)] underline"
                >
                  Event Request form
                </a>
                . Social posts, graphics, ad content, calendar listings, printed materials,
                volunteer leads — one form, tracked, assignable.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 rounded bg-[var(--color-ldp-navy-800)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                Press
              </span>
              <span>
                Press inquiries forward to{" "}
                <a
                  href="mailto:communications@louisvilledems.com"
                  className="text-[var(--color-ldp-navy-700)] underline"
                >
                  communications@louisvilledems.com
                </a>
                . Beth drafts a response for officer sign-off; individual board members don&apos;t
                reply directly to press on behalf of the party.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 rounded bg-[var(--color-ldp-navy-800)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                Speed
              </span>
              <span>
                Time-sensitive? Flag it in the form. Beth and team aim for 24-hour turnaround on
                most requests during the primary and general windows.
              </span>
            </li>
          </ul>
        </section>

        {/* What's next */}
        <section className="rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            What&apos;s on Comms&apos; wish list
          </div>
          <ul className="mt-2 space-y-1 text-[var(--color-ldp-ink-900)]">
            <li>• Social media amplifier team (project for people who don&apos;t knock — <em>&ldquo;better than postcards,&rdquo;</em> per Beth)</li>
            <li>• Social media moderators for rapid response during Frankfort session</li>
            <li>• Writers for deep-dive series (running for office, working on campaigns, elected-official interviews, aligned-org profiles)</li>
            <li>• Tool kits on the website: running for office, filing for office, filing with KREF, shareable graphics, voting info, ballot lookup</li>
            <li>• Podcast / TikToks / livestreams — dependent on talent and capacity</li>
            <li>• Discord or Signal channel for internal board comms (&ldquo;folks are not reading emails&rdquo;)</li>
            <li>• Louisville Democratic Party historical archives project</li>
          </ul>
          <p className="mt-3 text-xs italic text-[var(--color-ldp-ink-700)]">
            If you can help with any of the above, email{" "}
            <a href="mailto:communications@louisvilledems.com" className="text-[var(--color-ldp-navy-700)] underline">
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
    <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
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
