import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WHITELIST_DOPPIE } from './doppie-whitelist';
import { COMPLETE, COPPIE, DETTATI, NOMI_DOPPIE, PAROLE, SCEGLI } from '../src/data/doppie/parole';
import { NAV } from '../src/data/nav';
import { fontiPagina } from '../src/lib/lastmod';
import { CARD_SCHEDE_UTILI } from '../src/lib/schede-utili';
import {
  collegamentiDoppie,
  FAQ_HUB_DOPPIE,
  HUB_DOPPIE,
  PAGINE_DOPPIE,
  SEO_HUB_DOPPIE,
  livelloDoppie,
} from '../src/lib/testi-doppie';
import { generaScheda, opzioniBase, opzioniDaQuery, queryDoppie } from '../src/lib/doppie/genera';
import { htmlScheda } from '../src/lib/doppie/render';
import type { ClasseDoppie, Esercizio, SchedaDoppie } from '../src/lib/doppie/types';
import { ESERCIZI_CLASSE, TIPI_ESERCIZIO, type TipoEsercizio } from '../src/lib/doppie/types';

const require = createRequire(import.meta.url);
const DIZIONARIO = new Set((require('an-array-of-italian-words') as string[]).map((parola) => parola.toLocaleLowerCase('it')));
const AMMESSE = new Set(WHITELIST_DOPPIE.map((voce) => voce.parola));

const REALI = new Set<string>([
  ...PAROLE.map((voce) => voce.parola),
  ...SCEGLI.map((voce) => voce.corretta),
  ...COPPIE.flatMap((voce) => [voce.semplice, voce.doppia]),
]);

const DOPPIE_PRIMA = new Set(['ll', 'tt', 'ss', 'mm', 'nn', 'pp']);

function schedaDi(classe: ClasseDoppie, seed: number, esercizi = ESERCIZI_CLASSE[classe]): SchedaDoppie {
  const base = opzioniBase(classe, seed);
  return generaScheda(classe, { ...base, esercizi: [...esercizi] }, seed);
}

function lemmi(esercizi: readonly Esercizio[]): string[] {
  return esercizi.flatMap((esercizio) => {
    if (esercizio.tipo === 'completa') return esercizio.voci.map((voce) => `${voce.prima}${voce.soluzione}${voce.dopo}`);
    if (esercizio.tipo === 'scegli') return esercizio.voci.flatMap((voce) => [voce.sinistra, voce.destra]);
    if (esercizio.tipo === 'coppie') {
      return esercizio.voci.flatMap((voce) => {
        const frase = `${voce.prima} ${voce.soluzione} ${voce.dopo}`;
        const extra = frase
          .split(/[^\p{L}]+/u)
          .map((token) => token.toLocaleLowerCase('it'))
          .filter((token) => REALI.has(token) && token !== voce.semplice && token !== voce.doppia);
        return [voce.semplice, voce.doppia, ...extra];
      });
    }
    if (esercizio.tipo === 'sillabe') return esercizio.voci.map((voce) => voce.parola);
    return esercizio.voci.flatMap((voce) => voce.parole);
  });
}

function testoScheda(scheda: SchedaDoppie): string {
  return scheda.esercizi
    .map((esercizio) => {
      if (esercizio.tipo === 'coppie') return esercizio.voci.map((voce) => `${voce.prima} ${voce.soluzione} ${voce.dopo}`).join(' ');
      return esercizio.consegna;
    })
    .join(' ');
}

