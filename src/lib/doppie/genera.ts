import { COMPLETE, COPPIE, NOMI_DOPPIE, PAROLE, SCEGLI, type CoppiaDato, type Parola } from '../../data/doppie/parole';
import { creaRng, type Rng } from './rng';
import type {
  ClasseDoppie,
  Esercizio,
  OpzioniDoppie,
  SchedaDoppie,
  TipoEsercizio,
  VoceCompleta,
  VoceCoppie,
  VoceIntruso,
  VoceScegli,
  VoceSillabe,
} from './types';
import { ESERCIZI_CLASSE, TIPI_ESERCIZIO } from './types';

const DOPPIE_PRIMA = new Set(['ll', 'tt', 'ss', 'mm', 'nn', 'pp']);

const CONSEGNA: Record<TipoEsercizio, string> = {
  completa: 'Completa la parola con una o due consonanti.',
  scegli: 'Cerchia la parola scritta bene.',
  coppie: 'Scegli la parola giusta e scrivila nella frase.',
  sillabe: 'Dividi in sillabe.',
  intruso: 'Cerchia l’intruso: la parola senza doppia.',
};

const QUANTI: Record<ClasseDoppie, Record<TipoEsercizio, number>> = {
  1: { completa: 6, scegli: 6, coppie: 6, sillabe: 6, intruso: 4 },
  2: { completa: 6, scegli: 6, coppie: 6, sillabe: 4, intruso: 3 },
  3: { completa: 6, scegli: 6, coppie: 6, sillabe: 4, intruso: 3 },
  4: { completa: 5, scegli: 5, coppie: 5, sillabe: 4, intruso: 3 },
};

const CATALOGO = new Set<string>([
  ...PAROLE.map((voce) => voce.parola),
  ...COMPLETE.map((voce) => voce.parola),
  ...SCEGLI.map((voce) => voce.corretta),
  ...COPPIE.flatMap((voce) => [voce.semplice, voce.doppia]),
]);

function chiave(parola: string): string {
  return parola.toLocaleLowerCase('it');
}

function nomiIn(testo: string): string[] {
  return NOMI_DOPPIE.filter((nome) => new RegExp(`\\b${nome}\\b`, 'u').test(testo));
}

function tokenCatalogo(testo: string): string[] {
  return testo
    .split(/[^\p{L}]+/u)
    .map((pezzo) => chiave(pezzo))
    .filter((pezzo) => CATALOGO.has(pezzo));
}

function ammette(classe: ClasseDoppie, voce: Parola): boolean {
  if (voce.classeMin > classe) return false;
  if (classe === 1) {
    if (voce.sillabe.length > 3) return false;
    if (voce.doppia && !DOPPIE_PRIMA.has(voce.doppia)) return false;
    if (voce.altra && !DOPPIE_PRIMA.has(voce.altra)) return false;
  }
  if (classe === 2 && voce.sillabe.length > 4) return false;
  return true;
}

function spezza(frase: string, parola: string): { prima: string; dopo: string } | null {
  const trovato = frase.match(new RegExp(`\\b${parola}\\b`, 'u'));
  if (!trovato || trovato.index === undefined) return null;
  return {
    prima: frase.slice(0, trovato.index).trimEnd(),
    dopo: frase.slice(trovato.index + parola.length).trimStart(),
  };
}

function perClasse<T extends { classeMin: number }>(rng: Rng, lista: readonly T[], classe: ClasseDoppie): T[] {
  return ([4, 3, 2, 1] as const)
    .filter((livello) => livello <= classe)
    .flatMap((livello) => rng.mescola(lista.filter((voce) => voce.classeMin === livello)));
}

function occupa(usate: Set<string>, parole: string[]) {
  for (const parola of parole) usate.add(chiave(parola));
}

function libera(usate: Set<string>, parole: string[]): boolean {
  return parole.every((parola) => !usate.has(chiave(parola)));
}

function completa(rng: Rng, classe: ClasseDoppie, n: number, usate: Set<string>): VoceCompleta[] {
  const pool = perClasse(
    rng,
    COMPLETE.filter((voce) => voce.classeMin <= classe && (classe > 1 || DOPPIE_PRIMA.has(voce.doppia)) && libera(usate, [voce.parola])),
    classe,
  );
  return pool.slice(0, n).map((voce) => {
    occupa(usate, [voce.parola]);
    return { prima: voce.prima, dopo: voce.dopo, semplice: voce.semplice, doppia: voce.doppia, soluzione: voce.doppia };
  });
}

