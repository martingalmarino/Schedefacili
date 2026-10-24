import { anniTrascorsi, formatta, piuAntico, secolo, type Anno, type Era } from './anni';
import { mescola, mulberry32 } from './prng';

export const SEME_FISSO = 1;

export type TipoSchedaAnni = 'ordine' | 'prima' | 'quanti' | 'secolo';
export type LivelloAnni = 'facile' | 'medio' | 'difficile';

export interface OpzioniSchedaAnni {
  seed: number;
  tipo: TipoSchedaAnni;
  livello: LivelloAnni;
}

export interface EsercizioAnni {
  traccia: string;
  soluzione: string;
  anni: Anno[];
}

export interface SchedaAnni {
  tipo: TipoSchedaAnni;
  livello: LivelloAnni;
  seed: number;
  titolo: string;
  consegna: string;
  voci: EsercizioAnni[];
}

const TIPI: TipoSchedaAnni[] = ['ordine', 'prima', 'quanti', 'secolo'];
const LIVELLI: LivelloAnni[] = ['facile', 'medio', 'difficile'];
const MASSIMO: Record<LivelloAnni, number> = { facile: 20, medio: 500, difficile: 2000 };

const TITOLI: Record<TipoSchedaAnni, string> = {
  ordine: 'Metti in ordine',
  prima: 'Prima o dopo?',
  quanti: 'Quanti anni sono passati?',
  secolo: 'In che secolo?',
};

const CONSEGNE: Record<TipoSchedaAnni, string> = {
  ordine: 'Metti gli anni in ordine, dal più antico.',
  prima: 'Segna l’anno che viene prima.',
  quanti: 'Quanti anni sono passati? Scrivi il numero.',
  secolo: 'Scrivi il secolo.',
};

function intero(casuale: () => number, max: number): number {
  return 1 + Math.floor(casuale() * max);
}

function distinti(casuale: () => number, quanti: number, max: number, era?: Era): Anno[] {
  const esito: Anno[] = [];
  const usati = new Set<string>();
  let giri = 0;
  while (esito.length < quanti && giri < 400) {
    giri += 1;
    const scelta = era ?? (casuale() < 0.5 ? 'aC' : 'dC');
    const n = intero(casuale, max);
    const chiave = `${scelta}${n}`;
    if (usati.has(chiave)) continue;
    usati.add(chiave);
    esito.push({ n, era: scelta });
  }
  if (esito.length < quanti) {
    throw new Error('Non bastano gli anni.');
  }
  return esito;
}

function conEntrambe(anni: Anno[], casuale: () => number, max: number): Anno[] {
  const copia = anni.map((voce) => ({ ...voce }));
  for (const era of ['aC', 'dC'] as const) {
    if (copia.some((voce) => voce.era === era)) continue;
    const indice = copia.findIndex((voce) => copia.filter((altra) => altra.era === voce.era).length > 1);
    const scelto = indice >= 0 ? indice : copia.length - 1;
    let n = copia[scelto]?.n ?? 1;
    let giri = 0;
    while (copia.some((voce, i) => i !== scelto && voce.era === era && voce.n === n) && giri < 40) {
      n = intero(casuale, max);
      giri += 1;
    }
    copia[scelto] = { n, era };
  }
  return copia;
}

function inOrdine(anni: Anno[]): Anno[] {
  return [...anni].sort((a, b) => anniTrascorsi(b, a));
}

function coppiaStessaEra(casuale: () => number, max: number): [Anno, Anno] {
  const era: Era = casuale() < 0.5 ? 'aC' : 'dC';
  const [prima, seconda] = distinti(casuale, 2, max, era);
  if (!prima || !seconda) throw new Error('Non bastano gli anni.');
  return anniTrascorsi(prima, seconda) > 0 ? [prima, seconda] : [seconda, prima];
}

function coppia(casuale: () => number, max: number, forzaCroce: boolean): [Anno, Anno] {
  if (forzaCroce) {
    return [
      { n: intero(casuale, max), era: 'aC' },
      { n: intero(casuale, max), era: 'dC' },
    ];
  }
  let da = distinti(casuale, 1, max)[0];
  let a = distinti(casuale, 1, max)[0];
  if (!da || !a) throw new Error('Non bastano gli anni.');
  if (da.era === a.era && da.n === a.n) {
    a = { n: a.n === max ? 1 : a.n + 1, era: a.era };
  }
  if (anniTrascorsi(da, a) < 0) {
    const scambio = da;
    da = a;
    a = scambio;
  }
  return [da, a];
}

function domandaSecolo(voce: Anno): string {
  return voce.n === 1 ? `In che secolo è l’${formatta(voce)}?` : `In che secolo è il ${formatta(voce)}?`;
}

function esercizio(tipo: TipoSchedaAnni, anni: Anno[]): EsercizioAnni {
  if (tipo === 'ordine') {
    const mostrati = anni;
    return {
      traccia: mostrati.map(formatta).join(' · '),
      soluzione: inOrdine(mostrati).map(formatta).join(' · '),
      anni: mostrati,
    };
  }
  if (tipo === 'prima') {
    const [x, y] = anni;
    if (!x || !y) throw new Error('Non bastano gli anni.');
    return {
      traccia: `Chi viene prima, ${formatta(x)} o ${formatta(y)}?`,
      soluzione: formatta(piuAntico(x, y)),
      anni,
    };
  }
  if (tipo === 'quanti') {
    const [da, a] = anni;
    if (!da || !a) throw new Error('Non bastano gli anni.');
    return {
      traccia: `Quanti anni passano da ${formatta(da)} a ${formatta(a)}?`,
      soluzione: String(anniTrascorsi(da, a)),
      anni,
    };
  }
  const voce = anni[0];
  if (!voce) throw new Error('Non bastano gli anni.');
  return { traccia: domandaSecolo(voce), soluzione: secolo(voce), anni };
}

