import { execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { mkdtempSync, mkdirSync, readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, normalize } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { chromium, type Page } from 'playwright';
import { URL_NUOVE } from '../src/lib/schede-utili';

const DIST = join(process.cwd(), 'dist', 'client');

const PAGINE = [
  '/fogli-da-stampare/quadretti-1-cm/',
  '/fogli-da-stampare/quadretti-0-5-cm/',
  '/fogli-da-stampare/carta-millimetrata/',
];

function tipoContenuto(file: string): string {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  if (file.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}

async function paginaServer(percorso: string): Promise<Buffer | undefined> {
  const pathname = new URL(percorso, 'http://127.0.0.1').pathname;
  if (!pathname.startsWith('/orologio-da-stampare') && !pathname.startsWith('/generatori/schede-orologio')) return undefined;
  const modulo = await import(pathToFileURL(join(process.cwd(), '.vercel/output/functions/_render.func/.vercel/output/server/entry.mjs')).href);
  const risposta = await modulo.default.fetch(new Request(`http://127.0.0.1${percorso}`));
  return Buffer.from(await risposta.arrayBuffer());
}

function avvia(root: string): Promise<{ url: string; close: () => Promise<void> }> {
  const server: Server = createServer((req, res) => {
    const richiesto = req.url ?? '/';
    const pathname = decodeURIComponent(new URL(richiesto, 'http://127.0.0.1').pathname);
    void paginaServer(richiesto).then((corpo) => {
      if (corpo) {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(corpo);
        return;
      }
      const relativo = (pathname.endsWith('/') ? `${pathname}index.html` : pathname).replace(/^\/+/, '');
      const file = normalize(join(root, relativo));
      if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end('no');
        return;
      }
      res.writeHead(200, { 'content-type': tipoContenuto(file) });
      res.end(readFileSync(file));
    }).catch(() => {
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
        close: () =>
          new Promise((chiudi) => {
            server.close(() => chiudi());
          }),
      });
    });
  });
}

function paginePdf(pdf: Buffer): number {
  return pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
}

