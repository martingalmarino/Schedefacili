import { mulberry32, mescola } from './prng';
import { fromRoman, toRoman } from './romani';

export const SEME_FISSO = 1;

export interface OpzioniSchedeRomane {
  seed: number;
  fino: 20 | 100;
}

export interface VoceEsercizio {
  traccia: string;
  soluzione: string;
}

export interface SchedaRomana {
  id: string;
  titolo: string;
  consegna: string;
  voci: VoceEsercizio[];
}

const FALSI: VoceEsercizio[] = [
  { traccia: 'IIII vale 4', soluzione: 'Falso' },
  { traccia: 'VX vale 15', soluzione: 'Falso' },
  { traccia: 'IC vale 99', soluzione: 'Falso' },
  { traccia: 'VV vale 10', soluzione: 'Falso' },
  { traccia: 'IL vale 49', soluzione: 'Falso' },
  { traccia: 'XXXX vale 40', soluzione: 'Falso' },
];

export function opzioniRomaniDaQuery(params: URLSearchParams): OpzioniSchedeRomane {
  const seed = Number(params.get('seed'));
  return {
    seed: Number.isInteger(seed) && seed >= 1 && seed <= 999999 ? seed : SEME_FISSO,
    fino: params.get('fino') === '100' ? 100 : 20,
  };
}

export function queryRomani(opzioni: OpzioniSchedeRomane): string {
  const params = new URLSearchParams();
  if (opzioni.seed !== SEME_FISSO) params.set('seed', String(opzioni.seed));
  if (opzioni.fino !== 20) params.set('fino', '100');
  const query = params.toString();
  return query ? `?${query}` : '';
}

function pesca(casuale: () => number, quanti: number, min: number, max: number): number[] {
  const usati = new Set<number>();
  const esito: number[] = [];
  let giri = 0;
  while (esito.length < quanti && giri < 800) {
    giri += 1;
    const numero = min + Math.floor(casuale() * (max - min + 1));
    if (usati.has(numero)) continue;
    usati.add(numero);
    esito.push(numero);
  }
  return esito;
}

function serie(inizio: number, passo: number): VoceEsercizio {
  const valori = [0, 1, 2, 3, 4].map((indice) => inizio + indice * passo);
  const pezzi = valori.map((numero, indice) => (indice === 2 ? '___' : toRoman(numero)));
  return { traccia: pezzi.join(', '), soluzione: toRoman(valori[2] ?? inizio) };
}

function schedaSequenza(casuale: () => number): VoceEsercizio[] {
  const voci: VoceEsercizio[] = [];
  for (let indice = 0; indice < 6; indice += 1) {
    const tipo = Math.floor(casuale() * 3);
    if (tipo === 0) voci.push(serie(1 + Math.floor(casuale() * 15), 1));
    else if (tipo === 1) voci.push(serie((1 + Math.floor(casuale() * 5)) * 10, 10));
    else voci.push(serie(1 + Math.floor(casuale() * 8), 5));
  }
  return voci;
}

export function generaSchede(opzioni: OpzioniSchedeRomane): SchedaRomana[] {
  const casuale = mulberry32(opzioni.seed);
  const quanti = opzioni.fino === 100 ? 12 : 10;
  const romani = pesca(casuale, quanti, 1, opzioni.fino).map((numero) => ({
    traccia: String(numero),
    soluzione: toRoman(numero),
  }));
  const arabi = pesca(casuale, 10, 1, opzioni.fino === 100 ? 100 : 30).map((numero) => ({
    traccia: toRoman(numero),
    soluzione: String(numero),
  }));
  const veri = pesca(casuale, 6, 1, 40).map((numero) => ({
    traccia: `${toRoman(numero)} vale ${numero}`,
    soluzione: 'Vero',
  }));
  const falso = mescola(FALSI, casuale).slice(0, 4);
  const vero = mescola(veri, casuale).slice(0, 4);
  return [
    {
      id: 'in-romani',
      titolo: 'Scrivi in numeri romani',
      consegna: opzioni.fino === 100 ? 'Da 1 a 100.' : 'Da 1 a 20.',
      voci: romani,
    },
    {
      id: 'in-arabi',
      titolo: 'Scrivi in numeri arabi',
      consegna: 'Leggi il romano e scrivi il numero.',
      voci: arabi,
    },
    {
      id: 'vero-falso',
      titolo: 'Vero o falso',
      consegna: 'Scrivi Vero o Falso.',
      voci: mescola([...falso, ...vero], casuale),
    },
    {
      id: 'sequenza',
      titolo: 'Completa la sequenza',
      consegna: 'Scrivi il numero che manca.',
      voci: schedaSequenza(casuale),
    },
  ];
}

