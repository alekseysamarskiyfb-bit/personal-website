/**
 * HERO SNAP
 *
 * Makes the hero→rail morph scroll-COMPLETED rather than scroll-length
 * dependent: a short wheel gesture starts it, the gesture ends, and the
 * remaining progress plays itself out. Reverses the same way going back up.
 *
 * Implemented against Lenis rather than ScrollTrigger's own `snap`. ST's snap
 * writes through its scroll setter, which fights Lenis for ownership of the
 * scroll position and produces a visible tug-of-war at the hand-off. Driving
 * Lenis directly keeps one authority over scroll at all times.
 *
 * The window ends where the morph does, not where the hero does — past that
 * point the page must scroll normally or the user can never stop inside the
 * section that follows.
 */

import { STATE, Utils, isMobile, prefersReducedMotion } from "../core";

export const HeroSnap = {
  enabled: false,
  settling: false,
  idleTimer: null as ReturnType<typeof setTimeout> | null,
  lastY: 0,
  /** Fraction of the hero over which the morph completes. */
  morphEnd: 0.53,
  /** Below this, a gesture is treated as an accident and ignored. */
  minTravel: 12,

  init() {
    if (isMobile() || prefersReducedMotion() || !STATE.lenis) return;

    const hero = Utils.$(".hero");
    if (!hero) return;

    this.enabled = true;
    this.lastY = window.scrollY;

    const end = () => hero.offsetHeight * this.morphEnd;

    const settle = () => {
      if (!this.enabled || this.settling) return;

      const target = end();
      const y = window.scrollY;
      if (y <= 1 || y >= target - 1) return;      // already resting at an edge
      const travelled = Math.abs(y - this.lastY);
      if (travelled < this.minTravel) return;

      const goingDown = y > this.lastY;
      const dest = goingDown ? target : 0;
      const distance = Math.abs(dest - y);

      // Time the settle to the distance left so a nearly-finished morph does
      // not crawl and a barely-started one does not lurch.
      const duration = Math.min(1.15, Math.max(0.42, distance / target * 1.1));

      this.settling = true;
      STATE.lenis?.scrollTo(dest, {
        duration,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        lock: true,
        onComplete: () => {
          this.settling = false;
          this.lastY = window.scrollY;
        },
      });
    };

    /* Wait for the page to actually be SLOW, not for a fixed delay.
       A 90ms timer was the old test, but Lenis runs at lerp 0.1 and is still
       visibly moving 90ms after the wheel stops — so the settle launched into
       the tail of the user's own inertia and the two fought. That fight is the
       jerk in the hero. Sampling the real velocity means the takeover happens
       when the page is genuinely coasting to a stop, at any scroll speed. */
    const SLOW = 0.06;      // px per ms — imperceptible drift
    const MAX_WAIT = 420;   // ms; never wait forever on a slow trackpad glide

    let waited = 0;
    const armSettle = () => {
      if (this.idleTimer) clearTimeout(this.idleTimer);
      const y = window.scrollY;
      this.idleTimer = setTimeout(() => {
        const speed = Math.abs(window.scrollY - y) / 60;
        waited += 60;
        if (speed > SLOW && waited < MAX_WAIT) {
          armSettle();
          return;
        }
        waited = 0;
        settle();
      }, 60);
    };

    const onScroll = () => {
      if (!this.enabled || this.settling) return;
      if (window.scrollY > end() * 1.25) {
        // Past the morph entirely — stop arming, let the page scroll.
        this.lastY = window.scrollY;
        return;
      }
      waited = 0;
      armSettle();
    };

    Utils.addEvent(window, "scroll", onScroll, { passive: true });

    // A deliberate new gesture cancels an in-flight settle, so the user is
    // never held hostage by an animation they changed their mind about.
    Utils.addEvent(
      window,
      "wheel",
      () => {
        if (this.settling) {
          STATE.lenis?.stop();
          STATE.lenis?.start();
          this.settling = false;
          this.lastY = window.scrollY;
        }
      },
      { passive: true }
    );
  },

  destroy() {
    this.enabled = false;
    this.settling = false;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = null;
  },
};
