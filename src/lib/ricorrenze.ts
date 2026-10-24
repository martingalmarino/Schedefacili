import { parseData } from './pasqua';

export interface Festivita {
  data: string;
  nome: string;
  fonte: string;
  tipo?: 'festa' | 'giornata';
  stato?: 'da-verificare';
  calcolo?: 'computus-gregoriano';
  schede?: string;
}

export interface ProssimaRicorrenza {
  data: string;
  nome: string;
  fonte: string;
  schede?: string;
  giorni: number;
  etichetta: string;
}

function inizioGiorno(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function differenzaGiorni(da: Date, a: Date): number {
  const ms = inizioGiorno(a).getTime() - inizioGiorno(da).getTime();
  return Math.round(ms / 86_400_000);
}

export function formatGiornoMese(iso: string): string {
  const data = parseData(iso);
  if (!data) return iso;
  const mese = new Intl.DateTimeFormat('it-IT', { month: 'long' }).format(data);
  return `${data.getDate()} ${mese}`;
}

export function dataInItaliano(data: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Rome',
  }).format(data);
}

export function testoQuando(giorni: number): string {
  if (giorni <= 0) return 'oggi';
  if (giorni === 1) return 'domani';
  return `tra ${giorni} giorni`;
}

export function prossimaRicorrenza(voci: Festivita[], oggi: Date): ProssimaRicorrenza | null {
  const ordinata = voci
    .map((voce) => {
      const data = parseData(voce.data);
      if (!data || !voce.nome || !voce.fonte) return null;
      const giorni = differenzaGiorni(oggi, data);
      if (giorni < 0) return null;
      return { voce, giorni, data };
    })
    .filter((voce) => voce !== null)
    .sort((a, b) => a.data.getTime() - b.data.getTime() || a.voce.nome.localeCompare(b.voce.nome, 'it'));

  const prossima = ordinata[0];
  if (!prossima) return null;

  return {
    data: prossima.voce.data,
    nome: prossima.voce.nome,
    fonte: prossima.voce.fonte,
    schede: prossima.voce.schede,
    giorni: prossima.giorni,
    etichetta: formatGiornoMese(prossima.voce.data),
  };
}
