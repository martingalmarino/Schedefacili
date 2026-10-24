import { describe, expect, it } from 'vitest';
import {
  contaParole,
  SEO_CRUCIPUZZLE,
  SEO_GENERATORE_TABELLINE,
  SEO_HUB_GENERATORI,
  SEO_HUB_TABELLINE,
  SEO_TAVOLA,
  testoClasseCrucipuzzle,
  testoClasseGeneratoreTabelline,
  testoClasseTabellina,
  testoClasseTavola,
} from '../src/lib/testi-schede';

const SEO = [SEO_HUB_TABELLINE, SEO_TAVOLA, SEO_HUB_GENERATORI, SEO_GENERATORE_TABELLINE, SEO_CRUCIPUZZLE];

describe('testi di classe', () => {
  it('resta fra 150 e 250 parole', () => {
    const testi = [
      ...Array.from({ length: 10 }, (_, indice) => testoClasseTabellina(indice + 1)),
      testoClasseTavola(),
      testoClasseGeneratoreTabelline(),
      testoClasseCrucipuzzle(),
    ];
    for (const testo of testi) {
      const n = contaParole(testo);
      expect(n, testo.slice(0, 40)).toBeGreaterThanOrEqual(150);
      expect(n, testo.slice(0, 40)).toBeLessThanOrEqual(250);
      expect(testo.toLowerCase()).not.toContain('scopriamo');
      expect(testo.toLowerCase()).not.toContain('fondamentale');
    }
  });

  it('tiene title e description nei limiti', () => {
    for (const voce of SEO) {
      expect(voce.title.length, voce.title).toBeLessThanOrEqual(60);
      expect(voce.description.length, voce.description).toBeLessThanOrEqual(155);
      expect(voce.h1.length).toBeGreaterThan(0);
    }
    expect(SEO_GENERATORE_TABELLINE.title).toBe('Generatore di tabelline da stampare, anche DSA');
    expect(SEO_CRUCIPUZZLE.title).toBe('Generatore di crucipuzzle gratis da stampare');
    expect(SEO_CRUCIPUZZLE.h1).toBe('Generatore di crucipuzzle');
  });
});