describe('pagine delle doppie', () => {
  const pagine = [SEO_HUB_DOPPIE, ...PAGINE_DOPPIE];

  it('tiene title, meta e H1 dentro i limiti, con l’apostrofo tipografico', () => {
    for (const pagina of pagine) {
      expect(pagina.title.length, pagina.title).toBeLessThanOrEqual(60);
      expect(pagina.description.length, pagina.description).toBeLessThanOrEqual(155);
      expect(pagina.h1.length, pagina.h1).toBeGreaterThan(0);
      const visibile = `${pagina.title} ${pagina.description} ${pagina.h1} ${pagina.inBreve}`;
      expect(visibile).not.toMatch(/\p{L}'\p{L}/u);
    }
    for (const voce of [...FAQ_HUB_DOPPIE, ...PAGINE_DOPPIE.flatMap((pagina) => pagina.domande)]) {
      expect(`${voce.domanda} ${voce.risposta}`).not.toMatch(/\p{L}'\p{L}/u);
    }
    expect(SEO_HUB_DOPPIE.h1).toBe('Le doppie: schede da stampare');
    expect(PAGINE_DOPPIE.map((pagina) => pagina.h1)).toEqual([
      'Schede sulle doppie per la classe prima',
      'Schede sulle doppie per la classe seconda',
      'Esercizi sulle doppie per la classe terza',
      'Schede sulle doppie per la classe quarta',
    ]);
  });

  it('collega il hub, le classi vicine, i crucipuzzle e i generatori', () => {
    expect(collegamentiDoppie().map((voce) => voce.href)).toEqual(PAGINE_DOPPIE.map((pagina) => pagina.href));
    for (const pagina of PAGINE_DOPPIE) {
      const href = collegamentiDoppie(pagina.classe).map((voce) => voce.href);
      expect(href).toContain(HUB_DOPPIE);
      expect(href).toContain('/generatori/crucipuzzle/');
      expect(href).toContain('/generatori/');
      if (pagina.classe > 1) expect(href).toContain(PAGINE_DOPPIE[pagina.classe - 2]!.href);
      if (pagina.classe < 4) expect(href).toContain(PAGINE_DOPPIE[pagina.classe]!.href);
    }
    expect(livelloDoppie(2)).toBe('Scuola primaria – classe seconda');
    expect(livelloDoppie()).toHaveLength(4);
    expect(fontiPagina('/doppie/')).toContain('src/data/doppie/parole.ts');
    expect(fontiPagina('/doppie/classe-seconda/')).toContain('src/pages/doppie/[classe].astro');
    const schede = NAV.find((voce) => voce.label === 'Schede utili');
    expect(schede?.figli?.some((voce) => voce.href === HUB_DOPPIE && voce.label === 'Le doppie')).toBe(true);
    const card = CARD_SCHEDE_UTILI.find((voce) => voce.href === HUB_DOPPIE);
    const doppie = PAROLE.filter((voce) => voce.doppia !== null).length;
    expect(card?.conteggio).toBe(doppie);
    expect(card && 'unita' in card ? card.unita : '').toBe('parole con le doppie');
    expect(String(card?.conteggio)).not.toBe('0');
  });
});

describe('motore delle doppie', () => {
  it('contiene le liste e le sillabe degli esempi', () => {
    expect(PAROLE.filter((voce) => voce.doppia).length).toBeGreaterThanOrEqual(220);
    expect(PAROLE.filter((voce) => !voce.doppia).length).toBeGreaterThanOrEqual(80);
    expect(COPPIE.length).toBeGreaterThanOrEqual(40);
    expect(SCEGLI.length).toBeGreaterThanOrEqual(60);
    expect(DETTATI.every((voce) => voce.frasi.length === 3)).toBe(true);
    const sillabe = new Map(PAROLE.map((voce) => [voce.parola, voce.sillabe.join('-')]));
    expect(sillabe.get('gatto')).toBe('gat-to');
    expect(sillabe.get('tetto')).toBe('tet-to');
    expect(sillabe.get('mucca')).toBe('muc-ca');
    expect(sillabe.get('stella')).toBe('stel-la');
    expect(sillabe.get('pizza')).toBe('piz-za');
    expect(sillabe.get('gonna')).toBe('gon-na');
    expect(sillabe.get('cavallo')).toBe('ca-val-lo');
    expect(sillabe.get('farfalla')).toBe('far-fal-la');
    expect(sillabe.get('bottiglia')).toBe('bot-ti-glia');
    expect(sillabe.get('fratello')).toBe('fra-tel-lo');
    expect(sillabe.get('cartella')).toBe('car-tel-la');
    expect(sillabe.get('cucchiaio')).toBe('cuc-chia-io');
    expect(sillabe.get('gallina')).toBe('gal-li-na');
    expect(sillabe.get('mattone')).toBe('mat-to-ne');
    expect(sillabe.get('carrozza')).toBe('car-roz-za');
    expect(sillabe.get('spazzola')).toBe('spaz-zo-la');
    expect(sillabe.get('tazza')).toBe('taz-za');
    expect(sillabe.get('sasso')).toBe('sas-so');
    expect(sillabe.get('zucca')).toBe('zuc-ca');
    expect(sillabe.get('occhio')).toBe('oc-chio');
    expect(sillabe.get('palloncino')).toBe('pal-lon-ci-no');
    expect(sillabe.get('mamma')).toBe('mam-ma');
    expect(sillabe.get('pollo')).toBe('pol-lo');
    expect(sillabe.get('bocca')).toBe('boc-ca');
    expect(sillabe.get('latte')).toBe('lat-te');
    expect(sillabe.get('palla')).toBe('pal-la');
    expect(sillabe.get('approfittare')).toBe('ap-pro-fit-ta-re');
    expect(sillabe.get('accorgersi')).toBe('ac-cor-ger-si');
    expect(sillabe.get('attenzione')).toBe('at-ten-zio-ne');
    for (const voce of PAROLE) {
      expect(voce.sillabe.join(''), voce.parola).toBe(voce.parola);
      for (const pezzo of voce.sillabe) expect(pezzo, voce.parola).not.toMatch(/([bcdfghjklmnpqrstvwxyz])\1/i);
    }
  });

  it('riusa un catalogo senza doppie risposte e senza errori che siano parole vere', () => {
    expect(NOMI_DOPPIE.length).toBeGreaterThanOrEqual(20);
    expect(new Set(NOMI_DOPPIE).size).toBe(NOMI_DOPPIE.length);
    for (const voce of COMPLETE) {
      expect(`${voce.prima}${voce.doppia}${voce.dopo}`).toBe(voce.parola);
      expect(REALI.has(`${voce.prima}${voce.semplice}${voce.dopo}`)).toBe(false);
    }
    for (const voce of SCEGLI) {
      expect(REALI.has(voce.corretta)).toBe(true);
      expect(REALI.has(voce.errata)).toBe(false);
    }
  });

  it('è deterministico e tiene le soluzioni indipendenti dalla scheda', () => {
    const prima = schedaDi(2, 2406);
    const seconda = schedaDi(2, 2406);
    expect(seconda).toEqual(prima);
    expect(prima.soluzioni).toEqual(prima.esercizi);
    expect(prima.soluzioni).not.toBe(prima.esercizi);
    const primaVoce = prima.esercizi[0]?.voci.length ?? 0;
    prima.esercizi[0]?.voci.pop();
    expect(prima.soluzioni[0]?.voci.length).toBe(primaVoce);
  });

  it('non ripete parole né nomi e bilancia scegli e coppie', () => {
    for (const classe of [1, 2, 3, 4] as const) {
      for (let seed = 2400; seed < 2440; seed += 1) {
        const scheda = schedaDi(classe, seed);
        const parole = lemmi(scheda.esercizi);
        expect(new Set(parole).size, `${classe} ${seed}`).toBe(parole.length);
        const html = htmlScheda(scheda, false);
        for (const nome of NOMI_DOPPIE) {
          const trovati = html.match(new RegExp(`\\b${nome}\\b`, 'gu')) ?? [];
          expect(trovati.length, `${nome} ${classe} ${seed}`).toBeLessThanOrEqual(1);
        }
        expect(testoScheda(scheda)).not.toMatch(/\bne\s+\p{L}+(?:\s+\p{L}+){0,4}\s+\d+\s+\p{L}+/iu);
        const scegli = scheda.esercizi.find((esercizio) => esercizio.tipo === 'scegli');
        if (scegli && scegli.tipo === 'scegli') {
          const sinistra = scegli.voci.filter((voce) => voce.corretta === 'sinistra').length;
          expect(sinistra).toBe(Math.floor(scegli.voci.length / 2));
        }
        const coppie = scheda.esercizi.find((esercizio) => esercizio.tipo === 'coppie');
        if (coppie && coppie.tipo === 'coppie' && coppie.voci.length === (classe === 4 ? 5 : 6)) {
          const semplici = coppie.voci.filter((voce) => voce.soluzione === voce.semplice).length;
          expect(semplici).toBe(Math.floor(coppie.voci.length / 2));
          for (const voce of coppie.voci) expect(html).toContain(`(${voce.semplice} · ${voce.doppia})`);
        }
        const intruso = scheda.esercizi.find((esercizio) => esercizio.tipo === 'intruso');
        if (intruso && intruso.tipo === 'intruso') {
          const indici = intruso.voci.map((voce) => voce.indice);
          expect(new Set(indici).size).toBe(indici.length);
          for (const voce of intruso.voci) {
            const senza = voce.parole.filter((parola) => PAROLE.find((candidato) => candidato.parola === parola)?.doppia === null);
            expect(senza).toEqual([voce.parole[voce.indice]]);
            expect(voce.parole).toHaveLength(4);
          }
        }
      }
    }
  });

  it('adatta la prima alle doppie chiare e lascia le altre classi con cinque esercizi', () => {
    const prima = schedaDi(1, 1106);
    expect(prima.esercizi.map((esercizio) => esercizio.tipo)).toEqual(['completa', 'coppie', 'sillabe', 'intruso']);
    for (const parola of lemmi(prima.esercizi)) {
      const voce = PAROLE.find((candidato) => candidato.parola === parola);
      if (!voce?.doppia) continue;
      expect(DOPPIE_PRIMA.has(voce.doppia)).toBe(true);
      expect(voce.sillabe.length).toBeLessThanOrEqual(3);
      expect(voce.altra).toBeUndefined();
    }
    const seconda = schedaDi(2, 2406);
    expect(seconda.esercizi.map((esercizio) => esercizio.tipo)).toEqual(['completa', 'scegli', 'coppie', 'sillabe', 'intruso']);
    expect(seconda.esercizi.map((esercizio) => esercizio.voci.length)).toEqual([6, 6, 6, 4, 3]);
    const dsa = generaScheda(2, { ...opzioniBase(2, 2406), dsa: true }, 2406);
    expect(dsa.esercizi.length).toBeLessThanOrEqual(4);
    for (const esercizio of dsa.esercizi) expect(esercizio.voci.length).toBeLessThanOrEqual(4);
    const sillabeDsa = dsa.esercizi.find((esercizio) => esercizio.tipo === 'sillabe');
    expect(sillabeDsa?.tipo === 'sillabe' ? sillabeDsa.voci[0]?.soluzione : '').toMatch(/ - /);
    expect(htmlScheda(dsa, true)).toContain(' - ');
    expect(htmlScheda(seconda, true)).not.toContain(' - ');
  });

  it('mostra il buco vuoto sulla scheda e la risposta in terracotta sulla soluzione', () => {
    const scheda = schedaDi(2, 2406);
    const vuota = htmlScheda(scheda, false);
    const piena = htmlScheda(scheda, true);
    const buchi = vuota.match(/<span class="buco"><\/span>/g) ?? [];
    expect(buchi.length).toBeGreaterThan(0);
    expect(vuota).not.toContain('compilato');
    expect(vuota).not.toContain('ovale');
    expect(vuota).not.toContain('<svg');
    expect(vuota).not.toContain('<img');
    expect(piena).toContain('class="buco compilato"');
    expect(piena).toContain('ovale');
    const sillabe = scheda.esercizi.find((esercizio) => esercizio.tipo === 'sillabe');
    const soluzione = sillabe?.tipo === 'sillabe' ? sillabe.voci[0]?.soluzione : '';
    expect(soluzione).toMatch(/-/);
    expect(vuota).not.toContain(soluzione ?? '');
    expect(piena).toContain(`<span class="soluzione">${soluzione}</span>`);
    expect(vuota).toContain('Nome <span class="tratto"></span>');
    expect(vuota).toContain('Data <span class="tratto"></span>');
    expect(vuota).toContain('Le doppie · Classe seconda');
    expect(vuota).toContain('Leggi ad alta voce: la doppia si sente più forte.');
    expect(vuota).toContain('Completa la parola con una o due consonanti.');
    expect(vuota).toContain('Cerchia la parola scritta bene.');
    expect(vuota).toContain('Scegli la parola giusta e scrivila nella frase.');
    expect(vuota).toContain('Dividi in sillabe.');
    expect(vuota).toContain('Cerchia l’intruso: la parola senza doppia.');
    expect(vuota).toContain('Scheda <span class="n">2406</span> · schedefacili.com');
    expect(piena).toContain('Classe seconda');
    expect(piena).toContain('>Soluzioni</h2>');
    expect(`${vuota} ${piena}`).not.toMatch(/\{|\}|undefined|NaN| {2}/);
    const css = readFileSync(join(process.cwd(), 'src/styles/global.css'), 'utf8');
    expect(css).toMatch(/\.buco\s*\{[^}]*width:\s*12mm;[^}]*min-width:\s*12mm;[^}]*max-width:\s*12mm;/s);
  });

  it('tiene il seme e gli esercizi nella query senza cambiare il canonical', () => {
    const base = opzioniBase(2, 2406);
    expect(queryDoppie(base, base)).toBe('');
    expect(queryDoppie({ ...base, seed: 2407 }, base)).toBe('?s=2407');
    expect(queryDoppie({ ...base, esercizi: ['completa', 'intruso'] }, base)).toBe('?es=completa%2Cintruso');
    expect(opzioniDaQuery(new URLSearchParams('s=12'), base).seed).toBe(2406);
    expect(opzioniDaQuery(new URLSearchParams('s=2407&es=intruso,completa'), base)).toEqual({
      classe: 2,
      seed: 2407,
      esercizi: ['completa', 'intruso'],
    });
    expect(opzioniDaQuery(new URLSearchParams('dsa=1'), base).dsa).toBe(true);
    expect(queryDoppie({ ...base, dsa: true }, base)).toBe('?dsa=1');
    const seo = readFileSync(join(process.cwd(), 'src/lib/seo.ts'), 'utf8');
    expect(seo).toContain('canonicalUrl.search = \'\'');
  });
});

