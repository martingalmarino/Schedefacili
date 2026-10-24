import { ANNO, ANNO_SLUG } from '../config/site';
import { CARTINE } from '../data/cartine';
import { REGIONI, urlCalendarioRegione } from '../data/regioni';
import { h1Regione, SEO_HUB, SEO_NAZIONALE, SEO_PONTI } from './calendario';
import { regioniCartina, seoCartina, SEO_HUB_CARTINE, urlCartinaRegione } from './cartine-pagine';
import { h1Crucipuzzle, percorsoCrucipuzzle, TEMI_CRUCIPUZZLE } from './crucipuzzle-temi';
import {
  h1Tabellina,
  NUMERI_TABELLINE,
  percorsoTabellina,
} from './tabelline';
import { PAGINE_FOGLI, SEO_HUB_FOGLI } from './testi-fogli';
import { SEO_OROLOGIO, SEO_SCHEDE_OROLOGIO } from './testi-orologio';
import { SEO_CONVERTITORE, SEO_ROMANI, SEO_ROMANI_100, SEO_ROMANI_1000 } from './testi-romani';
import { SEO_CRISTO } from './testi-cristo';
import { SEO_HUB_LINEA, SEO_PREISTORIA } from './testi-linea';
import {
  SEO_CRUCIPUZZLE,
  SEO_GENERATORE_TABELLINE,
  SEO_HUB_GENERATORI,
  SEO_HUB_TABELLINE,
  SEO_TAVOLA,
} from './testi-schede';

export interface VoceIndice {
  titolo: string;
  href: string;
  testo: string;
}

const IGNORA = new Set(['di', 'a', 'e', 'il', 'la', 'lo', 'i', 'le', 'un', 'una', 'per', 'in', 'da', 'con', 'su']);

export function tokenRicerca(testo: string): string[] {
  return testo
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’ʼ]/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 0 && !IGNORA.has(token));
}

export function filtraIndice(indice: VoceIndice[], query: string, limite = 8): VoceIndice[] {
  const token = tokenRicerca(query);
  if (token.length === 0) return [];
  const trovate = indice.flatMap((voce) => {
    const titolo = tokenRicerca(voce.titolo);
    const tutto = new Set([...titolo, ...tokenRicerca(voce.testo)]);
    if (!token.every((parte) => tutto.has(parte))) return [];
    const nelTitolo = token.filter((parte) => titolo.includes(parte)).length;
    return [{ voce, punteggio: nelTitolo * 2 + token.length }];
  });
  trovate.sort((a, b) => b.punteggio - a.punteggio || a.voce.titolo.localeCompare(b.voce.titolo, 'it'));
  return trovate.slice(0, limite).map((voce) => voce.voce);
}

function voce(titolo: string, href: string, testo: string): VoceIndice {
  return { titolo, href, testo };
}

