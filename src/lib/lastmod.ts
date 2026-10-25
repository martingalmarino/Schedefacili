import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import dateSalvate from '../data/lastmod.json';
import { dataAggiornamentoIso } from './aggiornamento';

const mappa = dateSalvate as Record<string, string>;
const cache = new Map<string, string | undefined>();
let gitCompleto: boolean | undefined;

const FONTI_DOPPIE = [
  'src/data/doppie/parole.ts',
  'src/lib/doppie/genera.ts',
  'src/lib/doppie/render.ts',
  'src/lib/testi-doppie.ts',
];

const FONTI: { prefisso: string; file: string[] }[] = [
  { prefisso: '/fogli-da-stampare/', file: ['src/lib/fogli.ts', 'src/lib/testi-fogli.ts'] },
  { prefisso: '/orologio-da-stampare/', file: ['src/lib/orologio-svg.ts', 'src/lib/ora.ts', 'src/lib/testi-orologio.ts'] },
  { prefisso: '/generatori/schede-orologio/', file: ['src/lib/orologio-svg.ts', 'src/lib/schede-orologio.ts', 'src/lib/ora.ts'] },
  { prefisso: '/numeri-romani/', file: ['src/lib/romani.ts', 'src/lib/schede-romani.ts', 'src/lib/tabelle-romane.ts', 'src/lib/testi-romani.ts'] },
  { prefisso: '/doppie/', file: FONTI_DOPPIE },
  {
    prefisso: '/linea-del-tempo/',
    file: [
      'src/data/linea-del-tempo/preistoria.ts',
      'src/components/linea/icone.ts',
      'src/lib/anni.ts',
      'src/lib/schede-anni.ts',
      'src/lib/linea-cristo.ts',
      'src/lib/testi-cristo.ts',
    ],
  },
];

const PROBLEMI_COMUNI = [
  'src/lib/problemi/genera.ts',
  'src/lib/problemi/render.ts',
  'src/lib/testi-problemi.ts',
];

const PROBLEMI_CLASSE: Record<string, string> = {
  '/problemi-matematica/classe-prima/': 'src/lib/problemi/template/classe-1.ts',
  '/problemi-matematica/classe-seconda/': 'src/lib/problemi/template/classe-2.ts',
  '/problemi-matematica/classe-terza/': 'src/lib/problemi/template/classe-3.ts',
  '/problemi-matematica/classe-quarta/': 'src/lib/problemi/template/classe-4.ts',
  '/problemi-matematica/classe-quinta/': 'src/lib/problemi/template/classe-5.ts',
};

function fontiProblemi(pathname: string): string[] {
  if (!pathname.startsWith('/problemi-matematica/')) return [];
  const propria = PROBLEMI_CLASSE[pathname];
  if (propria) return [...PROBLEMI_COMUNI, propria];
  return [...PROBLEMI_COMUNI, ...Object.values(PROBLEMI_CLASSE)];
}

function repoConStoria(): boolean {
  if (gitCompleto !== undefined) return gitCompleto;
  const esito = spawnSync('git', ['rev-parse', '--is-shallow-repository'], {
    encoding: 'utf8',
    cwd: process.cwd(),
  });
  gitCompleto = esito.status === 0 && esito.stdout.trim() === 'false';
  return gitCompleto;
}

function dataGit(file: string): string | undefined {
  if (cache.has(file)) return cache.get(file);
  if (!existsSync(file)) {
    cache.set(file, undefined);
    return undefined;
  }
  const esito = spawnSync('git', ['log', '-1', '--format=%cI', '--', file], {
    encoding: 'utf8',
    cwd: process.cwd(),
  });
  const uscita = esito.status === 0 ? esito.stdout?.trim() : '';
  const data = uscita || undefined;
  cache.set(file, data);
  return data;
}

export function scegliLastmod(git: string | undefined, salvata: string | undefined): string | undefined {
  return git ?? salvata;
}

function dataFile(file: string): string | undefined {
  const git = repoConStoria() ? dataGit(file) : undefined;
  return scegliLastmod(git, mappa[file]);
}

function fileDellaPagina(pathname: string): string | undefined {
  const base = pathname === '/' ? '/index' : pathname.replace(/\/$/, '');
  const diretti = [`src/pages${base}.astro`, `src/pages${base}/index.astro`];
  for (const file of diretti) {
    if (existsSync(file)) return file;
  }
  const pezzi = base.split('/').filter(Boolean);
  if (pezzi.length < 2) return undefined;
  const padre = pezzi.slice(0, -1).join('/');
  for (const nome of ['[slug]', '[regione]', '[tema]', '[classe]']) {
    const file = `src/pages/${padre}/${nome}.astro`;
    if (existsSync(file)) return file;
  }
  return undefined;
}

export function fontiPagina(pathname: string): string[] {
  const pagina = fileDellaPagina(pathname);
  const extra = FONTI.filter((voce) => pathname.startsWith(voce.prefisso)).flatMap((voce) => voce.file);
  return [...new Set([...(pagina ? [pagina] : []), ...extra, ...fontiProblemi(pathname)])];
}

function piuRecente(date: string[]): string | undefined {
  return date.sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

export function lastmodPagina(pathname: string): string {
  if (pathname.startsWith('/calendario-scolastico/')) return dataAggiornamentoIso();
  return piuRecente(fontiPagina(pathname).map((file) => dataFile(file)).filter((data): data is string => Boolean(data))) ?? dataAggiornamentoIso();
}
