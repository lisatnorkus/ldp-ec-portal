import { themeFor } from "./month-themes";
import { MarkdownBody } from "@/lib/markdown";

// Split markdown-body month content into a lede (the **bolded
// headline** that each card leads with) and the remaining prose.
// Seeded cards all follow this shape: "**Month — Theme.** Rest." so
// we can split on the first "** ... **" block.
function splitLede(md: string): { lede: string | null; body: string } {
  const m = md.match(/^\s*\*\*(.+?)\*\*\s*/);
  if (!m) return { lede: null, body: md };
  return {
    lede: m[1].trim(),
    body: md.slice(m[0].length).trim(),
  };
}

export function MonthHero({
  monthName,
  year,
  themeTag,
  contentMd,
}: {
  monthName: string;
  year: number;
  themeTag: string | null;
  contentMd: string;
}) {
  const theme = themeFor(themeTag);
  const { Icon, accent, accentBg, gradientTo, label, subtitle } = theme;
  const { lede, body } = splitLede(contentMd);

  return (
    <article className="mb-8 overflow-hidden rounded-xl border-2 bg-white shadow-sm" style={{ borderColor: accent }}>
      {/* Hero band — big month name, theme chip, icon, subtitle. */}
      <div
        className="relative px-6 py-7 text-white"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${gradientTo} 100%)`,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 14px)",
          }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              {label}
            </div>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.03em] md:text-5xl">
              {monthName}{" "}
              <span className="font-medium text-white/70">{year}</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm font-medium text-white/85">{subtitle}</p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <Icon aria-hidden="true" className="size-8" />
            </div>
          </div>
        </div>
      </div>

      {/* "The one thing" callout — pulled from the bold lede. */}
      {lede && (
        <div
          className="border-b px-6 py-4"
          style={{ borderColor: accent, backgroundColor: accentBg }}
        >
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            The one thing
          </div>
          <p
            className="mt-1 text-base font-bold leading-snug"
            style={{ color: accent }}
          >
            {lede}
          </p>
        </div>
      )}

      {/* Body — the rest of the markdown. Cleaner typography than the
          dense paragraph it used to be. */}
      {body && (
        <div className="px-6 py-5">
          <MarkdownBody
            text={body}
            className="space-y-3 text-[15px] leading-relaxed text-[var(--color-ldp-ink-900)]"
            paragraphClass=""
            listClass="ml-5 list-disc space-y-1.5 text-sm text-[var(--color-ldp-ink-900)] marker:text-[var(--color-ldp-navy-700)]"
          />
        </div>
      )}
    </article>
  );
}
