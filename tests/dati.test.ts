import { describe, expect, it } from 'vitest';
import { CARTINE } from '../src/data/cartine';
import calendario from '../src/data/calendario/2026-2027.json';
import festivita from '../src/data/festivita.json';
import regioni from '../src/data/regioni.json';
import { schemaCalendario, schemaFestivita, schemaRegioni, type CalendarioVoce, type RegioneDato } from '../src/data/schemi';
import { normalizza } from '../src/lib/normalize';
import { erroriCalendario, erroriCartine } from '../src/lib/valida-dati';

const voci = schemaRegioni.parse(regioni).voci;
const anno = schemaCalendario.parse(calendario).voci;

function voce(parziale: Partial<CalendarioVoce> & Pick<CalendarioVoce, 'slug'>): CalendarioVoce {
  return {
    stato: 'ufficiale',
    inizio: '2026-09-14',
    fine: '2027-06-08',
    natale: { dal: '2026-12-23', al: '2027-01-06' },
    pasqua: { dal: '2027-03-25', al: '2027-03-30' },
    ponti: [],
    fonte: { titolo: 'Delibera', url: 'https://www.example.gov.it/delibera', consultato: '2026-10-23' },
    ...parziale,
  };
}

describe('normalizza', () => {
  it('toglie accenti e apostrofi e mette in maiuscolo', () => {
    expect(normalizza("L’APE")).toBe('APE');
    expect(normalizza("L'APE")).toBe('APE');
    expect(normalizza('città')).toBe('CITTA');
    expect(normalizza('perché')).toBe('PERCHE');
  });
});

describe('calendario 2026/27', () => {
  it('tiene i 21 territori ufficiali, con fonte e date', () => {
    expect(erroriCalendario(voci, anno)).toEqual([]);
    expect(anno).toHaveLength(21);
    expect(anno.every((voce) => voce.stato === 'ufficiale' && voce.fonte?.url && voce.inizio && voce.fine)).toBe(true);
    expect(anno.find((voce) => voce.slug === 'basilicata')?.natale).toBeNull();
    expect(voci.map((voce) => voce.slug)).toContain('trento');
    expect(voci.map((voce) => voce.slug)).toContain('bolzano');
    expect(voci.find((voce) => voce.slug === 'trento')?.cartina).toBe('trentino-alto-adige');
    expect(voci.find((voce) => voce.slug === 'bolzano')?.cartina).toBe('trentino-alto-adige');
  });

  it('rifiuta un ufficiale senza fonte, una data fuori anno o la fine prima dell’inizio', () => {
    const base = voci[0] as RegioneDato;
    expect(erroriCalendario([base], [voce({ slug: base.slug, fonte: null })])).toContain(
      `${base.slug}: stato ufficiale senza fonte.url`,
    );
    expect(erroriCalendario([base], [voce({ slug: base.slug, fine: '2027-07-01' })])).toEqual([
      `${base.slug}: 2027-07-01 è fuori dal 01/09/2026–30/06/2027`,
    ]);
    expect(erroriCalendario([base], [voce({ slug: base.slug, inizio: '2027-06-10', fine: '2026-09-14' })])).toContain(
      `${base.slug}: la fine 2026-09-14 precede l’inizio 2027-06-10`,
    );
    expect(erroriCalendario(voci, anno.slice(0, 20)).some((errore) => errore.startsWith('Manca il calendario'))).toBe(
      true,
    );
  });
});

describe('festività e cartine', () => {
  it('cita la legge per il 4 ottobre e segna le giornate', () => {
    const elenco = schemaFestivita.array().parse(festivita);
    const francesco = elenco.find((voce) => voce.data === '2026-10-04');
    expect(francesco?.tipo).toBe('festa');
    expect(francesco?.stato).toBeUndefined();
    expect(francesco?.fonte).toBe('https://www.gazzettaufficiale.it/eli/id/2025/10/10/25G00153/SG');
    expect(elenco.find((voce) => voce.data === '2026-01-27')?.tipo).toBe('giornata');
    expect(elenco.find((voce) => voce.data === '2026-11-04')?.tipo).toBe('giornata');
  });

  it('dà un credit a ogni cartina', () => {
    expect(CARTINE).toHaveLength(21);
    expect(erroriCartine(CARTINE)).toEqual([]);
    expect(erroriCartine([{ ...CARTINE[0], credit: '   ' }])).toEqual(['italia: manca il credit']);
  });
});
