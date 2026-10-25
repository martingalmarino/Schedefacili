import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { risolviSiteUrl } from '../src/config/site';
import { corpoRobots } from '../src/lib/robots';
import { lastmodPagina } from '../src/lib/lastmod';
import { URL_LINEA, URL_NUOVE, URL_PROBLEMI } from '../src/lib/schede-utili';

const CHIAVI = ['SITE_URL', 'NODE_ENV', 'VERCEL_ENV', 'ALLOW_INDEXING'] as const;
const prima = Object.fromEntries(CHIAVI.map((chiave) => [chiave, process.env[chiave]]));

function ambiente(valori: Partial<Record<(typeof CHIAVI)[number], string | undefined>>) {
  for (const chiave of CHIAVI) {
    if (!(chiave in valori)) continue;
    const valore = valori[chiave];
    if (valore === undefined) delete process.env[chiave];
    else process.env[chiave] = valore;
  }
}

afterEach(() => {
  for (const chiave of CHIAVI) {
    const valore = prima[chiave];
    if (valore === undefined) delete process.env[chiave];
    else process.env[chiave] = valore;
  }
});

describe('risolviSiteUrl', () => {
  it('fallisce in produzione con localhost, senza https o senza host valido', () => {
    ambiente({ NODE_ENV: 'production', VERCEL_ENV: 'production', SITE_URL: 'http://localhost:4321' });
    expect(() => risolviSiteUrl()).toThrow(/produzione/);

    ambiente({ SITE_URL: 'https://localhost:4321' });
    expect(() => risolviSiteUrl()).toThrow(/produzione/);

    ambiente({ SITE_URL: 'http://www.schedefacili.com' });
    expect(() => risolviSiteUrl()).toThrow(/produzione/);

    ambiente({ SITE_URL: 'non-è-un-url' });
    expect(() => risolviSiteUrl()).toThrow(/valido/);

    ambiente({ SITE_URL: undefined });
    expect(risolviSiteUrl()).toBe('https://www.schedefacili.com');
  });
});

describe('corpoRobots', () => {
  it('apre www in produzione e chiude l’anteprima', () => {
    ambiente({
      NODE_ENV: 'production',
      VERCEL_ENV: 'production',
      SITE_URL: 'https://www.schedefacili.com',
    });
    const aperto = corpoRobots();
    expect(aperto).toContain('Allow: /');
    expect(aperto).toContain('Sitemap: https://www.schedefacili.com/sitemap-index.xml');

    ambiente({ VERCEL_ENV: 'preview' });
    const chiuso = corpoRobots();
    expect(chiuso).toContain('Disallow: /');
    expect(chiuso).not.toContain('Allow: /');
  });
});

function tuttiIFile(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const path = join(dir, nome);
    if (statSync(path).isDirectory()) return tuttiIFile(path);
    return [path];
  });
}

