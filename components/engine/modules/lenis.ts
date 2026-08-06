/**
 * LENIS SMOOTH SCROLL
 *
 * Lenis owns the scroll position; ScrollTrigger is driven from its scroll
 * event and Lenis is stepped from GSAP's ticker. This is the canonical
 * wiring — running two rAF loops instead desynchronises scrubs by a frame
 * and shows up as jitter on every pinned section.
 *
 * lagSmoothing(0) is required: GSAP's default lag smoothing will silently
 * skip time after a stall, which desyncs a scrubbed timeline from the
 * scrollbar and never recovers.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CONFIG, MOBILE_BREAKPOINT, STATE, Utils, prefersReducedMotion } from "../core";

export const LenisInit = {
  tickerFn: null as ((time: number) => void) | null,

  init() {
    if (prefersReducedMotion()) return;

    STATE.lenis = new Lenis({ ...CONFIG.lenis });
    STATE.lenis.on("scroll", ScrollTrigger.update);

    this.tickerFn = (time: number) => {
      STATE.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(this.tickerFn);
    gsap.ticker.lagSmoothing(0);
  },

  destroy() {
    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
    STATE.lenis?.destroy();
    STATE.lenis = null;
  },
};

/**
 * Anchor links scroll THROUGH Lenis, not around it.
 *
 * Native `scrollIntoView({behavior:'smooth'})` and Lenis are two authorities
 * writing the same scroll position: the browser animates towards the target
 * while Lenis keeps lerping towards its own idea of where the page should be,
 * and the click lands short or stutters. Lenis owns scroll everywhere else in
 * this engine (see HeroSnap) — anchors are no exception.
 *
 * The hash is still wiped: left in the URL, a later reload restores mid-page
 * and starts the page with the hero morph already half-consumed.
 */
export const AnchorLinks = {
  init() {
    Utils.$$('a[href^="#"]').forEach((link) => {
      Utils.addEvent(link, "click", ((e: Event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        /* Below 768 the rail is a fixed top bar, so a section scrolled to
           `top` sits underneath it. Measured rather than assumed, because the
           bar's height is on the vw grid. */
        const bar = Utils.$(".nav-top-layout");
        const offset =
          window.innerWidth < MOBILE_BREAKPOINT && bar
            ? -(bar.getBoundingClientRect().height + 12)
            : 0;

        const lenis = STATE.lenis;
        if (lenis && !prefersReducedMotion()) {
          lenis.scrollTo(target, {
            offset,
            duration: 1.1,
            /* expo.out — leaves fast, arrives slowly. Matches the arrival
               easing the rest of the page uses, so a jump between sections
               feels like the same product as the reveals. */
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          });
        } else {
          /* No Lenis (reduced motion) — nothing to fight, so go direct. */
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY + offset,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          });
        }

        history.replaceState(null, "", " ");
      }) as EventListener);
    });
  },
};
