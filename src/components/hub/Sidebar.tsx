"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { NAV_GROUPS } from "./nav-groups";

export function Sidebar({ showAdminItems = false }: { showAdminItems?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile trigger — fixed top-left; hidden on lg+ */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-900)] px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu aria-hidden="true" className="size-4" />
        <span>Menu</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-white/10 bg-[var(--color-ldp-navy-900)] text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Portal sections"
      >
        {/* Brand + mobile close */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/democratic-kicking-donkey.png"
              alt=""
              width={32}
              height={32}
              priority
              className="h-8 w-auto drop-shadow"
            />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-ldp-red-bright)]">
                LDPEC
              </div>
              <div className="text-xs font-semibold tracking-tight text-white">Portal</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded p-1 text-white/70 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        {/* Flag stripe */}
        <div className="mx-4 mb-3 flex h-1 overflow-hidden rounded-full">
          <div className="flex-1 bg-[var(--color-ldp-navy-700)]" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-[var(--color-ldp-red)]" />
        </div>

        <nav className="flex-1 space-y-5 px-2 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.key}>
              {group.label && (
                <div className="mb-1 flex items-center gap-2 px-3">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: group.accent }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: group.accent }}
                  >
                    {group.label}
                  </span>
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items
                  .filter((item) => !item.adminOnly || showAdminItems)
                  .map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const color = item.accent ?? group.accent;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-white/15 text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                        style={
                          active
                            ? { boxShadow: `inset 3px 0 0 ${color}` }
                            : undefined
                        }
                      >
                        <Icon
                          aria-hidden="true"
                          className="size-4 shrink-0"
                          style={active ? { color } : undefined}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: Zoom CTA */}
        <div className="mt-auto border-t border-white/10 p-4">
          <a
            href="https://us02web.zoom.us/j/89692618777"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-ldp-red)]/90"
          >
            Join EC Meeting <ExternalLink aria-hidden="true" className="size-3" />
          </a>
          <p className="mt-2 text-center text-[10px] text-white/40">
            LDP Executive Committee · private tool
          </p>
        </div>
      </aside>
    </>
  );
}
