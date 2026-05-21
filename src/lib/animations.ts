/**
 * Animation utilities — letter-split, word-split, count-up, scroll reveals,
 * horizontal-pin, FLIP gallery, programme-tab cross-fade, nav active state,
 * scroll-aware nav border, hero load sequence, stats counter.
 *
 * IMPORTANT: every entrance animation is REPEATABLE. Each ScrollTrigger
 * resets its target on leave (forward or back) and replays on enter
 * (forward or back). One ScrollTrigger instance per element — no nested
 * timelines — so sustained up/down scrolling stays >60fps.
 *
 * Reduced-motion still wins: when `prefers-reduced-motion: reduce`, every
 * reveal renders in its final state immediately and no scroll triggers
 * are created.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

const reducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Letter split — replaces text with per-char spans ---------- */
export function letterSplit(el: HTMLElement) {
  const original = el.getAttribute('data-original') ?? el.textContent ?? '';
  el.setAttribute('data-original', original);
  el.setAttribute('aria-label', original);
  el.textContent = '';
  const words = original.split(' ');
  words.forEach((word, wi) => {
    const wrap = document.createElement('span');
    wrap.className = 'split-line';
    wrap.setAttribute('aria-hidden', 'true');
    [...word].forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = ch;
      wrap.appendChild(span);
    });
    el.appendChild(wrap);
    if (wi < words.length - 1) {
      const space = document.createElement('span');
      space.className = 'split-char';
      space.textContent = ' ';
      el.appendChild(space);
    }
  });
  return el.querySelectorAll<HTMLElement>('.split-char');
}

/* ---------- Word split ---------- */
export function wordSplit(el: HTMLElement) {
  const original = el.getAttribute('data-original') ?? el.textContent ?? '';
  el.setAttribute('data-original', original);
  el.setAttribute('aria-label', original);
  el.textContent = '';
  const words = original.split(/\s+/);
  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'split-line';
    wrap.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'split-word';
    inner.textContent = word;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return el.querySelectorAll<HTMLElement>('.split-word');
}

/* ---------- Hero load sequence ----------
   Directional rule (down-only): the hero plays once on first paint. When
   the user later scrolls DOWN past it, we reset (so the next downward
   re-entry — e.g. anchor-link back to #accueil — animates fresh). When
   the user simply scrolls UP back into the hero we do nothing — the
   headline stays intact, no glitchy backward replay. */
export function heroIntro(root: HTMLElement) {
  const eyebrow  = root.querySelector<HTMLElement>('[data-hero-eyebrow]');
  const headline = root.querySelector<HTMLElement>('[data-hero-headline]');
  const sub      = root.querySelector<HTMLElement>('[data-hero-sub]');
  const playBtn  = root.querySelector<HTMLElement>('[data-hero-play]');
  const rule     = root.querySelector<HTMLElement>('[data-hero-rule]');
  const video    = root.querySelector<HTMLElement>('[data-hero-video]');

  if (reducedMotion()) {
    root.querySelectorAll<HTMLElement>('[data-hero-anim]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const chars = headline
    ? (Array.from(letterSplit(headline)) as HTMLElement[])
    : [];

  const reset = () => {
    if (eyebrow)      gsap.set(eyebrow,  { opacity: 0, y: 12 });
    if (chars.length) gsap.set(chars,    { opacity: 0, y: 30, rotateX: -30, transformOrigin: '50% 50% -20' });
    if (sub)          gsap.set(sub,      { opacity: 0, y: 16 });
    if (playBtn)      gsap.set(playBtn,  { opacity: 0, y: 12 });
    if (rule)         gsap.set(rule,     { scaleY: 0, transformOrigin: 'top center' });
    if (video)        gsap.set(video,    { opacity: 0.4 });
  };

  const play = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' as const } });
    if (eyebrow)      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
    if (chars.length) tl.to(chars,   { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.03 }, '-=0.2');
    if (sub)          tl.to(sub,     { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
    if (playBtn)      tl.to(playBtn, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
    if (rule)         tl.to(rule,    { scaleY: 1, duration: 1.5, ease: 'power2.out' }, '-=0.5');
    if (video)        gsap.to(video, { opacity: 1, duration: 2, ease: 'power2.out', overwrite: 'auto' });
  };

  reset();
  play(); // initial page-load entrance

  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom 15%',
    onEnter:     () => { reset(); play(); }, // rare: anchor-back to #accueil from below
    onLeave:     reset,                       // scrolled DOWN past hero → reset so a future onEnter is fresh
    onEnterBack: () => {},                    // scrolling UP back to hero → leave intact, no glitchy replay
    onLeaveBack: () => {}
  });
}

/* ---------- Generic reveal helpers (repeatable) ---------- */
const playUp = (target: gsap.TweenTarget, staggerMs = 0) =>
  gsap.to(target, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: staggerMs / 1000,
    overwrite: 'auto'
  });
const resetUp = (target: gsap.TweenTarget) =>
  gsap.set(target, { opacity: 0, y: 24 });

const playScale = (target: gsap.TweenTarget) =>
  gsap.to(target, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'power3.out',
    overwrite: 'auto'
  });
