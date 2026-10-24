import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const USCITA = 'src/data/lastmod.json';
const CARTELLE = ['src/pages', 'src/data', 'src/lib', 'src/components', 'src/styles'];

function cammina(cartella, trovati) {
  if (!existsSync(cartella)) return;
  for (const nome of readdirSync(cartella)) {
    if (nome === 'lastmod.json') continue;
    const percorso = join(cartella, nome);
    if (statSync(percorso).isDirectory()) cammina(percorso, trovati);
    else if (/\.(astro|ts|tsx|json|css|mjs)$/.test(nome)) trovati.push(percorso);
  }
}

function git(args) {
  return spawnSync('git', args, { encoding: 'utf8', cwd: process.cwd() });
}

function dataGit(file) {
  const esito = git(['log', '-1', '--format=%cI', '--', file]);
  const data = esito.stdout?.trim();
  if (esito.status !== 0 || !data) return undefined;
  return data;
}

const precedenti = existsSync(USCITA) ? JSON.parse(readFileSync(USCITA, 'utf8')) : {};
const pocoProfondo = git(['rev-parse', '--is-shallow-repository']).stdout?.trim() === 'true';
const toccati = new Set();
if (pocoProfondo) {
  const diff = git(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD']);
  for (const riga of (diff.stdout ?? '').split('\n')) {
    if (riga) toccati.add(riga);
  }
}

const file = [];
for (const cartella of CARTELLE) cammina(cartella, file);
const prossimo = { ...precedenti };
for (const percorso of file) {
  if (pocoProfondo && !toccati.has(percorso)) continue;
  const data = dataGit(percorso);
  if (data) prossimo[percorso] = data;
}

writeFileSync(USCITA, `${JSON.stringify(prossimo, null, 2)}\n`);
