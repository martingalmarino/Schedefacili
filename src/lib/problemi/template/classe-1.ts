import type { Template } from '../types';
import {
  adesivo,
  bambino,
  biglia,
  ciSono,
  dentro20,
  fiore,
  figurina,
  filaIcone,
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
  scheda,
  togli20,
} from './comuni';

export const CLASSE_PRIMA: Template[] = [
  {
    id: 'p-regalo',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const ogg = rng.scegli([figurina, matita, adesivo, biglia, fiore]);
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, ogg)}. ${riceve(persona)} regalano altre ${plur(b, ogg)}. ${quanti(ogg)} ha adesso?`,
        dati: [qta(ogg, a), qta(ogg, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: ogg.plurale,
        risposta: `Adesso ha ${plur(tot, ogg)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, ogg.id),
      });
    },
  },
  {
    id: 'p-cesto-mele',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `Nel cesto ci sono ${plur(a, mela)}. ${persona.nome} ${ne()} mangia ${plur(b, mela)}. ${quanti(mela)} restano nel cesto?`,
        dati: [qta(mela, a), qta(mela, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: mela.plurale,
        risposta: `Nel cesto ${resta(resto, mela).charAt(0).toLocaleLowerCase('it')}${resta(resto, mela).slice(1)}`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, mela.id),
      });
    },
  },
  {
    id: 'p-prato',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `Sul prato ci sono ${plur(a, bambino)}. Arrivano ${plur(b, bambino)}. ${quanti(bambino)} ci sono ora?`,
        dati: [qta(bambino, a), qta(bambino, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: bambino.plurale,
        risposta: `Ora ${ciSono(tot, bambino).charAt(0).toLocaleLowerCase('it')}${ciSono(tot, bambino).slice(1)}`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, bambino.id),
      });
    },
  },
  {
    id: 'p-orto',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `Nell’orto ci sono ${plur(a, fiore)}. ${persona.nome} ${ne()} coglie ${plur(b, fiore)}. ${quanti(fiore)} restano nell’orto?`,
        dati: [qta(fiore, a), qta(fiore, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: fiore.plurale,
        risposta: `Nell’orto ${resta(resto, fiore).charAt(0).toLocaleLowerCase('it')}${resta(resto, fiore).slice(1)}`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, fiore.id),
      });
    },
  },
  {
    id: 'p-palloni',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `In palestra ci sono ${plur(a, pallone)}. Il maestro ne porta ${plur(b, pallone)}. ${quanti(pallone)} ci sono in tutto?`,
        dati: [qta(pallone, a), qta(pallone, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: pallone.plurale,
        risposta: ciSono(tot, pallone),
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, pallone.id),
      });
    },
  },
  {
    id: 'p-biblioteca',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `Sul tavolo della biblioteca ci sono ${plur(a, libro)}. ${persona.nome} ${ne()} restituisce ${plur(b, libro)}. ${quanti(libro)} restano sul tavolo?`,
        dati: [qta(libro, a), qta(libro, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: libro.plurale,
        risposta: `Sul tavolo ${resta(resto, libro).charAt(0).toLocaleLowerCase('it')}${resta(resto, libro).slice(1)}`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, libro.id),
      });
    },
  },
  {
    id: 'p-merenda',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, mela)} per la merenda. La mamma ${pronome(persona.genere)} dà altre ${plur(b, mela)}. ${quanti(mela)} ha adesso?`,
        dati: [qta(mela, a), qta(mela, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: mela.plurale,
        risposta: `Adesso ha ${plur(tot, mela)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, mela.id),
      });
    },
  },
  {
    id: 'p-biglie',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, biglia)}. Durante il gioco ${ne()} perde ${plur(b, biglia)}. ${quanti(biglia)} ${pronome(persona.genere)} restano?`,
        dati: [qta(biglia, a), qta(biglia, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: biglia.plurale,
        risposta: `${riceve(persona)} ${resto === 1 ? 'resta' : 'restano'} ${plur(resto, biglia)}.`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, biglia.id),
      });
    },
  },
  {
    id: 'p-presta-matite',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `Nell’astuccio di ${persona.nome} ci sono ${plur(a, matita)}. Ne presta ${plur(b, matita)} a un compagno. ${quanti(matita)} restano nell’astuccio?`,
        dati: [qta(matita, a), qta(matita, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: matita.plurale,
        risposta: `Nell’astuccio ${resta(resto, matita).charAt(0).toLocaleLowerCase('it')}${resta(resto, matita).slice(1)}`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, matita.id),
      });
    },
  },
  {
    id: 'p-adesivi',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, adesivo)} sul diario. Ne trova ${plur(b, adesivo)} in un cassetto. ${quanti(adesivo)} ha in tutto?`,
        dati: [qta(adesivo, a), qta(adesivo, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: adesivo.plurale,
        risposta: `In tutto ha ${plur(tot, adesivo)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, adesivo.id),
      });
    },
  },
  {
    id: 'p-quaderni',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `Sul banco ci sono ${plur(a, quaderno)}. La maestra ne appoggia ${plur(b, quaderno)}. ${quanti(quaderno)} ci sono adesso?`,
        dati: [qta(quaderno, a), qta(quaderno, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: quaderno.plurale,
        risposta: ciSono(tot, quaderno),
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, quaderno.id),
      });
    },
  },
  {
    id: 'p-gita',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `Per la gita partono ${plur(a, bambino)}. Alla prima fermata ne scendono ${plur(b, bambino)}. ${quanti(bambino)} restano sul pullman?`,
        dati: [qta(bambino, a), qta(bambino, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: bambino.plurale,
        risposta: `Sul pullman ${resta(resto, bambino).charAt(0).toLocaleLowerCase('it')}${resta(resto, bambino).slice(1)}`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, bambino.id),
      });
    },
  },
  {
    id: 'p-negozio',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `Dal fioraio ${persona.nome} sceglie ${plur(a, fiore)}. Poi ne sceglie altri ${plur(b, fiore)}. ${quanti(fiore)} sceglie in tutto?`,
        dati: [qta(fiore, a), qta(fiore, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: fiore.plurale,
        risposta: `In tutto sceglie ${plur(tot, fiore)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, fiore.id),
      });
    },
  },
  {
    id: 'p-squadra',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `In squadra ci sono già ${plur(a, bambino)}. Entrano altri ${plur(b, bambino)}. ${quanti(bambino)} sono in squadra ora?`,
        dati: [qta(bambino, a), qta(bambino, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: bambino.plurale,
        risposta: `In squadra ci sono ${plur(tot, bambino)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, bambino.id),
      });
    },
  },
  {
    id: 'p-casa-figurine',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `A casa ${persona.nome} tiene ${plur(a, figurina)} in una scatola. Il papà ${pronome(persona.genere)} regala ${plur(b, figurina)}. ${quanti(figurina)} ci sono nella scatola?`,
        dati: [qta(figurina, a), qta(figurina, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: figurina.plurale,
        risposta: `Nella scatola ci sono ${plur(tot, figurina)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, figurina.id),
      });
    },
  },
  {
    id: 'p-mele-cadono',
    classe: 1,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const { a, b, resto } = togli20(rng);
      return scheda({
        testo: `Sull’albero restano ${plur(a, mela)}. Con il vento ne cadono ${plur(b, mela)}. ${quanti(mela)} restano sull’albero?`,
        dati: [qta(mela, a), qta(mela, b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: mela.plurale,
        risposta: `Sull’albero ${resta(resto, mela).charAt(0).toLocaleLowerCase('it')}${resta(resto, mela).slice(1)}`,
        tags: ['sub'],
        passi: 1,
        aiutoVisivo: filaIcone(a, mela.id),
      });
    },
  },
  {
    id: 'p-matite-trovate',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, matita)}. Per terra ne trova ${plur(b, matita)}. ${quanti(matita)} ha adesso?`,
        dati: [qta(matita, a), qta(matita, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: matita.plurale,
        risposta: `Adesso ha ${plur(tot, matita)}.`,
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, matita.id),
      });
    },
  },
  {
    id: 'p-nonna-mele',
    classe: 1,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = dentro20(rng);
      return scheda({
        testo: `Nel cesto della nonna ci sono ${plur(a, mela)}. Lei ne aggiunge ${plur(b, mela)}. ${quanti(mela)} ci sono nel cesto?`,
        dati: [qta(mela, a), qta(mela, b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: mela.plurale,
        risposta: ciSono(tot, mela),
        tags: ['add'],
        passi: 1,
        aiutoVisivo: filaIcone(tot, mela.id),
      });
    },
  },
];
