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
import { CONFIG, STATE, Utils, prefersReducedMotion } from "../core";

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
 * Anchor links bypass Lenis and use native smooth scrolling, then wipe the
 * hash. Routing them through Lenis fights its own inertia and lands short;
 * leaving the hash in the URL makes a later reload restore mid-page and
 * start the page with the hero morph already half-consumed.
 */
export const AnchorLinks = {
  init() {
    Utils.$$('a[href^="#"]').forEach((link) => {
      Utils.addEvent(link, "click", ((e: Event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        history.replaceState(null, "", " ");
      }) as EventListener);
    });
  },
};
