import { formatta, fraseAnni } from './anni';
import type { VoceFaq } from './schema';

export const SEO_CRISTO = {
  title: 'Linea del tempo avanti e dopo Cristo da stampare',
  description:
    'Linea del tempo avanti e dopo Cristo spiegata ai bambini: come si contano gli anni a.C. e d.C., esercizi da stampare con soluzioni.',
  h1: 'Linea del tempo avanti e dopo Cristo',
  keywords: [
    'linea del tempo avanti e dopo cristo',
    'linea del tempo avanti e dopo cristo primaria',
    'avanti cristo e dopo cristo scuola primaria',
    'avanti cristo dopo cristo significato',
    'avanti cristo dopo cristo differenza',
  ],
};

export const IN_BREVE_CRISTO =
  'Gli anni avanti Cristo (a.C.) si contano all’indietro, quelli dopo Cristo (d.C.) in avanti. L’anno zero non esiste: dopo l’1 a.C. viene subito l’1 d.C. Per calcolare quanti anni passano da un anno a.C. a uno d.C. si sommano i due numeri e si toglie 1.';

export const ESEMPI_CRISTO = [
  fraseAnni({ n: 1, era: 'aC' }, { n: 1, era: 'dC' }),
  fraseAnni({ n: 10, era: 'aC' }, { n: 10, era: 'dC' }),
  fraseAnni({ n: 500, era: 'aC' }, { n: 100, era: 'aC' }),
] as const;

export const NOTA_ROMA = `${formatta({ n: 753, era: 'aC' })} (fondazione di Roma secondo la tradizione).`;

export const FAQ_CRISTO: VoceFaq[] = [
  {
    domanda: 'Che cosa vuol dire a.C. e d.C.?',
    risposta: 'a.C. vuol dire avanti Cristo, d.C. vuol dire dopo Cristo. Sono due modi di contare gli anni.',
  },
  {
    domanda: 'Esiste l’anno zero?',
    risposta: 'No. Dopo l’1 a.C. viene l’1 d.C.',
  },
  {
    domanda: 'Come si calcolano gli anni tra a.C. e d.C.?',
    risposta: 'Sommi i due numeri e togli 1. Da 10 a.C. a 10 d.C. passano 19 anni.',
  },
  {
    domanda: 'Come si capisce il secolo di un anno?',
    risposta: 'Gli anni da 1 a 100 d.C. sono il I secolo d.C. Da 101 a 200 è il II secolo. Prima di Cristo si conta allo stesso modo, all’indietro.',
  },
];

export const COLLEGAMENTI_CRISTO = [
  { href: '/linea-del-tempo/preistoria/', etichetta: 'Preistoria' },
  { href: '/numeri-romani/', etichetta: 'Numeri romani' },
  { href: '/numeri-romani/convertitore/', etichetta: 'Convertitore di numeri romani' },
  { href: '/linea-del-tempo/', etichetta: 'Linea del tempo' },
] as const;
