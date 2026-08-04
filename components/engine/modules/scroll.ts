/**
 * SCROLL-DRIVEN MODULES
 *   MagneticPositions — the zig-zag timeline constraint solver
 *   HorizontalScroll  — the pinned work track
 *   ThemeSwitcher     — the rail inverting itself over dark sections
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONFIG, STATE, Utils, isMobile, prefersReducedMotion } from "../core";

/* ==========================================================================
   MAGNETIC POSITIONS
   Each timeline card declares which of ITS corners should sit on which
   anchor. Solved every frame rather than once, because the cards' own reveal
   animations and the growing rail keep changing the layout underneath.
   The previous transform is backed out of the measurement before re-solving,
   otherwise each frame compounds the last and the cards walk off-screen.
   ========================================================================== */

type Pair = {
  target: HTMLElement;
  anchor: HTMLElement;
  originConfig: string;
  anchorConfig: string;
  offsetX: { value: number; unit: string };
  offsetY: { value: number; unit: string };
};

export const MagneticPositions = {
  initialized: false,
  pairs: [] as Pair[],
  rafId: null as number | null,
  isRunning: false,
  mobile: false,

  init() {
    if (this.initialized) return;
    this.mobile = isMobile();
    this.pairs = [];
    this.collectPairs();
    if (!this.pairs.length) return;

    this.positionAllOnce();
    if (!this.mobile && !prefersReducedMotion()) this.startLoop();
    this.initialized = true;
  },

  collectPairs() {
    Utils.$$("[data-origin]").forEach((target) => {
      if (target.hasAttribute("data-desktop") && isMobile()) return;

      let id = target.getAttribute("data-connect");
      if (this.mobile && target.hasAttribute("data-connect-mobile")) {
        id = target.getAttribute("data-connect-mobile");
      }
      if (!id) return;

      const anchor = document.querySelector<HTMLElement>(
        `[data-connect="${id}"]:not([data-origin])`
      );
      if (!anchor) return;

      let offsetRaw = target.getAttribute("data-offset") || "0,0";
      if (this.mobile && target.hasAttribute("data-offset-mobile")) {
        offsetRaw = target.getAttribute("data-offset-mobile") as string;
      }
      let originConfig = target.getAttribute("data-origin") as string;
      if (this.mobile && target.hasAttribute("data-origin-mobile")) {
        originConfig = target.getAttribute("data-origin-mobile") as string;
      }
      let anchorConfig = target.getAttribute("data-anchor-pos") || "center";
      if (this.mobile && target.hasAttribute("data-anchor-pos-mobile")) {
        anchorConfig = target.getAttribute("data-anchor-pos-mobile") as string;
      }

      const [rawX, rawY] = offsetRaw.split(",").map((s) => s.trim());

      this.pairs.push({
        target,
        anchor,
        originConfig: originConfig.toLowerCase(),
        anchorConfig: anchorConfig.toLowerCase(),
        offsetX: Utils.parseUnit(rawX),
        offsetY: Utils.parseUnit(rawY),
      });

      target.style.willChange = "transform";
    });
  },

  getPoint(rect: { left: number; top: number; right: number; bottom: number; width: number; height: number }, config: string) {
    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2;
    if (config.includes("left")) x = rect.left;
    else if (config.includes("right")) x = rect.right;
    if (config.includes("top")) y = rect.top;
    else if (config.includes("bottom")) y = rect.bottom;
    return { x, y };
  },

  solve(pair: Pair, backOutCurrent: boolean) {
    const { target, anchor, originConfig, anchorConfig, offsetX, offsetY } = pair;
    if (!target || !anchor) return;

    let base;
    if (backOutCurrent) {
      const m = new DOMMatrix(getComputedStyle(target).transform);
      const raw = target.getBoundingClientRect();
      base = {
        left: raw.left - m.m41,
        top: raw.top - m.m42,
        right: raw.right - m.m41,
        bottom: raw.bottom - m.m42,
        width: raw.width,
        height: raw.height,
      };
    } else {
      target.style.transform = "none";
      void target.offsetHeight;
      base = target.getBoundingClientRect();
    }

    const anchorRect = anchor.getBoundingClientRect();
    const anchorPoint = this.getPoint(anchorRect, anchorConfig);
    const originPoint = this.getPoint(base, originConfig);

    const offX = Utils.toPx(offsetX, base.width);
    const offY = Utils.toPx(offsetY, base.height);

    const finalX = Math.round((anchorPoint.x - originPoint.x + offX) * 100) / 100;
    const finalY = Math.round((anchorPoint.y - originPoint.y + offY) * 100) / 100;

    target.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
    target.style.visibility = "visible";
  },

  positionAllOnce() {
    this.pairs.forEach((p) => this.solve(p, false));
  },

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      this.pairs.forEach((p) => this.solve(p, true));
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  },

  destroy() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.pairs.forEach(({ target }) => {
      target.style.transform = "";
      target.style.willChange = "";
      target.style.visibility = "";
    });
    this.pairs = [];
    this.initialized = false;
  },
};

