import Image from "next/image";
import { cookies } from "next/headers";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { AccentBar } from "./AccentBar";
import { HelpButton } from "./HelpButton";

// Shared layout for every page BEHIND the passphrase gate except
// landing and tour. Wraps the page in sidebar + breadcrumb + masthead.

export async function HubShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  maxWidthClass = "max-w-6xl",
  accent,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
  // Optional explicit accent color for the masthead bar. When omitted,
  // the AccentBar derives it from the current pathname via nav-groups.
  accent?: string;
}) {
  // Admin-gated nav items (e.g. /volunteers during preview) only render
  // when the viewer holds the admin token cookie set by middleware.
  const cookieStore = await cookies();
  const adminToken = process.env.ADMIN_ACCESS_TOKEN;
  const hasAdminCookie =
    !!adminToken && cookieStore.get("ldp_admin_key")?.value === adminToken;

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar showAdminItems={hasAdminCookie} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Breadcrumbs />
        <HubMasthead
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          actions={actions}
          maxWidthClass={maxWidthClass}
          accent={accent}
        />
        <main className={`mx-auto w-full ${maxWidthClass} flex-1 px-6 py-8`}>{children}</main>
      </div>
      <HelpButton />
    </div>
  );
}

function HubMasthead({
  eyebrow,
  title,
  subtitle,
  actions,
  maxWidthClass,
  accent,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxWidthClass: string;
  accent?: string;
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 hidden opacity-[0.10] md:block md:opacity-[0.12]"
      >
        <Image
          src="/democratic-kicking-donkey.png"
          alt=""
          width={200}
          height={200}
          priority
          className="h-32 w-auto md:h-40"
        />
      </div>

      <div className={`relative mx-auto ${maxWidthClass} px-6 py-8`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-ldp-red-bright)]">
              {eyebrow}
            </div>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.03em] md:text-4xl">{title}</h1>
            {subtitle && (
              <p className="mt-2 max-w-3xl text-sm font-medium text-white/70">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
      <AccentBar accent={accent} />
    </header>
  );
}
