/**
 * GHOST ENGINE
 *
 * The thesis of the whole design: the hero is not a hero, it is the sidebar
 * in an exploded state. Every rail element has an oversized, invisible twin
 * ("ghost") laid out in the hero. On load each REAL element is transformed
 * onto its ghost; scrolling scrubs it back home. Nothing appears or
 * disappears — it relocates.
 *
 * Three hard-won rules, in order of how badly they break things:
 *
 *  1. MEASURE EVERYTHING FIRST. Phase 1 reads every getBoundingClientRect on
 *     a pristine DOM. Phase 2 writes. Interleaving reads and writes both
 *     thrashes layout and — worse — makes each measurement depend on
 *     mutations already applied, so pairs land in subtly wrong places.
 *
 *  2. DIVIDE BY THE SIDEBAR SCALE. The rail is scaled as a unit on short
 *     viewports. Its children's rects come back in post-scale pixels, so
 *     every delta must be divided back out or the whole morph drifts.
 *
 *  3. NESTED ELEMENTS GO LAST. Phase 2 sets .nav-logo-item to position
 *     relative, which moves the absolutely-positioned dot inside it.
 *     Measuring the dot before that gives a stale rect, so it gets its own
 *     phase after the layout has settled.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATE, Utils, isMobile, prefersReducedMotion } from "../core";

type FlipType = "logo" | "link" | "background" | "icon_center" | "text_font";

type Measurement = {
  real: HTMLElement;
  ghost: HTMLElement;
  type: FlipType;
  settings: { trigger: string; start: string; end: string };
  rRect: DOMRect;
  gRect: DOMRect;
  realFontSize: string;
  parent?: HTMLElement;
  parentRect?: DOMRect;
  computedStyle?: { width: string; height: string };
  offsetHeight?: number;
  realBorderRadius?: number;
  realBorderWidth?: number;
  ghostBorderRadius?: number;
};

/** Elements whose parent is already sized by CSS and must not be rewritten. */
const PRESIZED_PARENT = "is-flip-slot";