describe('stampa dei fogli A4', () => {
  it('sta in una pagina e il quadretto da 1 cm misura 37,8 px', async () => {
    const sito = await avvia(DIST);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      for (const percorso of PAGINE) {
        await page.goto(`${sito.url}${percorso}`, { waitUntil: 'load' });
        const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
        expect(paginePdf(pdf), percorso).toBe(1);
      }
      await page.goto(`${sito.url}/fogli-da-stampare/quadretti-1-cm/`, { waitUntil: 'load' });
      const lato = await page.evaluate(() => {
        const svg = document.querySelector('svg.foglio-a4');
        if (!svg) return 0;
        const linee = [...svg.querySelectorAll('line[data-ruolo="griglia"][data-orientamento="v"][data-passo="10"]')];
        const prima = linee[0]?.getBoundingClientRect();
        const seconda = linee[1]?.getBoundingClientRect();
        if (!prima || !seconda) return 0;
        return Math.abs(seconda.left - prima.left);
      });
      expect(Math.abs(lato - 37.8)).toBeLessThanOrEqual(0.5);
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 60000);

  it('stampa l’orologio su una pagina e la scheda con le soluzioni su due', async () => {
    const sito = await avvia(DIST);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      await page.goto(`${sito.url}/orologio-da-stampare/`, { waitUntil: 'load' });
      const costruzione = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
      expect(paginePdf(costruzione)).toBe(1);
      await page.goto(`${sito.url}/generatori/schede-orologio/`, { waitUntil: 'load' });
      const doppia = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
      expect(paginePdf(doppia)).toBe(2);
      await page.evaluate(() => document.documentElement.classList.add('stampa-solo'));
      const sola = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
      expect(paginePdf(sola)).toBe(1);
      await page.goto(`${sito.url}/numeri-romani/da-1-a-100/`, { waitUntil: 'load' });
      const cento = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
      expect(paginePdf(cento)).toBe(2);
      await page.goto(`${sito.url}/numeri-romani/da-1-a-1000/`, { waitUntil: 'load' });
      const mille = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
      expect(paginePdf(mille)).toBe(1);
      await page.goto(`${sito.url}/numeri-romani/`, { waitUntil: 'load' });
      const schede = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
      expect(paginePdf(schede)).toBe(8);
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 60000);

  it('tiene ogni scheda su una pagina, anche in DSA, e salva tre anteprime di stampa', async () => {
    const sito = await avvia(DIST);
    const browser = await chromium.launch();
    const cartella = join(process.cwd(), 'test-results');
    mkdirSync(cartella, { recursive: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      const conta = async (percorso: string) => {
        await page.goto(`${sito.url}${percorso}`, { waitUntil: 'load' });
        await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
        const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true });
        return paginePdf(pdf);
      };
      const conDsa = async () => {
        await page.getByRole('button', { name: 'Versione DSA (carattere ad alta leggibilità)' }).click();
        await page.waitForFunction(() => document.getElementById('scheda')?.classList.contains('dsa'));
      };

      expect(await conta('/fogli-da-stampare/quadretti-1-cm/')).toBe(1);
      await page.getByRole('link', { name: 'Senza margine' }).scrollIntoViewIfNeeded();
      await page.waitForLoadState('networkidle');
      await page.getByRole('link', { name: 'Senza margine' }).click();
      await page.waitForFunction(() => !document.querySelector('svg.foglio-a4')?.innerHTML.includes('#C0392B'));
      expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(1);
      await conDsa();
      expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(1);

      for (const percorso of ['/fogli-da-stampare/quadretti-0-5-cm/', '/fogli-da-stampare/carta-millimetrata/', '/orologio-da-stampare/']) {
        expect(await conta(percorso), percorso).toBe(1);
        await conDsa();
        expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true })), percorso).toBe(1);
      }

      for (const quanti of [6, 9, 12]) {
        expect(await conta(`/generatori/schede-orologio/?n=${quanti}`), String(quanti)).toBe(2);
        await page.evaluate(() => document.documentElement.classList.add('stampa-solo'));
        expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(1);
        await page.evaluate(() => document.documentElement.classList.remove('stampa-solo'));
        await conDsa();
        expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(2);
      }

      expect(await conta('/numeri-romani/')).toBe(8);
      await conDsa();
      expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(8);
      expect(await conta('/numeri-romani/da-1-a-100/')).toBe(2);
      await conDsa();
      expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(2);
      expect(await conta('/numeri-romani/da-1-a-1000/')).toBe(1);
      await conDsa();
      expect(paginePdf(await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true }))).toBe(1);

      await page.emulateMedia({ media: 'print' });
      await scatta(page, `${sito.url}/fogli-da-stampare/quadretti-1-cm/`, join(cartella, 'stampa-foglio.png'));
      await scatta(page, `${sito.url}/orologio-da-stampare/`, join(cartella, 'stampa-orologio.png'));
      await scatta(page, `${sito.url}/numeri-romani/`, join(cartella, 'stampa-romani.png'));
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 180000);

  it('in mobile 375 i controlli nuovi sono almeno 44 px e la pagina non sborda', async () => {
    const sito = await avvia(DIST);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
      for (const percorso of URL_NUOVE) {
        await page.goto(`${sito.url}${percorso}`, { waitUntil: 'networkidle' });
        const misure = await page.evaluate(() => {
          const nodi = [...document.querySelectorAll('button, input, select, a.chip')];
          const piccoli = nodi.flatMap((nodo) => {
            const box = nodo.getBoundingClientRect();
            if (box.width === 0 || box.height === 0) return [];
            const larghezza = Math.round(box.width);
            const altezza = Math.round(box.height);
            return larghezza < 44 || altezza < 44 ? [`${nodo.tagName} ${nodo.textContent?.trim().slice(0, 40)} ${larghezza}x${altezza}`] : [];
          });
          return {
            piccoli,
            overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          };
        });
        expect(misure.piccoli, percorso).toEqual([]);
        expect(misure.overflow, percorso).toBe(false);
        const dsa = await page.locator('.comandi-scheda button').first().textContent();
        expect(dsa).toMatch(/Versione DSA/);
      }
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 120000);

  it('stampa il righello da 50 mm, il quadretto da 1 cm, il convertitore, la tabellina e il Veneto su un A4', async () => {
    const sito = await avvia(DIST);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 1400, height: 1800 } });
      const pdfDi = async (percorso: string) => {
        await page.goto(`${sito.url}${percorso}`, { waitUntil: 'load' });
        return page.pdf({
          format: 'A4',
          preferCSSPageSize: true,
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
      };
      for (const percorso of PAGINE) {
        expect(paginePdf(await pdfDi(percorso)), percorso).toBe(1);
      }
      const quadretti = await pdfDi('/fogli-da-stampare/quadretti-1-cm/');
      const ppm = raster254(quadretti);
      const righello = lunghezzaRighello(ppm);
      expect(Math.abs(righello - 500)).toBeLessThanOrEqual(3);
      const quadretto = passoQuadretto(ppm);
      expect(Math.abs(quadretto - 100)).toBeLessThanOrEqual(1);
      expect(paginePdf(await pdfDi('/numeri-romani/convertitore/'))).toBe(1);
      expect(paginePdf(await pdfDi('/tabelline/tabellina-del-7/'))).toBe(1);
      expect(paginePdf(await pdfDi('/calendario-scolastico/2026-2027/veneto/'))).toBe(1);
    } finally {
      await browser.close();
      await sito.close();
    }
  }, 120000);
});

