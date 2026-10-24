import { normalizzaSiteUrl, risolviSiteUrl } from '../config/site';

export function indicizzabile(siteUrl = risolviSiteUrl()): boolean {
  if (process.env.ALLOW_INDEXING === 'true') return true;
  if (process.env.VERCEL_ENV !== 'production') return false;
  try {
    return new URL(siteUrl).hostname === 'www.schedefacili.com';
  } catch {
    return false;
  }
}

export function corpoRobots(siteUrl = risolviSiteUrl()): string {
  const origine = normalizzaSiteUrl(siteUrl);
  if (!indicizzabile(origine)) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\nSitemap: ${origine}/sitemap-index.xml\n`;
}
