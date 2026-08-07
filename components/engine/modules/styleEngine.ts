/**
 * ATTRIBUTE STYLE ENGINE
 *
 * A declarative layer: markup carries its own animation contract via
 * data-tl-* attributes, so choreography lives next to the element it moves
 * rather than in a growing switchboard of selectors.
 *
 *   data-tl-type     "scroll" -> scrubbed to the trigger's progress
 *                    "trigger" -> plays once on enter
 *   data-tl-trigger  selector for the ScrollTrigger (default ".hero")
 *   data-tl-start    default "900px top"
 *   data-tl-end      default "bottom top"      (scroll type only)
 *   data-tl-from     single-quoted JSON of the from-state
 *   data-tl-to       single-quoted JSON of the to-state (+ duration/ease/stagger)
 *   data-tl-split    "lines" | "words" | "chars"
 *   data-tl-target   child selector to animate instead of the element
 *   data-tl-once     never reverse
 *   data-tl-desktop  skip entirely below 768px
 *   data-number-count  odometer value (takes over from the tween path)
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { STATE, Utils, isMobile, prefersReducedMotion } from "../core";

type Vars = Record<string, unknown>;

export const StyleEngine = {
  init() {
    Utils.$$("[data-tl-type], [data-number-count]").forEach((el) =>
      this.process(el as HTMLElement)
    );
  },

  destroy() {
    STATE.splitInstances.forEach(({ instance, element }) => {
      instance.revert?.();
      // Unwrap the line masks SplitText knows nothing about.
      element.querySelectorAll(".line-mask").forEach((mask) => {
        const line = mask.firstChild;
        if (line) mask.parentNode?.insertBefore(line, mask);
        mask.remove();
      });
      Utils.unmarkSplit(element);
    });
    STATE.splitInstances = [];
  },

  /**
   * Builds the odometer DOM: every character becomes a mask; digits get a
   * 0–9 track so they spin a full cycle before landing on their value.
   * Non-digits render as static text so "'24" keeps its apostrophe.
   */
  setupMaskedNumber(el: HTMLElement) {
    if (el.querySelector(".number-wrap")) return;

    const value = el.getAttribute("data-number-count") || el.textContent?.trim() || "";
    el.textContent = "";

    const wrap = document.createElement("div");
    wrap.className = "number-wrap";
    el.appendChild(wrap);

    [...value].forEach((char) => {
      const mask = document.createElement("div");
      mask.className = "digit-mask";

      if (!isNaN(parseInt(char, 10))) {
        const track = document.createElement("div");
        track.className = "digit-track";
        for (let i = 0; i <= 9; i++) {
          const span = document.createElement("span");
          span.textContent = String(i);
          track.appendChild(span);
        }
        mask.appendChild(track);
        mask.dataset.target = char;
        mask.dataset.isDigit = "true";
      } else {
        mask.textContent = char;
        mask.dataset.isDigit = "false";
      }

      wrap.appendChild(mask);
    });
  },

  process(el: HTMLElement) {
    // data-tl-desktop opts the element out of mobile entirely.
    if (el.hasAttribute("data-tl-desktop") && isMobile()) return;

    const type = el.getAttribute("data-tl-type");
    const numberAttr = el.getAttribute("data-number-count");
    const trigger = el.getAttribute("data-tl-trigger") || ".hero";
    const start = el.getAttribute("data-tl-start") || "900px top";
    const end = el.getAttribute("data-tl-end") || "bottom top";
    const isOnce = el.hasAttribute("data-tl-once");
    const reduced = prefersReducedMotion();

    const fromVars = Utils.parseJSON<Vars>(el.getAttribute("data-tl-from") || "{}", {});
    const toVars = Utils.parseJSON<Vars>(el.getAttribute("data-tl-to") || "{}", {});

    /* ---- odometer path ---------------------------------------------- */
    if (numberAttr !== null) {
      this.setupMaskedNumber(el);
      const masks = Utils.$$('.digit-mask[data-is-digit="true"]', el);

      if (reduced) {
        masks.forEach((mask) => {
          const track = Utils.$(".digit-track", mask);
          const digit = parseInt(mask.dataset.target || "0", 10);
          gsap.set(track, { y: -digit * mask.offsetHeight });
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start,
          toggleActions: isOnce ? "play none none none" : "play none none reverse",
          once: isOnce,
        },
      });

      masks.forEach((mask, i) => {
        const track = Utils.$(".digit-track", mask);
        const digit = parseInt(mask.dataset.target || "0", 10);
        const h = mask.offsetHeight;
        gsap.set(track, { y: h * 9 });
        tl.to(
          track,
          {
            y: -digit * h,
            duration: (toVars.duration as number) || 1.2,
            ease: (toVars.ease as string) || "power3.out",
          },
          i * ((toVars.stagger as number) || 0.06)
        );
      });
      return;
    }

    /* ---- resolve targets --------------------------------------------- */
    const splitType = el.getAttribute("data-tl-split");
    let targets: gsap.TweenTarget;

    const targetSel = el.getAttribute("data-tl-target");
    if (targetSel) {
      targets = Utils.$$(targetSel, el);
    } else if (splitType) {
      if (Utils.isSplit(el)) {
        // Already split by another module — reuse its output.
        targets =
          splitType === "lines"
            ? Utils.$$(".line", el)
            : Utils.$$(`.${splitType.slice(0, -1)}`, el);
      } else {
        const split = new SplitText(el, {
          type: splitType,
          linesClass: "line",
          wordsClass: "word",
          charsClass: "char",
        });
        STATE.splitInstances.push({ instance: split, element: el });
        Utils.markSplit(el);

        if (splitType === "lines") {
          split.lines.forEach((line) => {
            const el2 = line as HTMLElement;
            if (!el2.parentElement?.classList.contains("line-mask")) {
              const wrapper = document.createElement("div");
              wrapper.classList.add("line-mask");
              el2.parentNode?.insertBefore(wrapper, el2);
              wrapper.appendChild(el2);
            }
          });
          targets = split.lines;

          /* Gradient headings use background-clip:text on BOTH the parent and
             each .line. After splitting, the parent still paints its gradient
             at the natural position while each line paints and animates its
             own — a doubled ghost. Neutralise the parent's paint so only the
             children render. */
          const cs = window.getComputedStyle(el);
          if ((cs.webkitBackgroundClip || cs.backgroundClip) === "text") {
            el.style.background = "none";
            el.style.webkitTextFillColor = "transparent";
          }
        } else {
          targets = (split as unknown as Record<string, Element[]>)[splitType];
        }
      }
    } else {
      targets = el;
    }

    /* ---- reduced motion: land on the end state, skip the journey ------ */
    if (reduced) {
      const resting: Vars = { ...toVars };
      delete resting.duration;
      delete resting.ease;
      delete resting.stagger;
      delete resting.delay;
      delete resting.keyframes;
      gsap.set(targets, resting);
      return;
    }

    /* ---- build the tween --------------------------------------------- */
    const tweenConfig: Vars = { ...toVars };

    if (type === "scroll") {
      tweenConfig.scrollTrigger = { trigger, start, end, scrub: 1, once: isOnce || undefined };
    } else {
      if (!tweenConfig.duration) tweenConfig.duration = 0.5;
      if (!tweenConfig.ease) tweenConfig.ease = "power1.inOut";
      /* immediateRender is what makes a reveal a reveal.
         GSAP defaults it to FALSE for a ScrollTrigger tween with no scrub, so
         the from-state was never applied: the element sat at its natural
         appearance, then snapped to `from` and animated up the moment its
         trigger fired. That snap is the visible "jump" — every trigger-type
         reveal on the page had it. Rendering the from-state at creation means
         the element starts hidden and only ever moves one way. */
      tweenConfig.immediateRender = true;
      tweenConfig.scrollTrigger = {
        trigger,
        start,
        toggleActions: isOnce ? "play none none none" : "restart none none reverse",
        once: isOnce,
      };
    }

    gsap.fromTo(targets, fromVars, tweenConfig as gsap.TweenVars);
  },
};
