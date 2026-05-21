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

// Scroll to whatever hash sits in the URL — used both on initial Lenis boot
// and after every Astro view transition (e.g. landing on "/#a-propos" from
// the inscription page).
function scrollToCurrentHash(immediate = false) {
  const hash = window.location.hash;
  if (!hash || hash === '#') return;
  const dest = document.querySelector(hash) as HTMLElement | null;
  if (!dest) return;
  const destTop = dest.getBoundingClientRect().top + window.scrollY;
  const targetY = Math.max(0, destTop - 80);
  if (lenis) {
    lenis.scrollTo(targetY, { duration: immediate ? 0 : 1.2, immediate });
  } else {
    window.scrollTo({ top: targetY, behavior: immediate ? 'auto' : 'smooth' });
  }
}

export function initLenis(): Lenis | null {
  if (typeof window === 'undefined' || initialized) {
    // Page already booted — but a fresh view transition may have landed on a
    // new hash; honor it.
    if (initialized) scrollToCurrentHash();
    return lenis;
  }
  initialized = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    // Native scroll path: still honor the URL hash on first load.
    scrollToCurrentHash(true);
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

  // First-load scroll: honor the URL hash once layout has settled.
  requestAnimationFrame(() => scrollToCurrentHash(true));

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}
