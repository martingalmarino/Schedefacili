import type { VoceFaq } from './schema';

export const SEO_OROLOGIO = {
  title: "Orologio da stampare e costruire per imparare l'ora",
  description:
    'Orologio da stampare, ritagliare e costruire con lancette mobili: ore e minuti, versione a colori e da colorare. Gratis in A4 per la primaria.',
  h1: 'Orologio da stampare e costruire',
  keywords: [
    'orologio da stampare e costruire',
    'orologio da stampare per imparare l’ora',
    'orologio da stampare con ore e minuti',
    'orologio da stampare scuola primaria',
    'orologio da stampare e colorare',
  ],
};

export const SEO_SCHEDE_OROLOGIO = {
  title: 'Schede orologio da stampare con soluzioni',
  description:
    'Genera schede sull’orologio: leggi l’ora o disegna le lancette. Ore intere, mezze ore, quarti, 5 minuti. Per seconda e terza, con soluzioni.',
  h1: 'Generatore di schede sull’orologio',
  keywords: [
    'schede orologio da stampare',
    'schede orologio scuola primaria',
    'schede orologio seconda elementare',
    'schede orologio classe terza',
  ],
};

export const IN_BREVE_OROLOGIO =
  'Questo foglio è un orologio da ritagliare e montare. Il quadrante misura 16 cm, con le ore e, se le lasci, i minuti. Le lancette si muovono con un fermacampione. Puoi stamparlo a colori o solo con i contorni, da colorare. Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const IN_BREVE_SCHEDE =
  'Prepari una scheda sull’orologio: l’alunno legge l’ora oppure disegna le lancette. Scegli ore intere, mezze ore, quarti, 5 minuti o il minuto esatto. Gli orologi stanno su un A4 e le soluzioni sul foglio dopo. Lo stesso numero ristampa la stessa scheda. Stampa al 100% (scala reale / «Dimensioni effettive»), non «Adatta alla pagina».';

export const COME_COSTRUIRE = {
  nome: "Come costruire l'orologio",
  materiali: ['Cartoncino', 'Matite o pennarelli', 'Forbici', 'Fermacampione'],
  passi: [
    {
      nome: 'Stampa al 100% su cartoncino',
      testo: 'Scegli A4 e la scala al 100% (scala reale o «Dimensioni effettive»). Non usare «Adatta alla pagina».',
    },
    {
      nome: 'Colora',
      testo: 'Se hai scelto i soli contorni, colora quadrante e lancette. Nella versione a colori puoi saltare questo passo.',
    },
    {
      nome: 'Ritaglia',
      testo: 'Segui le linee tratteggiate, quelle con le forbici: quadrante e lancette.',
    },
    {
      nome: 'Fora il centro',
      testo: 'Fai un buco nel centro del quadrante e nel foro segnato su ogni lancetta.',
    },
    {
      nome: 'Fissa con un fermacampione',
      testo: 'Metti prima la lancetta delle ore, poi quella dei minuti. Stringi il fermacampione quanto basta per farle girare.',
    },
  ],
};

export const FAQ_OROLOGIO: VoceFaq[] = [
  {
    domanda: "A che età si impara a leggere l'orologio?",
    risposta:
      'Di solito si lavora in seconda e terza primaria. In classe prima puoi già nominare le ore intere, se i bambini sono pronti. Decide l’insegnante.',
  },
  {
    domanda: 'Come si spiegano i minuti?',
    risposta:
      'La lancetta lunga fa un giro in un’ora. Il 12 sono zero minuti, il 3 è un quarto, il 6 è mezza, il 9 è meno un quarto. Si conta di 5 in 5: è la tabellina del 5.',
  },
  {
    domanda: 'Cosa serve per costruirlo?',
    risposta: 'Cartoncino, forbici, matite o pennarelli se lo colori, e un fermacampione per il centro.',
  },
];

export const FAQ_SCHEDE: VoceFaq[] = [
  {
    domanda: 'Cosa cambia tra leggi l’ora e disegna le lancette?',
    risposta:
      'In «Leggi l’ora» le lancette ci sono e l’alunno scrive l’ora sulla riga. In «Disegna le lancette» l’ora è scritta e il quadrante è vuoto.',
  },
  {
    domanda: 'Quale livello scelgo in seconda?',
    risposta:
      'Di solito si parte dalle ore intere e dalle mezze ore. I quarti e i 5 minuti arrivano dopo, spesso in terza. Decide l’insegnante.',
  },
  {
    domanda: 'Come ristampo la stessa scheda?',
    risposta: 'Tieni lo stesso numero di scheda e gli stessi segni. Quel numero è il seme: la scheda non cambia.',
  },
  {
    domanda: 'Le soluzioni finiscono sul banco?',
    risposta: 'Solo se stampi «Scheda + soluzioni». «Solo scheda» lascia il secondo foglio fuori.',
  },
];
