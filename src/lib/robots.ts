export function corpoRobots(siteUrl: string): string {
  const origine = siteUrl.replace(/\/$/, '');
  const bloccato = origine.includes('localhost') || origine.includes('vercel.app');
  const direttiva = bloccato ? 'Disallow: /' : 'Allow: /';
  return `User-agent: *\n${direttiva}\nSitemap: ${origine}/sitemap-index.xml\n`;
}
