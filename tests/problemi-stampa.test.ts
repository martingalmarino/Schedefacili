import { createServer, type Server } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { describe, expect, it } from 'vitest';
import { chromium, type Page } from 'playwright';
import { PAGINE_PROBLEMI } from '../src/lib/testi-problemi';

const DIST = join(process.cwd(), 'dist', 'client');
const CARTELLA = join(process.cwd(), 'test-results');
const SEMI = [1101, 2222, 3333, 4444, 5555];

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
    const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://127.0.0.1').pathname);
    const relativo = (pathname.endsWith('/') ? `${pathname}index.html` : pathname).replace(/^\/+/, '');
    const file = normalize(join(DIST, relativo));
    if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('no');
      return;
    }
    res.writeHead(200, { 'content-type': tipoContenuto(file) });
    res.end(readFileSync(file));
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

function paginePdf(pdf: Buffer): number {
  return pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
}

function verticale(pdf: Buffer, etichetta: string) {
  const box = [...pdf.toString('latin1').matchAll(/\/MediaBox\s*\[\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
  expect(box.length, etichetta).toBeGreaterThan(0);
  for (const trovato of box) {
    expect(Math.abs(Number(trovato[1]) - 595), etichetta).toBeLessThanOrEqual(2);
    expect(Math.abs(Number(trovato[2]) - 842), etichetta).toBeLessThanOrEqual(2);
  }
}

async function pdfDi(page: Page): Promise<Buffer> {
  await page.emulateMedia({ media: 'print' });
  try {
    return await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
  } finally {
    await page.emulateMedia({ media: 'screen' });
  }
}

async function apri(page: Page, url: string, problemi: number) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction((attesi) => document.querySelectorAll('#scheda-problemi .problema').length === attesi, problemi);
}

describe('stampa dei problemi', () => {
  it('tiene ogni scheda su un A4 verticale e le soluzioni su una seconda pagina', async () => {
    const sito = await avvia();
    const browser = await chromium.launch();
    mkdirSync(CARTELLA, { recursive: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      for (const pagina of PAGINE_PROBLEMI) {
        for (const n of [4, 6, 8]) {
          for (const seed of SEMI) {
            const etichetta = `${pagina.href} n=${n} seed=${seed}`;
            await apri(page, `${sito.url}${pagina.href}?s=${seed}&n=${n}`, n);
            await page.evaluate(() => document.documentElement.classList.add('stampa-solo'));
            const solo = await pdfDi(page);
            expect(paginePdf(solo), `${etichetta} solo`).toBe(1);
            verticale(solo, `${etichetta} solo`);
            await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
            const doppia = await pdfDi(page);
            expect(paginePdf(doppia), `${etichetta} soluzioni`).toBe(2);
            verticale(doppia, `${etichetta} soluzioni`);
          }
        }
        for (const seed of SEMI) {
          const etichetta = `${pagina.href} dsa seed=${seed}`;
          await apri(page, `${sito.url}${pagina.href}?s=${seed}&n=5&dsa=1`, 5);
          await page.waitForFunction(() => document.getElementById('scheda')?.classList.contains('dsa'));
          await page.evaluate(() => document.documentElement.classList.add('stampa-solo'));
          const solo = await pdfDi(page);
          expect(paginePdf(solo), `${etichetta} solo`).toBe(1);
          verticale(solo, `${etichetta} solo`);
          await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
          const doppia = await pdfDi(page);
          expect(paginePdf(doppia), `${etichetta} soluzioni`).toBe(2);
          verticale(doppia, `${etichetta} soluzioni`);
        }
      }
      for (const pagina of PAGINE_PROBLEMI.filter((voce) => voce.classe === 3 || voce.classe === 5)) {
        await page.goto(`${sito.url}${pagina.href}`, { waitUntil: 'load' });
        await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
        await page.emulateMedia({ media: 'print' });
        const nome = pagina.classe === 3 ? 'terza' : 'quinta';
        await page.locator('#scheda-problemi .foglio-problemi').screenshot({ path: join(CARTELLA, `stampa-problemi-${nome}.png`) });
        await page.locator('#soluzioni-problemi .foglio-problemi').screenshot({ path: join(CARTELLA, `stampa-problemi-${nome}-soluzioni.png`) });
        await page.emulateMedia({ media: 'screen' });
      }
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 300000);

  it('a 375 px non sborda e i chip stanno in almeno 44 px', async () => {
    const sito = await avvia();
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
      const fogli = await page.goto(`${sito.url}/fogli-da-stampare/`, { waitUntil: 'load' });
      expect(fogli?.ok()).toBe(true);
      const contenitoreFogli = await page.locator('.comandi-scheda').first().getAttribute('class');
      for (const pagina of [{ href: '/problemi-matematica/' }, ...PAGINE_PROBLEMI]) {
        await page.goto(`${sito.url}${pagina.href}`, { waitUntil: 'load' });
        const misure = await page.evaluate(() => {
          const nodi = [
            ...document.querySelectorAll('button, nav[aria-label="Classe"] a, [aria-pressed]'),
          ];
          const piccoli = nodi.flatMap((nodo) => {
            const box = nodo.getBoundingClientRect();
            if (box.width === 0 || box.height === 0) return [];
            const larghezza = Math.round(box.width);
            const altezza = Math.round(box.height);
            return larghezza < 44 || altezza < 44 ? [`${nodo.tagName} ${(nodo.textContent ?? '').trim().slice(0, 40)} ${larghezza}x${altezza}`] : [];
          });
          const dsa = [...document.querySelectorAll('button')].find((bottone) => bottone.textContent?.includes('Versione DSA'));
          return {
            piccoli,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            contenitore: dsa?.closest('.comandi-scheda')?.className ?? '',
          };
        });
        expect(misure.piccoli, pagina.href).toEqual([]);
        expect(misure.overflow, pagina.href).toBe(false);
        expect(misure.contenitore, pagina.href).toBe(contenitoreFogli);
      }
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 120000);
});
