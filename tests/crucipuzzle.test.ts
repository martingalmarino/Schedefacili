import { describe, expect, it } from 'vitest';
import { generaCrucipuzzle, LETTERE_ITALIANE } from '../src/lib/crucipuzzle';

const PAROLE = ['cane', 'gatto', 'sole', 'mare', 'pesce'];

describe('crucipuzzle', () => {
  it('fa entrare tutte le parole e riempie con lettere italiane', () => {
    const risultato = generaCrucipuzzle({
      parole: PAROLE,
      lato: 10,
      direzioni: ['orizzontale', 'verticale', 'diagonale'],
      contrario: true,
      seme: 3,
    });
    expect(risultato.ok).toBe(true);
    if (!risultato.ok) return;
    expect(risultato.parole.map((voce) => voce.parola).sort()).toEqual(['CANE', 'GATTO', 'MARE', 'PESCE', 'SOLE']);
    for (const riga of risultato.griglia) {
      for (const lettera of riga) expect(LETTERE_ITALIANE.includes(lettera)).toBe(true);
    }
  });

  it('è riproducibile e rispetta la direzione', () => {
    const opzioni = {
      parole: PAROLE,
      lato: 10,
      direzioni: ['orizzontale'] as const,
      contrario: false,
      seme: 11,
    };
    const prima = generaCrucipuzzle({ ...opzioni, direzioni: [...opzioni.direzioni] });
    const seconda = generaCrucipuzzle({ ...opzioni, direzioni: [...opzioni.direzioni] });
    expect(prima).toEqual(seconda);
    if (!prima.ok) return;
    expect(prima.parole.every((voce) => voce.dr === 0 && voce.dc === 1)).toBe(true);
  });

  it('può scrivere al contrario', () => {
    const risultato = generaCrucipuzzle({
      parole: ['luna', 'orto'],
      lato: 8,
      direzioni: ['orizzontale'],
      contrario: true,
      seme: 5,
    });
    expect(risultato.ok).toBe(true);
    if (!risultato.ok) return;
    expect(risultato.parole.every((voce) => voce.dr === 0 && (voce.dc === 1 || voce.dc === -1))).toBe(true);
  });
});
