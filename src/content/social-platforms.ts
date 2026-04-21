// Official LDP social channels. Sourced verbatim from v1 portal
// (docs/source-data/v1-snapshot.html lines 3335–3341). Any edit here
// is a direct edit to what the portal tells every board member to
// follow and share — run changes past Beth Thorpe (Communications
// Director) first.

export type SocialPlatform = {
  key:
    | "facebook"
    | "instagram"
    | "tiktok"
    | "twitter"
    | "threads"
    | "bluesky"
    | "youtube";
  label: string;
  handle: string;
  url: string;
  // Two-letter glyph shown when no icon library is used; keeps the
  // card visually anchored on first paint and in environments where
  // icons fail to load.
  glyph: string;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: "facebook",
    label: "Facebook",
    handle: "/LouisvilleDemocrats",
    url: "https://www.facebook.com/LouisvilleDemocrats/",
    glyph: "Fb",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@loukydemparty",
    url: "https://www.instagram.com/loukydemparty/",
    glyph: "Ig",
  },
  {
    key: "tiktok",
    label: "TikTok",
    handle: "@loukydemparty",
    url: "https://www.tiktok.com/@loukydemparty",
    glyph: "Tk",
  },
  {
    key: "twitter",
    label: "X / Twitter",
    handle: "@loukydemparty",
    url: "https://twitter.com/loukydemparty",
    glyph: "X",
  },
  {
    key: "threads",
    label: "Threads",
    handle: "@loukydemparty",
    url: "https://www.threads.net/@loukydemparty",
    glyph: "Th",
  },
  {
    key: "bluesky",
    label: "Bluesky",
    handle: "@loukydemparty.bsky.social",
    url: "https://bsky.app/profile/loukydemparty.bsky.social",
    glyph: "Bs",
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "@louisvilledemocraticparty",
    url: "https://www.youtube.com/@louisvilledemocraticparty",
    glyph: "Yt",
  },
];
