// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import gong from './src/plugins/gong.mjs';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { remarkPlugins: [gong] },
});
