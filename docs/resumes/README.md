# Résumés

Typeset résumés for FSLabs staff and candidates. These are personal documents,
so they carry no company letterhead and no FSLabs branding beyond a muted accent
rule.

| File | Purpose |
| --- | --- |
| `resume.css` | Shared résumé stylesheet. Single column, A4. |
| `render.sh` | Renders résumé HTML to an A4 PDF ready to print, via headless Chromium. |
| `olatuja-oyinkansola-resume.html` | Olatuja Oyinkansola, cloud engineering. |

## Rendering

```bash
./render.sh                                # every .html in this folder
./render.sh olatuja-oyinkansola-resume.html
CHROME=/path/to/chrome ./render.sh
```

## Design constraints

Applicant tracking systems parse the text layer, not the design, so the layout
stays single column with real headings and no layout tables. Reading order in the
PDF matches reading order on the page. Keep it that way, however tempting a
sidebar looks.

Fit to one page. If content spills, cut words rather than shrinking type below
9.5pt or squeezing the margins under 14mm.

House style matches the correspondence in `docs/letters`: no em dashes, no en
dashes, and no hyphenated compounds in the prose. Write date ranges as
`2024 to 2025`.
