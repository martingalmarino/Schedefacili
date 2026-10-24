import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { annunciAccesi } from '../src/lib/annunci';
import { conteggioPagineCartine } from '../src/lib/cartine-pagine';
import { filtraIndice, INDICE } from '../src/lib/indice-ricerca';
import { inclusaNellaSitemap } from '../src/lib/noindex';
import { website } from '../src/lib/schema';
import { NUMERI_TABELLINE } from '../src/lib/tabelline';
import { REGIONI } from '../src/data/regioni';

const META_HOME =
  'Schede didattiche gratuite per la scuola primaria: calendario scolastico 2026/27 per regione, tabelline anche DSA, crucipuzzle e cartine mute da stampare.';

describe('home e ricerca', () => {
  it('tiene la meta della home dentro il limite e i conteggi dai dati', () => {
    expect(META_HOME.length).toBeLessThanOrEqual(155);
    expect(REGIONI.length).toBe(21);
    expect(conteggioPagineCartine()).toBe(21);
    expect(NUMERI_TABELLINE.length).toBe(10);
    expect(website().potentialAction).toBeUndefined();
  });

  it('trova la tabellina del 7 e la cartina della Lombardia', () => {
    const tabellina = filtraIndice(INDICE, 'tabellina del 7');
    expect(tabellina[0]?.href).toBe('/tabelline/tabellina-del-7/');
    const carta = filtraIndice(INDICE, 'cartina muta Lombardia');
    expect(carta[0]?.href).toBe('/cartine-mute/regioni/lombardia/');
    expect(filtraIndice(INDICE, '   ')).toEqual([]);
  });

  it('indicizza le pagine del sito e non le rotte della fase 2', () => {
    const href = INDICE.map((voce) => voce.href);
    expect(href).toContain('/privacy/');
    expect(href).toContain('/cookie/');
    expect(href).toContain('/crucipuzzle/animali/');
    expect(href.some((voce) => voce.includes('/ricorrenze/') || voce.includes('/europa/'))).toBe(false);
    expect(new Set(href).size).toBe(href.length);
  });
});

describe('annunci', () => {
  it('resta spento senza CMP, senza flag o con il segnaposto', () => {
    expect(annunciAccesi({ enabled: 'true', client: 'ca-pub-1', cmpAttiva: false })).toBe(false);
    expect(annunciAccesi({ enabled: 'false', client: 'ca-pub-1', cmpAttiva: true })).toBe(false);
    expect(annunciAccesi({ enabled: 'true', client: '[ADSENSE_CLIENT_ID]', cmpAttiva: true })).toBe(false);
    expect(annunciAccesi({ enabled: 'true', client: 'ca-pub-123', cmpAttiva: true })).toBe(true);
  });
});

describe('pagine istituzionali', () => {
  const privacy = readFileSync('src/pages/privacy.astro', 'utf8');
  const cookie = readFileSync('src/pages/cookie.astro', 'utf8');
  const contatti = readFileSync('src/pages/contatti.astro', 'utf8');
  const consenso = readFileSync('src/components/Consenso.astro', 'utf8');

  it('la privacy resta una bozza con i segnaposto e il Garante', () => {
    const sito = readFileSync('src/config/site.ts', 'utf8');
    const modello = readFileSync('src/layouts/PaginaLegale.astro', 'utf8');
    const testo = privacy.replace(/\s+/g, ' ');
    expect(privacy).toContain('bozza');
    expect(modello).toContain('Bozza: testo da far verificare a un legale');
    expect(sito).toContain("export const TITOLARE = '[TITOLARE]'");
    expect(sito).toContain("export const EMAIL = '[EMAIL_CONTATTO]'");
    expect(testo).toContain('{TITOLARE}');
    expect(testo).toContain('{EMAIL}');
    expect(testo).toContain('[CMP]');
    expect(testo).toContain('art. 6, par. 1, lett. a');
    expect(testo).toContain('interesse legittimo');
    expect(testo).toContain('decisione di adeguatezza');
    expect(testo).toContain('Data Privacy Framework');
    expect(testo).toContain('«da verificare con un legale»');
    expect(testo).toContain('artt. 15–22');
    expect(testo).toContain('Garante per la protezione dei dati personali');
  });

  it('i cookie citano la CMP e il Consent Mode, e i contatti non hanno un modulo', () => {
    expect(cookie).toContain('[CMP]');
    expect(cookie).toContain('ad_storage');
    expect(cookie).toContain('data-riapri-consenso');
    expect(contatti).not.toContain('<form');
    expect(consenso).toContain("ad_storage: 'denied'");
    expect(consenso).toContain("ad_user_data: 'denied'");
    expect(consenso).toContain("ad_personalization: 'denied'");
    expect(consenso).toContain("analytics_storage: 'denied'");
    expect(consenso).toContain('wait_for_update: 500');
  });

  it('tiene l’indice json fuori dalla sitemap', () => {
    expect(inclusaNellaSitemap('http://localhost:4321/indice-ricerca.json')).toBe(false);
  });
});
