import { describe, expect, it } from 'vitest';
import { iconaLinea } from '../src/components/linea/icone';
import { ICONE_LINEA, PERIODI_PREISTORIA } from '../src/data/linea-del-tempo/preistoria';
import { svgLineaCristo } from '../src/lib/linea-cristo';
import { LARGHEZZA_STRISCIA, soluzioniPreistoria, svgCompleta, svgDaCompletare, svgDsa, tessereMescolate } from '../src/lib/linea-preistoria';
import { buildSeo } from '../src/lib/seo';
import { CARD_SCHEDE_UTILI } from '../src/lib/schede-utili';
import { PAGINE_LINEA, SEO_HUB_LINEA, SEO_PREISTORIA } from '../src/lib/testi-linea';
import { SEO_CRISTO } from '../src/lib/testi-cristo';

const VIETATE = ['anno 0', '0 a.C.', '0 d.C.', 'TODO', 'segnaposto', 'lorem', 'il 8', 'il 11'];

describe('preistoria', () => {
  it('tiene i tre periodi e le tappe che si insegnano in primaria', () => {
    expect(PERIODI_PREISTORIA.map((periodo) => periodo.titolo)).toEqual([
      'Paleolitico',
      'Mesolitico e Neolitico',
      'Età dei metalli',
    ]);
    expect(PERIODI_PREISTORIA[0]?.quando).toBe('da circa 2,5 milioni di anni fa');
    expect(PERIODI_PREISTORIA[1]?.quando).toBe('da circa 10.000 anni fa');
    expect(PERIODI_PREISTORIA[2]?.quando).toBe('rame, bronzo, ferro');
    expect(PERIODI_PREISTORIA.flatMap((periodo) => periodo.tappe.map((tappa) => tappa.didascalia))).toEqual([
      'Si scheggiano le pietre',
      'L’uomo impara a usare il fuoco',
      'Le prime pitture nelle grotte',
      'Si vive di caccia e raccolta',
      'Mesolitico: arco e frecce',
      'Neolitico: nasce l’agricoltura',
      'I primi villaggi stabili',
      'Vasi di terracotta e tessitura',
      'Età del rame: i primi attrezzi',
      'Si diffonde la ruota',
      'Bronzo e ferro: armi e aratri',
      'Con la scrittura inizia la storia',
    ]);
  });

  it('disegna ogni icona con i colori del sito, compresa la stella', () => {
    expect(ICONE_LINEA).toContain('stella');
    for (const periodo of PERIODI_PREISTORIA) {
      for (const tappa of periodo.tappe) {
        const svg = iconaLinea(tappa.icona);
        expect(svg.startsWith('<svg'), tappa.icona).toBe(true);
        expect(svg.includes('http'), tappa.icona).toBe(false);
      }
    }
    expect(iconaLinea('stella').includes('#E0A526')).toBe(true);
  });

  it('tiene le strisce da 277 mm, i punti sulla linea e le tessere mescolate', () => {
    const completa = svgCompleta();
    expect(completa.match(/data-ruolo="striscia"/g)).toHaveLength(3);
    expect(completa).toContain(`width="${LARGHEZZA_STRISCIA}"`);
    for (const trovato of completa.matchAll(/<line data-ruolo="tempo"[^>]*y1="([^"]+)"[^>]*y2="([^"]+)"/g)) {
      expect(trovato[1]).toBe(trovato[2]);
    }
    for (const punto of completa.matchAll(/<circle data-ruolo="punto"[^>]*cy="([^"]+)"/g)) {
      expect(completa).toContain(`y1="${punto[1]}"`);
    }
    const [vuota, tessere] = svgDaCompletare();
    expect(vuota).not.toContain('Si scheggiano le pietre');
    expect(vuota.match(/data-ruolo="casella"/g)).toHaveLength(12);
    expect(vuota).toContain('width="48" height="12"');
    expect(tessere).toContain('Ritaglia e incolla');
    expect(tessere).toContain('Soluzioni');
    expect(tessere.match(/data-ruolo="tessera"/g)).toHaveLength(12);
    expect(tessere).toContain('width="48" height="22"');
    const ordine = tessereMescolate().map((tessera) => tessera.id);
    expect(ordine).toEqual(tessereMescolate().map((tessera) => tessera.id));
    expect(ordine).not.toEqual(soluzioniPreistoria().flatMap((periodo, indice) => periodo.tappe.map((_, tappa) => `${['paleolitico', 'mesolitico-neolitico', 'eta-dei-metalli'][indice]}-${tappa}`)));
    const dsa = svgDsa();
    expect(dsa).toContain('Paleolitico (continua)');
    expect(dsa).toContain('font-size="4.23"');
    for (const parte of dsa.split('data-striscia="').slice(1)) {
      expect(parte.match(/data-ruolo="punto"/g)?.length ?? 0).toBeLessThanOrEqual(3);
    }
    for (const foglio of [completa, vuota, tessere, dsa]) {
      for (const trovato of foglio.matchAll(/data-ruolo="striscia"[^>]*y="([^"]+)"[^>]*height="([^"]+)"/g)) {
        expect(Number(trovato[1]) + Number(trovato[2])).toBeLessThanOrEqual(194);
      }
    }
    expect(svgLineaCristo()).not.toMatch(/>0</);
    expect(svgLineaCristo()).not.toContain('anno 0');
    expect(svgLineaCristo()).toContain('nascita di Cristo (convenzione)');
  });

  it('conta le due schede della linea del tempo dai dati', () => {
    const card = CARD_SCHEDE_UTILI.find((voce) => voce.href === '/linea-del-tempo/');
    expect(PAGINE_LINEA).toHaveLength(2);
    expect(card?.conteggio).toBe(PAGINE_LINEA.length);
  });

  it('tiene title e meta dentro i limiti', () => {
    for (const voce of [SEO_HUB_LINEA, SEO_PREISTORIA, SEO_CRISTO]) {
      expect(voce.title.length).toBeLessThanOrEqual(60);
      expect(voce.description.length).toBeLessThanOrEqual(155);
      buildSeo({ title: voce.title, description: voce.description, path: '/linea-del-tempo/', h1: voce.h1 });
    }
  });

  it('non mette note interne nelle didascalie', () => {
    const testo = PERIODI_PREISTORIA.flatMap((periodo) => [
      periodo.titolo,
      periodo.quando,
      ...periodo.tappe.map((tappa) => tappa.didascalia),
    ]).join(' ');
    for (const parola of VIETATE) expect(testo.includes(parola), parola).toBe(false);
  });
});
