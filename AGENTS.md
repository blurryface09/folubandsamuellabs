<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The company

This repo belongs to **Folub and Samuel Labs**, short form **FSLabs** (one word, not "FS Labs").
A technology and cybersecurity company incorporated in Nigeria, RC No. 9637480, based in Lagos.

- **Website:** https://fslabs.tech
- **Email:** folubandsamuel@fslabs.tech
- **Founders:** Adeseko Samuel (Technical Lead) and Akinbayo (Business Lead)
- **Tagline:** Your Vision. Our Execution.

## FSLabs is the company; these are its products

| Product | What it is |
| --- | --- |
| **TailorNow** (tailornow.shop) | Marketplace for custom fashion in Nigeria. Separate repo: `blurryface09/tailor-now` |
| **HR & Payroll platform** | Multitenant SaaS: employees, attendance, leave, payroll, documents |
| **FSLabs Exchange** | Crypto to naira and account services |
| **UrbanPulse** | AI assisted citizen reporting and transport intelligence for African cities. In active development. Separate repo: `blurryface09/urbanpulse` (private, TypeScript) |

**Company stage, as of August 2026.** Early. TailorNow, Exchange and the HR platform all work, with the
HR platform pending a review and debug pass. UrbanPulse is in development. Small paid jobs done, but no
full client project delivered under FSLabs and **no paid security engagement**, so cybersecurity is a
capability rather than a delivery history. Teaching happened before registration, and a free bootcamp
runs in August 2026. **Never write anything that implies a client track record the company does not
have**, in documents, site copy or commit messages.

**Never conflate the company with a product.** TailorNow is a product of FSLabs, not the company.
When a document, page or commit refers to "the company", it means FSLabs.

## FOLUB Builders is NOT part of FSLabs

**FOLUB Builders is a separate, independent company.** Never present it as part of FSLabs, a sister
brand, a group company, or an FSLabs product, and never include it in company documents, portfolios,
decks or "about us" material.

Its pages, API route and components were removed from this repo. The code is in git history at commit
`557072b` if it ever needs lifting into its own repository.

More generally: never name any client publicly, or in any document intended to travel outside FSLabs,
without explicit confirmation that written permission exists.

## Domain

The site moved from `folubandsamuellabs.com` to **fslabs.tech**, and the general inbox from
`admin@folubandsamuellabs.com` to **folubandsamuel@fslabs.tech**. Every code reference was updated:
canonical and OpenGraph URLs, JSON-LD, sitemap, robots, footer, contact page, and the Resend `from`
and `to` addresses in the `app/api/*` routes (`contact@fslabs.tech`, `exchange@fslabs.tech`).

`next.config.ts` permanently redirects the old host and its www variant to the same path on
fslabs.tech. That only fires while the old domain stays attached to the deployment.

**Still outstanding, and it needs provider work rather than code:** `fslabs.tech` must be verified as
a sending domain in Resend, or all transactional email fails to deliver.

FSLabs has no public phone number yet, so documents omit the field rather than show a placeholder.
The `+234 800 000 0000` strings in the exchange forms are input placeholders and are correct as they
are.

## Brand

**Logo.** The current official logo is the gold interlocking "FS" monogram above the `FSLABS`
wordmark, with `FS` in gold and `LABS` in black.

| File | Use |
| --- | --- |
| `public/fslabs-logo-2026.png` | Master, as supplied. Near white canvas, 1448x1086. Site OG image and JSON-LD logo. |
| `docs/assets/fslabs-logo-transparent.png` | Cropped to the artwork, transparent background, 1038x526. **Use this one in documents and on any coloured ground.** |

Older `public/fslabs-logo.PNG` and `public/fslabs-logo-mark.png` are superseded. Do not use them for
anything new.

**Palette**, taken from the logo and already used across the site:

| Token | Hex | Use |
| --- | --- | --- |
| Gold | `#C9A84C` | Primary accent, rules, marks |
| Gold bright | `#F0C040` | Gradient top, hover |
| Gold deep | `#8B6914` | Gradient bottom, and gold text on light grounds, since `#C9A84C` fails contrast on white |
| Ground | `#050505` | Near black site ground |
| Bone | `#F5F0E8` | Text on dark |

**Type on the site:** Exo 2 for display at weight 800 to 900 with tight tracking, plus Roboto Mono
for uppercase eyebrows with wide tracking around 0.2em. Documents fall back to a system sans and mono
because the PDF and Artifact pipelines cannot fetch webfonts.

**Tagline:** *Your Vision. Our Execution.* Do not rewrite it, extend it, or make variants of it.

## House style for all written material

Two rules, both from the founders, both non negotiable:

1. **No em dashes or en dashes.** Use commas, colons, or separate sentences instead. Avoid hyphenated
   compounds too, where a natural unhyphenated phrasing exists: "two founder company", "full stack",
   "multitenant", "world class", "aso ebi", "crypto to naira", "third party". Keep hyphens only where
   they sit inside a real filename or path.
2. **Never publish a document containing drafts, placeholders or blanks.** Anything unagreed goes to
   `docs/INTERNAL_TODO.md`, which is founders only, rather than into a staff facing document carrying
   a "to be confirmed" marker.

Check before shipping any document:

```
python3 -c "import re,sys;t=open(sys.argv[1]).read();print('dashes:',len(re.findall(r'[‐-―]',t)))" <file>
```

## Company documents

Staff facing, all circulated:

| Document | What it is |
| --- | --- |
| `docs/FSLABS_COMPANY_HANDBOOK.md` | The main handbook: purpose, mission, vision, values, the four priorities, positioning, audience profiles, objection handling, brand voice, content pillars, onboarding. PDF: `docs/FSLabs-Company-Handbook.pdf` |
| `docs/STAFF_POLICY.md` | Hours, leave, pay and commission, client data and AI rules, device security, ownership of work, incident escalation, joining and leaving. PDF: `docs/FSLabs-Staff-Policy.pdf` |
| `docs/ABOUT_FSLABS.md` | Shorter overview, the version to hand to someone outside the team. PDF: `docs/About-FSLabs.pdf`, web: `docs/about-fslabs.html` |

Founders only, never circulated:

| Document | What it is |
| --- | --- |
| `docs/INTERNAL_TODO.md` | What is agreed, and what is still open. Read this before answering "has X been decided?" |
| `docs/partnerships/summit-partnership-brief.md` | The five summit contacts, our offer and ask for each |

### Agreed policy, in short

Remote first, core hours 10:00 to 16:00 WAT. Fifteen days leave plus public holidays. No fixed payroll
yet: per engagement fees agreed in writing, plus 10% of total contract value for introducing a client,
with salaries reviewed quarterly and no figure committed. Client owns deliverables on full payment
while FSLabs keeps reusable components. No client code, data, credentials or security findings in any
third party AI tool. Incidents go to both founders at once. **Either founder can approve anything**:
both attend to clients, both agree scope and pricing, both sign off leave and expenses. The only
exceptions are security and technical judgements, which are Samuel's.

**Preferred document format is PDF.** Build one from any markdown source with:

```
NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
  node docs/assets/md2pdf.js <input.md> <output.pdf or .html> "Cover Line 1" "Cover Line 2" \
  "Standfirst sentence." docs/assets/fslabs-logo-transparent.png
```

It renders the markdown through Chromium, printing to Letter with the logo on the cover. Give it an
`.html` target instead and it emits a theme aware web page from the same source.
`docs/assets/process-logo.js` produced the transparent logo. Rerun it if the master logo is replaced.
