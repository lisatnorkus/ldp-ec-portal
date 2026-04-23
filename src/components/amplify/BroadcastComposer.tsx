"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/lib/userContext";
import { BroadcastCard } from "./BroadcastCard";
import { createBroadcast } from "./amplify-actions";
import type { AmplifyBroadcast } from "@/lib/db/amplify-types";

export function BroadcastComposer() {
  const router = useRouter();
  const { profile, hydrated } = useUserProfile();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const canWrite = hydrated && !!profile.display_name;

  // Live preview uses the same card as the /amplify page. Gives Beth
  // confidence that what she types is exactly what the board sees.
  const preview: AmplifyBroadcast = {
    id: "preview",
    title: title || "(title)",
    body_text: body || "(body — write the post the board will share)",
    url: url || null,
    image_url: imageUrl || null,
    status: "DRAFT",
    author_name: profile.display_name,
    author_role: profile.role,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  function submit(publish: boolean) {
    setErr(null);
    startTransition(async () => {
      const res = await createBroadcast(
        {
          title,
          body_text: body,
          url: url || null,
          image_url: imageUrl || null,
          publish,
        },
        { name: profile.display_name ?? "", role: profile.role }
      );
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      router.push("/amplify");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          Compose
        </h2>

        {!canWrite && (
          <div className="rounded-md border border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-3 text-xs text-[var(--color-ldp-ink-900)]">
            Set your name in the portal first so the broadcast is attributed.
          </div>
        )}

        <Field label="Title (internal)">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Share the voter guide"
            className={INPUT}
          />
        </Field>

        <Field label="Body — the post text board members will share">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Our 2026 primary voter guide is live. Please share with your networks!"
            className={INPUT}
          />
        </Field>

        <Field label="URL (optional)">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.louisvilledems.com/2026-voter-guide"
            className={INPUT}
          />
        </Field>

        <Field label="Image URL (optional)">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={INPUT}
          />
        </Field>

        {err && (
          <div className="rounded-md border border-[var(--color-ldp-red)] bg-[#FFF5F6] p-2 text-xs text-[var(--color-ldp-red)]">
            {err}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => submit(true)}
            disabled={!canWrite || pending || !title || !body}
            className="rounded-md bg-[var(--color-ldp-red)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "Publishing…" : "Publish to the board"}
          </button>
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={!canWrite || pending || !title || !body}
            className="rounded-md border border-[var(--color-ldp-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
          >
            Save as draft
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          Live preview
        </h2>
        <p className="text-xs text-[var(--color-ldp-ink-700)]">
          What the whole board will see on /amplify once you publish.
        </p>
        <BroadcastCard broadcast={preview} />
      </div>
    </div>
  );
}

const INPUT =
  "w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </span>
      {children}
    </label>
  );
}
