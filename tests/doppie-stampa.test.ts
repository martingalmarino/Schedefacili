import { createServer, type Server } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { describe, expect, it } from 'vitest';
import { chromium, type Page } from 'playwright';
import { PAGINE_DOPPIE } from '../src/lib/testi-doppie';

const DIST = join(process.cwd(), 'dist', 'client');
const CARTELLA = join(process.cwd(), 'test-results');
const SEMI = [1106, 2406, 3306, 4406, 5506];
const VIETATE = ['TODO', 'segnaposto', 'lorem', 'undefined', 'NaN', 'il 8', 'il 11'];

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

async function apri(page: Page, url: string, seed: number, dsa: boolean) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(
    ({ seme, acceso }) => {
      const pie = document.querySelector('#scheda-doppie .pie-doppie')?.textContent ?? '';
      const scheda = document.getElementById('scheda');
      const esercizi = [...document.querySelectorAll('#scheda-doppie .esercizio-doppie')];
      const corte = esercizi.every((esercizio) => esercizio.querySelectorAll('.voce-completa, .coppia-scegli, .voce-coppia, .voce-sillaba, .riga-intruso').length <= 4);
      return pie.includes(String(seme)) && (!acceso || (scheda?.classList.contains('dsa') && esercizi.length > 0 && esercizi.length <= 4 && corte));
    },
    { seme: seed, acceso: dsa },
  );
}

async function misura(page: Page) {
  await page.emulateMedia({ media: 'print' });
  const esito = await page.evaluate(() => {
    const fogli = [...document.querySelectorAll('.foglio-doppie')];
    const fuori: string[] = [];
    const vuoti: number[] = [];
    for (const foglio of fogli) {
      const box = foglio.getBoundingClientRect();
      if (foglio.scrollHeight > foglio.clientHeight + 1) fuori.push('scorre');
      for (const nodo of foglio.querySelectorAll('*')) {
        const rect = nodo.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) continue;
        if (rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1) {
          fuori.push((nodo.className || nodo.tagName).toString().slice(0, 40));
          break;
        }
      }
      const piede = foglio.querySelector('.pie-doppie')?.getBoundingClientRect();
      if (piede && box.height > 0) vuoti.push((box.bottom - piede.bottom) / box.height);
    }
    const testo = (document.querySelector('#scheda-doppie')?.textContent ?? '') + (document.querySelector('#soluzioni-doppie')?.textContent ?? '');
    return { fuori: fuori.slice(0, 6), vuoti, testo };
  });
  await page.emulateMedia({ media: 'screen' });
  return esito;
}

describe('stampa delle doppie', () => {
  it('tiene la scheda su un A4 e le soluzioni su una seconda pagina', async () => {
    const sito = await avvia();
    const browser = await chromium.launch();
    mkdirSync(CARTELLA, { recursive: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      for (const pagina of PAGINE_DOPPIE) {
        for (const dsa of [false, true]) {
          for (const seed of SEMI) {
            const etichetta = `${pagina.href} ${dsa ? 'dsa' : 'base'} ${seed}`;
            await apri(page, `${sito.url}${pagina.href}?s=${seed}${dsa ? '&dsa=1' : ''}`, seed, dsa);
            const controllo = await misura(page);
            expect(controllo.fuori, etichetta).toEqual([]);
            for (const vuoto of controllo.vuoti) expect(vuoto, etichetta).toBeLessThan(0.25);
            expect(controllo.testo, etichetta).not.toMatch(/l'\s/);
            for (const parola of VIETATE) expect(controllo.testo.includes(parola), `${etichetta} ${parola}`).toBe(false);
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
      }
      for (const nome of ['seconda', 'quarta'] as const) {
        const pagina = PAGINE_DOPPIE.find((voce) => voce.slug === `classe-${nome}`);
        if (!pagina) throw new Error(nome);
        await apri(page, `${sito.url}${pagina.href}`, pagina.seed, false);
        await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
        await page.emulateMedia({ media: 'print' });
        await page.locator('#scheda-doppie .foglio-doppie').screenshot({ path: join(CARTELLA, `stampa-doppie-${nome}.png`) });
        await page.locator('#soluzioni-doppie .foglio-doppie').screenshot({ path: join(CARTELLA, `stampa-doppie-${nome}-soluzioni.png`) });
        await page.emulateMedia({ media: 'screen' });
      }
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 300000);

  it('a 375 px non sborda e il pulsante DSA sta nel contenitore delle altre schede', async () => {
    const sito = await avvia();
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
      await page.goto(`${sito.url}/fogli-da-stampare/`, { waitUntil: 'load' });
      const contenitoreFogli = await page.locator('.comandi-scheda').first().getAttribute('class');
      for (const pagina of [{ href: '/doppie/' }, ...PAGINE_DOPPIE]) {
        await page.goto(`${sito.url}${pagina.href}`, { waitUntil: 'load' });
        const misure = await page.evaluate(() => {
          const nodi = [...document.querySelectorAll('button, nav[aria-label="Classe"] a, [aria-pressed]')];
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