const resetScale = (target: gsap.TweenTarget) =>
  gsap.set(target, { opacity: 0, scale: 0.95 });

/* ---------- Scroll reveals (DOWN-ONLY directional) ----------
   Rule: animate on first downward entry. When the element exits the
   viewport off the TOP (user scrolled past it going down) → reset, so a
   future downward re-entry replays from scratch. Scrolling UP into or
   past an element does nothing — onEnterBack and onLeaveBack are noops.
   Result: always animate forward, never backward. */
export function initReveals() {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-scale]')
  );

  if (reducedMotion()) {
    targets.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  targets.forEach((el) => {
    const isScale = el.hasAttribute('data-reveal-scale');
    const staggerMs = Number(el.dataset.revealStagger ?? '0');

    if (isScale) {
      resetScale(el);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter:     () => playScale(el),
        onLeave:     () => resetScale(el),
        onEnterBack: () => gsap.set(el, { opacity: 1, scale: 1 }),
        onLeaveBack: () => {}
      });
      return;
    }

    if (staggerMs > 0) {
      const children = Array.from(el.children) as HTMLElement[];
      gsap.set(el, { opacity: 1, y: 0 });
      resetUp(children);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'bottom 15%',
        onEnter:     () => playUp(children, staggerMs),
        onLeave:     () => resetUp(children),
        onEnterBack: () => gsap.set(children, { opacity: 1, y: 0 }),
        onLeaveBack: () => {}
      });
      return;
    }

    resetUp(el);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter:     () => playUp(el),
      onLeave:     () => resetUp(el),
      onEnterBack: () => gsap.set(el, { opacity: 1, y: 0 }),
      onLeaveBack: () => {}
    });
  });
}

/* ---------- Word-by-word paragraph reveal (DOWN-ONLY) ---------- */
export function initWordReveals() {
  const paras = Array.from(
    document.querySelectorAll<HTMLElement>('[data-word-reveal]')
  );

  if (reducedMotion()) {
    paras.forEach((p) => {
      p.style.opacity = '1';
    });
    return;
  }

  paras.forEach((p) => {
    const words = Array.from(wordSplit(p)) as HTMLElement[];
    p.style.opacity = '1';
    gsap.set(words, { opacity: 0, y: 12 });

    const play = () =>
      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.015,
        overwrite: 'auto'
      });
    const reset = () => gsap.set(words, { opacity: 0, y: 12 });

    ScrollTrigger.create({
      trigger: p,
      start: 'top 80%',
      end: 'bottom 15%',
      onEnter:     play,
      onLeave:     reset,
      onEnterBack: () => gsap.set(words, { opacity: 1, y: 0 }),
      onLeaveBack: () => {}
    });
  });
}

/* ---------- Count-up stats (DOWN-ONLY) ----------
   Count up on downward entry. Reset to 0 when scrolled past going down so
   the next downward entry counts fresh. Scrolling UP past the stats bar
   leaves the numbers at their final value — no reset, no replay. */
export function initCountUps() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? '0');

    if (reducedMotion()) {
      el.textContent = String(target);
      return;
    }

    let raf = 0;
    const reset = () => {
      cancelAnimationFrame(raf);
      el.textContent = '0';
    };
    const play = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const duration = 1500;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = Math.floor(target * ease(p)).toString();
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      end: 'bottom 15%',
      onEnter:     play,
      onLeave:     reset,
      onEnterBack: () => {
        cancelAnimationFrame(raf);
        el.textContent = String(target);
      },
      onLeaveBack: () => {}
    });
  });
}

/* ---------- Nav: scroll-aware border + active section underline ---------- */
export function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 80);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  );
  const targets = links
    .map((a) => {
      const id = a.getAttribute('href')!.slice(1);
      const sec = document.getElementById(id);
      return sec ? { link: a, section: sec } : null;
    })
    .filter(Boolean) as { link: HTMLAnchorElement; section: HTMLElement }[];

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          targets.forEach(({ link }) => link.classList.remove('is-active'));
          const match = targets.find((t) => t.section === entry.target);
          if (match) match.link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  targets.forEach(({ section }) => observer.observe(section));
}

