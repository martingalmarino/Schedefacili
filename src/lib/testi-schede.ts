import { articoloTabellina, tabella } from './tabelline';

function parole(testo: string): number {
  return testo.split(/\s+/).filter(Boolean).length;
}

export function contaParole(testo: string): number {
  return parole(testo);
}

export function inBreveTabellina(n: number): string {
  const righe = tabella(n);
  const prima = righe[0];
  const ultima = righe[9];
  return `La tabellina ${articoloTabellina(n)}${n} va da ${n} × ${prima?.fattore} = ${prima?.prodotto} a ${n} × ${ultima?.fattore} = ${ultima?.prodotto}. Gli esercizi chiedono di completare un fattore o il risultato, sempre sugli stessi prodotti. Puoi stamparla in A4, anche con la versione DSA.`;
}

export function testoClasseTabellina(n: number): string {
  const ultima = n * 10;
  return `La tabellina ${articoloTabellina(n)}${n} si introduce in prima e in seconda e si ripassa quando i calcoli in colonna si allungano. Su questo foglio la sequenza è intera, da ${n} × 1 = ${n} fino a ${n} × 10 = ${ultima}. Sotto trovi dieci esercizi a completamento: a volte manca il risultato, a volte uno dei fattori. I buchi dipendono da un seme fisso, quindi la scheda di oggi è identica a quella di domani e puoi ristamparla per un alunno assente.

In classe conviene andare per gradi. Il primo giorno leggi la tabella a voce e fai copiare solo i risultati sul quaderno. Il secondo giorno copri la tabella e lascia gli esercizi. Il terzo giorno confronta gli errori con la riga ${n} della tavola pitagorica: è la stessa sequenza, vista in un altro schema. Se due risultati vicini si confondono ancora, torna alla tabella intera e non aggiungere altre tabelline.

La versione DSA cambia la veste, non i numeri. Il pulsante applica un carattere pensato per la lettura, aumenta lo spazio tra le righe e toglie il corsivo. Attiva la versione prima di stampare, così il foglio A4 esce già adatto. Le soluzioni stanno in fondo al foglio: tienile per la correzione, non durante il lavoro in autonomia.

Quando la tabellina ${articoloTabellina(n)}${n} è stabile, mescolala con un’altra nel generatore. Due tabelline sullo stesso foglio bastano per un compito breve, uguale per tutta la classe.`;
}

export function testoClasseTavola(): string {
  return `La tavola pitagorica mette in un solo schema le tabelline dall’1 al 10. Ogni casella è il prodotto della riga per la colonna: la riga del 7 e la colonna del 4 si incontrano su 28. Passando il mouse sulla tavola completa si illumina la riga e la colonna, così il prodotto si legge come un incrocio e non come un numero isolato.

La tavola vuota serve dopo, quando i prodotti sono già stati visti. L’alunno riempie le caselle a matita. Puoi chiedere solo una riga, solo una colonna o la diagonale dei quadrati, da 1 × 1 fino a 10 × 10. Non mescolare subito tutta la tavola: una riga al giorno tiene il foglio leggibile e la correzione rapida.

In classe la tavola completa sta appesa o sul banco come controllo. La tavola vuota è il compito. Se un risultato non torna, l’alunno torna all’incrocio sulla tavola piena, non a una lista staccata. Questo passaggio è lo stesso che userà più avanti con i multipli e con le divisioni esatte.

La versione DSA ingrandisce i numeri, allarga le caselle e toglie il corsivo. Attivala prima della stampa se il foglio è per un alunno che legge meglio con quel carattere. Il foglio resta A4. I prodotti non cambiano: cambia solo lo spazio intorno. Quando la tavola è familiare, torna alle schede delle singole tabelline o al generatore per un esercizio più corto.`;
}

