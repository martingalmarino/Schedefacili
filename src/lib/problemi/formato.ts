import type { Segno } from './types';

const SOTTILE = '\u202F';

export function formattaNumero(n: number): string {
  if (!Number.isFinite(n)) return '';
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  const testo = n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return testo.replace('.', ',');
}

export function formattaEuro(n: number): string {
  const testo = Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : n.toFixed(2).replace('.', ',');
  return `${testo}${SOTTILE}€`;
}

export function equazione(a: number, segno: Segno, b: number): string {
  const c = segno === '+' ? a + b : segno === '−' ? a - b : segno === '×' ? a * b : b === 0 ? Number.NaN : a / b;
  return `${formattaNumero(a)} ${segno} ${formattaNumero(b)} = ${formattaNumero(c)}`;
}

export function escapa(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function marcaNumeri(testo: string): string {
  return escapa(testo).replace(/(\d+(?:,\d+)?)/g, '<span class="n">$1</span>');
}
