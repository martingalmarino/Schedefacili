import type { ClasseDoppie } from './doppie/types';
import type { VoceFaq } from './schema';

export interface PaginaDoppie {
  classe: ClasseDoppie;
  slug: string;
  href: string;
  seed: number;
  nome: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  inBreve: string;
  scheda: string;
  domande: VoceFaq[];
}

const SOLUZIONI: VoceFaq = {
  domanda: 'Le schede hanno le soluzioni?',
  risposta: 'Sì. Ogni scheda ha le soluzioni sul secondo foglio.',
};

const DSA: VoceFaq = {
  domanda: 'Posso stampare la versione DSA?',
  risposta: 'Sì. Premi «Versione DSA»: il carattere diventa più leggibile e lo spazio tra le righe aumenta.',
};

const SPIEGA: VoceFaq = {
  domanda: 'Come si spiegano le doppie ai bambini?',
  risposta:
    'Fai leggere la parola ad alta voce: la doppia si sente più forte e più lunga. Poi mostra che nelle sillabe si divide, come in pal-la e gat-to.',
};

export const HUB_DOPPIE = '/doppie/';

export const SEO_HUB_DOPPIE = {
  title: 'Schede sulle doppie da stampare con soluzioni',
  description:
    'Schede sulle consonanti doppie per la scuola primaria: completa la parola, coppie come nono e nonno, sillabe e intruso. A4 con soluzioni.',
  h1: 'Le doppie: schede da stampare',
  keywords: [
    'schede doppie',
    'schede doppie pdf',
    'doppie esercizi',
    'doppie esercizi pdf',
    'doppie esercizi primaria',
    'consonanti doppie',
    'consonanti doppie esempi',
  ],
  inBreve:
    'Schede A4 sulle consonanti doppie per la primaria, dalla prima alla quarta. Scegli la classe, premi «Nuova scheda» e stampa la scheda con le soluzioni.',
};

export const FAQ_HUB_DOPPIE: VoceFaq[] = [
  {
    domanda: 'Quali sono le consonanti doppie?',
    risposta:
      'Sono le consonanti scritte due volte: bb, cc, ff, gg, ll, mm, nn, pp, rr, ss, tt e zz. Si pronunciano più forti e più lunghe della consonante semplice.',
  },
  {
    domanda: 'Come si dividono in sillabe le parole con le doppie?',
    risposta: 'La doppia si divide tra due sillabe. La prima consonante chiude una sillaba e la seconda apre la seguente: pal-la, gat-to.',
  },
  {
    domanda: 'Posso ristampare la stessa scheda?',
    risposta: 'Sì. Ogni scheda ha un numero. Con lo stesso link ritrovi le stesse parole.',
  },
  {
    domanda: 'C’è una versione per alunni con DSA?',
    risposta: 'Sì. Premi «Versione DSA»: il carattere e lo spazio tra le righe cambiano, e la scheda resta stampabile in A4.',
  },
];

export const RICONOSCERE_DOPPIA =
  'La doppia si pronuncia più forte e più lunga della consonante semplice. Nelle sillabe la doppia si divide: pal-la, gat-to.';

export const ESEMPI_DOPPIE: readonly { lettere: string; parole: string }[] = [
  { lettere: 'll', parole: 'palla, stella, cavallo' },
  { lettere: 'tt', parole: 'gatto, latte, mattone' },
  { lettere: 'ss', parole: 'sasso, rosso, passo' },
  { lettere: 'mm', parole: 'mamma, gomma' },
  { lettere: 'nn', parole: 'nonna, penna, gonna' },
  { lettere: 'pp', parole: 'tappo, pappa' },
  { lettere: 'cc', parole: 'mucca, bocca, occhio' },
  { lettere: 'zz', parole: 'pizza, tazza' },
  { lettere: 'rr', parole: 'carro, terra' },
  { lettere: 'bb', parole: 'babbo, nebbia' },
  { lettere: 'ff', parole: 'baffi, soffio' },
  { lettere: 'gg', parole: 'legge, viaggio' },
];