/* ==========================================================================
   HORIZONTAL SCROLL — the work track
   Overflow is MEASURED rather than assumed, so adding a card needs no config
   change. Cards split into two populations: those already on screen animate
   as one staggered group; the rest get individual triggers driven through
   containerAnimation, which measures them in horizontal space.
   ========================================================================== */

export const HorizontalScroll = {
  setupTimeout: null as ReturnType<typeof setTimeout> | null,

  init() {
    if (isMobile() || prefersReducedMotion()) return;
    this.setup();
  },

  destroy() {
    if (this.setupTimeout) clearTimeout(this.setupTimeout);
    this.setupTimeout = null;
    STATE.workTween?.kill();
    STATE.workTween = null;
  },

  setup() {
    const section = Utils.$(".work_section");
    const sticky = Utils.$(".work-sticky");
    const support = Utils.$(".work-sticky-support");
    const wrap = Utils.$(".work-track-wrap");
    const track = Utils.$(".work-track");
    if (!section || !sticky || !support || !wrap || !track) return;

    this.destroy();
    gsap.set(track, { clearProps: "transform" });

    // Two frames plus a beat: fonts, images and the sticky element all have
    // to settle or the measured overflow is short and the track stops early.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.setupTimeout = setTimeout(
          () => this.perform(section, sticky, support, wrap, track),
          CONFIG.horizontalScrollDelay
        );
      })
    );
  },

  perform(
    section: HTMLElement,
    sticky: HTMLElement,
    support: HTMLElement,
    wrap: HTMLElement,
    track: HTMLElement
  ) {
    void section.offsetHeight;

    const sizeSupport = () => {
      support.style.height = `${section.offsetHeight - sticky.offsetHeight}px`;
    };
    sizeSupport();

    const overflowRight = Math.max(
      0,
      track.getBoundingClientRect().right - wrap.getBoundingClientRect().right
    );

    STATE.workTween = gsap.to(track, {
      x: -overflowRight,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${section.offsetHeight - window.innerHeight}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          sizeSupport();
          const newOverflow = Math.max(
            0,
            track.getBoundingClientRect().right - wrap.getBoundingClientRect().right
          );
          if (STATE.workTween?.scrollTrigger) {
            gsap.set(track, { x: 0 });
            STATE.workTween.vars.x = -newOverflow;
            STATE.workTween.scrollTrigger.vars.end = `+=${
              section.offsetHeight - window.innerHeight
            }`;
            STATE.workTween.invalidate();
          }
        },
      },
    });

    const cards = Utils.$$(".work-card");
    if (cards.length) {
      gsap.set(cards, { y: "10%", opacity: 0, scale: 0.6 });

      const wrapRight = wrap.getBoundingClientRect().right;
      const inView: HTMLElement[] = [];
      const offScreen: HTMLElement[] = [];
      cards.forEach((c) =>
        (c.getBoundingClientRect().left < wrapRight ? inView : offScreen).push(c)
      );

      if (inView.length) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(inView, {
              y: "0%",
              opacity: 1,
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.1,
            }),
        });
      }

      offScreen.forEach((card) =>
        gsap.to(card, {
          y: "0%",
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: STATE.workTween as gsap.core.Tween,
            start: "left right",
            toggleActions: "play none none none",
          },
        })
      );
    }

    ScrollTrigger.refresh();
  },
};

/* ==========================================================================
   THEME SWITCHER
   The rail is glass over unknown content, so it inverts itself wherever it
   overlaps a dark section. Rect intersection per element group, tested on
   every scroll update.
   ========================================================================== */

type ThemeGroup = {
  selector: string;
  dark: Record<string, gsap.TweenVars>;
  light: Record<string, gsap.TweenVars>;
  /** Fraction of the element that must overlap before it flips. */
  threshold?: number;
};

