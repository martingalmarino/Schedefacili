import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dataAggiornamentoIso } from './aggiornamento';

const cache = new Map<string, string>();

function dataBuild(): string {
  return new Date().toISOString();
}

function dataGit(file: string): string | undefined {
  const nota = cache.get(file);
  if (nota) return nota;
  if (!existsSync(file)) return undefined;
  try {
    const uscita = execSync(`git log -1 --format=%cI -- ${JSON.stringify(`:(literal)${file}`)}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!uscita) return undefined;
    cache.set(file, uscita);
    return uscita;
  } catch {
    return undefined;
  }
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
  for (const nome of ['[slug]', '[regione]', '[tema]']) {
    const file = `src/pages/${padre}/${nome}.astro`;
    if (existsSync(file)) return file;
  }
  return undefined;
}

export function lastmodPagina(pathname: string): string {
  if (pathname.startsWith('/calendario-scolastico/')) return dataAggiornamentoIso();
  const file = fileDellaPagina(pathname);
  if (!file) return dataBuild();
  return dataGit(file) ?? dataBuild();
}
