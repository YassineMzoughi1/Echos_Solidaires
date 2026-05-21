import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // Hybrid: pages stay static by default; API routes opt into SSR
  // by exporting `prerender = false`.
  output: 'hybrid',
  adapter: vercel(),
  site: 'https://echos-solidaires.tn',
  prefetch: true,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    preact()
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' }
  },
  vite: {
    ssr: { noExternal: ['@studio-freight/lenis', 'gsap'] }
  }
});
