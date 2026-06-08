---
name: ldpec-design
description: Use this skill to generate well-branded interfaces and assets for the LDPEC portal — Louisville Democratic Party Executive Committee internal playbook. Dark navy hero with diagonal hatch, red CTA, blue-as-"gold" headline gradient, Inter throughout, shadcn-aligned tokens.
user-invocable: true
---

Read `README.md` first, then `colors_and_type.css`.

## Non-negotiable rules

- **Tokens are canonical.** `--color-ldp-navy-900` `--color-ldp-red` `--color-ldp-gold` (which is blue `#60a5fa`, not gold — kept naming for codebase alignment).
- **Type is Inter only.** Hero display = 72px / weight 900 / line-height 0.95 / tracking `-0.035em`.
- **Headline gradient is signature.** `linear-gradient(90deg, #60a5fa, #ffffff)` with `bg-clip-text`. Used on a single emphasis phrase per hero, not decoratively.
- **Three-segment accent bar** under the wordmark — navy-700 / white-80 / red — is the brand mark, do not omit.
- **Diagonal hatch on hero** at ~5% opacity — also brand-signature, do not omit on hero.
- **CTA is red `#c8102e`** rounded-md (8px). Ghost links use white text with arrow.
- **Cards over navy:** `bg-white/5 border-white/15 backdrop-blur-sm rounded-xl`.
- Voice rules are TBD — ask the user before writing customer-facing copy.
