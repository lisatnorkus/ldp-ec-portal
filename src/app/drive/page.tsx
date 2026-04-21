import Link from "next/link";
import { ArrowLeft, ExternalLink, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCommittees } from "@/lib/db/members";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function fetchDriveSettings() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("settings")
    .select("key, value, description")
    .in("key", ["event_intake_url", "volunteer_signup_url", "proxy_form_url", "public_calendar_url", "strategy_map_url"]);
  return (data ?? []) as Array<{ key: string; value: string; description: string }>;
}

export default async function DrivePage() {
  const [committees, settings] = await Promise.all([fetchCommittees(), fetchDriveSettings()]);

  const withFolders = committees.filter((c) => c.drive_folder_url);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">Drive shortcuts</h1>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
            Every committee&apos;s working folder plus the party&apos;s top-traffic forms.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Committee folders · {withFolders.length}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {withFolders.map((c) => (
              <a
                key={c.code}
                href={c.drive_folder_url!}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-3 rounded-lg border bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)] ${
                  c.type === "AD_HOC" ? "border-[var(--color-ldp-gold)]" : "border-[var(--color-ldp-line)]"
                }`}
              >
                <Folder className="mt-0.5 size-5 shrink-0 text-[var(--color-ldp-navy-800)]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">{c.name}</div>
                    {c.type === "AD_HOC" && (
                      <span className="rounded-full bg-[var(--color-ldp-gold)] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
                        Ad hoc
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">Open committee folder →</div>
                </div>
                <ExternalLink className="size-4 shrink-0 text-[var(--color-ldp-navy-700)]" />
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Forms &amp; public surfaces
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {settings.map((s) => (
              <a
                key={s.key}
                href={s.value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)]"
              >
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-navy-700)]" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                    {friendlyLabel(s.key)}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">{s.description}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function friendlyLabel(key: string): string {
  const map: Record<string, string> = {
    event_intake_url: "Event Request form",
    volunteer_signup_url: "Volunteer sign-up form",
    proxy_form_url: "LDPEC meeting proxy form",
    public_calendar_url: "Public party calendar",
    strategy_map_url: "2026 LDP Strategy Map",
  };
  return map[key] ?? key;
}
