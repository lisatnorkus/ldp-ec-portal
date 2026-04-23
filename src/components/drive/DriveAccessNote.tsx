import { AlertTriangle, ExternalLink, Info } from "lucide-react";

// Drive links in this portal point into the Louisville Dems Google
// Workspace, which requires the viewer to be signed into their
// board-invited Google account FIRST. If the user hits a Drive link
// while signed into a personal-gmail tab, Google shows a "You need
// permission" wall — this used to confuse every reviewer. V1 solved
// it with a 3-step banner on the Drive page; we restore that here
// and add a compact inline variant for every other page that surfaces
// a Drive link.

export function DriveAccessBanner() {
  return (
    <section className="mb-8 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-red)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-red) 0%, var(--color-ldp-gold) 50%, var(--color-ldp-navy-700) 100%)",
        }}
      />
      <div className="p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
          <AlertTriangle aria-hidden="true" className="size-4" />
          Before you click any Drive link
        </div>
        <h2 className="mt-1 text-xl font-bold text-[var(--color-ldp-navy-900)]">
          Sign into your LDP Google account first.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
          Every document the portal links to lives in the LDP Google Drive and requires
          board-member access. If you click a link and see &ldquo;You need permission&rdquo; or
          &ldquo;Sign in required,&rdquo; you&apos;re not in the right Google account. Three steps
          before you click anything:
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Step
            n={1}
            title="Go to google.com and sign in"
            body={
              <>
                <strong>LD Chairs, VCs, At-Large members:</strong> use the personal Gmail LDP
                invited you with — LDs do not receive @louisvilledems.com addresses.{" "}
                <strong>County officers</strong> (Chair, Vice Chair, Secretary, Treasurer): use
                your @louisvilledems.com account. If you have multiple Google accounts, the
                LDP-approved one needs to be signed in FIRST, or you&apos;ll hit permission walls.
              </>
            }
          />
          <Step
            n={2}
            title="Confirm it's the right account"
            body={
              <>
                Open{" "}
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-ldp-navy-700)] underline"
                >
                  drive.google.com
                </a>
                . The profile photo top-right is your active account. Switch if needed.
              </>
            }
          />
          <Step
            n={3}
            title="Click any link on this page"
            body={
              <>
                Everything should open without permission prompts. If you still see &ldquo;Request
                access,&rdquo; email{" "}
                <a
                  href="mailto:communications@louisvilledems.com"
                  className="text-[var(--color-ldp-navy-700)] underline"
                >
                  communications@louisvilledems.com
                </a>{" "}
                — they own Drive access requests.
              </>
            }
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-3 py-1.5 font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-800)] hover:text-white"
          >
            Check my Google account
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
          <a
            href="https://accounts.google.com/AccountChooser"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 font-semibold text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
          >
            Switch Google account
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Compact one-liner for any page that surfaces a Drive link outside
// of /drive itself. Sits above or below the link block so the context
// travels with the link.
export function DriveAccessNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-md border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-[11px] text-[var(--color-ldp-ink-700)] ${className}`}
    >
      <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ldp-navy-700)]" />
      <span>
        Drive folders require being signed into your LDP-invited Google account first. If you see
        a &ldquo;permission&rdquo; wall, switch accounts via{" "}
        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-ldp-navy-700)] underline"
        >
          drive.google.com
        </a>{" "}
        and click again.
      </span>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-[11px] font-bold text-white">
          {n}
        </span>
        <h4 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{title}</h4>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
    </div>
  );
}
