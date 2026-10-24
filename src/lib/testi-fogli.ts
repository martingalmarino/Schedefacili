import type { VoceFaq } from './schema';

export const FRASE_STAMPA_VISIBILE =
  'Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const PAGINE_FOGLI = [
  {
    href: '/fogli-da-stampare/quadretti-1-cm/',
    title: 'Quadretti 1 cm da stampare A4 (con e senza margine)',
    description:
      'Foglio a quadretti da 1 cm in formato A4, con o senza margine. Ideale per la prima elementare. Stampa gratis in misura reale.',
    h1: 'Quadretti 1 cm da stampare',
    nome: 'Quadretti 1 cm',
    uso: 'Per la classe prima, con spazio per il numero.',
  },
  {
    href: '/fogli-da-stampare/quadretti-0-5-cm/',
    title: 'Quadretti 0,5 cm da stampare A4 gratis',
    description:
      'Foglio A4 a quadretti da 5 mm (0,5 cm) per matematica dalla seconda alla quinta. Con o senza margine, stampa in misura reale.',
    h1: 'Quadretti da 0,5 cm (5 mm) da stampare',
    nome: 'Quadretti 0,5 cm',
    uso: 'Per la matematica, quando il quadretto da 1 cm è grande.',
  },
  {
    href: '/fogli-da-stampare/carta-millimetrata/',
    title: 'Carta millimetrata A4 da stampare (PDF gratis)',
    description:
      'Carta millimetrata A4 da stampare: griglia 1 mm con linee più marcate ogni 5 mm e 10 mm. Misura reale, gratis.',
    h1: 'Carta millimetrata A4 da stampare',
    nome: 'Carta millimetrata',
    uso: 'Per misurare e per i primi grafici.',
  },
] as const;

export const SEO_HUB_FOGLI = {
  title: 'Fogli da stampare A4: quadretti e carta millimetrata',
  description:
    'Fogli A4 gratis da stampare: quadretti da 1 cm e da 0,5 cm, con o senza margine, e carta millimetrata. Misure reali, PDF pronto.',
  h1: 'Fogli da stampare per la scuola primaria',
  keywords: ['quadretti 1 cm da stampare', 'quadretti 1 cm quaderno', 'carta millimetrata a4 da stampare'],
};

export const IN_BREVE_HUB =
  'In classe prima usa i quadretti da 1 cm: il numero e il segno ci stanno larghi. Il quadretto da 0,5 cm arriva di solito tra la seconda e la terza, e lo decide l’insegnante. La carta millimetrata serve per le misure e per i grafici. Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const IN_BREVE_1 =
  'Questo foglio ha quadretti da 1 cm, la misura della classe prima. Puoi lasciarlo con il margine rosso, a 15 mm dal bordo sinistro, oppure toglierlo. In basso a destra un segmento deve misurare 5 cm. Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const IN_BREVE_05 =
  'Ogni quadretto misura 0,5 cm, cioè 5 mm. Si usa per la matematica quando quello da 1 cm è diventato grande: di solito tra la seconda e la terza, e decide l’insegnante. Puoi stamparlo con il margine o senza. Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const IN_BREVE_MM =
  'La griglia segna ogni millimetro. Ogni 5 mm la linea è più marcata e ogni 10 mm, cioè ogni centimetro, lo è ancora di più. Serve per misurare e per i grafici, non al posto del quaderno. Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const COME_STAMPARE = {
  nome: 'Come stampare il foglio a misura reale',
  passi: [
    {
      nome: 'Apri la stampa',
      testo: 'Nel browser scegli Stampa. Il foglio è già in formato A4.',
    },
    {
      nome: 'Imposta la scala al 100%',
      testo: 'Metti 100%, scala reale o «Dimensioni effettive». Non scegliere «Adatta alla pagina».',
    },
    {
      nome: 'Misura il segmento',
      testo: 'In basso a destra c’è un segmento. Deve misurare 5 cm.',
    },
  ],
};

export const FAQ_HUB: VoceFaq[] = [
  {
    domanda: 'Quale foglio uso in classe prima?',
    risposta: 'I quadretti da 1 cm. Il numero ci sta largo e le colonne si vedono bene.',
  },
  {
    domanda: 'Quando passo al quadretto da 0,5 cm?',
    risposta: 'Di solito tra la seconda e la terza. Decide l’insegnante, in base a come scrivono i bambini.',
  },
  {
    domanda: 'La carta millimetrata sostituisce il quaderno?',
    risposta: 'No. Serve per le misure e per i grafici. Per il lavoro di tutti i giorni resta il foglio a quadretti.',
  },
  {
    domanda: 'Perché il segmento deve essere 5 cm?',
    risposta:
      'Perché così controlli la scala. Se è più corto o più lungo, la stampa non è al 100%. Ristampa con le dimensioni effettive.',
  },
];

export const FAQ_1: VoceFaq[] = [
  {
    domanda: 'Che quaderno a quadretti si usa in prima elementare?',
    risposta:
      'In classe prima il quaderno a quadretti è da 1 cm. Il numero ci sta largo. Se la classe usa già un altro quaderno, segui quello.',
  },
  {
    domanda: 'Come stampo i quadretti a misura reale?',
    risposta:
      'Scegli A4 e la scala al 100% (scala reale o «Dimensioni effettive»). Non usare «Adatta alla pagina». Il segmento in basso a destra deve misurare 5 cm.',
  },
  {
    domanda: 'Meglio con o senza margine?',
    risposta:
      'Il margine rosso sta a 15 mm dal bordo sinistro e lascia il bordo libero. Senza margine hai più quadretti. In classe prima il margine è spesso più comodo.',
  },
];

export const FAQ_05: VoceFaq[] = [
  {
    domanda: 'Quando si passa dal quadretto da 1 cm a quello da 0,5 cm?',
    risposta:
      'Di solito tra la seconda e la terza. Decide l’insegnante. Non c’è un giorno uguale per tutte le classi.',
  },
  {
    domanda: 'I quadretti da 0,5 cm sono da 5 mm?',
    risposta: 'Sì. 0,5 cm e 5 mm sono la stessa misura. Sul foglio ogni quadretto ha il lato di 5 mm.',
  },
  {
    domanda: 'Come controllo che la stampa sia in misura reale?',
    risposta:
      'Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina». Il segmento in basso a destra deve misurare 5 cm.',
  },
];

export const FAQ_MM: VoceFaq[] = [
  {
    domanda: 'A cosa serve la carta millimetrata in primaria?',
    risposta:
      'Per misurare in millimetri e per i primi grafici. Non sostituisce il quaderno a quadretti del lavoro di tutti i giorni.',
  },
  {
    domanda: 'Qual è la differenza tra le linee?',
    risposta:
      'Ogni millimetro c’è una linea chiara da 0,1 mm. Ogni 5 mm la linea è da 0,2 mm. Ogni 10 mm è da 0,35 mm.',
  },
  {
    domanda: 'Come la stampo alla misura giusta?',
    risposta:
      'Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina». Il segmento in basso a destra deve misurare 5 cm.',
  },
];

export const COLLEGAMENTI_MATEMATICA = [
  { href: '/tabelline/', etichetta: 'Tabelline' },
  { href: '/tabelline/tavola-pitagorica/', etichetta: 'Tavola pitagorica' },
  { href: '/generatori/tabelline/', etichetta: 'Generatore di tabelline' },
];
