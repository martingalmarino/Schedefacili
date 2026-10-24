import { describe, expect, it } from 'vitest';
import { contaParole } from '../src/lib/testi-schede';
import {
  FRASE_RIGHELLO,
  latoInCssPx,
  modelloFoglio,
  opzioniDaQuery,
  type OpzioniFoglio,
  type TipoFoglio,
} from '../src/lib/fogli';
import {
  FAQ_05,
  FAQ_1,
  FAQ_HUB,
  FAQ_MM,
  IN_BREVE_05,
  IN_BREVE_1,
  IN_BREVE_HUB,
  IN_BREVE_MM,
  PAGINE_FOGLI,
  SEO_HUB_FOGLI,
} from '../src/lib/testi-fogli';
import { buildSeo } from '../src/lib/seo';

const BASE: OpzioniFoglio = {
  tipo: 'quadretti-1',
  margine: true,
  colore: 'grigio',
  spessore: 0.2,
  intestazione: true,
};

function entroIlBordo(opzioni: OpzioniFoglio) {
  const modello = modelloFoglio(opzioni);
  for (const linea of modello.linee) {
    for (const valore of [linea.x1, linea.x2]) {
      expect(valore).toBeGreaterThanOrEqual(5);
      expect(valore).toBeLessThanOrEqual(205);
    }
    for (const valore of [linea.y1, linea.y2]) {
      expect(valore).toBeGreaterThanOrEqual(5);
      expect(valore).toBeLessThanOrEqual(292);
    }
  }
}

describe('fogli A4', () => {
  it('tiene i quadretti da 1 cm a 10 mm, cioè 37,8 px a 96 dpi', () => {
    const xs = modelloFoglio(BASE)
      .linee.filter((linea) => linea.ruolo === 'griglia' && linea.x1 === linea.x2)
      .map((linea) => linea.x1);
    expect(xs[1]! - xs[0]!).toBe(10);
    expect(Math.abs(latoInCssPx(10) - 37.8)).toBeLessThanOrEqual(0.5);
  });

  it('lascia 5 mm di bordo bianco e un righello da 5 cm', () => {
    for (const tipo of ['quadretti-1', 'quadretti-05', 'millimetrata'] as TipoFoglio[]) {
      entroIlBordo({ ...BASE, tipo, intestazione: false });
      entroIlBordo({ ...BASE, tipo, margine: false, intestazione: true });
    }
    const righello = modelloFoglio(BASE).linee.find((linea) => linea.ruolo === 'righello' && linea.y1 === linea.y2);
    expect(righello).toBeTruthy();
    expect((righello?.x2 ?? 0) - (righello?.x1 ?? 0)).toBe(50);
  });

  it('mette il margine rosso a 15 mm e lo toglie con ?margine=no', () => {
    const con = modelloFoglio(BASE).linee.find((linea) => linea.ruolo === 'margine');
    expect(con?.x1).toBe(15);
    expect(con?.stroke).toBe('#C0392B');
    const senza = opzioniDaQuery('quadretti-1', new URLSearchParams('margine=no'));
    expect(senza.margine).toBe(false);
    expect(modelloFoglio(senza).linee.some((linea) => linea.ruolo === 'margine')).toBe(false);
  });

  it('segna la millimetrata a 0,1 mm, 0,2 mm e 0,35 mm', () => {
    const linee = modelloFoglio({ ...BASE, tipo: 'millimetrata', colore: 'grigio' }).linee.filter(
      (linea) => linea.ruolo === 'griglia' && linea.x1 === linea.x2,
    );
    expect(linee.find((linea) => linea.passo === 1)?.spessore).toBe(0.1);
    expect(linee.find((linea) => linea.passo === 1)?.stroke).toBe('#B8C2CC');
    expect(linee.find((linea) => linea.passo === 5)?.spessore).toBe(0.2);
    expect(linee.find((linea) => linea.passo === 10)?.spessore).toBe(0.35);
  });

  it('tiene titoli, meta e In breve nei limiti', () => {
    const pagine = [
      { ...SEO_HUB_FOGLI, href: '/fogli-da-stampare/', inBreve: IN_BREVE_HUB, faq: FAQ_HUB },
      { ...PAGINE_FOGLI[0], inBreve: IN_BREVE_1, faq: FAQ_1 },
      { ...PAGINE_FOGLI[1], inBreve: IN_BREVE_05, faq: FAQ_05 },
      { ...PAGINE_FOGLI[2], inBreve: IN_BREVE_MM, faq: FAQ_MM },
    ];
    for (const pagina of pagine) {
      expect(() =>
        buildSeo({
          title: pagina.title,
          description: pagina.description,
          path: pagina.href,
          h1: pagina.h1,
        }),
      ).not.toThrow();
      const parole = contaParole(pagina.inBreve);
      expect(parole).toBeGreaterThanOrEqual(40);
      expect(parole).toBeLessThanOrEqual(60);
      expect(pagina.faq.length).toBeGreaterThanOrEqual(3);
      expect(pagina.faq.length).toBeLessThanOrEqual(5);
      expect(pagina.inBreve.includes(FRASE_RIGHELLO)).toBe(false);
      expect(pagina.inBreve.toLowerCase().includes('segnaposto')).toBe(false);
    }
  });
});
