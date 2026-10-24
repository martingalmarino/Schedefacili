import {
  consegnaScheda,
  layoutScheda,
  testoEsercizio,
  type EsercizioOra,
  type OpzioniSchedaOra,
} from './schede-orologio';

export interface OpzioniOrologio {
  colori: boolean;
  minuti: boolean;
  ore24: boolean;
}

const INK = '#1F2A44';
const SALVIA = '#3F6B4E';
const TERRA = '#C2522D';

function n(valore: number): string {
  return String(Math.round(valore * 100) / 100);
}

function esc(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function punto(cx: number, cy: number, raggio: number, gradi: number): { x: number; y: number } {
  const rad = ((gradi - 90) * Math.PI) / 180;
  return { x: cx + raggio * Math.cos(rad), y: cy + raggio * Math.sin(rad) };
}

function forbici(x: number, y: number): string {
  return `<g transform="translate(${n(x)} ${n(y)})" aria-hidden="true"><circle cx="0" cy="1.7" r="1.5" fill="#fff" stroke="${INK}" stroke-width="0.35"/><circle cx="0" cy="5.2" r="1.5" fill="#fff" stroke="${INK}" stroke-width="0.35"/><path d="M1.1 2.6 L7.2 0.2 M1.1 4.3 L7.2 6.8" fill="none" stroke="${INK}" stroke-width="0.4" stroke-linecap="round"/></g>`;
}

function quadrante(input: {
  cx: number;
  cy: number;
  raggio: number;
  minuti: boolean;
  ore24: boolean;
  lancette: boolean;
  ore: number;
  minuto: number;
  colori: boolean;
  numeri: boolean;
}): string {
  const { cx, cy, raggio } = input;
  const pezzi = [
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(raggio)}" fill="#fff" stroke="${INK}" stroke-width="${n(Math.max(0.35, raggio / 80))}" data-diametro="${n(raggio * 2)}"/>`,
  ];
  const tacche = input.minuti ? 60 : 12;
  const passo = input.minuti ? 6 : 30;
  for (let indice = 0; indice < tacche; indice += 1) {
    const lungo = input.minuti ? indice % 5 === 0 : true;
    const esterno = punto(cx, cy, raggio - 0.4, indice * passo);
    const interno = punto(cx, cy, raggio - (lungo ? raggio * 0.08 : raggio * 0.045), indice * passo);
    pezzi.push(
      `<line x1="${n(esterno.x)}" y1="${n(esterno.y)}" x2="${n(interno.x)}" y2="${n(interno.y)}" stroke="${INK}" stroke-width="${lungo ? 0.45 : 0.25}"/>`,
    );
  }
  if (input.lancette) {
    const raggioNumeri = raggio * 0.72;
    const oraAngolo = (input.ore % 12) * 30 + input.minuto * 0.5;
    const puntaOre = punto(cx, cy, raggio * 0.48, oraAngolo);
    const puntaMin = punto(cx, cy, raggioNumeri * 0.85, input.minuto * 6);
    const coloreOre = input.colori ? SALVIA : INK;
    const coloreMin = input.colori ? TERRA : INK;
    pezzi.push(
      `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(puntaOre.x)}" y2="${n(puntaOre.y)}" stroke="${coloreOre}" stroke-width="${n(Math.max(0.7, raggio * 0.035))}" stroke-linecap="round"/>`,
      `<line x1="${n(cx)}" y1="${n(cy)}" x2="${n(puntaMin.x)}" y2="${n(puntaMin.y)}" stroke="${coloreMin}" stroke-width="${n(Math.max(0.45, raggio * 0.02))}" stroke-linecap="round"/>`,
    );
  }
  if (input.numeri) {
    for (let ora = 1; ora <= 12; ora += 1) {
      const pos = punto(cx, cy, raggio * 0.72, ora * 30);
      pezzi.push(
        `<text class="numeri-ora cifre" x="${n(pos.x)}" y="${n(pos.y)}" text-anchor="middle" dominant-baseline="central" fill="${INK}" font-family="Fraunces, serif" font-size="${n(raggio * 0.16)}" stroke="#fff" stroke-width="${n(raggio * 0.02)}" paint-order="stroke">${ora}</text>`,
      );
    }
  }
  if (input.minuti && input.numeri) {
    for (let minuto = 0; minuto < 60; minuto += 5) {
      const pos = punto(cx, cy, raggio + 4, minuto * 6);
      pezzi.push(
        `<text class="numeri-ora cifre" x="${n(pos.x)}" y="${n(pos.y)}" text-anchor="middle" dominant-baseline="central" fill="${INK}" font-family="Fraunces, serif" font-size="${n(Math.max(2.2, raggio * 0.055))}">${minuto}</text>`,
      );
    }
  }
  if (input.ore24 && input.numeri) {
    for (let ora = 13; ora <= 24; ora += 1) {
      const pos = punto(cx, cy, raggio * 0.46, (ora - 12) * 30);
      pezzi.push(
        `<text class="numeri-ora cifre" x="${n(pos.x)}" y="${n(pos.y)}" text-anchor="middle" dominant-baseline="central" fill="${INK}" font-family="Fraunces, serif" font-size="${n(raggio * 0.09)}">${ora === 24 ? 24 : ora}</text>`,
      );
    }
  }
  pezzi.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(Math.max(0.7, raggio * 0.03))}" fill="${INK}"/>`);
  return pezzi.join('');
}

