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
      const dest = document.querySelector(hash);
      if (!dest) return;
      event.preventDefault();
      lenis?.scrollTo(dest as HTMLElement, { offset: -80, duration: 1.4 });
      if (history.replaceState) history.replaceState(null, '', hash);
    },
    { passive: false }
  );

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
