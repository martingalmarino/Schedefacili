import { describe, expect, it } from 'vitest';
import { anniTrascorsi, formatta, fraseAnni, secolo, toAstro } from '../src/lib/anni';
import { svgLineaCristo } from '../src/lib/linea-cristo';
import { generaScheda, svgSchedaAnni, type LivelloAnni, type TipoSchedaAnni } from '../src/lib/schede-anni';
import { ESEMPI_CRISTO, NOTA_ROMA } from '../src/lib/testi-cristo';

const LIVELLI: LivelloAnni[] = ['facile', 'medio', 'difficile'];
const TIPI: TipoSchedaAnni[] = ['ordine', 'prima', 'quanti', 'secolo'];
const MASSIMO: Record<LivelloAnni, number> = { facile: 20, medio: 500, difficile: 2000 };

function annoZero(testo: string): boolean {
  return /(?<![\d])0\s*a\.C\./.test(testo) || /(?<![\d])0\s*d\.C\./.test(testo) || testo.includes('anno 0') || />0</.test(testo);
}

describe('anni avanti e dopo Cristo', () => {
  it('conta senza anno zero', () => {
    expect(toAstro({ n: 1, era: 'aC' })).toBe(0);
    expect(toAstro({ n: 2, era: 'aC' })).toBe(-1);
    expect(toAstro({ n: 1, era: 'dC' })).toBe(1);
    expect(anniTrascorsi({ n: 1, era: 'aC' }, { n: 1, era: 'dC' })).toBe(1);
    expect(anniTrascorsi({ n: 10, era: 'aC' }, { n: 10, era: 'dC' })).toBe(19);
    expect(anniTrascorsi({ n: 753, era: 'aC' }, { n: 476, era: 'dC' })).toBe(1228);
    expect(anniTrascorsi({ n: 500, era: 'aC' }, { n: 100, era: 'aC' })).toBe(400);
    expect(anniTrascorsi({ n: 200, era: 'dC' }, { n: 350, era: 'dC' })).toBe(150);
    expect(formatta({ n: 753, era: 'aC' })).toBe('753\u202Fa.C.');
    expect(formatta({ n: 476, era: 'dC' })).toBe('476\u202Fd.C.');
    expect(() => formatta({ n: 0, era: 'aC' })).toThrow();
    expect(annoZero(formatta({ n: 10, era: 'aC' }))).toBe(false);
    expect(annoZero(formatta({ n: 10, era: 'dC' }))).toBe(false);
  });

  it('assegna il secolo in numeri romani', () => {
    expect(secolo({ n: 1, era: 'dC' })).toBe('I secolo d.C.');
    expect(secolo({ n: 100, era: 'dC' })).toBe('I secolo d.C.');
    expect(secolo({ n: 101, era: 'dC' })).toBe('II secolo d.C.');
    expect(secolo({ n: 200, era: 'dC' })).toBe('II secolo d.C.');
    expect(secolo({ n: 1, era: 'aC' })).toBe('I secolo a.C.');
    expect(secolo({ n: 100, era: 'aC' })).toBe('I secolo a.C.');
    expect(secolo({ n: 101, era: 'aC' })).toBe('II secolo a.C.');
    expect(secolo({ n: 476, era: 'dC' })).toBe('V secolo d.C.');
    expect(secolo({ n: 753, era: 'aC' })).toBe('VIII secolo a.C.');
  });

  it('spiega i tre esempi con il calcolo, non a mano', () => {
    expect(ESEMPI_CRISTO[0]).toBe(fraseAnni({ n: 1, era: 'aC' }, { n: 1, era: 'dC' }));
    expect(ESEMPI_CRISTO[1]).toBe('Da 10\u202Fa.C. a 10\u202Fd.C. passano 19 anni.');
    expect(ESEMPI_CRISTO[2]).toBe('Da 500\u202Fa.C. a 100\u202Fa.C. passano 400 anni.');
    expect(NOTA_ROMA).toBe('753\u202Fa.C. (fondazione di Roma secondo la tradizione).');
    expect(annoZero(svgLineaCristo())).toBe(false);
    expect(svgLineaCristo()).toContain('nascita di Cristo (convenzione)');
  });

  it('genera schede riproducibili, con linee da almeno 40 mm', () => {
    for (const seed of [1, 2, 3]) {
      for (const livello of LIVELLI) {
        for (const tipo of TIPI) {
          const opzioni = { seed, tipo, livello };
          const scheda = generaScheda(opzioni);
          expect(generaScheda(opzioni)).toEqual(scheda);
          const foglio = svgSchedaAnni(scheda, false);
          const soluzioni = svgSchedaAnni(scheda, true);
          expect(annoZero(foglio)).toBe(false);
          expect(annoZero(soluzioni)).toBe(false);
          expect(soluzioni).toContain('>Soluzioni<');
          expect(foglio).not.toContain('>Soluzioni<');
          const linee = [...foglio.matchAll(/data-ruolo="risposta"[^>]*x1="([^"]+)"[^>]*x2="([^"]+)"/g)];
          expect(linee.length).toBe(scheda.voci.length);
          for (const linea of linee) {
            expect(Number(linea[2]) - Number(linea[1])).toBeGreaterThanOrEqual(40);
          }
          for (const voce of scheda.voci) {
            for (const anno of voce.anni) {
              expect(anno.n).toBeGreaterThanOrEqual(1);
              expect(anno.n).toBeLessThanOrEqual(MASSIMO[livello]);
            }
            if (tipo === 'quanti') {
              const da = voce.anni[0];
              const a = voce.anni[1];
              expect(da && a && voce.soluzione).toBe(String(anniTrascorsi(da, a)));
            }
            if (tipo === 'secolo') {
              const voceAnno = voce.anni[0];
              expect(voceAnno && voce.soluzione).toBe(secolo(voceAnno));
            }
            if (livello === 'facile') {
              expect(new Set(voce.anni.map((anno) => anno.era)).size).toBe(1);
            }
          }
          if (tipo === 'ordine') {
            expect(scheda.voci.every((voce) => voce.anni.length === 5)).toBe(true);
            if (livello !== 'facile') {
              expect(scheda.voci.every((voce) => new Set(voce.anni.map((anno) => anno.era)).size === 2)).toBe(true);
            }
          }
          if (tipo === 'quanti' && livello !== 'facile') {
            expect(scheda.voci.some((voce) => voce.anni[0]?.era === 'aC' && voce.anni[1]?.era === 'dC')).toBe(true);
          }
        }
      }
    }
  });
});
