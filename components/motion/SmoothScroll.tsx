"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

/**
 * Owns scrolling for the whole site.
 *
 * Lenis interpolates the scroll position and GSAP's ticker drives it, so
 * ScrollTrigger and Lenis advance on the same frame. Two clocks here would
 * show up as reveals lagging a few pixels behind the content they belong to.
 *
 * Under reduced motion Lenis is never constructed — the browser's own
 * scrolling is left alone, which is the whole point of the preference.
 */
export default function SmoothScroll() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // The ticker's lag smoothing pauses tweens after a stall, which desyncs
    // the interpolated scroll position from the real one.
    gsap.ticker.lagSmoothing(0);

    // In-page links have to go through Lenis, or the browser jumps while Lenis
    // believes it is still where it was.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
