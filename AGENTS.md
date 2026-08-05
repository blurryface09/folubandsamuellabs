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

## Company documents

- `docs/ABOUT_FSLABS.md` — company overview for staff and team (also `docs/about-fslabs.html`)
- `docs/partnerships/summit-partnership-brief.md` — partnership brief for the summit contacts
