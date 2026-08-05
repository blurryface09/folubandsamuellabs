/*
 * Markdown -> print-ready PDF for FSLabs documents.
 * Renders a styled HTML page through Chromium (Playwright) and prints to PDF.
 *
 * Usage: node md2pdf.js input.md output.pdf "Cover Line 1" "Cover Line 2" "Standfirst"
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const [, , inPath, outPath, coverA, coverB, standfirst, logoPath] = process.argv;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── inline markdown ────────────────────────────────────────────────
function inline(t) {
  return esc(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// ── markdown -> html body ──────────────────────────────────────────
function convert(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  const flushList = (tag, items, cls = '') => {
    out.push(`<${tag}${cls ? ` class="${cls}"` : ''}>${items.map(x => `<li>${x}</li>`).join('')}</${tag}>`);
  };

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    // fenced code / ascii diagram
    if (/^```/.test(line)) {
      i++;
      const buf = [];
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(esc(lines[i++]));
      i++;
      out.push(`<pre class="figure">${buf.join('\n')}</pre>`);
      continue;
    }

    // table
    if (/^\|/.test(line.trim())) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        const cells = lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
        if (!cells.every(c => /^:?-{2,}:?$/.test(c) || c === '')) rows.push(cells);
        i++;
      }
      if (!rows.length) continue;
      const headless = rows[0].every(c => c === '');
      const head = headless ? '' :
        `<thead><tr>${rows[0].map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead>`;
      const body = rows.slice(1).map(r =>
        `<tr>${r.map((c, ci) => `<td${ci === 0 ? ' class="k"' : ''}>${inline(c)}</td>`).join('')}</tr>`).join('');
      out.push(`<div class="tw"><table>${head}<tbody>${body}</tbody></table></div>`);
      continue;
    }

    // blockquote
    if (/^>/.test(line.trim())) {
      const buf = [];
      while (i < lines.length && /^>/.test(lines[i].trim())) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const paras = buf.filter(Boolean).map(l => `<p>${inline(l)}</p>`).join('');
      out.push(`<blockquote>${paras}</blockquote>`);
      continue;
    }

    if (/^---+$/.test(line)) { out.push('<hr>'); i++; continue; }

    // headings
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = h[1].length;
      const txt = h[2].trim();
      if (lvl === 1) {
        const isPart = /^PART\s/i.test(txt);
        out.push(isPart
          ? `<h1 class="part">${inline(txt)}</h1>`
          : `<h1>${inline(txt)}</h1>`);
      } else {
        out.push(`<h${lvl}>${inline(txt)}</h${lvl}>`);
      }
      i++;
      continue;
    }

    // checkbox list
    if (/^[-*]\s+\[[ xX]\]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+\[[ xX]\]\s+/.test(lines[i].trimEnd())) {
        const m = /^[-*]\s+\[([ xX])\]\s+(.*)$/.exec(lines[i].trimEnd());
        items.push(`<span class="box${m[1] === ' ' ? '' : ' on'}"></span>${inline(m[2])}`);
        i++;
      }
      flushList('ul', items, 'checks');
      continue;
    }

    // bullets
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trimEnd()) && !/^[-*]\s+\[[ xX]\]/.test(lines[i].trimEnd())) {
        let txt = /^[-*]\s+(.*)$/.exec(lines[i].trimEnd())[1];
        i++;
        // absorb continuation lines
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i])) {
          txt += ' ' + lines[i].trim();
          i++;
        }
        items.push(inline(txt));
      }
      flushList('ul', items);
      continue;
    }

    // numbered
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trimEnd())) {
        let txt = /^\d+\.\s+(.*)$/.exec(lines[i].trimEnd())[1];
        i++;
        while (i < lines.length && /^\s{3,}\S/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i])) {
          txt += ' ' + lines[i].trim();
          i++;
        }
        items.push(inline(txt));
      }
      flushList('ol', items);
      continue;
    }

    if (line.trim() === '') { i++; continue; }

    // paragraph
    const buf = [line.trim()];
    i++;
    while (i < lines.length) {
      const nx = lines[i].trim();
      if (nx === '' || /^(#{1,4}\s|[-*]\s|\d+\.\s|\||>|---+$|```)/.test(nx)) break;
      buf.push(nx);
      i++;
    }
    const text = buf.join(' ');
    if (/^_.*_$/.test(text)) out.push(`<p class="aside">${inline(text.replace(/^_|_$/g, ''))}</p>`);
    else out.push(`<p>${inline(text)}</p>`);
  }
  return out.join('\n');
}

// ── assemble ───────────────────────────────────────────────────────
const md = fs.readFileSync(inPath, 'utf8');
// The cover carries the title, subtitle and version line, so skip the source's
// front matter: everything up to and including the first horizontal rule.
const allLines = md.split('\n');
const firstRule = allLines.findIndex((l, idx) => idx > 0 && /^---+$/.test(l.trim()));
const bodyMd = allLines.slice(firstRule > 0 ? firstRule + 1 : 1).join('\n');
const body = convert(bodyMd);

const logoData = logoPath && fs.existsSync(logoPath)
  ? 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64')
  : null;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${esc(coverA || '')} ${esc(coverB || '')}</title>
<style>
  :root {
    --gold:#8B6914;        /* legible gold for text */
    --gold-bright:#C9A84C; /* rules, marks */
    --tint:#FBF6EA;
    --ink:#14130E;
    --dim:#403C34;
    --faint:#6E6858;
    --hair:#E6DFCC;
  }
  * { box-sizing:border-box; }
  html,body { margin:0; padding:0; }
  body {
    font-family:"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:var(--dim); font-size:10.4pt; line-height:1.62;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }

  /* ── Cover ── */
  .cover { break-after:page; padding-top:1.1in; }
  /* Logo asset is pre-cropped with a transparent background (see
     docs/assets/fslabs-logo-transparent.png), so it needs no crop or blend. */
  .logo { margin:0 0 .78in; }
  .logo img { width:2.4in; display:block; }
  .cover .kicker {
    font-family:Consolas,"SF Mono",monospace; font-size:8pt; font-weight:700;
    letter-spacing:.28em; text-transform:uppercase; color:var(--gold); margin:0 0 .16in;
  }
  .cover h1 { font-size:46pt; line-height:1.0; letter-spacing:-.03em; font-weight:800; margin:0; color:var(--ink); }
  .cover h1 span { color:var(--gold); display:block; }
  .cover .stand { font-size:12.5pt; line-height:1.55; color:var(--dim); max-width:4.6in; margin:.3in 0 .34in; }
  .cover .meta {
    border-top:1px solid var(--gold-bright); padding-top:.13in;
    font-family:Consolas,"SF Mono",monospace; font-size:8pt; letter-spacing:.16em;
    text-transform:uppercase; color:var(--faint);
  }
  .cover .meta b { color:var(--gold); font-weight:700; }

  /* ── Headings ── */
  h1,h2,h3,h4 { color:var(--ink); font-weight:700; break-after:avoid; text-wrap:balance; }
  h1 { font-size:19pt; line-height:1.16; letter-spacing:-.02em; margin:.34in 0 .12in; }
  h1.part {
    break-before:page; font-size:26pt; color:var(--gold); letter-spacing:-.025em;
    margin:.1in 0 .22in; padding-bottom:.1in; border-bottom:1px solid var(--gold-bright);
  }
  h2 { font-size:14pt; margin:.28in 0 .09in; }
  h3 { font-size:11.4pt; color:var(--gold); margin:.2in 0 .06in; }
  h4 {
    font-family:Consolas,"SF Mono",monospace; font-size:8pt; font-weight:700;
    letter-spacing:.2em; text-transform:uppercase; color:var(--gold); margin:.18in 0 .06in;
  }

  p { margin:0 0 .1in; max-width:6.4in; }
  p.aside { font-size:9.4pt; font-style:italic; color:var(--faint); }
  strong { color:var(--ink); font-weight:700; }
  em { color:var(--ink); }
  a { color:var(--gold); text-decoration:none; border-bottom:1px solid var(--hair); }
  code {
    font-family:Consolas,"SF Mono",monospace; font-size:9pt; color:var(--gold);
    background:var(--tint); padding:.5pt 3pt; border-radius:2pt;
  }

  ul,ol { margin:0 0 .12in; padding-left:.24in; max-width:6.4in; }
  li { margin:0 0 .05in; }
  li::marker { color:var(--gold-bright); }
  ol li::marker { font-weight:700; color:var(--gold); }

  ul.checks { list-style:none; padding-left:0; }
  ul.checks li { display:flex; gap:.09in; align-items:flex-start; }
  .box {
    width:9pt; height:9pt; border:1px solid var(--gold-bright); flex:none; margin-top:3.5pt;
  }
  .box.on { background:var(--gold-bright); }

  blockquote {
    margin:.12in 0 .16in; padding:.13in .18in;
    background:var(--tint); border-left:2.5pt solid var(--gold-bright);
    break-inside:avoid;
  }
  blockquote p { margin:0 0 .06in; color:var(--ink); font-size:11pt; line-height:1.5; }
  blockquote p:last-child { margin:0; }

  hr { border:0; border-top:1px solid var(--hair); margin:.26in 0 0; }

  pre.figure {
    font-family:Consolas,"SF Mono",monospace; font-size:7.6pt; line-height:1.5;
    color:var(--faint); background:var(--tint); border:1px solid var(--hair);
    padding:.14in; margin:.12in 0 .16in; overflow:hidden; break-inside:avoid;
  }

  /* ── Tables ── */
  .tw { margin:.1in 0 .18in; }
  table { width:100%; border-collapse:collapse; font-size:9.3pt; }
  th {
    font-family:Consolas,"SF Mono",monospace; font-size:7.6pt; font-weight:700;
    letter-spacing:.14em; text-transform:uppercase; color:var(--gold);
    background:var(--tint); border-bottom:1px solid var(--gold-bright);
    text-align:left; padding:5.5pt 7pt; vertical-align:bottom;
  }
  td { padding:5.5pt 7pt; border-bottom:.75pt solid var(--hair); vertical-align:top; line-height:1.5; }
  td.k { color:var(--ink); }
  tr { break-inside:avoid; }
  thead { display:table-header-group; }

  /* keep short sections together */
  h2, h3 { page-break-after:avoid; }
</style></head>
<body>
  <section class="cover">
    ${logoData ? `<div class="logo"><img src="${logoData}" alt="FSLabs"></div>` : ''}
    <p class="kicker">Folub &amp; Samuel Labs</p>
    <h1>${esc(coverA || '')}<span>${esc(coverB || '')}</span></h1>
    <p class="stand">${esc(standfirst || '')}</p>
    <p class="meta">Lagos, Nigeria &nbsp;·&nbsp; RC <b>9637480</b> &nbsp;·&nbsp; <b>fslabs.tech</b><br>Version 1.0 &nbsp;·&nbsp; Internal &nbsp;·&nbsp; 3 August 2026</p>
  </section>
  ${body}
</body></html>`;

const absOut = path.resolve(outPath);

// Writing a .html target emits a theme aware web page instead of printing a PDF,
// so the same markdown source backs both outputs.
if (absOut.endsWith('.html')) {
  const themed = html.replace('</style>', `
  /* Dark theme: gold has to lift off a near black ground, so the text gold
     swaps to the brighter value that fails contrast on white but works here. */
  @media (prefers-color-scheme: dark) {
    :root {
      --gold:#D6B457; --gold-bright:#C9A84C; --tint:#111009;
      --ink:#F5F0E8; --dim:#BDB6A6; --faint:#8B8474; --hair:#2A271E;
    }
    body { background:#0A0906; }
  }
  :root[data-theme="dark"] {
    --gold:#D6B457; --gold-bright:#C9A84C; --tint:#111009;
    --ink:#F5F0E8; --dim:#BDB6A6; --faint:#8B8474; --hair:#2A271E;
  }
  :root[data-theme="dark"] body { background:#0A0906; }
  :root[data-theme="light"] {
    --gold:#8B6914; --gold-bright:#C9A84C; --tint:#FBF6EA;
    --ink:#14130E; --dim:#403C34; --faint:#6E6858; --hair:#E6DFCC;
  }
  :root[data-theme="light"] body { background:#fff; }

  /* Screen layout: the print page has no margins of its own. */
  body { max-width:52rem; margin:0 auto; padding:3rem 1.5rem 6rem; font-size:1rem; }
  .cover { break-after:auto; padding-top:1rem; }
  h1.part { break-before:auto; margin-top:3rem; }
  .tw { overflow-x:auto; }
</style>`);
  fs.writeFileSync(absOut, themed);
  console.log('written', absOut, fs.statSync(absOut).size, 'bytes');
  return;
}

const tmpHtml = path.join(path.dirname(absOut), '.render.html');
fs.writeFileSync(tmpHtml, html);

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + tmpHtml, { waitUntil: 'load' });
  await page.pdf({
    path: absOut,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.85in', bottom: '0.8in', left: '0.9in', right: '0.9in' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;padding:0 0.9in;font-family:Consolas,monospace;font-size:7pt;letter-spacing:.12em;text-transform:uppercase;color:#9a927d;display:flex;justify-content:space-between;">' +
      '<span>FSLabs &nbsp;·&nbsp; Company Handbook</span>' +
      '<span class="pageNumber"></span>' +
      '</div>',
  });
  await browser.close();
  if (!process.env.KEEP_HTML) fs.unlinkSync(tmpHtml);
  console.log('written', absOut, fs.statSync(absOut).size, 'bytes');
})();
