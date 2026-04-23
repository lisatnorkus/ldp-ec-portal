export type AmplifyStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export type AmplifyBroadcast = {
  id: string;
  title: string;
  body_text: string;
  url: string | null;
  image_url: string | null;
  status: AmplifyStatus;
  author_name: string | null;
  author_role: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// Build a platform share URL. Each platform's intent URL has its
// own quirks — these are the canonical forms that work without
// requiring OAuth or app-specific SDKs.
export function shareLinks(broadcast: Pick<AmplifyBroadcast, "body_text" | "url">) {
  const text = broadcast.body_text.trim();
  const url = broadcast.url?.trim() ?? "";
  const both = url ? `${text}\n\n${url}` : text;
  const enc = encodeURIComponent;

  return {
    facebook: url
      ? `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(text)}`
      : null,
    twitter: `https://twitter.com/intent/tweet?text=${enc(text)}${url ? `&url=${enc(url)}` : ""}`,
    threads: `https://www.threads.net/intent/post?text=${enc(both)}`,
    bluesky: `https://bsky.app/intent/compose?text=${enc(both)}`,
    linkedin: url
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`
      : null,
    sms: `sms:?body=${enc(both)}`,
    email: `mailto:?subject=${enc(broadcast.body_text.slice(0, 80))}&body=${enc(both)}`,
  };
}
