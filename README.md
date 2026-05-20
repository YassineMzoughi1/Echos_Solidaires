# Échos Solidaires 2026

Single-page editorial site for the **Échos Solidaires 2026** event — Nefta, Tunisie, 26–27 avril 2027.

Built with Astro 4 + TypeScript + Tailwind, GSAP 3 / ScrollTrigger / FLIP for animation, Lenis for smooth scroll, and `astro:assets`-grade image handling via Sharp. French only, anchor-navigated, fully reduced-motion safe.

## Develop

```bash
npm install
npm run dev          # http://localhost:4321
```

## Build & preview

```bash
npm run build        # static output → dist/
npm run preview      # serves dist/
```

## Type-check

```bash
npx astro check
```

## Deploy

Static output works on any host. Vercel-ready out of the box — push the repo and let it auto-detect Astro. No `vercel.json` needed.

## Assets

Drop assets into `public/`:

- `hero.mp4` — looped autoplay video (optional; falls back to `hero-poster.{jpg,svg}` if missing)
- `hero-poster.jpg` — LCP fallback / video poster
- `about.jpg`, `images/programme-*.jpg`, `images/axe-*.jpg`, `images/gallery-*.jpg` — page imagery
- `og.png` — generated 1200×630 social card (regenerate from the SVG composition if branding changes)

Missing images are replaced at render time by a brand-tinted SVG placeholder (`ImageOrPlaceholder.astro`) so layout never breaks during development.

## Notes

- Forms log the payload to `console` and reveal a success card. Wire to Resend / Formspree / a serverless route via the `// TODO: wire to backend` comment in `src/lib/animations.ts`.
- All motion is gated behind `prefers-reduced-motion: reduce`. Test it.