export function testoClasseGeneratoreTabelline(): string {
  return `Il generatore prepara un foglio di operazioni scelte da te. Segni le tabelline, il tipo di buco e quante operazioni servono. Il numero della scheda è un seme: con gli stessi segni e lo stesso numero ottieni sempre lo stesso foglio. È utile se un alunno perde la scheda o se vuoi la stessa prova in due classi.

Il tipo «Manca il risultato» è il primo passo. «Manca un fattore» chiede di ricostruire la tabellina a ritroso, per esempio trovare quale numero moltiplicato per 7 dà 42. «Misto» alterna i due buchi. Per un compito a casa bastano dieci operazioni e due tabelline. Venti operazioni e cinque tabelline sono già una verifica, non un esercizio di riscaldamento.

La versione DSA si attiva sul foglio prima di stampare. I numeri restano gli stessi, con più aria e un carattere più leggibile. Se spunti «Stampa con le soluzioni», in fondo al foglio compare la tabella corretta, da tenere in cattedra. Senza quella spunta il foglio dell’alunno non mostra le risposte.

Un modo semplice di usarlo: lunedì la tabellina nuova con il risultato mancante, venerdì la stessa tabellina mescolata a quella della settimana prima. Cambia il numero della scheda se vuoi un secondo foglio diverso, e annotalo sul registro così puoi rigenerarlo.`;
}

export function testoClasseCrucipuzzle(): string {
  return `Il generatore di crucipuzzle costruisce una griglia a partire dalle parole che scrivi, una per riga. Le parole perdono accenti e apostrofi e passano in maiuscolo, così «L’ape» diventa APE e entra nelle caselle. Puoi partire da un tema già pronto, animali o scuola per esempio, e poi togliere le parole troppo lunghe per la classe.

La dimensione è il numero di caselle per lato. Una griglia da 12 tiene parole di lunghezza media senza schiacciarle. Le direzioni decidono la difficoltà: solo orizzontale è adatta alla classe prima, orizzontale e verticale alla classe seconda, le diagonali e il senso contrario alle classi più alte. La modalità DSA blocca diagonali e senso contrario e lascia lettere grandi, perché l’esercizio deve restare di lettura e non di inseguimento.

Prima di stampare controlla l’anteprima. Se una parola non entra, il riquadro ocra lo dice: accorcia l’elenco o aumenta le caselle. «Stampa con le soluzioni» aggiunge una seconda griglia in cui restano solo le parole, senza le lettere di riempimento. Quella pagina è per te, non per il banco.

In classe il crucipuzzle chiude un argomento già nominato a voce. Non è il momento in cui si imparano parole nuove. Dieci parole note, una direzione chiara e un foglio A4 sono abbastanza. Il numero della scheda ti permette di ristampare la stessa griglia.`;
}

export const SEO_HUB_TABELLINE = {
  title: 'Tabelline da stampare: dall’1 al 10',
  h1: 'Tabelline da stampare',
  description: 'Le tabelline dall’1 al 10 da stampare in PDF, con esercizi a completamento e la versione DSA. Gratis.',
};

export const SEO_TAVOLA = {
  title: 'Tavola pitagorica da stampare, piena e vuota',
  h1: 'Tavola pitagorica',
  description: 'Tavola pitagorica 10×10 da stampare, piena o vuota da completare. Illumina riga e colonna. Anche in versione DSA.',
};

export const SEO_HUB_GENERATORI = {
  title: 'Generatori di schede da stampare',
  h1: 'Generatori di schede',
  description: 'Crea schede di tabelline e crucipuzzle da stampare in A4. Scegli operazioni o parole, anche in versione DSA.',
};

export const SEO_GENERATORE_TABELLINE = {
  title: 'Generatore di tabelline da stampare, anche DSA',
  h1: 'Generatore di tabelline',
  description: 'Scegli le tabelline, il tipo di esercizio e quante operazioni stampare. Stesso numero di scheda, stesso foglio.',
};

export const SEO_CRUCIPUZZLE = {
  title: 'Generatore di crucipuzzle gratis da stampare',
  h1: 'Generatore di crucipuzzle',
  description: 'Crea un crucipuzzle personalizzato in pochi secondi: scegli le parole, la griglia e stampa in A4 con le soluzioni.',
};
