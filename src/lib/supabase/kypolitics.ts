// Read-only client for the `kypolitics` Supabase project.
// Source of truth for the 629 Jefferson County precincts + strategy tags.
// The portal does SELECT only against this project.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getKypoliticsServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_KYPOLITICS_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_KYPOLITICS_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          // This portal never writes kypolitics cookies; noop.
        },
      },
    }
  );
}
