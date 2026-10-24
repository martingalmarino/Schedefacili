export type TipoFoglio = 'quadretti-1' | 'quadretti-05' | 'millimetrata';
export type ColoreFoglio = 'grigio' | 'azzurro';

export interface OpzioniFoglio {
  tipo: TipoFoglio;
  margine: boolean;
  colore: ColoreFoglio;
  spessore: 0.2 | 0.3;
  intestazione: boolean;
}

export interface LineaFoglio {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  spessore: number;
  ruolo: 'griglia' | 'margine' | 'righello';
  passo?: number;
}

export interface RettangoloFoglio {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export interface TestoFoglio {
  x: number;
  y: number;
  size: number;
  anchor: 'start' | 'end';
  classe: string;
  html: string;
}

export interface ModelloFoglio {
  linee: LineaFoglio[];
  rettangoli: RettangoloFoglio[];
  testi: TestoFoglio[];
}

export const FRASE_RIGHELLO = 'Misura questo segmento: deve essere 5 cm';
export const FRASE_STAMPA =
  'Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';
export const TESTO_INTESTAZIONE = 'Nome ______ Data ______';

const X0 = 5;
const X1 = 205;
const Y_MAX = 292;
const MARGINE_X = 15;
const RIGHELLO = 50;
const ROSSO = '#C0392B';

const TONI = {
  grigio: { fine: '#B8C2CC', medio: '#93A3B3', forte: '#5C6B7A' },
  azzurro: { fine: '#8FB3D9', medio: '#6E97C4', forte: '#3E6D99' },
} as const;

export function opzioniDaQuery(tipo: TipoFoglio, params: URLSearchParams): OpzioniFoglio {
  const spesso = params.get('spessore');
  return {
    tipo,
    margine: params.get('margine') !== 'no',
    colore: params.get('colore') === 'azzurro' ? 'azzurro' : 'grigio',
    spessore: spesso === '0.3' || spesso === '0,3' ? 0.3 : 0.2,
    intestazione: params.get('intestazione') !== 'no',
  };
}

export function queryFoglio(opzioni: OpzioniFoglio): string {
  const params = new URLSearchParams();
  if (!opzioni.margine) params.set('margine', 'no');
  if (opzioni.colore === 'azzurro') params.set('colore', 'azzurro');
  if (opzioni.spessore === 0.3) params.set('spessore', '0.3');
  if (!opzioni.intestazione) params.set('intestazione', 'no');
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function hrefFoglio(path: string, opzioni: OpzioniFoglio): string {
  return `${path}${queryFoglio(opzioni)}`;
}

export function etichettaFoglio(tipo: TipoFoglio): string {
  if (tipo === 'quadretti-1') return 'Foglio a quadretti da 1 cm';
  if (tipo === 'quadretti-05') return 'Foglio a quadretti da 0,5 cm';
  return 'Carta millimetrata A4';
}

function posizioni(da: number, massimo: number, passo: number): number[] {
  const n = Math.floor((massimo - da + 0.001) / passo);
  return Array.from({ length: n + 1 }, (_, i) => Math.round((da + i * passo) * 1000) / 1000);
}

function stileMilli(colore: ColoreFoglio, scarto: number): { stroke: string; spessore: number; passo: number } {
  const toni = TONI[colore];
  const resto = Math.round(scarto * 1000) / 1000;
  if (resto % 10 === 0) return { stroke: toni.forte, spessore: 0.35, passo: 10 };
  if (resto % 5 === 0) return { stroke: toni.medio, spessore: 0.2, passo: 5 };
  return { stroke: toni.fine, spessore: 0.1, passo: 1 };
}

export function modelloFoglio(opzioni: OpzioniFoglio): ModelloFoglio {
  const y0 = opzioni.intestazione ? 16 : X0;
  const passo = opzioni.tipo === 'quadretti-1' ? 10 : opzioni.tipo === 'quadretti-05' ? 5 : 1;
  const ys = posizioni(y0, Y_MAX, passo);
  const xs = posizioni(X0, X1, passo);
  const y1 = ys[ys.length - 1] ?? y0;
  const colore = TONI[opzioni.colore].fine;
  const linee: LineaFoglio[] = [];

  for (const x of xs) {
    const stile =
      opzioni.tipo === 'millimetrata'
        ? stileMilli(opzioni.colore, x - X0)
        : { stroke: colore, spessore: opzioni.spessore, passo };
    linee.push({ x1: x, y1: y0, x2: x, y2: y1, ...stile, ruolo: 'griglia' });
  }
  for (const y of ys) {
    const stile =
      opzioni.tipo === 'millimetrata'
        ? stileMilli(opzioni.colore, y - y0)
        : { stroke: colore, spessore: opzioni.spessore, passo };
    linee.push({ x1: X0, y1: y, x2: X1, y2: y, ...stile, ruolo: 'griglia' });
  }

  if (opzioni.margine) {
    linee.push({
      x1: MARGINE_X,
      y1: y0,
      x2: MARGINE_X,
      y2: y1,
      stroke: ROSSO,
      spessore: 0.35,
      ruolo: 'margine',
    });
  }

  const yRiga = 288;
  linee.push({
    x1: X1 - RIGHELLO,
    y1: yRiga,
    x2: X1,
    y2: yRiga,
    stroke: '#1F2A44',
    spessore: 0.45,
    ruolo: 'righello',
    passo: RIGHELLO,
  });
  for (const x of [X1 - RIGHELLO, X1]) {
    linee.push({
      x1: x,
      y1: yRiga - 1.5,
      x2: x,
      y2: yRiga + 1.5,
      stroke: '#1F2A44',
      spessore: 0.35,
      ruolo: 'righello',
    });
  }

  const testi: TestoFoglio[] = [];
  if (opzioni.intestazione) {
    testi.push({
      x: 8,
      y: 11.5,
      size: 3.2,
      anchor: 'start',
      classe: 'riga-compila',
      html: esc(TESTO_INTESTAZIONE),
    });
  }
  testi.push({
    x: 203,
    y: 281,
    size: 2.4,
    anchor: 'end',
    classe: 'righello-testo',
    html: 'Misura questo segmento: deve essere <tspan class="cifre" font-family="Fraunces, serif">5</tspan> cm',
  });

  return {
    linee,
    rettangoli: [{ x: 128, y: 274, w: 77, h: 18, fill: '#ffffff' }],
    testi,
  };
}

function esc(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function n(valore: number): string {
  return String(Math.round(valore * 1000) / 1000);
}

export function markupInterno(opzioni: OpzioniFoglio): string {
  const modello = modelloFoglio(opzioni);
  const pezzi = ['<rect width="210" height="297" fill="#ffffff"/>'];
  for (const linea of modello.linee) {
    const passo = linea.passo === undefined ? '' : ` data-passo="${n(linea.passo)}"`;
    const orientamento = linea.x1 === linea.x2 ? 'v' : 'o';
    pezzi.push(
      `<line x1="${n(linea.x1)}" y1="${n(linea.y1)}" x2="${n(linea.x2)}" y2="${n(linea.y2)}" stroke="${linea.stroke}" stroke-width="${n(linea.spessore)}" data-ruolo="${linea.ruolo}" data-orientamento="${orientamento}"${passo}/>`,
    );
  }
  for (const r of modello.rettangoli) {
    pezzi.push(`<rect x="${n(r.x)}" y="${n(r.y)}" width="${n(r.w)}" height="${n(r.h)}" fill="${r.fill}"/>`);
  }
  for (const testo of modello.testi) {
    pezzi.push(
      `<text x="${n(testo.x)}" y="${n(testo.y)}" fill="#1F2A44" font-size="${n(testo.size)}" font-family="Atkinson Hyperlegible, sans-serif" text-anchor="${testo.anchor}" class="${testo.classe}">${testo.html}</text>`,
    );
  }
  return pezzi.join('');
}

export function svgFoglio(opzioni: OpzioniFoglio, pieno: boolean): string {
  const id = pieno ? ' id="foglio-a4"' : '';
  const classe = pieno ? 'foglio-a4' : 'foglio-mini';
  return `<svg${id} class="${classe}" xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" role="img" aria-label="${esc(etichettaFoglio(opzioni.tipo))}" data-tipo="${opzioni.tipo}">${markupInterno(opzioni)}</svg>`;
}

export function latoInCssPx(mm: number): number {
  return (mm / 25.4) * 96;
}
