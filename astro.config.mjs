// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import gong from './src/plugins/gong.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://szutra.digitalhumanities.hu',
  adapter: cloudflare(),
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { remarkPlugins: [gong] },
});
