// @ts-check
import { writeFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/config/site.ts';
import { lastmodPagina } from './src/lib/lastmod.ts';
import { inclusaNellaSitemap } from './src/lib/noindex.ts';

function fileOpzionali() {
  return {
    name: 'file-opzionali',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const chiave = process.env.INDEXNOW_KEY?.trim();
        if (chiave && /^[A-Za-z0-9-]{8,128}$/.test(chiave)) {
          writeFileSync(new URL(`${chiave}.txt`, dir), `${chiave}\n`);
        }
        const pub = process.env.ADSENSE_PUB_ID?.trim();
        if (pub && /^pub-\d+$/.test(pub)) {
          writeFileSync(new URL('ads.txt', dir), `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    preact(),
    sitemap({
      filter: inclusaNellaSitemap,
      serialize(voce) {
        const path = new URL(voce.url).pathname;
        return { ...voce, lastmod: lastmodPagina(path) };
      },
    }),
    fileOpzionali(),
  ],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