export const ThemeSwitcher = {
  states: {} as Record<string, "light" | "dark">,

  groups: [
    {
      selector: ".nav-top-layout",
      dark: {
        ".nav-top-layout": { color: "rgba(255,255,255,0.9)" },
        ".nav-top-layout > .nav-top-bg": {
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(29,29,29,0.9)",
        },
        ".social-link": { backgroundColor: "#393939", color: "#ffffff", borderColor: "rgba(255,255,255,0.1)" },
      },
      light: {
        ".nav-top-layout": { color: "#000000" },
        ".nav-top-layout > .nav-top-bg": {
          borderColor: "rgba(255,255,255,0.2)",
          backgroundColor: "rgba(223,222,206,0.8)",
        },
        ".social-link": { backgroundColor: "#ebeada", color: "#000000", borderColor: "rgba(0,0,0,0.1)" },
      },
    },
    {
      selector: ".nav-stats-wrap",
      dark: {
        ".nav-stats-wrap": { color: "rgba(255,255,255,0.9)" },
        ".nav-stats-wrap .nav-top-bg": {
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(29,29,29,0.6)",
        },
        ".nav-stats-sep": { backgroundColor: "rgba(255,255,255,0.15)" },
        ".nav-stat-a-icon, .nav-stat-b-numb": { color: "#9b6bff" },
      },
      light: {
        ".nav-stats-wrap": { color: "#000000" },
        ".nav-stats-wrap .nav-top-bg": {
          borderColor: "rgba(255,255,255,0.2)",
          backgroundColor: "rgba(223,222,206,0.8)",
        },
        ".nav-stats-sep": { backgroundColor: "rgba(0,0,0,0.1)" },
        ".nav-stat-a-icon, .nav-stat-b-numb": { color: "#7c3aed" },
      },
    },
    {
      selector: ".nav-menu",
      // A tall element grazing a section edge must not flicker, so it needs
      // real overlap before it commits to the flip.
      threshold: 0.35,
      dark: {
        ".nav-menu": { color: "rgba(255,255,255,0.9)" },
        ".nav-menu-bg": {
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(29,29,29,0.6)",
        },
        ".nav-item-bg": { borderColor: "rgba(255,255,255,0.03)", backgroundColor: "rgba(57,57,57,0.9)" },
      },
      light: {
        ".nav-menu": { color: "#000000" },
        ".nav-menu-bg": {
          borderColor: "rgba(255,255,255,0.2)",
          backgroundColor: "rgba(223,222,206,0.8)",
        },
        ".nav-item-bg": { borderColor: "rgba(0,0,0,0.1)", backgroundColor: "#ebeada" },
      },
    },
    {
      selector: ".nav-platforms-wrap",
      dark: {
        ".nav-platforms-wrap": {
          color: "rgba(255,255,255,0.9)",
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(29,29,29,0.6)",
        },
      },
      light: {
        ".nav-platforms-wrap": {
          color: "#000000",
          borderColor: "rgba(255,255,255,0.2)",
          backgroundColor: "rgba(223,222,206,0.8)",
        },
      },
    },
    {
      selector: ".nav-email-wrap",
      dark: {
        ".nav-email-wrap": {
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(29,29,29,0.6)",
        },
        ".nav-email-item": { backgroundColor: "rgba(94,94,94,0.5)", color: "rgba(255,255,255,0.9)" },
      },
      light: {
        ".nav-email-wrap": {
          borderColor: "rgba(255,255,255,0.2)",
          backgroundColor: "rgba(223,222,206,0.8)",
        },
        ".nav-email-item": { backgroundColor: "#ebeada", color: "#000000" },
      },
    },
    {
      selector: ".nav-button-secondary",
      dark: {
        ".nav-button-secondary": {
          backgroundColor: "#393939",
          color: "#ffffff",
          borderColor: "rgba(255,255,255,0.1)",
        },
      },
      light: {
        ".nav-button-secondary": {
          backgroundColor: "#ebeada",
          color: "#000000",
          borderColor: "rgba(0,0,0,0.1)",
        },
      },
    },
  ] as ThemeGroup[],

  init() {
    if (isMobile()) return;
    const darkSections = Utils.$$('[data-theme="dark"]');
    if (!darkSections.length) return;

    this.groups.forEach((g) => (this.states[g.selector] = "light"));

    darkSections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => this.check(section),
        onLeave: () => this.resetAll(),
        onLeaveBack: () => this.resetAll(),
      });
    });
  },

  check(section: HTMLElement) {
    const s = section.getBoundingClientRect();

    this.groups.forEach((group) => {
      const el = Utils.$(group.selector);
      if (!el) return;
      const n = el.getBoundingClientRect();
      const current = this.states[group.selector];

      let overlaps: boolean;
      if (group.threshold) {
        const h = Math.max(0, Math.min(n.bottom, s.bottom) - Math.max(n.top, s.top));
        overlaps = h / (n.height || 1) >= group.threshold;
      } else {
        overlaps = !(n.bottom < s.top || n.top > s.bottom);
      }

      if (overlaps && current === "light") {
        this.apply(group.dark);
        this.states[group.selector] = "dark";
      } else if (!overlaps && current === "dark") {
        this.apply(group.light);
        this.states[group.selector] = "light";
      }
    });
  },

  resetAll() {
    this.groups.forEach((g) => {
      if (this.states[g.selector] === "dark") {
        this.apply(g.light);
        this.states[g.selector] = "light";
      }
    });
  },

  apply(styles: Record<string, gsap.TweenVars>) {
    Object.entries(styles).forEach(([selector, props]) => {
      gsap.to(selector, { ...props, duration: 0.3 });
    });
  },
};
