import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';

export default defineConfig({
  output: 'static',
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
