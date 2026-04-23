import Link from "next/link";
import { SECTION_NAV } from "@/lib/nav/sections";

export function SectionNav() {
  return (
    <nav aria-label="Portal sections" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {SECTION_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.slug}
            href={item.href}
            className="group relative overflow-hidden rounded-xl border border-[var(--color-ldp-line)] bg-white p-4 transition-all motion-safe:hover:-translate-y-0.5 hover:border-transparent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              // Focus ring color matches the section's accent
              // @ts-expect-error — CSS custom property, fine at runtime
              "--tw-ring-color": item.accent,
            }}
          >
            {/* Top accent stripe */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: item.accent }}
            />

            {/* Faint background glyph echoing the accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 -bottom-3 opacity-[0.06] transition-opacity group-hover:opacity-[0.12]"
              style={{ color: item.accent }}
            >
              <Icon className="size-20" strokeWidth={1.5} />
            </div>

            <div className="relative">
              <div
                className="flex size-9 items-center justify-center rounded-lg shadow-sm"
                style={{ backgroundColor: item.accent }}
              >
                <Icon className="size-5 text-white" aria-hidden="true" />
              </div>
              <div className="mt-3 text-sm font-bold tracking-tight text-[var(--color-ldp-ink-900)]">
                {item.label}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-ldp-ink-700)]">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
