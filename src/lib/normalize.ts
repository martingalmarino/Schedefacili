const ELISIONE = /(?:^|[\s-])(?:quell|dall|dell|nell|sull|coll|all|un|l|d)['’ʼ]/gi;
const APOSTROFI = /['’ʼ]/g;

export function normalizza(testo: string): string {
  return testo
    .replace(ELISIONE, ' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(APOSTROFI, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}
