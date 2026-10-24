import { ICONE_LINEA, type IconaLinea } from '../../data/linea-del-tempo/preistoria';

const INK = '#1F2A44';
const SALVIA = '#3F6B4E';
const TERRA = '#C2522D';
const OCRA = '#E0A526';
const CARTA = '#FBF6EE';

function disegno(corpo: string): string {
  return `<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">${corpo}</svg>`;
}

const DISEGNI: Record<IconaLinea, string> = {
  scheggia: disegno(
    `<path d="M16 4c3.2 3.4 6 8 6 12.2a6 6 0 0 1-12 0C10 12 12.8 7.4 16 4z" fill="${OCRA}" stroke="${INK}" stroke-width="1.4"/><path d="M12.5 16.5c2 .8 4.2.6 6.2-1.2" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>`,
  ),
  fuoco: disegno(
    `<path d="M16 3c1.6 4.2 5.4 6.4 5.4 12.2a5.4 5.4 0 0 1-10.8 0c0-2.8 1.6-4.6 2.6-7.2 1 2 1.8 2.8 2.8 2.8 0-2.6 0-5.4 0-7.8z" fill="${TERRA}"/><path d="M16 14.2c1.2 1.6 2.4 2.4 2.4 4.4a2.4 2.4 0 0 1-4.8 0c0-1.2.8-2 1.2-3.2.4.8.8 1.2 1.2 1.2z" fill="${OCRA}"/>`,
  ),
  pittura: disegno(
    `<rect x="4" y="6" width="24" height="20" rx="2" fill="${OCRA}" stroke="${INK}" stroke-width="1.3"/><path d="M7 22 13 13l4 5 4-6 5 10z" fill="${SALVIA}"/><circle cx="23" cy="11" r="1.8" fill="${TERRA}"/>`,
  ),
  lancia: disegno(
    `<path d="M7 26 22 11" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M19.5 6.5 26.5 8.2 21.8 14.2z" fill="${TERRA}" stroke="${INK}" stroke-width="1"/>`,
  ),
  arco: disegno(
    `<path d="M8 26C8 12 14 6 25 8" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M8 26 24 8" fill="none" stroke="${TERRA}" stroke-width="1.3"/><path d="M24 8 20.2 9.2 22.4 12.2z" fill="${TERRA}"/>`,
  ),
  spiga: disegno(
    `<path d="M16 28V13" fill="none" stroke="${SALVIA}" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="16" cy="8" rx="2" ry="3.1" fill="${OCRA}"/><ellipse cx="12" cy="12" rx="2" ry="3" transform="rotate(-28 12 12)" fill="${OCRA}"/><ellipse cx="20" cy="12" rx="2" ry="3" transform="rotate(28 20 12)" fill="${OCRA}"/><ellipse cx="12" cy="17" rx="2" ry="3" transform="rotate(-28 12 17)" fill="${OCRA}"/><ellipse cx="20" cy="17" rx="2" ry="3" transform="rotate(28 20 17)" fill="${OCRA}"/>`,
  ),
  capanna: disegno(
    `<path d="M4 16 16 5l12 11z" fill="${OCRA}" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/><rect x="8" y="16" width="16" height="11" fill="${CARTA}" stroke="${INK}" stroke-width="1.3"/><rect x="14" y="20" width="4" height="7" fill="${TERRA}"/>`,
  ),
  vaso: disegno(
    `<path d="M11 8h10l2 3.5V22a6 6 0 0 1-14 0V11.5z" fill="${TERRA}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 14.5h12" fill="none" stroke="${OCRA}" stroke-width="1.6" stroke-linecap="round"/>`,
  ),
  attrezzo: disegno(
    `<path d="M8 28 18 13" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/><path d="M14 8h8.5a5 5 0 0 1 0 8H15.2z" fill="${TERRA}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>`,
  ),
  ruota: disegno(
    `<circle cx="16" cy="16" r="10" fill="${CARTA}" stroke="${INK}" stroke-width="1.8"/><circle cx="16" cy="16" r="2.2" fill="${OCRA}"/><path d="M16 6v20M6 16h20" fill="none" stroke="${INK}" stroke-width="1.3"/>`,
  ),
  spada: disegno(
    `<path d="M16 3v17" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M10 16.5h12" fill="none" stroke="${TERRA}" stroke-width="2.2" stroke-linecap="round"/><path d="M14 21h4v6h-4z" fill="${OCRA}"/>`,
  ),
  tavoletta: disegno(
    `<rect x="6" y="5" width="20" height="22" rx="1.5" fill="${OCRA}" stroke="${INK}" stroke-width="1.3"/><path d="M10 11h12M10 16h12M10 21h8" fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>`,
  ),
  stella: disegno(
    `<path d="M16 3.2 18.4 12.2 27.2 14 18.4 15.8 16 24.8 13.6 15.8 4.8 14 13.6 12.2z" fill="${OCRA}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/><path d="M21 20.5 28 28" fill="none" stroke="${TERRA}" stroke-width="1.7" stroke-linecap="round"/>`,
  ),
};

export function iconaLinea(id: IconaLinea): string {
  return DISEGNI[id];
}

export function iconaInnestata(id: IconaLinea, x: number, y: number, lato: number): string {
  const interno = DISEGNI[id].replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<svg x="${x}" y="${y}" width="${lato}" height="${lato}" viewBox="0 0 32 32" aria-hidden="true">${interno}</svg>`;
}

export function iconeLineaComplete(): boolean {
  return ICONE_LINEA.every((id) => DISEGNI[id].includes('<svg'));
}