export function opzioniAnniDaQuery(params: URLSearchParams): OpzioniSchedaAnni {
  const seed = Number(params.get('seed'));
  const tipo = params.get('tipo');
  const livello = params.get('livello');
  return {
    seed: Number.isInteger(seed) && seed >= 1 && seed <= 999999 ? seed : SEME_FISSO,
    tipo: TIPI.includes(tipo as TipoSchedaAnni) ? (tipo as TipoSchedaAnni) : 'ordine',
    livello: LIVELLI.includes(livello as LivelloAnni) ? (livello as LivelloAnni) : 'facile',
  };
}

export function queryAnni(opzioni: OpzioniSchedaAnni): string {
  const params = new URLSearchParams();
  if (opzioni.seed !== SEME_FISSO) params.set('seed', String(opzioni.seed));
  if (opzioni.tipo !== 'ordine') params.set('tipo', opzioni.tipo);
  if (opzioni.livello !== 'facile') params.set('livello', opzioni.livello);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function generaScheda(opzioni: OpzioniSchedaAnni): SchedaAnni {
  const casuale = mulberry32(opzioni.seed);
  const max = MASSIMO[opzioni.livello];
  const voci: EsercizioAnni[] = [];
  if (opzioni.tipo === 'ordine') {
    for (let indice = 0; indice < 4; indice += 1) {
      const era = opzioni.livello === 'facile' ? (casuale() < 0.5 ? 'aC' : 'dC') : undefined;
      const estratti = distinti(casuale, 5, max, era);
      const pronti = era ? estratti : conEntrambe(estratti, casuale, max);
      voci.push(esercizio('ordine', mescola(pronti, casuale)));
    }
  } else if (opzioni.tipo === 'prima') {
    for (let indice = 0; indice < 6; indice += 1) {
      const coppiaAnni =
        opzioni.livello === 'facile' ? coppiaStessaEra(casuale, max) : coppia(casuale, max, false);
      voci.push(esercizio('prima', mescola(coppiaAnni, casuale)));
    }
  } else if (opzioni.tipo === 'quanti') {
    for (let indice = 0; indice < 6; indice += 1) {
      const forza = opzioni.livello !== 'facile' && indice < 2;
      const [da, a] = opzioni.livello === 'facile' ? coppiaStessaEra(casuale, max) : coppia(casuale, max, forza);
      voci.push(esercizio('quanti', [da, a]));
    }
  } else {
    const era = opzioni.livello === 'facile' ? (casuale() < 0.5 ? 'aC' : 'dC') : undefined;
    for (const voce of distinti(casuale, 6, max, era)) voci.push(esercizio('secolo', [voce]));
  }
  return {
    tipo: opzioni.tipo,
    livello: opzioni.livello,
    seed: opzioni.seed,
    titolo: TITOLI[opzioni.tipo],
    consegna: CONSEGNE[opzioni.tipo],
    voci,
  };
}

const LARGHEZZA = 281;
const ALTEZZA = 194;
const INK = '#1F2A44';
const SALVIA = '#3F6B4E';

function n(valore: number): string {
  return String(Math.round(valore * 100) / 100);
}

function esc(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function cifre(testo: string): string {
  return esc(testo).replace(/(\d+)/g, '<tspan class="cifre" font-family="Fraunces, serif">$1</tspan>');
}

export function svgSchedaAnni(scheda: SchedaAnni, soluzioni: boolean): string {
  const titolo = soluzioni ? 'Soluzioni' : scheda.titolo;
  const passo = scheda.tipo === 'ordine' ? 34 : 24;
  const righe = scheda.voci.map((voce, indice) => {
    const y = 36 + indice * passo;
    const risposta = soluzioni
      ? `<text x="16" y="${n(y + 8)}" fill="${SALVIA}" font-family="Fraunces, serif" font-size="4">${cifre(voce.soluzione)}</text>`
      : `<line data-ruolo="risposta" x1="16" y1="${n(y + 8)}" x2="200" y2="${n(y + 8)}" stroke="${INK}" stroke-width="0.35"/>`;
    return `<text class="cifre" x="8" y="${n(y)}" fill="${INK}" font-family="Fraunces, serif" font-size="3.4">${indice + 1}.</text><text x="16" y="${n(y)}" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.2">${cifre(voce.traccia)}</text>${risposta}`;
  });
  const etichetta = soluzioni ? 'Soluzioni' : scheda.titolo;
  return `<svg class="foglio-linea" xmlns="http://www.w3.org/2000/svg" width="${LARGHEZZA}mm" height="${ALTEZZA}mm" viewBox="0 0 ${LARGHEZZA} ${ALTEZZA}" role="img" aria-label="${esc(etichetta)}"><rect width="${LARGHEZZA}" height="${ALTEZZA}" fill="#ffffff"/><text x="8" y="12" fill="${INK}" font-family="Fraunces, serif" font-size="5">${esc(titolo)}</text><text x="8" y="18" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.8">${cifre(scheda.consegna)}</text><text x="8" y="25" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="3">Nome ______  Data ______</text><text x="230" y="12" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.6">Scheda <tspan class="cifre" font-family="Fraunces, serif">${scheda.seed}</tspan></text>${righe.join('')}</svg>`;
}
