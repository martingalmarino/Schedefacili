export const ICONE_LINEA = [
  'scheggia',
  'fuoco',
  'pittura',
  'lancia',
  'arco',
  'spiga',
  'capanna',
  'vaso',
  'attrezzo',
  'ruota',
  'spada',
  'tavoletta',
  'stella',
] as const;

export type IconaLinea = (typeof ICONE_LINEA)[number];

export interface TappaPreistoria {
  icona: IconaLinea;
  didascalia: string;
}

export interface PeriodoPreistoria {
  id: 'paleolitico' | 'mesolitico-neolitico' | 'eta-dei-metalli';
  titolo: string;
  quando: string;
  colore: 'salvia' | 'ocra' | 'terracotta';
  linguetta?: string;
  tappe: readonly TappaPreistoria[];
}

export const PERIODI_PREISTORIA: readonly PeriodoPreistoria[] = [
  {
    id: 'paleolitico',
    titolo: 'Paleolitico',
    quando: 'da circa 2,5 milioni di anni fa',
    colore: 'salvia',
    tappe: [
      { icona: 'scheggia', didascalia: 'Si scheggiano le pietre' },
      { icona: 'fuoco', didascalia: 'L’uomo impara a usare il fuoco' },
      { icona: 'pittura', didascalia: 'Le prime pitture nelle grotte' },
      { icona: 'lancia', didascalia: 'Si vive di caccia e raccolta' },
    ],
  },
  {
    id: 'mesolitico-neolitico',
    titolo: 'Mesolitico e Neolitico',
    quando: 'da circa 10.000 anni fa',
    colore: 'ocra',
    linguetta: 'incolla qui · 2',
    tappe: [
      { icona: 'arco', didascalia: 'Mesolitico: arco e frecce' },
      { icona: 'spiga', didascalia: 'Neolitico: nasce l’agricoltura' },
      { icona: 'capanna', didascalia: 'I primi villaggi stabili' },
      { icona: 'vaso', didascalia: 'Vasi di terracotta e tessitura' },
    ],
  },
  {
    id: 'eta-dei-metalli',
    titolo: 'Età dei metalli',
    quando: 'rame, bronzo, ferro',
    colore: 'terracotta',
    linguetta: 'incolla qui · 3',
    tappe: [
      { icona: 'attrezzo', didascalia: 'Età del rame: i primi attrezzi' },
      { icona: 'ruota', didascalia: 'Si diffonde la ruota' },
      { icona: 'spada', didascalia: 'Bronzo e ferro: armi e aratri' },
      { icona: 'tavoletta', didascalia: 'Con la scrittura inizia la storia' },
    ],
  },
];
