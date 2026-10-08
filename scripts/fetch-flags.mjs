// Télécharge les drapeaux ronds circle-flags (MIT, HatScripts/circle-flags) des pays utilisés
// par src/data/currencies.ts et les embarque dans src/assets/flags.ts (hors ligne garanti).
// Usage : node scripts/fetch-flags.mjs
import { writeFileSync } from 'node:fs';

const COUNTRIES = ['ci', 'cm', 'european_union', 'us', 'gb', 'ch', 'ca', 'cn', 'jp', 'au', 'dk', 'se', 'no', 'za',
  'in', 'br', 'tr', 'kr', 'mx', 'hk', 'sg', 'pl', 'cz', 'hu', 'ro', 'nz', 'il', 'th', 'ph', 'id', 'my', 'is',
  'ng', 'gh', 'ma', 'dz', 'tn', 'eg', 'gn', 'cd', 'rw', 'ke', 'ug', 'tz', 'et', 'ao', 'mg', 'mu', 'cv', 'gm', 'ae', 'sa'];
const BASE = 'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@2.7.0/flags';

const entries = [];
for (const code of COUNTRIES) {
  const res = await fetch(`${BASE}/${code}.svg`);
  if (!res.ok) throw new Error(`${code}: HTTP ${res.status}`);
  const svg = (await res.text()).trim();
  entries.push(`  ${JSON.stringify(code === 'european_union' ? 'eu' : code)}: ${JSON.stringify(svg)},`);
}
writeFileSync(
  new URL('../src/assets/flags.ts', import.meta.url),
  `/** GÉNÉRÉ par scripts/fetch-flags.mjs — drapeaux ronds circle-flags (licence MIT). */\n` +
    `export const FLAGS: Record<string, string> = {\n${entries.join('\n')}\n};\n`,
);
console.log(`${entries.length} drapeaux écrits`);
