/**
 * INTERACTION MODULES
 *   CardInteractions — the variable-driven capability chip expansion
 *   TextReveal       — the tonal character scrub on the manifesto
 *   CTAAnimation     — the chat simulation
 *   ImageTrail       — the footer wordmark trail
 *   Faq              — accordion
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONFIG, Utils, isMobile, prefersReducedMotion } from "../core";

/* ==========================================================================
   CARD INTERACTIONS
   The chips expand into full cards by tweening CSS CUSTOM PROPERTIES, not
   the properties themselves. Padding, content width and icon size all read
   their variable from inside a clamp(), so the fluid vw system stays intact
   while GSAP drives a single unitless number. grid-template-rows 0fr -> 1fr
   gives a true auto-height expand with no measured pixel value anywhere.
   ========================================================================== */

export const CardInteractions = {
  /**
   * Make each inline gap exactly as wide as the chip that lands in it, and
   * decide which way that chip's panel should open.
   *
   * The gaps were a flat 9vw while the chips are auto-width and their labels
   * run from "Team" to "AI pipeline" — short chips left a visible hole in the
   * sentence, long ones overhung the following word. Measured instead, so the
   * copy closes around whatever the chip turns out to be.
   *
   * Runs BEFORE MagneticPositions solves: changing an anchor's width reflows
   * the paragraph, which moves every anchor after it.
   */
  sizeAnchors() {
    // Below the collapse point the chips stack under the copy and the inline
    // anchors are display:none, so there is no gap to reserve.
    if (isMobile()) return;

    const section = Utils.$(".what_you_get_section");
    if (!section) return;
    const mid = section.getBoundingClientRect().width * 0.55;

    Utils.$$(".capa-card").forEach((card) => {
      const id = card.getAttribute("data-connect");
      const anchor = document.querySelector<HTMLElement>(
        `.capa-anchor[data-connect="${id}"]`
      );
      const item = Utils.$(".capa-card-item", card);
      if (!anchor || !item) return;

      /* offsetWidth, not getBoundingClientRect: the chip may already be
         mid-reveal at scale 0.6, and a scaled rect would reserve a gap that
         is too small and then leave the chip overlapping the next word. */
      anchor.style.width = `${item.offsetWidth}px`;

      /* The detail panel is up to 23rem wide and hangs from the chip's left
         edge, so for chips in the right of the column it ran off the page.
         Those open leftwards instead. */
      const centre = anchor.getBoundingClientRect().left + item.offsetWidth / 2;
      card.classList.toggle("is-right", centre > mid);
    });
  },

  init() {
    const cards = Utils.$$(".capa-card-item");
    if (!cards.length) return;

    cards.forEach((card) => {
      const parent = card.closest(".capa-card") as HTMLElement | null;
      const panel = Utils.$(".capa-card-bottom", card);
      const body = Utils.$(".capa-card-text", card);

      // Split once, up front. Splitting on hover would reflow mid-animation.
      if (body && !body.dataset.split) {
        const text = body.textContent || "";
        body.textContent = "";
        text.split(/(\s+)/).forEach((chunk) => {
          if (/^\s+$/.test(chunk)) {
            body.appendChild(document.createTextNode(chunk));
            return;
          }
          const span = document.createElement("span");
          span.className = "capa-word";
          span.textContent = chunk;
          body.appendChild(span);
        });
        body.dataset.split = "true";
      }

      if (panel) gsap.set(panel, { autoAlpha: 0, y: -8 });
      gsap.set(Utils.$$(".capa-word", card), { opacity: 0, y: 6 });

      let tl: gsap.core.Timeline | null = null;

      const open = () => {
        if (isMobile()) return;
        if (parent) parent.style.zIndex = "20";
        tl?.kill();
        tl = this.animateIn(card);
      };
      const close = () => {
        if (isMobile()) return;
        tl?.kill();
        tl = this.animateOut(card);
        if (parent) window.setTimeout(() => (parent.style.zIndex = "5"), 260);
      };

      Utils.addEvent(card, "mouseenter", open);
      Utils.addEvent(card, "mouseleave", close);
      Utils.addEvent(card, "focusin", open);
      Utils.addEvent(card, "focusout", close);

      // Touch: tap toggles in place, keeping the chip in the sentence it
      // belongs to rather than lifting it into a modal.
      Utils.addEvent(card, "click", () => {
        if (!isMobile()) return;
        const isOpen = card.classList.toggle("is-open");
        tl?.kill();
        tl = isOpen ? this.animateIn(card) : this.animateOut(card);
      });
    });
  },

  /**
   * The previous version tweened padding through CSS variables. That changes
   * the chip's measured box every frame, MagneticPositions re-solves against
   * the new box, and the two fight — which is the shake. Nothing here touches
   * layout: the chip scales (a transform), and the panel is absolutely
   * positioned so expanding it cannot move anything.
   */
  animateIn(card: HTMLElement) {
    const panel = Utils.$(".capa-card-bottom", card);
    const words = Utils.$$(".capa-word", card);
    const tl = gsap.timeline();

    tl.to(card, { scale: 1.035, duration: 0.5, ease: "expo.out" }, 0);

    if (panel) {
      tl.to(
        panel,
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
        0.04
      );
    }

    if (words.length) {
      gsap.killTweensOf(words);
      // Word-by-word, fast and even — it reads as the sentence arriving
      // rather than as a block fading in.
      tl.to(
        words,
        { opacity: 1, y: 0, duration: 0.34, stagger: 0.026, ease: "power2.out", overwrite: true },
        0.12
      );
    }
    return tl;
  },

  animateOut(card: HTMLElement) {
    const panel = Utils.$(".capa-card-bottom", card);
    const words = Utils.$$(".capa-word", card);
    const tl = gsap.timeline();

    if (words.length) {
      gsap.killTweensOf(words);
      tl.to(
        words,
        { opacity: 0, y: 6, duration: 0.18, stagger: { each: 0.012, from: "end" }, overwrite: true },
        0
      );
    }
    if (panel) tl.to(panel, { autoAlpha: 0, y: -8, duration: 0.28, ease: "power2.in" }, 0.04);
    tl.to(card, { scale: 1, duration: 0.42, ease: "expo.out" }, 0);
    return tl;
  },
};

