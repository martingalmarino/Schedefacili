import { describe, expect, it } from 'vitest';
import { contaParole } from '../src/lib/testi-schede';
import { convertiTesto, fromRoman, partiRomane, toRoman } from '../src/lib/romani';
import { generaSchede, markupSchedaRomana, simboloRomanoValido } from '../src/lib/schede-romani';
import { svgSchema1000, svgTabella100 } from '../src/lib/tabelle-romane';
import {
  IN_BREVE_100,
  IN_BREVE_1000,
  IN_BREVE_CONVERTITORE,
  IN_BREVE_ROMANI,
  SEO_CONVERTITORE,
  SEO_ROMANI,
  SEO_ROMANI_100,
  SEO_ROMANI_1000,
} from '../src/lib/testi-romani';
import { buildSeo } from '../src/lib/seo';

describe('numeri romani', () => {
  it('fa andata e ritorno da 1 a 3999', () => {
    for (let numero = 1; numero <= 3999; numero += 1) {
      expect(fromRoman(toRoman(numero)), String(numero)).toBe(numero);
    }
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(90)).toBe('XC');
    expect(toRoman(400)).toBe('CD');
    expect(toRoman(900)).toBe('CM');
    expect(toRoman(1994)).toBe('MCMXCIV');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
    expect(partiRomane(1994)).toEqual(['M', 'CM', 'XC', 'IV']);
    expect(convertiTesto('1994').scomposizione).toBe('1994 = M + CM + XC + IV');
    expect(fromRoman('iv')).toBe(4);
  });

  it('rifiuta le forme non canoniche', () => {
    for (const forma of ['IIII', 'VX', 'IC', 'VV', 'IL', 'XXXX', 'VIIII']) {
      expect(() => fromRoman(forma), forma).toThrow(/non è una forma canonica/);
    }
    expect(() => toRoman(0)).toThrow(/1 e 3999/);
    expect(() => toRoman(4000)).toThrow(/1 e 3999/);
    expect(() => fromRoman('')).toThrow(/non è una forma canonica/);
  });
});

describe('schede e tabelle', () => {
  it('tiene titoli e In breve nei limiti', () => {
    const pagine = [
      { ...SEO_ROMANI, href: '/numeri-romani/', inBreve: IN_BREVE_ROMANI },
      { ...SEO_ROMANI_100, href: '/numeri-romani/da-1-a-100/', inBreve: IN_BREVE_100 },
      { ...SEO_ROMANI_1000, href: '/numeri-romani/da-1-a-1000/', inBreve: IN_BREVE_1000 },
      { ...SEO_CONVERTITORE, href: '/numeri-romani/convertitore/', inBreve: IN_BREVE_CONVERTITORE },
    ];
    for (const pagina of pagine) {
      expect(() =>
        buildSeo({ title: pagina.title, description: pagina.description, path: pagina.href, h1: pagina.h1 }),
      ).not.toThrow();
      expect(contaParole(pagina.inBreve), pagina.href).toBeGreaterThanOrEqual(40);
      expect(contaParole(pagina.inBreve), pagina.href).toBeLessThanOrEqual(60);
    }
  });

  it('ripete le schede con lo stesso seme e rifiuta i falsi', () => {
    const prima = generaSchede({ seed: 3, fino: 20 });
    const seconda = generaSchede({ seed: 3, fino: 20 });
    expect(prima).toEqual(seconda);
    const veroFalso = prima.find((scheda) => scheda.id === 'vero-falso');
    expect(veroFalso?.voci.some((voce) => voce.soluzione === 'Falso' && !simboloRomanoValido(voce.traccia))).toBe(true);
    expect(veroFalso?.voci.some((voce) => voce.soluzione === 'Vero' && simboloRomanoValido(voce.traccia))).toBe(true);
    const romani = prima.find((scheda) => scheda.id === 'in-romani');
    for (const voce of romani?.voci ?? []) {
      expect(voce.soluzione).toBe(toRoman(Number(voce.traccia)));
    }
    const markup = markupSchedaRomana(prima[0]!, true);
    expect(markup).toContain('>Soluzioni<');
    for (const lunghezza of markup.matchAll(/data-lunghezza="([0-9.]+)"/g)) {
      expect(Number(lunghezza[1])).toBeGreaterThanOrEqual(45);
    }
  });

  it('prepara la tabella da 100 e lo schema da 1000', () => {
    const piena = svgTabella100(false);
    const vuote = svgTabella100(true);
    expect(piena).toContain('>LXXXVIII<');
    expect(piena).toContain('viewBox="0 0 210 297"');
    expect(vuote.match(/data-vuota=/g)).toHaveLength(50);
    const schema = svgSchema1000();
    expect(schema).toContain('1994 = M + CM + XC + IV = MCMXCIV');
    expect(schema).toContain('>M<');
  });
});