export const INDICE: VoceIndice[] = [
  voce(
    'Schede Facili',
    '/',
    'schede didattiche da stampare calendario scolastico tabelline crucipuzzle cartine mute scuola primaria',
  ),
  voce(SEO_HUB.h1, '/calendario-scolastico/', `${SEO_HUB.h1} ${SEO_HUB.description}`),
  voce(SEO_NAZIONALE.h1, `/calendario-scolastico/${ANNO_SLUG}/`, `${SEO_NAZIONALE.h1} tutte le regioni ${ANNO}`),
  voce(
    SEO_PONTI.h1,
    `/calendario-scolastico/${ANNO_SLUG}/ponti-e-festivita/`,
    `${SEO_PONTI.h1} ponti festività ${ANNO}`,
  ),
  ...REGIONI.map((regione) =>
    voce(
      h1Regione(regione.slug, regione.nome),
      urlCalendarioRegione(regione.slug),
      `calendario scolastico ${ANNO} ${regione.nome} ${regione.capoluogo} vacanze ponti`,
    ),
  ),
  voce(SEO_HUB_LINEA.h1, '/linea-del-tempo/', `${SEO_HUB_LINEA.h1} preistoria avanti Cristo`),
  voce(SEO_PREISTORIA.h1, '/linea-del-tempo/preistoria/', `${SEO_PREISTORIA.h1} Paleolitico Neolitico`),
  voce(SEO_CRISTO.h1, '/linea-del-tempo/avanti-e-dopo-cristo/', `${SEO_CRISTO.h1} a.C. d.C.`),
  voce(SEO_HUB_FOGLI.h1, '/fogli-da-stampare/', `${SEO_HUB_FOGLI.h1} quadretti carta millimetrata`),
  ...PAGINE_FOGLI.map((pagina) => voce(pagina.h1, pagina.href, `${pagina.h1} ${pagina.description}`)),
  voce(SEO_HUB_TABELLINE.h1, '/tabelline/', `${SEO_HUB_TABELLINE.h1} tabelline dall 1 al 10 DSA`),
  ...NUMERI_TABELLINE.map((n) =>
    voce(h1Tabellina(n), percorsoTabellina(n), `tabellina del ${n} tabelline DSA esercizi`),
  ),
  voce(SEO_TAVOLA.h1, '/tabelline/tavola-pitagorica/', `${SEO_TAVOLA.h1} tabelline DSA`),
  voce(SEO_OROLOGIO.h1, '/orologio-da-stampare/', `${SEO_OROLOGIO.h1} lancette minuti`),
  voce(SEO_ROMANI.h1, '/numeri-romani/', `${SEO_ROMANI.h1} tabella schede`),
  voce(SEO_ROMANI_100.h1, '/numeri-romani/da-1-a-100/', `${SEO_ROMANI_100.h1} tabella`),
  voce(SEO_ROMANI_1000.h1, '/numeri-romani/da-1-a-1000/', `${SEO_ROMANI_1000.h1} schema`),
  voce(SEO_CONVERTITORE.h1, '/numeri-romani/convertitore/', `${SEO_CONVERTITORE.h1} arabi`),
  voce(SEO_SCHEDE_OROLOGIO.h1, '/generatori/schede-orologio/', `${SEO_SCHEDE_OROLOGIO.h1} soluzioni`),
  voce(SEO_HUB_GENERATORI.h1, '/generatori/', `${SEO_HUB_GENERATORI.h1} tabelline crucipuzzle DSA`),
  voce(
    SEO_GENERATORE_TABELLINE.h1,
    '/generatori/tabelline/',
    `${SEO_GENERATORE_TABELLINE.h1} tabelline modalità DSA`,
  ),
  voce(SEO_CRUCIPUZZLE.h1, '/generatori/crucipuzzle/', `${SEO_CRUCIPUZZLE.h1} parole crucipuzzle`),
  ...TEMI_CRUCIPUZZLE.map((tema) =>
    voce(h1Crucipuzzle(tema), percorsoCrucipuzzle(tema.slug), `crucipuzzle ${tema.etichetta} ${tema.complemento}`),
  ),
  voce(SEO_HUB_CARTINE.h1, '/cartine-mute/', `${SEO_HUB_CARTINE.h1} Italia regioni ISTAT`),
  voce(seoCartina('italia', 'Italia').h1, '/cartine-mute/italia/', 'cartina muta Italia regioni capoluoghi ISTAT'),
  ...regioniCartina().map((carta) =>
    voce(seoCartina(carta.slug, carta.nome).h1, urlCartinaRegione(carta.slug), `cartina muta ${carta.nome} province capoluoghi ISTAT`),
  ),
  voce('Chi siamo', '/chi-siamo/', 'chi siamo schede facili scuola primaria'),
  voce('Contatti', '/contatti/', 'contatti email'),
  voce('Informativa privacy', '/privacy/', 'privacy titolare dati personali garante'),
  voce('Cookie', '/cookie/', 'cookie consenso pubblicità CMP'),
  voce('Termini di utilizzo', '/termini/', 'termini di utilizzo'),
  voce('Fonti e licenze', '/fonti-e-licenze/', 'fonti licenze ISTAT MIM OpenDyslexic Fraunces'),
];
