/**
 * PRELOADER + HERO REVEAL
 *
 * A giant mark flies in from the right, centres, its letters rise, then it
 * climbs into the hero's mark slot and hands off to the real (SVG) mark in a
 * single frame. The hero then reveals in a deliberate ~50% cascade: each
 * group starts at roughly half the previous group's duration.
 *
 * Two orderings are load-bearing:
 *   - .nav-logo-item is hidden at t=0, AFTER the ghost engine has measured
 *     its children. Hide it any earlier and every FLIP pair measures zero.
 *   - The nav links reveal no earlier than heroReveal+0.6. Earlier collides
 *     with the mark handoff and the row visibly glitches.
 *
 * Reveal grammar, applied consistently: TEXT slides from behind a mask;
 * OBJECTS arrive with blur + scale + alpha together. Nothing simply fades.
 */

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CONFIG, STATE, Utils, isMobile, prefersReducedMotion } from "../core";

export const Preloader = {
  timeline: null as gsap.core.Timeline | null,

  init() {
    if (isMobile()) return;

    const logo = Utils.$(".mark-preload");
    const wrapper = Utils.$(".mark-preload-wrap");
    if (!logo || !wrapper) return;

    const letters = Utils.$$(".mark-preload .mark-letter");
    const navContainer = Utils.$(".nav-container");
    const navLogoItem = Utils.$(".nav-logo-item");
    const profileImgItem = Utils.$(".profile-img-item");
    const navLinks = Utils.$$(".hero-navigation-link");
    const navSeps = Utils.$$(".hero-navigation-sep");
    const heroCard3 = Utils.$(".hero-card-3");
    const heroHeading = Utils.$(".hero-heading");
    const heroLeftText = Utils.$(".hero-left-text");
    const heroRightText = Utils.$(".hero-right-text");
    const navButton = Utils.$(".nav-button");
    const navButtonSecondary = Utils.$(".nav-button-secondary");

    /* Reduced motion: land everything on its resting state, skip the show. */
    if (prefersReducedMotion()) {
      gsap.set(wrapper, { display: "none" });
      gsap.set(navContainer, { autoAlpha: 1 });
      gsap.set(
        [profileImgItem, heroCard3, navButton, navButtonSecondary],
        { autoAlpha: 1, scale: 1, filter: "none" }
      );
      gsap.set([heroHeading, heroLeftText, heroRightText], { visibility: "visible", autoAlpha: 1 });
      gsap.set(navSeps, { autoAlpha: 1, height: "0.8vw" });
      gsap.set(navLinks, { autoAlpha: 1 });
      gsap.set(
        Utils.$$(
          ".nav-stat-a-bg, .nav-stat-a-icon, .nav-stat-a-text, .nav-stat-b-bg, .nav-stat-b-numb, .nav-stat-b-text"
        ),
        { autoAlpha: 1, filter: "none" }
      );
      return;
    }

    /* Split helper. With a mask, wraps each line in overflow:hidden and
       pushes it down; without, the caller owns the initial state. */
    const splitLines = (el: HTMLElement | null, useMask = true) => {
      if (!el || Utils.isSplit(el)) return [];
      const split = new SplitText(el, { type: "lines", linesClass: "line" });
      STATE.splitInstances.push({ instance: split, element: el });
      Utils.markSplit(el);
      if (useMask) {
        split.lines.forEach((line) => {
          const l = line as HTMLElement;
          if (!l.parentElement?.classList.contains("line-mask")) {
            const mask = document.createElement("div");
            mask.classList.add("line-mask");
            l.parentNode?.insertBefore(mask, l);
            mask.appendChild(l);
          }
        });
        gsap.set(split.lines, { yPercent: 100 });
      }
      gsap.set(el, { visibility: "visible" });
      return split.lines as HTMLElement[];
    };

    const headingLines = splitLines(heroHeading, false);
    splitLines(heroLeftText);
    splitLines(heroRightText);
    if (heroLeftText) gsap.set(heroLeftText, { autoAlpha: 0 });
    if (heroRightText) gsap.set(heroRightText, { autoAlpha: 0 });

    const rect = wrapper.getBoundingClientRect();
    const xToCenter = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const yToCenter = window.innerHeight / 2 - (rect.top + rect.height / 2);

    gsap.set(logo, { autoAlpha: 1, y: yToCenter, x: window.innerWidth });
    // 110, not 100 — an overshoot so descender overhang stays fully hidden.
    gsap.set(letters, { yPercent: 110 });
    gsap.set(navSeps, { height: "0vw", autoAlpha: 1 });

    const navLogoItemDisplay = navLogoItem
      ? window.getComputedStyle(navLogoItem).display || "flex"
      : "flex";

    const tl = gsap.timeline({ delay: CONFIG.preloaderDelay });
    this.timeline = tl;

    // Fires AFTER the ghost engine measured these children.
    if (navLogoItem) tl.set(navLogoItem, { display: "none" }, 0);

    tl.to(logo, { x: xToCenter, duration: 1, ease: "power3.inOut" });
    tl.to(letters, { yPercent: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "<");
    tl.to(logo, { x: 0, y: 0, duration: 1, ease: "power2.inOut" }, 1);

    /* Rail on at 1.4 — 40% through the mark's climb — so the reveal chain can
       overlap the tail of the intro instead of queueing behind it. */
    tl.set(navContainer, { autoAlpha: 1 }, 1.4);
    tl.set(logo, { display: "none" }, 2);
    if (navLogoItem) tl.set(navLogoItem, { display: navLogoItemDisplay }, 2);

    /* Mask-wrap each nav link for a y-reveal with no opacity change. */
    const navLinkInners: HTMLElement[] = [];
    navLinks.forEach((link) => {
      link.style.overflow = "hidden";
      const inner = document.createElement("div");
      inner.classList.add("nav-link-mask-inner");
      while (link.firstChild) inner.appendChild(link.firstChild);
      link.appendChild(inner);
      navLinkInners.push(inner);
      gsap.set(inner, { yPercent: 100 });
      gsap.set(link, { autoAlpha: 1, pointerEvents: "none" });
    });

    const statChildren = Utils.$$(
      ".nav-stat-a-bg, .nav-stat-a-icon, .nav-stat-a-text, .nav-stat-b-bg, .nav-stat-b-numb, .nav-stat-b-text"
    );
    if (statChildren.length) gsap.set(statChildren, { autoAlpha: 0, filter: "blur(8px)" });
    if (navButton) gsap.set(navButton, { autoAlpha: 0, scale: 0.94, filter: "blur(10px)" });
    if (navButtonSecondary)
      gsap.set(navButtonSecondary, { autoAlpha: 0, scale: 0.94, filter: "blur(10px)" });
    if (heroCard3) gsap.set(heroCard3, { autoAlpha: 0, filter: "blur(8px)" });
    if (profileImgItem)
      gsap.set(profileImgItem, {
        autoAlpha: 0,
        scale: 0.88,
        filter: "blur(20px)",
        transformOrigin: "center bottom",
      });
    if (headingLines.length)
      gsap.set(headingLines, { autoAlpha: 0, scale: 0.9, filter: "blur(10px)" });

    tl.addLabel("heroReveal", 1.4);

    // 1 — portrait
    if (profileImgItem) {
      tl.to(
        profileImgItem,
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out" },
        "heroReveal"
      );
    }

    // 2 — headline, per line
    if (headingLines.length) {
      tl.to(
        headingLines,
        {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.0,
          stagger: 0.1,
          ease: "power2.out",
        },
        "heroReveal+=0.3"
      );
    }

    // 3 — links + separators, concurrently. 0.6 is the floor.
    const linkDur = 0.4;
    const navStart = "heroReveal+=0.6";
    if (navLinkInners.length) {
      tl.to(navLinkInners, { yPercent: 0, duration: linkDur, ease: "power2.out" }, navStart);
      tl.set(navLinks, { pointerEvents: "auto" }, `${navStart}+=${linkDur}`);
    }
    if (navSeps.length) {
      tl.to(navSeps, { height: "0.8vw", duration: 0.2, ease: "power2.out" }, navStart);
    }

    // 4 — stat trios then the traits card, 0.1 apart
    const cardOrder = [
      Utils.$(".nav-stat-a-bg"),
      Utils.$(".nav-stat-a-icon"),
      Utils.$(".nav-stat-a-text"),
      Utils.$(".nav-stat-b-bg"),
      Utils.$(".nav-stat-b-numb"),
      Utils.$(".nav-stat-b-text"),
      heroCard3,
    ];
    cardOrder.forEach((el, i) => {
      if (!el) return;
      tl.to(
        el,
        { autoAlpha: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
        `heroReveal+=${0.6 + i * 0.1}`
      );
    });

    // 5 — buttons (cards start 0.6, 50% of 0.9 = 0.45 -> 1.25)
    if (navButton)
      tl.to(
        navButton,
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
        "heroReveal+=1.25"
      );
    if (navButtonSecondary)
      tl.to(
        navButtonSecondary,
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
        "heroReveal+=1.33"
      );

    // 6 — ground paragraphs (buttons start 1.25, 50% of 0.8 = 0.4 -> 1.65)
    const revealParagraph = (el: HTMLElement | null) => {
      if (!el) return;
      gsap.set(el, { autoAlpha: 1 });
      const lines = Utils.$$(".line", el);
      if (!lines.length) return;
      gsap.set(lines, { yPercent: 100, autoAlpha: 0, filter: "blur(6px)" });
      gsap.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.075,
        ease: "power2.out",
      });
    };

    tl.call(() => revealParagraph(heroLeftText), undefined, "heroReveal+=1.65");
    tl.call(() => revealParagraph(heroRightText), undefined, "heroReveal+=1.75");
  },

  destroy() {
    this.timeline?.kill();
    this.timeline = null;
  },
};

/**
 * The portrait now renders inside the hero rather than inside the rail, so
 * the old reparent-to-body handoff is gone: there is no scaled ancestor left
 * to trap its positioning, and nothing to hand off.
 */
