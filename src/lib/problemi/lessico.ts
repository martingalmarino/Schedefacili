import type { Rng } from './rng';

export type Genere = 'm' | 'f';
export type Articolo = 'def' | 'indef';

export interface Persona {
  nome: string;
  genere: Genere;
}

export interface Oggetto {
  id: string;
  singolare: string;
  plurale: string;
  genere: Genere;
  articolo: string;
  min: number;
  max: number;
  prezzoMin: number;
  prezzoMax: number;
}

export const NOMI_M: readonly Persona[] = [
  { nome: 'Luca', genere: 'm' },
  { nome: 'Marco', genere: 'm' },
  { nome: 'Matteo', genere: 'm' },
  { nome: 'Leonardo', genere: 'm' },
  { nome: 'Tommaso', genere: 'm' },
  { nome: 'Andrea', genere: 'm' },
  { nome: 'Lorenzo', genere: 'm' },
  { nome: 'Francesco', genere: 'm' },
  { nome: 'Alessandro', genere: 'm' },
  { nome: 'Giovanni', genere: 'm' },
  { nome: 'Riccardo', genere: 'm' },
  { nome: 'Edoardo', genere: 'm' },
];

export const NOMI_F: readonly Persona[] = [
  { nome: 'Giulia', genere: 'f' },
  { nome: 'Sofia', genere: 'f' },
  { nome: 'Aurora', genere: 'f' },
  { nome: 'Alice', genere: 'f' },
  { nome: 'Emma', genere: 'f' },
  { nome: 'Chiara', genere: 'f' },
  { nome: 'Beatrice', genere: 'f' },
  { nome: 'Greta', genere: 'f' },
  { nome: 'Anna', genere: 'f' },
  { nome: 'Martina', genere: 'f' },
  { nome: 'Giorgia', genere: 'f' },
  { nome: 'Elisa', genere: 'f' },
];

export const NOMI: readonly Persona[] = [...NOMI_M, ...NOMI_F];

function vocale(parola: string): boolean {
  return /^[aeiouàèéìòù]/i.test(parola);
}

function formaLo(parola: string): boolean {
  return vocale(parola) || /^(?:gn|ps|x|y|z|s[^aeiouàèéìòù])/i.test(parola);
}

function articoloDefinito(ogg: Pick<Oggetto, 'genere' | 'singolare' | 'plurale'>, n: number): string {
  if (n === 1) {
    if (ogg.genere === 'f') return vocale(ogg.singolare) ? 'l’' : 'la';
    if (vocale(ogg.singolare)) return 'l’';
    return formaLo(ogg.singolare) ? 'lo' : 'il';
  }
  if (ogg.genere === 'f') return 'le';
  return formaLo(ogg.plurale) ? 'gli' : 'i';
}

function articoloIndefinito(ogg: Pick<Oggetto, 'genere' | 'singolare' | 'plurale'>, n: number): string {
  if (n === 1) {
    if (ogg.genere === 'f') return vocale(ogg.singolare) ? 'un’' : 'una';
    return formaLo(ogg.singolare) && !vocale(ogg.singolare) ? 'uno' : 'un';
  }
  if (ogg.genere === 'f') return 'delle';
  return formaLo(ogg.plurale) ? 'degli' : 'dei';
}

function crea(voce: Omit<Oggetto, 'articolo'>): Oggetto {
  const ogg: Oggetto = { ...voce, articolo: '' };
  ogg.articolo = articoloDefinito(ogg, 1);
  return ogg;
}

