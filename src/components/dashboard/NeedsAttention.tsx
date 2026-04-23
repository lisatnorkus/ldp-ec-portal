import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { NeedsAttentionItem } from "@/lib/db/dashboard-health";

const URGENCY_COLOR: Record<NeedsAttentionItem["urgency"], string> = {
  high: "var(--color-ldp-red)",
  medium: "#F59E0B",
  low: "#94a3b8",
};

export function NeedsAttention({ items }: { items: NeedsAttentionItem[] }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle aria-hidden="true" className="size-4 text-[var(--color-ldp-red)]" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
          Needs attention
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="size-5 text-emerald-700" />
            <div className="text-sm font-bold text-emerald-900">
              Nothing urgent today.
            </div>
          </div>
          <p className="mt-1 text-xs text-emerald-800">
            Captain coverage is holding, the roster is tended, no seats are open, nobody&apos;s
            gone quiet. Rare state — enjoy it.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const color = URGENCY_COLOR[item.urgency];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-4 rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ borderLeftWidth: 4, borderLeftColor: color }}
                >
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl font-black text-white"
                    style={{ backgroundColor: color }}
                  >
                    {item.count}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
                      {item.detail}
                    </div>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[var(--color-ldp-ink-700)] transition-colors group-hover:text-[var(--color-ldp-navy-900)]"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
