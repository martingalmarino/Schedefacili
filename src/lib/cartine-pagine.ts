import { CARTINE } from '../data/cartine';
import { REGIONI, urlCalendarioRegione } from '../data/regioni';
import { conArticolo } from './calendario';

export const LICENZA_CARTE = 'https://creativecommons.org/licenses/by/4.0/';

export function articoloCartina(slug: string, nome: string): string {
  if (slug === 'italia') return 'dell’Italia';
  return conArticolo(slug, nome);
}

export function seoCartina(slug: string, nome: string) {
  const articolo = articoloCartina(slug, nome);
  const description =
    slug === 'italia'
      ? 'Cartina muta dell’Italia con regioni e capoluoghi, da stampare in A4. Dati ISTAT.'
      : `Cartina muta ${articolo} con province, da stampare in A4. Dati ISTAT.`;
  return {
    title: `Cartina muta ${articolo} da stampare (PDF)`,
    h1: `Cartina muta ${articolo}`,
    description,
    articolo,
  };
}

export const SEO_HUB_CARTINE = {
  title: 'Cartine mute da stampare: Italia e regioni',
  h1: 'Cartine mute',
  description: 'Cartine mute dell’Italia e delle 20 regioni, con province e capoluoghi, da stampare in A4. Dati ISTAT.',
};

export function urlCartinaRegione(slug: string): string {
  return `/cartine-mute/regioni/${slug}/`;
}

export function calendariDellaCartina(slug: string) {
  return REGIONI.filter((regione) => regione.cartina === slug).map((regione) => ({
    nome: regione.nome,
    href: urlCalendarioRegione(regione.slug),
  }));
}

export function cartineConfinanti(slug: string) {
  const viste = new Set<string>();
  const vicine = [];
  for (const regione of REGIONI) {
    if (regione.cartina !== slug) continue;
    for (const vicino of regione.confinanti) {
      const altra = REGIONI.find((voce) => voce.slug === vicino);
      if (!altra || altra.cartina === slug || viste.has(altra.cartina)) continue;
      viste.add(altra.cartina);
      const carta = CARTINE.find((voce) => voce.slug === altra.cartina);
      if (carta) vicine.push({ slug: carta.slug, nome: carta.nome, href: urlCartinaRegione(carta.slug) });
    }
  }
  return vicine;
}

export function regioniCartina() {
  return CARTINE.filter((carta) => carta.slug !== 'italia');
}

export function conteggioPagineCartine(): number {
  return CARTINE.length;
}
