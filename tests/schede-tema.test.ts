import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CARTINE } from '../src/data/cartine';
import { articoloCartina, calendariDellaCartina, cartineConfinanti, SEO_HUB_CARTINE, seoCartina } from '../src/lib/cartine-pagine';
import {
  descrizioneCrucipuzzle,
  grigliaTema,
  h1Crucipuzzle,
  titoloCrucipuzzle,
  TEMI_CRUCIPUZZLE,
} from '../src/lib/crucipuzzle-temi';

describe('crucipuzzle a tema', () => {
  it('tiene title e description nei limiti e riempie la griglia', () => {
    expect(TEMI_CRUCIPUZZLE).toHaveLength(8);
    for (const tema of TEMI_CRUCIPUZZLE) {
      expect(titoloCrucipuzzle(tema).length, tema.slug).toBeLessThanOrEqual(60);
      expect(descrizioneCrucipuzzle(tema).length, tema.slug).toBeLessThanOrEqual(155);
      expect(h1Crucipuzzle(tema).startsWith('Crucipuzzle ')).toBe(true);
      const griglia = grigliaTema(tema);
      expect(griglia.parole.length).toBeGreaterThanOrEqual(10);
      expect(griglia.griglia).toHaveLength(12);
    }
  });
});

describe('cartine mute', () => {
  it('tiene title e description nei limiti', () => {
    expect(SEO_HUB_CARTINE.title.length).toBeLessThanOrEqual(60);
    expect(SEO_HUB_CARTINE.description.length).toBeLessThanOrEqual(155);
    for (const carta of CARTINE) {
      const seo = seoCartina(carta.slug, carta.nome);
      expect(seo.title.length, seo.title).toBeLessThanOrEqual(60);
      expect(seo.description.length, seo.description).toBeLessThanOrEqual(155);
      expect(seo.h1.length).toBeGreaterThan(0);
    }
    expect(seoCartina('lombardia', 'Lombardia').title).toBe('Cartina muta della Lombardia da stampare (PDF)');
    expect(seoCartina('lombardia', 'Lombardia').description).toBe(
      'Cartina muta della Lombardia con province, da stampare in A4. Dati ISTAT.',
    );
    expect(articoloCartina('italia', 'Italia')).toBe('dell’Italia');
    expect(articoloCartina('trentino-alto-adige', 'Trentino-Alto Adige')).toBe('del Trentino-Alto Adige');
  });

  it('collega Trentino-Alto Adige ai due calendari e la Lombardia al vicino', () => {
    expect(calendariDellaCartina('trentino-alto-adige').map((voce) => voce.nome).sort()).toEqual([
      'Provincia autonoma di Bolzano',
      'Provincia autonoma di Trento',
    ]);
    expect(cartineConfinanti('lombardia').some((voce) => voce.slug === 'trentino-alto-adige')).toBe(true);
  });

  it('ha un SVG per ciascuna cartina, senza nomi scritti', () => {
    const cartella = join(process.cwd(), 'src/data/cartine');
    const file = readdirSync(cartella).filter((nome) => nome.endsWith('.svg'));
    expect(file).toHaveLength(21);
    for (const carta of CARTINE) {
      const path = join(cartella, `${carta.slug}.svg`);
      expect(existsSync(path), carta.slug).toBe(true);
      expect(existsSync(join(process.cwd(), 'public/cartine', `${carta.slug}.svg`)), carta.slug).toBe(true);
    }
  });
});
