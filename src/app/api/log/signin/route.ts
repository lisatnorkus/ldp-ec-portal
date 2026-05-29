import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// AuthGate fires this on a successful unlock. Phase 1: user_id is
// always null because the passphrase doesn't identify the person.
// Phase 2 (OAuth) will pass user_id resolved from the session.

function truncateIp(ip: string | null): string | null {
  if (!ip) return null;
  const first = ip.split(",")[0].trim();
  if (first.includes(":")) {
    // IPv6 — keep first 3 hextets (~/48)
    const parts = first.split(":");
    return parts.slice(0, 3).join(":") + "::/48";
  }
  // IPv4 — keep first 3 octets (/24)
  const parts = first.split(".");
  if (parts.length !== 4) return null;
  return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
}

function hashUa(ua: string | null): string | null {
  if (!ua) return null;
  // Hash, then keep first 12 chars. Lets us count distinct devices
  // without storing the user-agent string itself.
  return createHash("sha256").update(ua).digest("hex").slice(0, 12);
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
    const ua = req.headers.get("user-agent");

    const { error } = await supabase.from("auth_events").insert({
      user_id: null,                      // Phase 1: anonymous
      event_type: "signin",
      user_agent_hash: hashUa(ua),
      ip_truncated: truncateIp(ip),
    });

    if (error) {
      console.error("[log/signin] insert failed", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[log/signin] handler threw", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
