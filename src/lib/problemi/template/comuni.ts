import { equazione, formattaEuro, formattaNumero } from '../formato';
import { altri, ne, nomeCasuale, oggetto, plur, pronome, quanti, type Oggetto, type Persona } from '../lessico';
import type { Rng } from '../rng';
import type { Dato, DisegnoPrima, Istanza, Segno, Tag } from '../types';

export const mela = oggetto('mela');
export const matita = oggetto('matita');
export const libro = oggetto('libro');
export const fiore = oggetto('fiore');
export const biglia = oggetto('biglia');
export const figurina = oggetto('figurina');
export const adesivo = oggetto('adesivo');
export const pallone = oggetto('pallone');
export const quaderno = oggetto('quaderno');
export const caramella = oggetto('caramella');
export const pastello = oggetto('pastello');
export const bambino = oggetto('bambino');
export const alunno = oggetto('alunno');
export const succo = oggetto('succo');
export const fetta = oggetto('fetta');
export const bici = oggetto('bici');
export const scatola = oggetto('scatola');
export const sacchetto = oggetto('sacchetto');
export const cesto = oggetto('cesto');
export const scaffale = oggetto('scaffale');

export function iniziale(testo: string): string {
  return testo.charAt(0).toLocaleUpperCase('it') + testo.slice(1);
}

export function dentro20(rng: Rng): { a: number; b: number; tot: number } {
  const a = rng.intero(2, 10);
  const b = rng.intero(2, 20 - a);
  return { a, b, tot: a + b };
}

export function togli20(rng: Rng): { a: number; b: number; resto: number } {
  const a = rng.intero(4, 20);
  const b = rng.intero(2, a - 1);
  return { a, b, resto: a - b };
}

export function coppiaSomma(rng: Rng, massimoOggetto: number, massimoSomma: number): { a: number; b: number; tot: number } {
  const tetto = Math.min(massimoOggetto, massimoSomma - 2);
  const a = rng.intero(2, tetto);
  const b = rng.intero(2, Math.min(tetto, massimoSomma - a));
  return { a, b, tot: a + b };
}

export function coppiaCambio(rng: Rng, massimoOggetto: number, massimoSomma: number): { a: number; b: number; tot: number } | null {
  const tetto = Math.min(massimoOggetto, massimoSomma - 2);
  for (let tentativo = 0; tentativo < 16; tentativo += 1) {
    const a = rng.intero(2, tetto);
    const spazio = Math.min(tetto, massimoSomma - a);
    if (spazio < 2) continue;
    const b = rng.intero(2, spazio);
    if ((a % 10) + (b % 10) >= 10) return { a, b, tot: a + b };
  }
  return null;
}

export function coppiaResto(rng: Rng, massimo: number, minimo = 4): { a: number; b: number; resto: number } {
  const a = rng.intero(minimo, massimo);
  const b = rng.intero(2, a - 1);
  return { a, b, resto: a - b };
}

export function tabellina(rng: Rng, massimo = 100): { k: number; n: number; tot: number } | null {
  const k = rng.intero(2, 10);
  const n = rng.intero(2, Math.min(10, Math.floor(massimo / k)));
  if (n < 2) return null;
  return { k, n, tot: k * n };
}

export function divisioneEsatta(rng: Rng, massimoTotale: number, massimoGruppi: number): { totale: number; gruppi: number; ciascuno: number } | null {
  const gruppi = rng.intero(2, Math.min(10, massimoGruppi));
  const massimoCiascuno = Math.floor(massimoTotale / gruppi);
  if (massimoCiascuno < 2) return null;
  const ciascuno = rng.intero(2, Math.min(12, massimoCiascuno));
  return { totale: gruppi * ciascuno, gruppi, ciascuno };
}

export function qta(ogg: Oggetto, valore: number): Dato {
  return { etichetta: valore === 1 ? ogg.singolare : ogg.plurale, valore, tipo: 'quantita' };
}

export function prezzo(etichetta: string, valore: number): Dato {
  return { etichetta, valore, tipo: 'prezzo' };
}

export function altro(etichetta: string, valore: number): Dato {
  return { etichetta, valore, tipo: 'altro' };
}

export function passo(a: number, segno: Segno, b: number): string {
  return equazione(a, segno, b);
}

export function resta(n: number, ogg: Oggetto): string {
  return `${n === 1 ? 'Resta' : 'Restano'} ${plur(n, ogg)}.`;
}

export function ciSono(n: number, ogg: Oggetto): string {
  return `${n === 1 ? 'C’è' : 'Ci sono'} ${plur(n, ogg)}.`;
}

export function riceve(persona: Persona): string {
  return iniziale(pronome(persona.genere));
}

export function scheda(input: {
  testo: string;
  dati: Dato[];
  operazioni: string[];
  risultato: number;
  unita: string;
  risposta: string;
  tags: Tag[];
  passi: 1 | 2 | 3;
  aiutoVisivo?: string;
  disegno?: DisegnoPrima;
  consentiUno?: boolean;
}): Istanza {
  return { id: '', ...input };
}

export function frazioneSvg(numeratore: number, denominatore: number): string {
  return `<svg width="12mm" height="14mm" viewBox="0 0 24 32" aria-hidden="true"><text x="12" y="12" text-anchor="middle" font-family="Fraunces, serif" font-size="12" fill="#1F2A44">${numeratore}</text><line x1="4" y1="16" x2="20" y2="16" stroke="#1F2A44" stroke-width="1.2"/><text x="12" y="28" text-anchor="middle" font-family="Fraunces, serif" font-size="12" fill="#1F2A44">${denominatore}</text></svg>`;
}

export function euro(n: number): string {
  return formattaEuro(n);
}

export { altri, equazione, formattaEuro, formattaNumero, ne, nomeCasuale, plur, pronome, quanti };
