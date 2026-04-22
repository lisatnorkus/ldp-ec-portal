import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Reusable navy masthead for interior pages — matches the dashboard pilot.
// Replaces the plain white <header> block that was on every page so the
// whole portal reads as one product, not a stack of screens.

export function PageMasthead({
  eyebrow,
  title,
  subtitle,
  backHref = "/dashboard",
  backLabel = "Dashboard",
  rightNav,
  maxWidthClass = "max-w-6xl",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backHref?: string | null;
  backLabel?: string;
  rightNav?: React.ReactNode;
  maxWidthClass?: string;
}) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-[var(--color-ldp-navy-900)] via-[var(--color-ldp-navy-800)] to-[var(--color-ldp-navy-900)] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 14px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(96,165,250,0.35), transparent 45%), radial-gradient(circle at 85% 85%, rgba(200,16,46,0.22), transparent 50%)",
        }}
      />

      {/* Kicking donkey watermark — right side, hidden on mobile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 hidden opacity-[0.10] md:block md:opacity-[0.12] lg:right-16 lg:top-2 lg:opacity-[0.14]"
      >
        <Image
          src="/democratic-kicking-donkey.png"
          alt=""
          width={240}
          height={240}
          priority
          className="h-36 w-auto md:h-44 lg:h-56"
        />
      </div>

      {/* Top strip: back link + flag stripe eyebrow + right-nav */}
      <div className={`relative mx-auto flex ${maxWidthClass} items-center justify-between gap-4 px-6 pt-5 pb-3`}>
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" /> {backLabel}
            </Link>
          )}
          <div className="flex h-1 w-10 overflow-hidden rounded-full">
            <div className="flex-1 bg-[var(--color-ldp-navy-700)]" />
            <div className="flex-1 bg-white/80" />
            <div className="flex-1 bg-[var(--color-ldp-red)]" />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-ldp-red-bright)]">
            LDPEC Portal
          </div>
        </div>

        <nav className="flex items-center gap-4 text-xs">
          {rightNav ?? (
            <Button asChild variant="ldp" size="sm" className="border border-white/20 bg-white/10 hover:bg-white/20">
              <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
                Join EC Meeting
              </a>
            </Button>
          )}
        </nav>
      </div>

      {/* Hero */}
      <div className={`relative mx-auto ${maxWidthClass} px-6 pt-6 pb-10`}>
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red-bright)]">
          {eyebrow}
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-[-0.03em] md:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-3xl text-sm font-medium text-white/70">{subtitle}</p>
        )}
      </div>

      {/* Red accent bar */}
      <div className="relative h-1.5 w-full bg-[var(--color-ldp-red)]" />
    </header>
  );
}
