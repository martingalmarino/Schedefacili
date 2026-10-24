import { readFileSync } from 'node:fs';

const host = 'www.schedefacili.com';
const chiave = process.env.INDEXNOW_KEY?.trim();
const urlNuove = JSON.parse(readFileSync(new URL('../src/data/url-nuove.json', import.meta.url), 'utf8'));

if (process.env.VERCEL_ENV !== 'production') {
  console.log('IndexNow: salto, non è il deploy di produzione.');
  process.exit(0);
}

if (!chiave) {
  console.error('Manca INDEXNOW_KEY. Lo script non parte dal build.');
  process.exit(1);
}

const uniche = urlNuove.map((path) => `https://${host}${path}`);
if (uniche.some((url) => url.includes('?'))) {
  console.error('IndexNow: le URL nuove non possono avere parametri.');
  process.exit(1);
}
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
