import { describe, expect, it } from 'vitest';
import { contaParole } from '../src/lib/testi-schede';
import { oraDigitale, oraFormato, oraInParole } from '../src/lib/ora';
import { markupOrologio, opzioniOrologioDaQuery } from '../src/lib/orologio-svg';
import { generaEsercizi, layoutScheda, opzioniSchedaDaQuery } from '../src/lib/schede-orologio';
import { markupSchedaOra } from '../src/lib/orologio-svg';
import { IN_BREVE_OROLOGIO, IN_BREVE_SCHEDE, SEO_OROLOGIO, SEO_SCHEDE_OROLOGIO } from '../src/lib/testi-orologio';
import { buildSeo } from '../src/lib/seo';

describe('oraInParole', () => {
  it('usa l’una, mezzogiorno e il quarto', () => {
    expect(oraInParole(1, 0)).toBe('l’una');
    expect(oraInParole(12, 30)).toBe('mezzogiorno e mezza');
    expect(oraInParole(3, 45)).toBe('le quattro meno un quarto');
    expect(oraInParole(3, 15)).toBe('le tre e un quarto');
    expect(oraInParole(1, 30)).toBe('l’una e mezza');
    expect(oraInParole(11, 45)).toBe('mezzogiorno meno un quarto');
    expect(oraInParole(12, 45)).toBe('l’una meno un quarto');
    expect(oraInParole(8, 0)).toBe('le otto');
    expect(oraInParole(4, 40)).toBe('le cinque meno venti');
    expect(oraInParole(13, 0)).toBe('l’una');
  });

  it('affianca le parole al digitale', () => {
    expect(oraDigitale(3, 15)).toBe('3:15');
    expect(oraFormato(3, 15, 'entrambi')).toBe('le tre e un quarto (3:15)');
    expect(oraFormato(1, 0, 'digitale')).toBe('1:00');
  });
});

describe('fogli orologio', () => {
  it('tiene titoli e In breve nei limiti', () => {
    for (const pagina of [
      { ...SEO_OROLOGIO, href: '/orologio-da-stampare/', inBreve: IN_BREVE_OROLOGIO },
      { ...SEO_SCHEDE_OROLOGIO, href: '/generatori/schede-orologio/', inBreve: IN_BREVE_SCHEDE },
    ]) {
      expect(() =>
        buildSeo({ title: pagina.title, description: pagina.description, path: pagina.href, h1: pagina.h1 }),
      ).not.toThrow();
      expect(contaParole(pagina.inBreve)).toBeGreaterThanOrEqual(40);
      expect(contaParole(pagina.inBreve)).toBeLessThanOrEqual(60);
    }
  });

  it('disegna un quadrante da 160 mm e lancette da ritagliare', () => {
    const svg = markupOrologio(opzioniOrologioDaQuery(new URLSearchParams()));
    expect(svg).toContain('data-diametro="160"');
    expect(svg).toContain('stroke-dasharray');
    expect(svg).toContain('#3F6B4E');
    expect(svg).toContain('#C2522D');
    const contorni = markupOrologio(opzioniOrologioDaQuery(new URLSearchParams('colori=no')));
    expect(contorni).not.toContain('#3F6B4E');
    expect(markupOrologio(opzioniOrologioDaQuery(new URLSearchParams('ore24=si')))).toContain('>13<');
    expect(markupOrologio(opzioniOrologioDaQuery(new URLSearchParams('minuti=no')))).not.toContain('>55<');
  });

  it('allinea righe da almeno 45 mm sotto orologi da 50 a 60 mm', () => {
    for (const quanti of [6, 9, 12] as const) {
      const celle = layoutScheda(quanti);
      expect(celle).toHaveLength(quanti);
      for (const cella of celle) {
        expect(cella.diametro).toBeGreaterThanOrEqual(50);
        expect(cella.diametro).toBeLessThanOrEqual(60);
        expect(cella.rigaL).toBeGreaterThanOrEqual(45);
        expect(cella.rigaY).toBeLessThanOrEqual(292);
        expect(cella.promptY).toBeLessThan(cella.cy - cella.diametro / 2);
        expect(cella.rigaY).toBeGreaterThan(cella.cy + cella.diametro / 2);
        expect(cella.cx - cella.diametro / 2).toBeGreaterThanOrEqual(5);
      }
    }
  });

  it('tiene il seme 1 se l’indirizzo non lo indica', () => {
    expect(opzioniSchedaDaQuery(new URLSearchParams()).seed).toBe(1);
    expect(opzioniSchedaDaQuery(new URLSearchParams('livello=quarti&n=12&tipo=misto&formato=entrambi&seed=7'))).toMatchObject({
      tipo: 'misto',
      livello: 'quarti',
      formato: 'entrambi',
      quanti: 12,
      seed: 7,
    });
  });

  it('ripete la scheda con lo stesso seme', () => {
    const opzioni = opzioniSchedaDaQuery(new URLSearchParams('seed=7&n=12&livello=quarti&tipo=misto'));
    const prima = generaEsercizi(opzioni);
    const seconda = generaEsercizi(opzioni);
    expect(prima).toEqual(seconda);
    expect(prima).toHaveLength(12);
    const svg = markupSchedaOra(opzioni, prima, true);
    expect(svg).toContain('>Soluzioni<');
    expect(svg).toContain('data-lunghezza=');
  });
});
