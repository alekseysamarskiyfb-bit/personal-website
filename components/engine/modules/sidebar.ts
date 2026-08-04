/**
 * SIDEBAR MODULES — auto-scale, click-to-copy, button hover.
 */

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CONFIG, STATE, Utils, isMobile, prefersReducedMotion } from "../core";
import { EMAIL } from "@/components/site/navData";

/**
 * AUTO-SCALE
 * On short viewports the rail is scaled as ONE unit rather than reflowed, so
 * its internal proportions never change. The factor is then divided back out
 * of every ghost-engine measurement — get that wrong and the whole hero morph
 * drifts. The portrait gets the inverse applied so it stays full-bleed.
 */
export const Sidebar = {
  init() {
    this.scale();
  },

  scale() {
    if (isMobile()) return;

    const sidebar = Utils.$(".nav-container");
    if (!sidebar) return;

    const availableHeight = window.innerHeight - CONFIG.sidebarPadding;
    STATE.sidebarScale = Math.min(1, availableHeight / sidebar.scrollHeight);

    gsap.set(sidebar, {
      scale: STATE.sidebarScale,
      transformOrigin: "top left",
      force3D: false,
    });

    const inverse = 1 / STATE.sidebarScale;

    const portrait = Utils.$(".profile-img-wrap");
    if (portrait && portrait.closest(".nav-container")) {
      gsap.set(portrait, { scale: inverse, transformOrigin: "top left", force3D: false });
    }
  },
};

/**
 * CLICK-TO-COPY
 * Bound to the whole email item, not just the glyph. The reset back to
 * "Copy to clipboard" happens inside the fade-out's onComplete so the label
 * is never seen reverting while still visible.
 */
export const Clipboard = {
  init() {
    Utils.$$(".nav-email-item").forEach((container) => {
      const item = Utils.$(".clipboard-item", container);
      const text = item?.querySelector("p");
      const glyph = Utils.$(".clipboard-glyph", container);
      const icon = Utils.$(".clipboard-icon", container);
      if (!item || !text) return;

      let isClicked = false;

      gsap.set(item, { opacity: 0, y: 10 });
      if (icon) gsap.set(icon, { display: "none" });

      const enter = () => gsap.to(item, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });

      const leave = () =>
        gsap.to(item, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            text.textContent = "Copy to clipboard";
            if (icon) gsap.set(icon, { display: "none" });
            if (glyph) gsap.set(glyph, { display: "block" });
            gsap.set(item, { backgroundColor: "" });
            isClicked = false;
          },
        });

      const copy = async () => {
        if (isClicked) return;
        try {
          await navigator.clipboard.writeText(EMAIL);
          isClicked = true;
          text.textContent = "Email copied";

          if (glyph) gsap.set(glyph, { display: "none" });
          if (icon) {
            gsap.set(icon, { display: "block" });
            gsap.fromTo(
              icon,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
          }
          gsap.to(item, {
            backgroundColor: "#8f5cff",
            color: "#ffffff",
            duration: 0.3,
            ease: "power2.out",
          });
        } catch {
          text.textContent = EMAIL;
        }
      };

      Utils.addEvent(container, "mouseenter", enter);
      Utils.addEvent(container, "mouseleave", leave);
      Utils.addEvent(container, "focusin", enter);
      Utils.addEvent(container, "focusout", leave);
      Utils.addEvent(container, "click", copy as EventListener);
      Utils.addEvent(container, "keydown", ((e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void copy();
        }
      }) as EventListener);
    });
  },
};

/**
 * BUTTON HOVER — word-level vertical swap.
 * The label and a clone are stacked in an overflow:hidden mask; on enter the
 * visible copy rolls up and out while the hidden copy rolls up into place.
 * A direction flag alternates which copy is showing, so repeated hovers keep
 * rolling the SAME way instead of bouncing back and forth.
 */
export const ButtonHover = {
  init() {
    if (isMobile() || prefersReducedMotion()) return;

    Utils.$$("[data-button-hover]").forEach((el) => {
      const isTextLink = el.tagName === "A" && !el.querySelector("p");

      let originalTarget: HTMLElement;
      let cloneTarget: HTMLElement;

      if (isTextLink) {
        el.classList.add("is-text-link");

        /* The preloader already wrapped nav links in .nav-link-mask-inner for
           their y-reveal. Re-wrapping the whole element would nest that
           wrapper inside both copies, so the reveal transform would then
           drive two stacked duplicates. Reuse it as the mask instead. */
        const preloaderInner = el.querySelector(".nav-link-mask-inner") as HTMLElement | null;
        const host = preloaderInner ?? el;

        const originalSpan = document.createElement("span");
        originalSpan.innerHTML = host.innerHTML;
        const cloneSpan = document.createElement("span");
        cloneSpan.innerHTML = host.innerHTML;
        cloneSpan.classList.add("clone-text");

        host.innerHTML = "";
        host.appendChild(originalSpan);
        host.appendChild(cloneSpan);

        originalTarget = originalSpan;
        cloneTarget = cloneSpan;
      } else {
        const originalP = el.querySelector("p");
        if (!originalP) return;

        const mask = document.createElement("div");
        mask.classList.add("btn-mask");
        originalP.parentNode?.insertBefore(mask, originalP);
        mask.appendChild(originalP);

        const cloneP = originalP.cloneNode(true) as HTMLElement;
        cloneP.classList.add("clone-p");
        mask.appendChild(cloneP);

        originalTarget = originalP;
        cloneTarget = cloneP;
      }

      const splitA = new SplitText(originalTarget, { type: "words", wordsClass: "word" });
      const splitB = new SplitText(cloneTarget, { type: "words", wordsClass: "word" });

      const h = originalTarget.offsetHeight;
      gsap.set(splitB.words, { y: h });

      let showingA = true;
      let tl: gsap.core.Timeline | null = null;

      Utils.addEvent(el, "mouseenter", () => {
        if (tl) tl.kill();
        tl = gsap.timeline();

        const out = showingA ? splitA.words : splitB.words;
        const incoming = showingA ? splitB.words : splitA.words;

        tl.to(out, { y: -h, duration: 0.5, stagger: 0.05, ease: "power2.out" });
        tl.fromTo(
          incoming,
          { y: h },
          { y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" },
          "<"
        );

        showingA = !showingA;
      });
    });
  },
};
