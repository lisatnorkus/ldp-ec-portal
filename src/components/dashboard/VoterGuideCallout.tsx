import { ExternalLink, Vote, Clock, Car, Share2 } from "lucide-react";

// Primary-cycle callout. Switch the body copy post-May 19 2026 to
// reflect General Election materials, or delete this component when
// the general guide lands and build a new one.

const PRIMARY_DATE_LABEL = "Tuesday, May 19, 2026";
const EARLY_VOTING_LABEL = "May 14 – 16 (Thu – Sat), 8am – 6pm";
const EXCUSED_ABSENTEE_LABEL = "May 6 – 8 and May 11 – 13";
const RIDE_PHONE = "(502) 582-1999";

export function VoterGuideCallout({ url }: { url: string }) {
  const shareText = encodeURIComponent(
    "The 2026 Louisville Democratic Party Voter Guide is live — ballot tool, endorsements, polling locations, and free rides to the polls. Share with every Democrat you know."
  );
  const encodedUrl = encodeURIComponent(url);
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twShare = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;

  return (
    <section className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-red)] bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-[var(--color-ldp-red)] px-5 py-2">
        <span className="flex size-2 animate-pulse rounded-full bg-white" />
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Live now · Primary is {PRIMARY_DATE_LABEL.split(", ")[1]}
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Vote aria-hidden="true" className="size-5 text-[var(--color-ldp-navy-800)]" />
              <h2 className="text-lg font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
                The 2026 Louisville Democratic Voter Guide is live.
              </h2>
            </div>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Personalized ballot tool, LDP endorsements, polling-location finder, early-voting
              times, mail-in ballot request, voter-registration links, and free rides to the polls.
              Every Democrat in Jefferson County needs to see this — <strong>share it.</strong>
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CalloutFact
                icon={<Vote aria-hidden="true" className="size-4" />}
                label="Primary Election Day"
                value={PRIMARY_DATE_LABEL}
                sub="6am – 6pm"
              />
              <CalloutFact
                icon={<Clock aria-hidden="true" className="size-4" />}
                label="Early voting"
                value={EARLY_VOTING_LABEL}
                sub="24 locations"
              />
              <CalloutFact
                icon={<Car aria-hidden="true" className="size-4" />}
                label="Need a ride?"
                value={RIDE_PHONE}
                sub="LDP transportation line"
              />
            </div>

            <div className="mt-2 text-[11px] text-[var(--color-ldp-ink-700)]">
              Excused absentee voting: {EXCUSED_ABSENTEE_LABEL}. Mail-in ballot requests opened
              April 4.
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-ldp-line)] pt-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ldp-red)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-red)] focus-visible:ring-offset-2"
          >
            Open the voter guide
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
          <a
            href={fbShare}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[var(--color-ldp-navy-900)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <Share2 aria-hidden="true" className="size-4" />
            Share to Facebook
          </a>
          <a
            href={twShare}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[var(--color-ldp-navy-900)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <Share2 aria-hidden="true" className="size-4" />
            Share on X
          </a>
        </div>
      </div>
    </section>
  );
}

function CalloutFact({
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
    <div className="rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">{value}</div>
      <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>
    </div>
  );
}
