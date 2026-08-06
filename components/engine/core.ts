/**
 * ANIMATION ENGINE — core
 *
 * Shared configuration, mutable state and DOM utilities for every module.
 *
 * The engine is deliberately framework-agnostic: React renders declarative
 * markup, then a single mount pass runs the modules against the real DOM in a
 * fixed order. This matters — the whole system depends on strict
 * measure-then-mutate phase separation, which React's render lifecycle would
 * otherwise scramble.
 */

import type Lenis from "lenis";

export const MOBILE_BREAKPOINT = 768;

export const CONFIG = {
  /** Vertical breathing room subtracted before the sidebar auto-scales. */
  sidebarPadding: 40,
  /** Delay before the preloader timeline starts. */
  preloaderDelay: 0.2,
  /** Global tempo dial for the CTA chat simulation. */
  ctaSpeed: 0.728,
  resizeDebounce: 150,
  magneticInitDelay: 300,
  horizontalScrollDelay: 100,
  /** Scroll is locked this long so the reveal chain cannot be interrupted. */
  introLockMs: 3000,
  lenis: {
    /**
     * NOTE: Lenis uses `lerp` when both `lerp` and `duration` are present —
     * duration/easing are only consulted when lerp is absent. The effective
     * feel is therefore lerp 0.1. Both are kept so the behaviour matches the
     * reference exactly rather than approximately.
     */
    duration: 0.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    lerp: 0.1,
  },
} as const;

type SplitLike = { revert?: () => void };

export const STATE: {
  sidebarScale: number;
  workTween: gsap.core.Tween | null;
  lenis: Lenis | null;
  splitInstances: { instance: SplitLike; element: HTMLElement }[];
  eventListeners: {
    target: EventTarget;
    event: string;
    handler: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  }[];
  initialized: boolean;
  /**
   * True once the intro has been shown (or deliberately skipped — mobile,
   * reduced motion). Survives destroyAll, because a resize must NOT replay the
   * intro: it re-runs every module, and without this flag the rail's
   * `opacity: 0` was never turned back on and the page stayed blank.
   */
  introPlayed: boolean;
} = {
  sidebarScale: 1,
  workTween: null,
  lenis: null,
  splitInstances: [],
  eventListeners: [],
  initialized: false,
  introPlayed: false,
};

export const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const Utils = {
  $<T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) {
    return scope.querySelector<T>(selector);
  },

  $$<T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) {
    return Array.from(scope.querySelectorAll<T>(selector));
  },

  /**
   * Parses the single-quoted pseudo-JSON used by the data-tl-* attributes.
   * Authored with single quotes so it survives being written inline in HTML.
   */
  parseJSON<T = Record<string, unknown>>(str: string, fallback: T): T {
    try {
      return JSON.parse(str.replace(/'/g, '"')) as T;
    } catch {
      return fallback;
    }
  },

  parseUnit(value: string | null | undefined) {
    if (!value || value === "0") return { value: 0, unit: "px" as const };
    const match = String(value).match(/^(-?[\d.]+)(px|%|vw|vh|rem|em)?$/i);
    if (!match) return { value: 0, unit: "px" as const };
    return {
      value: parseFloat(match[1]),
      unit: (match[2] || "px").toLowerCase(),
    };
  },

  toPx(parsed: { value: number; unit: string }, ref = 0) {
    const { value, unit } = parsed;
    switch (unit) {
      case "%":
        return (value / 100) * ref;
      case "vw":
        return (value / 100) * window.innerWidth;
      case "vh":
        return (value / 100) * window.innerHeight;
      case "rem":
        return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
      default:
        return value;
    }
  },

  debounce<A extends unknown[]>(fn: (...args: A) => void, delay = 100) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: A) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /** Registers a listener AND records it so destroyAll can unwind cleanly. */
  addEvent(
    target: EventTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(event, handler, options);
    STATE.eventListeners.push({ target, event, handler, options });
  },

  /* SplitText runs once per element. These guards prevent double-wrapping
     when several modules touch the same node (e.g. the preloader splitting a
     heading the StyleEngine also wants). */
  markSplit(el: HTMLElement) {
    el.dataset.split = "true";
  },
  isSplit(el: HTMLElement) {
    return el.dataset.split === "true";
  },
  unmarkSplit(el: HTMLElement) {
    delete el.dataset.split;
  },
};
