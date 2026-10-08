import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(__dirname, '..', '..');

describe('design system', () => {
  it('tokens.ts et icons.ts sont à jour avec design-system/tokens.json', () => {
    expect(() =>
      execFileSync('python3', [join(ROOT, 'design-system/tools/build_rn_theme.py'), '--check'], { stdio: 'pipe' }),
    ).not.toThrow();
  });

  it('aucune couleur en dur dans src/ hors fichiers générés', () => {
    // Générés depuis le design system, ou dégradé propre au logo.
    const allowed = ['src/theme/tokens.ts', 'src/assets/flags.ts', 'src/assets/icons.ts', 'src/components/ui/AppIcon.tsx'];
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.tsx?$/.test(name) && !name.endsWith('.test.ts')) {
          const rel = relative(ROOT, path);
          if (!allowed.includes(rel) && /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(readFileSync(path, 'utf8'))) offenders.push(rel);
        }
      }
    };
    walk(join(ROOT, 'src'));
    expect(offenders).toEqual([]);
  });
});
