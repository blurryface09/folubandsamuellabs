@AGENTS.md

# FSLabs — Company Context

This file gives any Claude session working in this repo persistent context about
Folub & Samuel Labs (FSLabs) as a company, independent of any single product.
Keep it updated as the company and its product line evolve — this is the
company's long-term memory, not just this repo's.

## What FSLabs is

FSLabs (folubandsamuellabs) is a software studio/holding company. It builds and
operates multiple products rather than being a single-product company. Current
product lines:

- **This repo (folubandsamuellabs.com)** — the company's own marketing site:
  software development services, an HR SaaS (leave management, org tooling),
  a crypto/fiat exchange product (`/exchange`), and training/workforce
  offerings. Contact form routes to `admin@folubandsamuellabs.com`.
- **TailorNow** (tailornow.shop, separate repo: `blurryface09/tailor-now`) —
  a Nigerian fashion marketplace connecting customers with verified tailors.
  Live product with real revenue and Paystack payments (split payouts to
  creatives via Paystack subaccounts). Actively being grown as of Aug 2026 —
  SEO, support-staff tooling, mobile UX fixes all shipped.

## People / roles

- The user (CTO / founder-operator) — makes product and technical decisions
  across FSLabs' whole portfolio, not just one product.

## Working style established across FSLabs projects

- Ship fast, verify before pushing (typecheck + lint + build), commit with
  clear messages, push to `main` directly unless told otherwise for a given
  repo.
- Prefer concrete, actionable answers over long option surveys. Give a
  recommendation, flag the real trade-off, let the user redirect.
- When auditing/reviewing a live product, actually run it and look — don't
  guess from source alone when a screenshot or a local dev server can confirm
  the real behavior.
- Be honest about what's a real bug vs. a testing artifact (e.g. sandbox
  network restrictions, dev-mode-only UI) rather than over-reporting.

## New product ideas

See `PRODUCT-IDEAS.md` in this repo for the running log of ideas being
considered for FSLabs beyond its current products.
