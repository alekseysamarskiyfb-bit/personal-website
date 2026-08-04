"use client";

/**
 * ANIMATION ENGINE — single mount point.
 *
 * React renders declarative markup; this runs the modules against the real
 * DOM once, in a fixed order. That order is load-bearing: the ghost engine
 * must measure before the preloader hides anything, and magnetic positioning
 * must run after every reveal has established its final layout.
 *
 * It waits on document.fonts.ready rather than window.load. The reference
 * used load, but the mark's FLIP is measured from rendered text metrics — if
 * a fallback face is still active at measure time every pair lands wrong.
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { CONFIG, STATE, Utils, isMobile, prefersReducedMotion } from "./core";
import { StyleEngine } from "./modules/styleEngine";
import { GhostEngine } from "./modules/ghostEngine";
import { LenisInit, AnchorLinks } from "./modules/lenis";
import { Sidebar, Clipboard, ButtonHover } from "./modules/sidebar";
import { Preloader, ProfileImage } from "./modules/preloader";
import { MagneticPositions, HorizontalScroll, ThemeSwitcher } from "./modules/scroll";
import {
  CardInteractions,
  TextReveal,
  CTAAnimation,
  ImageTrail,
  Carousel,
  Faq,
} from "./modules/interactions";
import { MobileMenu, Popups } from "./modules/mobileMenu";

gsap.registerPlugin(ScrollTrigger, SplitText);

function initAll() {
  if (STATE.initialized) return;

  // Order matters — see the module headers for why.
  Sidebar.init();
  GhostEngine.init();
  StyleEngine.init();
  HorizontalScroll.init();
  ThemeSwitcher.init();
  MobileMenu.init();

  CardInteractions.init();
  Popups.init();
  ProfileImage.init();
  CTAAnimation.init();
  Clipboard.init();
  ImageTrail.init();
  ButtonHover.init();
  Faq.init();

  Carousel.init();
  LenisInit.init();

  /* Scroll is locked through the intro so the reveal chain cannot be
     interrupted half-way, which would leave the rail mid-morph. */
  if (STATE.lenis && !isMobile() && !prefersReducedMotion()) {
    STATE.lenis.stop();
    setTimeout(() => STATE.lenis?.start(), CONFIG.introLockMs);
  }

  TextReveal.init();
  AnchorLinks.init();

  ScrollTrigger.refresh();
  STATE.initialized = true;

  /* Magnetic positioning runs LAST and on a delay: it solves against final
     layout, and every reveal above has to have established that layout first
     or the cards latch onto positions that are about to change. */
  setTimeout(() => MagneticPositions.init(), CONFIG.magneticInitDelay);
}

function destroyAll() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  STATE.eventListeners.forEach(({ target, event, handler, options }) =>
    target.removeEventListener(event, handler, options)
  );
  STATE.eventListeners = [];

  GhostEngine.destroy();
  StyleEngine.destroy();
  Preloader.destroy();
  HorizontalScroll.destroy();
  MagneticPositions.destroy();
  ImageTrail.destroy();
  MobileMenu.destroy();
  LenisInit.destroy();
  STATE.initialized = false;
}

export default function AnimationEngine() {
  useEffect(() => {
    // Safari restores scroll on reload/bfcache, which would start the page
    // with the hero morph already partly consumed.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      // Double rAF: lets the browser finish layout AND paint with the real
      // fonts before anything is measured.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          window.scrollTo(0, 0);
          // Preloader must run BEFORE initAll's ghost engine hides anything,
          // but its timeline only starts after measurement — see its header.
          Preloader.init();
          initAll();
        });
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    /* Width-only resizes rebuild; height-only changes on mobile are just
       browser chrome appearing and must be ignored, or the page rebuilds
       every time the URL bar hides. */
    let lastWidth = window.innerWidth;
    const onResize = Utils.debounce(() => {
      const w = window.innerWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      destroyAll();
      initAll();
      ScrollTrigger.refresh();
    }, CONFIG.resizeDebounce);

    window.addEventListener("resize", onResize);

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pageshow", onPageShow);
      destroyAll();
    };
  }, []);

  return null;
}
