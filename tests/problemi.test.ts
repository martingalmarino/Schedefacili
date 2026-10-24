import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { equazione, formattaEuro } from '../src/lib/problemi/formato';
import { generaScheda, opzioniBase, opzioniDaQuery, quantiProblemi, queryProblemi } from '../src/lib/problemi/genera';
import { art, CONTENITORI, eAndato, NOMI, NOMI_F, NOMI_M, OGGETTI, plur, prezzo, pronome, quantita, trovaOggetto } from '../src/lib/problemi/lessico';
import { altezzaRiquadro, htmlScheda } from '../src/lib/problemi/render';
import { creaRng } from '../src/lib/problemi/rng';
import { TEMPLATES } from '../src/lib/problemi/template';
import { NAV } from '../src/data/nav';
import { fontiPagina } from '../src/lib/lastmod';
import { CARD_SCHEDE_UTILI } from '../src/lib/schede-utili';
import { FAQ_HUB_PROBLEMI, HUB_PROBLEMI, PAGINE_PROBLEMI, SEO_HUB_PROBLEMI } from '../src/lib/testi-problemi';
import type { Classe, Istanza, OpzioniScheda, Tag, Template } from '../src/lib/problemi/types';
import { OPERAZIONI_CLASSE } from '../src/lib/problemi/types';
import { motiviVincoli, rispettaVincoli } from '../src/lib/problemi/vincoli';

function istanza(parziale: Partial<Istanza> = {}): Istanza {
  return {
    id: 'prova',
    testo: 'Giulia ha 8 matite. Ne regala 3. Quante matite le restano?',
    dati: [{ etichetta: 'matite', valore: 8, tipo: 'quantita' }],
    operazioni: ['8 − 3 = 5'],
    risultato: 5,
    unita: '',
    risposta: 'Le restano 5 matite.',
    tags: ['sub'],
    passi: 1,
    ...parziale,
  };
}

const somma: Template = {
  id: 'somma',
  classe: 2,
  tags: ['add'],
  passi: 1,
  genera(rng) {
    const a = rng.intero(2, 30);
    const b = rng.intero(2, 30);
    return istanza({
      id: 'somma',
      testo: `In classe ci sono ${a} matite rosse e ${b} matite blu.`,
      dati: [
        { etichetta: 'matite', valore: a, tipo: 'quantita' },
        { etichetta: 'blu', valore: b },
      ],
      operazioni: [equazione(a, '+', b)],
      risultato: a + b,
      risposta: `Ci sono ${a + b} matite.`,
      tags: ['add'],
    });
  },
};

describe('lessico dei problemi', () => {
  it('accorda genere, numero e articoli', () => {
    const matita = trovaOggetto('matita');
    const libro = trovaOggetto('libro');
    const quaderno = trovaOggetto('quaderno');
    const scaffale = trovaOggetto('scaffale');
    const adesivo = trovaOggetto('adesivo');
    expect(matita && plur(1, matita)).toBe('1 matita');
    expect(libro && plur(3, libro)).toBe('3 libri');
    expect(`${pronome('f')} restano`).toBe('le restano');
    expect(`${pronome('m')} restano`).toBe('gli restano');
    expect(eAndato(NOMI_F[0]!)).toBe('Giulia è andata');
    expect(eAndato(NOMI_M[0]!)).toBe('Luca è andato');
    expect(quaderno && art(quaderno, 'def')).toBe('il');
    expect(matita && art(matita, 'indef')).toBe('una');
    expect(scaffale && art(scaffale, 'def')).toBe('lo');
    expect(adesivo && art(adesivo, 'def')).toBe('l’');
    expect(libro && art(libro, 'def', 3)).toBe('i');
    expect(matita && art(matita, 'def', 3)).toBe('le');
    expect(scaffale && art(scaffale, 'def', 2)).toBe('gli');
  });

  it('tiene quantità e prezzi dentro i limiti dell’oggetto', () => {
    const rng = creaRng(42);
    const caramella = trovaOggetto('caramella')!;
    const quaderno = trovaOggetto('quaderno')!;
    const bici = trovaOggetto('bici')!;
    for (let i = 0; i < 30; i += 1) {
      const n = quantita(rng, caramella);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(200);
      expect(quantita(rng, quaderno)).toBeGreaterThanOrEqual(2);
      const intero = prezzo(rng, quaderno, 3);
      expect(Number.isInteger(intero)).toBe(true);
      const conCentesimi = prezzo(rng, bici, 4);
      expect(Math.round(conCentesimi * 100) % 10).toBe(0);
      expect(conCentesimi).toBeGreaterThanOrEqual(80);
      expect(conCentesimi).toBeLessThanOrEqual(400);
    }
  });
});

