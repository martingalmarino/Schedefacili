import type { Rng } from '../rng';
import type { Template } from '../types';
import {
  alunno,
  altro,
  cesto,
  ciSono,
  coppiaResto,
  coppiaSomma,
  euro,
  fetta,
  figurina,
  fiore,
  frazioneSvg,
  libro,
  mela,
  ne,
  nomeCasuale,
  passo,
  pastello,
  plur,
  pronome,
  qta,
  quanti,
  resta,
  riceve,
  scatola,
  scheda,
  succo,
} from './comuni';

function tenths(rng: Rng, min: number, max: number): { decimi: number; valore: number } {
  const decimi = rng.intero(min, max);
  return { decimi, valore: decimi / 10 };
}

export const CLASSE_QUARTA: Template[] = [
  {
    id: 'q-torta',
    classe: 4,
    tags: ['frazioni'],
    passi: 1,
    genera(rng) {
      const d = rng.intero(4, fetta.max);
      const n = rng.intero(2, d - 1);
      const rest = d - n;
      return scheda({
        testo: `Una torta è divisa in ${plur(d, fetta)}. ${nomeCasuale(rng).nome} ne mangia ${plur(n, fetta)}. Che frazione della torta ha mangiato? ${quanti(fetta)} restano?`,
        dati: [qta(fetta, d), qta(fetta, n)],
        operazioni: [passo(d, '−', n)],
        risultato: rest,
        unita: fetta.plurale,
        risposta: `Ha mangiato ${n}/${d} della torta. ${resta(rest, fetta)}`,
        tags: ['frazioni'],
        passi: 1,
        aiutoVisivo: frazioneSvg(n, d),
      });
    },
  },
  {
    id: 'q-succhi',
    classe: 4,
    tags: ['decimali'],
    passi: 1,
    genera(rng) {
      const prezzo = tenths(rng, 5, 35);
      const n = rng.intero(2, succo.max);
      const tot = (prezzo.decimi * n) / 10;
      return scheda({
        testo: `Un succo costa ${euro(prezzo.valore)}. Quanto costano ${plur(n, succo)}?`,
        dati: [{ etichetta: 'prezzo', valore: prezzo.valore, tipo: 'prezzo' }, qta(succo, n)],
        operazioni: [passo(prezzo.valore, '×', n)],
        risultato: tot,
        unita: '€',
        risposta: `Costano ${euro(tot)}.`,
        tags: ['decimali'],
        passi: 1,
      });
    },
  },
  {
    id: 'q-mele-cesti',
    classe: 4,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const n = rng.intero(2, cesto.max);
      const ciascuno = rng.intero(2, Math.floor(mela.max / n));
      if (ciascuno < 2) return null;
      const tot = n * ciascuno;
      return scheda({
        testo: `Ci sono ${plur(tot, mela)} da mettere in ${plur(n, cesto)}, lo stesso numero in ciascuno. ${quanti(mela)} vanno in ogni cesto?`,
        dati: [qta(mela, tot), qta(cesto, n)],
        operazioni: [passo(tot, ':', n)],
        risultato: ciascuno,
        unita: mela.plurale,
        risposta: `In ogni cesto vanno ${plur(ciascuno, mela)}.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 'q-corda',
    classe: 4,
    tags: ['misure'],
    passi: 1,
    genera(rng) {
      const parti = rng.scegli([2, 4, 5]);
      const ciascuna = rng.intero(2, 12);
      const metri = parti * ciascuna;
      return scheda({
        testo: `Una corda è lunga ${metri} m. La si taglia in ${parti} parti uguali. Quanti metri misura una parte?`,
        dati: [altro('metri', metri), altro('parti', parti)],
        operazioni: [passo(metri, ':', parti)],
        risultato: ciascuna,
        unita: 'm',
        risposta: `Una parte misura ${ciascuna} m.`,
        tags: ['misure'],
        passi: 1,
      });
    },
  },
  {
    id: 'q-merenda-prezzi',
    classe: 4,
    tags: ['decimali'],
    passi: 1,
    genera(rng) {
      const succoPrezzo = tenths(rng, 5, 30);
      const panino = tenths(rng, 8, 35);
      const tot = (succoPrezzo.decimi + panino.decimi) / 10;
      return scheda({
        testo: `Alla merenda un succo costa ${euro(succoPrezzo.valore)} e un panino costa ${euro(panino.valore)}. Quanto costano insieme?`,
        dati: [
          { etichetta: 'prezzo', valore: succoPrezzo.valore, tipo: 'prezzo' },
          { etichetta: 'panino', valore: panino.valore, tipo: 'prezzo' },
        ],
        operazioni: [passo(succoPrezzo.valore, '+', panino.valore)],
        risultato: tot,
        unita: '€',
        risposta: `Insieme costano ${euro(tot)}.`,
        tags: ['decimali'],
        passi: 1,
      });
    },
  },
  {
    id: 'q-resto-decimale',
    classe: 4,
    tags: ['decimali'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const spende = tenths(rng, 8, 40);
      const resto = tenths(rng, 5, 50);
      const ha = (spende.decimi + resto.decimi) / 10;
      return scheda({
        testo: `${persona.nome} ha ${euro(ha)}. Compra un quaderno da ${euro(spende.valore)}. Quanti euro ${pronome(persona.genere)} restano?`,
        dati: [
          { etichetta: 'euro', valore: ha, tipo: 'prezzo' },
          { etichetta: 'prezzo', valore: spende.valore, tipo: 'prezzo' },
        ],
        operazioni: [passo(ha, '−', spende.valore)],
        risultato: resto.valore,
        unita: '€',
        risposta: `${riceve(persona)} restano ${euro(resto.valore)}.`,
        tags: ['decimali'],
        passi: 1,
      });
    },
  },
  {
    id: 'q-nastro-metri',
    classe: 4,
    tags: ['misure'],
    passi: 1,
    genera(rng) {
      const metri = rng.intero(2, 20);
      const cm = metri * 100;
      return scheda({
        testo: `Un nastro misura ${cm} cm. Quanti metri sono?`,
        dati: [altro('centimetri', cm)],
        operazioni: [passo(cm, ':', 100)],
        risultato: metri,
        unita: 'm',
        risposta: `Sono ${metri} m.`,
        tags: ['misure'],
        passi: 1,
      });
    },
  },
  {
    id: 'q-figurine',
    classe: 4,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const { a, b, resto } = coppiaResto(rng, 200, 40);
      return scheda({
        testo: `${persona.nome} ha ${plur(a, figurina)} nell’album e ${ne()} stacca ${plur(b, figurina)}. ${quanti(figurina)} ${pronome(persona.genere)} restano?`,
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
    id: 'q-pastelli',
    classe: 4,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const k = rng.intero(4, 10);
      const n = rng.intero(2, Math.min(scatola.max, Math.floor(pastello.max / k)));
      const tot = k * n;
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
    id: 'q-libri',
    classe: 4,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const { a, b, tot } = coppiaSomma(rng, libro.max, 40);
      return scheda({
        testo: `Nella biblioteca di classe ci sono ${plur(a, libro)} di storie e ${plur(b, libro)} di scienze. ${quanti(libro)} ci sono in tutto?`,
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
    id: 'q-nastro-taglio',
    classe: 4,
    tags: ['misure'],
    passi: 2,
    genera(rng) {
      const metri = rng.intero(2, 20);
      const cm = metri * 100;
      const taglio = rng.intero(15, cm - 15);
      const resto = cm - taglio;
      return scheda({
        testo: `Un nastro è lungo ${metri} m. Ne tagli ${taglio} cm. Quanti centimetri restano?`,
        dati: [altro('metri', metri), altro('centimetri', taglio)],
        operazioni: [passo(metri, '×', 100), passo(cm, '−', taglio)],
        risultato: resto,
        unita: 'cm',
        risposta: `Restano ${resto} cm.`,
        tags: ['misure'],
        passi: 2,
      });
    },
  },
  {
    id: 'q-alunni-gita',
    classe: 4,
    tags: ['frazioni'],
    passi: 2,
    genera(rng) {
      const d = rng.scegli([4, 5, 8]);
      const numeratore = rng.intero(2, d - 1);
      const parte = rng.intero(2, Math.floor(alunno.max / d));
      const totale = d * parte;
      const vanno = parte * numeratore;
      return scheda({
        testo: `I ${numeratore}/${d} di ${plur(totale, alunno)} vanno in gita. ${quanti(alunno)} vanno in gita?`,
        dati: [qta(alunno, totale), altro('numeratore', numeratore), altro('denominatore', d)],
        operazioni: [passo(totale, ':', d), passo(parte, '×', numeratore)],
        risultato: vanno,
        unita: alunno.plurale,
        risposta: `Vanno in gita ${plur(vanno, alunno)}.`,
        tags: ['frazioni'],
        passi: 2,
        aiutoVisivo: frazioneSvg(numeratore, d),
      });
    },
  },
  {
    id: 'q-succo-panino',
    classe: 4,
    tags: ['decimali'],
    passi: 2,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const prezzo = tenths(rng, 5, 30);
      const n = rng.intero(2, 6);
      const costo = (prezzo.decimi * n) / 10;
      const panino = tenths(rng, 8, 25);
      const totale = (prezzo.decimi * n + panino.decimi) / 10;
      return scheda({
        testo: `${persona.nome} compra ${plur(n, succo)} da ${euro(prezzo.valore)} l’uno e un panino da ${euro(panino.valore)}. Quanto spende?`,
        dati: [qta(succo, n), { etichetta: 'prezzo', valore: prezzo.valore, tipo: 'prezzo' }, { etichetta: 'panino', valore: panino.valore, tipo: 'prezzo' }],
        operazioni: [passo(prezzo.valore, '×', n), passo(costo, '+', panino.valore)],
        risultato: totale,
        unita: '€',
        risposta: `Spende ${euro(totale)}.`,
        tags: ['decimali'],
        passi: 2,
      });
    },
  },
  {
    id: 'q-portafoglio',
    classe: 4,
    tags: ['euro'],
    passi: 2,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const prezzo = tenths(rng, 10, 25);
      const n = rng.intero(2, 4);
      const costo = (prezzo.decimi * n) / 10;
      const extra = rng.intero(20, 80);
      const ha = (prezzo.decimi * n + extra) / 10;
      const resto = extra / 10;
      return scheda({
        testo: `${persona.nome} ha ${euro(ha)}. Compra ${plur(n, succo)} da ${euro(prezzo.valore)} l’uno. Quanti euro ${pronome(persona.genere)} restano?`,
        dati: [
          { etichetta: 'euro', valore: ha, tipo: 'prezzo' },
          qta(succo, n),
          { etichetta: 'prezzo', valore: prezzo.valore, tipo: 'prezzo' },
        ],
        operazioni: [passo(n, '×', prezzo.valore), passo(ha, '−', costo)],
        risultato: resto,
        unita: '€',
        risposta: `${riceve(persona)} restano ${euro(resto)}.`,
        tags: ['euro'],
        passi: 2,
      });
    },
  },
  {
    id: 'q-peso',
    classe: 4,
    tags: ['misure'],
    passi: 2,
    genera(rng) {
      const kg = rng.intero(2, 8);
      const grammi = kg * 1000;
      const usati = rng.intero(200, grammi - 200);
      const resto = grammi - usati;
      return scheda({
        testo: `Per l’orto ci sono ${kg} kg di semi. Se ne usano ${usati} g. Quanti grammi di semi restano?`,
        dati: [altro('chilogrammi', kg), altro('grammi', usati)],
        operazioni: [passo(kg, '×', 1000), passo(grammi, '−', usati)],
        risultato: resto,
        unita: 'g',
        risposta: `Restano ${resto} g.`,
        tags: ['misure'],
        passi: 2,
      });
    },
  },
  {
    id: 'q-nastro-aggiunta',
    classe: 4,
    tags: ['misure'],
    passi: 2,
    genera(rng) {
      const metri = rng.intero(2, 12);
      const cm = metri * 100;
      const aggiunta = rng.intero(10, 80);
      const tot = cm + aggiunta;
      return scheda({
        testo: `Un nastro è lungo ${metri} m. Si aggiungono altri ${aggiunta} cm. Quanti centimetri misura adesso?`,
        dati: [altro('metri', metri), altro('centimetri', aggiunta)],
        operazioni: [passo(metri, '×', 100), passo(cm, '+', aggiunta)],
        risultato: tot,
        unita: 'cm',
        risposta: `Adesso misura ${tot} cm.`,
        tags: ['misure'],
        passi: 2,
      });
    },
  },
  {
    id: 'q-gita-ritorno',
    classe: 4,
    tags: ['frazioni'],
    passi: 3,
    genera(rng) {
      const d = rng.scegli([4, 5]);
      const numeratore = rng.intero(2, d - 1);
      const parte = rng.intero(2, Math.floor(alunno.max / d));
      const totale = d * parte;
      const vanno = parte * numeratore;
      const tornano = rng.intero(2, Math.min(alunno.max, vanno - 2));
      const restano = vanno - tornano;
      return scheda({
        testo: `I ${numeratore}/${d} di ${plur(totale, alunno)} vanno in gita. Poi ${plur(tornano, alunno)} tornano in classe. ${quanti(alunno)} restano in gita?`,
        dati: [qta(alunno, totale), altro('numeratore', numeratore), altro('denominatore', d), qta(alunno, tornano)],
        operazioni: [passo(totale, ':', d), passo(parte, '×', numeratore), passo(vanno, '−', tornano)],
        risultato: restano,
        unita: alunno.plurale,
        risposta: `In gita ${resta(restano, alunno).charAt(0).toLocaleLowerCase('it')}${resta(restano, alunno).slice(1)}`,
        tags: ['frazioni'],
        passi: 3,
        aiutoVisivo: frazioneSvg(numeratore, d),
      });
    },
  },
  {
    id: 'q-file-fiori',
    classe: 4,
    tags: ['mul'],
    passi: 2,
    genera(rng) {
      const k = rng.intero(2, 6);
      const n = rng.intero(2, Math.floor(fiore.max / k));
      if (n < 2) return null;
      const tot = k * n;
      const colti = rng.intero(2, tot - 1);
      const restano = tot - colti;
      return scheda({
        testo: `Nell’orto ci sono ${n} file. Ogni fila ha ${plur(k, fiore)}. Se ne colgono ${plur(colti, fiore)}. ${quanti(fiore)} restano?`,
        dati: [altro('file', n), qta(fiore, k), qta(fiore, colti)],
        operazioni: [passo(n, '×', k), passo(tot, '−', colti)],
        risultato: restano,
        unita: fiore.plurale,
        risposta: resta(restano, fiore),
        tags: ['mul'],
        passi: 2,
      });
    },
  },
];
