import { describe, expect, it } from 'vitest';
import festivita from '../src/data/festivita.json';
import { giornoDopo, pasqua } from '../src/lib/pasqua';
import {
  formatGiornoMese,
  prossimaRicorrenza,
  testoQuando,
  type Festivita,
} from '../src/lib/ricorrenze';
import { regioniPiuPopolose } from '../src/data/regioni';

const voci = festivita as Festivita[];

describe('pasqua', () => {
  it('coincide con date gregoriane note', () => {
    expect(pasqua(2020)).toBe('2020-04-12');
    expect(pasqua(2024)).toBe('2024-03-31');
    expect(pasqua(2025)).toBe('2025-04-20');
    expect(pasqua(2026)).toBe('2026-04-05');
    expect(pasqua(2027)).toBe('2027-03-28');
  });
});

describe('festivita', () => {
  it('ha una fonte ufficiale per ogni voce', () => {
    for (const voce of voci) {
      expect(voce.fonte.startsWith('https://')).toBe(true);
      expect(voce.nome.length).toBeGreaterThan(0);
    }
  });

  it('allinea Pasqua e il lunedì dell’Angelo al computus', () => {
    for (const anno of [2026, 2027]) {
      const domenica = pasqua(anno);
      const pasquaVoce = voci.find((voce) => voce.data === domenica && voce.nome === 'Pasqua');
      const lunedi = voci.find((voce) => voce.data === giornoDopo(domenica));
      expect(pasquaVoce?.calcolo).toBe('computus-gregoriano');
      expect(lunedi?.nome).toBe('Lunedì dell’Angelo');
    }
  });
});

describe('prossima ricorrenza', () => {
  it('il 23 ottobre 2026 indica Ognissanti tra 9 giorni', () => {
    const prossima = prossimaRicorrenza(voci, new Date(2026, 9, 23));
    expect(prossima?.data).toBe('2026-11-01');
    expect(prossima?.nome).toBe('Ognissanti');
    expect(prossima?.giorni).toBe(9);
    expect(prossima?.etichetta).toBe('1 novembre');
    expect(testoQuando(9)).toBe('tra 9 giorni');
  });

  it('formatta il giorno senza maiuscola nel mese', () => {
    expect(formatGiornoMese('2026-11-04')).toBe('4 novembre');
    expect(testoQuando(0)).toBe('oggi');
    expect(testoQuando(1)).toBe('domani');
  });

  it('non restituisce nulla se non ci sono date future', () => {
    expect(prossimaRicorrenza(voci, new Date(2028, 0, 2))).toBeNull();
    expect(prossimaRicorrenza([], new Date(2026, 9, 23))).toBeNull();
  });
});

describe('regioni del footer', () => {
  it('elenca le sei più popolose nell’ordine ISTAT', () => {
    expect(regioniPiuPopolose().map((regione) => regione.slug)).toEqual([
      'lombardia',
      'lazio',
      'campania',
      'veneto',
      'sicilia',
      'emilia-romagna',
    ]);
  });
});