export const GhostEngine = {
  initialized: false,

  init() {
    if (isMobile() || prefersReducedMotion()) return;
    if (this.initialized) return;
    this.createAll();
    this.initialized = true;
  },

  destroy() {
    ScrollTrigger.getAll().forEach((st) => {
      const trigger = st.vars.trigger;
      if (typeof trigger === "string" && trigger.includes("hero")) st.kill();
    });

    [
      ".nav-mark",
      ".mark-dot",
      ".nav-button",
      ".nav-button-secondary",
      ".nav-stat-a-bg",
      ".nav-stat-a-icon",
      ".nav-stat-a-text",
      ".nav-stat-b-bg",
      ".nav-stat-b-numb",
      ".nav-stat-b-text",
    ].forEach((sel) => {
      const el = Utils.$(sel);
      if (el) gsap.set(el, { clearProps: "all" });
    });

    Utils.$$(".hero-navigation-link").forEach((el) => gsap.set(el, { clearProps: "all" }));
    this.initialized = false;
  },

  /** Per-pair scroll window, read off the nearest configured ancestor. */
  getSettings(el: HTMLElement) {
    const configEl = (el.closest("[data-flip-start]") as HTMLElement) || Utils.$(".hero");
    let trigger = ".hero";
    let start = "top top";
    let end = "900px top";
    if (configEl) {
      trigger = configEl.getAttribute("data-flip-trigger") || trigger;
      start = configEl.getAttribute("data-flip-start") || start;
      end = configEl.getAttribute("data-flip-end") || end;
    }
    return { trigger, start, end };
  },

  /* ---- PHASE 1 — read only, never write --------------------------------- */
  measurePair(
    real: HTMLElement | null,
    ghost: HTMLElement | null,
    type: FlipType
  ): Measurement | null {
    if (!real || !ghost) return null;

    const m: Measurement = {
      real,
      ghost,
      type,
      settings: this.getSettings(real),
      rRect: real.getBoundingClientRect(),
      gRect: ghost.getBoundingClientRect(),
      realFontSize: window.getComputedStyle(real).fontSize,
    };

    if (type === "logo") {
      const parent = (real.closest(".is-flip-slot") || real.parentElement) as HTMLElement;
      m.parent = parent;
      m.parentRect = parent.getBoundingClientRect();
      const cs = window.getComputedStyle(real);
      m.computedStyle = { width: cs.width, height: cs.height };
      m.offsetHeight = real.offsetHeight;
    }

    if (type === "background") {
      const rs = window.getComputedStyle(real);
      const gs = window.getComputedStyle(ghost);
      m.realBorderRadius = parseFloat(rs.borderRadius) || 0;
      m.realBorderWidth = parseFloat(rs.borderWidth) || 0;
      m.ghostBorderRadius = parseFloat(gs.borderRadius) || 0;
    }

    return m;
  },

  /* ---- PHASE 2 — write, using pre-measured data only -------------------- */
  applyAnimation(m: Measurement | null) {
    if (!m) return;

    const { real, type, settings, rRect, gRect } = m;
    const scale = STATE.sidebarScale;

    let xDiff = Math.round((gRect.left - rRect.left) / scale);
    let yDiff = Math.round((gRect.top - rRect.top) / scale);

    const vars: gsap.TweenVars = { ease: "power1.inOut" };
    const toOverrides: gsap.TweenVars = {};

    if (type === "logo") {
      const { parent, parentRect, computedStyle, offsetHeight } = m;

      // Only rewrite the parent if CSS hasn't already reserved the space.
      if (parent && !parent.classList.contains(PRESIZED_PARENT)) {
        parent.style.position = "relative";
        parent.style.minHeight = `${offsetHeight}px`;
        parent.style.display = "block";
      }

      xDiff = Math.round((gRect.left - (parentRect as DOMRect).left) / scale);
      yDiff = Math.round((gRect.top - (parentRect as DOMRect).top) / scale);

      /* Width/height rather than scale. An SVG re-rasterises at every size,
         so it stays crisp across an 11x morph; a transform-scale would
         stretch a single bitmap and go soft for the whole scrub. */
      vars.width = `${gRect.width / scale}px`;
      vars.height = `${gRect.height / scale}px`;
      vars.position = "absolute";
      vars.top = "0px";
      vars.left = "0px";
      vars.x = xDiff;
      vars.y = yDiff;
      vars.transformOrigin = "top left";
      vars.force3D = false;

      toOverrides.width = computedStyle?.width;
      toOverrides.height = computedStyle?.height;
      toOverrides.position = "absolute";
      toOverrides.top = "0px";
      toOverrides.left = "0px";
    } else if (type === "link" || type === "icon_center" || type === "text_font") {
      vars.x = xDiff;
      vars.y = yDiff;
      vars.scaleX = gRect.width / rRect.width;
      vars.scaleY = gRect.height / rRect.height;
      vars.transformOrigin = "top left";
    } else if (type === "background") {
      const sX = gRect.width / rRect.width;
      const sY = gRect.height / rRect.height;
      const avgScale = (sX + sY) / 2;

      vars.x = xDiff;
      vars.y = yDiff;
      vars.scaleX = sX;
      vars.scaleY = sY;
      vars.transformOrigin = "top left";
      // Must match --glass-hero, or the card changes tone as it lands.
      vars.backgroundColor = "rgba(104, 96, 84, 0.34)";
      vars.opacity = 1;

      /* Per-corner ELLIPTICAL radius compensation. Under a non-uniform scale
         a uniform radius renders as an oval, so each corner is pre-distorted
         to `X Y` such that after scaling by sX/sY it reads as a true circle
         of the ghost's radius. Border width gets the same treatment. */
      const ghostR = m.ghostBorderRadius || m.realBorderRadius || 0;
      const fromCorner = `${ghostR / sX}px ${ghostR / sY}px`;
      vars.borderTopLeftRadius = fromCorner;
      vars.borderTopRightRadius = fromCorner;
      vars.borderBottomLeftRadius = fromCorner;
      vars.borderBottomRightRadius = fromCorner;
      vars.borderWidth = `${(m.realBorderWidth || 0) / avgScale}px`;
      vars.boxSizing = "border-box";
    }

    const fromVars: gsap.TweenVars = { ...vars };
    const toVars: gsap.TweenVars = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      ease: "power1.inOut",
      force3D: false,
      scrollTrigger: {
        trigger: settings.trigger,
        start: settings.start,
        end: settings.end,
        scrub: 1,
      },
      ...toOverrides,
    };

    if (type === "background") {
      /* The hero card doesn't just shrink — it DISSOLVES as it lands,
         revealing the rail's own panel underneath. Mirroring the elliptical
         format on toVars lets GSAP interpolate each token cleanly. */
      const toCorner = `${m.realBorderRadius}px ${m.realBorderRadius}px`;
      toVars.backgroundColor = "rgba(255, 255, 255, 0)";
      toVars.opacity = 0;
      toVars.borderTopLeftRadius = toCorner;
      toVars.borderTopRightRadius = toCorner;
      toVars.borderBottomLeftRadius = toCorner;
      toVars.borderBottomRightRadius = toCorner;
      toVars.borderWidth = `${m.realBorderWidth}px`;
    }

    gsap.fromTo(real, fromVars, toVars);
  },

  createAll() {
    /* ---- PHASE 1: measure on a clean DOM ------------------------------- */
    const measurements: (Measurement | null)[] = [];

    measurements.push(this.measurePair(Utils.$(".nav-mark"), Utils.$(".mark-ghost"), "logo"));
    measurements.push(
      this.measurePair(Utils.$(".nav-button"), Utils.$(".hero-cta-button"), "logo")
    );
    measurements.push(
      this.measurePair(Utils.$(".nav-button-secondary"), Utils.$(".hero-button"), "logo")
    );

    Utils.$$(".hero-navigation-link").forEach((link) => {
      const id = link.getAttribute("data-link-id");
      measurements.push(
        this.measurePair(link, Utils.$(`.hero-link-ghost[data-link-id="${id}"]`), "link")
      );
    });

    measurements.push(
      this.measurePair(Utils.$(".nav-stat-a-bg"), Utils.$(".hero-stat-a-bg"), "background")
    );
    measurements.push(
      this.measurePair(Utils.$(".nav-stat-a-icon"), Utils.$(".hero-stat-a-icon"), "icon_center")
    );
    measurements.push(
      this.measurePair(Utils.$(".nav-stat-a-text"), Utils.$(".hero-stat-a-text"), "text_font")
    );
    measurements.push(
      this.measurePair(Utils.$(".nav-stat-b-bg"), Utils.$(".hero-stat-b-bg"), "background")
    );
    measurements.push(
      this.measurePair(Utils.$(".nav-stat-b-numb"), Utils.$(".hero-stat-b-numb"), "icon_center")
    );
    measurements.push(
      this.measurePair(Utils.$(".nav-stat-b-text"), Utils.$(".hero-stat-b-text"), "text_font")
    );

    /* ---- PHASE 2: apply -------------------------------------------------
       The button ghosts are styled like real buttons so they can be measured
       as such, then hidden — the REAL buttons fly onto them. */
    gsap.set(".hero-cta-button", { opacity: 0 });
    gsap.set(".hero-button", { opacity: 0 });

    measurements.forEach((m) => this.applyAnimation(m));

    /* ---- PHASE 3: the dot, after the layout has settled ------------------
       Phase 2 set .nav-logo-item to position:relative, which shifted this
       element. Measuring it any earlier gives a stale rect. */
    const dotReal = Utils.$(".mark-dot");
    const dotGhost = Utils.$(".mark-dot-ghost");
    if (dotReal && dotGhost) {
      const parent = dotReal.closest(".mark-dot-wrap") as HTMLElement;
      const gRect = dotGhost.getBoundingClientRect();
      const pRect = parent.getBoundingClientRect();
      const cs = window.getComputedStyle(dotReal);
      const scale = STATE.sidebarScale;

      gsap.fromTo(
        dotReal,
        {
          x: Math.round((gRect.left - pRect.left) / scale),
          y: Math.round((gRect.top - pRect.top) / scale),
          width: `${gRect.width / scale}px`,
          height: `${gRect.height / scale}px`,
          position: "absolute",
          top: "0px",
          left: "0px",
          transformOrigin: "top left",
          ease: "power1.inOut",
        },
        {
          x: 0,
          y: 0,
          width: cs.width,
          height: cs.height,
          position: "absolute",
          top: "0px",
          left: "0px",
          ease: "power1.inOut",
          force3D: false,
          scrollTrigger: { trigger: ".hero", start: "top top", end: "50% top", scrub: 1 },
        }
      );
    }
  },

  rebuild() {
    this.destroy();
    requestAnimationFrame(() => {
      this.createAll();
      this.initialized = true;
      ScrollTrigger.refresh();
    });
  },
};