describe('vincoli', () => {
  it('accetta un problema coerente e scarta i casi vietati', () => {
    expect(motiviVincoli(istanza(), 3)).toEqual([]);
    expect(motiviVincoli(istanza({ risultato: 21, operazioni: ['10 + 11 = 21'] }), 1).length).toBeGreaterThan(0);
    expect(motiviVincoli(istanza({ tags: ['mul'], operazioni: ['4 × 3 = 12'], risultato: 12 }), 1)).toContain('in prima non ci sono moltiplicazioni né divisioni');
    expect(motiviVincoli(istanza({ operazioni: ['8 − 3 = 6'] }), 3)).toContain('operazione incoerente');
    expect(motiviVincoli(istanza({ operazioni: ['8 : 3 = 2'], risultato: 2, tags: ['div'] }), 2)).toContain('divisione non esatta');
    expect(motiviVincoli(istanza({ dati: [{ etichetta: 'matite', valore: 0, tipo: 'quantita' }] }), 3)).toContain('quantità zero');
    expect(motiviVincoli(istanza({ dati: [{ etichetta: 'quaderno', valore: 1, tipo: 'quantita' }] }), 3)).toContain('quantità uno senza il singolare');
    expect(motiviVincoli(istanza({ dati: [{ etichetta: 'prezzo', valore: 2.5, tipo: 'prezzo' }] }), 3).length).toBeGreaterThan(0);
    expect(motiviVincoli(istanza({ dati: [{ etichetta: 'prezzo', valore: 2.5, tipo: 'prezzo' }] }), 4)).toEqual([]);
    expect(motiviVincoli(istanza({ dati: [{ etichetta: 'prezzo', valore: 1.25, tipo: 'prezzo' }] }), 4).length).toBeGreaterThan(0);
    expect(
      motiviVincoli(
        istanza({
          tags: ['div', 'decimali'],
          operazioni: ['10 : 4 = 2,5'],
          risultato: 2.5,
          classe: undefined,
        } as Partial<Istanza>),
        4,
      ),
    ).toEqual([]);
  });
});

describe('generatore', () => {
  it('ripete la stessa scheda a parità di seed', () => {
    const opzioni = opzioniBase(2, 2202);
    const prima = generaScheda(opzioni, [somma]);
    const seconda = generaScheda(opzioni, [somma]);
    expect(prima).toEqual(seconda);
    expect(htmlScheda(prima, opzioni, false)).toBe(htmlScheda(seconda, opzioni, false));
  });

  it('dopo 50 tentativi a vuoto passa a un’altra plantilla', () => {
    let vuoti = 0;
    const vuota: Template = {
      id: 'vuota',
      classe: 3,
      tags: ['sub'],
      passi: 1,
      genera() {
        vuoti += 1;
        return null;
      },
    };
    const buona: Template = { ...somma, id: 'buona', classe: 3 };
    const scheda = generaScheda({ ...opzioniBase(3, 3303), n: 4 }, [vuota, buona]);
    expect(vuoti).toBe(50);
    expect(scheda.map((problema) => problema.id)).toEqual(['buona']);
  });

  it('tiene il seed e le opzioni nell’URL, e il foglio in una pagina', () => {
    const base = opzioniBase(3, 3303);
    const lette = opzioniDaQuery(new URLSearchParams('s=4821&n=4&op=add,sub'), base);
    expect(lette.seed).toBe(4821);
    expect(lette.n).toBe(4);
    expect(lette.operazioni).toEqual(['add', 'sub']);
    expect(queryProblemi(lette, base)).toBe('?s=4821&n=4&op=add%2Csub');
    expect(opzioniDaQuery(new URLSearchParams('s=12'), base).seed).toBe(3303);
    expect(altezzaRiquadro(6)).toBe(23);
    const html = htmlScheda([istanza()], { ...base, n: 6 }, false);
    const soluzioni = htmlScheda([istanza()], { ...base, n: 6 }, true);
    expect(html).toContain('--alto:23mm');
    expect(html).toContain('Classe terza');
    expect(html).toContain('<span class="n">8</span>');
    expect(html).toContain('Nome');
    expect(html).not.toContain('8 − 3 = 5');
    expect(soluzioni).toContain('−');
    expect(soluzioni).toContain('matite: <span class="n">8</span>');
    expect(soluzioni).toContain('Soluzioni');
    expect(formattaEuro(2.5)).toBe(`2,50\u202F€`);
    expect(formattaEuro(13)).toBe(`13\u202F€`);
    const prima = htmlScheda([istanza()], { ...opzioniBase(1, 1101), spazi: 'dati' }, false);
    expect(prima).toContain('Disegna');
  });
});

