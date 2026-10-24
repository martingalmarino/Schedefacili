import { describe, expect, it } from 'vitest';
import {
  descrizioneTabellina,
  esercizi,
  eserciziTabellina,
  h1Tabellina,
  slugTabellina,
  soluzioneDi,
  tabella,
  titoloTabellina,
  tavolaPitagorica,
} from '../src/lib/tabelline';

describe('articolo e slug', () => {
  it('usa dell’ per 1 e 8, del per le altre', () => {
    expect(slugTabellina(1)).toBe('tabellina-dell-1');
    expect(slugTabellina(8)).toBe('tabellina-dell-8');
    expect(slugTabellina(7)).toBe('tabellina-del-7');
    expect(h1Tabellina(1)).toBe('Tabellina dell’1 da stampare');
    expect(h1Tabellina(8)).toBe('Tabellina dell’8 da stampare');
    expect(h1Tabellina(7)).toBe('Tabellina del 7 da stampare');
  });

  it('tiene title e description nei limiti', () => {
    for (let n = 1; n <= 10; n += 1) {
      expect(titoloTabellina(n).length, String(n)).toBeLessThanOrEqual(60);
      expect(descrizioneTabellina(n).length, String(n)).toBeLessThanOrEqual(155);
    }
  });
});

describe('tabelle e esercizi', () => {
  it('calcola la tabellina e la tavola', () => {
    expect(tabella(7)[0]).toEqual({ fattore: 1, prodotto: 7 });
    expect(tabella(7)[9]).toEqual({ fattore: 10, prodotto: 70 });
    expect(tavolaPitagorica()).toHaveLength(10);
    expect(tavolaPitagorica()[6]?.[9]).toBe(70);
  });

  it('ripete gli stessi buchi con lo stesso seme', () => {
    const prima = eserciziTabellina(7, 10, 42);
    const seconda = eserciziTabellina(7, 10, 42);
    expect(prima).toEqual(seconda);
    expect(prima).not.toEqual(eserciziTabellina(7, 10, 43));
    for (const esercizio of prima) {
      expect(esercizio.fattoreA * esercizio.fattoreB).toBe(esercizio.prodotto);
      expect([esercizio.fattoreA, esercizio.fattoreB, esercizio.prodotto]).toContain(soluzioneDi(esercizio));
    }
  });

  it('rispetta il tipo di buco', () => {
    expect(esercizi([4], 6, 3, 'prodotto').every((voce) => voce.nascosto === 'prodotto')).toBe(true);
    expect(esercizi([4], 6, 3, 'fattore').every((voce) => voce.nascosto !== 'prodotto')).toBe(true);
  });
});
