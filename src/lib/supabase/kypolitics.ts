// Read-only client for the `kypolitics` Supabase project.
// Source of truth for the 629 Jefferson County precincts + strategy tags.
// The portal does SELECT only against this project.
//
// Auth: this client runs SERVER-SIDE ONLY (getKypoliticsServer is awaited
// from server components / route handlers). It authenticates with the
// kypolitics SERVICE-ROLE / SECRET key, held in a non-NEXT_PUBLIC env var
// so it never ships to the browser. The service key bypasses RLS, which is
// required: jeffco_voter_targeting has RLS enabled with no anon SELECT
// policy, so the old publishable (anon) key was being denied every row —
// the cause of the "couldn't load precinct data" empty states. Keeping the
// key server-only preserves the "kypolitics data is private" firewall: the
// data is never exposed to clients, only proxied through the portal's
// server-rendered pages.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Key resolution prefers the server-only service/secret key. Falls back to
// the legacy publishable names so a misconfigured deploy degrades to the
// (RLS-limited) anon behavior instead of throwing. URL is not secret.
function readKypoliticsEnv(): { url: string; key: string } {
  const url =
    process.env.NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_KYPOLITICS_URL ||
    process.env.KYPOLITICS_SUPABASE_URL ||
    "";
  const key =
    // Server-only service/secret key (preferred — bypasses RLS, never shipped to client).
    process.env.KYPOLITICS_SERVICE_ROLE_KEY ||
    process.env.KYPOLITICS_SECRET_KEY ||
    // Legacy publishable (anon) fallbacks — RLS-limited, kept for safety.
    process.env.NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_KYPOLITICS_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_KYPOLITICS_KEY ||
    "";
  if (!url || !key) {
    const missing = [!url && "URL", !key && "KEY"].filter(Boolean).join(" + ");
    throw new Error(
      `kypolitics env vars missing (${missing}). Set NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL and KYPOLITICS_SERVICE_ROLE_KEY (server-only) in Vercel.`
    );
  }
  return { url, key };
}

export async function getKypoliticsServer() {
  const { url, key } = readKypoliticsEnv();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {
        // This portal never writes kypolitics cookies; noop.
      },
    },
  });
}
