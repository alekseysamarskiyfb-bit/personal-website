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
  observer: null as ResizeObserver | null,
  onRefresh: null as (() => void) | null,
  mobile: false,

  init() {
    if (this.initialized) return;
    this.mobile = isMobile();
    this.pairs = [];
    this.collectPairs();
    if (!this.pairs.length) return;

    this.positionAllOnce();
    if (!this.mobile && !prefersReducedMotion()) this.watch();
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

      /* No will-change. It was justified while a rAF loop rewrote these
         transforms every frame; now they are written only on layout change, so
         permanently promoting twelve elements to their own compositor layers
         costs memory and buys nothing. */
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

  /**
   * Re-solve on LAYOUT CHANGE, not on every frame.
   *
   * This used to run an unbounded rAF loop: twelve pairs re-solved forever, each
   * doing a getBoundingClientRect plus a DOMMatrix(getComputedStyle().transform),
   * whether or not the section was on screen and whether or not anything had
   * moved. It never idled, and it was the single largest source of scroll jank.
   *
   * Per-frame work was never actually required. `solve` measures target and
   * anchor with getBoundingClientRect and uses the DELTA between them, and in
   * every pair here both elements sit inside the same positioned container —
   * the timeline cards and their milestones, the capability chips and their
   * inline anchors. Scrolling moves both by the same amount, so the delta is
   * scroll-invariant and the solved transform stays correct until the LAYOUT
   * changes underneath it.
   *
   * So: observe the boxes, and re-solve when one of them actually changes.
   * Writing a transform does not alter a border box, so the observer cannot
   * feed itself.
   */
  watch() {
    const solveAll = () => this.pairs.forEach((p) => this.solve(p, true));

    const boxes = new Set<Element>();
    this.pairs.forEach(({ target, anchor }) => {
      boxes.add(target);
      boxes.add(anchor);
      // The container catches reflows that move an anchor without resizing it.
      const section = target.closest("section");
      if (section) boxes.add(section);
    });

    this.observer = new ResizeObserver(solveAll);
    boxes.forEach((el) => this.observer?.observe(el));

    // Fonts, images and pinned sections settle through refresh, not resize.
    this.onRefresh = solveAll;
    ScrollTrigger.addEventListener("refresh", solveAll);
  },

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    if (this.onRefresh) {
      ScrollTrigger.removeEventListener("refresh", this.onRefresh);
      this.onRefresh = null;
    }
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
      gsap.set(cards, { y: "9%", opacity: 0, scale: 0.88, filter: "blur(14px)" });

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
              filter: "blur(0px)",
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.12,
            }),
        });
      }

      offScreen.forEach((card) =>
        gsap.to(card, {
          y: "0%",
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.25,
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

  /* Inverted: the rail is dark by default and flips LIGHT wherever it
     overlaps the lit work island. Values are literals rather than var()
     because GSAP interpolates colours, and it cannot tween between two
     custom-property references. */
  groups: [
    {
      selector: ".nav-top-layout",
      dark: {
        ".nav-top-layout": { color: "#f3efe6" },
        ".nav-top-layout > .nav-top-bg": {
          borderColor: "rgba(255,255,255,0.09)",
          backgroundColor: "rgba(38,35,30,0.72)",
        },
        ".social-link": {
          backgroundColor: "#23201b",
          color: "#f3efe6",
          borderColor: "rgba(255,255,255,0.14)",
        },
      },
      light: {
        ".nav-top-layout": { color: "#14120f" },
        ".nav-top-layout > .nav-top-bg": {
          borderColor: "rgba(20,18,15,0.1)",
          backgroundColor: "rgba(255,255,255,0.66)",
        },
        ".social-link": {
          backgroundColor: "#ebe7db",
          color: "#14120f",
          borderColor: "rgba(20,18,15,0.1)",
        },
      },
    },
    {
      selector: ".nav-stats-wrap",
      dark: {
        ".nav-stats-wrap": { color: "#f3efe6" },
        ".nav-stats-wrap .nav-top-bg": {
          borderColor: "rgba(255,255,255,0.09)",
          backgroundColor: "rgba(38,35,30,0.72)",
        },
        ".nav-stats-sep": { backgroundColor: "rgba(255,255,255,0.14)" },
      },
      light: {
        ".nav-stats-wrap": { color: "#14120f" },
        ".nav-stats-wrap .nav-top-bg": {
          borderColor: "rgba(20,18,15,0.1)",
          backgroundColor: "rgba(255,255,255,0.66)",
        },
        ".nav-stats-sep": { backgroundColor: "rgba(20,18,15,0.12)" },
      },
    },
    {
      selector: ".nav-menu",
      // A tall element grazing a section edge must not flicker, so it needs
      // real overlap before it commits to the flip.
      threshold: 0.35,
      dark: {
        ".nav-menu": { color: "#f3efe6" },
        ".nav-menu-bg": {
          borderColor: "rgba(255,255,255,0.09)",
          backgroundColor: "rgba(38,35,30,0.72)",
        },
        ".nav-item-bg": {
          borderColor: "rgba(255,255,255,0.06)",
          backgroundColor: "#23201b",
        },
      },
      light: {
        ".nav-menu": { color: "#14120f" },
        ".nav-menu-bg": {
          borderColor: "rgba(20,18,15,0.1)",
          backgroundColor: "rgba(255,255,255,0.66)",
        },
        ".nav-item-bg": {
          borderColor: "rgba(20,18,15,0.07)",
          backgroundColor: "#ebe7db",
        },
      },
    },
    {
      selector: ".nav-platforms-wrap",
      dark: {
        ".nav-platforms-wrap": {
          color: "#f3efe6",
          borderColor: "rgba(255,255,255,0.09)",
          backgroundColor: "rgba(38,35,30,0.72)",
        },
      },
      light: {
        ".nav-platforms-wrap": {
          color: "#14120f",
          borderColor: "rgba(20,18,15,0.1)",
          backgroundColor: "rgba(255,255,255,0.66)",
        },
      },
    },
    {
      selector: ".nav-email-wrap",
      dark: {
        ".nav-email-wrap": {
          borderColor: "rgba(255,255,255,0.09)",
          backgroundColor: "rgba(38,35,30,0.72)",
        },
        ".nav-email-item": { backgroundColor: "#23201b", color: "#f3efe6" },
      },
      light: {
        ".nav-email-wrap": {
          borderColor: "rgba(20,18,15,0.1)",
          backgroundColor: "rgba(255,255,255,0.66)",
        },
        ".nav-email-item": { backgroundColor: "#ebe7db", color: "#14120f" },
      },
    },
    {
      selector: ".nav-button-secondary",
      dark: {
        ".nav-button-secondary": {
          backgroundColor: "#23201b",
          color: "#f3efe6",
          borderColor: "rgba(255,255,255,0.14)",
        },
      },
      light: {
        ".nav-button-secondary": {
          backgroundColor: "#ebe7db",
          color: "#14120f",
          borderColor: "rgba(20,18,15,0.1)",
        },
      },
    },
  ] as ThemeGroup[],

  init() {
    if (isMobile()) return;
    // data-theme marks the section whose tone DIFFERS from the page ground.
    const invertedSections = Utils.$$("[data-theme]");
    if (!invertedSections.length) return;

    /* Rail rests dark now; "light" is the state it flips INTO.
       The apply() is not redundant on a rebuild: this module tweens INLINE
       colours, which survive the teardown. Resetting only the bookkeeping
       would leave the rail painted light while the code believed it was
       dark, and the next flip would never fire. */
    this.groups.forEach((g) => {
      this.states[g.selector] = "dark";
      this.apply(g.dark);
    });

    invertedSections.forEach((section) => {
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

      // Overlapping the lit island means the rail must go light.
      if (overlaps && current === "dark") {
        this.apply(group.light);
        this.states[group.selector] = "light";
      } else if (!overlaps && current === "light") {
        this.apply(group.dark);
        this.states[group.selector] = "dark";
      }
    });
  },

  /** Back to the page's own tone once the island is off screen. */
  resetAll() {
    this.groups.forEach((g) => {
      if (this.states[g.selector] === "light") {
        this.apply(g.dark);
        this.states[g.selector] = "dark";
      }
    });
  },

  apply(styles: Record<string, gsap.TweenVars>) {
    Object.entries(styles).forEach(([selector, props]) => {
      gsap.to(selector, { ...props, duration: 0.3 });
    });
  },
};
