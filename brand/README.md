# LDPEC Portal — Design System

Louisville Democratic Party Executive Committee internal portal / playbook. Dark navy hero with a diagonal hatch overlay, red CTA, blue-as-"gold" headline gradient. shadcn-aligned token system on top of LDP brand colors.

> Brand tokens pasted verbatim — surface, audience, and voice details are still TBD. See Caveats.

---

## Index

- `README.md` — this file
- `SKILL.md` — agent-skill frontmatter
- `colors_and_type.css` — LDP custom tokens + shadcn semantic tokens, Inter type, dark hero styles
- `fonts/README.md`
- `assets/` — logo (pending upload)
- `preview/` — Design System tab cards
- `ui_kits/portal/` — portal UI kit (pending — see Caveats)

---

## Visual identity at a glance

| Token | Value | Use |
|---|---|---|
| `--color-ldp-navy-900` | `#051b3c` | Page / hero background |
| `--color-ldp-navy-800` | `#0a3772` | Mid-dark navy |
| `--color-ldp-navy-700` | `#0e4c9e` | Accent bar stripe |
| `--color-ldp-red` | `#c8102e` | CTA button, accents |
| `--color-ldp-red-bright` | `#ff0000` | Label text (LOUISVILLE DEMOCRATIC PARTY) |
| `--color-ldp-gold` | `#60a5fa` | Headline gradient start (blue, not actually gold) |
| `--color-ldp-gold-tint` | `#93c5fd` | Subheadings, accent text |
| Type | Inter | All surfaces, Inter 400/500/600/700/900 |

## Signature devices

- **Headline gradient** — `bg-gradient-to-r from-[#60a5fa] to-[#ffffff]` with `bg-clip-text`. Applied to a single emphasis phrase per hero (e.g. "internal playbook.")
- **Three-segment accent bar** — navy-700 → white/80 → ldp-red. 4px tall × 96px wide pill. Sits under the wordmark.
- **Diagonal hatch hero** — 135° repeating stripe at ~5% opacity over navy-900. Optional watermark/logo top-right at 7–12% opacity.

## Typography rules

- Hero display: 72px, line-height 0.95, weight 900, tracking `-0.035em`
- Label tracking: `0.25em` for wide-spaced uppercase labels; `0.1em` (`tracking-widest`) for secondary labels
- Body tracking: `tracking-tight` (~`-0.011em`)
- Font: Inter only (with system-font fallback)

## Component patterns

- **Cards (over dark):** `bg-white/5 border-white/15 backdrop-blur-sm rounded-xl` (12px radius)
- **Primary CTA:** red fill `#c8102e`, white text, `px-8`, `rounded-md` (8px)
- **Ghost link:** text + arrow icon, no background ("Skip to dashboard →")
- **Default radius:** 10px (`--radius`); cards 12px (`rounded-xl`); pills/bars `rounded-full`; buttons 8px (`rounded-md`)

## Layout

- Max content width: `max-w-5xl` (1024px)
- Page padding: `px-6 py-16`
- Spacing base: 4px (`--spacing`)

---

## CONTENT FUNDAMENTALS

⚠ **Not yet documented.** The brand-element doc you pasted only covers visuals. To finish this section I need:

- Tone descriptors (e.g. internal/operational? credentialed/serious? operator-direct?)
- Audience (LDP staff? volunteers? candidates? committee members? all of the above?)
- Preferred + forbidden vocabulary
- Sample posts / sample portal copy in the right voice
- Casing conventions (it looks like uppercase wide-spaced labels are signature — confirm?)

Please paste the same kind of voice doc you provided for TNC / BatchVault / MainForge and I'll finish this section.

---

## ICONOGRAPHY

Not specified in the pasted doc. Default substitution: **Lucide** at CDN, 1.75px stroke, inheriting `currentColor`. If the live portal uses a different icon set, please flag and I'll swap.

---

## Caveats / what's needed

- **No logo yet.** Drop a file at `ldpec/assets/logo.svg` (or PNG/JPG).
- **Voice / tone / audience / vocabulary missing.** The pasted doc is visuals-only.
- **No live portal access.** I have the brand-element doc but no Figma/codebase/screenshots of actual screens. Once you confirm the portal surfaces (dashboard? playbook reader? event calendar?), I'll build a UI kit at `ui_kits/portal/`.
- **"Gold" token is actually blue (#60a5fa).** Keeping the documented name to match your codebase, but noting it because the naming surprises readers.
