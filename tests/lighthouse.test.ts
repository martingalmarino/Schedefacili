import { createServer, type Server } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { URL_LINEA } from '../src/lib/schede-utili';
import { HUB_DOPPIE, PAGINE_DOPPIE } from '../src/lib/testi-doppie';
import { HUB_PROBLEMI, PAGINE_PROBLEMI } from '../src/lib/testi-problemi';

process.env.NODE_ENV = 'production';
process.env.VERCEL_ENV = 'production';
delete process.env.SITE_URL;

const DIST = join(process.cwd(), 'dist', 'client');
const HUB = [
  '/fogli-da-stampare/',
  '/orologio-da-stampare/',
  '/numeri-romani/',
  ...URL_LINEA,
  HUB_PROBLEMI,
  PAGINE_PROBLEMI.find((pagina) => pagina.classe === 3)?.href ?? '/problemi-matematica/classe-terza/',
  HUB_DOPPIE,
  PAGINE_DOPPIE.find((pagina) => pagina.classe === 2)?.href ?? '/doppie/classe-seconda/',
];

function tipoContenuto(file: string): string {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.woff2')) return 'font/woff2';
  if (file.endsWith('.woff')) return 'font/woff';
  return 'application/octet-stream';
}

function avvia(): Promise<{ url: string; close: () => Promise<void> }> {
  const server: Server = createServer((req, res) => {
    const richiesto = req.url ?? '/';
    const pathname = decodeURIComponent(new URL(richiesto, 'http://127.0.0.1').pathname);
    void (async () => {
      if (pathname.startsWith('/orologio-da-stampare') || pathname.startsWith('/generatori/schede-orologio')) {
        const modulo = await import(
          pathToFileURL(join(process.cwd(), '.vercel/output/functions/_render.func/.vercel/output/server/entry.mjs')).href
        );
        const risposta = await modulo.default.fetch(new Request(`http://127.0.0.1${richiesto}`));
        res.writeHead(risposta.status, { 'content-type': risposta.headers.get('content-type') ?? 'text/html; charset=utf-8' });
        res.end(Buffer.from(await risposta.arrayBuffer()));
        return;
      }
      const relativo = (pathname.endsWith('/') ? `${pathname}index.html` : pathname).replace(/^\/+/, '');
      const file = normalize(join(DIST, relativo));
      if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end('no');
        return;
      }
      const corpo = readFileSync(file);
      const tipo = tipoContenuto(file);
      const testo = tipo.startsWith('text/') || tipo.includes('javascript') || tipo.includes('svg') || tipo.includes('json');
      if (testo && (req.headers['accept-encoding'] ?? '').includes('gzip')) {
        res.writeHead(200, { 'content-type': tipo, 'content-encoding': 'gzip', vary: 'Accept-Encoding' });
        res.end(gzipSync(corpo));
        return;
      }
      res.writeHead(200, { 'content-type': tipo });
      res.end(corpo);
    })().catch(() => {
      res.writeHead(500);
      res.end('errore');
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const indirizzo = server.address();
      const porta = typeof indirizzo === 'object' && indirizzo ? indirizzo.port : 0;
      resolve({
        url: `http://127.0.0.1:${porta}`,
        close: () => new Promise((chiudi) => server.close(() => chiudi())),
      });
    });
  });
}

describe('Lighthouse mobile sui hub e sulla linea del tempo', () => {
  it('ha Performance ≥ 90, Accessibilità ≥ 95 e SEO 100', async () => {
    const sito = await avvia();
    const chrome = await chromeLauncher.launch({
      chromePath: chromium.executablePath(),
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    });
    try {
      for (const percorso of HUB) {
        const esito = await lighthouse(`${sito.url}${percorso}`, {
          port: chrome.port,
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'seo'],
          formFactor: 'mobile',
          screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
        });
        const categorie = esito?.lhr.categories;
        const punteggi = {
          performance: Math.round((categorie?.performance?.score ?? 0) * 100),
          accessibility: Math.round((categorie?.accessibility?.score ?? 0) * 100),
          seo: Math.round((categorie?.seo?.score ?? 0) * 100),
        };
        const etichetta = `${percorso} ${JSON.stringify(punteggi)}`;
        console.log(etichetta);
        expect(punteggi.performance, etichetta).toBeGreaterThanOrEqual(90);
        expect(punteggi.accessibility, etichetta).toBeGreaterThanOrEqual(95);
        expect(punteggi.seo, etichetta).toBe(100);
      }
    } finally {
      await chrome.kill();
      await sito.close();
    }
  }, 360000);
});
