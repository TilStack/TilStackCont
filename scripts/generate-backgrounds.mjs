// Génère les motifs de fond éparpillés (SVG répétables) dans public/assets/img : node scripts/generate-backgrounds.mjs
// Trois motifs × deux thèmes × deux couches : « echecs » (petits échiquiers), « pions » (pions d'échecs), « bible ».
// Le motif « damiers » est un simple dégradé CSS (voir src/styles/_theme.scss). Aléatoire figé : même résultat à chaque exécution.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'img');

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const THEMES = {
  // [couleur principale, opacité, couleur d'accent, opacité de l'accent]
  light: ['#14213D', 0.09, '#E0B400', 0.4],
  dark: ['#FFFFFF', 0.1, '#FFDE59', 0.3],
};

// Pion d'échecs et Bible (livre fermé avec une croix), dessinés sur une grille de 24 × 24.
const PAWN =
  'M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM8.5 10.2h7a.8.8 0 0 1 0 1.6h-7a.8.8 0 0 1 0-1.6zM9.6 12.2h4.8c.4 2.2 1.6 4.3 2.6 7H7c1-2.7 2.2-4.8 2.6-7zM6.5 19.4h11a1.2 1.2 0 0 1 1.2 1.2v.2a1.2 1.2 0 0 1-1.2 1.2h-11a1.2 1.2 0 0 1-1.2-1.2v-.2a1.2 1.2 0 0 1 1.2-1.2z';
const BIBLE =
  'M6 2.5h11.5A1.5 1.5 0 0 1 19 4v16a1.5 1.5 0 0 1-1.5 1.5H6A2 2 0 0 1 4 19.5v-15A2 2 0 0 1 6 2.5zM11.2 6h1.6v2.4h2.4V10h-2.4v5h-1.6v-5H8.8V8.4h2.4zM6.2 2.5h.9v19h-.9z';

const place = (x, y, size, angle, inner) =>
  `<g transform="rotate(${angle.toFixed(0)} ${(x + size / 2).toFixed(1)} ${(y + size / 2).toFixed(1)}) translate(${x.toFixed(1)} ${y.toFixed(1)})">${inner}</g>`;

const MOTIFS = {
  echecs: {
    sizes: [26, 56],
    draw(x, y, size, angle, color, opacity) {
      const n = 4;
      const c = size / n;
      let cells = '';
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          if ((i + j) % 2 === 1) cells += `<rect x="${(i * c).toFixed(1)}" y="${(j * c).toFixed(1)}" width="${c.toFixed(1)}" height="${c.toFixed(1)}"/>`;
      return place(x, y, size, angle,
        `<g fill="${color}" fill-opacity="${opacity}">${cells}<rect width="${size}" height="${size}" fill="none" stroke="${color}" stroke-opacity="${(opacity * 1.6).toFixed(2)}" stroke-width="1.2"/></g>`);
    },
  },
  pions: {
    sizes: [30, 54],
    draw: (x, y, size, angle, color, opacity) =>
      place(x, y, size, angle, `<path transform="scale(${(size / 24).toFixed(3)})" d="${PAWN}" fill="${color}" fill-opacity="${(opacity * 1.5).toFixed(2)}"/>`),
  },
  bible: {
    sizes: [30, 52],
    draw: (x, y, size, angle, color, opacity) =>
      place(x, y, size, angle, `<path transform="scale(${(size / 24).toFixed(3)})" d="${BIBLE}" fill="${color}" fill-opacity="${(opacity * 1.5).toFixed(2)}" fill-rule="evenodd"/>`),
  },
};

function layer(motifName, layerName, seed, w, h, cols, rows, theme) {
  const motif = MOTIFS[motifName];
  const [main, mo, accent, ao] = THEMES[theme];
  const r = rng(seed);
  const cw = w / cols, ch = h / rows;
  let body = '';
  for (let cy = 0; cy < rows; cy++)
    for (let cx = 0; cx < cols; cx++) {
      if (r() < 0.22) continue; // quelques cases vides pour un rythme moins régulier
      const size = motif.sizes[0] + r() * (motif.sizes[1] - motif.sizes[0]);
      const x = cx * cw + 8 + r() * (cw - size - 16);
      const y = cy * ch + 8 + r() * (ch - size - 16);
      const angle = (r() - 0.5) * 50;
      const useAccent = r() < 0.2;
      body += motif.draw(x, y, size, angle, useAccent ? accent : main, useAccent ? ao : mo);
    }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
  fs.writeFileSync(path.join(out, `${motifName}-${theme}-${layerName}.svg`), svg);
}

let seed = 11;
for (const motifName of Object.keys(MOTIFS)) {
  for (const theme of Object.keys(THEMES)) {
    layer(motifName, 'a', seed, 640, 560, 4, 3, theme);
    layer(motifName, 'b', seed + 18, 523, 487, 3, 3, theme);
  }
  seed += 7;
}
console.log('motifs de fond générés dans', out);