const CONSONANTI = /[bcdfghjklmnpqrstvwxyz]/i;

function nelDizionario(parola: string): boolean {
  const chiave = parola.toLocaleLowerCase('it');
  return DIZIONARIO.has(chiave) || AMMESSE.has(chiave);
}

function coppiaMinima(semplice: string, doppia: string): boolean {
  if (doppia.length !== semplice.length + 1) return false;
  let indice = 0;
  while (indice < semplice.length && semplice[indice] === doppia[indice]) indice += 1;
  if (indice === 0 || doppia[indice] !== doppia[indice - 1] || !CONSONANTI.test(doppia[indice] ?? '')) return false;
  return doppia.slice(indice + 1) === semplice.slice(indice);
}

function contieneParola(frase: string, parola: string): boolean {
  return new RegExp(`\\b${parola}\\b`, 'u').test(frase);
}

function combinazioni(tipi: readonly TipoEsercizio[]): TipoEsercizio[][] {
  const elenco: TipoEsercizio[][] = [];
  for (let maschera = 1; maschera < 2 ** tipi.length; maschera += 1) {
    elenco.push(tipi.filter((_, indice) => (maschera & (2 ** indice)) !== 0));
  }
  return elenco;
}

function confiniSillabe(parola: string, sillabe: readonly string[]): number[] {
  let cursore = 0;
  return sillabe.map((pezzo) => {
    cursore += pezzo.length;
    return cursore;
  });
}

