import { ANNO, ANNO_SLUG } from '../config/site';
import festivitaJson from '../data/festivita.json';
import type { CalendarioVoce, RegioneDato } from '../data/schemi';
import { parseData } from './pasqua';
import type { Festivita } from './ricorrenze';

const FESTIVITA = festivitaJson as Festivita[];
const INIZIO_ANNO = '2026-09-01';
const FINE_ANNO = '2027-06-30';

const MESI = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
];

const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

const FEMMINILI = new Set([
  'basilicata',
  'calabria',
  'campania',
  'liguria',
  'lombardia',
  'puglia',
  'sardegna',
  'sicilia',
  'toscana',
]);

const CON_ARTICOLO = new Set(['valle-d-aosta', 'trento', 'bolzano']);
const VOCALI = new Set(['abruzzo', 'emilia-romagna', 'umbria']);

export interface VoceFesta {
  data: string;
  nome: string;
  fonte: string;
  tipo: 'Festa nazionale' | 'Ponte possibile';
  origine?: string;
}

export function dataEstesa(iso: string): string {
  const data = parseData(iso);
  if (!data) return iso;
  return `${data.getDate()} ${MESI[data.getMonth()]} ${data.getFullYear()}`;
}

export function articoloData(iso: string): string {
  const data = parseData(iso);
  if (!data) return iso;
  const giorno = data.getDate();
  const articolo = giorno === 8 || giorno === 11 ? "l'" : 'il ';
  return `${articolo}${dataEstesa(iso)}`;
}

export function dataBreve(iso: string): string {
  const data = parseData(iso);
  if (!data) return iso;
  return `${data.getDate()} ${MESI[data.getMonth()]}`;
}

export function intervallo(dal: string, al: string): string {
  return `${dataBreve(dal)} – ${dataBreve(al)}`;
}

export function giornoSettimana(iso: string): number {
  const data = parseData(iso);
  if (!data) return -1;
  return new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate())).getUTCDay();
}

export function nomeGiorno(iso: string): string {
  return GIORNI[giornoSettimana(iso)] ?? '';
}

export function spostaGiorni(iso: string, giorni: number): string {
  const data = parseData(iso);
  if (!data) return iso;
  const spostata = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate() + giorni));
  const mese = String(spostata.getUTCMonth() + 1).padStart(2, '0');
  const giorno = String(spostata.getUTCDate()).padStart(2, '0');
  return `${spostata.getUTCFullYear()}-${mese}-${giorno}`;
}

export function conArticolo(slug: string, nome: string): string {
  if (slug === 'marche') return `delle ${nome}`;
  if (VOCALI.has(slug)) return `dell’${nome}`;
  if (FEMMINILI.has(slug) || CON_ARTICOLO.has(slug)) return `della ${nome}`;
  return `del ${nome}`;
}

export function inRegione(slug: string, nome: string): string {
  if (slug === 'marche') return `nelle ${nome}`;
  if (slug === 'lazio') return `nel ${nome}`;
  if (CON_ARTICOLO.has(slug)) return `nella ${nome}`;
  return `in ${nome}`;
}

export function h1Regione(slug: string, nome: string): string {
  return `Calendario scolastico 2026/2027 ${conArticolo(slug, nome)}`;
}

export function titoloRegione(nome: string): string {
  const lungo = `Calendario scolastico 2026/27 ${nome}: date e ponti`;
  if (lungo.length <= 60) return lungo;
  return `Calendario scolastico 2026/27 ${nome}`;
}

export function descrizioneRegione(dove: string): string {
  const nucleo = `Quando inizia e finisce la scuola ${dove} nel 2026/27: vacanze di Natale e Pasqua, ponti e festività.`;
  const piena = `${nucleo} Calendario da stampare in A4.`;
  if (piena.length <= 155) return piena;
  const senzaFormato = `${nucleo} Calendario da stampare.`;
  if (senzaFormato.length <= 155) return senzaFormato;
  return senzaFormato.slice(0, 155).replace(/\s+\S*$/, '').trim();
}

export function calendarioCompleto(voce: CalendarioVoce): boolean {
  return Boolean(voce.stato === 'ufficiale' && voce.fonte?.url && voce.inizio && voce.fine && voce.pasqua.dal && voce.pasqua.al);
}

export function testoInBreve(regione: RegioneDato, voce: CalendarioVoce): string {
  if (!calendarioCompleto(voce) || !voce.inizio || !voce.fine || !voce.pasqua.dal || !voce.pasqua.al) {
    return `Le date 2026/27 ${conArticolo(regione.slug, regione.nome)} sono in attesa della delibera regionale. Senza la fonte, la pagina non le scrive.`;
  }
  const dove = inRegione(regione.slug, regione.nome);
  const attacco = dove.charAt(0).toUpperCase() + dove.slice(1);
  const natale =
    voce.natale?.dal && voce.natale.al
      ? ` Le vacanze di Natale vanno dal ${dataEstesa(voce.natale.dal)} al ${dataEstesa(voce.natale.al)}.`
      : '';
  return `${attacco} le lezioni dell’anno ${ANNO} iniziano ${articoloData(voce.inizio)} e finiscono ${articoloData(voce.fine)}.${natale} Quelle di Pasqua dal ${dataEstesa(voce.pasqua.dal)} al ${dataEstesa(voce.pasqua.al)}.`;
}

