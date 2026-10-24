import { mescola, mulberry32 } from './prng';

export type Buco = 'a' | 'b' | 'prodotto';
export type TipoEsercizio = 'prodotto' | 'fattore' | 'misto';

export interface RigaTabellina {
  fattore: number;
  prodotto: number;
}

export interface Esercizio {
  fattoreA: number;
  fattoreB: number;
  prodotto: number;
  nascosto: Buco;
}

export const NUMERI_TABELLINE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function articoloTabellina(n: number): string {
  return n === 1 || n === 8 ? 'dell’' : 'del ';
}

export function slugTabellina(n: number): string {
  return n === 1 || n === 8 ? `tabellina-dell-${n}` : `tabellina-del-${n}`;
}

export function nomeTabellina(n: number): string {
  return `Tabellina ${articoloTabellina(n)}${n}`;
}

export function h1Tabellina(n: number): string {
  return `${nomeTabellina(n)} da stampare`;
}

export function titoloTabellina(n: number): string {
  return `${h1Tabellina(n)} (PDF A4) e esercizi`;
}

export function descrizioneTabellina(n: number): string {
  return `La tabellina ${articoloTabellina(n)}${n} da stampare in PDF, con esercizi a completamento e versione DSA ad alta leggibilità. Gratis.`;
}

export function percorsoTabellina(n: number): string {
  return `/tabelline/${slugTabellina(n)}/`;
}

export function tabella(n: number): RigaTabellina[] {
  return Array.from({ length: 10 }, (_, indice) => {
    const fattore = indice + 1;
    return { fattore, prodotto: n * fattore };
  });
}

export function tavolaPitagorica(): number[][] {
  return Array.from({ length: 10 }, (_, riga) => Array.from({ length: 10 }, (_, colonna) => (riga + 1) * (colonna + 1)));
}

function scegliBuco(tipo: TipoEsercizio, casuale: () => number): Buco {
  if (tipo === 'prodotto') return 'prodotto';
  if (tipo === 'fattore') return casuale() < 0.5 ? 'a' : 'b';
  const sorteggio = casuale();
  if (sorteggio < 0.5) return 'prodotto';
  if (sorteggio < 0.75) return 'b';
  return 'a';
}

export function esercizi(numeri: number[], quantita: number, seme: number, tipo: TipoEsercizio = 'misto'): Esercizio[] {
  const validi = numeri.filter((n) => n >= 1 && n <= 10);
  if (validi.length === 0 || quantita < 1) return [];
  const casuale = mulberry32(seme);
  const pool = validi.flatMap((n) => tabella(n).map((riga) => ({ fattoreA: n, fattoreB: riga.fattore, prodotto: riga.prodotto })));
  const scelti = mescola(pool, casuale).slice(0, Math.min(quantita, pool.length));
  while (scelti.length < quantita) {
    const base = pool[Math.floor(casuale() * pool.length)];
    if (base) scelti.push(base);
  }
  return scelti.map((voce) => ({ ...voce, nascosto: scegliBuco(tipo, casuale) }));
}

export function eserciziTabellina(n: number, quantita = 10, seme = n * 1000 + 7): Esercizio[] {
  return esercizi([n], quantita, seme, 'misto');
}

export function soluzioneDi(esercizio: Esercizio): number {
  if (esercizio.nascosto === 'a') return esercizio.fattoreA;
  if (esercizio.nascosto === 'b') return esercizio.fattoreB;
  return esercizio.prodotto;
}