describe('plantillas por clase', () => {
  it('hay entre 15 y 20 por clase y entre 75 y 100 en total', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(75);
    expect(TEMPLATES.length).toBeLessThanOrEqual(100);
    for (const classe of [1, 2, 3, 4, 5] as const) {
      const dellaClasse = TEMPLATES.filter((template) => template.classe === classe);
      expect(dellaClasse.length).toBeGreaterThanOrEqual(15);
      expect(dellaClasse.length).toBeLessThanOrEqual(20);
      expect(dellaClasse.filter((template) => template.passi === 1).length).toBeGreaterThanOrEqual(8);
    }
    for (const classe of [3, 4, 5] as const) {
      expect(TEMPLATES.filter((template) => template.classe === classe && template.passi >= 2).length).toBeGreaterThanOrEqual(8);
    }
    expect(new Set(TEMPLATES.map((template) => template.id)).size).toBe(TEMPLATES.length);
  });

  it('cada plantilla calcula una solución válida', () => {
    for (const template of TEMPLATES) {
      let validi = 0;
      const motivi: string[] = [];
      for (let seme = 1; seme <= 100; seme += 1) {
        const grezza = template.genera(creaRng(seme));
        if (!grezza) continue;
        const completa = { ...grezza, id: template.id, tags: grezza.tags.length > 0 ? grezza.tags : [...template.tags] };
        const errori = motiviVincoli(completa, template.classe);
        if (errori.length === 0) validi += 1;
        else if (motivi.length < 3) motivi.push(`${seme}: ${errori.join(', ')}`);
      }
      expect(validi, `${template.id} ${motivi.join(' | ')}`).toBeGreaterThanOrEqual(80);
    }
    for (const template of TEMPLATES) {
      let trovata = false;
      for (let seme = 1; seme <= 100 && !trovata; seme += 1) {
        const rng = creaRng(seme + template.classe * 100);
        for (let tentativo = 0; tentativo < 50 && !trovata; tentativo += 1) {
          const grezza = template.genera(rng);
          if (!grezza) continue;
          const completa = { ...grezza, id: template.id, tags: grezza.tags.length > 0 ? grezza.tags : [...template.tags] };
          if (rispettaVincoli(completa, template.classe)) trovata = true;
        }
      }
      expect(trovata, template.id).toBe(true);
    }
  });

  it('las sumas de segunda con cambio siempre llevan', () => {
    const somme = TEMPLATES.filter((template) => template.classe === 2 && template.tags.includes('add'));
    const cambi = somme.filter((template) => template.id.includes('-cambio'));
    expect(cambi.length).toBeGreaterThanOrEqual(Math.ceil(somme.length / 2));
    for (const template of cambi) {
      for (let seme = 1; seme <= 30; seme += 1) {
        const istanza = template.genera(creaRng(seme));
        if (!istanza) continue;
        const [a, b] = istanza.dati.map((dato) => Number(dato.valore));
        expect((a % 10) + (b % 10), template.id).toBeGreaterThanOrEqual(10);
        expect(a + b).toBeLessThanOrEqual(100);
      }
    }
  });

  it('concordancia, iconos y texto limpio', () => {
    const vietate = [/Quante libri/u, /Quanti mele/u, /Quanti matite/u, /Quante bambini/u, /Quante alunni/u, /\{/u, /\}/u, /\bundefined\b/u, /\bNaN\b/u, / {2}/u];
    for (const template of TEMPLATES) {
      for (let seme = 1; seme <= 40; seme += 1) {
        const istanza = template.genera(creaRng(seme));
        if (!istanza) continue;
        const testo = `${istanza.testo} ${istanza.risposta} ${istanza.operazioni.join(' ')}`;
        for (const regola of vietate) expect(testo, template.id).not.toMatch(regola);
        const femminile = new RegExp(`\\b(?:${NOMI_F.map((persona) => persona.nome).join('|')})\\b`, 'u').test(testo);
        const maschile = new RegExp(`\\b(?:${NOMI_M.map((persona) => persona.nome).join('|')})\\b`, 'u').test(testo);
        if (femminile) expect(testo, template.id).not.toMatch(/\bgli restano\b/u);
        if (maschile) expect(testo, template.id).not.toMatch(/\ble restano\b/u);
        if (template.classe === 1) {
          expect(istanza.disegno, template.id).toBeTruthy();
          expect(istanza.aiutoVisivo, template.id).toBeUndefined();
          expect((istanza.disegno?.a ?? 0) <= 20 && (istanza.disegno?.b ?? 0) <= 20).toBe(true);
        }
      }
    }
  });

  it('llena una scheda de cada clase', () => {
    for (const classe of [1, 2, 3, 4, 5] as const) {
      const scheda = generaScheda(opzioniBase(classe, 1000 + classe));
      expect(scheda.length).toBe(6);
      expect(scheda.every((problema) => rispettaVincoli(problema, classe))).toBe(true);
    }
    for (const classe of [3, 4, 5] as const) {
      const scheda = generaScheda({ ...opzioniBase(classe, 2000 + classe), dueOperazioni: true });
      expect(scheda.length).toBe(6);
      expect(scheda.every((problema) => problema.passi >= 2)).toBe(true);
    }
  });
});

