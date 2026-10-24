const host = 'www.schedefacili.com';
const chiave = process.env.INDEXNOW_KEY?.trim();

if (!chiave) {
  console.error('Manca INDEXNOW_KEY. Lo script non parte dal build.');
  process.exit(1);
}

async function loc(url) {
  const risposta = await fetch(url);
  if (!risposta.ok) throw new Error(`Sitemap non letta: ${url} (${risposta.status})`);
  const xml = await risposta.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((trovato) => trovato[1]);
}

const indice = await loc(`https://${host}/sitemap-index.xml`);
const pagine = [];
for (const url of indice) {
  if (url.endsWith('.xml')) pagine.push(...(await loc(url)));
  else pagine.push(url);
}

const uniche = [...new Set(pagine)];
const risposta = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key: chiave,
    keyLocation: `https://${host}/${chiave}.txt`,
    urlList: uniche,
  }),
});

if (!risposta.ok) {
  console.error(`IndexNow ha risposto ${risposta.status}`);
  process.exit(1);
}

console.log(`IndexNow: inviate ${uniche.length} URL.`);
