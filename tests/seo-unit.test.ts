import { describe, expect, it } from 'vitest';
import { SITE_URL } from '../src/config/site';
import { inclusaNellaSitemap } from '../src/lib/noindex';
import { corpoRobots } from '../src/lib/robots';
import { faqPage, jsonLd } from '../src/lib/schema';
import { buildSeo } from '../src/lib/seo';

const base = {
  title: 'Schede Facili – schede didattiche e calendario scolastico',
  description: 'Calendario scolastico, tabelline e cartine mute da stampare in A4.',
  path: '/calendario-scolastico/',
  h1: 'Calendario scolastico',
};

describe('buildSeo', () => {
  it('costruisce un canonical assoluto senza query', () => {
    const seo = buildSeo({ ...base, path: '/calendario-scolastico/?q=veneto' });
    expect(seo.canonical).toBe(`${SITE_URL.replace(/\/$/, '')}/calendario-scolastico/`);
    expect(seo.canonical.includes('?')).toBe(false);
    expect(seo.robots).toBe('index, follow');
    expect(seo.keywords).toEqual([]);
  });

  it('rifiuta titolo, description o path non validi', () => {
    expect(() => buildSeo({ ...base, title: 'a'.repeat(61) })).toThrow(/Titolo/);
    expect(() => buildSeo({ ...base, description: 'a'.repeat(156) })).toThrow(/Description/);
    expect(() => buildSeo({ ...base, path: '/senza-barra' })).toThrow(/barra/);
    expect(() => buildSeo({ ...base, h1: '   ' })).toThrow(/H1/);
  });

  it('rifiuta lo schema Event', () => {
    expect(() =>
      buildSeo({
        ...base,
        schema: { '@context': 'https://schema.org', '@type': 'Event', name: 'Festa' },
      }),
    ).toThrow(/Event/);
  });
});

describe('robots e sitemap', () => {
  it('blocca localhost e vercel.app e apre il dominio di lavoro', () => {
    expect(corpoRobots('http://localhost:4321')).toContain('Disallow: /');
    expect(corpoRobots('https://schedefacili.vercel.app')).toContain('Disallow: /');
    expect(corpoRobots('https://schedefacili.com')).toContain('Allow: /');
    expect(corpoRobots('https://schedefacili.com')).toContain('Sitemap: https://schedefacili.com/sitemap-index.xml');
  });

  it('esclude dalla sitemap i path noindex', () => {
    expect(inclusaNellaSitemap('http://localhost:4321/privacy/', ['/privacy/'])).toBe(false);
    expect(inclusaNellaSitemap('http://localhost:4321/')).toBe(true);
    expect(inclusaNellaSitemap('http://localhost:4321/indice-ricerca.json')).toBe(false);
  });
});

describe('jsonLd', () => {
  it('usa lo stesso testo della FAQ visibile', () => {
    const domande = [{ domanda: 'È gratis?', risposta: 'Sì, senza registrazione.' }];
    const schema = faqPage(domande);
    const entita = schema.mainEntity[0];
    expect(entita.name).toBe(domande[0].domanda);
    expect(entita.acceptedAnswer.text).toBe(domande[0].risposta);
    expect(jsonLd(schema)).toContain('"@type":"FAQPage"');
  });
});
