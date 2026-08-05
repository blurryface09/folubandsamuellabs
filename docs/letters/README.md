# FSLabs Official Correspondence

Letterhead ready to print for **Folub & Samuel Labs Limited** (RC 9637480), plus
the letters issued on it.

## Files

| File | Purpose |
| --- | --- |
| `letterhead.css` | The official letterhead. Shared stylesheet, so do not fork it per letter. |
| `render.sh` | Renders letterhead HTML to an A4 PDF ready to print, via headless Chromium. |
| `fonts/` | Great Vibes, the signature face. SIL Open Font License 1.1. See `fonts/OFL.txt`. |
| `2026-08-03-offer-of-employment-abdulahi-samiat.html` | Offer of employment, Content Strategist. |
| `2026-08-03-offer-email-abdulahi-samiat.md` | Covering email to send with the offer above. |
| `2026-08-03-offer-of-employment-olatuja-oyinkansola.html` | Offer of employment, Junior Cloud Engineer (Trainee). |
| `2026-08-03-offer-email-olatuja-oyinkansola.md` | Covering email to send with the offer above. |
| `2026-08-03-offer-of-employment-ikenna-abani.html` | Offer of employment, Lead Security Engineer. |
| `2026-08-03-partnership-opportunities-nigeria-fintech-summit.html` | Partnership briefing on the five summit conversations. |

House style for correspondence: no em dashes, no en dashes, and no hyphenated
compounds in the prose. Rebuild the sentence rather than swapping the dash for a
comma. Hyphens belong only in code, meaning class names and filenames.

Brand assets live in `public/`:

- `fslabs-logo-lockup.png`: the full FS mark plus FSLABS wordmark, transparent background. Used in the letterhead band.
- `fslabs-mark-gold.png`: the FS mark on its own, transparent background.

## Rendering

```bash
./render.sh                       # every .html in this folder
./render.sh my-letter.html        # one document
CHROME=/path/to/chrome ./render.sh
```

The PDF is written beside the HTML with a matching name.

## Writing a new letter

Copy an existing letter as the starting point and keep the outer structure
intact:

```html
<table class="sheet">
  <thead>  <!-- letterhead band -->  </thead>
  <tfoot>  <!-- footer band -->      </tfoot>
  <tbody>  <!-- document body -->    </tbody>
</table>
```

The `thead`/`tfoot` wrapper is deliberate: print engines repeat table headers and
footers on every page, so the letterhead and footer appear on page 1 **and** on
every continuation page. A `position: fixed` header does not survive Chromium's
paged layout, because it lands in the wrong place. Don't switch back to it.

Naming convention: `YYYY-MM-DD-<subject>-<recipient>.html`.

### Available classes

`.doc-meta` (reference and date row) · `.recipient` · `.subject` · `h2.section` ·
`h3.subsection` · `table.terms` (label and value rows) · `ul.clean` (gold square
bullets) · `ol.legal` (numbered clauses) · `.callout` · `.signoff` with `.sig` ·
`.accept-grid` (signature beside date) · `.page-break` · `.avoid-break`.

### Signing a letter

To have the issuer's name appear as an executed signature rather than a blank
rule, add `sig__rule--signed` and nest the name inside:

```html
<div class="sig__rule sig__rule--signed">
  <span class="sig__mark">Adeseko Samuel</span>
</div>
```

The name is set in Great Vibes, in signature blue, sitting on the rule. A
counterparty's signature line stays blank, so use a plain `.sig__rule` there.
