# FSLabs Brand Assets

The official FSLabs logo is the gold **FS** monogram above the **FSLABS** wordmark.

## Master

`public/brand/fslabs-logo-full.png` — the supplied artwork, 1536×1024, transparent
background, untouched. Every asset below is derived from it. Regenerate rather
than edit derivatives by hand.

## Derived assets

| File | Use | Notes |
| --- | --- | --- |
| `public/fslabs-logo.png` | Light backgrounds | Full lockup, 1200px wide. Wordmark "LABS" is charcoal. |
| `public/fslabs-logo-on-dark.png` | Dark backgrounds | Same lockup with "LABS" recoloured to cream `#F0EDE4`. |
| `public/fslabs-logo-mark.png` | Nav, footer, favicons | Monogram only, 512×512 square, transparent. |
| `public/favicon-32.png` | Browser tab | Transparent, so it reads on light and dark chrome. |
| `public/apple-touch-icon.png` | iOS home screen | Brand background baked in — iOS composites onto white. |
| `app/favicon.ico` | Legacy `/favicon.ico` | Multi-size ICO (16/32/48). Next serves it at the root. |
| `public/og-image.png` | Social cards | 1200×630. Uses the on-dark lockup. |

## The light/dark split matters

The supplied artwork sets "LABS" in near-black (`rgb(32,32,32)`). That is correct
on white, but the site background is `#0A0804` — roughly 1.4:1 contrast, so the
word disappears. Use `-on-dark` on any dark surface. The monogram is gold and
needs no variant.

Structured data (`app/layout.tsx`) points at the light lockup deliberately:
search results render it on white.

## Where the mark is referenced

- `components/Navbar.tsx`, `components/Footer.tsx` — Next `<Image>`, square slots
- `public/prototype.html` — nav and footer. Remember `proxy.ts` rewrites `/` to
  this file, so this is the homepage logo.

The mark is a true square specifically so those 38–44px square slots don't
distort it; the previous asset was 1602×1104 and was being squashed.

## Not yet updated

The transactional email templates in `app/api/contact/route.ts` and
`app/api/folub/contact/route.ts` still embed the retired hexagon mark as inline
SVG. Gmail strips inline SVG, so that logo is already invisible for most
recipients. Replacing it needs an absolute-URL `<img>`, not an inline SVG.
