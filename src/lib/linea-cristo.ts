import { anno, secolo } from './anni';

const INK = '#1F2A44';
const OCRA = '#E0A526';
const SALVIA = '#3F6B4E';
const LARGHEZZA = 281;
const ALTEZZA = 194;

function n(valore: number): string {
  return String(Math.round(valore * 100) / 100);
}

function esc(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function svgLineaCristo(): string {
  const x0 = 12;
  const x1 = 269;
  const y = 78;
  const anni: { etichetta: string; era: 'aC' | 'dC' }[] = [];
  for (let valore = 10; valore >= 1; valore -= 1) anni.push({ etichetta: String(valore), era: 'aC' });
  for (let valore = 1; valore <= 10; valore += 1) anni.push({ etichetta: String(valore), era: 'dC' });
  const passo = (x1 - x0) / (anni.length - 1);
  const tacche = anni.map((anno, indice) => {
    const x = x0 + passo * indice;
    const colore = anno.era === 'aC' ? OCRA : SALVIA;
    return [
      `<line x1="${n(x)}" y1="${n(y - 3)}" x2="${n(x)}" y2="${n(y + 3)}" stroke="${colore}" stroke-width="0.45"/>`,
      `<text x="${n(x)}" y="${n(y - 11)}" text-anchor="middle" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="1.8">${anno.era === 'aC' ? 'a.C.' : 'd.C.'}</text>`,
      `<text class="cifre" x="${n(x)}" y="${n(y - 7)}" text-anchor="middle" fill="${INK}" font-family="Fraunces, serif" font-size="2.6">${anno.etichetta}</text>`,
    ].join('');
  });
  const stellaX = x0 + passo * 9.5;
  const secoli = [];
  for (let indice = 5; indice >= 1; indice -= 1) secoli.push(secolo(anno(indice * 100, 'aC')));
  for (let indice = 1; indice <= 5; indice += 1) secoli.push(secolo(anno((indice - 1) * 100 + 1, 'dC')));
  const passoSecolo = (x1 - x0) / (secoli.length - 1);
  const rigaSecoli = secoli.map((etichetta, indice) => {
    const x = x0 + passoSecolo * indice;
    const romano = etichetta.replace(/ secolo.*/, '');
    const resto = etichetta.slice(romano.length);
    return `<text x="${n(x)}" y="132" text-anchor="middle" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.2"><tspan class="cifre" font-family="Fraunces, serif">${esc(romano)}</tspan>${esc(resto)}</text>`;
  });
  return `<svg class="foglio-linea" xmlns="http://www.w3.org/2000/svg" width="${LARGHEZZA}mm" height="${ALTEZZA}mm" viewBox="0 0 ${LARGHEZZA} ${ALTEZZA}" role="img" aria-label="Linea del tempo avanti e dopo Cristo"><rect width="${LARGHEZZA}" height="${ALTEZZA}" fill="#FBF6EE"/><text x="8" y="12" fill="${INK}" font-family="Fraunces, serif" font-size="5">Avanti e dopo Cristo</text><text x="8" y="18" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.6">L’anno zero non esiste: dopo l’1 a.C. viene l’1 d.C.</text><line x1="${x0}" y1="${y}" x2="${n(stellaX)}" y2="${y}" stroke="${OCRA}" stroke-width="0.7"/><line x1="${n(stellaX)}" y1="${y}" x2="${x1}" y2="${y}" stroke="${SALVIA}" stroke-width="0.7"/>${tacche.join('')}<g aria-label="nascita di Cristo (convenzione)"><path d="M ${n(stellaX)} ${n(y - 7)} l 1.1 3.2 3.3.2 -2.6 2.1 1 3.2 -2.8-1.8 -2.8 1.8 1-3.2 -2.6-2.1 3.3-.2 z" fill="${OCRA}" stroke="${INK}" stroke-width="0.25"/><text x="${n(stellaX)}" y="${n(y + 18)}" text-anchor="middle" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.3">nascita di Cristo (convenzione)</text></g>${rigaSecoli.join('')}</svg>`;
}