describe('páginas de problemas', () => {
  it('tiene títulos, metas y semillas dentro de los límites', () => {
    const pagine = [SEO_HUB_PROBLEMI, ...PAGINE_PROBLEMI];
    expect(new Set(pagine.map((pagina) => pagina.title)).size).toBe(6);
    expect(new Set(pagine.map((pagina) => pagina.description)).size).toBe(6);
    expect(new Set(pagine.map((pagina) => pagina.h1)).size).toBe(6);
    for (const pagina of pagine) {
      expect(pagina.title.length, pagina.title).toBeLessThanOrEqual(60);
      expect(pagina.description.length, pagina.description).toBeLessThanOrEqual(155);
      expect(pagina.h1.length).toBeGreaterThan(0);
    }
    expect(PAGINE_PROBLEMI.map((pagina) => pagina.seed)).toEqual([1101, 2202, 3303, 4404, 5505]);
    expect(FAQ_HUB_PROBLEMI).toHaveLength(4);
    for (const pagina of PAGINE_PROBLEMI) {
      expect(pagina.domande.length).toBeGreaterThanOrEqual(3);
      expect(pagina.domande.length).toBeLessThanOrEqual(4);
      expect(pagina.domande[0]?.risposta).toMatch(/di solito si lavora su/);
    }
    expect(HUB_PROBLEMI).toBe('/problemi-matematica/');
    const schede = NAV.find((voce) => voce.label === 'Schede utili');
    expect(schede?.figli?.some((voce) => voce.href === HUB_PROBLEMI && voce.label === 'Problemi di matematica')).toBe(true);
    const card = CARD_SCHEDE_UTILI.find((voce) => voce.href === HUB_PROBLEMI);
    expect(card?.conteggio).toBe(TEMPLATES.length);
    expect(card && 'unita' in card ? card.unita : '').toBe('problemi tipo');
    expect(quantiProblemi(8, true)).toBe(5);
    expect(quantiProblemi(4, true)).toBe(4);
    expect(quantiProblemi(8, false)).toBe(8);
    for (const pagina of PAGINE_PROBLEMI) {
      const fonti = fontiPagina(pagina.href);
      expect(fonti).toContain(`src/lib/problemi/template/classe-${pagina.classe}.ts`);
      expect(fonti).toContain('src/lib/problemi/genera.ts');
      expect(fonti).toContain('src/pages/problemi-matematica/[classe].astro');
      expect(fonti.filter((file) => file.includes('/template/classe-'))).toEqual([`src/lib/problemi/template/classe-${pagina.classe}.ts`]);
    }
    expect(fontiPagina(HUB_PROBLEMI)).toEqual(
      expect.arrayContaining(['src/pages/problemi-matematica/index.astro', 'src/lib/problemi/render.ts', 'src/lib/problemi/template/classe-5.ts']),
    );
    for (const classe of [1, 2, 3, 4, 5] as const) {
      const scheda = generaScheda(opzioniBase(classe, PAGINE_PROBLEMI[classe - 1]?.seed ?? 1101));
      expect(scheda.length).toBe(6);
    }
  });

  it('el HTML de las semillas fijas coincide con el render del cliente', () => {
    const dist = join(process.cwd(), 'dist', 'client');
    const pagine = [
      { href: HUB_PROBLEMI, opzioni: opzioniBase(3, 3303) },
      ...PAGINE_PROBLEMI.map((pagina) => ({ href: pagina.href, opzioni: opzioniBase(pagina.classe, pagina.seed) })),
    ];
    for (const pagina of pagine) {
      const prima = generaScheda(pagina.opzioni);
      const seconda = generaScheda(pagina.opzioni);
      expect(seconda).toEqual(prima);
      const html = readFileSync(join(dist, pagina.href, 'index.html'), 'utf8');
      expect(html, pagina.href).toContain(htmlScheda(prima, pagina.opzioni, false));
      expect(html, pagina.href).toContain(htmlScheda(prima, pagina.opzioni, true));
    }
  });
});

