import type { VoceFaq } from './schema';

export const PAGINE_LINEA = [
  {
    href: '/linea-del-tempo/preistoria/',
    nome: 'Preistoria',
    testo: 'Tre strisce da ritagliare e unire: Paleolitico, Neolitico, Età dei metalli.',
  },
  {
    href: '/linea-del-tempo/avanti-e-dopo-cristo/',
    nome: 'Avanti e dopo Cristo',
    testo: 'Come si contano gli anni a.C. e d.C., con esercizi e soluzioni.',
  },
] as const;

export const SEO_HUB_LINEA = {
  title: 'Linea del tempo da stampare per la scuola primaria',
  description:
    'Linee del tempo da stampare in A4: la preistoria in 3 strisce da unire e la linea avanti e dopo Cristo con esercizi e soluzioni.',
  h1: 'Linea del tempo da stampare',
  keywords: [
    'linea del tempo',
    'linea del tempo storia da stampare',
    'linea del tempo scuola primaria da stampare',
    'linea del tempo storia pdf',
  ],
};

export const IN_BREVE_HUB_LINEA =
  'La linea del tempo aiuta a mettere in ordine i fatti: prima, dopo, contemporaneamente. Qui trovi la preistoria in tre strisce A4 da ritagliare e unire, e la linea avanti e dopo Cristo con esercizi per contare gli anni. Tutto gratis, anche in versione DSA.';

export const FAQ_HUB_LINEA: VoceFaq[] = [
  {
    domanda: 'Che cos’è la linea del tempo?',
    risposta: 'È una linea che mette i fatti in ordine: prima, dopo, contemporaneamente.',
  },
  {
    domanda: 'In che classe si usa?',
    risposta: 'Di solito si inizia in terza primaria, con la preistoria.',
  },
  {
    domanda: 'Come si stampa?',
    risposta: 'Apri la scheda e stampa in A4 orizzontale al 100%. Non scegliere «Adatta alla pagina».',
  },
];

export const SEO_PREISTORIA = {
  title: 'Linea del tempo della preistoria da stampare (A4)',
  description:
    'Linea del tempo della preistoria in 3 strisce A4 da unire: Paleolitico, Neolitico, Età dei metalli. Completa, da completare e DSA.',
  h1: 'Linea del tempo della preistoria da stampare',
  keywords: [
    'linea del tempo preistoria',
    'linea del tempo preistoria da stampare',
    'linea del tempo preistoria pdf',
    'linea del tempo preistoria paleolitico neolitico',
    'linea del tempo preistoria terza elementare',
    'linea del tempo preistoria scuola primaria',
  ],
};

export const IN_BREVE_PREISTORIA =
  'Tre strisce A4 da ritagliare e unire: Paleolitico, Mesolitico e Neolitico, Età dei metalli. Ogni periodo ha le sue tappe con un disegno e una frase. Scegli la versione completa, quella da completare o la versione DSA, poi stampa al 100%.';

export const COME_COSTRUIRE = {
  nome: 'Come costruire la linea del tempo',
  passi: [
    { nome: 'Stampa', testo: 'Stampa il foglio in A4 orizzontale, al 100%.' },
    { nome: 'Ritaglia', testo: 'Ritaglia le 3 strisce lungo il tratteggio.' },
    { nome: 'Incolla sulla linguetta', testo: 'Incolla una striscia dopo l’altra sulla linguetta «incolla qui».' },
    { nome: 'Appendi', testo: 'Appendi la linea del tempo in classe.' },
  ],
};

export const FAQ_PREISTORIA: VoceFaq[] = [
  {
    domanda: 'Quali sono i periodi della preistoria?',
    risposta: 'Paleolitico, Mesolitico e Neolitico, Età dei metalli.',
  },
  {
    domanda: 'Quando finisce la preistoria?',
    risposta: 'Con l’invenzione della scrittura, circa 5.000 anni fa.',
  },
  {
    domanda: 'Come si uniscono le strisce?',
    risposta: 'Ritaglia lungo il tratteggio e incolla ogni striscia sulla linguetta «incolla qui».',
  },
  {
    domanda: 'Che differenza c’è tra Paleolitico e Neolitico?',
    risposta: 'Nel Paleolitico si vive di caccia e raccolta. Nel Neolitico nasce l’agricoltura e si costruiscono i primi villaggi.',
  },
];

export const COLLEGAMENTI_PREISTORIA = [
  { href: '/linea-del-tempo/avanti-e-dopo-cristo/', etichetta: 'Avanti e dopo Cristo' },
  { href: '/numeri-romani/', etichetta: 'Numeri romani' },
  { href: '/orologio-da-stampare/', etichetta: 'Orologio da stampare' },
  { href: '/fogli-da-stampare/quadretti-1-cm/', etichetta: 'Quadretti 1 cm' },
  { href: '/cartine-mute/', etichetta: 'Cartine mute' },
] as const;

export const NOTA_STAMPA = 'A4 orizzontale · stampa al 100%';
