import type { CartinaDato } from './schemi';

export const FONTE_CONFINI =
  'https://www.istat.it/notizia/confini-delle-unita-amministrative-a-fini-statistici-al-1-gennaio-2018-2/';

export const CREDIT_CARTE =
  'Elaborazione su dati ISTAT – Confini delle unità amministrative a fini statistici, CC BY 4.0';

const NOMI: Record<string, string> = {
  italia: 'Italia',
  abruzzo: 'Abruzzo',
  basilicata: 'Basilicata',
  calabria: 'Calabria',
  campania: 'Campania',
  'emilia-romagna': 'Emilia-Romagna',
  'friuli-venezia-giulia': 'Friuli Venezia Giulia',
  lazio: 'Lazio',
  liguria: 'Liguria',
  lombardia: 'Lombardia',
  marche: 'Marche',
  molise: 'Molise',
  piemonte: 'Piemonte',
  puglia: 'Puglia',
  sardegna: 'Sardegna',
  sicilia: 'Sicilia',
  toscana: 'Toscana',
  'trentino-alto-adige': 'Trentino-Alto Adige',
  umbria: 'Umbria',
  'valle-d-aosta': 'Valle d’Aosta',
  veneto: 'Veneto',
};

export const CARTINE: CartinaDato[] = Object.entries(NOMI).map(([slug, nome]) => ({
  slug,
  nome,
  svg: `src/data/cartine/${slug}.svg`,
  licenza: 'CC BY 4.0',
  credit: CREDIT_CARTE,
  fonteUrl: FONTE_CONFINI,
}));
