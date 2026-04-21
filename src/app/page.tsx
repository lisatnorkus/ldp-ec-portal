import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-ldp-navy-900)] text-white">
      {/* Decorative radial glow + subtle diagonal grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(96,165,250,0.25), transparent 55%), radial-gradient(circle at 80% 85%, rgba(200,16,46,0.18), transparent 55%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 14px)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
        {/* Top bar — eyebrow + meta */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-ldp-red-bright)]">
            Louisville Democratic Party
          </div>
          <div className="hidden text-[11px] font-semibold uppercase tracking-widest text-white/50 md:block">
            Executive Committee Portal · v2
          </div>
        </div>

        {/* Flag stripe motif */}
        <div className="mt-4 flex h-1 w-24 overflow-hidden rounded-full">
          <div className="flex-1 bg-[var(--color-ldp-navy-700)]" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-[var(--color-ldp-red)]" />
        </div>

        {/* Hero block */}
        <div className="mt-auto max-w-3xl pt-16">
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.035em] md:text-7xl">
            The committee&apos;s
            <br />
            <span className="bg-gradient-to-r from-[var(--color-ldp-gold)] to-white bg-clip-text text-transparent">
              internal playbook.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Concrete infrastructure for the 56+ members of the LDPEC. Your role, your district,
            what&apos;s live this month, and the 2028 reorg ahead — all in one place.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="group bg-[var(--color-ldp-red)] text-white hover:bg-[var(--color-ldp-red)]/90"
            >
              <Link href="/tour/1">
                Start the tour
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Link
              href="/dashboard"
              className="group text-base font-semibold text-white/80 transition-colors hover:text-white"
            >
              Skip to dashboard{" "}
              <span className="inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Priority tiles */}
        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PriorityTile href="/tour/2" kicker="Priority 1" label="Your role" blurb="What the seat requires" />
          <PriorityTile href="/my-ld" kicker="Priority 2" label="Your district" blurb="Targeting applied locally" />
          <PriorityTile href="/this-month" kicker="Priority 3" label="This month" blurb="What&rsquo;s live right now" />
          <PriorityTile href="/tour/4" kicker="Priority 4" label="Meetings" blurb="Proxy, quorum, endorsements" />
        </div>

        {/* Fact strip */}
        <div className="mt-16 grid grid-cols-3 gap-0 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <Stat n="56" label="Committee members" />
          <Stat n="18" label="Legislative districts" divider />
          <Stat n="629" label="Jefferson County precincts" divider />
        </div>

        <div className="mt-10 text-xs text-white/40">
          Private to Louisville Democratic Party Executive Committee members · passphrase-gated
          · no public index.
        </div>
      </div>
    </main>
  );
}

function PriorityTile({
  href,
  kicker,
  label,
  blurb,
}: {
  href: string;
  kicker: string;
  label: string;
  blurb: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-ldp-gold)] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
        {kicker}
      </div>
      <div className="mt-1 text-lg font-bold tracking-tight text-white">{label}</div>
      <div className="mt-1 text-xs text-white/65">{blurb}</div>
      <ArrowRight
        aria-hidden="true"
        className="absolute right-4 top-5 size-4 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-ldp-gold)]"
      />
    </Link>
  );
}

function Stat({ n, label, divider = false }: { n: string; label: string; divider?: boolean }) {
  return (
    <div className={`px-3 text-center ${divider ? "border-l border-white/10" : ""}`}>
      <div className="text-3xl font-black tracking-tight text-white md:text-4xl">{n}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        {label}
      </div>
    </div>
  );
}
