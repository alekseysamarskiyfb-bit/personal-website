"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REVEAL, prefersReducedMotion } from "./motion";

type Props = {
  children: ReactNode;
  /** Element to render. Defaults to a div; pass `li`, `article`, … when the
   *  parent's layout cares what its children are. */
  as?: ElementType;
  className?: string;
  id?: string;
  /** Order within a group. Each step shifts the enter range slightly later,
   *  which reads as a stagger while staying tied to scroll position. */
  index?: number;
  /** Amplitude multiplier. Big statements move further than small print. */
  strength?: number;
  /**
   * Suppress the leave phase. Required for anything in the last viewport of
   * the document — its bottom edge can never reach the leave range, so the
   * element would animate out and never come back.
   */
  noLeave?: boolean;
};

/**
 * The one reveal used by every section. Enter and leave are separate scrubbed
 * tweens rather than a single timeline, so an element can sit fully settled
 * for as long as it stays in the middle of the viewport instead of drifting
 * the whole time it is on screen.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  id,
  index = 0,
  strength = 1,
  noLeave = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) {
      // Reduced motion still gets the information — an element appearing —
      // just without blur or movement.
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 96%", once: true },
          },
        );
      }, el);
      return () => ctx.revert();
    }

    const stagger = Math.min(index, 6) * 2.4;
    const rise = REVEAL.rise * strength;
    const fall = REVEAL.fall * strength;
    const blur = REVEAL.blur * strength;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: rise, filter: `blur(${blur}px)` },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: `top ${REVEAL.enterStart + stagger}%`,
            end: REVEAL.enterEnd,
            scrub: REVEAL.scrub,
          },
        },
      );

      if (noLeave) return;

      gsap.fromTo(
        el,
        { opacity: 1, y: 0, filter: "blur(0px)" },
        {
          opacity: 0,
          y: -fall,
          filter: `blur(${blur}px)`,
          ease: "none",
          // Without this the leave tween would write its "from" state at mount
          // and cancel the enter tween's hidden start.
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: REVEAL.leaveStart,
            end: REVEAL.leaveEnd,
            scrub: REVEAL.scrub,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [index, strength, noLeave]);

  return (
    <Tag ref={ref} className={className} id={id} data-reveal="">
      {children}
    </Tag>
  );
}