const EQUAZIONE_TEST = /^(-?\d+(?:,\d+)?)\s*([+\-−×:])\s*(-?\d+(?:,\d+)?)\s*=\s*(-?\d+(?:,\d+)?)$/u;
const PLURALI = [...OGGETTI, ...CONTENITORI].map((ogg) => ogg.plurale).join('|');
const ZERO_OGGETTI = new RegExp(`(?<!\\d)0\\s+(?:${PLURALI})\\b`, 'u');
const UNO_PLURALE = new RegExp(`(?<!\\d)1\\s+(?:${PLURALI})\\b`, 'u');
const QUANTE = /Quante (?:libri|quaderni|palloni|adesivi|fiori)\b/u;
const QUANTI = /Quanti (?:matite|figurine|caramelle|mele|biglie)\b/u;

function numeroTest(testo: string): number {
  return Number(testo.replace(',', '.'));
}

function calcola(a: number, segno: string, b: number): number | null {
  if (segno === '+') return a + b;
  if (segno === '−' || segno === '-') return a - b;
  if (segno === '×') return a * b;
  if (segno === ':') return b === 0 ? null : a / b;
  return null;
}

function equazioniDi(problema: Istanza): { a: number; segno: string; b: number; c: number }[] {
  return problema.operazioni.flatMap((riga) =>
    riga
      .split('/')
      .map((pezzo) => pezzo.trim())
      .filter(Boolean)
      .flatMap((pezzo) => {
        const trovato = pezzo.match(EQUAZIONE_TEST);
        if (!trovato) return [];
        return [{ a: numeroTest(trovato[1] ?? ''), segno: trovato[2] ?? '', b: numeroTest(trovato[3] ?? ''), c: numeroTest(trovato[4] ?? '') }];
      }),
  );
}

