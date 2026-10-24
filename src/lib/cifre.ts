export function marcaAnni(testo: string): string {
  return testo
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\d{4}(?:\/\d{2,4})?/g, (anno) => `<span class="cifre">${anno}</span>`);
}
