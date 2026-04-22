import { NextResponse } from "next/server";

// Creates a GitHub issue in lisatnorkus/ldp-ec-portal when a user
// submits feedback / a feature request / a bug report through the
// help button. Falls back to a mailto response if the GITHUB_ISSUES_
// TOKEN env var isn't configured, so the feature works immediately
// even before Lisa sets up the repo token.

export const dynamic = "force-dynamic";

type Body = {
  kind?: "feature" | "bug" | "feedback";
  title?: string;
  description?: string;
  page?: string;
  author_name?: string;
  author_email?: string;
};

const REPO_OWNER = "lisatnorkus";
const REPO_NAME = "ldp-ec-portal";
const FALLBACK_EMAIL = "communications@louisvilledems.com";

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const title = body.title?.trim();
  const description = body.description?.trim();
  if (!title || !description) {
    return NextResponse.json(
      { ok: false, error: "Title and description are required." },
      { status: 400 }
    );
  }

  const kind = body.kind ?? "feedback";
  const labelFor: Record<NonNullable<Body["kind"]>, string> = {
    feature: "enhancement",
    bug: "bug",
    feedback: "feedback",
  };
  const prefixFor: Record<NonNullable<Body["kind"]>, string> = {
    feature: "[Feature]",
    bug: "[Bug]",
    feedback: "[Feedback]",
  };

  const issueTitle = `${prefixFor[kind]} ${title}`;
  const issueBody = [
    `**Submitted by:** ${body.author_name?.trim() || "anonymous"}${body.author_email ? ` · ${body.author_email}` : ""}`,
    body.page ? `**Page:** \`${body.page}\`` : null,
    "",
    "---",
    "",
    description,
  ]
    .filter(Boolean)
    .join("\n");

  const token = process.env.GITHUB_ISSUES_TOKEN;
  if (!token) {
    // Fallback: return a mailto URL the client can open. The feedback
    // still reaches a human (Communications) instead of being dropped.
    const mailto = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
    return NextResponse.json({
      ok: true,
      fallback: "mailto",
      mailto,
      message: "Sent to Communications instead of GitHub (no token configured).",
    });
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: [labelFor[kind]],
        }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("GitHub API error", res.status, text);
      return NextResponse.json(
        { ok: false, error: `GitHub returned ${res.status}` },
        { status: 500 }
      );
    }
    const data = (await res.json()) as { html_url?: string; number?: number };
    return NextResponse.json({
      ok: true,
      issue_url: data.html_url,
      issue_number: data.number,
    });
  } catch (err) {
    console.error("submit-feedback failed", err);
    return NextResponse.json({ ok: false, error: "Request failed" }, { status: 500 });
  }
}
