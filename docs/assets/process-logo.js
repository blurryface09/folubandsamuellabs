// Crop the FSLabs logo to its artwork bounds and make the near-white canvas
// transparent, so it composites cleanly on any light ground.
// Greyish light pixels fade out; coloured (gold) pixels are always kept.
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const src = 'data:image/png;base64,' + fs.readFileSync(process.argv[2]).toString('base64');
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage();
  const outB64 = await p.evaluate(async (srcData) => {
    const img = new Image();
    img.src = srcData;
    await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const im = g.getImageData(0, 0, W, H);
    const d = im.data;

    let minX = W, minY = H, maxX = -1, maxY = -1;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], gg = d[i + 1], bb = d[i + 2];
      const lum = r * 0.299 + gg * 0.587 + bb * 0.114;
      const chroma = Math.max(r, gg, bb) - Math.min(r, gg, bb);
      let a = 255;
      if (chroma < 14) {
        // near-grey: ramp out as it approaches the white canvas
        a = Math.round(Math.max(0, Math.min(1, (250 - lum) / 30)) * 255);
      }
      d[i + 3] = a;
      if (a > 8) {
        const px = (i / 4) % W, py = Math.floor((i / 4) / W);
        if (px < minX) minX = px; if (px > maxX) maxX = px;
        if (py < minY) minY = py; if (py > maxY) maxY = py;
      }
    }
    g.putImageData(im, 0, 0);

    // crop with a 1% breathing margin
    const pad = Math.round(W * 0.01);
    const x = Math.max(0, minX - pad), y = Math.max(0, minY - pad);
    const w = Math.min(W - x, maxX - minX + 1 + pad * 2);
    const h = Math.min(H - y, maxY - minY + 1 + pad * 2);
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    out.getContext('2d').drawImage(c, x, y, w, h, 0, 0, w, h);
    return { data: out.toDataURL('image/png'), w, h };
  }, src);
  await b.close();
  fs.writeFileSync(process.argv[3], Buffer.from(outB64.data.split(',')[1], 'base64'));
  console.log('cropped to', outB64.w + 'x' + outB64.h, '->', process.argv[3], fs.statSync(process.argv[3]).size, 'bytes');
})();
