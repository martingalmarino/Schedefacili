import { SITE_NAME, SITE_URL } from '../config/site';

export interface VoceBreadcrumb {
  nome: string;
  href: string;
}

export interface VoceFaq {
  domanda: string;
  risposta: string;
}

function baseUrl(): string {
  return SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;
}

export function urlAssoluto(path: string): string {
  return new URL(path, baseUrl()).href;
}

export function jsonLd(dato: unknown): string {
  const testo = JSON.stringify(dato).replace(/</g, '\\u003c');
  if (/"@type":"Event"/.test(testo)) {
    throw new Error('Il tipo schema.org Event è vietato');
  }
  return testo;
}

export function website(conRicerca = false) {
  const dato: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: urlAssoluto('/'),
    inLanguage: 'it-IT',
  };
  if (conRicerca) {
    dato.potentialAction = {
      '@type': 'SearchAction',
      target: `${urlAssoluto('/cerca/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }
  return dato;
}

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: urlAssoluto('/'),
  };
}

export function breadcrumb(voci: VoceBreadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: voci.map((voce, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: voce.nome,
      item: urlAssoluto(voce.href),
    })),
  };
}

export function faqPage(domande: VoceFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: domande.map((voce) => ({
      '@type': 'Question',
      name: voce.domanda,
      acceptedAnswer: {
        '@type': 'Answer',
        text: voce.risposta,
      },
    })),
  };
}

export function webPage(input: { path: string; name: string; description?: string; dateModified: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url: urlAssoluto(input.path),
    inLanguage: 'it-IT',
    dateModified: input.dateModified,
  };
}

export function learningResource(input: {
  nome: string;
  descrizione: string;
  url: string;
  educationalLevel?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: input.nome,
    description: input.descrizione,
    url: input.url,
    educationalLevel: input.educationalLevel,
    inLanguage: 'it-IT',
    isAccessibleForFree: true,
  };
}

export function webApplication(input: { nome: string; descrizione: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.nome,
    description: input.descrizione,
    url: input.url,
    applicationCategory: 'EducationalApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    inLanguage: 'it-IT',
  };
}

export function imageObject(input: {
  url: string;
  license: string;
  creditText: string;
  nome?: string;
  acquireLicensePage?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: input.url,
    license: input.license,
    creditText: input.creditText,
    name: input.nome,
    acquireLicensePage: input.acquireLicensePage,
  };
}

export function dataset(input: { nome: string; descrizione: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: input.nome,
    description: input.descrizione,
    url: input.url,
    inLanguage: 'it-IT',
  };
}