function raster254(pdf: Buffer): { w: number; h: number; dati: Buffer } {
  const cartella = mkdtempSync(join(tmpdir(), 'righello-'));
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

function lunghezzaRighello(ppm: { w: number; h: number; dati: Buffer }): number {
  let migliore = 0;
  let riga = 0;
  for (let y = 0; y < ppm.h; y += 1) {
    let run = 0;
    let max = 0;
    for (let x = 0; x < ppm.w; x += 1) {
      if (scuro(ppm, x, y)) {
        run += 1;
        max = Math.max(max, run);
      } else run = 0;
    }
    if (max > migliore) {
      migliore = max;
      riga = y;
    }
  }
  const tacche: number[] = [];
  for (let x = 0; x < ppm.w; x += 1) {
    if (scuro(ppm, x, Math.max(0, riga - 12))) tacche.push(x);
  }
  const gruppi: number[][] = [];
  for (const x of tacche) {
    const ultimo = gruppi[gruppi.length - 1];
    if (!ultimo || x - ultimo[ultimo.length - 1]! > 8) gruppi.push([x]);
    else ultimo.push(x);
  }
  if (gruppi.length < 2) return migliore;
  const centro = (gruppo: number[]) => gruppo.reduce((somma, valore) => somma + valore, 0) / gruppo.length;
  return Math.round(centro(gruppi[gruppi.length - 1]!) - centro(gruppi[0]!));
}

function passoQuadretto(ppm: { w: number; h: number; dati: Buffer }): number {
  const y = Math.round(ppm.h * 0.45);
  const centri: number[] = [];
  let run: number[] = [];
  const chiudi = () => {
    if (run.length > 0) centri.push(run.reduce((somma, valore) => somma + valore, 0) / run.length);
    run = [];
  };
  for (let x = 0; x < ppm.w; x += 1) {
    const o = (y * ppm.w + x) * 3;
    const chiaro = ppm.dati[o]! > 235 && ppm.dati[o + 1]! > 235 && ppm.dati[o + 2]! > 235;
    if (chiaro) chiudi();
    else run.push(x);
  }
  chiudi();
  const passi = centri.slice(1).map((valore, indice) => valore - centri[indice]!);
  const decine = passi.filter((passo) => passo > 80 && passo < 120);
  return decine[0] ?? 0;
}

async function scatta(page: Page, url: string, file: string) {
  await page.goto(url, { waitUntil: 'load' });
  const foglio = page.locator('svg.foglio-a4').first();
  await foglio.scrollIntoViewIfNeeded();
  await foglio.screenshot({ path: file });
}