function pezzoLancetta(input: {
  x: number;
  y: number;
  lunghezza: number;
  colore: string;
  contorno: boolean;
  etichetta: string;
}): string {
  const altezza = 28;
  const larghezza = input.lunghezza + 22;
  const centroY = input.y + altezza / 2;
  const baseX = input.x + 10;
  const meta = 3.2;
  const punta = baseX + input.lunghezza;
  const riempimento = input.contorno ? '#fff' : input.colore;
  const tratto = input.contorno ? INK : input.colore;
  return [
    `<rect x="${n(input.x)}" y="${n(input.y)}" width="${n(larghezza)}" height="${altezza}" fill="#fff" stroke="${INK}" stroke-width="0.35" stroke-dasharray="2 1.3"/>`,
    forbici(input.x + 1.5, input.y + 1.2),
    `<text x="${n(input.x + larghezza - 2)}" y="${n(input.y + 5)}" text-anchor="end" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.2">${esc(input.etichetta)}</text>`,
    `<path d="M ${n(baseX)} ${n(centroY - 1.2)} L ${n(punta - 7)} ${n(centroY - meta)} L ${n(punta)} ${n(centroY)} L ${n(punta - 7)} ${n(centroY + meta)} L ${n(baseX)} ${n(centroY + 1.2)} Z" fill="${riempimento}" stroke="${tratto}" stroke-width="0.4"/>`,
    `<circle cx="${n(baseX)}" cy="${n(centroY)}" r="2.1" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`,
  ].join('');
}

export function opzioniOrologioDaQuery(params: URLSearchParams): OpzioniOrologio {
  return {
    colori: params.get('colori') !== 'no',
    minuti: params.get('minuti') !== 'no',
    ore24: params.get('ore24') === 'si',
  };
}

