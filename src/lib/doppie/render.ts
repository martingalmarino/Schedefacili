import type { Esercizio, SchedaDoppie, VoceCompleta, VoceCoppie, VoceIntruso, VoceScegli, VoceSillabe } from './types';
import { CLASSE_NOME } from './types';

function esc(testo: string): string {
  return testo.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buco(soluzioni: boolean, testo: string): string {
  return soluzioni ? `<span class="buco compilato">${esc(testo)}</span>` : '<span class="buco"></span>';
}

function rigo(soluzioni: boolean, testo: string): string {
  return soluzioni ? `<span class="rigo compilato">${esc(testo)}</span>` : '<span class="rigo"></span>';
}

function pillola(testo: string, attiva: boolean): string {
  return `<span class="pillola${attiva ? ' ovale' : ''}">${esc(testo)}</span>`;
}

function voceCompleta(voce: VoceCompleta, soluzioni: boolean): string {
  return `<span class="voce-completa"><span>${esc(voce.prima)}</span>${buco(soluzioni, voce.soluzione)}<span>${esc(voce.dopo)}</span> <span class="opzioni">(${esc(voce.semplice)} · ${esc(voce.doppia)})</span></span>`;
}

function voceScegli(voce: VoceScegli, soluzioni: boolean): string {
  return `<span class="coppia-scegli">${pillola(voce.sinistra, soluzioni && voce.corretta === 'sinistra')}${pillola(voce.destra, soluzioni && voce.corretta === 'destra')}</span>`;
}

function parolaOvale(testo: string, attiva: boolean): string {
  return attiva ? `<span class="ovale">${esc(testo)}</span>` : esc(testo);
}

function dopoFrase(dopo: string): string {
  if (!dopo) return '';
  return /^[.,;:!?)]/u.test(dopo) ? dopo : ` ${dopo}`;
}

function voceCoppie(voce: VoceCoppie, soluzioni: boolean): string {
  const semplice = parolaOvale(voce.semplice, soluzioni && voce.soluzione === voce.semplice);
  const doppia = parolaOvale(voce.doppia, soluzioni && voce.soluzione === voce.doppia);
  const prima = voce.prima ? `${esc(voce.prima)} ` : '';
  return `<span class="voce-coppia">${prima}${rigo(soluzioni, voce.soluzione)}${esc(dopoFrase(voce.dopo))} <span class="opzioni">(${semplice} · ${doppia})</span></span>`;
}

function voceSillabe(voce: VoceSillabe, soluzioni: boolean): string {
  return `<span class="voce-sillaba"><span>${esc(voce.parola)}</span> ${soluzioni ? `<span class="soluzione">${esc(voce.soluzione)}</span>` : '<span class="rigo"></span>'}</span>`;
}

function voceIntruso(voce: VoceIntruso, soluzioni: boolean): string {
  const parole = voce.parole.map((parola, indice) => `<span class="parola-intruso${soluzioni && indice === voce.indice ? ' ovale' : ''}">${esc(parola)}</span>`);
  return `<span class="riga-intruso">${parole.join('')}</span>`;
}

function corpo(esercizio: Esercizio, soluzioni: boolean): string {
  if (esercizio.tipo === 'completa') return esercizio.voci.map((voce) => voceCompleta(voce, soluzioni)).join('');
  if (esercizio.tipo === 'scegli') return esercizio.voci.map((voce) => voceScegli(voce, soluzioni)).join('');
  if (esercizio.tipo === 'coppie') return esercizio.voci.map((voce) => voceCoppie(voce, soluzioni)).join('');
  if (esercizio.tipo === 'sillabe') return esercizio.voci.map((voce) => voceSillabe(voce, soluzioni)).join('');
  return esercizio.voci.map((voce) => voceIntruso(voce, soluzioni)).join('');
}

function carta(esercizio: Esercizio, indice: number, soluzioni: boolean): string {
  const classe = esercizio.tipo === 'sillabe' ? ' griglia-sillabe' : esercizio.tipo === 'intruso' ? ' griglia-intruso' : '';
  return `<li class="esercizio-doppie"><p class="consegna-esercizio"><span class="n numero">${indice}</span> ${esc(esercizio.consegna)}</p><div class="voci-doppie${classe}">${corpo(esercizio, soluzioni)}</div></li>`;
}

export function htmlScheda(scheda: SchedaDoppie, soluzioni = false): string {
  const nome = CLASSE_NOME[scheda.classe];
  const esercizi = soluzioni ? scheda.soluzioni : scheda.esercizi;
  const quanti = String(esercizi.length);
  const testata = soluzioni
    ? `<header class="testata-doppie"><p>Classe ${nome}</p><p>Scheda <span class="n">${scheda.seed}</span></p></header><h2 class="titolo-doppie font-display">Soluzioni</h2><p class="consegna-doppie">Le doppie</p>`
    : `<header class="testata-doppie"><p>Nome <span class="tratto"></span></p><p>Data <span class="tratto"></span></p></header><h2 class="titolo-doppie font-display">Le doppie · Classe ${nome}</h2><p class="consegna-doppie">Leggi ad alta voce: la doppia si sente più forte.</p>`;
  const voci = esercizi.map((esercizio, indice) => carta(esercizio, indice + 1, soluzioni)).join('');
  return `<article class="foglio-doppie${soluzioni ? ' soluzioni-foglio' : ''}" data-esercizi="${quanti}" data-classe="${scheda.classe}">${testata}<ol class="elenco-doppie">${voci}</ol><p class="pie-doppie">Scheda <span class="n">${scheda.seed}</span> · schedefacili.com</p></article>`;
}

export function etichettaEsercizio(tipo: Esercizio['tipo']): string {
  if (tipo === 'completa') return 'Completa la parola';
  if (tipo === 'scegli') return 'Semplice o doppia';
  if (tipo === 'coppie') return 'Coppie di parole';
  if (tipo === 'sillabe') return 'Sillabe';
  return 'Intruso';
}
