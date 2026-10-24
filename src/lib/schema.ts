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

export function urlAssoluta(path: string): string {
  const senzaQuery = path.split('?')[0]?.split('#')[0] ?? path;
  const assoluto = senzaQuery.startsWith('/') ? senzaQuery : `/${senzaQuery}`;
  const eFile = /\.[a-z0-9]+$/i.test(assoluto);
  const pagina = eFile || assoluto.endsWith('/') ? assoluto : `${assoluto}/`;
  const url = new URL(pagina, baseUrl());
  url.search = '';
  url.hash = '';
  return url.href;
}

export function urlAssoluto(path: string): string {
  return urlAssoluta(path);
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
    '@id': `${urlAssoluta('/')}#website`,
    name: SITE_NAME,
    url: urlAssoluta('/'),
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
    '@id': `${urlAssoluta('/')}#organization`,
    name: SITE_NAME,
    url: urlAssoluta('/'),
  };
}

export function breadcrumb(voci: VoceBreadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${urlAssoluta(voci.at(-1)?.href ?? '/')}#breadcrumb`,
    itemListElement: voci.map((voce, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: voce.nome,
      item: urlAssoluta(voce.href),
    })),
  };
}

export function faqPage(domande: VoceFaq[], path?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(path ? { '@id': `${urlAssoluta(path)}#faq` } : {}),
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
    '@id': urlAssoluta(input.path),
    name: input.name,
    description: input.description,
    url: urlAssoluta(input.path),
    inLanguage: 'it-IT',
    dateModified: input.dateModified,
  };
}

export function learningResource(input: {
  nome: string;
  descrizione: string;
  url: string;
  educationalLevel?: string;
  learningResourceType?: string;
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
    ...(input.learningResourceType ? { learningResourceType: input.learningResourceType } : {}),
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

export function howTo(input: {
  path: string;
  nome: string;
  passi: { nome: string; testo: string }[];
  materiali?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${urlAssoluta(input.path)}#come-stampare`,
    name: input.nome,
    inLanguage: 'it-IT',
    ...(input.materiali?.length
      ? { supply: input.materiali.map((nome) => ({ '@type': 'HowToSupply', name: nome })) }
      : {}),
    step: input.passi.map((passo, indice) => ({
      '@type': 'HowToStep',
      position: indice + 1,
      name: passo.nome,
      text: passo.testo,
    })),
  };
}

export function itemList(input: { path: string; nome: string; elementi: { nome: string; url: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${urlAssoluta(input.path)}#elenco`,
    name: input.nome,
    itemListElement: input.elementi.map((elemento, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: elemento.nome,
      url: urlAssoluta(elemento.url),
    })),
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
