import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://rooknotes.com',
  base: process.env.ASTRO_BASE || '/',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', tr: 'tr' } } })],
});
