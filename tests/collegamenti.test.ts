import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { URL_NUOVE } from '../src/lib/schede-utili';

const DIST = join(process.cwd(), 'dist', 'client');
const SERVER = new Set(['/orologio-da-stampare/', '/generatori/schede-orologio/']);

async function htmlDelDist(): Promise<{ percorso: string; html: string }[]> {
  const esito: { percorso: string; html: string }[] = [];
  const visita = (dir: string) => {
    for (const nome of readdirSync(dir)) {
      const file = join(dir, nome);
      if (statSync(file).isDirectory()) visita(file);
      else if (nome.endsWith('.html')) {
        const relativo = file.slice(DIST.length).replaceAll('\\', '/');
        const percorso = relativo.endsWith('/index.html') ? relativo.slice(0, -'index.html'.length) : relativo;
        esito.push({ percorso: percorso.startsWith('/') ? percorso : `/${percorso}`, html: readFileSync(file, 'utf8') });
      }
    }
  };
  visita(DIST);
  const modulo = await import(
    pathToFileURL(join(process.cwd(), '.vercel/output/functions/_render.func/.vercel/output/server/entry.mjs')).href
  );
  for (const percorso of ['/orologio-da-stampare/', '/generatori/schede-orologio/']) {
    const risposta = await modulo.default.fetch(new Request(`http://127.0.0.1${percorso}`));
    esito.push({ percorso, html: await risposta.text() });
  }
  return esito;
}

function percorsoDi(href: string): string | undefined {
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return undefined;
  const assoluto = href.startsWith('http') ? href : `https://www.schedefacili.com${href.startsWith('/') ? '' : '/'}${href}`;
  let url: URL;
  try {
    url = new URL(assoluto);
  } catch {
    return href;
  }
  if (url.hostname && url.hostname !== 'www.schedefacili.com' && url.hostname !== 'schedefacili.com') return undefined;
  let path = url.pathname;
  if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path = `${path}/`;
  return path || '/';
}

function esiste(percorso: string): boolean {
  if (SERVER.has(percorso)) return true;
  const relativo = percorso.replace(/^\/+/, '');
  const file = percorso.endsWith('/') ? join(DIST, relativo, 'index.html') : join(DIST, relativo);
  const normalizzato = normalize(file);
  return normalizzato.startsWith(DIST) && existsSync(normalizzato);
}

describe('collegamenti delle pagine nuove', () => {
  it('non ha link interni rotti', async () => {
    const pagine = await htmlDelDist();
    const rotti: string[] = [];
    for (const pagina of pagine) {
      for (const trovato of pagina.html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        const percorso = percorsoDi(trovato[1] ?? '');
        if (!percorso || percorso.startsWith('/@')) continue;
        if (!esiste(percorso)) rotti.push(`${pagina.percorso} → ${trovato[1]}`);
      }
    }
    expect(rotti).toEqual([]);
  });

  it('raggiunge le 10 URL dalla home in al massimo due clic e ciascuna ha almeno due link', async () => {
    const pagine = await htmlDelDist();
    const grafo = new Map(pagine.map((pagina) => [pagina.percorso, pagina.html]));
    const linkDi = (html: string) =>
      [...html.matchAll(/\shref="([^"]+)"/g)]
        .map((trovato) => percorsoDi(trovato[1] ?? ''))
        .filter((percorso): percorso is string => Boolean(percorso));
    const raggiunte = new Set(['/']);
    let frontiera = ['/'];
    for (let clic = 0; clic < 2; clic += 1) {
      const prossima: string[] = [];
      for (const nodo of frontiera) {
        const html = grafo.get(nodo);
        if (!html) continue;
        for (const link of linkDi(html)) {
          if (raggiunte.has(link)) continue;
          raggiunte.add(link);
          prossima.push(link);
        }
      }
      frontiera = prossima;
    }
    for (const percorso of URL_NUOVE) {
      expect(raggiunte.has(percorso), percorso).toBe(true);
      const ingressi = pagine.filter((pagina) => linkDi(pagina.html).includes(percorso));
      expect(ingressi.length, percorso).toBeGreaterThanOrEqual(2);
    }
  });
});
