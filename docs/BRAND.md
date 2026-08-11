# FSLabs Brand Assets

The official FSLabs logo is the gold **FS** monogram above the **FSLABS** wordmark.

## Master

`public/brand/fslabs-logo-full.png` — the supplied artwork, 1536×1024, transparent
background, untouched. Every asset below is derived from it. Regenerate rather
than edit derivatives by hand.

## Derived assets

| File | Use | Notes |
| --- | --- | --- |
| `public/fslabs-logo-horizontal-on-dark.png` | **Nav and footer** | Mark left, wordmark right. 4.59:1. |
| `public/fslabs-logo-horizontal.png` | Horizontal, light backgrounds | Same arrangement, charcoal "LABS". |
| `public/fslabs-logo.png` | Light backgrounds | Stacked lockup, 1200px wide. Wordmark "LABS" is charcoal. |
| `public/fslabs-logo-on-dark.png` | Dark backgrounds, social card | Stacked, "LABS" recoloured to cream `#F0EDE4`. |
| `public/fslabs-logo-mark.png` | Favicon source | Monogram only, 512×512 square, transparent. |
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

## Why a horizontal arrangement exists

The supplied artwork is a **stacked** lockup — mark above wordmark, 1.55:1. In a
72px navbar that leaves the wordmark about 7px tall, which is illegible. The
horizontal variant re-arranges the same two pieces side by side at 4.59:1, so at
a 38–44px height the wordmark still reads.

Composition is generated, not hand-placed: the wordmark is all-caps, so its 88px
artwork height is its cap height, set to 40% of the mark height — the
conventional ratio for this pairing.

## Where the logo is referenced

- `components/Navbar.tsx` (h=40), `components/Footer.tsx` (h=44) — Next `<Image>`
- `public/prototype.html` — nav (h=38) and footer (h=36). Remember `proxy.ts`
  rewrites `/` to this file, so this is the homepage logo.

All four use the horizontal on-dark variant with `width:auto` so the aspect ratio
is driven by height alone. The lockup already carries the wordmark, so none of
them sets adjacent "FOLUB & SAMUEL LABS" text any more.

## Not yet updated

The transactional email templates in `app/api/contact/route.ts` and
`app/api/folub/contact/route.ts` still embed the retired hexagon mark as inline
SVG. Gmail strips inline SVG, so that logo is already invisible for most
recipients. Replacing it needs an absolute-URL `<img>`, not an inline SVG.
