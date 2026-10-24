import { normalizza } from './normalize';
import { mescola, mulberry32 } from './prng';

export const LETTERE_ITALIANE = 'ABCDEFGHILMNOPQRSTUVZ';

export type Direzione = 'orizzontale' | 'verticale' | 'diagonale';

export interface OpzioniCrucipuzzle {
  parole: string[];
  lato: number;
  direzioni: Direzione[];
  contrario: boolean;
  seme: number;
}

export interface ParolaMessa {
  parola: string;
  riga: number;
  colonna: number;
  dr: number;
  dc: number;
}

export interface CrucipuzzleOk {
  ok: true;
  griglia: string[][];
  parole: ParolaMessa[];
}

export interface CrucipuzzleErrore {
  ok: false;
  motivo: string;
}

const VETTORI: Record<Direzione, Array<[number, number]>> = {
  orizzontale: [[0, 1]],
  verticale: [[1, 0]],
  diagonale: [
    [1, 1],
    [1, -1],
  ],
};

function vettoriDi(direzioni: Direzione[], contrario: boolean): Array<[number, number]> {
  const base = direzioni.flatMap((direzione) => VETTORI[direzione] ?? []);
  if (!contrario) return base;
  return [...base, ...base.map(([dr, dc]) => [-dr, -dc] as [number, number])];
}

function preparaParole(parole: string[], lato: number): string[] {
  const viste = new Set<string>();
  const pulite: string[] = [];
  for (const voce of parole) {
    const parola = normalizza(voce);
    if (parola.length < 2 || parola.length > lato || viste.has(parola)) continue;
    viste.add(parola);
    pulite.push(parola);
  }
  return pulite.sort((a, b) => b.length - a.length || a.localeCompare(b, 'it'));
}

function caselleLibere(parola: string, lato: number, vettore: [number, number]): Array<[number, number]> {
  const [dr, dc] = vettore;
  const posti: Array<[number, number]> = [];
  for (let riga = 0; riga < lato; riga += 1) {
    for (let colonna = 0; colonna < lato; colonna += 1) {
      const rigaFine = riga + dr * (parola.length - 1);
      const colonnaFine = colonna + dc * (parola.length - 1);
      if (rigaFine >= 0 && colonnaFine >= 0 && rigaFine < lato && colonnaFine < lato) posti.push([riga, colonna]);
    }
  }
  return posti;
}

function entra(griglia: string[][], parola: string, riga: number, colonna: number, dr: number, dc: number): boolean {
  for (let indice = 0; indice < parola.length; indice += 1) {
    const lettera = griglia[riga + dr * indice]?.[colonna + dc * indice];
    if (lettera && lettera !== parola[indice]) return false;
  }
  return true;
}

function scrivi(griglia: string[][], parola: string, riga: number, colonna: number, dr: number, dc: number): Array<[number, number]> {
  const nuovi: Array<[number, number]> = [];
  for (let indice = 0; indice < parola.length; indice += 1) {
    const r = riga + dr * indice;
    const c = colonna + dc * indice;
    if (!griglia[r]?.[c]) nuovi.push([r, c]);
    const rigaGriglia = griglia[r];
    if (rigaGriglia) rigaGriglia[c] = parola[indice] ?? '';
  }
  return nuovi;
}

function cancella(griglia: string[][], nuovi: Array<[number, number]>) {
  for (const [riga, colonna] of nuovi) {
    const rigaGriglia = griglia[riga];
    if (rigaGriglia) rigaGriglia[colonna] = '';
  }
}

export function generaCrucipuzzle(opzioni: OpzioniCrucipuzzle): CrucipuzzleOk | CrucipuzzleErrore {
  const lato = Math.max(4, Math.min(18, opzioni.lato));
  const parole = preparaParole(opzioni.parole, lato);
  const direzioni = vettoriDi(opzioni.direzioni, opzioni.contrario);
  if (parole.length === 0) return { ok: false, motivo: 'Scrivi almeno una parola di due lettere.' };
  if (direzioni.length === 0) return { ok: false, motivo: 'Scegli almeno una direzione.' };

  const casuale = mulberry32(opzioni.seme);
  const griglia = Array.from({ length: lato }, () => Array.from({ length: lato }, () => ''));
  const messe: ParolaMessa[] = [];
  let nodi = 0;

  function colloca(indice: number): boolean {
    if (indice >= parole.length) return true;
    if (nodi > 8000) return false;
    const parola = parole[indice] ?? '';
    const candidate = direzioni.flatMap(([dr, dc]) =>
      caselleLibere(parola, lato, [dr, dc]).map(([riga, colonna]) => ({ riga, colonna, dr, dc })),
    );
    for (const posto of mescola(candidate, casuale)) {
      nodi += 1;
      if (!entra(griglia, parola, posto.riga, posto.colonna, posto.dr, posto.dc)) continue;
      const nuovi = scrivi(griglia, parola, posto.riga, posto.colonna, posto.dr, posto.dc);
      messe.push({ parola, ...posto });
      if (colloca(indice + 1)) return true;
      messe.pop();
      cancella(griglia, nuovi);
    }
    return false;
  }

  if (!colloca(0)) {
    return { ok: false, motivo: 'Non tutte le parole entrano. Accorcia l’elenco o aumenta le caselle.' };
  }

  for (const riga of griglia) {
    for (let colonna = 0; colonna < riga.length; colonna += 1) {
      if (!riga[colonna]) {
        const lettera = LETTERE_ITALIANE[Math.floor(casuale() * LETTERE_ITALIANE.length)] ?? 'A';
        riga[colonna] = lettera;
      }
    }
  }

  return { ok: true, griglia, parole: messe };
}
