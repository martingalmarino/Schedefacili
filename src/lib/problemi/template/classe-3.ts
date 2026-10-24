import type { Template } from '../types';
import {
  alunno,
  altro,
  biglia,
  caramella,
  cesto,
  ciSono,
  coppiaResto,
  coppiaSomma,
  divisioneEsatta,
  euro,
  figurina,
  fiore,
  libro,
  matita,
  mela,
  ne,
  nomeCasuale,
  pallone,
  passo,
  plur,
  pronome,
  qta,
  quaderno,
  quanti,
  resta,
  riceve,
  sacchetto,
  scatola,
  scaffale,
  scheda,
} from './comuni';

export const CLASSE_TERZA: Template[] = [
  {
    id: 't-figurine-regalo',
    classe: 3,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = coppiaResto(rng, 180, 30);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, figurina)}. Ne regala ${plur(b, figurina)} a suo fratello. ${quanti(figurina)} ${pronome(persona.genere)} restano?`,
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
    id: 't-classi',
    classe: 3,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const n = rng.intero(2, 12);
      const k = rng.intero(12, 28);
      const tot = n * k;
      return scheda({
        testo: `In una scuola ci sono ${n} classi. In ogni classe ci sono ${plur(k, alunno)}. ${quanti(alunno)} ci sono in tutto?`,
        dati: [altro('classi', n), qta(alunno, k)],
        operazioni: [passo(n, '×', k)],
        risultato: tot,
        unita: alunno.plurale,
        risposta: ciSono(tot, alunno),
        tags: ['mul'],
        passi: 1,
      });
    },
  },
  {
    id: 't-caramelle',
    classe: 3,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const diviso = divisioneEsatta(rng, caramella.max, sacchetto.max);
      if (!diviso) return null;
      const { totale, gruppi, ciascuno } = diviso;
      return scheda({
        testo: `La maestra divide ${plur(totale, caramella)} in ${plur(gruppi, sacchetto)} uguali. ${quanti(caramella)} mette in ogni sacchetto?`,
        dati: [qta(caramella, totale), qta(sacchetto, gruppi)],
        operazioni: [passo(totale, ':', gruppi)],
        risultato: ciascuno,
        unita: caramella.plurale,
        risposta: `In ogni sacchetto mette ${plur(ciascuno, caramella)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 't-libri-tavoli',
    classe: 3,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = coppiaSomma(rng, libro.max, 40);
      return scheda({
        testo: `In biblioteca, su un tavolo ci sono ${plur(a, libro)} e sull’altro ${plur(b, libro)}. ${quanti(libro)} ci sono in tutto?`,
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
    id: 't-orto-fiori',
    classe: 3,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = coppiaResto(rng, fiore.max, 8);
      return scheda({
        testo: `Nell’orto ${persona.nome} conta ${plur(a, fiore)}. Ne coglie ${plur(b, fiore)} per la maestra. ${quanti(fiore)} restano nell’orto?`,
        dati: [qta(fiore, a), qta(fiore, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: fiore.plurale,
        risposta: `Nell’orto ${resta(resto, fiore).charAt(0).toLocaleLowerCase('it')}${resta(resto, fiore).slice(1)}`,
        tags: ['sub'],
        passi: 1,
      });
    },
  },
  {
    id: 't-quaderni-prezzo',
    classe: 3,
    tags: ['euro'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const n = rng.intero(2, 8);
      const p = rng.intero(1, 4);
      const tot = n * p;
      return scheda({
        testo: `${persona.nome} compra ${plur(n, quaderno)} da ${euro(p)} l’uno. Quanto spende?`,
        dati: [qta(quaderno, n), { etichetta: 'prezzo', valore: p, tipo: 'prezzo' }],
        operazioni: [passo(n, '×', p)],
        risultato: tot,
        unita: '€',
        risposta: `Spende ${euro(tot)}.`,
        tags: ['euro'],
        passi: 1,
      });
    },
  },
  {
    id: 't-matite-scatole',
    classe: 3,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const diviso = divisioneEsatta(rng, matita.max, scatola.max);
      if (!diviso) return null;
      const { totale, gruppi, ciascuno } = diviso;
      return scheda({
        testo: `Per il disegno ci sono ${plur(totale, matita)}. Si mettono in ${plur(gruppi, scatola)} uguali. ${quanti(matita)} vanno in ogni scatola?`,
        dati: [qta(matita, totale), qta(scatola, gruppi)],
        operazioni: [passo(totale, ':', gruppi)],
        risultato: ciascuno,
        unita: matita.plurale,
        risposta: `In ogni scatola vanno ${plur(ciascuno, matita)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 't-biglie',
    classe: 3,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, tot } = coppiaSomma(rng, 80, 160);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, biglia)} in tasca e ${plur(b, biglia)} in una scatola. ${quanti(biglia)} ha in tutto?`,
        dati: [qta(biglia, a), qta(biglia, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: biglia.plurale,
        risposta: `In tutto ha ${plur(tot, biglia)}.`,
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 't-palloni',
    classe: 3,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const { a, b, resto } = coppiaResto(rng, pallone.max, 6);
      return scheda({
        testo: `Nel deposito ci sono ${plur(a, pallone)}. La squadra ne porta in palestra ${plur(b, pallone)}. ${quanti(pallone)} restano nel deposito?`,
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
    id: 't-libro-euro',
    classe: 3,
    tags: ['euro'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const b = rng.intero(5, 18);
      const resto = rng.intero(2, 25);
      const a = b + resto;
      return scheda({
        testo: `${persona.nome} ha ${euro(a)}. Compra un libro da ${euro(b)}. Quanti euro ${pronome(persona.genere)} restano?`,
        dati: [
          { etichetta: 'euro', valore: a, tipo: 'prezzo' },
          { etichetta: 'prezzo', valore: b, tipo: 'prezzo' },
        ],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: '€',
        risposta: `${riceve(persona)} restano ${euro(resto)}.`,
        tags: ['euro'],
        passi: 1,
      });
    },
  },
  {
    id: 't-papa-quaderni',
    classe: 3,
    tags: ['euro'],
    passi: 2,
    genera(rng) {
      const n = rng.intero(2, 6);
      const p = rng.intero(1, 4);
      const q = rng.intero(2, 12);
      const costo = n * p;
      const totale = costo + q;
      return scheda({
        testo: `Il papà compra ${plur(n, quaderno)} da ${euro(p)} l’uno e un astuccio da ${euro(q)}. Quanto spende in tutto?`,
        dati: [qta(quaderno, n), { etichetta: 'prezzo', valore: p, tipo: 'prezzo' }, { etichetta: 'astuccio', valore: q, tipo: 'prezzo' }],
        operazioni: [passo(n, '×', p), passo(costo, '+', q)],
        risultato: totale,
        unita: '€',
        risposta: `Spende ${euro(totale)}.`,
        tags: ['euro'],
        passi: 2,
      });
    },
  },
  {
    id: 't-resto-acquisti',
    classe: 3,
    tags: ['euro'],
    passi: 2,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const b = rng.intero(5, 16);
      const c = rng.intero(3, 14);
      const resto = rng.intero(2, 30);
      const a = b + c + resto;
      const spesa = b + c;
      return scheda({
        testo: `${persona.nome} ha ${euro(a)}. Compra un libro da ${euro(b)} e un gioco da ${euro(c)}. Quanti euro ${pronome(persona.genere)} restano?`,
        dati: [
          { etichetta: 'euro', valore: a, tipo: 'prezzo' },
          { etichetta: 'prezzo', valore: b, tipo: 'prezzo' },
          { etichetta: 'gioco', valore: c, tipo: 'prezzo' },
        ],
        operazioni: [passo(b, '+', c), passo(a, '−', spesa)],
        risultato: resto,
        unita: '€',
        risposta: `${riceve(persona)} restano ${euro(resto)}.`,
        tags: ['euro'],
        passi: 2,
      });
    },
  },
  {
    id: 't-gita-assenti',
    classe: 3,
    tags: ['mul'],
    passi: 2,
    genera(rng) {
      const n = rng.intero(2, 8);
      const k = rng.intero(15, 30);
      const tot = n * k;
      const assenti = rng.intero(2, Math.min(20, tot - 2));
      const partono = tot - assenti;
      return scheda({
        testo: `In una scuola ci sono ${n} classi. In ogni classe ci sono ${plur(k, alunno)}. Il giorno della gita ${plur(assenti, alunno)} restano a casa. ${quanti(alunno)} partono?`,
        dati: [altro('classi', n), qta(alunno, k), qta(alunno, assenti)],
        operazioni: [passo(n, '×', k), passo(tot, '−', assenti)],
        risultato: partono,
        unita: alunno.plurale,
        risposta: `Partono ${plur(partono, alunno)}.`,
        tags: ['mul'],
        passi: 2,
      });
    },
  },
  {
    id: 't-cesti-mele',
    classe: 3,
    tags: ['mul'],
    passi: 2,
    genera(rng) {
      const n = rng.intero(2, 4);
      const k = rng.intero(4, 8);
      const tot = n * k;
      const portate = rng.intero(2, tot - 1);
      const restano = tot - portate;
      return scheda({
        testo: `Nell’orto ci sono ${plur(n, cesto)}. Ogni cesto contiene ${plur(k, mela)}. La classe ne porta a scuola ${plur(portate, mela)}. ${quanti(mela)} restano nell’orto?`,
        dati: [qta(cesto, n), qta(mela, k), qta(mela, portate)],
        operazioni: [passo(n, '×', k), passo(tot, '−', portate)],
        risultato: restano,
        unita: mela.plurale,
        risposta: `Nell’orto ${resta(restano, mela).charAt(0).toLocaleLowerCase('it')}${resta(restano, mela).slice(1)}`,
        tags: ['mul'],
        passi: 2,
      });
    },
  },
  {
    id: 't-scaffali',
    classe: 3,
    tags: ['mul'],
    passi: 2,
    genera(rng) {
      const n = rng.intero(2, 6);
      const k = rng.intero(4, 10);
      const tot = n * k;
      if (tot < 4) return null;
      const prestati = rng.intero(2, Math.min(libro.max, tot - 1));
      const restano = tot - prestati;
      return scheda({
        testo: `In biblioteca ci sono ${plur(n, scaffale)}. Su ogni scaffale ci sono ${plur(k, libro)}. I bambini ne prendono in prestito ${plur(prestati, libro)}. ${quanti(libro)} restano?`,
        dati: [qta(scaffale, n), qta(libro, k), qta(libro, prestati)],
        operazioni: [passo(n, '×', k), passo(tot, '−', prestati)],
        risultato: restano,
        unita: libro.plurale,
        risposta: resta(restano, libro),
        tags: ['mul'],
        passi: 2,
      });
    },
  },
  {
    id: 't-squadre',
    classe: 3,
    tags: ['mul'],
    passi: 2,
    genera(rng) {
      const n = rng.intero(2, 4);
      const k = rng.intero(2, 4);
      const tot = n * k;
      const usati = rng.intero(2, tot - 1);
      const restano = tot - usati;
      return scheda({
        testo: `Alla partita giocano ${n} squadre. Ogni squadra usa ${plur(k, pallone)}. Dopo il gioco ne ripongono ${plur(usati, pallone)}. ${quanti(pallone)} restano in palestra?`,
        dati: [altro('squadre', n), qta(pallone, k), qta(pallone, usati)],
        operazioni: [passo(n, '×', k), passo(tot, '−', usati)],
        risultato: restano,
        unita: pallone.plurale,
        risposta: `In palestra ${resta(restano, pallone).charAt(0).toLocaleLowerCase('it')}${resta(restano, pallone).slice(1)}`,
        tags: ['mul'],
        passi: 2,
      });
    },
  },
  {
    id: 't-figurine-compra',
    classe: 3,
    tags: ['add'],
    passi: 2,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const a = rng.intero(20, 80);
      const b = rng.intero(10, 40);
      const somma = a + b;
      const c = rng.intero(4, somma - 2);
      const resto = somma - c;
      return scheda({
        testo: `${persona.nome} ha ${plur(a, figurina)}. Ne compra altre ${plur(b, figurina)} e poi ${ne()} regala ${plur(c, figurina)}. ${quanti(figurina)} ${pronome(persona.genere)} restano?`,
        dati: [qta(figurina, a), qta(figurina, b), qta(figurina, c)],
        operazioni: [passo(a, '+', b), passo(somma, '−', c)],
        risultato: resto,
        unita: figurina.plurale,
        risposta: `${riceve(persona)} restano ${plur(resto, figurina)}.`,
        tags: ['add'],
        passi: 2,
      });
    },
  },
  {
    id: 't-fiori-nastro',
    classe: 3,
    tags: ['euro'],
    passi: 2,
    genera(rng) {
      const n = rng.intero(2, 8);
      const p = rng.intero(1, 5);
      const q = rng.intero(2, 8);
      const costo = n * p;
      const totale = costo + q;
      return scheda({
        testo: `Dal fioraio la mamma compra ${plur(n, fiore)} da ${euro(p)} l’uno e un nastro da ${euro(q)}. Quanto spende?`,
        dati: [qta(fiore, n), { etichetta: 'prezzo', valore: p, tipo: 'prezzo' }, { etichetta: 'nastro', valore: q, tipo: 'prezzo' }],
        operazioni: [passo(n, '×', p), passo(costo, '+', q)],
        risultato: totale,
        unita: '€',
        risposta: `Spende ${euro(totale)}.`,
        tags: ['euro'],
        passi: 2,
      });
    },
  },
];
