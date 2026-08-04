/**
 * MOBILE MENU
 * The drawer wipes down via clip-path rather than sliding a panel, and the
 * two bars split apart into an X. The gap offset is computed from the real
 * flex gap so the bars meet exactly, whatever the vw scale resolves to.
 */

import gsap from "gsap";
import { Utils, isMobile } from "../core";

export const MobileMenu = {
  isOpen: false,
  trigger: null as HTMLElement | null,
  wrap: null as HTMLElement | null,
  icons: [] as HTMLElement[],
  gapOffset: 0,

  init() {
    if (!isMobile()) return;

    this.trigger = Utils.$(".mobile-menu");
    this.wrap = Utils.$(".nav-menu-wrap");
    this.icons = Utils.$$(".mobile-menu-icons");
    if (!this.trigger || !this.wrap) return;

    if (this.icons.length) {
      const iconHeight = this.icons[0].offsetHeight || 2;
      const gap = parseFloat(window.getComputedStyle(this.trigger).gap) || 0;
      this.gapOffset = (gap / 2 / iconHeight) * 100;
    }

    gsap.set(this.wrap, { clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" });
    this.trigger.setAttribute("aria-expanded", "false");

    Utils.addEvent(this.trigger, "click", () => this.toggle());

    // Tapping a link should close the drawer, not leave it hanging open.
    Utils.$$(".nav-menu-item a", this.wrap).forEach((link) =>
      Utils.addEvent(link, "click", () => this.close())
    );
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    gsap.to(this.wrap, {
      clipPath: "inset(0% 0% 0% 0%)",
      pointerEvents: "auto",
      duration: 0.8,
      ease: "power2.out",
    });
    this.icons.forEach((icon, i) =>
      gsap.to(icon, {
        yPercent: i === 0 ? 50 + this.gapOffset : -50 - this.gapOffset,
        rotate: i === 0 ? 45 : -45,
        duration: 0.4,
        ease: "power2.out",
      })
    );
    this.trigger?.classList.add("is-active");
    this.trigger?.setAttribute("aria-expanded", "true");
  },

  close() {
    this.isOpen = false;
    gsap.to(this.wrap, {
      clipPath: "inset(0% 0% 100% 0%)",
      pointerEvents: "none",
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(this.icons, { yPercent: 0, rotate: 0, duration: 0.4, ease: "power2.out" });
    this.trigger?.classList.remove("is-active");
    this.trigger?.setAttribute("aria-expanded", "false");
  },

  destroy() {
    if (this.wrap) gsap.set(this.wrap, { clearProps: "clipPath,pointerEvents" });
    this.icons.forEach((i) => gsap.set(i, { clearProps: "yPercent,rotate" }));
    this.isOpen = false;
  },
};

/**
 * TIMELINE POPUPS
 * One open at a time; the close listener is bound {once} so repeat opens
 * cannot stack duplicate handlers on the same card.
 */
export const Popups = {
  init() {
    Utils.$$(".about-card-button").forEach((button) => {
      Utils.addEvent(button, "click", () => {
        const card = button.closest(".about-card-wrap") as HTMLElement | null;
        const popup = card?.querySelector(".popup-card-wrap") as HTMLElement | null;
        if (!card || !popup || popup.classList.contains("is-active-card")) return;

        document
          .querySelectorAll(".popup-card-wrap.is-active-card")
          .forEach((p) => p.classList.remove("is-active-card"));

        Utils.$$(".about-card-wrap").forEach((c) => (c.style.zIndex = "5"));
        card.style.zIndex = "10";
        popup.classList.add("is-active-card");
        button.setAttribute("aria-expanded", "true");

        const close = popup.querySelector(".popup-close");
        close?.addEventListener(
          "click",
          () => {
            popup.classList.remove("is-active-card");
            card.style.zIndex = "5";
            button.setAttribute("aria-expanded", "false");
          },
          { once: true }
        );
      });
    });
  },
};
