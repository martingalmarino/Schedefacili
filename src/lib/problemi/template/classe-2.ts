import type { Template } from '../types';
import {
  adesivo,
  biglia,
  caramella,
  cesto,
  ciSono,
  coppiaCambio,
  coppiaResto,
  coppiaSomma,
  divisioneEsatta,
  figurina,
  fiore,
  libro,
  matita,
  mela,
  ne,
  nomeCasuale,
  pallone,
  passo,
  pastello,
  plur,
  pronome,
  qta,
  quanti,
  resta,
  riceve,
  sacchetto,
  scatola,
  scheda,
  scaffale,
  tabellina,
} from './comuni';

export const CLASSE_SECONDA: Template[] = [
  {
    id: 's-matite-cambio',
    classe: 2,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const coppia = coppiaCambio(rng, matita.max, 100);
      if (!coppia) return null;
      const { a, b, tot } = coppia;
      return scheda({
        testo: `In classe ci sono ${plur(a, matita)} rosse e ${plur(b, matita)} blu. ${quanti(matita)} ci sono in tutto?`,
        dati: [qta(matita, a), qta(matita, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: matita.plurale,
        risposta: ciSono(tot, matita),
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 's-biglie-cambio',
    classe: 2,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const coppia = coppiaCambio(rng, 60, 100);
      if (!coppia) return null;
      const { a, b, tot } = coppia;
      return scheda({
        testo: `In una scatola ci sono ${plur(a, biglia)} e nell’altra ${plur(b, biglia)}. ${quanti(biglia)} ci sono nelle due scatole?`,
        dati: [qta(biglia, a), qta(biglia, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: biglia.plurale,
        risposta: ciSono(tot, biglia),
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 's-mele-cambio',
    classe: 2,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const coppia = coppiaCambio(rng, mela.max, 80);
      if (!coppia) return null;
      const { a, b, tot } = coppia;
      return scheda({
        testo: `Nel primo cesto ci sono ${plur(a, mela)} e nel secondo ${plur(b, mela)}. ${quanti(mela)} raccolgono in tutto?`,
        dati: [qta(mela, a), qta(mela, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: mela.plurale,
        risposta: `Raccolgono ${plur(tot, mela)}.`,
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 's-figurine-cambio',
    classe: 2,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const coppia = coppiaCambio(rng, 50, 100);
      if (!coppia) return null;
      const { a, b, tot } = coppia;
      return scheda({
        testo: `${persona.nome} ha ${plur(a, figurina)} nell’album e ${plur(b, figurina)} ancora da incollare. ${quanti(figurina)} ha in tutto?`,
        dati: [qta(figurina, a), qta(figurina, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: figurina.plurale,
        risposta: `In tutto ha ${plur(tot, figurina)}.`,
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 's-libri',
    classe: 2,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = coppiaSomma(rng, libro.max, 40);
      return scheda({
        testo: `Su uno scaffale ci sono ${plur(a, libro)} e sull’altro ${plur(b, libro)}. ${quanti(libro)} ci sono in biblioteca?`,
        dati: [qta(libro, a), qta(libro, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: libro.plurale,
        risposta: ciSono(tot, libro),
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 's-fiori',
    classe: 2,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = coppiaSomma(rng, fiore.max, 70);
      return scheda({
        testo: `Nell’orto la classe pianta ${plur(a, fiore)} rossi e ${plur(b, fiore)} gialli. ${quanti(fiore)} pianta in tutto?`,
        dati: [qta(fiore, a), qta(fiore, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: fiore.plurale,
        risposta: `Pianta ${plur(tot, fiore)}.`,
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 's-album',
    classe: 2,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = coppiaResto(rng, 80, 12);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, figurina)} e ${ne()} attacca ${b} sull’album. ${quanti(figurina)} ${pronome(persona.genere)} restano?`,
        dati: [qta(figurina, a), qta(figurina, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: figurina.plurale,
        risposta: `${riceve(persona)} ${resto === 1 ? 'resta' : 'restano'} ${plur(resto, figurina)}.`,
        tags: ['sub'],
        passi: 1,
      });
    },
  },
  {
    id: 's-presta-matite',
    classe: 2,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = coppiaResto(rng, matita.max, 8);
      return scheda({
        testo: `${persona.nome} porta ${plur(a, matita)} a scuola e ${ne()} presta ${b}. ${quanti(matita)} ${pronome(persona.genere)} restano?`,
        dati: [qta(matita, a), qta(matita, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: matita.plurale,
        risposta: `${riceve(persona)} ${resto === 1 ? 'resta' : 'restano'} ${plur(resto, matita)}.`,
        tags: ['sub'],
        passi: 1,
      });
    },
  },
  {
    id: 's-merenda-mele',
    classe: 2,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const { a, b, resto } = coppiaResto(rng, mela.max, 8);
      return scheda({
        testo: `Per la merenda ci sono ${plur(a, mela)}. I bambini ne mangiano ${b}. ${quanti(mela)} avanzano?`,
        dati: [qta(mela, a), qta(mela, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: mela.plurale,
        risposta: resto === 1 ? `Avanza ${plur(resto, mela)}.` : `Avanzano ${plur(resto, mela)}.`,
        tags: ['sub'],
        passi: 1,
      });
    },
  },
  {
    id: 's-palloni-usati',
    classe: 2,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const { a, b, resto } = coppiaResto(rng, pallone.max, 6);
      return scheda({
        testo: `In palestra ci sono ${plur(a, pallone)}. La squadra ne usa ${b} per la partita. ${quanti(pallone)} restano nel deposito?`,
        dati: [qta(pallone, a), qta(pallone, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: pallone.plurale,
        risposta: `Nel deposito ${resta(resto, pallone).charAt(0).toLocaleLowerCase('it')}${resta(resto, pallone).slice(1)}`,
        tags: ['sub'],
        passi: 1,
      });
    },
  },
  {
    id: 's-pastelli',
    classe: 2,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const fattori = tabellina(rng, 100);
      if (!fattori) return null;
      const { k, n, tot } = fattori;
      return scheda({
        testo: `Ogni scatola contiene ${plur(k, pastello)}. ${quanti(pastello)} ci sono in ${plur(n, scatola)}?`,
        dati: [qta(pastello, k), qta(scatola, n)],
        operazioni: [passo(k, '×', n)],
        risultato: tot,
        unita: pastello.plurale,
        risposta: ciSono(tot, pastello),
        tags: ['mul'],
        passi: 1,
      });
    },
  },
  {
    id: 's-mele-cesti',
    classe: 2,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const k = rng.intero(2, 8);
      const tetto = Math.min(cesto.max, Math.floor(mela.max / k), Math.floor(100 / k));
      if (tetto < 2) return null;
      const n = rng.intero(2, tetto);
      const tot = k * n;
      return scheda({
        testo: `Ogni cesto contiene ${plur(k, mela)}. ${quanti(mela)} ci sono in ${plur(n, cesto)}?`,
        dati: [qta(mela, k), qta(cesto, n)],
        operazioni: [passo(k, '×', n)],
        risultato: tot,
        unita: mela.plurale,
        risposta: ciSono(tot, mela),
        tags: ['mul'],
        passi: 1,
      });
    },
  },
  {
    id: 's-adesivi-fogli',
    classe: 2,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const fattori = tabellina(rng, 80);
      if (!fattori) return null;
      const { k, n, tot } = fattori;
      return scheda({
        testo: `Su ogni foglio ${persona.nome} attacca ${plur(k, adesivo)}. Quanti adesivi attacca su ${n} fogli?`,
        dati: [qta(adesivo, k), { etichetta: 'fogli', valore: n, tipo: 'altro' }],
        operazioni: [passo(k, '×', n)],
        risultato: tot,
        unita: adesivo.plurale,
        risposta: `Attacca ${plur(tot, adesivo)}.`,
        tags: ['mul'],
        passi: 1,
      });
    },
  },
  {
    id: 's-fiori-file',
    classe: 2,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const k = rng.intero(2, 10);
      const tetto = Math.min(10, Math.floor(fiore.max / k), Math.floor(100 / k));
      if (tetto < 2) return null;
      const n = rng.intero(2, tetto);
      const tot = k * n;
      return scheda({
        testo: `Nell’orto ogni fila ha ${plur(k, fiore)}. ${quanti(fiore)} ci sono in ${n} file?`,
        dati: [qta(fiore, k), { etichetta: 'file', valore: n, tipo: 'altro' }],
        operazioni: [passo(k, '×', n)],
        risultato: tot,
        unita: fiore.plurale,
        risposta: ciSono(tot, fiore),
        tags: ['mul'],
        passi: 1,
      });
    },
  },
  {
    id: 's-caramelle-sacchetti',
    classe: 2,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const diviso = divisioneEsatta(rng, Math.min(caramella.max, 100), sacchetto.max);
      if (!diviso) return null;
      const { totale, gruppi, ciascuno } = diviso;
      return scheda({
        testo: `Ci sono ${plur(totale, caramella)} da dividere in ${plur(gruppi, sacchetto)} uguali. ${quanti(caramella)} vanno in ogni sacchetto?`,
        dati: [qta(caramella, totale), qta(sacchetto, gruppi)],
        operazioni: [passo(totale, ':', gruppi)],
        risultato: ciascuno,
        unita: caramella.plurale,
        risposta: `In ogni sacchetto vanno ${plur(ciascuno, caramella)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 's-biglie-bambini',
    classe: 2,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const diviso = divisioneEsatta(rng, 60, 10);
      if (!diviso) return null;
      const { totale, gruppi, ciascuno } = diviso;
      return scheda({
        testo: `${plur(totale, biglia)} si dividono tra ${gruppi} bambini, in parti uguali. ${quanti(biglia)} riceve ogni bambino?`,
        dati: [qta(biglia, totale), { etichetta: 'bambini', valore: gruppi, tipo: 'quantita' }],
        operazioni: [passo(totale, ':', gruppi)],
        risultato: ciascuno,
        unita: biglia.plurale,
        risposta: `Ogni bambino riceve ${plur(ciascuno, biglia)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 's-libri-scaffali',
    classe: 2,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const diviso = divisioneEsatta(rng, libro.max, scaffale.max);
      if (!diviso) return null;
      const { totale, gruppi, ciascuno } = diviso;
      return scheda({
        testo: `In biblioteca ci sono ${plur(totale, libro)} da mettere su ${plur(gruppi, scaffale)}, lo stesso numero su ciascuno. ${quanti(libro)} vanno su ogni scaffale?`,
        dati: [qta(libro, totale), qta(scaffale, gruppi)],
        operazioni: [passo(totale, ':', gruppi)],
        risultato: ciascuno,
        unita: libro.plurale,
        risposta: `Su ogni scaffale vanno ${plur(ciascuno, libro)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 's-matite-scatole',
    classe: 2,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const diviso = divisioneEsatta(rng, matita.max, scatola.max);
      if (!diviso) return null;
      const { totale, gruppi, ciascuno } = diviso;
      return scheda({
        testo: `La maestra ha ${plur(totale, matita)} e le mette in ${plur(gruppi, scatola)} uguali. ${quanti(matita)} mette in ogni scatola?`,
        dati: [qta(matita, totale), qta(scatola, gruppi)],
        operazioni: [passo(totale, ':', gruppi)],
        risultato: ciascuno,
        unita: matita.plurale,
        risposta: `In ogni scatola mette ${plur(ciascuno, matita)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
];