describe('dizionario e coppie', () => {
  it('accetta solo parole del dizionario e tiene fuori errata e alternative', () => {
    expect(WHITELIST_DOPPIE.length).toBeLessThanOrEqual(15);
    for (const voce of WHITELIST_DOPPIE) {
      expect(voce.motivo.length, voce.parola).toBeGreaterThan(0);
      expect(DIZIONARIO.has(voce.parola), voce.parola).toBe(false);
    }
    const valide = [
      ...PAROLE.map((voce) => voce.parola),
      ...COPPIE.flatMap((voce) => [voce.semplice, voce.doppia]),
      ...COMPLETE.map((voce) => voce.parola),
      ...SCEGLI.map((voce) => voce.corretta),
    ];
    const assenti = [...new Set(valide.filter((parola) => !nelDizionario(parola)))];
    expect(assenti, assenti.join(', ')).toEqual([]);
    for (const voce of SCEGLI) expect(DIZIONARIO.has(voce.errata), voce.errata).toBe(false);
    for (const voce of COMPLETE) {
      const alternativa = `${voce.prima}${voce.semplice}${voce.dopo}`;
      expect(DIZIONARIO.has(alternativa), alternativa).toBe(false);
      expect(nelDizionario(voce.parola), voce.parola).toBe(true);
    }
  });

  it('divide ogni doppia e non spezza i digrammi', () => {
    for (const voce of PAROLE) {
      expect(voce.sillabe.join(''), voce.parola).toBe(voce.parola);
      const tagli = confiniSillabe(voce.parola, voce.sillabe);
      for (let indice = 0; indice < voce.parola.length - 1; indice += 1) {
        const lettera = voce.parola[indice] ?? '';
        if (lettera === voce.parola[indice + 1] && CONSONANTI.test(lettera)) {
          expect(tagli, `${voce.parola} ${lettera}`).toContain(indice + 1);
        }
      }
      const segnata = voce.sillabe.join('|');
      expect(segnata, voce.parola).not.toMatch(/g\|l|g\|n|s\|c|c\|h|g\|h/);
    }
    const sillabe = new Map(PAROLE.map((voce) => [voce.parola, voce.sillabe.join('-')]));
    expect(sillabe.get('cucchiaio')).toBe('cuc-chia-io');
    expect(sillabe.get('bottiglia')).toBe('bot-ti-glia');
    expect(sillabe.get('palla')).toBe('pal-la');
    expect(sillabe.get('gatto')).toBe('gat-to');
    expect(sillabe.get('carrozza')).toBe('car-roz-za');
  });

  it('tiene coppie minime e, sulla scheda, metà risposte semplici', () => {
    for (const voce of COPPIE) {
      expect(coppiaMinima(voce.semplice, voce.doppia), `${voce.semplice}/${voce.doppia}`).toBe(true);
      expect(contieneParola(voce.fraseSemplice, voce.semplice), voce.fraseSemplice).toBe(true);
      expect(contieneParola(voce.fraseSemplice, voce.doppia), voce.fraseSemplice).toBe(false);
      expect(contieneParola(voce.fraseDoppia, voce.doppia), voce.fraseDoppia).toBe(true);
      expect(contieneParola(voce.fraseDoppia, voce.semplice), voce.fraseDoppia).toBe(false);
    }
    for (const classe of [1, 2, 3, 4] as const) {
      let semplici = 0;
      let fogli = 0;
      for (let seed = 3000; seed < 3020; seed += 1) {
        const coppie = schedaDi(classe, seed).esercizi.find((esercizio) => esercizio.tipo === 'coppie');
        if (!coppie || coppie.tipo !== 'coppie' || coppie.voci.length === 0) continue;
        fogli += 1;
        const meta = coppie.voci.filter((voce) => voce.soluzione === voce.semplice).length;
        expect(meta, `${classe} ${seed}`).toBe(Math.floor(coppie.voci.length / 2));
        if (meta > 0) semplici += 1;
      }
      expect(semplici, String(classe)).toBeGreaterThan(0);
      expect(fogli, String(classe)).toBeGreaterThan(0);
    }
  });
});

