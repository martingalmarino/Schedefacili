import { execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, normalize } from 'node:path';
import { describe, expect, it } from 'vitest';
import { chromium, type Page } from 'playwright';
import { URL_LINEA } from '../src/lib/schede-utili';

const DIST = join(process.cwd(), 'dist', 'client');
const CARTELLA = join(process.cwd(), 'test-results');

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

function apaisata(pdf: Buffer) {
  const box = [...pdf.toString('latin1').matchAll(/\/MediaBox\s*\[\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
  expect(box.length).toBeGreaterThan(0);
  for (const trovato of box) {
    const largo = Math.max(Number(trovato[1]), Number(trovato[2]));
    const corto = Math.min(Number(trovato[1]), Number(trovato[2]));
    expect(Math.abs(largo - 842)).toBeLessThanOrEqual(2);
    expect(Math.abs(corto - 595)).toBeLessThanOrEqual(2);
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

function raster254(pdf: Buffer): { w: number; h: number; dati: Buffer } {
  const cartella = mkdtempSync(join(tmpdir(), 'striscia-'));
  const sorgente = join(cartella, 'foglio.pdf');
  const uscita = join(cartella, 'foglio.ppm');
  writeFileSync(sorgente, pdf);
  execFileSync('gs', ['-dSAFER', '-dBATCH', '-dNOPAUSE', '-sDEVICE=ppmraw', '-r254', `-sOutputFile=${uscita}`, sorgente], {
    stdio: 'ignore',
  });
  return leggiPpm(readFileSync(uscita));
}

function leggiPpm(buffer: Buffer): { w: number; h: number; dati: Buffer } {
  let i = 0;
  const token: string[] = [];
  while (token.length < 4 && i < buffer.length) {
    while (buffer[i] === 32 || buffer[i] === 10 || buffer[i] === 13 || buffer[i] === 9) i += 1;
    if (buffer[i] === 35) {
      while (buffer[i] !== 10) i += 1;
      continue;
    }
    const inizio = i;
    while (i < buffer.length && buffer[i] !== 32 && buffer[i] !== 10 && buffer[i] !== 13 && buffer[i] !== 9) i += 1;
    token.push(buffer.toString('ascii', inizio, i));
  }
  return { w: Number(token[1]), h: Number(token[2]), dati: buffer.subarray(i + 1) };
}

function scuro(ppm: { w: number; dati: Buffer }, x: number, y: number): boolean {
  const o = (y * ppm.w + x) * 3;
  return ppm.dati[o]! < 80 && ppm.dati[o + 1]! < 90 && ppm.dati[o + 2]! < 120;
}

function larghezzeStrisce(ppm: { w: number; h: number; dati: Buffer }): number[] {
  const righe: number[] = [];
  for (let y = 0; y < ppm.h; y += 1) {
    let min = ppm.w;
    let max = -1;
    for (let x = 0; x < ppm.w; x += 1) {
      if (!scuro(ppm, x, y)) continue;
      if (x < min) min = x;
      if (x > max) max = x;
    }
    if (max - min > 2000) righe.push(y);
  }
  const bande: number[][] = [];
  for (const y of righe) {
    const ultima = bande[bande.length - 1];
    if (!ultima || y - (ultima[ultima.length - 1] ?? y) > 15) bande.push([y]);
    else ultima.push(y);
  }
  return bande.map((banda) => {
    let min = ppm.w;
    let max = -1;
    for (const y of banda) {
      for (let x = 0; x < ppm.w; x += 1) {
        if (!scuro(ppm, x, y)) continue;
        if (x < min) min = x;
        if (x > max) max = x;
      }
    }
    return (max - min) / 10;
  });
}

describe('stampa della linea del tempo', () => {
  it('tiene la preistoria e gli esercizi in A4 orizzontale, e salva le anteprime', async () => {
    const sito = await avvia();
    const browser = await chromium.launch();
    mkdirSync(CARTELLA, { recursive: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      await page.goto(`${sito.url}/linea-del-tempo/preistoria/`, { waitUntil: 'load' });
      const completa = await pdfDi(page);
      expect(paginePdf(completa)).toBe(1);
      apaisata(completa);
      const ppm = raster254(completa);
      expect(ppm.w).toBeGreaterThan(2900);
      const larghezze = larghezzeStrisce(ppm);
      expect(larghezze.length).toBeGreaterThanOrEqual(3);
      for (const larghezza of larghezze) expect(Math.abs(larghezza - 277)).toBeLessThanOrEqual(1);

      await page.emulateMedia({ media: 'print' });
      await page.locator('.foglio-completa svg.foglio-linea').screenshot({ path: join(CARTELLA, 'stampa-preistoria-completa.png') });
      await page.emulateMedia({ media: 'screen' });

      await page.getByRole('tab', { name: 'Da completare' }).click();
      await page.waitForFunction(() => document.getElementById('scheda')?.classList.contains('versione-vuota'));
      const vuota = await pdfDi(page);
      expect(paginePdf(vuota)).toBe(2);
      apaisata(vuota);
      await page.emulateMedia({ media: 'print' });
      await page.locator('.foglio-vuota svg.foglio-linea').first().screenshot({ path: join(CARTELLA, 'stampa-preistoria-vuota.png') });
      await page.locator('.foglio-vuota svg.foglio-linea').nth(1).screenshot({ path: join(CARTELLA, 'stampa-preistoria-tessere.png') });
      await page.emulateMedia({ media: 'screen' });

      await page.getByRole('tab', { name: 'DSA' }).click();
      await page.waitForFunction(() => document.getElementById('scheda')?.classList.contains('dsa'));
      const dsa = await pdfDi(page);
      expect(paginePdf(dsa)).toBe(1);
      apaisata(dsa);
      await page.emulateMedia({ media: 'print' });
      await page.locator('.foglio-dsa svg.foglio-linea').screenshot({ path: join(CARTELLA, 'stampa-preistoria-dsa.png') });
      await page.emulateMedia({ media: 'screen' });

      await page.goto(`${sito.url}/linea-del-tempo/avanti-e-dopo-cristo/`, { waitUntil: 'load' });
      const linea = await pdfDi(page);
      expect(paginePdf(linea)).toBe(1);
      apaisata(linea);

      const livelli = [
        ['facile', 'Facile'],
        ['medio', 'Medio'],
        ['difficile', 'Difficile'],
      ] as const;
      for (const seed of [1, 2, 3]) {
        for (const [livello, etichetta] of livelli) {
          const query = new URLSearchParams();
          if (seed !== 1) query.set('seed', String(seed));
          if (livello !== 'facile') query.set('livello', livello);
          if (seed === 2) query.set('tipo', 'quanti');
          if (seed === 3) query.set('tipo', 'secolo');
          const coda = query.toString();
          await page.goto(`${sito.url}/linea-del-tempo/avanti-e-dopo-cristo/${coda ? `?${coda}` : ''}`, { waitUntil: 'load' });
          await page.getByRole('button', { name: 'Nuova scheda' }).scrollIntoViewIfNeeded();
          await page.waitForFunction(
            ([seme, nome]) => {
              const svg = document.querySelector('#scheda-anni svg')?.innerHTML ?? '';
              const accesi = [...document.querySelectorAll('button[aria-pressed="true"]')].map((nodo) => nodo.textContent?.trim());
              return svg.includes(`>${seme}<`) && accesi.includes(nome);
            },
            [String(seed), etichetta],
          );
          await page.evaluate(() => document.documentElement.classList.add('stampa-esercizi', 'stampa-solo'));
          const sola = await pdfDi(page);
          expect(paginePdf(sola), `${seed} ${livello} sola`).toBe(1);
          apaisata(sola);
          await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
          const doppia = await pdfDi(page);
          expect(paginePdf(doppia), `${seed} ${livello} doppia`).toBe(2);
          apaisata(doppia);
        }
      }

      await page.goto(`${sito.url}/linea-del-tempo/avanti-e-dopo-cristo/?seed=2&tipo=quanti&livello=medio`, { waitUntil: 'load' });
      await page.getByRole('button', { name: 'Nuova scheda' }).scrollIntoViewIfNeeded();
      await page.waitForFunction(() => (document.querySelector('#soluzioni-anni svg')?.textContent ?? '').includes('Soluzioni'));
      await page.evaluate(() => document.documentElement.classList.add('stampa-esercizi'));
      await page.emulateMedia({ media: 'print' });
      await page.locator('#scheda-anni svg.foglio-linea').screenshot({ path: join(CARTELLA, 'stampa-cristo-scheda.png') });
      await page.locator('#soluzioni-anni svg.foglio-linea').screenshot({ path: join(CARTELLA, 'stampa-cristo-soluzioni.png') });
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 180000);

  it('a 375 px non sborda e i controlli della linea stanno in 44 px', async () => {
    const sito = await avvia();
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
      for (const percorso of URL_LINEA) {
        await page.goto(`${sito.url}${percorso}`, { waitUntil: 'networkidle' });
        const misure = await page.evaluate(() => {
          const nodi = [...document.querySelectorAll('#scheda button, #scheda select, #scheda [role="tab"], #scheda a')];
          const piccoli = nodi.flatMap((nodo) => {
            const box = nodo.getBoundingClientRect();
            if (box.width === 0 || box.height === 0) return [];
            const larghezza = Math.round(box.width);
            const altezza = Math.round(box.height);
            return larghezza < 44 || altezza < 44 ? [`${nodo.tagName} ${nodo.textContent?.trim().slice(0, 40)} ${larghezza}x${altezza}`] : [];
          });
          const dsa = document.querySelector('.comandi-scheda button');
          return {
            piccoli,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            dsa: dsa?.textContent ?? '',
          };
        });
        expect(misure.piccoli, percorso).toEqual([]);
        expect(misure.overflow, percorso).toBe(false);
        expect(misure.dsa).toMatch(/Versione DSA/);
      }
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 120000);
});
