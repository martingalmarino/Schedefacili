import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { URL_NUOVE } from '../src/lib/schede-utili';

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
  const dist = join(process.cwd(), 'dist', 'client');
  const pagine = fileHtml(dist);

  it('genera 84 pagine HTML statiche; orologio e schede orologio sono on demand', () => {
    const indice = pagine.filter((file) => file.endsWith('/index.html') || file.endsWith('\\index.html'));
    expect(indice).toHaveLength(84);
    expect(pagine).toHaveLength(84);
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

const VIETATE = ['refuso', 'PDF MIM', 'TODO', 'segnaposto', 'lasciato vuoto', 'il 8', 'il 11', 'le una', 'In Lazio'];

function piano(testo: string): string {
  return testo.replace(/\s+/g, ' ').trim();
}

function testoVisibile(html: string): string {
  return piano(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;|&#160;/g, ' ')
      .replace(/&#39;|&#x27;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&'),
  );
}

function controllaPaginaNuova(html: string, percorso: string) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  expect(title.length, percorso).toBeGreaterThan(0);
  expect(title.length, title).toBeLessThanOrEqual(60);
  expect(description.length, description).toBeLessThanOrEqual(155);
  expect(html.match(/<h1\b/g) ?? [], percorso).toHaveLength(1);
  expect(canonical, percorso).toBe(`https://www.schedefacili.com${percorso}`);
  expect(canonical.includes('?'), canonical).toBe(false);
  expect(html).toContain('In breve.');
  expect(html.includes('"@type":"Event"') || html.includes('"@type": "Event"')).toBe(false);
  const visibile = testoVisibile(html);
  for (const parola of VIETATE) {
    expect(visibile.includes(parola), `${percorso} contiene «${parola}»`).toBe(false);
  }
  const faq = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((blocco) => JSON.parse(blocco[1]) as { '@type'?: string; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] })
    .find((dato) => dato['@type'] === 'FAQPage');
  expect(faq?.mainEntity?.length, percorso).toBeGreaterThan(0);
  for (const voce of faq?.mainEntity ?? []) {
    expect(visibile, voce.name).toContain(piano(voce.name));
    expect(visibile, voce.acceptedAnswer.text).toContain(piano(voce.acceptedAnswer.text));
  }
}

describe('pagine nuove', () => {
  const dist = join(process.cwd(), 'dist', 'client');

  it('rispetta SEO, FAQ visibile e il lessico sulle 10 URL', async () => {
    process.env.NODE_ENV = 'production';
    process.env.VERCEL_ENV = 'production';
    delete process.env.SITE_URL;
    const modulo = await import(
      pathToFileURL(join(process.cwd(), '.vercel/output/functions/_render.func/.vercel/output/server/entry.mjs')).href
    );
    for (const percorso of URL_NUOVE) {
      const file = join(dist, percorso, 'index.html');
      const html = existsSync(file)
        ? readFileSync(file, 'utf8')
        : await (await modulo.default.fetch(new Request(`http://127.0.0.1${percorso}`))).text();
      controllaPaginaNuova(html, percorso);
    }
  });
});