/* ---------- Mobile menu ---------- */
export function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;
  const open = () => {
    menu.dataset.open = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (!reducedMotion()) {
      gsap.fromTo(
        menu.querySelectorAll('[data-menu-item]'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: 0.1 }
      );
    }
  };
  const close = () => {
    menu.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  toggle.addEventListener('click', () => {
    menu.dataset.open === 'true' ? close() : open();
  });
  menu.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('a')) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ---------- Programme tab cross-fade ---------- */
export function initProgrammeTabs() {
  const root = document.querySelector<HTMLElement>('[data-programme]');
  if (!root) return;
  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-day-tab]')
  );
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-day-panel]')
  );
  const underline = root.querySelector<HTMLElement>('[data-day-underline]');
  const ids = tabs.map((t) => t.dataset.dayTab!);

  let currentId: string | null = null;
  let busy = false;
  const reduce = reducedMotion();

  const updateChrome = (id: string) => {
    tabs.forEach((t) => {
      const active = t.dataset.dayTab === id;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.classList.toggle('is-active', active);
    });
    const activeTab = tabs.find((t) => t.dataset.dayTab === id);
    if (underline && activeTab) {
      const navRect = activeTab.parentElement!.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      const x = tabRect.left - navRect.left;
      gsap.to(underline, {
        width: tabRect.width,
        x,
        duration: reduce ? 0 : 0.45,
        ease: 'power3.out'
      });
    }
  };

  const setActive = (id: string, animate = true) => {
    if (id === currentId || busy) return;
    updateChrome(id);

    const outgoing = panels.find((p) => p.dataset.dayPanel === currentId);
    const incoming = panels.find((p) => p.dataset.dayPanel === id);
    if (!incoming) return;

    const direction =
      currentId && ids.indexOf(id) > ids.indexOf(currentId) ? 1 : -1;
    const slide = 28;

    if (!animate || reduce || !outgoing) {
      panels.forEach((p) => {
        const match = p.dataset.dayPanel === id;
        p.hidden = !match;
        gsap.set(p, { clearProps: 'all' });
        p.style.opacity = match ? '1' : '0';
      });
      currentId = id;
      ScrollTrigger.refresh();
      return;
    }

    busy = true;
    const items = incoming.querySelectorAll<HTMLElement>('li');

    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          busy = false;
          ScrollTrigger.refresh();
        }
      })
      .to(outgoing, {
        opacity: 0,
        x: -slide * direction,
        duration: 0.28,
        ease: 'power2.in'
      })
      .set(outgoing, { hidden: true, clearProps: 'transform' })
      .set(incoming, { hidden: false, opacity: 0, x: slide * direction })
      .to(incoming, { opacity: 1, x: 0, duration: 0.42 })
      .fromTo(
        items,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07 },
        '-=0.3'
      );

    currentId = id;
  };

  tabs.forEach((t) => {
    t.addEventListener('click', () => setActive(t.dataset.dayTab!));
  });

  root.querySelectorAll<HTMLButtonElement>('[data-day-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.dayNav === 'next' ? 1 : -1;
      const idx = ids.indexOf(currentId ?? ids[0]);
      const next = ids[(idx + direction + ids.length) % ids.length];
      setActive(next);
    });
  });

  const initial = tabs[0]?.dataset.dayTab;
  if (initial) setActive(initial, false);
  window.addEventListener('resize', () => {
    if (currentId) updateChrome(currentId);
  });
}

/* ---------- Initiatives horizontal scroll ----------
   Native horizontal overflow only — the cards slide when the user scrolls
   horizontally (trackpad swipe, shift+wheel, drag). Vertical page scroll
   no longer drives the track. No pin, no scrub. */
export function initInitiativesScroll() {
  // Intentionally a no-op: horizontal motion is provided by the
  // overflow-x-auto scroller in the markup. Kept exported so existing
  // bootstrap code remains valid.
}

