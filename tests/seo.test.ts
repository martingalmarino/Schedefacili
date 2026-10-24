import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function fileHtml(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const path = join(dir, nome);
    if (statSync(path).isDirectory()) return fileHtml(path);
    return nome.endsWith('.html') ? [path] : [];
  });
}

function tuttiIFile(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const path = join(dir, nome);
    if (statSync(path).isDirectory()) return tuttiIFile(path);
    return [path];
  });
}

describe('HTML generato', () => {
  const dist = join(process.cwd(), 'dist');
  const pagine = fileHtml(dist);

  it('genera esattamente 76 pagine HTML indexabili', () => {
    const indice = pagine.filter((file) => file.endsWith('/index.html') || file.endsWith('\\index.html'));
    expect(indice).toHaveLength(76);
    expect(pagine).toHaveLength(76);
  });

  it('rispetta title, description, H1, canonical, lingua e In breve', () => {
    for (const file of pagine) {
      const html = readFileSync(file, 'utf8');
      const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
      const h1 = html.match(/<h1\b/g) ?? [];

      expect(title.length, file).toBeGreaterThan(0);
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, description).toBeGreaterThan(0);
      expect(description.length, description).toBeLessThanOrEqual(155);
      expect(h1, file).toHaveLength(1);
      expect(canonical.startsWith('https://www.schedefacili.com/'), canonical).toBe(true);
      expect(canonical.endsWith('/'), canonical).toBe(true);
      expect(canonical.includes('?'), canonical).toBe(false);
      expect(html).toContain('lang="it"');
      expect(html).toContain('In breve.');
      expect(html.includes('[gg')).toBe(false);
      expect(html.toLowerCase().includes('segnaposto')).toBe(false);
      expect(html).not.toContain('name="keywords"');

      const blocchi = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      expect(blocchi.length, file).toBeGreaterThan(0);
      for (const blocco of blocchi) {
        expect(() => JSON.parse(blocco[1])).not.toThrow();
      }
    }
  });

  it('non contiene il tipo schema.org Event', () => {
    for (const file of tuttiIFile(dist)) {
      const testo = readFileSync(file, 'utf8');
      expect(testo.includes('"@type":"Event"') || testo.includes('"@type": "Event"'), file).toBe(false);
    }
  });
});