function scegli(rng: Rng, classe: ClasseDoppie, n: number, usate: Set<string>): VoceScegli[] {
  const pool = perClasse(
    rng,
    SCEGLI.filter((voce) => {
      if (voce.classeMin > classe || !libera(usate, [voce.corretta, voce.errata])) return false;
      const parola = PAROLE.find((candidato) => candidato.parola === voce.corretta);
      return parola ? ammette(classe, parola) : classe >= voce.classeMin;
    }),
    classe,
  );
  const scelti = pool.slice(0, n);
  const aSinistra = rng.mescola(Array.from({ length: scelti.length }, (_, indice) => indice < Math.floor(scelti.length / 2)));
  return scelti.map((voce, indice) => {
    occupa(usate, [voce.corretta, voce.errata]);
    const correttaPrima = aSinistra[indice] ?? false;
    return correttaPrima
      ? { sinistra: voce.corretta, destra: voce.errata, corretta: 'sinistra' as const }
      : { sinistra: voce.errata, destra: voce.corretta, corretta: 'destra' as const };
  });
}

function provaCoppia(voce: CoppiaDato, lato: 'semplice' | 'doppia', usate: Set<string>, nomi: Set<string>): VoceCoppie | null {
  const parola = lato === 'semplice' ? voce.semplice : voce.doppia;
  const frase = lato === 'semplice' ? voce.fraseSemplice : voce.fraseDoppia;
  const nomiFrase = nomiIn(frase);
  if (nomiFrase.some((nome) => nomi.has(nome))) return null;
  const pezzi = spezza(frase, parola);
  if (!pezzi) return null;
  const extra = tokenCatalogo(frase).filter((token) => token !== chiave(voce.semplice) && token !== chiave(voce.doppia));
  if (!libera(usate, [voce.semplice, voce.doppia, ...extra])) return null;
  occupa(usate, [voce.semplice, voce.doppia, ...extra]);
  for (const nome of nomiFrase) nomi.add(nome);
  return { prima: pezzi.prima, dopo: pezzi.dopo, semplice: voce.semplice, doppia: voce.doppia, soluzione: parola };
}

function coppie(rng: Rng, classe: ClasseDoppie, n: number, usate: Set<string>, nomi: Set<string>): VoceCoppie[] {
  const pool = perClasse(rng, COPPIE.filter((voce) => voce.classeMin <= classe), classe);
  const obiettivoSemplice = Math.floor(n / 2);
  const obiettivoDoppia = n - obiettivoSemplice;
  let semplici = 0;
  let doppie = 0;
  const voci: VoceCoppie[] = [];
  for (const voce of pool) {
    if (voci.length >= n) break;
    const restano = n - voci.length;
    const mancanoSemplici = obiettivoSemplice - semplici;
    const mancanoDoppie = obiettivoDoppia - doppie;
    const preferito: 'semplice' | 'doppia' = rng.successivo() < 0.5 ? 'semplice' : 'doppia';
    const ordine: Array<'semplice' | 'doppia'> =
      mancanoSemplici >= restano ? ['semplice'] : mancanoDoppie >= restano ? ['doppia'] : preferito === 'semplice' ? ['semplice', 'doppia'] : ['doppia', 'semplice'];
    for (const lato of ordine) {
      if (lato === 'semplice' && semplici >= obiettivoSemplice) continue;
      if (lato === 'doppia' && doppie >= obiettivoDoppia) continue;
      const costruita = provaCoppia(voce, lato, usate, nomi);
      if (!costruita) continue;
      if (lato === 'semplice') semplici += 1;
      else doppie += 1;
      voci.push(costruita);
      break;
    }
  }
  return rng.mescola(voci);
}

function sillabe(rng: Rng, classe: ClasseDoppie, n: number, usate: Set<string>, dsa: boolean): VoceSillabe[] {
  const pool = perClasse(rng, PAROLE.filter((voce) => voce.doppia && ammette(classe, voce) && libera(usate, [voce.parola])), classe);
  const tratto = dsa ? ' - ' : '-';
  return pool.slice(0, n).map((voce) => {
    occupa(usate, [voce.parola]);
    return { parola: voce.parola, soluzione: voce.sillabe.join(tratto) };
  });
}

function intruso(rng: Rng, classe: ClasseDoppie, n: number, usate: Set<string>): VoceIntruso[] {
  const doppie = perClasse(rng, PAROLE.filter((voce) => voce.doppia && ammette(classe, voce) && libera(usate, [voce.parola])), classe);
  const semplici = perClasse(rng, PAROLE.filter((voce) => !voce.doppia && ammette(classe, voce) && libera(usate, [voce.parola])), classe);
  const righe = Math.min(n, Math.floor(doppie.length / 3), semplici.length);
  const voci: VoceIntruso[] = [];
  let mazzo: number[] = [];
  let precedente = -1;
  for (let riga = 0; riga < righe; riga += 1) {
    if (mazzo.length === 0) mazzo = rng.mescola([0, 1, 2, 3]);
    let indice = mazzo.pop() ?? 0;
    if (indice === precedente && mazzo.length > 0) {
      const altro = mazzo.pop() ?? indice;
      mazzo.push(indice);
      indice = altro;
    }
    precedente = indice;
    const tre = doppie.slice(riga * 3, riga * 3 + 3).map((voce) => voce.parola);
    const intrusoParola = semplici[riga]?.parola ?? '';
    const ordine = rng.mescola(tre);
    const parole = [0, 1, 2, 3].map((posto) => (posto === indice ? intrusoParola : (ordine.shift() ?? '')));
    occupa(usate, parole);
    voci.push({ parole, indice });
  }
  return voci;
}