function erroreTesto(problema: Istanza): string | undefined {
  const equazioni = equazioniDi(problema);
  if (equazioni.length === 0) return 'senza equazione';
  for (const passo of equazioni) {
    const atteso = calcola(passo.a, passo.segno, passo.b);
    if (atteso === null || Math.abs(atteso - passo.c) > 1e-6) return `${passo.a} ${passo.segno} ${passo.b} = ${passo.c}`;
    if (passo.a < 0 || passo.b < 0 || passo.c < 0) return 'numero negativo';
  }
  const ultimo = equazioni[equazioni.length - 1];
  if (!ultimo || Math.abs(ultimo.c - problema.risultato) > 1e-6) return 'risultato diverso';
  const testo = `${problema.testo}\n${problema.risposta}\n${problema.operazioni.join('\n')}`;
  if (testo.includes('{') || testo.includes('}') || testo.includes('undefined') || testo.includes('NaN') || testo.includes('  ')) return 'testo sporco';
  if (ZERO_OGGETTI.test(testo)) return 'zero oggetti';
  if (/[−-]\d/u.test(`${problema.testo} ${problema.risposta}`)) return 'negativo nel testo';
  if (QUANTE.test(testo) || QUANTI.test(testo) || UNO_PLURALE.test(testo)) return 'concordanza';
  return undefined;
}

function semiCasuali(classe: Classe): number[] {
  const rng = creaRng(classe * 7919);
  const semi = new Set<number>();
  while (semi.size < 1000) semi.add(1000 + Math.floor(rng.successivo() * 999_000));
  return [...semi];
}

function combinazioni(classe: Classe): Pick<OpzioniScheda, 'n' | 'operazioni' | 'dueOperazioni'>[] {
  const operazioni = OPERAZIONI_CLASSE[classe];
  const gruppi: Tag[][] = [[...operazioni], ...operazioni.map((tag) => [tag])];
  const voci: Pick<OpzioniScheda, 'n' | 'operazioni' | 'dueOperazioni'>[] = [];
  for (const n of [4, 5, 6, 7, 8]) {
    for (const gruppo of gruppi) voci.push({ n, operazioni: gruppo, dueOperazioni: false });
    if (classe >= 3) voci.push({ n, operazioni: [...operazioni], dueOperazioni: true });
  }
  return voci;
}

function poolAtteso(classe: Classe, operazioni: readonly Tag[], due: boolean): number {
  return TEMPLATES.filter(
    (template) => template.classe === classe && template.tags.every((tag) => operazioni.includes(tag)) && (due ? template.passi >= 2 : template.passi === 1),
  ).length;
}

describe('fuzz dei problemi', () => {
  it('mille semi per classe rispettano vincoli, soluzioni e concordanza', () => {
    for (const classe of [1, 2, 3, 4, 5] as const) {
      const semi = semiCasuali(classe);
      for (const combinazione of combinazioni(classe)) {
        const compatibili = poolAtteso(classe, combinazione.operazioni, combinazione.dueOperazioni);
        const disponibili =
          compatibili > 0
            ? compatibili
            : TEMPLATES.filter((template) => template.classe === classe && !(classe === 1 && (template.tags.includes('mul') || template.tags.includes('div')))).length;
        const attesi = Math.min(combinazione.n, disponibili);
        for (const seed of semi) {
          const opzioni = { ...opzioniBase(classe, seed), ...combinazione };
          const scheda = generaScheda(opzioni);
          const etichetta = `classe ${classe} n=${combinazione.n} due=${combinazione.dueOperazioni} op=${combinazione.operazioni.join(',')} seed=${seed}`;
          if (scheda.length !== attesi) throw new Error(`${etichetta}: ${scheda.length} problemi, attesi ${attesi}`);
          if (new Set(scheda.map((problema) => problema.id)).size !== scheda.length) throw new Error(`${etichetta}: plantilla ripetuta`);
          if (new Set(scheda.map((problema) => problema.testo)).size !== scheda.length) throw new Error(`${etichetta}: problema identico`);
          for (const problema of scheda) {
            const motivi = motiviVincoli(problema, classe);
            if (motivi.length > 0) throw new Error(`${etichetta} ${problema.id}: ${motivi.join(', ')}`);
            const errore = erroreTesto(problema);
            if (errore) throw new Error(`${etichetta} ${problema.id}: ${errore} · ${problema.testo}`);
          }
        }
      }
    }
  }, 180000);
});

const PAROLE_OGGETTO = new Map([...OGGETTI, ...CONTENITORI].flatMap((ogg) => [[ogg.singolare, ogg], [ogg.plurale, ogg]] as const));