export function festeNazionali(): VoceFesta[] {
  return FESTIVITA.filter((voce) => voce.tipo === 'festa' && voce.data >= INIZIO_ANNO && voce.data <= FINE_ANNO)
    .map((voce) => ({
      data: voce.data,
      nome: voce.nome,
      fonte: voce.fonte,
      tipo: 'Festa nazionale' as const,
    }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

export function pontiPossibili(feste: VoceFesta[] = festeNazionali()): VoceFesta[] {
  const ponti: VoceFesta[] = [];
  for (const festa of feste) {
    if (festa.tipo !== 'Festa nazionale') continue;
    const giorno = giornoSettimana(festa.data);
    if (giorno === 2) {
      ponti.push({
        data: spostaGiorni(festa.data, -1),
        nome: `Lunedì prima di ${festa.nome}`,
        fonte: festa.fonte,
        tipo: 'Ponte possibile',
        origine: festa.data,
      });
    }
    if (giorno === 4) {
      ponti.push({
        data: spostaGiorni(festa.data, 1),
        nome: `Venerdì dopo ${festa.nome}`,
        fonte: festa.fonte,
        tipo: 'Ponte possibile',
        origine: festa.data,
      });
    }
  }
  return ponti.filter((ponte) => ponte.data >= INIZIO_ANNO && ponte.data <= FINE_ANNO);
}

export function calendarioMisto(): VoceFesta[] {
  return [...festeNazionali(), ...pontiPossibili()].sort((a, b) => a.data.localeCompare(b.data) || a.tipo.localeCompare(b.tipo, 'it'));
}

const RISPOSTA_ATTESA =
  'La data non compare: manca la delibera regionale e, senza fonte ufficiale, non si pubblica.';

const RISPOSTA_OTTOBRE =
  'No. Dal 2026 il 4 ottobre, festa di San Francesco d’Assisi, è festa nazionale: non si va a scuola.';

export function faqRegione(regione: RegioneDato, voce: CalendarioVoce) {
  const dove = inRegione(regione.slug, regione.nome);
  const completo = calendarioCompleto(voce);
  const inizio = completo && voce.inizio ? `Le lezioni iniziano ${articoloData(voce.inizio)}.` : RISPOSTA_ATTESA;
  const natale =
    voce.natale?.dal && voce.natale.al
      ? `Secondo la delibera regionale, dal ${dataEstesa(voce.natale.dal)} al ${dataEstesa(voce.natale.al)}.`
      : 'La data delle vacanze di Natale non è ancora stata indicata nel calendario regionale.';
  const fine = completo && voce.fine ? `Le lezioni finiscono ${articoloData(voce.fine)}.` : RISPOSTA_ATTESA;
  return [
    { domanda: `Quando inizia la scuola ${dove} nel 2026?`, risposta: inizio },
    { domanda: `Quando iniziano le vacanze di Natale ${dove}?`, risposta: natale },
    { domanda: `Quando finisce la scuola ${dove} nel 2027?`, risposta: fine },
    { domanda: 'Il 4 ottobre si va a scuola?', risposta: RISPOSTA_OTTOBRE },
  ];
}

export function urlNazionale(): string {
  return `/calendario-scolastico/${ANNO_SLUG}/`;
}

export function urlPonti(): string {
  return `/calendario-scolastico/${ANNO_SLUG}/ponti-e-festivita/`;
}

export function urlCartina(slugCartina: string): string {
  return `/cartine-mute/regioni/${slugCartina}/`;
}

export function etichettaCartina(regione: RegioneDato): string {
  if (regione.cartina === 'trentino-alto-adige') return 'Cartina muta del Trentino-Alto Adige';
  return `Cartina muta ${conArticolo(regione.slug, regione.nome)}`;
}

export const SEO_HUB = {
  title: 'Calendario scolastico per regione: date ufficiali',
  h1: 'Calendario scolastico',
  description:
    'Scegli la regione: inizio, fine, vacanze e ponti del 2026/27, pubblicati solo con la delibera. Le feste nazionali sono già indicate.',
};

export const SEO_NAZIONALE = {
  title: 'Calendario scolastico 2026/27: tutte le regioni',
  h1: 'Calendario scolastico 2026/2027 regione per regione',
  description:
    'Inizio e fine della scuola regione per regione, vacanze e ponti 2026/27 in una tabella. Con calendario stampabile.',
};

export const SEO_PONTI = {
  title: 'Ponti e festività scolastiche 2026/27',
  h1: 'Ponti e festività dell’anno scolastico 2026/2027',
  description:
    'Feste nazionali del 2026/27 e giorni in cui un ponte è possibile, se la festa cade di martedì o di giovedì.',
};

export const FONTE_FESTIVITA = {
  etichetta: 'Ministero dell’Istruzione e del Merito, festività 2026/27',
  href: 'https://www.mim.gov.it/-/calendario-delle-festivita-e-degli-esami-anno-scolastico-2026-2027',
};
