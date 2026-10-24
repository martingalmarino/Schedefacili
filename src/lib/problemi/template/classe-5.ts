import type { Rng } from '../rng';
import type { Template } from '../types';
import {
  alunno,
  altro,
  euro,
  frazioneSvg,
  libro,
  nomeCasuale,
  passo,
  plur,
  pronome,
  qta,
  quaderno,
  quanti,
  riceve,
  scheda,
} from './comuni';

function tenths(rng: Rng, min: number, max: number): { decimi: number; valore: number } {
  const decimi = rng.intero(min, max);
  return { decimi, valore: decimi / 10 };
}

export const CLASSE_QUINTA: Template[] = [
  {
    id: 'c-area',
    classe: 5,
    tags: ['geometria'],
    passi: 1,
    genera(rng) {
      const a = rng.intero(6, 30);
      const b = rng.intero(4, 18);
      const area = a * b;
      return scheda({
        testo: `Un orto rettangolare è lungo ${a} m e largo ${b} m. Quanto misura l’area?`,
        dati: [altro('metri', a), altro('metri', b)],
        operazioni: [passo(a, '×', b)],
        risultato: area,
        unita: 'm²',
        risposta: `L’area misura ${area} m².`,
        tags: ['geometria'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-iscritti',
    classe: 5,
    tags: ['add'],
    passi: 1,
    genera(rng) {
      const a = rng.intero(80, 240);
      const b = rng.intero(60, 180);
      const tot = a + b;
      return scheda({
        testo: `Nella scuola del paese ci sono ${a} iscritti e in quella del paese vicino ${b}. Quanti iscritti ci sono in tutto?`,
        dati: [altro('iscritti', a), altro('iscritti', b)],
        operazioni: [passo(a, '+', b)],
        risultato: tot,
        unita: 'iscritti',
        risposta: `In tutto ci sono ${tot} iscritti.`,
        tags: ['add'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-iscritti-assenti',
    classe: 5,
    tags: ['sub'],
    passi: 1,
    genera(rng) {
      const a = rng.intero(120, 360);
      const b = rng.intero(15, 80);
      const resto = a - b;
      return scheda({
        testo: `Alla recita sono attesi ${a} spettatori. Ne mancano ${b}. Quanti spettatori arrivano?`,
        dati: [altro('spettatori', a), altro('spettatori', b)],
        operazioni: [passo(a, '−', b)],
        risultato: resto,
        unita: 'spettatori',
        risposta: `Arrivano ${resto} spettatori.`,
        tags: ['sub'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-pagine',
    classe: 5,
    tags: ['mul'],
    passi: 1,
    genera(rng) {
      const k = rng.intero(24, 80);
      const n = rng.intero(2, 8);
      const tot = k * n;
      return scheda({
        testo: `Ogni libro della biblioteca ha ${k} pagine. Quante pagine hanno ${plur(n, libro)}?`,
        dati: [altro('pagine', k), qta(libro, n)],
        operazioni: [passo(k, '×', n)],
        risultato: tot,
        unita: 'pagine',
        risposta: `Hanno ${tot} pagine.`,
        tags: ['mul'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-schede',
    classe: 5,
    tags: ['div'],
    passi: 1,
    genera(rng) {
      const gruppi = rng.intero(4, 12);
      const ciascuno = rng.intero(8, 30);
      const tot = gruppi * ciascuno;
      return scheda({
        testo: `Ci sono ${tot} schede da distribuire in ${gruppi} cartellette uguali. Quante schede vanno in ogni cartelletta?`,
        dati: [altro('schede', tot), altro('cartellette', gruppi)],
        operazioni: [passo(tot, ':', gruppi)],
        risultato: ciascuno,
        unita: 'schede',
        risposta: `In ogni cartelletta vanno ${ciascuno} schede.`,
        tags: ['div'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-quaderni-prezzo',
    classe: 5,
    tags: ['euro'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const prezzo = tenths(rng, 10, 40);
      const n = rng.intero(2, 6);
      const tot = (prezzo.decimi * n) / 10;
      return scheda({
        testo: `${persona.nome} compra ${plur(n, quaderno)} da ${euro(prezzo.valore)} l’uno. Quanto spende?`,
        dati: [qta(quaderno, n), { etichetta: 'prezzo', valore: prezzo.valore, tipo: 'prezzo' }],
        operazioni: [passo(n, '×', prezzo.valore)],
        risultato: tot,
        unita: '€',
        risposta: `Spende ${euro(tot)}.`,
        tags: ['euro'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-merenda',
    classe: 5,
    tags: ['decimali'],
    passi: 1,
    genera(rng) {
      const succoPrezzo = tenths(rng, 8, 30);
      const panino = tenths(rng, 10, 35);
      const tot = (succoPrezzo.decimi + panino.decimi) / 10;
      return scheda({
        testo: `In gita un succo costa ${euro(succoPrezzo.valore)} e un panino costa ${euro(panino.valore)}. Quanto paga un alunno per tutti e due?`,
        dati: [
          { etichetta: 'prezzo', valore: succoPrezzo.valore, tipo: 'prezzo' },
          { etichetta: 'panino', valore: panino.valore, tipo: 'prezzo' },
        ],
        operazioni: [passo(succoPrezzo.valore, '+', panino.valore)],
        risultato: tot,
        unita: '€',
        risposta: `Paga ${euro(tot)}.`,
        tags: ['decimali'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-meta',
    classe: 5,
    tags: ['frazioni'],
    passi: 1,
    genera(rng) {
      const meta = rng.intero(6, 20);
      const totale = meta * 2;
      return scheda({
        testo: `Di ${plur(totale, alunno)}, la metà va in palestra. ${quanti(alunno)} vanno in palestra?`,
        dati: [qta(alunno, totale)],
        operazioni: [passo(totale, ':', 2)],
        risultato: meta,
        unita: alunno.plurale,
        risposta: `Vanno in palestra ${plur(meta, alunno)}.`,
        tags: ['frazioni'],
        passi: 1,
        aiutoVisivo: frazioneSvg(1, 2),
      });
    },
  },
  {
    id: 'c-chilometri',
    classe: 5,
    tags: ['misure'],
    passi: 1,
    genera(rng) {
      const km = rng.intero(2, 18);
      const metri = km * 1000;
      return scheda({
        testo: `La gita percorre ${km} km. Quanti metri sono?`,
        dati: [altro('chilometri', km)],
        operazioni: [passo(km, '×', 1000)],
        risultato: metri,
        unita: 'm',
        risposta: `Sono ${metri} m.`,
        tags: ['misure'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-resto-semplice',
    classe: 5,
    tags: ['euro'],
    passi: 1,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const spende = tenths(rng, 15, 80);
      const resto = tenths(rng, 10, 90);
      const ha = (spende.decimi + resto.decimi) / 10;
      return scheda({
        testo: `${persona.nome} ha ${euro(ha)}. Compra un libro da ${euro(spende.valore)}. Quanti euro ${pronome(persona.genere)} restano?`,
        dati: [
          { etichetta: 'euro', valore: ha, tipo: 'prezzo' },
          { etichetta: 'prezzo', valore: spende.valore, tipo: 'prezzo' },
        ],
        operazioni: [passo(ha, '−', spende.valore)],
        risultato: resto.valore,
        unita: '€',
        risposta: `${riceve(persona)} restano ${euro(resto.valore)}.`,
        tags: ['euro'],
        passi: 1,
      });
    },
  },
  {
    id: 'c-sconto',
    classe: 5,
    tags: ['percentuali'],
    passi: 3,
    genera(rng) {
      const p = rng.scegli([80, 100, 120, 150, 180, 200, 240, 250, 300, 360, 400]);
      const s = rng.scegli([10, 20, 25, 50]);
      const prodotto = p * s;
      const sconto = prodotto / 100;
      const finale = p - sconto;
      return scheda({
        testo: `Una bici costa ${euro(p)}. Oggi c’è lo sconto del ${s}%. Quanto costa la bici scontata?`,
        dati: [
          { etichetta: 'prezzo', valore: p, tipo: 'prezzo' },
          altro('sconto', s),
        ],
        operazioni: [passo(p, '×', s), passo(prodotto, ':', 100), passo(p, '−', sconto)],
        risultato: finale,
        unita: '€',
        risposta: `La bici costa ${euro(finale)}.`,
        tags: ['percentuali'],
        passi: 3,
      });
    },
  },
  {
    id: 'c-giardino',
    classe: 5,
    tags: ['geometria'],
    passi: 3,
    genera(rng) {
      const a = rng.intero(8, 24);
      const b = rng.intero(5, 16);
      const somma = a + b;
      const perimetro = somma * 2;
      const area = a * b;
      return scheda({
        testo: `Un giardino rettangolare è lungo ${a} m e largo ${b} m. Quanto misura il perimetro? Quanto misura l’area?`,
        dati: [altro('metri', a), altro('metri', b)],
        operazioni: [passo(a, '+', b), passo(somma, '×', 2), passo(a, '×', b)],
        risultato: area,
        unita: 'm²',
        risposta: `Il perimetro misura ${perimetro} m. L’area misura ${area} m².`,
        tags: ['geometria'],
        passi: 3,
      });
    },
  },
  {
    id: 'c-pullman',
    classe: 5,
    tags: ['multi'],
    passi: 3,
    genera(rng) {
      const n = rng.intero(28, alunno.max);
      const m = rng.intero(2, 4);
      const totale = n + m;
      const k = rng.scegli([10, 12, 15]);
      const quoziente = Math.floor(totale / k);
      const avanzo = totale % k;
      if (avanzo === 0 || quoziente < 2) return null;
      const coperti = quoziente * k;
      const pullman = quoziente + 1;
      return scheda({
        testo: `Per la gita partono ${plur(n, alunno)} e ${m} insegnanti. Ogni pullman ha ${k} posti. Quanti pullman servono?`,
        dati: [qta(alunno, n), altro('insegnanti', m), altro('posti', k)],
        operazioni: [
          passo(n, '+', m),
          passo(quoziente, '×', k),
          passo(totale, '−', coperti),
          passo(quoziente, '+', 1),
          `Servono ${pullman} pullman, perché ${quoziente} non bastano.`,
        ],
        risultato: pullman,
        unita: 'pullman',
        risposta: `Servono ${pullman} pullman, perché ${quoziente} non bastano.`,
        tags: ['multi'],
        passi: 3,
      });
    },
  },
  {
    id: 'c-resto',
    classe: 5,
    tags: ['euro'],
    passi: 3,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const n = rng.intero(2, 6);
      const p = rng.intero(1, 4);
      const q = rng.intero(2, 9);
      const costo = n * p;
      const totale = costo + q;
      const banconote = [20, 50, 100].filter((valore) => valore > totale);
      const b = rng.scegli(banconote);
      const resto = b - totale;
      return scheda({
        testo: `${persona.nome} compra ${plur(n, quaderno)} da ${euro(p)} l’uno e un astuccio da ${euro(q)}. Paga con una banconota da ${euro(b)}. Quanto riceve di resto?`,
        dati: [
          qta(quaderno, n),
          { etichetta: 'prezzo', valore: p, tipo: 'prezzo' },
          { etichetta: 'astuccio', valore: q, tipo: 'prezzo' },
          { etichetta: 'banconota', valore: b, tipo: 'prezzo' },
        ],
        operazioni: [passo(n, '×', p), passo(costo, '+', q), passo(b, '−', totale)],
        risultato: resto,
        unita: '€',
        risposta: `Riceve ${euro(resto)} di resto.`,
        tags: ['euro'],
        passi: 3,
      });
    },
  },
  {
    id: 'c-due-acquisti',
    classe: 5,
    tags: ['euro'],
    passi: 3,
    genera(rng) {
      const persona = nomeCasuale(rng);
      const n = rng.intero(2, 5);
      const p = rng.intero(5, 12);
      const m = rng.intero(2, 6);
      const q = rng.intero(1, 4);
      const costoLibri = n * p;
      const costoQuaderni = m * q;
      const totale = costoLibri + costoQuaderni;
      return scheda({
        testo: `In cartoleria ${persona.nome} compra ${plur(n, libro)} da ${euro(p)} l’uno e ${plur(m, quaderno)} da ${euro(q)} l’uno. Quanto spende?`,
        dati: [
          qta(libro, n),
          { etichetta: 'prezzo', valore: p, tipo: 'prezzo' },
          qta(quaderno, m),
          { etichetta: 'prezzo', valore: q, tipo: 'prezzo' },
        ],
        operazioni: [passo(n, '×', p), passo(m, '×', q), passo(costoLibri, '+', costoQuaderni)],
        risultato: totale,
        unita: '€',
        risposta: `Spende ${euro(totale)}.`,
        tags: ['euro'],
        passi: 3,
      });
    },
  },
  {
    id: 'c-biglietti',
    classe: 5,
    tags: ['frazioni'],
    passi: 3,
    genera(rng) {
      const d = rng.scegli([4, 5, 8]);
      const numeratore = rng.intero(2, d - 1);
      const parte = rng.intero(8, 30);
      const totale = d * parte;
      const venduti = parte * numeratore;
      const restituiti = rng.intero(2, venduti - 2);
      const restano = venduti - restituiti;
      return scheda({
        testo: `Per la recita ci sono ${totale} biglietti. Ne vendono i ${numeratore}/${d}. Poi ${restituiti} biglietti vengono restituiti. Quanti biglietti restano venduti?`,
        dati: [altro('biglietti', totale), altro('numeratore', numeratore), altro('denominatore', d), altro('biglietti', restituiti)],
        operazioni: [passo(totale, ':', d), passo(parte, '×', numeratore), passo(venduti, '−', restituiti)],
        risultato: restano,
        unita: 'biglietti',
        risposta: `Restano venduti ${restano} biglietti.`,
        tags: ['frazioni'],
        passi: 3,
        aiutoVisivo: frazioneSvg(numeratore, d),
      });
    },
  },
  {
    id: 'c-sentiero',
    classe: 5,
    tags: ['misure'],
    passi: 2,
    genera(rng) {
      const metri = rng.intero(4, 25);
      const cm = metri * 100;
      const fatti = rng.intero(40, cm - 40);
      const resto = cm - fatti;
      return scheda({
        testo: `Il sentiero dell’orto è lungo ${metri} m. Se ne sistemano ${fatti} cm. Quanti centimetri restano da sistemare?`,
        dati: [altro('metri', metri), altro('centimetri', fatti)],
        operazioni: [passo(metri, '×', 100), passo(cm, '−', fatti)],
        risultato: resto,
        unita: 'cm',
        risposta: `Restano ${resto} cm.`,
        tags: ['misure'],
        passi: 2,
      });
    },
  },
  {
    id: 'c-percentuale-alunni',
    classe: 5,
    tags: ['percentuali'],
    passi: 2,
    genera(rng) {
      const totale = rng.scegli([20, 40]);
      const s = rng.scegli([10, 20, 25, 50]);
      const prodotto = totale * s;
      const vanno = prodotto / 100;
      return scheda({
        testo: `In classe ci sono ${plur(totale, alunno)}. Il ${s}% va in gita. ${quanti(alunno)} vanno in gita?`,
        dati: [qta(alunno, totale), altro('sconto', s)],
        operazioni: [passo(totale, '×', s), passo(prodotto, ':', 100)],
        risultato: vanno,
        unita: alunno.plurale,
        risposta: `Vanno in gita ${plur(vanno, alunno)}.`,
        tags: ['percentuali'],
        passi: 2,
      });
    },
  },
];