/* ==========================================================================
   TEXT REVEAL — the manifesto
   Characters are written on in the GROUND colour and darken to black as you
   scroll. Not a fade: a tonal reveal. The splitter preserves any node
   carrying data-connect/data-origin so the magnetically-pinned chips survive
   being embedded mid-sentence.
   ========================================================================== */

export const TextReveal = {
  init() {
    const target = Utils.$(".what_you_get-text");
    if (!target) return;

    /* Split once, re-attach always. The split is destructive and must not
       repeat — but bailing out entirely when already split meant a resize
       (which kills every ScrollTrigger) left the paragraph frozen at whatever
       tone it had scrubbed to, with nothing driving it again. */
    if (!Utils.isSplit(target)) {
      this.split(target);
      Utils.markSplit(target);
    }

    const chars = Utils.$$(".anim-char", target);
    if (!chars.length) return;

    if (prefersReducedMotion()) {
      gsap.set(chars, { color: "#f3efe6", opacity: 1, y: 0 });
      Utils.$$(".capa-card").forEach((c) => c.classList.add("is-revealed"));
      Utils.$(".capa-cards-wrap")?.classList.add("is-armed");
      return;
    }

    /* Where each capability chip sits in the reading, as a fraction of the
       character run. The chips are pinned INSIDE this sentence, so the honest
       trigger for one is the moment the tonal reveal reaches the words it
       belongs to — not a hand-picked scroll percentage, and not a
       ScrollTrigger of its own on a 1px inline anchor. */
    const anchors = Utils.$$(".capa-anchor", target);
    const chipAt = anchors
      .map((a) => {
        const id = a.getAttribute("data-connect");
        const chip = document.querySelector<HTMLElement>(`.capa-card[data-connect="${id}"]`);
        if (!chip) return null;
        const before = chars.filter(
          (c) => a.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_PRECEDING
        ).length;
        return { chip, at: before / Math.max(1, chars.length) };
      })
      .filter(Boolean) as { chip: HTMLElement; at: number }[];

    const wrap = Utils.$(".capa-cards-wrap");
    // Armed only once this is in charge — otherwise a failure here would leave
    // every chip permanently invisible. Same fail-open rule as the timeline.
    if (chipAt.length) wrap?.classList.add("is-armed");

    const revealChips = (p: number) => {
      chipAt.forEach(({ chip, at }) => {
        if (p >= at - 0.04) chip.classList.add("is-revealed");
      });
    };

    /* Spread the stagger across the whole run rather than fixing it per
       character. At a flat 0.1 the ~200 characters of this paragraph asked for
       20s of stagger inside one scrub window, so the opening words carried
       nearly all the visible motion and the tail barely moved before the
       window ended. Scaling by the count keeps the reveal even at any copy
       length — the sentence writes itself on at a constant rate. */
    const spread = 3.2;

    gsap.fromTo(
      chars,
      // Starts at the ground's own tone — invisible against it — and resolves
      // to full ink. A tonal reveal, not a fade.
      { color: "#221f1a", opacity: 0.12, y: 5 },
      {
        color: "#f3efe6",
        opacity: 1,
        y: 0,
        force3D: true,
        duration: 0.5,
        stagger: spread / Math.max(1, chars.length),
        ease: "power1.out",
        scrollTrigger: {
          trigger: target,
          start: "top 88%",
          end: "top 32%",
          scrub: 1,
          onUpdate: (self) => revealChips(self.progress),
          onRefresh: (self) => revealChips(self.progress),
        },
      }
    );
  },

  split(element: HTMLElement) {
    const processNode = (node: Node, container: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        /* Characters are wrapped WORD BY WORD, not one flat run.
           Every .anim-char is an inline-block, so a flat run gives the browser
           a break opportunity between any two letters — "brand thin / king",
           "repeat / ed." It only showed once the measure narrowed, but it was
           always latent. Each word becomes one nowrap box; the spaces between
           them stay real text nodes, so they remain the only break points. */
        (node.textContent || "").split(/( )/).forEach((token) => {
          if (!token) return;
          if (token === " ") {
            container.appendChild(document.createTextNode(token));
            return;
          }
          const word = document.createElement("span");
          word.className = "anim-word";
          token.split("").forEach((char) => {
            const span = document.createElement("span");
            span.className = "anim-char";
            span.textContent = char;
            word.appendChild(span);
          });
          container.appendChild(word);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const preserve =
          el.hasAttribute("data-connect") ||
          el.hasAttribute("data-origin") ||
          el.tagName === "BR" ||
          el.tagName === "IMG";

        if (preserve) {
          container.appendChild(el.cloneNode(true));
        } else {
          const wrapper = el.cloneNode(false);
          Array.from(el.childNodes).forEach((child) => processNode(child, wrapper));
          if (wrapper.childNodes.length) container.appendChild(wrapper);
        }
      }
    };

    const fragment = document.createDocumentFragment();
    Array.from(element.childNodes).forEach((n) => processNode(n, fragment));
    element.innerHTML = "";
    element.appendChild(fragment);
  },
};

/* ==========================================================================
   CTA ANIMATION
   One typing indicator physically travels between message slots. Every
   bubble lands with a 1 -> 1.03 -> 1 overshoot, which is what sells it as a
   real message arriving rather than a div appearing.
   ========================================================================== */

export const CTAAnimation = {
  init() {
    const wrap = Utils.$(".cta-wrap");
    if (!wrap) return;

    const typingGrid = Utils.$(".typing-grid", wrap);
    const typingBubble = Utils.$(".cta-bubble", typingGrid ?? wrap);
    const chatGrid = Utils.$(".cta-chat-grid", wrap);
    const chatBubble = chatGrid ? Utils.$(".cta-bubble", chatGrid) : null;
    const chatText = chatGrid ? Utils.$(".cta-text", chatGrid) : null;
    const buttonGrid = Utils.$(".cta-button-grid", wrap);
    const buttonBubble = buttonGrid ? Utils.$(".cta-bubble", buttonGrid) : null;
    const buttonText = buttonGrid ? buttonGrid.querySelector("p") : null;
    const dots = Utils.$$(".typing-dot", wrap);
    if (!typingGrid || !chatGrid || !buttonGrid) return;

    const speed = CONFIG.ctaSpeed;

    if (prefersReducedMotion()) {
      gsap.set([chatGrid, buttonGrid], { gridTemplateRows: "1fr" });
      gsap.set([chatBubble, buttonBubble], { scale: 1, opacity: 1 });
      gsap.set([chatText, buttonText], { opacity: 1, filter: "none" });
      gsap.set(typingGrid, { display: "none" });
      return;
    }

    gsap.set([chatGrid, buttonGrid], { gridTemplateRows: "0fr" });
    gsap.set(typingGrid, { gridTemplateRows: "1fr" });
    [typingBubble, chatBubble, buttonBubble].forEach((b) => {
      if (b) gsap.set(b, { scale: 0, opacity: 0, transformOrigin: "bottom left" });
    });
    if (chatText) gsap.set(chatText, { opacity: 0, filter: "blur(4px)" });
    if (buttonText) gsap.set(buttonText, { opacity: 0, filter: "blur(4px)" });
    gsap.set(dots, { y: 0, opacity: 0.6 });

    const dotsTl = gsap.timeline({ repeat: -1, paused: true });
    dotsTl
      .to(dots, { y: -6, opacity: 1, duration: 0.35 * speed, stagger: 0.15 * speed, ease: "power1.inOut" })
      .to(dots, { y: 0, opacity: 0.6, duration: 0.35 * speed, stagger: 0.15 * speed, ease: "power1.inOut" });

    const offset = (from: HTMLElement, to: HTMLElement) => {
      const f = from.getBoundingClientRect();
      const t = to.getBoundingClientRect();
      return { x: t.left - f.left, y: t.top - f.top };
    };

    /** scale 0 -> 1 with a springy overshoot, then settle. */
    const pop = (tl: gsap.core.Timeline, bubble: HTMLElement | null) => {
      if (!bubble) return;
      tl.to(bubble, { scale: 1, opacity: 1, duration: 0.5 * speed, ease: "back.out(1.7)" }, "-=0.1");
      tl.to(bubble, { scale: 1.03, duration: 0.1 * speed, ease: "power2.out" }, "-=0.1");
      tl.to(bubble, { scale: 1, duration: 0.15 * speed, ease: "power2.inOut" });
    };

    ScrollTrigger.create({
      trigger: wrap,
      start: "top 90%",
      once: true,
      onEnter: () => {
        const chatOffset = offset(typingGrid, chatGrid);
        const buttonOffset = offset(typingGrid, buttonGrid);
        gsap.set(typingGrid, { x: chatOffset.x, y: chatOffset.y });

        const tl = gsap.timeline();

        // Phase 1 — typing, at the chat slot
        tl.to(typingBubble, { scale: 1, opacity: 1, duration: 0.5 * speed, ease: "back.out(1.7)" });
        tl.to(typingBubble, { scale: 1.03, duration: 0.1 * speed, ease: "power2.out" }, "-=0.1");
        tl.to(typingBubble, { scale: 1, duration: 0.15 * speed, ease: "power2.inOut" });
        tl.call(() => dotsTl.play(), undefined, "-=0.2");

        // Phase 2 — chat lands, typing moves on
        tl.to(typingGrid, { x: buttonOffset.x, y: buttonOffset.y, duration: 0.4 * speed, ease: "power2.inOut" }, "+=0.5");
        tl.to(chatGrid, { gridTemplateRows: "1fr", duration: 0.3 * speed, ease: "power2.out" }, "<0.1");
        pop(tl, chatBubble);
        if (chatText)
          tl.to(chatText, { opacity: 1, filter: "blur(0px)", duration: 0.4 * speed, ease: "power2.out" }, "-=0.2");

        // Phase 3 — button lands, typing returns home
        tl.to(typingGrid, { x: 0, y: 0, duration: 0.4 * speed, ease: "power2.inOut" }, "+=0.5");
        tl.to(buttonGrid, { gridTemplateRows: "1fr", duration: 0.3 * speed, ease: "power2.out" }, "<0.1");
        pop(tl, buttonBubble);
        if (buttonText)
          tl.to(buttonText, { opacity: 1, filter: "blur(0px)", duration: 0.4 * speed, ease: "power2.out" }, "-=0.2");

        // Phase 4 — typing leaves
        tl.call(() => dotsTl.pause(), undefined, "+=0.3");
        tl.to(typingBubble, { scale: 0, opacity: 0, duration: 0.4 * speed, ease: "back.in(1.7)" });
      },
    });
  },
};

/* ==========================================================================
   IMAGE TRAIL — footer wordmark
   Images are appended INSIDE the mark's SVG, so they are clipped to the
   letterforms and only ever appear within the name.
   ========================================================================== */

export const ImageTrail = {
  config: {
    minDistance: 14,
    maxImages: 16,
    fadeOutDelay: 100,
    fadeOutInterval: 50,
    imageWidth: 66,
    imageHeight: 92,
    maxRotation: 30,
  },
  images: [] as string[],
  trail: [] as SVGImageElement[],
  index: 0,
  lastX: 0,
  lastY: 0,
  moveTimeout: null as ReturnType<typeof setTimeout> | null,
  fadeInterval: null as ReturnType<typeof setInterval> | null,
  svg: null as SVGSVGElement | null,
  group: null as SVGGElement | null,

  init() {
    if (isMobile() || prefersReducedMotion()) return;

    const wrapper = Utils.$(".footer-logo");
    this.svg = document.querySelector(".footer-logo-icon");
    this.group = document.querySelector("#image-trail-group");
    if (!wrapper || !this.svg || !this.group) return;

    const data = wrapper.getAttribute("data-trail-images");
    this.images = data ? data.split(",").map((s) => s.trim()).filter(Boolean) : [];
    if (!this.images.length) return;

    this.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    Utils.addEvent(wrapper, "mousemove", ((e: MouseEvent) => this.onMove(e)) as EventListener);
    Utils.addEvent(wrapper, "mouseleave", () => {
      if (this.moveTimeout) clearTimeout(this.moveTimeout);
      this.startFade();
    });
  },

  toSvgCoords(e: MouseEvent) {
    const rect = (this.svg as SVGSVGElement).getBoundingClientRect();
    const vb = (this.svg as SVGSVGElement).viewBox.baseVal;
    return {
      x: ((e.clientX - rect.left) / rect.width) * vb.width,
      y: ((e.clientY - rect.top) / rect.height) * vb.height,
    };
  },

  addImage(x: number, y: number) {
    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttribute("href", this.images[this.index++ % this.images.length]);
    img.setAttribute("x", String(x - this.config.imageWidth / 2));
    img.setAttribute("y", String(y - this.config.imageHeight / 2));
    img.setAttribute("width", String(this.config.imageWidth));
    img.setAttribute("height", String(this.config.imageHeight));
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    img.setAttribute(
      "transform",
      `rotate(${(Math.random() - 0.5) * this.config.maxRotation} ${x} ${y})`
    );
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease-out";

    this.group?.appendChild(img);
    requestAnimationFrame(() => (img.style.opacity = "1"));
    this.trail.push(img);

    if (this.trail.length > this.config.maxImages) {
      const old = this.trail.shift();
      if (old) {
        old.style.opacity = "0";
        setTimeout(() => old.remove(), 300);
      }
    }
  },

  startFade() {
    if (this.fadeInterval) return;
    // FIFO drain — oldest first, so the trail dissolves from the tail.
    this.fadeInterval = setInterval(() => {
      if (!this.trail.length) {
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        return;
      }
      const img = this.trail.shift();
      if (img) {
        img.style.opacity = "0";
        setTimeout(() => img.remove(), 300);
      }
    }, this.config.fadeOutInterval);
  },

  onMove(e: MouseEvent) {
    const pos = this.toSvgCoords(e);
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (Math.hypot(pos.x - this.lastX, pos.y - this.lastY) > this.config.minDistance) {
      this.addImage(pos.x, pos.y);
      this.lastX = pos.x;
      this.lastY = pos.y;
    }
    if (this.moveTimeout) clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => this.startFade(), this.config.fadeOutDelay);
  },

  destroy() {
    if (this.moveTimeout) clearTimeout(this.moveTimeout);
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.fadeInterval = null;
    this.trail.forEach((i) => i.remove());
    this.trail = [];
    this.index = 0;
  },
};

/* ==========================================================================
   FAQ — grid-template-rows 0fr -> 1fr, so the panel animates to its true
   auto height without measuring anything.
   ========================================================================== */

export const Faq = {
  init() {
    Utils.$$(".faq").forEach((faq) => {
      const toggle = Utils.$(".faq-toggle", faq) as HTMLButtonElement | null;
      if (!toggle) return;
      Utils.addEvent(toggle, "click", () => {
        const open = faq.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    });
  },
};
