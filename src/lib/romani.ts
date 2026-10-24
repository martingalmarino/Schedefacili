const VALORI: readonly [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const SIMBOLI: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const COPPIE = new Set(['IV', 'IX', 'XL', 'XC', 'CD', 'CM']);

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new Error(`Il numero ${n} non è tra 1 e 3999.`);
  }
  let resto = n;
  let esito = '';
  for (const [valore, simbolo] of VALORI) {
    while (resto >= valore) {
      esito += simbolo;
      resto -= valore;
    }
  }
  return esito;
}

export function fromRoman(s: string): number {
  const testo = s.trim().toUpperCase();
  if (!testo || !/^[IVXLCDM]+$/.test(testo)) {
    throw new Error(`«${s.trim() || s}» non è una forma canonica.`);
  }
  let totale = 0;
  for (let indice = 0; indice < testo.length; indice += 1) {
    const attuale = SIMBOLI[testo[indice] ?? ''] ?? 0;
    const dopo = SIMBOLI[testo[indice + 1] ?? ''] ?? 0;
    if (dopo > attuale) {
      const coppia = testo.slice(indice, indice + 2);
      if (!COPPIE.has(coppia)) {
        throw new Error(`«${testo}» non è una forma canonica.`);
      }
      totale += dopo - attuale;
      indice += 1;
    } else {
      totale += attuale;
    }
  }
  if (totale < 1 || totale > 3999 || toRoman(totale) !== testo) {
    throw new Error(`«${testo}» non è una forma canonica.`);
  }
  return totale;
}

export function convertiTesto(testo: string): { risultato: string; scomposizione: string } {
  const pulito = testo.trim();
  if (!pulito) return { risultato: '', scomposizione: '' };
  if (/^\d+$/.test(pulito)) {
    const numero = Number(pulito);
    return {
      risultato: toRoman(numero),
      scomposizione: `${numero} = ${partiRomane(numero).join(' + ')}`,
    };
  }
  const numero = fromRoman(pulito);
  return {
    risultato: String(numero),
    scomposizione: `${numero} = ${partiRomane(numero).join(' + ')}`,
  };
}

export function partiRomane(n: number): string[] {
  const pezzi: string[] = [];
  let resto = n;
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new Error(`Il numero ${n} non è tra 1 e 3999.`);
  }
  for (const [valore, simbolo] of VALORI) {
    while (resto >= valore) {
      pezzi.push(simbolo);
      resto -= valore;
    }
  }
  return pezzi;
}
