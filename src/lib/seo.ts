import { SITE_URL } from '../config/site';

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  h1: string;
  keywords?: string[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
  image?: string;
}

export interface SeoResult {
  title: string;
  description: string;
  path: string;
  canonical: string;
  h1: string;
  keywords: string[];
  noindex: boolean;
  image: string;
  schema: Record<string, unknown>[];
  robots: string;
}

const TITOLO_MAX = 60;
const DESCRIZIONE_MAX = 155;

function baseUrl(): string {
  return SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;
}

export function buildSeo(input: SeoInput): SeoResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const h1 = input.h1.trim();

  if (title.length > TITOLO_MAX) {
    throw new Error(`Titolo troppo lungo (${title.length} > ${TITOLO_MAX}): ${title}`);
  }
  if (description.length > DESCRIZIONE_MAX) {
    throw new Error(`Description troppo lunga (${description.length} > ${DESCRIZIONE_MAX})`);
  }
  if (!h1) {
    throw new Error('Manca l’H1');
  }

  const senzaQuery = input.path.split('?')[0]?.split('#')[0] ?? input.path;
  const path = senzaQuery.startsWith('/') ? senzaQuery : `/${senzaQuery}`;
  if (!path.endsWith('/')) {
    throw new Error(`Il path deve finire con la barra: ${path}`);
  }

  const canonicalUrl = new URL(path, baseUrl());
  canonicalUrl.search = '';
  canonicalUrl.hash = '';

  const imageUrl = new URL(input.image ?? '/og/default.png', baseUrl());
  imageUrl.search = '';
  imageUrl.hash = '';

  const schema = input.schema ? (Array.isArray(input.schema) ? input.schema : [input.schema]) : [];
  if (/"@type":"Event"/.test(JSON.stringify(schema))) {
    throw new Error('Il tipo schema.org Event è vietato');
  }

  return {
    title,
    description,
    path,
    canonical: canonicalUrl.href,
    h1,
    keywords: input.keywords ?? [],
    noindex: Boolean(input.noindex),
    image: imageUrl.href,
    schema,
    robots: input.noindex ? 'noindex, nofollow' : 'index, follow',
  };
}
