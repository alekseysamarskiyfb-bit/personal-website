/**
 * INTERACTION MODULES
 *   CardInteractions — the variable-driven capability chip expansion
 *   TextReveal       — the tonal character scrub on the manifesto
 *   CTAAnimation     — the chat simulation
 *   ImageTrail       — the footer wordmark trail
 *   Carousel         — testimonials + custom drag cursor
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
  init() {
    const cards = Utils.$$(".capa-card-item");
    if (!cards.length) return;

    const letters = Utils.$$(".gsap-icon-letter");
    if (letters.length) gsap.set(letters, { opacity: 0 });

    cards.forEach((card) => {
      const parent = card.closest(".capa-card") as HTMLElement | null;

      const open = () => {
        if (isMobile()) return;
        if (parent) parent.style.zIndex = "10";
        this.animateIn(card);
      };
      const close = () => {
        if (isMobile()) return;
        this.animateOut(card);
        if (parent) parent.style.zIndex = "5";
      };

      Utils.addEvent(card, "mouseenter", open);
      Utils.addEvent(card, "mouseleave", close);
      Utils.addEvent(card, "focusin", open);
      Utils.addEvent(card, "focusout", close);

      // Touch: tap toggles in place rather than opening a modal, which keeps
      // the chip anchored in the sentence it belongs to.
      Utils.addEvent(card, "click", () => {
        if (!isMobile()) return;
        const isOpen = card.classList.toggle("is-open");
        if (isOpen) this.animateIn(card, true);
        else this.animateOut(card);
      });
    });
  },

  animateIn(card: HTMLElement, mobile = false) {
    const bottom = Utils.$(".capa-card-bottom", card);
    const icons = Utils.$$("[data-var-hover]", card);
    const letters = Utils.$$(".gsap-icon-letter", card);
    const tl = gsap.timeline();

    tl.to(card, {
      "--card-text": 1,
      "--card-pad-y": mobile ? 2.61 : 1.35,
      "--card-pad-x": mobile ? 1.35 : 1.25,
      duration: 0.65,
      ease: "power3.out",
    });

    if (bottom) tl.to(bottom, { gridTemplateRows: "1fr", duration: 0.65, ease: "power3.out" }, "<");

    icons.forEach((icon) =>
      tl.to(
        icon,
        {
          "--card-icon": parseFloat(icon.dataset.varHover || "1") || 1,
          duration: 0.65,
          ease: "power3.out",
        },
        "<"
      )
    );

    if (letters.length) {
      // Kill in-flight tweens first — a fast in/out cycle otherwise leaves
      // future-staggered letters stranded visible.
      gsap.killTweensOf(letters);
      tl.fromTo(
        letters,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", overwrite: true },
        "<"
      );
    }
    return tl;
  },

  animateOut(card: HTMLElement) {
    const bottom = Utils.$(".capa-card-bottom", card);
    const icons = Utils.$$("[data-var-hover]", card);
    const letters = Utils.$$(".gsap-icon-letter", card);
    const tl = gsap.timeline();

    if (bottom) tl.to(bottom, { gridTemplateRows: "0fr", duration: 0.65, ease: "power2.out" });

    tl.to(
      card,
      { "--card-text": 0, "--card-pad-y": 1, "--card-pad-x": 1, duration: 0.65, ease: "power2.out" },
      "<"
    );

    icons.forEach((icon) =>
      tl.to(icon, { "--card-icon": 1, duration: 0.65, ease: "power2.out" }, "<")
    );

    if (letters.length) {
      gsap.killTweensOf(letters);
      // Reverse stagger on exit: letters retract in the order they'd recede.
      tl.to(
        letters,
        {
          opacity: 0,
          duration: 0.3,
          stagger: { each: 0.05, from: "end" },
          ease: "power2.out",
          overwrite: true,
        },
        "<"
      );
    }
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
    if (!target || Utils.isSplit(target)) return;

    this.split(target);
    Utils.markSplit(target);

    const chars = Utils.$$(".anim-char", target);
    if (!chars.length) return;

    if (prefersReducedMotion()) {
      gsap.set(chars, { color: "#f3efe6", opacity: 1, y: 0 });
      return;
    }

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
        stagger: 0.1,
        ease: "power1.out",
        scrollTrigger: { trigger: target, start: "top 92%", end: "top 25%", scrub: 1 },
      }
    );
  },

  split(element: HTMLElement) {
    const processNode = (node: Node, container: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        (node.textContent || "").split("").forEach((char) => {
          const span = document.createElement("span");
          span.className = "anim-char";
          span.textContent = char;
          container.appendChild(span);
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
    minDistance: 30,
    maxImages: 20,
    fadeOutDelay: 100,
    fadeOutInterval: 50,
    imageWidth: 200,
    imageHeight: 280,
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
   CAROUSEL + DRAG CURSOR
   Hand-written rather than pulled from a library, matching the reference's
   Swiper configuration: one slide per view, 14px gap, 500ms, resistance
   0.85 past the ends. The native cursor is suppressed and replaced by a
   fixed indicator whose arrows scale with drag direction.
   ========================================================================== */

