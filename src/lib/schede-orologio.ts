import { mulberry32 } from './prng';
import { oraFormato, type FormatoOra } from './ora';

export type TipoSchedaOra = 'leggi' | 'disegna' | 'misto';
export type LivelloOra = 'intere' | 'mezze' | 'quarti' | 'cinque' | 'esatto';
export type VoceScheda = 'leggi' | 'disegna';

export interface OpzioniSchedaOra {
  tipo: TipoSchedaOra;
  livello: LivelloOra;
  formato: FormatoOra;
  quanti: 6 | 9 | 12;
  seed: number;
}

export interface EsercizioOra {
  ore: number;
  minuti: number;
  voce: VoceScheda;
}

export interface CellaOrologio {
  cx: number;
  cy: number;
  diametro: number;
  promptY: number;
  rigaX: number;
  rigaY: number;
  rigaL: number;
}

const MINUTI: Record<LivelloOra, number[]> = {
  intere: [0],
  mezze: [0, 30],
  quarti: [0, 15, 30, 45],
  cinque: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  esatto: Array.from({ length: 60 }, (_, indice) => indice),
};

export function opzioniSchedaDaQuery(params: URLSearchParams): OpzioniSchedaOra {
  const tipo = params.get('tipo');
  const livello = params.get('livello');
  const formato = params.get('formato');
  const quanti = Number(params.get('n'));
  const seme = params.get('seed');
  const seed = seme === null ? Number.NaN : Number(seme);
  return {
    tipo: tipo === 'disegna' || tipo === 'misto' ? tipo : 'leggi',
    livello: livello === 'mezze' || livello === 'quarti' || livello === 'cinque' || livello === 'esatto' ? livello : 'intere',
    formato: formato === 'digitale' || formato === 'entrambi' ? formato : 'parole',
    quanti: quanti === 9 || quanti === 12 ? quanti : 6,
    seed: Number.isInteger(seed) && seed >= 1 && seed <= 999999 ? seed : 1,
  };
}

export function querySchedaOra(opzioni: OpzioniSchedaOra): string {
  const params = new URLSearchParams();
  if (opzioni.tipo !== 'leggi') params.set('tipo', opzioni.tipo);
  if (opzioni.livello !== 'intere') params.set('livello', opzioni.livello);
  if (opzioni.formato !== 'parole') params.set('formato', opzioni.formato);
  if (opzioni.quanti !== 6) params.set('n', String(opzioni.quanti));
  if (opzioni.seed !== 1) params.set('seed', String(opzioni.seed));
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function hrefSchedaOra(path: string, opzioni: OpzioniSchedaOra): string {
  return `${path}${querySchedaOra(opzioni)}`;
}

export function generaEsercizi(opzioni: OpzioniSchedaOra): EsercizioOra[] {
  const casuale = mulberry32(opzioni.seed);
  const minuti = MINUTI[opzioni.livello];
  const massimo = 12 * minuti.length;
  const usati = new Set<string>();
  const esercizi: EsercizioOra[] = [];
  let giri = 0;
  while (esercizi.length < opzioni.quanti && giri < 800) {
    giri += 1;
    const ore = 1 + Math.floor(casuale() * 12);
    const minuto = minuti[Math.floor(casuale() * minuti.length)] ?? 0;
    const chiave = `${ore}:${minuto}`;
    if (usati.has(chiave) && usati.size < massimo) continue;
    usati.add(chiave);
    const voce: VoceScheda =
      opzioni.tipo === 'misto' ? (casuale() < 0.5 ? 'leggi' : 'disegna') : opzioni.tipo === 'disegna' ? 'disegna' : 'leggi';
    esercizi.push({ ore, minuti: minuto, voce });
  }
  return esercizi;
}

export function testoEsercizio(esercizio: EsercizioOra, formato: FormatoOra): string {
  return oraFormato(esercizio.ore, esercizio.minuti, formato);
}

export function consegnaScheda(tipo: TipoSchedaOra): string {
  if (tipo === 'disegna') return 'Disegna le lancette.';
  if (tipo === 'misto') return 'Leggi l’ora o disegna le lancette.';
  return 'Scrivi l’ora.';
}

export function layoutScheda(quanti: 6 | 9 | 12): CellaOrologio[] {
  const colonne = quanti === 6 ? 2 : 3;
  const righe = quanti / colonne;
  const margine = 8;
  const testata = 16;
  const fondo = 6;
  const spazioPrompt = 6;
  const spazioRiga = 8;
  const cellW = (210 - margine * 2) / colonne;
  const cellH = (297 - testata - fondo) / righe;
  const diametro = Math.min(60, cellW - 6, cellH - spazioPrompt - spazioRiga);
  const celle: CellaOrologio[] = [];
  for (let indice = 0; indice < quanti; indice += 1) {
    const colonna = indice % colonne;
    const riga = Math.floor(indice / colonne);
    const x0 = margine + colonna * cellW;
    const y0 = testata + riga * cellH;
    const cx = x0 + cellW / 2;
    const cy = y0 + spazioPrompt + diametro / 2;
    const rigaL = Math.max(45, Math.min(cellW - 6, 58));
    celle.push({
      cx,
      cy,
      diametro,
      promptY: y0 + 4,
      rigaX: cx - rigaL / 2,
      rigaY: cy + diametro / 2 + 5,
      rigaL,
    });
  }
  return celle;
}
