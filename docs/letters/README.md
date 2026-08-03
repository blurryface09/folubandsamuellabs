# FSLabs Official Correspondence

Print-ready letterhead for **Folub & Samuel Labs Limited** (RC 9637480), plus the
letters issued on it.

## Files

| File | Purpose |
| --- | --- |
| `letterhead.css` | The official letterhead. Shared stylesheet — do not fork it per letter. |
| `render.sh` | Renders letterhead HTML to print-ready A4 PDF via headless Chromium. |
| `2026-08-03-offer-of-employment-abdulahi-samiat.html` | Offer of employment — Content Strategist. |

Brand assets live in `public/`:

- `fslabs-logo-lockup.png` — full FS mark + FSLABS wordmark, transparent background. Used in the letterhead band.
- `fslabs-mark-gold.png` — FS mark only, transparent background.

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
paged layout — it lands in the wrong place. Don't switch back to it.

Naming convention: `YYYY-MM-DD-<subject>-<recipient>.html`.

### Available classes

`.doc-meta` (reference + date row) · `.recipient` · `.subject` · `h2.section` ·
`h3.subsection` · `table.terms` (label/value rows) · `ul.clean` (gold square
bullets) · `ol.legal` (numbered clauses) · `.callout` · `.signoff` + `.sig` ·
`.accept-grid` (side-by-side signature and date) · `.page-break` ·
`.avoid-break`.
