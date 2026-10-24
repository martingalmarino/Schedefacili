export const PERCORSI_NOINDEX: string[] = [];

export function inclusaNellaSitemap(pagina: string, esclusi: string[] = PERCORSI_NOINDEX): boolean {
  const path = new URL(pagina).pathname;
  if (path.endsWith('.json') || path.endsWith('.txt')) return false;
  return !esclusi.includes(path);
}
