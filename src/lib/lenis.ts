/**
 * Single source of truth for smooth scroll + GSAP ticker.
 * Reduced-motion users skip Lenis entirely (native scroll).
 */
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let initialized = false;

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined' || initialized) return lenis;
  initialized = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    return null;
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false
  } as any);

  // Bridge Lenis → GSAP ticker, single RAF loop.
  gsap.ticker.add((time: number) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Keep ScrollTrigger in sync when Lenis scrolls.
  lenis.on('scroll', ScrollTrigger.update);

  // Anchor link interception — smooth scroll all #anchors.
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      // Logo (or any [data-scroll-top]) goes to the absolute top, not to the hashed section.
      if (link.hasAttribute('data-logo') || link.hasAttribute('data-scroll-top')) {
        event.preventDefault();
        lenis?.scrollTo(0, { duration: 1.4 });
        if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
        return;
      }
      const dest = document.querySelector(hash) as HTMLElement | null;
      if (!dest) return;
      event.preventDefault();
      // Compute absolute target Y manually and clamp at 0 — passing a
      // negative offset to lenis.scrollTo(element, …) for a section that
      // already sits at the document top (e.g. logo → #accueil) leaves
      // the scroll stuck short of the real top.
      const destTop = dest.getBoundingClientRect().top + window.scrollY;
      const targetY = Math.max(0, destTop - 80);
      lenis?.scrollTo(targetY, { duration: 1.4 });
      if (history.replaceState) history.replaceState(null, '', hash);
    },
    { passive: false }
  );

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