export const OGGETTI: readonly Oggetto[] = [
  crea({ id: 'figurina', singolare: 'figurina', plurale: 'figurine', genere: 'f', min: 2, max: 300, prezzoMin: 0.5, prezzoMax: 2 }),
  crea({ id: 'quaderno', singolare: 'quaderno', plurale: 'quaderni', genere: 'm', min: 1, max: 30, prezzoMin: 1, prezzoMax: 4 }),
  crea({ id: 'matita', singolare: 'matita', plurale: 'matite', genere: 'f', min: 2, max: 48, prezzoMin: 0.5, prezzoMax: 2 }),
  crea({ id: 'pallone', singolare: 'pallone', plurale: 'palloni', genere: 'm', min: 2, max: 20, prezzoMin: 5, prezzoMax: 25 }),
  crea({ id: 'caramella', singolare: 'caramella', plurale: 'caramelle', genere: 'f', min: 2, max: 200, prezzoMin: 0.1, prezzoMax: 1 }),
  crea({ id: 'libro', singolare: 'libro', plurale: 'libri', genere: 'm', min: 1, max: 20, prezzoMin: 5, prezzoMax: 25 }),
  crea({ id: 'mela', singolare: 'mela', plurale: 'mele', genere: 'f', min: 2, max: 40, prezzoMin: 0.5, prezzoMax: 2 }),
  crea({ id: 'biglia', singolare: 'biglia', plurale: 'biglie', genere: 'f', min: 2, max: 100, prezzoMin: 0.1, prezzoMax: 1 }),
  crea({ id: 'adesivo', singolare: 'adesivo', plurale: 'adesivi', genere: 'm', min: 2, max: 200, prezzoMin: 0.1, prezzoMax: 2 }),
  crea({ id: 'fiore', singolare: 'fiore', plurale: 'fiori', genere: 'm', min: 2, max: 40, prezzoMin: 1, prezzoMax: 5 }),
  crea({ id: 'bici', singolare: 'bici', plurale: 'bici', genere: 'f', min: 1, max: 3, prezzoMin: 80, prezzoMax: 400 }),
  crea({ id: 'pastello', singolare: 'pastello', plurale: 'pastelli', genere: 'm', min: 2, max: 80, prezzoMin: 0.5, prezzoMax: 2 }),
  crea({ id: 'bambino', singolare: 'bambino', plurale: 'bambini', genere: 'm', min: 2, max: 30, prezzoMin: 1, prezzoMax: 1 }),
  crea({ id: 'alunno', singolare: 'alunno', plurale: 'alunni', genere: 'm', min: 2, max: 40, prezzoMin: 1, prezzoMax: 1 }),
  crea({ id: 'succo', singolare: 'succo', plurale: 'succhi', genere: 'm', min: 2, max: 12, prezzoMin: 0.5, prezzoMax: 3.5 }),
  crea({ id: 'fetta', singolare: 'fetta', plurale: 'fette', genere: 'f', min: 2, max: 12, prezzoMin: 1, prezzoMax: 3 }),
];

export const CONTENITORI: readonly Oggetto[] = [
  crea({ id: 'scatola', singolare: 'scatola', plurale: 'scatole', genere: 'f', min: 2, max: 12, prezzoMin: 1, prezzoMax: 5 }),
  crea({ id: 'sacchetto', singolare: 'sacchetto', plurale: 'sacchetti', genere: 'm', min: 2, max: 12, prezzoMin: 1, prezzoMax: 4 }),
  crea({ id: 'cesto', singolare: 'cesto', plurale: 'cesti', genere: 'm', min: 1, max: 6, prezzoMin: 2, prezzoMax: 15 }),
  crea({ id: 'scaffale', singolare: 'scaffale', plurale: 'scaffali', genere: 'm', min: 1, max: 8, prezzoMin: 10, prezzoMax: 80 }),
];

const TUTTI = [...OGGETTI, ...CONTENITORI];

export function trovaOggetto(etichetta: string): Oggetto | undefined {
  const chiave = etichetta.trim().toLocaleLowerCase('it');
  return TUTTI.find((ogg) => ogg.singolare === chiave || ogg.plurale === chiave || ogg.id === chiave);
}

export function plur(n: number, ogg: Oggetto): string {
  return `${n} ${n === 1 ? ogg.singolare : ogg.plurale}`;
}

export function art(ogg: Oggetto, tipo: Articolo, n = 1): string {
  return tipo === 'def' ? articoloDefinito(ogg, n) : articoloIndefinito(ogg, n);
}

export function pronome(genere: Genere): 'gli' | 'le' {
  return genere === 'f' ? 'le' : 'gli';
}

export function ne(): 'ne' {
  return 'ne';
}

export function eAndato(persona: Persona): string {
  return `${persona.nome} è andat${persona.genere === 'f' ? 'a' : 'o'}`;
}

export function nomeCasuale(rng: Rng, genere?: Genere): Persona {
  const base = genere === 'm' ? NOMI_M : genere === 'f' ? NOMI_F : NOMI;
  const liberi = base.filter((persona) => !rng.nomiPresi.includes(persona.nome));
  const persona = rng.scegli(liberi.length > 0 ? liberi : base);
  if (!rng.nomiPresi.includes(persona.nome)) rng.nomiPresi.push(persona.nome);
  return persona;
}

export function oggetto(id: string): Oggetto {
  const trovato = TUTTI.find((voce) => voce.id === id);
  if (!trovato) throw new Error(`Oggetto sconosciuto: ${id}`);
  return trovato;
}

export function quanti(ogg: Oggetto): string {
  return `${ogg.genere === 'f' ? 'Quante' : 'Quanti'} ${ogg.plurale}`;
}

export function altri(ogg: Oggetto): string {
  return ogg.genere === 'f' ? 'altre' : 'altri';
}

export function quantita(rng: Rng, ogg: Oggetto, consentiUno = false): number {
  const minimo = consentiUno ? Math.max(1, ogg.min) : Math.max(2, ogg.min);
  return rng.intero(Math.min(minimo, ogg.max), ogg.max);
}

export function prezzo(rng: Rng, ogg: Oggetto, classe: number): number {
  if (classe <= 3) return rng.intero(Math.ceil(ogg.prezzoMin), Math.floor(ogg.prezzoMax));
  const minimo = Math.round(ogg.prezzoMin * 10);
  const massimo = Math.round(ogg.prezzoMax * 10);
  return rng.intero(minimo, massimo) / 10;
}
