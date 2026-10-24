import { toRoman } from './romani';

export type Era = 'aC' | 'dC';

export interface Anno {
  n: number;
  era: Era;
}

export function anno(n: number, era: Era): Anno {
  const voce = { n, era };
  controlla(voce);
  return voce;
}

const SPAZIO = '\u202F';

function controlla(a: Anno): void {
  if (!Number.isInteger(a.n) || a.n < 1) {
    throw new Error('Un anno si conta da 1.');
  }
  if (a.era !== 'aC' && a.era !== 'dC') {
    throw new Error('Era sconosciuta.');
  }
}

export function toAstro(a: Anno): number {
  controlla(a);
  return a.era === 'aC' ? 1 - a.n : a.n;
}

export function anniTrascorsi(da: Anno, a: Anno): number {
  return toAstro(a) - toAstro(da);
}

export function secolo(a: Anno): string {
  controlla(a);
  const indice = Math.ceil(a.n / 100);
  const era = a.era === 'aC' ? 'a.C.' : 'd.C.';
  return `${toRoman(indice)} secolo ${era}`;
}

export function formatta(a: Anno): string {
  controlla(a);
  const era = a.era === 'aC' ? 'a.C.' : 'd.C.';
  return `${a.n}${SPAZIO}${era}`;
}

export function fraseAnni(da: Anno, a: Anno): string {
  const passati = anniTrascorsi(da, a);
  const verbo = passati === 1 ? 'passa' : 'passano';
  const unita = passati === 1 ? 'anno' : 'anni';
  return `Da ${formatta(da)} a ${formatta(a)} ${verbo} ${passati} ${unita}.`;
}

export function piuAntico(x: Anno, y: Anno): Anno {
  return anniTrascorsi(x, y) > 0 ? x : y;
}