function esc(testo: string): string {
  return testo
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function classeNumero(testo: string): string {
  return /^(?:\d+|[IVXLCDM]+)$/.test(testo) ? ' class="numeri-ora cifre"' : '';
}

export function markupSchedaRomana(scheda: SchedaRomana, soluzioni: boolean): string {
  const colonne = 2;
  const righe = Math.ceil(scheda.voci.length / colonne);
  const testata = 26;
  const cellW = (210 - 20) / colonne;
  const cellH = (297 - testata - 8) / righe;
  const rigaL = Math.max(45, Math.min(cellW - 14, 70));
  const pezzi = [
    '<rect width="210" height="297" fill="#ffffff"/>',
    soluzioni
      ? '<text class="numeri-ora" x="105" y="12" text-anchor="middle" fill="#1F2A44" font-family="Fraunces, serif" font-size="7">Soluzioni</text>'
      : [
          `<text class="numeri-ora" x="12" y="11" fill="#1F2A44" font-family="Fraunces, serif" font-size="5">${esc(scheda.titolo)}</text>`,
          '<text x="12" y="19" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.2">Nome ______</text>',
          `<text x="198" y="19" text-anchor="end" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.2">${esc(scheda.consegna)}</text>`,
        ].join(''),
  ];
  if (soluzioni) {
    pezzi.push(
      `<text x="105" y="20" text-anchor="middle" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.2">${esc(scheda.titolo)}</text>`,
    );
  }
  scheda.voci.forEach((voce, indice) => {
    const colonna = indice % colonne;
    const riga = Math.floor(indice / colonne);
    const x = 10 + colonna * cellW;
    const y = testata + riga * cellH;
    const ancora = x + 8;
    pezzi.push(
      `<text x="${ancora}" y="${(y + 8).toFixed(2)}" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.6"${classeNumero(voce.traccia)}>${esc(voce.traccia)}</text>`,
    );
    const lineaY = y + 16;
    pezzi.push(
      `<line x1="${ancora}" y1="${lineaY.toFixed(2)}" x2="${(ancora + rigaL).toFixed(2)}" y2="${lineaY.toFixed(2)}" stroke="#1F2A44" stroke-width="0.35" data-lunghezza="${rigaL.toFixed(2)}"/>`,
    );
    if (soluzioni) {
      pezzi.push(
        `<text x="${ancora}" y="${(lineaY - 1.4).toFixed(2)}" fill="#1F2A44" font-family="Fraunces, serif" font-size="4"${classeNumero(voce.soluzione)}>${esc(voce.soluzione)}</text>`,
      );
    }
  });
  return pezzi.join('');
}

export function svgSchedaRomana(scheda: SchedaRomana, soluzioni: boolean): string {
  const id = `${scheda.id}-${soluzioni ? 'soluzioni' : 'scheda'}`;
  const etichetta = soluzioni ? `Soluzioni: ${scheda.titolo}` : scheda.titolo;
  return `<svg id="${id}" class="foglio-a4" xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img" aria-label="${esc(etichetta)}">${markupSchedaRomana(scheda, soluzioni)}</svg>`;
}

export function simboloRomanoValido(traccia: string): boolean {
  const token = traccia.split(' ')[0] ?? '';
  try {
    fromRoman(token);
    return true;
  } catch {
    return false;
  }
}