/* ---------- Gallery filter with FLIP ---------- */
export function initGalleryFilter() {
  const root = document.querySelector<HTMLElement>('[data-gallery]');
  if (!root) return;
  const items = Array.from(
    root.querySelectorAll<HTMLElement>('[data-gallery-item]')
  );
  const filters = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-gallery-filter]')
  );
  const underline = root.querySelector<HTMLElement>('[data-gallery-underline]');
  const grid = items[0]?.parentElement ?? null;

  // Lock the grid's height to its "all items visible" state so the section
  // below doesn't jump when a filter removes cards from the grid.
  const lockGridHeight = () => {
    if (!grid) return;
    const prevDisplay = items.map((it) => it.style.display);
    items.forEach((it) => {
      it.style.display = '';
    });
    grid.style.minHeight = '';
    const h = grid.getBoundingClientRect().height;
    if (h > 0) grid.style.minHeight = `${h}px`;
    items.forEach((it, i) => {
      it.style.display = prevDisplay[i];
    });
  };
  requestAnimationFrame(lockGridHeight);
  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(lockGridHeight, 150);
  });

  const moveUnderline = (btn: HTMLButtonElement) => {
    if (!underline) return;
    const parent = btn.parentElement!;
    const navRect = parent.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    underline.style.width = `${r.width}px`;
    underline.style.transform = `translateX(${r.left - navRect.left}px)`;
  };

  const apply = (id: string) => {
    filters.forEach((b) => {
      const active = b.dataset.galleryFilter === id;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) moveUnderline(b);
    });
    const state = Flip.getState(items);
    items.forEach((it) => {
      const matches = id === 'tout' || it.dataset.category === id;
      it.style.display = matches ? '' : 'none';
    });
    if (reducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }
    Flip.from(state, {
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.04,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' }),
      onComplete: () => ScrollTrigger.refresh()
    });
  };

  filters.forEach((b) =>
    b.addEventListener('click', () => apply(b.dataset.galleryFilter!))
  );

  const initial = filters[0];
  if (initial) {
    requestAnimationFrame(() => moveUnderline(initial));
    window.addEventListener('resize', () => {
      const active = filters.find((b) => b.classList.contains('is-active'));
      if (active) moveUnderline(active);
    });
  }
}

/* ---------- Registration / contact form: POST + success / error states ----------
 *
 * Each form opts in by setting:
 *   • `data-form`               on the <form>
 *   • `data-form-endpoint="/api/…"`   the SSR endpoint to POST FormData to
 *   • `data-form-wrap`          (optional) wrapper that gets hidden on success
 *   • a sibling `[data-form-success]`  card that gets revealed
 *   • a sibling `[data-form-error]`    (optional) inline error message slot
 *   • a button with `data-submit-btn` (loading state via `.is-loading`)
 *
 * Re-binding is idempotent — listeners are attached once even when initForms()
 * re-runs on `astro:page-load`.
 */
export function initForms() {
  document.querySelectorAll<HTMLFormElement>('[data-form]').forEach((form) => {
    if (form.dataset.formBound === '1') return;
    form.dataset.formBound = '1';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const wrap = (form.closest<HTMLElement>('[data-form-wrap]') ?? form);
      const success = wrap.parentElement?.querySelector<HTMLElement>('[data-form-success]') ?? null;
      const errorBox = wrap.parentElement?.querySelector<HTMLElement>('[data-form-error]') ?? null;
      const btn = form.querySelector<HTMLButtonElement>('[data-submit-btn]');
      const endpoint = form.dataset.formEndpoint ?? form.getAttribute('action') ?? '';

      const lockFields = (locked: boolean) => {
        if (btn) {
          btn.classList.toggle('is-loading', locked);
          btn.disabled = locked;
        }
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          'input, textarea, select'
        ).forEach((el) => { el.disabled = locked; });
      };

      const showError = (msg: string) => {
        if (errorBox) {
          errorBox.textContent = msg;
          errorBox.removeAttribute('hidden');
          errorBox.style.display = 'block';
          if (!reducedMotion()) {
            gsap.fromTo(errorBox, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.3 });
          }
        } else {
          // Fallback for forms that didn't ship an error slot.
          // eslint-disable-next-line no-alert
          alert(msg);
        }
      };

      const hideError = () => {
        if (errorBox) {
          errorBox.setAttribute('hidden', '');
          errorBox.style.display = 'none';
        }
      };

      const revealSuccess = () => {
        wrap.style.display = 'none';
        if (!success) return;
        success.style.display = 'flex';
        if (!reducedMotion()) {
          gsap.fromTo(
            success,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          );
        }
      };

      hideError();
      lockFields(true);

      try {
        if (!endpoint) {
          throw new Error('Configuration manquante : data-form-endpoint absent.');
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          let serverMsg = 'L’envoi a échoué. Veuillez réessayer.';
          try {
            const data = await res.json();
            if (data && typeof data.error === 'string') serverMsg = data.error;
          } catch { /* ignore parse errors */ }
          throw new Error(serverMsg);
        }

        if (reducedMotion()) {
          revealSuccess();
        } else {
          gsap.to(wrap, {
            opacity: 0,
            y: -8,
            duration: 0.45,
            ease: 'power2.in',
            onComplete: revealSuccess,
          });
        }
      } catch (err) {
        lockFields(false);
        const msg = err instanceof Error ? err.message : 'Erreur réseau. Veuillez réessayer.';
        showError(msg);
      }
    });
  });
}

/* ---------- About image gentle parallax ---------- */
export function initAboutParallax() {
  if (reducedMotion()) return;
  const img = document.querySelector<HTMLElement>('[data-about-img]');
  if (!img) return;
  gsap.fromTo(
    img,
    { y: 0 },
    {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );
}
