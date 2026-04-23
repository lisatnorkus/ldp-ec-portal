import Link from "next/link";
import { cookies } from "next/headers";
import { Plus, Share2 } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { fetchPublishedBroadcasts } from "@/lib/db/amplify";
import { BroadcastCard } from "@/components/amplify/BroadcastCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Amplify" };

export default async function AmplifyPage() {
  const [broadcasts, cookieStore] = await Promise.all([
    fetchPublishedBroadcasts(),
    cookies(),
  ]);

  const adminToken = process.env.ADMIN_ACCESS_TOKEN;
  const hasAdminCookie =
    !!adminToken && cookieStore.get("ldp_admin_key")?.value === adminToken;

  return (
    <HubShell
      eyebrow="Amplify · Board share board"
      title="One reshare = free reach."
      subtitle="When the Comms Committee needs the whole board pushing a message, it lands here. Pick a post, pick a channel, click once — your network sees LDP's voice."
      maxWidthClass="max-w-3xl"
      actions={
        hasAdminCookie ? (
          <Link
            href="/amplify/new"
            className="inline-flex items-center gap-1.5 rounded bg-[var(--color-ldp-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:brightness-110"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            New broadcast
          </Link>
        ) : undefined
      }
    >
      {broadcasts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-10 text-center">
          <Share2
            aria-hidden="true"
            className="mx-auto size-8 text-[var(--color-ldp-ink-700)]"
          />
          <h2 className="mt-3 text-lg font-bold text-[var(--color-ldp-navy-900)]">
            No live broadcasts right now.
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
            When Comms publishes a post for the board to amplify, it appears here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {broadcasts.map((b) => (
            <BroadcastCard key={b.id} broadcast={b} />
          ))}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          How Amplify works
        </h2>
        <ol className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            1. Comms writes a post (headline + body + one URL) and publishes it here.
          </li>
          <li>
            2. Every EC member opens this page and taps whichever platforms they actively use.
          </li>
          <li>
            3. The share-intent URL pre-fills the post in the platform&apos;s composer — you
            review, edit if you want, and post.
          </li>
          <li>
            4. Instagram and TikTok don&apos;t accept share intents — the &ldquo;Copy for IG&rdquo; /
            &ldquo;Copy for TikTok&rdquo; buttons put the text on your clipboard so you can paste
            into a Story or a new post.
          </li>
        </ol>
      </section>
    </HubShell>
  );
}
