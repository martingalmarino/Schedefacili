import { partiRomane, toRoman } from './romani';

function esc(testo: string): string {
  return testo.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function svg(id: string, etichetta: string, corpo: string): string {
  return `<svg id="${id}" class="foglio-a4" xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img" aria-label="${esc(etichetta)}"><rect width="210" height="297" fill="#ffffff"/>${corpo}</svg>`;
}

export function svgTabella100(vuote: boolean): string {
  const x0 = 8;
  const y0 = 20;
  const latoW = (210 - 16) / 10;
  const latoH = (297 - 28) / 10;
  const pezzi = [
    `<text class="numeri-ora" x="105" y="12" text-anchor="middle" fill="#1F2A44" font-family="Fraunces, serif" font-size="6">${vuote ? 'Da completare' : 'Numeri romani da 1 a 100'}</text>`,
  ];
  for (let numero = 1; numero <= 100; numero += 1) {
    const colonna = (numero - 1) % 10;
    const riga = Math.floor((numero - 1) / 10);
    const x = x0 + colonna * latoW;
    const y = y0 + riga * latoH;
    const vuota = vuote && numero % 2 === 0;
    pezzi.push(
      `<text class="numeri-ora cifre" x="${(x + latoW / 2).toFixed(2)}" y="${(y + 8).toFixed(2)}" text-anchor="middle" fill="#1F2A44" font-family="Fraunces, serif" font-size="3.2">${numero}</text>`,
    );
    if (vuota) {
      pezzi.push(
        `<line x1="${(x + 3).toFixed(2)}" y1="${(y + 16).toFixed(2)}" x2="${(x + latoW - 3).toFixed(2)}" y2="${(y + 16).toFixed(2)}" stroke="#1F2A44" stroke-width="0.3" data-vuota="${numero}"/>`,
      );
    } else {
      pezzi.push(
        `<text class="numeri-ora" x="${(x + latoW / 2).toFixed(2)}" y="${(y + 16).toFixed(2)}" text-anchor="middle" fill="#1F2A44" font-family="Fraunces, serif" font-size="2.8">${toRoman(numero)}</text>`,
      );
    }
  }
  return svg(vuote ? 'tabella-100-vuote' : 'tabella-100', vuote ? 'Tabella da completare' : 'Numeri romani da 1 a 100', pezzi.join(''));
}

function rigaGruppo(numeri: number[], y: number): string {
  const passo = 190 / numeri.length;
  return numeri
    .map((numero, indice) => {
      const x = 12 + indice * passo;
      return `<text x="${x.toFixed(2)}" y="${y}" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.4"><tspan class="numeri-ora cifre" font-family="Fraunces, serif">${numero}</tspan> <tspan class="numeri-ora" font-family="Fraunces, serif">${toRoman(numero)}</tspan></text>`;
    })
    .join('');
}

export function svgSchema1000(): string {
  const esempio = partiRomane(1994).join(' + ');
  const corpo = [
    '<text class="numeri-ora" x="105" y="16" text-anchor="middle" fill="#1F2A44" font-family="Fraunces, serif" font-size="7">Schema da 1 a 1000</text>',
    '<text x="105" y="26" text-anchor="middle" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.4">Prima le centinaia, poi le decine, poi le unità.</text>',
    '<text x="12" y="42" fill="#1F2A44" font-family="Fraunces, serif" font-size="5">Unità</text>',
    rigaGruppo([1, 2, 3, 4, 5], 54),
    rigaGruppo([6, 7, 8, 9], 66),
    '<text x="12" y="86" fill="#1F2A44" font-family="Fraunces, serif" font-size="5">Decine</text>',
    rigaGruppo([10, 20, 30, 40, 50], 98),
    rigaGruppo([60, 70, 80, 90], 110),
    '<text x="12" y="130" fill="#1F2A44" font-family="Fraunces, serif" font-size="5">Centinaia</text>',
    rigaGruppo([100, 200, 300, 400, 500], 142),
    rigaGruppo([600, 700, 800, 900], 154),
    '<text x="12" y="176" fill="#1F2A44" font-family="Fraunces, serif" font-size="5">Mille</text>',
    `<text x="12" y="188" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="4"><tspan class="numeri-ora cifre" font-family="Fraunces, serif">1000</tspan> <tspan class="numeri-ora" font-family="Fraunces, serif">${toRoman(1000)}</tspan></text>`,
    '<text x="12" y="210" fill="#1F2A44" font-family="Fraunces, serif" font-size="5">Come si compone</text>',
    `<text class="numeri-ora" x="12" y="224" fill="#1F2A44" font-family="Fraunces, serif" font-size="4.5">1994 = ${esc(esempio)} = ${toRoman(1994)}</text>`,
    '<text x="12" y="240" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.6">Il simbolo minore, se sta prima, sottrae.</text>',
    '<text x="12" y="250" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.6">Non si scrivono più di tre simboli uguali di fila.</text>',
    `<text x="12" y="264" fill="#1F2A44" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.6">4 è ${toRoman(4)}, non IIII. 9 è ${toRoman(9)}, non VIIII. 40 è ${toRoman(40)}, non XXXX.</text>`,
  ];
  return svg('schema-1000', 'Schema dei numeri romani da 1 a 1000', corpo.join(''));
}
