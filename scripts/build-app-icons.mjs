// Génère l'icône d'app, l'icône adaptative Android, le splash et le favicon depuis le logo
// du design system (C fendu, dégradé violet → orchidée). Usage : node scripts/build-app-icons.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const brand = readFileSync(new URL('../design-system/components/src/brand.ts', import.meta.url), 'utf8');
const MARK = brand.match(/MARK_PATH = "([^"]+)"/)[1];

const gradient = `<linearGradient id="t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9367ff"/><stop offset=".5" stop-color="#7a45f0"/><stop offset="1" stop-color="#c25ae8"/></linearGradient>
<radialGradient id="hl" cx=".22" cy=".12" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>`;

/** Marque blanche centrée, occupant `ratio` du côté. */
const mark = (ratio, fill = '#ffffff') => {
  const scale = (1024 * ratio) / 64;
  const offset = (1024 - 64 * scale) / 2;
  return `<path transform="translate(${offset} ${offset}) scale(${scale})" fill="${fill}" d="${MARK}"/>`;
};
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><defs>${gradient}</defs>${body}</svg>`;
const tile = (rx) => `<rect width="1024" height="1024" rx="${rx}" fill="url(#t)"/><rect width="1024" height="1024" rx="${rx}" fill="url(#hl)"/>`;

const outputs = {
  // iOS masque lui-même les coins : l'icône doit être carrée et opaque.
  'icon.png': [svg(tile(0) + mark(0.62)), 1024],
  'android-icon-background.png': [svg(tile(0)), 1024],
  // Zone sûre Android : ~66 % du canevas ; la marque reste dans ~40 %.
  'android-icon-foreground.png': [svg(mark(0.4)), 1024],
  'android-icon-monochrome.png': [svg(mark(0.4)), 1024],
  'splash-icon.png': [svg(tile(230) + mark(0.62)), 1024],
  'favicon.png': [svg(tile(230) + mark(0.62)), 48],
};

for (const [file, [content, width]] of Object.entries(outputs)) {
  const png = new Resvg(content, { fitTo: { mode: 'width', value: width } }).render().asPng();
  writeFileSync(new URL(`../assets/${file}`, import.meta.url), png);
  console.log(`assets/${file} (${width}px)`);
}
