import { ANNO_SLUG } from '../config/site';
import regioni from './regioni.json';

export interface Regione {
  nome: string;
  slug: string;
  capoluogo: string;
  confinanti: string[];
  cartina: string;
  ordinePopolazione?: number;
}

export const FONTE_POPOLAZIONE = regioni.fontePopolazione;
export const REGIONI = regioni.voci as Regione[];

export function urlCalendarioRegione(slug: string): string {
  return `/calendario-scolastico/${ANNO_SLUG}/${slug}/`;
}

export function regioniPiuPopolose(): Regione[] {
  return REGIONI.filter((regione) => typeof regione.ordinePopolazione === 'number').sort(
    (a, b) => (a.ordinePopolazione ?? 0) - (b.ordinePopolazione ?? 0),
  );
}
