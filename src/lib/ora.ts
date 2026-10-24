const ORE = [
  '',
  'l’una',
  'le due',
  'le tre',
  'le quattro',
  'le cinque',
  'le sei',
  'le sette',
  'le otto',
  'le nove',
  'le dieci',
  'le undici',
] as const;

const SOTTO_VENTI = [
  '',
  'uno',
  'due',
  'tre',
  'quattro',
  'cinque',
  'sei',
  'sette',
  'otto',
  'nove',
  'dieci',
  'undici',
  'dodici',
  'tredici',
  'quattordici',
  'quindici',
  'sedici',
  'diciassette',
  'diciotto',
  'diciannove',
] as const;

function nomeOra(ore: number): string {
  const h = ((ore % 24) + 24) % 24;
  if (h === 0) return 'mezzanotte';
  if (h === 12) return 'mezzogiorno';
  return ORE[h % 12] ?? 'l’una';
}

function minutiInParole(minuti: number): string {
  if (minuti === 1) return 'un minuto';
  if (minuti === 15) return 'un quarto';
  if (minuti < 20) return SOTTO_VENTI[minuti] ?? String(minuti);
  if (minuti === 21) return 'ventuno';
  if (minuti === 23) return 'ventitré';
  if (minuti === 28) return 'ventotto';
  if (minuti < 30) return minuti === 20 ? 'venti' : `venti${SOTTO_VENTI[minuti - 20]}`;
  return String(minuti);
}

export function oraInParole(ore: number, minuti: number): string {
  if (!Number.isInteger(ore) || !Number.isInteger(minuti) || ore < 0 || ore > 23 || minuti < 0 || minuti > 59) {
    throw new Error('Ora non valida');
  }
  const adesso = nomeOra(ore);
  if (minuti === 0) return adesso;
  if (minuti === 15) return `${adesso} e un quarto`;
  if (minuti === 30) return `${adesso} e mezza`;
  if (minuti < 30) return `${adesso} e ${minutiInParole(minuti)}`;
  const dopo = nomeOra(ore + 1);
  if (minuti === 45) return `${dopo} meno un quarto`;
  return `${dopo} meno ${minutiInParole(60 - minuti)}`;
}

export function oraDigitale(ore: number, minuti: number): string {
  const h24 = ((ore % 24) + 24) % 24;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${String(minuti).padStart(2, '0')}`;
}

export type FormatoOra = 'parole' | 'digitale' | 'entrambi';

export function oraFormato(ore: number, minuti: number, formato: FormatoOra): string {
  const parole = oraInParole(ore, minuti);
  const digitale = oraDigitale(ore, minuti);
  if (formato === 'digitale') return digitale;
  if (formato === 'entrambi') return `${parole} (${digitale})`;
  return parole;
}