export function queryOrologio(opzioni: OpzioniOrologio): string {
  const params = new URLSearchParams();
  if (!opzioni.colori) params.set('colori', 'no');
  if (!opzioni.minuti) params.set('minuti', 'no');
  if (opzioni.ore24) params.set('ore24', 'si');
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function hrefOrologio(path: string, opzioni: OpzioniOrologio): string {
  return `${path}${queryOrologio(opzioni)}`;
}

export function markupOrologio(opzioni: OpzioniOrologio): string {
  const cx = 105;
  const cy = 98;
  return [
    '<rect width="210" height="297" fill="#ffffff"/>',
    quadrante({
      cx,
      cy,
      raggio: 80,
      minuti: opzioni.minuti,
      ore24: opzioni.ore24,
      lancette: false,
      ore: 12,
      minuto: 0,
      colori: opzioni.colori,
      numeri: true,
    }),
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="3.2" fill="#fff" stroke="${INK}" stroke-width="0.4" stroke-dasharray="1 0.8"/>`,
    pezzoLancetta({ x: 16, y: 198, lunghezza: 58, colore: SALVIA, contorno: !opzioni.colori, etichetta: 'Ore' }),
    pezzoLancetta({ x: 112, y: 198, lunghezza: 74, colore: TERRA, contorno: !opzioni.colori, etichetta: 'Minuti' }),
  ].join('');
}

export function svgOrologio(opzioni: OpzioniOrologio): string {
  return `<svg id="foglio-a4" class="foglio-a4" xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img" aria-label="Orologio da ritagliare">${markupOrologio(opzioni)}</svg>`;
}

function intestazioneScheda(testo: string, soluzioni: boolean, seed: number): string {
  if (soluzioni) {
    return `<text class="numeri-ora" x="105" y="12" text-anchor="middle" fill="${INK}" font-family="Fraunces, serif" font-size="7">Soluzioni</text>`;
  }
  return [
    `<text x="12" y="8" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.4">Nome ______  Data ______</text>`,
    `<text x="198" y="8" text-anchor="end" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="3.2">${esc(testo)}</text>`,
    `<text x="198" y="13" text-anchor="end" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="3">Scheda <tspan class="numeri-ora cifre" font-family="Fraunces, serif">${seed}</tspan></text>`,
  ].join('');
}

export function markupSchedaOra(opzioni: OpzioniSchedaOra, esercizi: EsercizioOra[], soluzioni: boolean): string {
  const celle = layoutScheda(opzioni.quanti);
  const pezzi = ['<rect width="210" height="297" fill="#ffffff"/>', intestazioneScheda(consegnaScheda(opzioni.tipo), soluzioni, opzioni.seed)];
  esercizi.forEach((esercizio, indice) => {
    const cella = celle[indice];
    if (!cella) return;
    const raggio = cella.diametro / 2;
    const mostraLancette = soluzioni || esercizio.voce === 'leggi';
    const prompt = esercizio.voce === 'disegna' ? testoEsercizio(esercizio, opzioni.formato) : '';
    if (prompt && !soluzioni) {
      pezzi.push(
        `<text x="${n(cella.cx)}" y="${n(cella.promptY)}" text-anchor="middle" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.6">${esc(prompt)}</text>`,
      );
    }
    pezzi.push(
      quadrante({
        cx: cella.cx,
        cy: cella.cy,
        raggio,
        minuti: false,
        ore24: false,
        lancette: mostraLancette,
        ore: esercizio.ore,
        minuto: esercizio.minuti,
        colori: true,
        numeri: true,
      }),
    );
    pezzi.push(
      `<line x1="${n(cella.rigaX)}" y1="${n(cella.rigaY)}" x2="${n(cella.rigaX + cella.rigaL)}" y2="${n(cella.rigaY)}" stroke="${INK}" stroke-width="0.35" data-lunghezza="${n(cella.rigaL)}"/>`,
    );
    if (soluzioni) {
      pezzi.push(
        `<text x="${n(cella.cx)}" y="${n(cella.rigaY - 1.3)}" text-anchor="middle" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.5">${esc(testoEsercizio(esercizio, opzioni.formato))}</text>`,
      );
    }
  });
  return pezzi.join('');
}

export function svgSchedaOra(opzioni: OpzioniSchedaOra, esercizi: EsercizioOra[], soluzioni: boolean): string {
  const id = soluzioni ? 'soluzioni-orologio' : 'scheda-orologio';
  const classe = 'foglio-a4';
  const etichetta = soluzioni ? 'Soluzioni' : 'Scheda sull’orologio';
  return `<svg id="${id}" class="${classe}" xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img" aria-label="${etichetta}">${markupSchedaOra(opzioni, esercizi, soluzioni)}</svg>`;
}
