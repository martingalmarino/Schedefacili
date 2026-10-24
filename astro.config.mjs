// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { SITE_URL } from './src/config/site.ts';
import { inclusaNellaSitemap } from './src/lib/noindex.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'static',
  integrations: [preact(), sitemap({ filter: inclusaNellaSitemap })],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
