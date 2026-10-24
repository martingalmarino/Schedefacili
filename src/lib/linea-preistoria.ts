import { iconaInnestata } from '../components/linea/icone';
import { PERIODI_PREISTORIA, type IconaLinea, type PeriodoPreistoria } from '../data/linea-del-tempo/preistoria';
import { mescola, mulberry32 } from './prng';

export const LARGHEZZA_FOGLIO = 281;
export const ALTEZZA_FOGLIO = 194;
export const LARGHEZZA_STRISCIA = 277;
export const ALTEZZA_STRISCIA = 46;
export const SEME_TESSERE = 1;

const INK = '#1F2A44';
const CARTA = '#FBF6EE';
const COLORI = {
  salvia: '#3F6B4E',
  ocra: '#E0A526',
  terracotta: '#C2522D',
} as const;

const TITOLO = 'Linea del tempo della preistoria';
const ISTRUZIONE =
  'Ritaglia le 3 strisce lungo il tratteggio e incollale una dopo l’altra sulla linguetta «incolla qui».';

interface VoceDisegno {
  icona: IconaLinea;
  didascalia: string;
}

interface StrisciaDisegno {
  id: string;
  titolo: string;
  quando: string;
  colore: keyof typeof COLORI;
  linguetta?: string;
  tappe: VoceDisegno[];
}

function n(valore: number): string {
  return String(Math.round(valore * 100) / 100);
}