function erroreNe(testo: string): string | null {
  const regola = /\bne\s+\p{L}+(?:\s+\p{L}+){0,4}\s+\d+\s+(\p{L}+)/giu;
  for (const match of testo.matchAll(regola)) {
    const parola = (match[1] ?? '').toLocaleLowerCase('it');
    const ogg = PAROLE_OGGETTO.get(parola);
    if (!ogg) continue;
    const prima = testo.slice(0, match.index ?? 0).toLocaleLowerCase('it');
    if (prima.includes(ogg.singolare) || prima.includes(ogg.plurale)) return match[0];
  }
  return null;
}

function contaPunti(html: string, colore: string): number {
  return html.match(new RegExp(`class="punto ${colore}(?: punto-tolto)?"`, 'g'))?.length ?? 0;
}

describe('puntini, ne e nomi', () => {
  it('usa almeno 20 nomi e non li ripete nella stessa scheda', () => {
    expect(NOMI.length).toBeGreaterThanOrEqual(20);
    for (const classe of [1, 2, 3, 4, 5] as const) {
      for (const seed of semiCasuali(classe)) {
        const scheda = generaScheda({ ...opzioniBase(classe, seed), n: 8 });
        const trovati = scheda.flatMap((problema) => NOMI.filter((persona) => new RegExp(`\\b${persona.nome}\\b`, 'u').test(problema.testo)).map((persona) => persona.nome));
        expect(new Set(trovati).size, `${classe} ${seed} ${trovati.join(', ')}`).toBe(trovati.length);
      }
    }
  });

  it('non ripete il sostantivo dopo ne e un numero', () => {
    for (const template of TEMPLATES) {
      for (let seme = 1; seme <= 80; seme += 1) {
        const istanza = template.genera(creaRng(seme + template.classe * 17));
        if (!istanza) continue;
        const errore = erroreNe(`${istanza.testo} ${istanza.risposta}`);
        expect(errore, `${template.id}: ${istanza.testo}`).toBeNull();
      }
    }
  });

  it('la scheda di prima non disegna il risultato; l’aiuto mostra i dati', () => {
    for (const seed of semiCasuali(1)) {
      const opzioni = { ...opzioniBase(1, seed), n: 8 as const };
      const scheda = generaScheda(opzioni);
      const vuota = htmlScheda(scheda, opzioni, false);
      if (vuota.includes('class="punto')) throw new Error(`${seed}: la scheda disegna già il risultato`);
      const aiuto = htmlScheda(scheda, { ...opzioni, aiutoVisivo: true }, false).split('<li class="problema">').slice(1);
      const soluzioni = htmlScheda(scheda, opzioni, true).split('<li class="problema">').slice(1);
      scheda.forEach((problema, indice) => {
        const disegno = problema.disegno;
        const html = aiuto[indice] ?? '';
        const sol = soluzioni[indice] ?? '';
        const etichetta = `${seed} ${problema.id}`;
        if (!disegno) throw new Error(`${etichetta}: manca il disegno`);
        if (disegno.tipo === 'add') {
          if (contaPunti(html, 'punto-ink') !== disegno.a || contaPunti(html, 'punto-terracotta') !== disegno.b) {
            throw new Error(`${etichetta}: aiuto ${disegno.a}+${disegno.b}`);
          }
          if (!html.includes('segno-puntini') || html.includes('punto-tolto')) throw new Error(`${etichetta}: somma senza gruppi`);
          if (contaPunti(sol, 'punto-ink') + contaPunti(sol, 'punto-terracotta') !== disegno.a + disegno.b) {
            throw new Error(`${etichetta}: soluzioni senza risultato`);
          }
        } else if (contaPunti(html, 'punto-ink') !== disegno.a || (html.match(/punto-tolto/g) ?? []).length !== disegno.b) {
          throw new Error(`${etichetta}: aiuto ${disegno.a} con ${disegno.b} tolti`);
        } else if ((sol.match(/punto-tolto/g) ?? []).length !== disegno.b || contaPunti(sol, 'punto-ink') !== disegno.a) {
          throw new Error(`${etichetta}: soluzioni senza il disegno completo`);
        }
      });
    }
  });
});
