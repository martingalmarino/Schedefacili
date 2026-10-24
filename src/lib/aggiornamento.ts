import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { dataInItaliano } from './ricorrenze';

function oggiRoma(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function raccogliDate(nodo: unknown, trovate: string[]) {
  if (!nodo || typeof nodo !== 'object') return;
  if (Array.isArray(nodo)) {
    for (const voce of nodo) raccogliDate(voce, trovate);
    return;
  }
  for (const [chiave, valore] of Object.entries(nodo)) {
    if ((chiave === 'consultato' || chiave === 'aggiornato') && typeof valore === 'string') {
      const giorno = valore.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(giorno)) trovate.push(giorno);
    } else {
      raccogliDate(valore, trovate);
    }
  }
}

export function dataAggiornamentoIso(): string {
  const calendario = JSON.parse(readFileSync(join(process.cwd(), 'src/data/calendario/2026-2027.json'), 'utf8')) as unknown;
  const trovate: string[] = [];
  raccogliDate(calendario, trovate);
  const oggi = oggiRoma();
  const valide = trovate.filter((giorno) => giorno <= oggi).sort();
  return valide.at(-1) ?? oggi;
}

export function testoAggiornato(): string {
  return dataInItaliano(new Date(`${dataAggiornamentoIso()}T12:00:00+02:00`));
}