export const PAGINE_DOPPIE: readonly PaginaDoppie[] = [
  {
    classe: 1,
    slug: 'classe-prima',
    href: '/doppie/classe-prima/',
    seed: 1106,
    nome: 'Classe prima',
    title: 'Schede doppie classe prima da stampare',
    description:
      'Schede sulle doppie per la classe prima: parole semplici come palla e gatto, completa la parola e dividi in sillabe. A4 con soluzioni.',
    h1: 'Schede sulle doppie per la classe prima',
    keywords: [
      'schede doppie classe prima',
      'doppie classe prima',
      'le doppie classe prima pdf',
      'schede didattiche doppie classe prima',
      'lettere doppie classe prima',
    ],
    inBreve:
      'Parole corte con la doppia, come palla, gatto e mamma: si legge, si completa e si divide in sillabe. Le soluzioni sono sul secondo foglio.',
    scheda: 'Parole corte come palla, gatto e mamma.',
    domande: [
      {
        domanda: 'Quali doppie si studiano in prima?',
        risposta:
          'Di solito in prima si lavora su parole corte, di due o tre sillabe, con ll, tt, ss, mm, nn e pp. Per esempio palla, gatto e mamma.',
      },
      SPIEGA,
      SOLUZIONI,
      DSA,
    ],
  },
  {
    classe: 2,
    slug: 'classe-seconda',
    href: '/doppie/classe-seconda/',
    seed: 2406,
    nome: 'Classe seconda',
    title: 'Schede doppie classe seconda con soluzioni',
    description:
      'Schede sulle doppie per la classe seconda: semplice o doppia, coppie come nono e nonno, sillabe e intruso. A4 sempre nuove con soluzioni.',
    h1: 'Schede sulle doppie per la classe seconda',
    keywords: [
      'schede doppie classe seconda',
      'doppie classe seconda',
      'doppie classe seconda primaria',
      'dettato doppie classe seconda',
    ],
    inBreve:
      'Schede A4 sulle consonanti doppie: completa la parola, scegli tra semplice e doppia, coppie di parole come nono e nonno, sillabe e intruso. Ogni scheda ha le soluzioni su un secondo foglio. Premi «Nuova scheda» per cambiare le parole.',
    scheda: 'Semplice o doppia, coppie, sillabe e intruso.',
    domande: [
      {
        domanda: 'Quali doppie si studiano in seconda?',
        risposta:
          'Di solito in seconda si lavora su tutte le doppie più frequenti, anche cc, zz e rr, con parole fino a quattro sillabe. Si completa la parola, si sceglie tra semplice e doppia, e si usano coppie come nono e nonno, le sillabe e l’intruso.',
      },
      SPIEGA,
      SOLUZIONI,
      DSA,
    ],
  },
  {
    classe: 3,
    slug: 'classe-terza',
    href: '/doppie/classe-terza/',
    seed: 3306,
    nome: 'Classe terza',
    title: 'Schede doppie classe terza con soluzioni',
    description:
      'Esercizi sulle doppie per la classe terza: parole con due doppie, coppie difficili come fato e fatto, sillabe. Schede A4 con soluzioni.',
    h1: 'Esercizi sulle doppie per la classe terza',
    keywords: [
      'schede doppie classe terza',
      'doppie classe terza',
      'esercizi doppie classe terza',
      'doppie esercizi terza elementare',
      'dettato doppie classe terza',
    ],
    inBreve:
      'Parole più lunghe, anche con due doppie come carrozza, e coppie che cambiano significato come fato e fatto. Ogni scheda ha le soluzioni.',
    scheda: 'Due doppie e coppie come fato e fatto.',
    domande: [
      {
        domanda: 'Quali doppie si studiano in terza?',
        risposta:
          'Di solito in terza si lavora su parole più lunghe, anche con due doppie come carrozza e cappello, e su coppie che cambiano significato, come fato e fatto.',
      },
      SPIEGA,
      SOLUZIONI,
      DSA,
    ],
  },
  {
    classe: 4,
    slug: 'classe-quarta',
    href: '/doppie/classe-quarta/',
    seed: 4406,
    nome: 'Classe quarta',
    title: 'Schede doppie classe quarta da stampare',
    description:
      'Schede sulle doppie per la classe quarta: parole lunghe, coppie come copia e coppia, frasi da completare e dettato breve. A4 con soluzioni.',
    h1: 'Schede sulle doppie per la classe quarta',
    keywords: ['schede doppie classe quarta', 'schede doppie 4 elementare'],
    inBreve:
      'Parole lunghe e meno comuni, coppie come copia e coppia, eco ed ecco, e un breve dettato. Le soluzioni sono sul secondo foglio.',
    scheda: 'Parole lunghe, copia e coppia, dettato breve.',
    domande: [
      {
        domanda: 'Quali doppie si studiano in quarta?',
        risposta:
          'Di solito in quarta si lavora su parole lunghe e meno comuni, come attenzione e approfittare, su coppie come copia e coppia oppure eco ed ecco, e su un breve dettato.',
      },
      SPIEGA,
      SOLUZIONI,
      DSA,
    ],
  },
];

export function paginaDoppie(classe: ClasseDoppie): PaginaDoppie {
  const pagina = PAGINE_DOPPIE.find((voce) => voce.classe === classe);
  if (!pagina) throw new Error(`Classe sconosciuta: ${classe}`);
  return pagina;
}

export function livelloDoppie(classe?: ClasseDoppie): string | string[] {
  if (!classe) return PAGINE_DOPPIE.map((voce) => `Scuola primaria – classe ${voce.slug.replace('classe-', '')}`);
  return `Scuola primaria – classe ${paginaDoppie(classe).slug.replace('classe-', '')}`;
}

export function collegamentiDoppie(classe?: ClasseDoppie): { href: string; etichetta: string }[] {
  if (!classe) return PAGINE_DOPPIE.map((voce) => ({ href: voce.href, etichetta: voce.nome }));
  const attuale = paginaDoppie(classe);
  const precedente = PAGINE_DOPPIE.find((voce) => voce.classe === attuale.classe - 1);
  const successiva = PAGINE_DOPPIE.find((voce) => voce.classe === attuale.classe + 1);
  return [
    { href: HUB_DOPPIE, etichetta: 'Tutte le doppie' },
    ...(precedente ? [{ href: precedente.href, etichetta: precedente.nome }] : []),
    ...(successiva ? [{ href: successiva.href, etichetta: successiva.nome }] : []),
    { href: '/generatori/crucipuzzle/', etichetta: 'Crucipuzzle' },
    { href: '/generatori/', etichetta: 'Generatori' },
  ];
}
