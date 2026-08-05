<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The company

This repo belongs to **Folub and Samuel Labs** — short form **FSLabs** (one word; not "FS Labs").
A technology and cybersecurity company incorporated in Nigeria, RC No. 9637480, based in Lagos.

- **Website:** https://fslabs.tech
- **Email:** folubandsamuel@fslabs.tech
- **Founders:** Adeseko Samuel (Co-Founder & Technical Lead) · Akinbayo (Co-Founder & Business Lead)
- **Tagline:** Your Vision. Our Execution.

## FSLabs is the company; these are its products

| Product | What it is |
| --- | --- |
| **TailorNow** (tailornow.shop) | Marketplace for custom fashion in Nigeria. Separate repo: `blurryface09/tailor-now` |
| **HR & Payroll platform** | Multi-tenant SaaS — employees, attendance, leave, payroll, documents |
| **FSLabs Exchange** | Crypto-to-naira and account services |

**Never conflate the company with a product.** TailorNow is a product of FSLabs, not the company.
When a document, page or commit refers to "the company", it means FSLabs.

## FOLUB Builders is NOT part of FSLabs

`app/folub` is client work. **FOLUB Builders is a separate, independent company.** Never present it
as part of FSLabs, a sister brand, a group company, or an FSLabs product — and never include it in
company documents, portfolios, decks or "about us" material.

More generally: never name any client publicly, or in any document intended to travel outside
FSLabs, without explicit confirmation that permission exists.

## Domain migration

The site moved from `folubandsamuellabs.com` to **fslabs.tech**, and the general inbox from
`admin@folubandsamuellabs.com` to **folubandsamuel@fslabs.tech**. All code references were updated
— canonical/OG URLs, JSON-LD, sitemap, robots, footer, contact page, and the Resend `from`/`to`
addresses in the `app/api/*` routes (`contact@fslabs.tech`, `exchange@fslabs.tech`).

**Still outstanding — needs DNS/provider work, not code:** `fslabs.tech` must be verified as a
sending domain in Resend, or transactional email will fail to deliver. Also confirm whether the old
domain should redirect to the new one so existing links and search results don't break.

FSLabs has no public phone number yet. The `+234 000 000 0000` on the FOLUB Builders pages is the
client's to supply; the `+234 800 000 0000` strings in the exchange forms are input placeholders and
are correct as-is.

## Brand

**Logo** — the current official logo is the gold interlocking "FS" monogram above the
`FSLABS` wordmark (gold `FS`, black `LABS`).

| File | Use |
| --- | --- |
| `public/fslabs-logo-2026.png` | Master, as supplied — near-white canvas, 1448×1086. Site OG image and JSON-LD logo. |
| `docs/assets/fslabs-logo-transparent.png` | Cropped to artwork, transparent background, 1038×526. **Use this one in documents and on any coloured ground.** |

Older `public/fslabs-logo.PNG` and `public/fslabs-logo-mark.png` are superseded — do not use
them for anything new.

**Palette** (already used across the site, taken from the logo):

| Token | Hex | Use |
| --- | --- | --- |
| Gold | `#C9A84C` | Primary accent, rules, marks |
| Gold bright | `#F0C040` | Gradient top, hover |
| Gold deep | `#8B6914` | Gradient bottom; gold text on light grounds (`#C9A84C` fails contrast on white) |
| Ground | `#050505` | Near-black site ground |
| Bone | `#F5F0E8` | Text on dark |

**Type on the site:** Exo 2 (display, 800–900, tight tracking) + Roboto Mono (uppercase eyebrows,
wide tracking ~0.2em). Documents fall back to a system sans + mono because the Artifact/PDF
pipelines cannot fetch webfonts.

**Tagline:** *Your Vision. Our Execution.* — do not rewrite, extend, or make variants of it.

## Company documents

| Document | What it is |
| --- | --- |
| `docs/FSLABS_COMPANY_HANDBOOK.md` | The main handbook — purpose, mission, vision, values, goals, positioning, objection handling, brand voice, onboarding. PDF: `docs/FSLabs-Company-Handbook.pdf` |
| `docs/ABOUT_FSLABS.md` | Shorter company overview. PDF: `docs/About-FSLabs.pdf`, web: `docs/about-fslabs.html` |
| `docs/partnerships/summit-partnership-brief.md` | The five summit contacts, our offer and ask for each |

**Preferred document format is PDF.** Build one from any of these markdown sources with:

```
NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node docs/assets/md2pdf.js <input.md> <output.pdf> "Cover Line 1" "Cover Line 2" \
  "Standfirst sentence." docs/assets/fslabs-logo-transparent.png
```

It renders the markdown through Chromium and prints to Letter with the logo on the cover.
`docs/assets/process-logo.js` is what produced the transparent logo — rerun it if the master
logo is ever replaced.
