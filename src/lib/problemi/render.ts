import { formattaNumero, marcaNumeri } from './formato';
import type { Dato, Istanza, OpzioniScheda } from './types';
import { CLASSE_IN_LETTERE } from './types';

const ALTEZZE: Record<number, number> = { 4: 32, 5: 27, 6: 23, 7: 18, 8: 15 };

export function altezzaRiquadro(n: number, soluzioni = false): number {
  const base = ALTEZZE[n] ?? 23;
  return soluzioni ? Math.max(8, Math.round(base * 0.5)) : base;
}

function valoreDato(dato: Dato): string {
  return typeof dato.valore === 'number' ? formattaNumero(dato.valore) : dato.valore;
}

function riquadro(etichetta: string, corpo: string, alto: number): string {
  return `<div class="riquadro" style="min-height:${alto}mm"><span class="etichetta">${etichetta}</span>${corpo ? `<div class="corpo-riquadro">${corpo}</div>` : ''}</div>`;
}

function etichette(opzioni: OpzioniScheda): [string, string, string] {
  if (opzioni.classe === 1 && opzioni.spazi === 'dati') return ['Disegna', 'Operazione', 'Risposta'];
  return ['Dati', 'Operazione', 'Risposta'];
}

function problema(istanza: Istanza, indice: number, opzioni: OpzioniScheda, soluzioni: boolean, alto: number): string {
  const [dati, operazione, risposta] = etichette(opzioni);
  const disegno = istanza.aiutoVisivo?.trim().startsWith('<svg') ? istanza.aiutoVisivo : '';
  const testoDati = istanza.dati.map((dato) => marcaNumeri(`${dato.etichetta}: ${valoreDato(dato)}`)).join(' / ');
  const testoOperazione = istanza.operazioni.map((riga) => marcaNumeri(riga.trim())).join('<br>');
  const solo = opzioni.spazi === 'risposta';
  const corpoDati = soluzioni ? testoDati : disegno;
  const caselle = solo
    ? riquadro('Risposta', soluzioni ? marcaNumeri(istanza.risposta) : '', alto)
    : [
        riquadro(dati, corpoDati, alto),
        riquadro(operazione, soluzioni ? testoOperazione : '', alto),
        riquadro(risposta, soluzioni ? marcaNumeri(istanza.risposta) : '', alto),
      ].join('');
  return `<li class="problema"><p class="testo-problema"><span class="n numero">${indice}</span> ${marcaNumeri(istanza.testo)}</p><div class="griglia-problema${solo ? ' solo-risposta' : ''}">${caselle}</div></li>`;
}

export function htmlScheda(problemi: readonly Istanza[], opzioni: OpzioniScheda, soluzioni = false): string {
  const alto = altezzaRiquadro(opzioni.n, soluzioni);
  const classe = CLASSE_IN_LETTERE[opzioni.classe];
  const titolo = soluzioni ? 'Soluzioni' : `Problemi di matematica · Classe ${classe}`;
  const consegna = soluzioni
    ? 'Operazioni svolte e risposte.'
    : 'Leggi con attenzione. Scrivi i dati, l’operazione e la risposta.';
  const voci = problemi.map((istanza, indice) => problema(istanza, indice + 1, opzioni, soluzioni, alto)).join('');
  return `<article class="foglio-problemi${soluzioni ? ' soluzioni-foglio' : ''}" style="--alto:${alto}mm"><header class="testata-problemi"><p>Nome <span class="tratto"></span></p><p>Data <span class="tratto"></span></p></header><h2 class="titolo-problemi">${titolo}</h2><p class="consegna-problemi">${consegna}</p><ol class="elenco-problemi">${voci}</ol><p class="pie-problemi">Scheda <span class="n">${opzioni.seed}</span> · schedefacili.com</p></article>`;
}
