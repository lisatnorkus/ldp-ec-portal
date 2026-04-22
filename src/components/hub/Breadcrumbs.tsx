"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { labelForPath } from "./nav-groups";

// Show a clickable crumb trail based on the pathname. The Dashboard
// crumb is always the first link; subsequent segments build from there.

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/dashboard" || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { href: string; label: string }[] = [{ href: "/dashboard", label: "Dashboard" }];

  let accum = "";
  for (const seg of segments) {
    accum += `/${seg}`;
    crumbs.push({ href: accum, label: labelForPath(accum) });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="sticky top-0 z-20 border-b border-[var(--color-ldp-line)] bg-white/90 px-6 py-2 text-xs text-[var(--color-ldp-ink-700)] backdrop-blur"
    >
      <ol className="mx-auto flex max-w-6xl items-center gap-1">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight aria-hidden="true" className="size-3 text-[var(--color-ldp-ink-700)]/60" />}
              {isLast ? (
                <span className="font-semibold text-[var(--color-ldp-navy-900)]">{c.label}</span>
              ) : (
                <Link
                  href={c.href}
                  className="rounded hover:text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
                >
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
