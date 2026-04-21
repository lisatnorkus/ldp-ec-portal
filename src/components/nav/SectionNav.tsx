import Link from "next/link";
import { SECTION_NAV } from "@/lib/nav/sections";

export function SectionNav() {
  return (
    <nav aria-label="Portal sections" className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {SECTION_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.slug}
            href={item.href}
            className="group flex flex-col gap-2 rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)] hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-5 text-[var(--color-ldp-navy-800)]" />
              <div className="text-sm font-semibold text-[var(--color-ldp-ink-900)]">
                {item.label}
              </div>
            </div>
            <p className="text-xs text-[var(--color-ldp-ink-700)]">{item.description}</p>
          </Link>
        );
      })}
    </nav>
  );
}