describe('fuzz delle schede', () => {
  const classiMin = new Map<string, number>();
  for (const voce of PAROLE) classiMin.set(voce.parola, voce.classeMin);
  for (const voce of COPPIE) {
    for (const parola of [voce.semplice, voce.doppia]) {
      classiMin.set(parola, Math.min(classiMin.get(parola) ?? voce.classeMin, voce.classeMin));
    }
  }

  it('regge mille semi per classe su tutte le combinazioni di esercizi', () => {
    const posizioni = new Set<number>();
    for (const classe of [1, 2, 3, 4] as const) {
      const combo = combinazioni(TIPI_ESERCIZIO);
      for (let indice = 0; indice < 1000; indice += 1) {
        const seed = 5000 + indice;
        for (const esercizi of combo) {
        const scheda = schedaDi(classe, seed, esercizi);
        const etichetta = `${classe} ${seed} ${esercizi.join(',')}`;
        const parole = lemmi(scheda.esercizi);
        expect(new Set(parole).size, etichetta).toBe(parole.length);
        const html = htmlScheda(scheda, false);
        const nodi = [...html.matchAll(/>([^<]+)</g)].map((trovato) => trovato[1] ?? '');
        for (const nodo of nodi) {
          expect(nodo, etichetta).not.toMatch(/\{|\}|undefined|NaN| {2}/);
        }
        for (const nome of NOMI_DOPPIE) {
          const trovati = html.match(new RegExp(`\\b${nome}\\b`, 'gu')) ?? [];
          expect(trovati.length, `${nome} ${etichetta}`).toBeLessThanOrEqual(1);
        }
        expect(testoScheda(scheda), etichetta).not.toMatch(/\bne\s+\p{L}+(?:\s+\p{L}+){0,4}\s+\d+\s+\p{L}+/iu);
        for (const esercizio of scheda.esercizi) {
          const bersagli =
            esercizio.tipo === 'completa'
              ? esercizio.voci.map((voce) => `${voce.prima}${voce.soluzione}${voce.dopo}`)
              : esercizio.tipo === 'scegli'
                ? esercizio.voci.map((voce) => (voce.corretta === 'sinistra' ? voce.sinistra : voce.destra))
                : esercizio.tipo === 'coppie'
                  ? esercizio.voci.flatMap((voce) => [voce.semplice, voce.doppia])
                  : esercizio.tipo === 'sillabe'
                    ? esercizio.voci.map((voce) => voce.parola)
                    : esercizio.voci.flatMap((voce) => voce.parole);
          for (const parola of bersagli) {
            const livello = classiMin.get(parola);
            if (livello !== undefined) expect(livello, `${parola} ${etichetta}`).toBeLessThanOrEqual(classe);
          }
        }
        const intruso = scheda.esercizi.find((esercizio) => esercizio.tipo === 'intruso');
        if (intruso && intruso.tipo === 'intruso') {
          for (const voce of intruso.voci) {
            const senza = voce.parole.filter((parola) => PAROLE.find((candidato) => candidato.parola === parola)?.doppia === null);
            expect(senza, etichetta).toEqual([voce.parole[voce.indice]]);
            posizioni.add(voce.indice);
          }
          if (intruso.voci.length > 1) expect(new Set(intruso.voci.map((voce) => voce.indice)).size, etichetta).toBeGreaterThan(1);
        }
        if (scheda.esercizi.some((esercizio) => esercizio.tipo === 'completa')) {
          const buchi = html.match(/<span class="buco"><\/span>/g) ?? [];
          const attesi = scheda.esercizi.find((esercizio) => esercizio.tipo === 'completa');
          expect(buchi.length, etichetta).toBe(attesi?.voci.length ?? 0);
        }
        }
      }
    }
    expect(posizioni.size).toBeGreaterThan(1);
  }, 120000);
});

