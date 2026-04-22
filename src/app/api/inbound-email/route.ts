import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// Inbound email webhook. Provider-agnostic — accepts a normalized
// JSON payload and routes the message to the portal. Supported kinds,
// determined by subject prefix:
//
//   #task <title>      → create an LD task assigned to the sender
//   #contact <name>    → create a prospect (first word = first name,
//                        rest = last name; body = notes)
//   (no prefix)        → create a note in the sender's LD
//
// Security: sender email must match an ec_members.email row. A shared
// secret in the `x-inbound-secret` header (or ?secret= query param)
// gates who can POST. Both are required: the webhook rejects spoofed
// requests that don't carry the secret AND requests from unknown
// senders.
//
// Configure INBOUND_EMAIL_SECRET in Vercel; your email provider
// (Resend, Postmark, Cloudflare, SendGrid, etc.) passes it along when
// calling this endpoint.

export const dynamic = "force-dynamic";

type ProviderPayload = {
  // Normalized shape — providers each have their own format; the
  // caller is expected to map theirs onto these fields. Most common
  // fields named permissively so several naming conventions work.
  from?: string | { email?: string; address?: string };
  sender?: string;
  to?: string | { email?: string };
  subject?: string;
  text?: string;
  plain?: string;
  body?: string;
  html?: string;
};

function extractEmail(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    // Handles "Name <addr@x.com>" and plain "addr@x.com"
    const m = raw.match(/<?([^\s<>@]+@[^\s<>@]+)>?/);
    return m ? m[1].toLowerCase() : null;
  }
  if (typeof raw === "object") {
    const o = raw as { email?: string; address?: string };
    const v = o.email ?? o.address;
    return v ? v.toLowerCase() : null;
  }
  return null;
}

function stripReplyQuotes(text: string): string {
  // Cheap heuristic: drop everything from the first "On [date], X wrote:"
  // marker or "-----Original Message-----" divider on. Good enough for
  // common clients; anyone who needs surgical parsing can hand-edit the
  // resulting note.
  const markers = [
    /\nOn .+wrote:\n/i,
    /\n-----Original Message-----\n/i,
    /\n________________________________\n/,
    /\n>\s/, // first quoted-line marker
  ];
  let cut = text.length;
  for (const re of markers) {
    const m = text.search(re);
    if (m >= 0 && m < cut) cut = m;
  }
  return text.slice(0, cut).trim();
}

export async function POST(req: Request) {
  // Secret gate
  const expectedSecret = process.env.INBOUND_EMAIL_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: "Inbound email is not configured on this deploy." },
      { status: 503 }
    );
  }
  const url = new URL(req.url);
  const providedSecret =
    req.headers.get("x-inbound-secret") ?? url.searchParams.get("secret") ?? "";
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: ProviderPayload;
  try {
    body = (await req.json()) as ProviderPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const senderEmail = extractEmail(body.from) ?? extractEmail(body.sender);
  if (!senderEmail) {
    return NextResponse.json({ ok: false, error: "Missing sender" }, { status: 400 });
  }

  const subject = (body.subject ?? "").trim();
  const text = stripReplyQuotes(
    (body.text ?? body.plain ?? body.body ?? "").replace(/\r\n/g, "\n")
  );

  // Resolve sender → ec_members
  const supabase = await getSupabaseServer();
  const { data: member, error: memberErr } = await supabase
    .from("ec_members")
    .select("id, first_name, last_name, preferred_name, email, primary_role, ld_number")
    .ilike("email", senderEmail)
    .maybeSingle();
  if (memberErr) {
    console.error("inbound-email: member lookup failed", memberErr);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
  if (!member) {
    return NextResponse.json(
      { ok: false, error: `Sender ${senderEmail} is not on the EC allowlist.` },
      { status: 403 }
    );
  }

  const authorName = `${member.preferred_name ?? member.first_name} ${member.last_name}`.trim();
  const authorRole = member.primary_role as string | null;
  const authorLd = member.ld_number as number | null;

  // Subject routing
  const taskMatch = subject.match(/^\s*#task\b\s*(.*)$/i);
  const contactMatch = subject.match(/^\s*#contact\b\s*(.*)$/i);

  if (taskMatch) {
    if (authorLd == null) {
      return NextResponse.json(
        { ok: false, error: "Your EC record has no LD set; tasks need an LD to live in." },
        { status: 400 }
      );
    }
    const title = taskMatch[1].trim() || "Untitled task from email";
    const { error } = await supabase.from("ld_tasks").insert({
      ld_number: authorLd,
      title,
      description: text || null,
      status: "OPEN",
      priority: "MEDIUM",
      author_name: authorName,
      author_role: authorRole,
      author_ld: authorLd,
      assigned_to_name: authorName,
      assigned_by_name: authorName,
      accepted_at: new Date().toISOString(),
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, kind: "task", ld: authorLd });
  }

  if (contactMatch) {
    if (authorLd == null) {
      return NextResponse.json(
        { ok: false, error: "Your EC record has no LD set; contacts need an LD." },
        { status: 400 }
      );
    }
    const nameParts = contactMatch[1].trim().split(/\s+/);
    if (nameParts.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Subject should be '#contact First Last'." },
        { status: 400 }
      );
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    const { error } = await supabase.from("ld_contacts").insert({
      ld_number: authorLd,
      first_name: firstName,
      last_name: lastName,
      pipeline_stage: "IDENTIFIED",
      source: "OTHER",
      notes: text || null,
      author_name: authorName,
      author_role: authorRole,
      author_ld: authorLd,
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, kind: "contact", ld: authorLd });
  }

  // Default: create a note in the sender's LD
  if (authorLd == null) {
    return NextResponse.json(
      { ok: false, error: "Your EC record has no LD set; notes route to your LD." },
      { status: 400 }
    );
  }
  const noteBody = [subject ? `**${subject}**` : null, text].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("ld_notes").insert({
    ld_number: authorLd,
    body: noteBody || "(empty)",
    author_name: authorName,
    author_role: authorRole,
    author_ld: authorLd,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, kind: "note", ld: authorLd });
}