function costruisci(classe: ClasseDoppie, tipi: TipoEsercizio[], rng: Rng, dsa: boolean): Esercizio[] {
  const usate = new Set<string>();
  const nomi = new Set<string>();
  const esercizi: Esercizio[] = [];
  const attivi = dsa ? TIPI_ESERCIZIO.filter((tipo) => tipi.includes(tipo)).slice(0, 4) : tipi;
  for (const tipo of TIPI_ESERCIZIO) {
    if (!attivi.includes(tipo)) continue;
    const n = dsa ? Math.min(QUANTI[classe][tipo], 4) : QUANTI[classe][tipo];
    if (tipo === 'completa') {
      const voci = completa(rng, classe, n, usate);
      if (voci.length > 0) esercizi.push({ tipo, consegna: CONSEGNA.completa, voci });
    } else if (tipo === 'scegli') {
      const voci = scegli(rng, classe, n, usate);
      if (voci.length > 0) esercizi.push({ tipo, consegna: CONSEGNA.scegli, voci });
    } else if (tipo === 'coppie') {
      const voci = coppie(rng, classe, n, usate, nomi);
      if (voci.length > 0) esercizi.push({ tipo, consegna: CONSEGNA.coppie, voci });
    } else if (tipo === 'sillabe') {
      const voci = sillabe(rng, classe, n, usate, dsa);
      if (voci.length > 0) esercizi.push({ tipo, consegna: CONSEGNA.sillabe, voci });
    } else {
      const voci = intruso(rng, classe, n, usate);
      if (voci.length > 0) esercizi.push({ tipo, consegna: CONSEGNA.intruso, voci });
    }
  }
  return esercizi;
}

export function opzioniBase(classe: ClasseDoppie, seed: number): OpzioniDoppie {
  return { classe, seed, esercizi: [...ESERCIZI_CLASSE[classe]] };
}

export function opzioniDaQuery(parametri: URLSearchParams, base: OpzioniDoppie): OpzioniDoppie {
  const prossima: OpzioniDoppie = { ...base, esercizi: [...base.esercizi] };
  const seme = parametri.get('s');
  if (seme && /^\d{4,6}$/.test(seme)) prossima.seed = Number(seme);
  const richiesti = parametri
    .get('es')
    ?.split(',')
    .map((voce) => voce.trim())
    .filter((voce): voce is TipoEsercizio => TIPI_ESERCIZIO.includes(voce as TipoEsercizio));
  if (richiesti && richiesti.length > 0) prossima.esercizi = TIPI_ESERCIZIO.filter((tipo) => richiesti.includes(tipo));
  if (parametri.get('dsa') === '1') prossima.dsa = true;
  return prossima;
}

export function queryDoppie(opzioni: OpzioniDoppie, base: OpzioniDoppie): string {
  const query = new URLSearchParams();
  if (opzioni.seed !== base.seed) query.set('s', String(opzioni.seed));
  if (opzioni.esercizi.join(',') !== base.esercizi.join(',')) query.set('es', opzioni.esercizi.join(','));
  if (opzioni.dsa) query.set('dsa', '1');
  const testo = query.toString();
  return testo ? `?${testo}` : '';
}

export function semeNuovo(): number {
  return 1000 + Math.floor(Math.random() * 999_000);
}

export function generaScheda(classe: ClasseDoppie, opzioni: OpzioniDoppie, seed: number): SchedaDoppie {
  const esercizi = costruisci(classe, opzioni.esercizi, creaRng(seed), Boolean(opzioni.dsa));
  return { classe, seed, esercizi, soluzioni: structuredClone(esercizi) };
}

export function paroleDellaScheda(esercizi: readonly Esercizio[]): string[] {
  return esercizi.flatMap((esercizio) => {
    if (esercizio.tipo === 'completa') return esercizio.voci.map((voce) => `${voce.prima}${voce.soluzione}${voce.dopo}`);
    if (esercizio.tipo === 'scegli') return esercizio.voci.flatMap((voce) => [voce.sinistra, voce.destra]);
    if (esercizio.tipo === 'coppie') return esercizio.voci.flatMap((voce) => [voce.semplice, voce.doppia, voce.soluzione]);
    if (esercizio.tipo === 'sillabe') return esercizio.voci.map((voce) => voce.parola);
    return esercizio.voci.flatMap((voce) => voce.parole);
  });
}
