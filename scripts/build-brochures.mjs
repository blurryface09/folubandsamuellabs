/**
 * Generates one two-page brochure PDF per Academy track into public/brochures/.
 *
 *   node scripts/build-brochures.mjs
 *
 * Course data comes from lib/academy.json — the same file app/training/page.tsx
 * reads — so a price or date can never differ between the site and the PDFs.
 * Re-run this after editing that file.
 *
 * Rendering goes through the Chromium that ships with this environment rather
 * than a PDF library, because the brochure has to carry the real gold lockup and
 * the poster's cream/gold/dark treatment. The logo is inlined as a data URI:
 * Chromium's PDF renderer will not wait on file:// subresources reliably.
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "brochures");
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const academy = JSON.parse(readFileSync(join(ROOT, "lib", "academy.json"), "utf-8"));
const SITE = "FSlabs.tech";
const APPLY_EMAIL = "access@fslabs.tech";

const logoDark = readFileSync(join(ROOT, "public", "fslabs-logo-horizontal.png")).toString("base64");
const logoLight = readFileSync(join(ROOT, "public", "fslabs-logo-horizontal-on-dark.png")).toString("base64");
const markGold = readFileSync(join(ROOT, "public", "fslabs-logo-mark.png")).toString("base64");

const naira = (n) => "₦" + n.toLocaleString("en-NG");
const pct = (o, n) => Math.round(((o - n) / o) * 100);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(course) {
  const { cohort, tagline, positioning, footerLine, duration, benefits, paymentPlans } = academy;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DejaVu Sans',sans-serif; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  /* Flex column, not absolute positioning — the dark block has to grow to fill
     whatever the cream block leaves, or a white band shows through the middle. */
  .sheet { width:210mm; height:297mm; overflow:hidden; display:flex; flex-direction:column; page-break-after:always; }
  .sheet:last-child { page-break-after:auto; }

  /* Page 1 — cream over dark, echoing the poster's split */
  .cream { background:#FBEFD5; padding:16mm 16mm 12mm; text-align:center; flex:0 0 auto; }
  .cream img { height:15mm; margin:0 auto 8mm; display:block; }
  .kicker { font-size:9pt; letter-spacing:.55em; color:#8B6914; font-weight:700; margin-bottom:2mm; }
  .academy { font-size:30pt; letter-spacing:.22em; color:#141414; font-weight:400; margin-bottom:5mm; }
  .tagline { font-size:9.5pt; letter-spacing:.28em; color:#8B6914; font-weight:700; margin-bottom:6mm; }
  .position { font-size:9pt; color:#4a4438; line-height:1.7; max-width:120mm; margin:0 auto; }

  .dark { background:#0A0804; color:#EFE9DC; padding:14mm 16mm; flex:1 1 auto; display:flex; flex-direction:column; justify-content:center; }
  /* Downward-pointing cream chevron, matching the poster's split. The row needs
     the dark background itself, otherwise the transparent side borders reveal
     the white page beneath as a band. */
  .wedge { height:0; flex:0 0 auto; background:#0A0804; border-left:105mm solid transparent; border-right:105mm solid transparent; border-top:16mm solid #FBEFD5; }

  .tracklabel { font-size:8pt; letter-spacing:.4em; color:#C9A84C; font-weight:700; margin-bottom:4mm; }
  .title { font-size:23pt; font-weight:700; line-height:1.15; margin-bottom:3mm; color:#fff; }
  .tag { font-size:8.5pt; letter-spacing:.16em; color:#C9A84C; margin-bottom:6mm; }
  .desc { font-size:9.5pt; line-height:1.75; color:rgba(239,233,220,.72); margin-bottom:8mm; }

  .pricerow { display:flex; align-items:baseline; gap:5mm; margin-bottom:2mm; }
  .price { font-size:24pt; font-weight:700; color:#C9A84C; }
  .was { font-size:11pt; color:rgba(239,233,220,.32); text-decoration:line-through; }
  .off { font-size:8pt; font-weight:700; color:#0A0804; background:#C9A84C; padding:1.2mm 2.5mm; border-radius:1mm; }
  .pricenote { font-size:8pt; color:rgba(239,233,220,.4); margin-bottom:8mm; }

  .cohort { border:.4mm solid rgba(201,168,76,.45); border-radius:1.5mm; padding:5mm 6mm; display:flex; gap:8mm; align-items:center; }
  .cohort .cname { font-size:7.5pt; letter-spacing:.3em; color:#C9A84C; font-weight:700; margin-bottom:1.5mm; }
  .cohort .cdate { font-size:14pt; font-weight:700; color:#fff; }
  .cohort .cstatus { font-size:8pt; letter-spacing:.2em; color:#C9A84C; text-transform:uppercase; }
  .vr { width:.3mm; align-self:stretch; background:rgba(201,168,76,.3); }

  /* Page 2 — all dark */
  .p2 { background:#0A0804; color:#EFE9DC; padding:15mm 16mm; height:297mm; display:flex; flex-direction:column; }
  /* align-self is required: .p2 is a column flex container, whose default
     align-items:stretch would blow the logo out to the full page width. */
  .p2 img.mark { height:11mm; width:auto; align-self:flex-start; margin-bottom:8mm; }
  .h2 { font-size:8pt; letter-spacing:.4em; color:#C9A84C; font-weight:700; margin:0 0 5mm; }
  ul { list-style:none; margin-bottom:9mm; }
  li { font-size:9.5pt; color:rgba(239,233,220,.78); padding:2.6mm 0 2.6mm 7mm; position:relative; border-bottom:.2mm solid rgba(201,168,76,.1); }
  li:before { content:''; position:absolute; left:0; top:4.4mm; width:2.2mm; height:2.2mm; background:#C9A84C; }
  .bgrid { display:grid; grid-template-columns:1fr 1fr; gap:4mm 6mm; margin-bottom:9mm; }
  .b { border:.25mm solid rgba(201,168,76,.18); border-radius:1mm; padding:4mm; }
  .b .bt { font-size:8.5pt; font-weight:700; color:#fff; margin-bottom:1.5mm; }
  .b .bd { font-size:7.5pt; color:rgba(239,233,220,.5); line-height:1.55; }
  .pay { display:grid; grid-template-columns:1fr 1fr 1fr; gap:4mm; margin-bottom:auto; }
  .pay .p { border:.25mm solid rgba(201,168,76,.18); border-radius:1mm; padding:4mm; text-align:center; }
  .pay .pn { font-size:8.5pt; font-weight:700; color:#C9A84C; margin-bottom:1.5mm; }
  .pay .pd { font-size:7.5pt; color:rgba(239,233,220,.5); line-height:1.5; }
  .apply { border:.4mm solid rgba(201,168,76,.5); border-radius:1.5mm; padding:6mm; display:flex; gap:6mm; align-items:center; justify-content:center; margin-top:8mm; }
  .apply .a { font-size:9.5pt; color:#EFE9DC; }
  .apply .g { color:#C9A84C; font-weight:700; }
  .foot { text-align:center; font-size:7.5pt; letter-spacing:.28em; color:rgba(201,168,76,.55); font-weight:700; margin-top:7mm; text-transform:uppercase; }
</style></head><body>

<div class="sheet">
  <div class="cream">
    <img src="data:image/png;base64,${logoDark}" alt="FSLabs">
    <div class="kicker">FSLABS</div>
    <div class="academy">ACADEMY</div>
    <div class="tagline">${esc(tagline.toUpperCase())}</div>
    <div class="position">${esc(positioning)}</div>
  </div>
  <div class="wedge"></div>
  <div class="dark">
    <div class="tracklabel">TRACK ${esc(course.n)}</div>
    <div class="title">${esc(course.title)}</div>
    <div class="tag">${esc(course.tag)}</div>
    <div class="desc">${esc(course.desc)}</div>
    <div class="pricerow">
      <span class="price">${naira(course.price)}</span>
      <span class="was">${naira(course.originalPrice)}</span>
      <span class="off">${pct(course.originalPrice, course.price)}% OFF</span>
    </div>
    <div class="pricenote">Introductory rate &middot; ${esc(duration)} &middot; instalment plans available</div>
    <div class="cohort">
      <div>
        <div class="cname">${esc(cohort.name.toUpperCase())}</div>
        <div class="cdate">Starts ${esc(cohort.startsLabel)}</div>
      </div>
      <div class="vr"></div>
      <div class="cstatus">${esc(cohort.status)}</div>
    </div>
  </div>
</div>

<div class="sheet">
  <div class="p2">
    <img class="mark" src="data:image/png;base64,${logoLight}" alt="FSLabs">
    <div class="h2">WHAT YOU WILL LEARN</div>
    <ul>${course.topics.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="h2">WHAT EVERY STUDENT GETS</div>
    <div class="bgrid">
      ${benefits.map((b) => `<div class="b"><div class="bt">${esc(b.title)}</div><div class="bd">${esc(b.desc)}</div></div>`).join("")}
    </div>
    <div class="h2">PAYMENT PLANS</div>
    <div class="pay">
      ${paymentPlans.map((p) => `<div class="p"><div class="pn">${esc(p.name)}</div><div class="pd">${esc(p.detail)}</div></div>`).join("")}
    </div>
    <div class="apply">
      <div class="a">Apply on <span class="g">${esc(SITE)}</span></div>
      <div class="vr" style="height:8mm"></div>
      <div class="a">Or email <span class="g">${esc(APPLY_EMAIL)}</span></div>
    </div>
    <div class="foot">${esc(footerLine)}</div>
  </div>
</div>
</body></html>`;
}

if (!existsSync(CHROME)) {
  console.error(`Chromium not found at ${CHROME}. Set CHROME_PATH.`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const tab = await browser.newPage();

// PREVIEW_DIR=/some/path renders PNGs of each sheet as well, so the layout can
// be eyeballed without a PDF viewer.
const previewDir = process.env.PREVIEW_DIR;
if (previewDir) mkdirSync(previewDir, { recursive: true });

for (const course of academy.courses) {
  const html = page(course);
  await tab.setContent(html, { waitUntil: "load" });
  const file = join(OUT_DIR, `FSLabs-Academy-${course.id}.pdf`);
  const pdf = await tab.pdf({ format: "A4", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  writeFileSync(file, pdf);
  console.log(`${course.title.padEnd(32)} -> public/brochures/FSLabs-Academy-${course.id}.pdf  ${(pdf.length / 1024).toFixed(0)}KB`);

  if (previewDir) {
    const sheets = await tab.$$(".sheet");
    for (let i = 0; i < sheets.length; i++) {
      await sheets[i].screenshot({ path: join(previewDir, `${course.id}-p${i + 1}.png`) });
    }
  }
}

// Silence the unused-variable lint on the gold mark while keeping it available
// for future layouts.
void markGold;

await browser.close();
console.log(`\n${academy.courses.length} brochures written to public/brochures/`);