function esc(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function cifre(testo: string): string {
  return esc(testo).replace(/(\d[\d.,]*)/g, '<tspan class="cifre" font-family="Fraunces, serif">$1</tspan>');
}

function forbici(x: number, y: number): string {
  return `<g transform="translate(${n(x)} ${n(y)})" aria-hidden="true"><circle cx="0" cy="1.1" r="1" fill="#fff" stroke="${INK}" stroke-width="0.3"/><circle cx="0" cy="3.3" r="1" fill="#fff" stroke="${INK}" stroke-width="0.3"/><path d="M0.7 1.7 L4.4 0.2 M0.7 2.6 L4.4 4.2" fill="none" stroke="${INK}" stroke-width="0.35" stroke-linecap="round"/></g>`;
}

function linguetta(id: string, x: number, y: number, altezza: number, testo: string): string {
  const linee: string[] = [];
  for (let offset = -altezza; offset < 20; offset += 2.2) {
    linee.push(
      `<line x1="${n(x + offset)}" y1="${n(y)}" x2="${n(x + offset + altezza)}" y2="${n(y + altezza)}" stroke="${INK}" stroke-width="0.28"/>`,
    );
  }
  return [
    `<clipPath id="${id}"><rect x="${n(x)}" y="${n(y)}" width="14" height="${n(altezza)}"/></clipPath>`,
    `<g clip-path="url(#${id})">${linee.join('')}</g>`,
    `<text x="${n(x + 7)}" y="${n(y + altezza / 2)}" text-anchor="middle" dominant-baseline="central" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="1.9" transform="rotate(-90 ${n(x + 7)} ${n(y + altezza / 2)})">${cifre(testo)}</text>`,
  ].join('');
}

function striscia(
  voce: StrisciaDisegno,
  y: number,
  altezza: number,
  opzioni: { icone: boolean; didascalie: boolean; caselle: boolean; font: number; famiglia: string; contrasto: boolean },
): string {
  const x = (LARGHEZZA_FOGLIO - LARGHEZZA_STRISCIA) / 2;
  const colore = COLORI[voce.colore];
  const tratto = opzioni.contrasto ? 0.55 : 0.35;
  const margine = opzioni.font > 3 ? 12 : 0;
  const sinistra = (voce.linguetta ? x + 38 : x + 30) + margine;
  const destra = x + LARGHEZZA_STRISCIA - 32 - margine;
  const lineaY = opzioni.font > 3 ? y + 10 : y + altezza * 0.52;
  const latoIcona = opzioni.font > 3 ? 4.6 : 9;
  const passo = voce.tappe.length === 1 ? 0 : (destra - sinistra) / (voce.tappe.length - 1);
  const pezzi = [
    `<g data-striscia="${voce.id}">`,
    `<rect data-ruolo="striscia" x="${n(x)}" y="${n(y)}" width="${LARGHEZZA_STRISCIA}" height="${n(altezza)}" fill="#fff" stroke="${INK}" stroke-width="${tratto}" stroke-dasharray="1.3 0.9"/>`,
    voce.linguetta ? linguetta(`clip-${voce.id}`, x, y, altezza, voce.linguetta) : '',
    forbici(x + LARGHEZZA_STRISCIA - 7, y + 1.4),
    `<text x="${n(voce.linguetta ? x + 18 : x + 4)}" y="${n(y + (opzioni.font > 3 ? 3.2 : 5.2))}" fill="${INK}" font-family="Fraunces, serif" font-size="${opzioni.font > 3 ? 2.6 : 3.4}">${cifre(voce.titolo)}${voce.quando ? ` <tspan font-family="Atkinson Hyperlegible, sans-serif" font-size="${opzioni.font > 3 ? 2.1 : 2.5}">· ${cifre(voce.quando)}</tspan>` : ''}</text>`,
    `<line data-ruolo="tempo" x1="${n(sinistra)}" y1="${n(lineaY)}" x2="${n(destra + 6)}" y2="${n(lineaY)}" stroke="${colore}" stroke-width="${opzioni.contrasto ? 0.7 : 0.55}"/>`,
    `<path d="M ${n(destra + 4)} ${n(lineaY - 1.5)} L ${n(destra + 8)} ${n(lineaY)} L ${n(destra + 4)} ${n(lineaY + 1.5)} Z" fill="${colore}"/>`,
  ];
  if (!voce.linguetta && altezza >= 40) {
    pezzi.push(
      `<text class="cifre" x="${n(x + 8)}" y="${n(lineaY + 1.5)}" text-anchor="middle" fill="${colore}" font-family="Fraunces, serif" font-size="7">1</text>`,
    );
  }
  voce.tappe.forEach((tappa, indice) => {
    const cx = voce.tappe.length === 1 ? (sinistra + destra) / 2 : sinistra + passo * indice;
    pezzi.push(
      `<circle data-ruolo="punto" cx="${n(cx)}" cy="${n(lineaY)}" r="1.35" fill="${colore}"/>`,
    );
    if (opzioni.icone) {
      pezzi.push(iconaInnestata(tappa.icona, cx - latoIcona / 2, lineaY - latoIcona - 1.4, latoIcona));
    }
    if (opzioni.didascalie && opzioni.font > 3) {
      const [sopra, sotto] = dueRighe(tappa.didascalia, 18);
      pezzi.push(
        `<text data-ruolo="didascalia" x="${n(cx)}" y="${n(lineaY + 7.2)}" text-anchor="middle" fill="${INK}" font-family="${opzioni.famiglia}" font-size="${n(opzioni.font)}">${esc(sopra)}</text>`,
      );
      if (sotto) {
        pezzi.push(
          `<text data-ruolo="didascalia" x="${n(cx)}" y="${n(lineaY + 16.2)}" text-anchor="middle" fill="${INK}" font-family="${opzioni.famiglia}" font-size="${n(opzioni.font)}">${esc(sotto)}</text>`,
        );
      }
    } else if (opzioni.didascalie) {
      pezzi.push(
        `<text data-ruolo="didascalia" x="${n(cx)}" y="${n(lineaY + 6)}" text-anchor="middle" fill="${INK}" font-family="${opzioni.famiglia}" font-size="${n(opzioni.font)}">${esc(tappa.didascalia)}</text>`,
      );
    }
    if (opzioni.caselle) {
      pezzi.push(
        `<rect data-ruolo="casella" x="${n(cx - 24)}" y="${n(lineaY + 3.5)}" width="48" height="12" rx="1" fill="#fff" stroke="${INK}" stroke-width="${tratto}"/>`,
      );
    }
  });
  pezzi.push('</g>');
  return pezzi.join('');
}

function intestazione(): string {
  return [
    `<text x="4" y="7" fill="${INK}" font-family="Fraunces, serif" font-size="5">${esc(TITOLO)}</text>`,
    `<text x="4" y="12" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.5">${esc(ISTRUZIONE)}</text>`,
  ].join('');
}

function foglio(id: string, corpo: string, etichetta: string): string {
  return `<svg id="${id}" class="foglio-linea" xmlns="http://www.w3.org/2000/svg" width="${LARGHEZZA_FOGLIO}mm" height="${ALTEZZA_FOGLIO}mm" viewBox="0 0 ${LARGHEZZA_FOGLIO} ${ALTEZZA_FOGLIO}" role="img" aria-label="${esc(etichetta)}"><rect width="${LARGHEZZA_FOGLIO}" height="${ALTEZZA_FOGLIO}" fill="${CARTA}"/>${corpo}</svg>`;
}

function strisceBase(): StrisciaDisegno[] {
  return PERIODI_PREISTORIA.map((periodo) => ({
    id: periodo.id,
    titolo: periodo.titolo,
    quando: periodo.quando,
    colore: periodo.colore,
    linguetta: periodo.linguetta,
    tappe: periodo.tappe.map((tappa) => ({ icona: tappa.icona, didascalia: tappa.didascalia })),
  }));
}

function strisceDsa(): StrisciaDisegno[] {
  const gruppi: StrisciaDisegno[] = [];
  for (const periodo of PERIODI_PREISTORIA) {
    for (let inizio = 0; inizio < periodo.tappe.length; inizio += 3) {
      const continua = inizio > 0;
      gruppi.push({
        id: `${periodo.id}${continua ? '-continua' : ''}`,
        titolo: continua ? `${periodo.titolo} (continua)` : periodo.titolo,
        quando: continua ? '' : periodo.quando,
        colore: periodo.colore,
        linguetta: gruppi.length === 0 ? undefined : `incolla qui · ${gruppi.length + 1}`,
        tappe: periodo.tappe.slice(inizio, inizio + 3).map((tappa) => ({ icona: tappa.icona, didascalia: tappa.didascalia })),
      });
    }
  }
  return gruppi;
}

export function svgCompleta(): string {
  const strisce = strisceBase();
  const corpo = [
    intestazione(),
    ...strisce.map((voce, indice) =>
      striscia(voce, 16 + indice * (ALTEZZA_STRISCIA + 4), ALTEZZA_STRISCIA, {
        icone: true,
        didascalie: true,
        caselle: false,
        font: 2.45,
        famiglia: 'Atkinson Hyperlegible, sans-serif',
        contrasto: false,
      }),
    ),
  ].join('');
  return foglio('preistoria-completa', corpo, TITOLO);
}

export function svgDaCompletare(): string[] {
  const strisce = strisceBase();
  const prima = foglio(
    'preistoria-vuota',
    [
      intestazione(),
      ...strisce.map((voce, indice) =>
        striscia(voce, 16 + indice * (ALTEZZA_STRISCIA + 4), ALTEZZA_STRISCIA, {
          icone: false,
          didascalie: false,
          caselle: true,
          font: 2.45,
          famiglia: 'Atkinson Hyperlegible, sans-serif',
          contrasto: false,
        }),
      ),
    ].join(''),
    `${TITOLO}, da completare`,
  );
  return [prima, svgTessere()];
}

export interface TesseraPreistoria {
  id: string;
  icona: IconaLinea;
  didascalia: string;
  periodo: string;
}

export function tessereMescolate(seme = SEME_TESSERE): TesseraPreistoria[] {
  const tutte = PERIODI_PREISTORIA.flatMap((periodo) =>
    periodo.tappe.map((tappa, indice) => ({
      id: `${periodo.id}-${indice}`,
      icona: tappa.icona,
      didascalia: tappa.didascalia,
      periodo: periodo.titolo,
    })),
  );
  return mescola(tutte, mulberry32(seme));
}

function dueRighe(testo: string, massimo = 24): [string, string] {
  if (testo.length <= massimo) return [testo, ''];
  const parole = testo.split(' ');
  let prima = '';
  let indice = 0;
  while (indice < parole.length) {
    const prossima = `${prima} ${parole[indice]}`.trim();
    if (prima && prossima.length > massimo) break;
    prima = prossima;
    indice += 1;
  }
  return [prima, parole.slice(indice).join(' ')];
}

function svgTessere(): string {
  const tessere = tessereMescolate();
  const cardW = 48;
  const cardH = 22;
  const gapX = 6;
  const gapY = 4;
  const colonne = 4;
  const totale = colonne * cardW + (colonne - 1) * gapX;
  const x0 = (LARGHEZZA_FOGLIO - totale) / 2;
  const y0 = 18;
  const carte = tessere.map((tessera, indice) => {
    const colonna = indice % colonne;
    const riga = Math.floor(indice / colonne);
    const x = x0 + colonna * (cardW + gapX);
    const y = y0 + riga * (cardH + gapY);
    const [sopra, sotto] = dueRighe(tessera.didascalia);
    return [
      `<g data-ruolo="tessera" data-id="${tessera.id}">`,
      `<rect x="${n(x)}" y="${n(y)}" width="${cardW}" height="${cardH}" fill="#fff" stroke="${INK}" stroke-width="0.35" stroke-dasharray="1.2 0.8"/>`,
      forbici(x + cardW - 6, y + 1),
      iconaInnestata(tessera.icona, x + 1.5, y + 6, 9),
      `<text x="${n(x + 12)}" y="${n(sotto ? y + 9 : y + 12)}" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.05">${esc(sopra)}</text>`,
      sotto
        ? `<text x="${n(x + 12)}" y="${n(y + 13.2)}" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.05">${esc(sotto)}</text>`
        : '',
      '</g>',
    ].join('');
  });
  const soluzioni = PERIODI_PREISTORIA.map((periodo, indice) => {
    const riga = periodo.tappe.map((tappa) => tappa.didascalia).join(' · ');
    return `<text x="12" y="${n(158 + indice * 8)}" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.15"><tspan font-family="Fraunces, serif" font-size="2.4">${esc(periodo.titolo)}.</tspan> ${esc(riga)}</text>`;
  });
  const corpo = [
    `<text x="4" y="8" fill="${INK}" font-family="Fraunces, serif" font-size="5">Ritaglia e incolla</text>`,
    `<text x="4" y="13" fill="${INK}" font-family="Atkinson Hyperlegible, sans-serif" font-size="2.5">Ritaglia le tessere e incollale nei riquadri, una per casella.</text>`,
    ...carte,
    `<rect x="8" y="150" width="265" height="36" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="0.4"/>`,
    `<text x="12" y="156" fill="${INK}" font-family="Fraunces, serif" font-size="3.2">Soluzioni</text>`,
    ...soluzioni,
  ].join('');
  return foglio('preistoria-tessere', corpo, 'Ritaglia e incolla');
}

export function svgDsa(): string {
  const strisce = strisceDsa();
  const altezza = 29.5;
  const corpo = [
    `<text x="4" y="4.6" fill="${INK}" font-family="Fraunces, serif" font-size="3.8">${esc(TITOLO)}</text>`,
    `<text x="4" y="7.6" fill="${INK}" font-family="OpenDyslexic, sans-serif" font-size="2">${esc(ISTRUZIONE)}</text>`,
    ...strisce.map((voce, indice) =>
      striscia(voce, 9 + indice * (altezza + 0.6), altezza, {
        icone: true,
        didascalie: true,
        caselle: false,
        font: 4.23,
        famiglia: 'OpenDyslexic, sans-serif',
        contrasto: true,
      }),
    ),
  ].join('');
  return foglio('preistoria-dsa', corpo, `${TITOLO}, versione DSA`);
}

export function soluzioniPreistoria(): { periodo: string; tappe: string[] }[] {
  return PERIODI_PREISTORIA.map((periodo: PeriodoPreistoria) => ({
    periodo: periodo.titolo,
    tappe: periodo.tappe.map((tappa) => tappa.didascalia),
  }));
}
