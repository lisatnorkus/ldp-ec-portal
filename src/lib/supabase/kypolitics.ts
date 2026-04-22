// Read-only client for the `kypolitics` Supabase project.
// Source of truth for the 629 Jefferson County precincts + strategy tags.
// The portal does SELECT only against this project.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Accepts either naming convention so a Vercel env var set with
// either name resolves. Reason: the original project used
// NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY (without SUPABASE) while
// the main project uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (with
// SUPABASE). The inconsistency made one easy to mistype when
// configuring Vercel.
function readKypoliticsEnv(): { url: string; key: string } {
  const url =
    process.env.NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_KYPOLITICS_URL ||
    "";
  const key =
    process.env.NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_KYPOLITICS_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_KYPOLITICS_KEY ||
    "";
  if (!url || !key) {
    const missing = [!url && "URL", !key && "KEY"].filter(Boolean).join(" + ");
    throw new Error(
      `kypolitics env vars missing (${missing}). Set NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL and NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY (or the _SUPABASE_PUBLISHABLE_KEY variant) in Vercel.`
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