describe('dist di produzione', () => {
  const dist = join(process.cwd(), 'dist', 'client');
  const pagine = tuttiIFile(dist).filter((file) => file.endsWith('.html'));
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  const indexabile = robots.includes('Allow: /');

  it('non cita localhost né vercel.app in HTML, XML e robots', () => {
    const controllati = tuttiIFile(dist).filter(
      (file) => file.endsWith('.html') || file.endsWith('.xml') || file.endsWith('robots.txt'),
    );
    for (const file of controllati) {
      const testo = readFileSync(file, 'utf8');
      expect(testo.includes('localhost'), file).toBe(false);
      expect(testo.includes('vercel.app'), file).toBe(false);
    }
  });

  it('allinea canonical, titoli unici, h1 e JSON-LD', () => {
    const titoli = new Set<string>();
    const descrizioni = new Set<string>();
    const canonical = new Set<string>();
    for (const file of pagine) {
      const html = readFileSync(file, 'utf8');
      const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
      const href = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
      const og = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1] ?? '';
      expect(title.length, file).toBeGreaterThan(0);
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, file).toBeGreaterThan(0);
      expect(description.length, description).toBeLessThanOrEqual(160);
      expect(html.match(/<h1\b/g) ?? [], file).toHaveLength(1);
      expect(href.startsWith('https://www.schedefacili.com/'), href).toBe(true);
      expect(href.endsWith('/'), href).toBe(true);
      expect(og).toBe(href);
      expect(html).toContain('og:locale" content="it_IT"');
      expect(html).toContain('lang="it"');
      titoli.add(title);
      descrizioni.add(description);
      canonical.add(href);
      for (const blocco of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        const dato = JSON.parse(blocco[1]) as { '@type'?: string };
        expect(dato['@type']).not.toBe('Event');
      }
      const meta = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
      expect(meta).toBe(indexabile ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    }
    expect(titoli.size).toBe(pagine.length);
    expect(descrizioni.size).toBe(pagine.length);
    expect(canonical.size).toBe(pagine.length);
  });

  it('pubblica 86 URL nel sitemap, con lastmod, e senza formule di attesa nelle regioni', () => {
    const xml = tuttiIFile(dist).filter((file) => file.endsWith('.xml') && file.includes('sitemap-'));
    const corpo = xml.map((file) => readFileSync(file, 'utf8')).join('\n');
    const loc = [...corpo.matchAll(/<loc>([^<]+)<\/loc>/g)].map((trovato) => trovato[1]);
    const schede = loc.filter((url) => !url.endsWith('.xml'));
    expect(schede).toHaveLength(100);
    for (const url of schede) {
      expect(url.startsWith('https://www.schedefacili.com/')).toBe(true);
      expect(url.endsWith('/')).toBe(true);
    }
    const conData = [...corpo.matchAll(/<url>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/url>/g)];
    expect(conData).toHaveLength(100);
    for (const url of schede) expect(url.includes('?'), url).toBe(false);
    for (const percorso of URL_NUOVE) {
      expect(schede, percorso).toContain(`https://www.schedefacili.com${percorso}`);
    }
    for (const data of conData) {
      expect(Number.isNaN(Date.parse(data[1] ?? '')), data[1]).toBe(false);
    }
    for (const percorso of URL_NUOVE) {
      const atteso = Date.parse(lastmodPagina(percorso));
      const trovato = corpo.match(new RegExp(`<loc>https://www\\.schedefacili\\.com${percorso}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
      expect(trovato, percorso).toBeTruthy();
      expect(Date.parse(trovato?.[1] ?? ''), percorso).toBe(atteso);
      expect(Date.now() - atteso, percorso).toBeGreaterThan(60_000);
    }
    for (const data of conData) {
      const quando = Date.parse(data[1] ?? '');
      expect(Date.now() - quando, data[1]).toBeGreaterThan(60_000);
    }
    for (const percorso of URL_LINEA) {
      const trovato = corpo.match(new RegExp(`<loc>https://www\\.schedefacili\\.com${percorso}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
      const quando = Date.parse(trovato?.[1] ?? '');
      expect(quando, percorso).toBeLessThanOrEqual(Date.now());
    }
    for (const percorso of URL_PROBLEMI) {
      const trovato = corpo.match(new RegExp(`<loc>https://www\\.schedefacili\\.com${percorso}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
      const quando = Date.parse(trovato?.[1] ?? '');
      expect(trovato, percorso).toBeTruthy();
      expect(Date.parse(trovato?.[1] ?? ''), percorso).toBe(Date.parse(lastmodPagina(percorso)));
      expect(quando, percorso).toBeLessThanOrEqual(Date.now());
      expect(Date.now() - quando, percorso).toBeGreaterThan(60_000);
      expect(percorso.includes('?'), percorso).toBe(false);
    }
    const regioni = pagine.filter((file) => file.includes('/calendario-scolastico/2026-2027/') && !file.endsWith('/2026-2027/index.html') && !file.includes('ponti-e-festivita'));
    expect(regioni.length).toBe(21);
    for (const file of regioni) {
      const html = readFileSync(file, 'utf8');
      expect(html.includes('La data non compare'), file).toBe(false);
      expect(html.includes('compariranno'), file).toBe(false);
    }
  });
});
