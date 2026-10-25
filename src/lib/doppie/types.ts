export type ClasseDoppie = 1 | 2 | 3 | 4;

export type Doppia = 'bb' | 'cc' | 'ff' | 'gg' | 'll' | 'mm' | 'nn' | 'pp' | 'rr' | 'ss' | 'tt' | 'zz';

export type TipoEsercizio = 'completa' | 'scegli' | 'coppie' | 'sillabe' | 'intruso';

export const TIPI_ESERCIZIO: readonly TipoEsercizio[] = ['completa', 'scegli', 'coppie', 'sillabe', 'intruso'];

export const ESERCIZI_CLASSE: Record<ClasseDoppie, TipoEsercizio[]> = {
  1: ['completa', 'coppie', 'sillabe', 'intruso'],
  2: ['completa', 'scegli', 'coppie', 'sillabe', 'intruso'],
  3: ['completa', 'scegli', 'coppie', 'sillabe', 'intruso'],
  4: ['completa', 'scegli', 'coppie', 'sillabe', 'intruso'],
};

export const CLASSE_NOME: Record<ClasseDoppie, string> = {
  1: 'prima',
  2: 'seconda',
  3: 'terza',
  4: 'quarta',
};

export interface OpzioniDoppie {
  classe: ClasseDoppie;
  seed: number;
  esercizi: TipoEsercizio[];
  dsa?: boolean;
}

export interface VoceCompleta {
  prima: string;
  dopo: string;
  semplice: string;
  doppia: string;
  soluzione: string;
}

export interface VoceScegli {
  sinistra: string;
  destra: string;
  corretta: 'sinistra' | 'destra';
}

export interface VoceCoppie {
  prima: string;
  dopo: string;
  semplice: string;
  doppia: string;
  soluzione: string;
}

export interface VoceSillabe {
  parola: string;
  soluzione: string;
}

export interface VoceIntruso {
  parole: string[];
  indice: number;
}

interface BaseEsercizio {
  consegna: string;
}

export interface EsercizioCompleta extends BaseEsercizio {
  tipo: 'completa';
  voci: VoceCompleta[];
}

export interface EsercizioScegli extends BaseEsercizio {
  tipo: 'scegli';
  voci: VoceScegli[];
}

export interface EsercizioCoppie extends BaseEsercizio {
  tipo: 'coppie';
  voci: VoceCoppie[];
}

export interface EsercizioSillabe extends BaseEsercizio {
  tipo: 'sillabe';
  voci: VoceSillabe[];
}

export interface EsercizioIntruso extends BaseEsercizio {
  tipo: 'intruso';
  voci: VoceIntruso[];
}

export type Esercizio = EsercizioCompleta | EsercizioScegli | EsercizioCoppie | EsercizioSillabe | EsercizioIntruso;

export interface SchedaDoppie {
  classe: ClasseDoppie;
  seed: number;
  esercizi: Esercizio[];
  soluzioni: Esercizio[];
}