export const Carousel = {
  index: 0,
  count: 0,
  track: null as HTMLElement | null,
  root: null as HTMLElement | null,
  dragWrap: null as HTMLElement | null,
  dragging: false,
  startX: 0,
  startY: 0,
  lastDirection: null as "left" | "right" | null,
  pointerId: null as number | null,

  init() {
    this.root = Utils.$(".swiper");
    this.track = Utils.$(".swiper-wrapper");
    this.dragWrap = Utils.$(".drag-wrap");
    if (!this.root || !this.track) return;

    this.count = Utils.$$(".swiper-slide", this.track).length;
    if (!this.count) return;

    this.buildBullets();
    this.goTo(0, false);

    Utils.addEvent(window, "resize", () => this.goTo(this.index, false));

    if (this.dragWrap) gsap.set(this.dragWrap, { opacity: 0, scale: 0.8, xPercent: -50, yPercent: -50 });

    const root = this.root;
    Utils.addEvent(root, "pointerdown", ((e: PointerEvent) => this.onDown(e)) as EventListener);
    Utils.addEvent(window, "pointermove", ((e: PointerEvent) => this.onMove(e)) as EventListener);
    Utils.addEvent(window, "pointerup", ((e: PointerEvent) => this.onUp(e)) as EventListener);

    Utils.addEvent(root, "mouseenter", ((e: MouseEvent) => {
      if (isMobile()) return;
      this.showCursor();
      this.moveCursor(e);
    }) as EventListener);
    Utils.addEvent(root, "mousemove", ((e: MouseEvent) => this.moveCursor(e)) as EventListener);
    Utils.addEvent(root, "mouseleave", () => {
      // Never hide mid-drag — pointerup decides, or the indicator vanishes
      // the moment the drag crosses the edge.
      if (!this.dragging) this.hideCursor();
    });

    // Keyboard parity for a drag-only control.
    Utils.addEvent(root, "keydown", ((e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") this.goTo(this.index - 1);
      if (e.key === "ArrowRight") this.goTo(this.index + 1);
    }) as EventListener);
  },

  buildBullets() {
    const pagination = Utils.$(".swiper-pagination");
    if (!pagination) return;
    pagination.innerHTML = "";
    for (let i = 0; i < this.count; i++) {
      const b = document.createElement("button");
      b.className = "swiper-bullet";
      b.type = "button";
      b.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
      b.addEventListener("click", () => this.goTo(i));
      pagination.appendChild(b);
    }
  },

  slideStep() {
    const slide = Utils.$(".swiper-slide", this.track as HTMLElement);
    return slide ? slide.getBoundingClientRect().width + 14 : 0;
  },

  goTo(i: number, animate = true) {
    this.index = Math.max(0, Math.min(this.count - 1, i));
    const x = -this.index * this.slideStep();
    gsap.to(this.track, {
      x,
      duration: animate && !prefersReducedMotion() ? 0.5 : 0,
      ease: "power3.out",
    });
    Utils.$$(".swiper-bullet").forEach((b, bi) =>
      b.classList.toggle("is-active", bi === this.index)
    );
  },

  onDown(e: PointerEvent) {
    if (e.button !== 0) return;
    this.dragging = true;
    this.pointerId = e.pointerId;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastDirection = null;
    if (this.dragWrap) {
      const l = Utils.$(".drag-left-icon", this.dragWrap);
      const r = Utils.$(".drag-right-icon", this.dragWrap);
      if (l) gsap.set(l, { scale: 1 });
      if (r) gsap.set(r, { scale: 1 });
      this.dragWrap.classList.add("is-dragging");
    }
  },

  onMove(e: PointerEvent) {
    if (!this.dragging || e.pointerId !== this.pointerId) return;
    this.moveCursor(e);

    const dx = e.clientX - this.startX;
    const dy = Math.abs(e.clientY - this.startY);

    // Mostly-horizontal only, so a vertical page scroll doesn't flip arrows.
    if (Math.abs(dx) > 5 && Math.abs(dx) > dy * 0.5) {
      const dir = dx < 0 ? "left" : "right";
      if (dir !== this.lastDirection) {
        this.lastDirection = dir;
        this.setDirection(dir);
      }
    }

    // Resistance past the ends, matching the reference's 0.85 ratio.
    const base = -this.index * this.slideStep();
    let next = base + dx;
    const min = -(this.count - 1) * this.slideStep();
    if (next > 0) next = dx * (1 - 0.85);
    else if (next < min) next = min + (next - min) * (1 - 0.85);
    gsap.set(this.track, { x: next });
  },

  onUp(e: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    const dx = e.clientX - this.startX;
    const threshold = this.slideStep() * 0.2;

    if (dx < -threshold) this.goTo(this.index + 1);
    else if (dx > threshold) this.goTo(this.index - 1);
    else this.goTo(this.index);

    this.resetArrows();

    if (this.root) {
      const r = this.root.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside) this.dragWrap?.classList.remove("is-dragging");
      else this.hideCursor();
    }
    this.pointerId = null;
  },

  setDirection(dir: "left" | "right") {
    if (!this.dragWrap) return;
    const l = Utils.$(".drag-left-icon", this.dragWrap);
    const r = Utils.$(".drag-right-icon", this.dragWrap);
    if (!l || !r) return;
    const lead = dir === "left" ? l : r;
    const trail = dir === "left" ? r : l;
    gsap.to(lead, { scale: 1.5, duration: 0.2, ease: "back.out(2)" });
    gsap.to(trail, { scale: 0.8, duration: 0.2, ease: "power2.out" });
  },

  resetArrows() {
    if (!this.dragWrap) return;
    const icons = Utils.$$(".drag-left-icon, .drag-right-icon", this.dragWrap);
    gsap.to(icons, { scale: 1, duration: 0.3, ease: "power2.out" });
    this.lastDirection = null;
  },

  showCursor() {
    if (!this.dragWrap || isMobile()) return;
    gsap.to(this.dragWrap, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    this.dragWrap.classList.add("is-ready");
  },

  hideCursor() {
    if (!this.dragWrap) return;
    gsap.to(this.dragWrap, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" });
    this.dragWrap.classList.remove("is-dragging", "is-ready");
  },

  moveCursor(e: MouseEvent | PointerEvent) {
    if (!this.dragWrap) return;
    gsap.set(this.dragWrap, { x: e.clientX, y: e.clientY, xPercent: -50, yPercent: -50 });
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
