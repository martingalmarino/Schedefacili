import type { VoceFaq } from './schema';

export const SEO_ROMANI = {
  title: 'Numeri romani: tabella, regole e schede per bambini',
  description:
    'Numeri romani spiegati ai bambini: i 7 simboli, le regole per scriverli, tabella, convertitore e schede da stampare per la primaria.',
  h1: 'Numeri romani spiegati semplici',
  keywords: [
    'numeri romani',
    'numeri romani tabella',
    'numeri romani scuola primaria pdf',
    'numeri romani da 1 a 10',
    'numeri romani da 1 a 20',
  ],
};

export const SEO_ROMANI_100 = {
  title: 'Numeri romani da 1 a 100: tabella da stampare',
  description:
    'Tabella dei numeri romani da 1 a 100 da stampare in A4, con le regole spiegate ai bambini. Gratis per la scuola primaria.',
  h1: 'Numeri romani da 1 a 100',
  keywords: ['numeri romani da 1 a 100', 'numeri romani da 1 a 10', 'numeri romani da 1 a 20'],
};

export const SEO_ROMANI_1000 = {
  title: 'Numeri romani da 1 a 1000: tabella completa',
  description:
    'Numeri romani da 1 a 1000: tabella completa con decine, centinaia e i numeri più cercati. Da stampare in A4 o consultare online.',
  h1: 'Numeri romani da 1 a 1000',
  keywords: ['numeri romani da 1 a 1000', 'numeri romani tabella'],
};

export const SEO_CONVERTITORE = {
  title: 'Convertitore numeri romani in arabi e viceversa',
  description:
    'Converti numeri romani in arabi e arabi in romani, da 1 a 3999, con la spiegazione passo passo. Utile anche per date e secoli.',
  h1: 'Convertitore di numeri romani',
  keywords: [
    'convertitore numeri romani',
    'convertitore numeri romani in arabi',
    'convertitore numeri arabi e romani',
    'convertitore numeri romani date',
    'convertitore numeri romani online',
  ],
};

export const IN_BREVE_ROMANI =
  'I numeri romani usano sette simboli: I vale 1, V vale 5, X vale 10, L vale 50, C vale 100, D vale 500 e M vale 1000. Si sommano i simboli. Si sottrae se il simbolo minore sta prima. Non si scrivono più di tre simboli uguali di fila.';

export const IN_BREVE_100 =
  'La tabella affianca ogni numero da 1 a 100 al suo romano, in una griglia di dieci per dieci. Sta su un solo A4. La seconda scheda lascia vuoto il romano a caselle alterne, così l’alunno lo scrive con il numero ancora davanti. In classe seconda puoi fermarti ai primi venti.';

export const IN_BREVE_1000 =
  'I numeri da 1 a 1000 sono divisi in gruppi di cento, da aprire solo quando servono. In stampa non escono mille righe. Esce un A4 con unità, decine e centinaia, e l’esempio per comporre un numero come 1994. Prima le centinaia, poi le decine, poi le unità.';

export const IN_BREVE_CONVERTITORE =
  'Scrivi un numero arabo oppure romano, da 1 a 3999. Il campo riconosce da solo che cosa hai inserito e mostra l’altra forma. Sotto vedi la scomposizione, per esempio 1994 = M + CM + XC + IV. Va bene anche per secoli e date.';

export const FAQ_ROMANI: VoceFaq[] = [
  {
    domanda: 'Quali sono i sette simboli?',
    risposta: 'I vale 1, V vale 5, X vale 10, L vale 50, C vale 100, D vale 500 e M vale 1000.',
  },
  {
    domanda: 'Perché non si scrive IIII?',
    risposta: 'Perché non si mettono più di tre simboli uguali di fila. Il 4 si scrive IV: il I prima del V toglie 1.',
  },
  {
    domanda: 'In quale classe si usano?',
    risposta: 'Di solito si incontrano in seconda e in terza, quando si parla di orologio, secoli e capitoli. Decide l’insegnante.',
  },
  {
    domanda: 'Dove li vedono i bambini?',
    risposta: 'Sugli orologi, nei secoli dei libri e nel numero dei capitoli.',
  },
];

export const FAQ_100: VoceFaq[] = [
  {
    domanda: 'La tabella entra in un foglio A4?',
    risposta: 'Sì. È una griglia 10 per 10, da 1 a 100. Stampa al 100%, senza adattare alla pagina.',
  },
  {
    domanda: 'A cosa servono le caselle vuote?',
    risposta: 'Nella seconda scheda il romano manca una casella sì e una no. L’alunno lo scrive, con il numero arabo ancora visibile.',
  },
  {
    domanda: 'Conviene partire da 1 a 20?',
    risposta: 'Sì. I primi venti bastano per le ore e per i capitoli. La tabella fino a 100 arriva dopo.',
  },
];

export const FAQ_1000: VoceFaq[] = [
  {
    domanda: 'Perché la stampa non elenca i mille numeri?',
    risposta: 'Mille righe non stanno in un A4 leggibile. In stampa esce lo schema di unità, decine e centinaia, con il modo per comporre il numero.',
  },
  {
    domanda: 'Come si scrive un numero grande?',
    risposta: 'Prima le centinaia, poi le decine, poi le unità. 1994 è M + CM + XC + IV, cioè MCMXCIV.',
  },
  {
    domanda: 'La tabella online arriva a 1000?',
    risposta: 'Sì. I gruppi di cento si aprono uno per uno. Il 1000 è M.',
  },
];

export const FAQ_CONVERTITORE: VoceFaq[] = [
  {
    domanda: 'Fino a quale numero funziona?',
    risposta: 'Il sistema standard arriva a 3999, che si scrive MMMCMXCIX. Oltre non c’è un simbolo unico condiviso, e qui non arriviamo a diecimila.',
  },
  {
    domanda: 'Come capisce se ho scritto un romano o un arabo?',
    risposta: 'Se ci sono solo cifre, è un numero arabo. Se ci sono solo I, V, X, L, C, D e M, è un romano. IIII, VX e IC non sono forme canoniche: il campo lo segnala.',
  },
  {
    domanda: 'Serve anche per le date?',
    risposta: 'Sì. Un secolo o un anno scritto in romano si legge allo stesso modo: il XXI secolo, o l’anno MMXXVI.',
  },
];

export const PAGINE_ROMANI = [
  { href: '/numeri-romani/da-1-a-100/', nome: 'Da 1 a 100', uso: 'Tabella A4, anche da completare' },
  { href: '/numeri-romani/da-1-a-1000/', nome: 'Da 1 a 1000', uso: 'Tabella completa e schema da stampare' },
  { href: '/numeri-romani/convertitore/', nome: 'Convertitore', uso: 'Da arabo a romano e ritorno, fino a 3999' },
] as const;
