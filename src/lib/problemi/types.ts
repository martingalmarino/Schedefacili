import type { Rng } from './rng';

export type Classe = 1 | 2 | 3 | 4 | 5;

export type Tag =
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'euro'
  | 'frazioni'
  | 'decimali'
  | 'misure'
  | 'percentuali'
  | 'geometria'
  | 'multi';

export type Segno = '+' | '−' | '×' | ':';

export type Spazi = 'dati' | 'risposta';

export interface Dato {
  etichetta: string;
  valore: number | string;
  tipo?: 'quantita' | 'prezzo' | 'altro';
}

export interface Istanza {
  id: string;
  testo: string;
  dati: Dato[];
  operazioni: string[];
  risultato: number;
  unita: string;
  risposta: string;
  aiutoVisivo?: string;
  tags: Tag[];
  passi: 1 | 2 | 3;
  consentiUno?: boolean;
}

export interface Template {
  id: string;
  classe: Classe;
  tags: Tag[];
  passi: 1 | 2 | 3;
  genera(rng: Rng): Istanza | null;
}

export interface OpzioniScheda {
  seed: number;
  classe: Classe;
  n: number;
  operazioni: Tag[];
  dueOperazioni: boolean;
  spazi: Spazi;
}

export const OPERAZIONI_CLASSE: Record<Classe, Tag[]> = {
  1: ['add', 'sub'],
  2: ['add', 'sub', 'mul', 'div'],
  3: ['add', 'sub', 'mul', 'div', 'euro'],
  4: ['add', 'sub', 'mul', 'div', 'euro', 'frazioni', 'decimali', 'misure'],
  5: ['add', 'sub', 'mul', 'div', 'euro', 'frazioni', 'decimali', 'misure', 'percentuali', 'geometria', 'multi'],
};

export const MASSIMO_CLASSE: Record<Classe, number> = {
  1: 20,
  2: 100,
  3: 1000,
  4: 10_000,
  5: 100_000,
};

export const CLASSE_IN_LETTERE: Record<Classe, string> = {
  1: 'prima',
  2: 'seconda',
  3: 'terza',
  4: 'quarta',
  5: 'quinta',
};