describe('SEO delle cinque URL', () => {
  const dist = join(process.cwd(), 'dist', 'client');
  const percorsi = [HUB_DOPPIE, ...PAGINE_DOPPIE.map((pagina) => pagina.href)];
  const onDemand = new Set(['/orologio-da-stampare/', '/generatori/schede-orologio/']);
  const vietate = ['TODO', 'segnaposto', 'lorem', 'undefined', 'NaN', 'il 8', 'il 11'];

  function piano(testo: string): string {
    return testo.replace(/\s+/g, ' ').trim();
  }

  function visibile(html: string): string {
    return piano(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/g, ' ')
        .replace(/&#39;|&#x27;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&'),
    );
  }

  it('rispetta title, FAQ, schema, lastmod e i link interni', () => {
    for (const percorso of percorsi) {
      const file = join(dist, percorso, 'index.html');
      expect(existsSync(file), percorso).toBe(true);
      const html = readFileSync(file, 'utf8');
      const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(description.length, description).toBeLessThanOrEqual(155);
      expect(html.match(/<h1\b/g) ?? [], percorso).toHaveLength(1);
      expect(canonical, percorso).toBe(`https://www.schedefacili.com${percorso}`);
      expect(canonical.includes('?'), canonical).toBe(false);
      expect(html).toContain('In breve.');
      expect(html.includes('"@type":"Event"') || html.includes('"@type": "Event"')).toBe(false);
      const blocchi = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
        (blocco) => JSON.parse(blocco[1] ?? '{}') as { '@type'?: string; dateModified?: string; educationalLevel?: unknown; teaches?: string; applicationCategory?: string; offers?: { price?: string }; mainEntity?: { name: string; acceptedAnswer: { text: string } }[] },
      );
      const risorsa = blocchi.find((dato) => dato['@type'] === 'LearningResource');
      const app = blocchi.find((dato) => dato['@type'] === 'WebApplication');
      const faq = blocchi.find((dato) => dato['@type'] === 'FAQPage');
      const pagina = blocchi.find((dato) => dato['@type'] === 'WebPage');
      expect(risorsa?.educationalLevel, percorso).toBeTruthy();
      expect(risorsa?.teaches, percorso).toBe('Le consonanti doppie');
      expect(app?.applicationCategory, percorso).toBe('EducationalApplication');
      expect(app?.offers?.price, percorso).toBe('0');
      const quando = Date.parse(pagina?.dateModified ?? '');
      expect(Number.isNaN(quando), percorso).toBe(false);
      expect(Date.now() - quando, percorso).toBeGreaterThan(60_000);
      const classe = PAGINE_DOPPIE.find((pagina) => pagina.href === percorso);
      const seme = classe?.seed ?? 2406;
      const livello = classe?.classe ?? 2;
      const attesa = htmlScheda(generaScheda(livello, opzioniBase(livello, seme), seme), false);
      const soluzioni = htmlScheda(generaScheda(livello, opzioniBase(livello, seme), seme), true);
      expect(html, percorso).toContain(attesa);
      expect(html, percorso).toContain(soluzioni);
      const testo = visibile(html);
      expect(testo, percorso).not.toMatch(/l'\s/);
      for (const parola of vietate) expect(testo.includes(parola), `${percorso} ${parola}`).toBe(false);
      expect(faq?.mainEntity?.length, percorso).toBeGreaterThan(0);
      for (const voce of faq?.mainEntity ?? []) {
        expect(testo, voce.name).toContain(piano(voce.name));
        expect(testo, voce.acceptedAnswer.text).toContain(piano(voce.acceptedAnswer.text));
      }
      for (const trovato of html.matchAll(/\shref="([^"]+)"/g)) {
        const href = trovato[1] ?? '';
        if (!href.startsWith('/') || href.startsWith('//')) continue;
        const path = href.split('?')[0]?.split('#')[0] ?? href;
        if (onDemand.has(path.endsWith('/') ? path : `${path}/`)) continue;
        const normalizzato = path.endsWith('/') || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`;
        const destinazione = join(dist, normalizzato, 'index.html');
        const fileDiretto = join(dist, normalizzato);
        expect(existsSync(destinazione) || existsSync(fileDiretto), `${percorso} → ${href}`).toBe(true);
      }
    }
  });
});
