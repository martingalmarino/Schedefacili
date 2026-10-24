import { describe, expect, it } from 'vitest';
import calendarioJson from '../src/data/calendario/2026-2027.json';
import { REGIONI } from '../src/data/regioni';
import { schemaCalendario } from '../src/data/schemi';
import {
  conArticolo,
  descrizioneRegione,
  faqRegione,
  festeNazionali,
  giornoSettimana,
  h1Regione,
  inRegione,
  pontiPossibili,
  SEO_HUB,
  SEO_NAZIONALE,
  SEO_PONTI,
  titoloRegione,
  type VoceFesta,
} from '../src/lib/calendario';

const calendario = schemaCalendario.parse(calendarioJson);

function festa(data: string, nome: string): VoceFesta {
  return { data, nome, fonte: 'https://www.normattiva.it/', tipo: 'Festa nazionale' };
}

describe('preposizioni e SEO delle regioni', () => {
  it('usa l’articolo giusto negli esempi del passo', () => {
    expect(conArticolo('veneto', 'Veneto')).toBe('del Veneto');
    expect(conArticolo('lombardia', 'Lombardia')).toBe('della Lombardia');
    expect(conArticolo('abruzzo', 'Abruzzo')).toBe('dell’Abruzzo');
    expect(conArticolo('marche', 'Marche')).toBe('delle Marche');
    expect(conArticolo('valle-d-aosta', 'Valle d’Aosta')).toBe('della Valle d’Aosta');
    expect(conArticolo('trento', 'Provincia autonoma di Trento')).toBe('della Provincia autonoma di Trento');
    expect(h1Regione('veneto', 'Veneto')).toBe('Calendario scolastico 2026/2027 del Veneto');
    expect(inRegione('marche', 'Marche')).toBe('nelle Marche');
    expect(inRegione('veneto', 'Veneto')).toBe('in Veneto');
  });

  it('tiene titoli e descrizioni dentro i limiti, per tutte le pagine', () => {
    for (const regione of REGIONI) {
      expect(titoloRegione(regione.nome).length, regione.slug).toBeLessThanOrEqual(60);
      expect(descrizioneRegione(inRegione(regione.slug, regione.nome)).length, regione.slug).toBeLessThanOrEqual(155);
    }
    expect(descrizioneRegione('in Veneto')).toBe(
      'Quando inizia e finisce la scuola in Veneto nel 2026/27: vacanze di Natale e Pasqua, ponti e festività. Calendario da stampare in A4.',
    );
    for (const pagina of [SEO_HUB, SEO_NAZIONALE, SEO_PONTI]) {
      expect(pagina.title.length).toBeLessThanOrEqual(60);
      expect(pagina.description.length).toBeLessThanOrEqual(155);
      expect(pagina.h1.length).toBeGreaterThan(0);
    }
  });
});

describe('feste e ponti', () => {
  it('riconosce giovedì e martedì', () => {
    expect(giornoSettimana('2026-01-01')).toBe(4);
    expect(giornoSettimana('2026-01-06')).toBe(2);
    expect(pontiPossibili([festa('2026-10-04', 'Domenica')])).toEqual([]);
  });

  it('propone il venerdì dopo un giovedì e il lunedì prima di un martedì', () => {
    const ponti = pontiPossibili([festa('2026-10-01', 'Giovedì'), festa('2026-10-06', 'Martedì')]);
    expect(ponti.map((ponte) => ponte.data)).toEqual(['2026-10-02', '2026-10-05']);
    expect(ponti.every((ponte) => ponte.tipo === 'Ponte possibile')).toBe(true);
  });

  it('non tratta una giornata come giorno senza lezione', () => {
    expect(festeNazionali().some((festa) => festa.nome === 'Giorno della Memoria')).toBe(false);
    expect(festeNazionali().some((festa) => festa.data === '2026-10-04')).toBe(true);
  });
});

describe('date ufficiali', () => {
  it('pubblica le 21 regioni con fonte e non inventa il Natale della Basilicata', () => {
    expect(calendario.voci).toHaveLength(21);
    for (const regione of REGIONI) {
      const voce = calendario.voci.find((altra) => altra.slug === regione.slug);
      expect(voce?.stato, regione.slug).toBe('ufficiale');
      expect(voce?.fonte?.url, regione.slug).toMatch(/^https:\/\//);
      expect(voce?.inizio, regione.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    const basilicata = REGIONI.find((regione) => regione.slug === 'basilicata');
    const voceBasilicata = calendario.voci.find((voce) => voce.slug === 'basilicata');
    expect(voceBasilicata?.natale).toBeNull();
    const rispostaNatale = faqRegione(basilicata!, voceBasilicata!)[1].risposta;
    expect(rispostaNatale.toLowerCase()).toContain('non');
    expect(rispostaNatale).not.toMatch(/\d{1,2} (gennaio|febbraio|marzo|aprile|maggio|giugno|settembre|ottobre|novembre|dicembre)/);
  });
});
