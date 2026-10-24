import { trovaOggetto } from './lessico';
import type { Classe, Dato, Istanza, Tag } from './types';
import { MASSIMO_CLASSE } from './types';

const EQUAZIONE = /^(-?\d+(?:,\d+)?)\s*([+\-−×:])\s*(-?\d+(?:,\d+)?)\s*=\s*(-?\d+(?:,\d+)?)$/u;

function numero(testo: string): number {
  return Number(testo.replace(',', '.'));
}

function intero(n: number): boolean {
  return Math.abs(n - Math.round(n)) < 1e-9;
}

function decimaliOk(n: number): boolean {
  return Math.abs(n * 100 - Math.round(n * 100)) < 1e-6;
}

function combina(a: number, segno: string, b: number): number | null {
  if (segno === '+') return a + b;
  if (segno === '−' || segno === '-') return a - b;
  if (segno === '×') return a * b;
  if (segno === ':') return b === 0 ? null : a / b;
  return null;
}

function passi(istanza: Istanza): { a: number; segno: string; b: number; c: number }[] {
  return istanza.operazioni.flatMap((riga) =>
    riga
      .split('/')
      .map((pezzo) => pezzo.trim())
      .filter(Boolean)
      .flatMap((pezzo) => {
        const trovato = pezzo.match(EQUAZIONE);
        if (!trovato) return [];
        return [{ a: numero(trovato[1] ?? ''), segno: trovato[2] ?? '', b: numero(trovato[3] ?? ''), c: numero(trovato[4] ?? '') }];
      }),
  );
}

function prezzo(dato: Dato): boolean {
  return dato.tipo === 'prezzo' || /prezzo|euro|costa/i.test(dato.etichetta);
}

function prezzoOk(valore: number, classe: Classe): boolean {
  if (valore < 0 || !decimaliOk(valore)) return false;
  if (classe <= 3) return intero(valore);
  return Math.round(valore * 100) % 10 === 0;
}

function divisioneEsatta(classe: Classe, tags: Tag[]): boolean {
  if (classe <= 3) return true;
  return classe === 4 && !tags.includes('decimali');
}

export function motiviVincoli(istanza: Istanza, classe: Classe): string[] {
  const motivi: string[] = [];
  if (!istanza.testo.trim()) motivi.push('testo vuoto');
  if (!istanza.risposta.trim()) motivi.push('risposta vuota');
  const equazioni = passi(istanza);
  if (equazioni.length === 0) motivi.push('manca l’operazione');
  const massimo = MASSIMO_CLASSE[classe];
  const numeri = [istanza.risultato, ...equazioni.flatMap((passo) => [passo.a, passo.b, passo.c])];
  for (const valore of numeri) {
    if (!Number.isFinite(valore)) motivi.push('numero non valido');
    else if (valore < 0) motivi.push('risultato negativo');
    else if (valore > massimo) motivi.push('fuori dal massimo della classe');
    else if (classe <= 3 && !intero(valore)) motivi.push('serve un intero');
    else if (classe >= 4 && !decimaliOk(valore)) motivi.push('più di due decimali');
  }
  for (const passo of equazioni) {
    const atteso = combina(passo.a, passo.segno, passo.b);
    if (atteso === null || Math.abs(atteso - passo.c) > 1e-6) motivi.push('operazione incoerente');
    if (passo.segno === ':' && divisioneEsatta(classe, istanza.tags) && !intero(passo.a / passo.b)) motivi.push('divisione non esatta');
  }
  const ultimo = equazioni[equazioni.length - 1];
  if (ultimo && Math.abs(ultimo.c - istanza.risultato) > 1e-6) motivi.push('risultato diverso dall’ultimo passaggio');
  if (classe === 1 && (istanza.tags.includes('mul') || istanza.tags.includes('div') || equazioni.some((passo) => passo.segno === '×' || passo.segno === ':'))) {
    motivi.push('in prima non ci sono moltiplicazioni né divisioni');
  }
  for (const dato of istanza.dati) {
    if (typeof dato.valore === 'string') continue;
    if (prezzo(dato)) {
      if (!prezzoOk(dato.valore, classe)) motivi.push('prezzo non ammesso');
      continue;
    }
    const ogg = dato.tipo === 'quantita' || dato.tipo === undefined ? trovaOggetto(dato.etichetta) : undefined;
    if (!ogg) continue;
    if (!intero(dato.valore) || dato.valore < ogg.min || dato.valore > ogg.max) motivi.push('quantità fuori misura');
    if (dato.valore === 0) motivi.push('quantità zero');
    if (dato.valore === 1 && !istanza.consentiUno) motivi.push('quantità uno senza il singolare');
  }
  return motivi;
}

export function rispettaVincoli(istanza: Istanza, classe: Classe): boolean {
  return motiviVincoli(istanza, classe).length === 0;
}
