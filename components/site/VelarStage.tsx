"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/motion/motion";

/** Rotation at the far corner, in degrees. Small on purpose: the plane should
 *  read as a surface catching light, not as a card being flipped. */
const TILT = 2.6;

/**
 * The studio's dark surface, and the one place on the site that responds to the
 * cursor. Everything decorative lives inside the plane as full-bleed layers at
 * different depths, so a single rotation produces the parallax — no layer
 * needs its own tracking maths.
 *
 * The whole interaction is a fine-pointer affordance. On touch there is no
 * hover to reward and a tilt fired by a tap reads as a glitch, so the effect is
 * never wired up at all and the section falls back to a still composition that
 * was designed to stand on its own.
 */
export default function VelarStage({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frameEl = frame.current;
    const planeEl = plane.current;
    if (!frameEl || !planeEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // The cards enter as a run rather than all at once — the same gesture the
      // rest of the site uses, at the smallest amplitude on the page, because
      // the stage around them has already made the entrance.
      const cards = planeEl.querySelectorAll(".velar__card");
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: reduced ? 0 : 16,
          duration: reduced ? 0.4 : 0.7,
          ease: "power2.out",
          stagger: reduced ? 0 : 0.055,
          scrollTrigger: { trigger: planeEl, start: "top 76%", once: true },
        });
      }

      if (reduced) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const rotX = gsap.quickTo(planeEl, "rotationX", {
        duration: 0.9,
        ease: "power3.out",
      });
      const rotY = gsap.quickTo(planeEl, "rotationY", {
        duration: 0.9,
        ease: "power3.out",
      });
      // The light is written straight to the frame on every move — no easing on
      // the position, so it sits exactly under the cursor. Only the tilt is
      // smoothed; a plane has weight, light does not.
      const glowX = gsap.quickSetter(frameEl, "--mx", "px") as (v: number) => void;
      const glowY = gsap.quickSetter(frameEl, "--my", "px") as (v: number) => void;

      let box = frameEl.getBoundingClientRect();

      const measure = () => {
        box = frameEl.getBoundingClientRect();
      };

      const onEnter = (e: PointerEvent) => {
        measure();
        // Place the light where the cursor crossed the edge before fading it in,
        // so it never appears at a stale position first.
        glowX(e.clientX - box.left);
        glowY(e.clientY - box.top);
        frameEl.classList.add("is-live");
      };

      const onMove = (e: PointerEvent) => {
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        glowX(x);
        glowY(y);
        // -1 … 1 from the centre. Y drives rotationX inverted so the plane tips
        // toward the cursor rather than away from it.
        rotY(((x / box.width) * 2 - 1) * TILT);
        rotX(-((y / box.height) * 2 - 1) * TILT);
      };

      const onLeave = () => {
        frameEl.classList.remove("is-live");
        rotX(0);
        rotY(0);
      };

      frameEl.addEventListener("pointerenter", onEnter);
      frameEl.addEventListener("pointermove", onMove);
      frameEl.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", measure);
      // Lenis moves the page under a stationary cursor, so the cached box goes
      // stale between moves without this.
      window.addEventListener("scroll", measure, { passive: true });

      return () => {
        frameEl.removeEventListener("pointerenter", onEnter);
        frameEl.removeEventListener("pointermove", onMove);
        frameEl.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure);
      };
    }, frameEl);

    return () => ctx.revert();
  }, []);

  return (
    <div className="velar__frame" ref={frame}>
      <div className="velar__plane" ref={plane}>
        <div className="velar__layer velar__layer--ambient" aria-hidden="true" />
        <div className="velar__layer velar__layer--grid" aria-hidden="true" />
        <div className="velar__layer velar__layer--noise" aria-hidden="true" />
        <div className="velar__layer velar__layer--sheen" aria-hidden="true" />
        {children}
        <div className="velar__layer velar__layer--cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
