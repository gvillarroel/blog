import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';

import { diagramFences } from './src/remark/diagram-fences.mjs';

const site = process.env.SITE_URL ?? 'https://gvillarroel.github.io';
const base = process.env.BASE_PATH ?? '/blog';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  markdown: {
    processor: unified({ remarkPlugins: [diagramFences] }),
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      // Mermaid is deliberately lazy-loaded as a complete diagram-language bundle.
      chunkSizeWarningLimit: 700,
    },
  },
});
