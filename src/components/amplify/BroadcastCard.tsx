"use client";

import { useState } from "react";
import { Copy, Mail, MessageSquare, Share2 } from "lucide-react";
import { SocialIcon } from "@/components/social/SocialIcon";
import { shareLinks, type AmplifyBroadcast } from "@/lib/db/amplify-types";

// Per-platform share tile for a single broadcast. Each button either
// opens the platform's native share intent URL (FB / X / Threads /
// Bluesky / LinkedIn / email / SMS) or copies the payload to the
// clipboard for platforms without a share intent (Instagram / TikTok).

export function BroadcastCard({ broadcast }: { broadcast: AmplifyBroadcast }) {
  const links = shareLinks(broadcast);
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = broadcast.url
    ? `${broadcast.body_text.trim()}\n\n${broadcast.url}`
    : broadcast.body_text.trim();

  function copy(kind: string) {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <article className="overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-700) 0%, var(--color-ldp-gold) 50%, var(--color-ldp-red) 100%)",
        }}
      />
      <div className="p-5">
        <div className="flex items-start gap-2">
          <Share2
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 text-[var(--color-ldp-navy-800)]"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[var(--color-ldp-navy-900)]">
              {broadcast.title}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
              {broadcast.body_text}
            </p>
            {broadcast.url && (
              <a
                href={broadcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
              >
                {broadcast.url}
              </a>
            )}
          </div>
        </div>

        {broadcast.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={broadcast.image_url}
            alt=""
            className="mt-4 max-h-64 w-auto rounded-md border border-[var(--color-ldp-line)]"
          />
        )}

        <div className="mt-5 border-t border-[var(--color-ldp-line)] pt-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Share it → one click each
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {links.facebook && (
              <ShareBtn
                href={links.facebook}
                bg="#1877F2"
                label="Facebook"
                icon={<SocialIcon platform="facebook" className="size-3.5" />}
              />
            )}
            <ShareBtn
              href={links.twitter}
              bg="#000000"
              label="X / Twitter"
              icon={<SocialIcon platform="twitter" className="size-3.5" />}
            />
            <ShareBtn
              href={links.threads}
              bg="#000000"
              label="Threads"
              icon={<SocialIcon platform="threads" className="size-3.5" />}
            />
            <ShareBtn
              href={links.bluesky}
              bg="#0085FF"
              label="Bluesky"
              icon={<SocialIcon platform="bluesky" className="size-3.5" />}
            />
            {links.linkedin && (
              <ShareBtn
                href={links.linkedin}
                bg="#0A66C2"
                label="LinkedIn"
                icon={<Share2 aria-hidden="true" className="size-3.5" />}
              />
            )}
            <ShareBtn
              href={links.email}
              bg="var(--color-ldp-navy-800)"
              label="Email"
              icon={<Mail aria-hidden="true" className="size-3.5" />}
            />
            <ShareBtn
              href={links.sms}
              bg="#059669"
              label="Text"
              icon={<MessageSquare aria-hidden="true" className="size-3.5" />}
            />
            <button
              type="button"
              onClick={() => copy("instagram")}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
              style={{
                background:
                  "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
              }}
            >
              <SocialIcon platform="instagram" className="size-3.5" />
              {copied === "instagram" ? "Copied" : "Copy for IG"}
            </button>
            <button
              type="button"
              onClick={() => copy("tiktok")}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white"
            >
              <SocialIcon platform="tiktok" className="size-3.5" />
              {copied === "tiktok" ? "Copied" : "Copy for TikTok"}
            </button>
            <button
              type="button"
              onClick={() => copy("raw")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)]"
            >
              <Copy aria-hidden="true" className="size-3.5" />
              {copied === "raw" ? "Copied" : "Copy text + link"}
            </button>
          </div>
        </div>

        <div className="mt-3 text-[10px] italic text-[var(--color-ldp-ink-700)]">
          Posted{" "}
          {broadcast.published_at
            ? new Date(broadcast.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
          {broadcast.author_name && <> · by {broadcast.author_name}</>}
        </div>
      </div>
    </article>
  );
}

function ShareBtn({
  href,
  bg,
  label,
  icon,
}: {
  href: string;
  bg: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-transform motion-safe:hover:-translate-y-0.5"
      style={{ background: bg }}
    >
      {icon}
      {label}
    </a>
  );
}
