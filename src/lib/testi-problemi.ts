import type { Classe } from './problemi/types';
import type { VoceFaq } from './schema';

export interface PaginaProblemi {
  classe: Classe;
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

export const SEO_HUB_PROBLEMI = {
  title: 'Problemi di matematica da stampare con soluzioni',
  description:
    'Generatore di problemi di matematica per la primaria, dalla prima alla quinta: schede A4 con dati, operazione, risposta e soluzioni svolte.',
  h1: 'Problemi di matematica per la scuola primaria',
  keywords: ['problemi di matematica', 'problemi di matematica con soluzioni'],
  inBreve:
    'Scegli la classe e il tipo di operazione: il generatore crea una scheda A4 con da 4 a 8 problemi e un secondo foglio con le soluzioni svolte. Ogni scheda ha un numero: con lo stesso link ritrovi gli stessi problemi.',
};

export const FAQ_HUB_PROBLEMI: VoceFaq[] = [
  {
    domanda: 'Come funziona il generatore?',
    risposta:
      'Scegli la classe, le operazioni e quanti problemi vuoi, da 4 a 8. Il generatore prepara una scheda A4 con gli spazi per i dati, l’operazione e la risposta, e un secondo foglio con le soluzioni svolte.',
  },
  {
    domanda: 'Posso ristampare la stessa scheda?',
    risposta: 'Sì. Ogni scheda ha un numero. Con lo stesso link ritrovi gli stessi problemi.',
  },
  {
    domanda: 'Le soluzioni sono incluse?',
    risposta: 'Sì. Puoi stampare solo la scheda oppure la scheda insieme alle soluzioni svolte.',
  },
  {
    domanda: 'Che cosa scrivo in Dati, Operazione e Risposta?',
    risposta:
      'Nei Dati scrivi i numeri del problema. Nell’Operazione scrivi il calcolo. Nella Risposta scrivi la frase completa, con l’unità.',
  },
];

export const PAGINE_PROBLEMI: readonly PaginaProblemi[] = [
  {
    classe: 1,
    slug: 'classe-prima',
    href: '/problemi-matematica/classe-prima/',
    seed: 1101,
    nome: 'Classe prima',
    title: 'Problemi di matematica classe prima da stampare',
    description:
      'Problemi illustrati di classe prima con addizioni e sottrazioni entro 20. Schede A4 con disegni, spazio per l’operazione e soluzioni.',
    h1: 'Problemi di matematica per la classe prima',
    keywords: [
      'problemi matematica classe prima elementare',
      'problemi di matematica prima elementare addizioni e sottrazioni',
      'semplici problemi di matematica classe prima',
      'matematica classe prima problemi illustrati',
    ],
    inBreve:
      'Problemi semplici con numeri entro 20: aggiungere e togliere. Ogni problema ha un disegno da contare e lo spazio per disegnare, scrivere l’operazione e la risposta.',
    scheda: 'Addizioni e sottrazioni entro 20, con un disegno da contare.',
    domande: [
      {
        domanda: 'Quali problemi si fanno in prima?',
        risposta:
          'In prima di solito si lavora su problemi semplici con numeri entro 20: aggiungere e togliere. Ogni problema ha un disegno da contare.',
      },
      {
        domanda: 'Come si risolve un problema in prima passo per passo?',
        risposta:
          'Conta gli oggetti del disegno. Poi scrivi l’addizione o la sottrazione nello spazio dell’operazione e chiudi con la risposta.',
      },
      {
        domanda: 'Le schede hanno le soluzioni?',
        risposta: 'Sì. Il secondo foglio mostra l’operazione e la risposta di ogni problema.',
      },
    ],
  },
  {
    classe: 2,
    slug: 'classe-seconda',
    href: '/problemi-matematica/classe-seconda/',
    seed: 2202,
    nome: 'Classe seconda',
    title: 'Problemi di matematica classe seconda con soluzioni',
    description:
      'Problemi di classe seconda entro 100: addizioni e sottrazioni con il cambio e prime moltiplicazioni. Schede A4 e soluzioni svolte.',
    h1: 'Problemi di matematica per la classe seconda',
    keywords: ['problemi di matematica 2 elementare', 'problemi matematica classe seconda primaria'],
    inBreve:
      'Problemi con numeri entro 100: addizioni e sottrazioni con il cambio e moltiplicazioni con le tabelline. Ogni scheda ha le soluzioni svolte su un secondo foglio.',
    scheda: 'Numeri entro 100, il cambio e le prime moltiplicazioni con le tabelline.',
    domande: [
      {
        domanda: 'Quali problemi si fanno in seconda?',
        risposta:
          'In seconda di solito si lavora su numeri entro 100: addizioni e sottrazioni con il cambio, e le prime moltiplicazioni con le tabelline.',
      },
      {
        domanda: 'Come si risolve un problema in seconda passo per passo?',
        risposta:
          'Scrivi i dati, poi l’operazione. Se le unità superano 9, fai il cambio. Per la moltiplicazione usa la tabellina e scrivi la risposta.',
      },
      {
        domanda: 'Le schede hanno le soluzioni?',
        risposta: 'Sì. Ogni scheda ha le soluzioni svolte su un secondo foglio.',
      },
    ],
  },
  {
    classe: 3,
    slug: 'classe-terza',
    href: '/problemi-matematica/classe-terza/',
    seed: 3303,
    nome: 'Classe terza',
    title: 'Problemi classe terza primaria con soluzioni',
    description:
      'Problemi di matematica di terza entro 1000: quattro operazioni, euro e problemi con due operazioni. Schede A4 con soluzioni svolte.',
    h1: 'Problemi di matematica per la classe terza',
    keywords: [
      'problemi classe terza primaria',
      'problemi di matematica 3 elementare',
      'problemi di matematica terza elementare con soluzioni',
      'problemi classe terza con due operazioni',
      'problemi classe terza moltiplicazione',
    ],
    inBreve:
      'Problemi con numeri entro 1000, le quattro operazioni e l’euro. Ogni scheda ha gli spazi per dati, operazione e risposta, e un secondo foglio con le soluzioni svolte. Premi «Nuova scheda» per cambiare i numeri: il link della scheda resta uguale e puoi condividerlo.',
    scheda: 'Numeri entro 1000, quattro operazioni, euro e problemi con due passaggi.',
    domande: [
      {
        domanda: 'Quali problemi si fanno in terza?',
        risposta:
          'In terza di solito si lavora su numeri entro 1000, le quattro operazioni, l’euro e problemi con due operazioni.',
      },
      {
        domanda: 'Come si risolve un problema in terza passo per passo?',
        risposta:
          'Scrivi i dati. Se il problema chiede due calcoli, fai la prima operazione e usa quel risultato nella seconda. Poi scrivi la risposta.',
      },
      {
        domanda: 'Le schede hanno le soluzioni?',
        risposta: 'Sì. Il secondo foglio riporta i dati, le operazioni svolte e la risposta.',
      },
      {
        domanda: 'Posso stampare problemi con due operazioni?',
        risposta: 'Sì. Attiva «Due operazioni» e la scheda propone problemi che si risolvono in due passaggi.',
      },
    ],
  },
  {
    classe: 4,
    slug: 'classe-quarta',
    href: '/problemi-matematica/classe-quarta/',
    seed: 4404,
    nome: 'Classe quarta',
    title: 'Problemi di matematica classe quarta: frazioni e misure',
    description:
      'Problemi di quarta con frazioni, numeri decimali, misure ed euro. Genera schede A4 sempre nuove, con le soluzioni svolte.',
    h1: 'Problemi di matematica per la classe quarta',
    keywords: ['problemi di matematica 4 elementare', 'problemi matematica classe quarta primaria'],
    inBreve:
      'Problemi con frazioni, numeri decimali, misure di lunghezza ed euro con i centesimi. Le soluzioni mostrano ogni passaggio, anche le equivalenze.',
    scheda: 'Frazioni, numeri decimali, misure di lunghezza ed euro con i centesimi.',
    domande: [
      {
        domanda: 'Quali problemi si fanno in quarta?',
        risposta:
          'In quarta di solito si lavora su frazioni, numeri decimali, misure di lunghezza ed euro con i centesimi.',
      },
      {
        domanda: 'Come si risolve un problema in quarta passo per passo?',
        risposta:
          'Scrivi i dati. Se c’è una misura, fai prima l’equivalenza. Poi scrivi l’operazione e la risposta, con la frazione o l’unità.',
      },
      {
        domanda: 'Le schede hanno le soluzioni?',
        risposta: 'Sì. Le soluzioni mostrano ogni passaggio, anche le equivalenze.',
      },
    ],
  },
  {
    classe: 5,
    slug: 'classe-quinta',
    href: '/problemi-matematica/classe-quinta/',
    seed: 5505,
    nome: 'Classe quinta',
    title: 'Problemi di matematica classe quinta con soluzioni',
    description:
      'Problemi di quinta con più operazioni, percentuali e sconti, perimetro e area. Schede A4 da stampare con soluzioni svolte.',
    h1: 'Problemi di matematica per la classe quinta',
    keywords: [
      'problemi di matematica 5 elementare',
      'problemi di matematica 5 elementare con soluzioni',
      'problemi matematica classe quinta primaria',
    ],
    inBreve:
      'Problemi a più passaggi: percentuali e sconti, perimetro e area, spese e resto. Ogni soluzione mostra le operazioni in ordine, una per riga.',
    scheda: 'Percentuali, sconti, perimetro, area e problemi a più passaggi.',
    domande: [
      {
        domanda: 'Quali problemi si fanno in quinta?',
        risposta:
          'In quinta di solito si lavora su problemi a più passaggi: percentuali e sconti, perimetro e area, spese e resto.',
      },
      {
        domanda: 'Come si risolve un problema in quinta passo per passo?',
        risposta: 'Scomponi il problema in passaggi. Scrivi un’operazione per riga, nell’ordine, e chiudi con la risposta.',
      },
      {
        domanda: 'Le schede hanno le soluzioni?',
        risposta: 'Sì. Ogni soluzione mostra le operazioni in ordine, una per riga.',
      },
    ],
  },
];

export const HUB_PROBLEMI = '/problemi-matematica/';

export function paginaProblemi(classe: Classe): PaginaProblemi {
  const pagina = PAGINE_PROBLEMI.find((voce) => voce.classe === classe);
  if (!pagina) throw new Error(`Classe sconosciuta: ${classe}`);
  return pagina;
}

export function collegamentiProblemi(classe?: Classe): { href: string; etichetta: string }[] {
  const attuale = classe ? paginaProblemi(classe) : undefined;
  const vicine = PAGINE_PROBLEMI.filter((voce) => !attuale || Math.abs(voce.classe - attuale.classe) === 1);
  const base = attuale
    ? [{ href: HUB_PROBLEMI, etichetta: 'Tutti i problemi' }, ...vicine.map((voce) => ({ href: voce.href, etichetta: voce.nome }))]
    : PAGINE_PROBLEMI.map((voce) => ({ href: voce.href, etichetta: voce.nome }));
  if (classe === 2) {
    base.push(
      { href: '/tabelline/', etichetta: 'Tabelline' },
      { href: '/tabelline/tabellina-del-2/', etichetta: 'Tabellina del 2' },
    );
  }
  if (classe === 3) {
    base.push(
      { href: '/tabelline/', etichetta: 'Tabelline' },
      { href: '/tabelline/tabellina-del-3/', etichetta: 'Tabellina del 3' },
    );
  }
  if (classe === 4) base.push({ href: '/fogli-da-stampare/quadretti-0-5-cm/', etichetta: 'Quadretti da 0,5 cm' });
  if (classe === 5) base.push({ href: '/fogli-da-stampare/carta-millimetrata/', etichetta: 'Carta millimetrata' });
  return base;
}

export function problemiDalleTabelline(n: number): string {
  return n <= 5 ? '/problemi-matematica/classe-seconda/' : '/problemi-matematica/classe-terza/';
}
