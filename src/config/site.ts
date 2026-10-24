export const SITE_NAME = 'Schede Facili';
export const EMAIL = '[EMAIL_CONTATTO]';
export const TITOLARE = '[TITOLARE]';
export const ANNO = '2026/27';
export const ANNO_SLUG = '2026-2027';

const DOMINIO = 'https://www.schedefacili.com';
const LOCALE = 'http://localhost:4321';

function leggiVariabile(nome: string): string | undefined {
  const processo = process.env[nome];
  if (typeof processo === 'string' && processo.trim()) return processo.trim();
  const vite = (import.meta.env as Record<string, string | undefined> | undefined)?.[nome];
  if (typeof vite === 'string' && vite.trim()) return vite.trim();
  return undefined;
}

export function buildDiProduzione(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

export function normalizzaSiteUrl(valore: string): string {
  let url: URL;
  try {
    url = new URL(valore);
  } catch {
    throw new Error(`SITE_URL non è un indirizzo valido: ${valore}`);
  }
  if (!url.hostname) throw new Error(`SITE_URL senza host: ${valore}`);
  return url.origin;
}

function validoInProduzione(origine: string): boolean {
  let url: URL;
  try {
    url = new URL(origine);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  const host = url.hostname.toLowerCase();
  if (!host.includes('.')) return false;
  if (host === 'localhost' || host.endsWith('.localhost') || host === '127.0.0.1' || host === '::1') return false;
  return true;
}

export function risolviSiteUrl(): string {
  const esplicito = leggiVariabile('SITE_URL');
  const origine = esplicito
    ? normalizzaSiteUrl(esplicito)
    : process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
      ? DOMINIO
      : LOCALE;
  if (buildDiProduzione() && !validoInProduzione(origine)) {
    throw new Error(
      `SITE_URL non valido in produzione (${origine}). Atteso un https:// con host reale, per esempio ${DOMINIO}.`,
    );
  }
  return origine;
}

export const SITE_URL = risolviSiteUrl();

const VERIFICA_GOOGLE = 'kV19ZVlEIXIDmRPxdbW4rUPeXgDsXah2-gLAHXC5GHI';

export function metaVerifica(): { google?: string; bing?: string } {
  const google = leggiVariabile('GOOGLE_SITE_VERIFICATION') ?? VERIFICA_GOOGLE;
  const bing = leggiVariabile('BING_SITE_VERIFICATION');
  return { google, bing };
}
