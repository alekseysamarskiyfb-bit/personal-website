"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/data/site";
import { REVEAL, prefersReducedMotion } from "@/components/motion/motion";
import { ArrowDown } from "./icons";

const LINES = [SITE.firstName, SITE.lastName];

/**
 * The name lockup, per character so the whole thing can rise as one wave.
 *
 * `data-i` runs continuously across both lines, so the rise reads as one wave
 * travelling through the whole lockup rather than two separate reveals.
 */
function Name() {
  let index = 0;
  return (
    <>
      {LINES.map((text) => (
        <span className="hero__line" key={text}>
          {text.split("").map((char, i) => (
            <span className="hero__char" data-i={index++} key={`${char}-${i}`}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

/**
 * The hero is the only section that animates on a clock rather than on scroll —
 * it is already in view when the page loads. Everything after it is
 * scroll-driven.
 *
 * The name is sized purely in vw with `nowrap`, which makes its fit ratio
 * identical at every viewport width: one constant, tuned once, holds from 375
 * to 1920.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });

      tl.from(".hero__role", {
        y: 24,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
      })
        .from(
          ".hero__status",
          { y: 16, opacity: 0, filter: "blur(8px)", duration: 1 },
          "-=0.9",
        )
        .from(
          ".hero__portrait",
          {
            yPercent: 6,
            scale: 1.04,
            opacity: 0,
            filter: "blur(16px)",
            duration: 1.6,
          },
          "-=0.8",
        )
        // Each character rises out of its line's mask. No blur here: the line
        // clips its overflow, so a blur halo would be sliced off mid-rise.
        .from(
          ".hero__char",
          {
            yPercent: 108,
            duration: 1.25,
            ease: "expo.out",
            stagger: (_i, target) =>
              Number((target as HTMLElement).dataset.i ?? 0) * 0.035,
          },
          "-=1.3",
        )
        .from(".hero__scroll", { opacity: 0, y: 14, duration: 1 }, "-=0.9");

      // The hero leaves the way every other section does, scrubbed over its own
      // first screenful, so it has fully receded by the time the studio arrives.
      //
      // fromTo, not to: a plain `to` captures its start values on the first
      // refresh, which happens while the intro above is still mid-fade. It
      // recorded opacity 0 as the value to return to, so scrolling back up
      // never brought the hero back — only a reload did. The start state is
      // now stated outright, and immediateRender keeps it from overwriting the
      // intro's own starting point at mount.
      gsap.fromTo(
        ".hero__top, .hero__portrait, .hero__name, .hero__scroll",
        { opacity: 1, y: 0, filter: "blur(0px)" },
        {
          opacity: 0,
          y: -REVEAL.fall,
          filter: `blur(${REVEAL.blur}px)`,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom 45%",
            scrub: REVEAL.scrub,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__top shell">
        <h2 className="hero__role">
          Creative &amp;
          <br />
          Motion <span className="serif">Designer</span>
        </h2>

        <p className="hero__status">
          <span className="hero__dot" aria-hidden="true" />
          Available for work
          <span className="hero__sep" aria-hidden="true" />
          {SITE.location}
        </p>
      </div>

      <div className="hero__stage">
        {/* The name sits behind the cutout, which crops it the way the
            reference does. With a transparent portrait there is no dark card to
            invert the type against, and ink over a navy shirt would simply
            disappear — so occlusion, not contrast, is what keeps it readable. */}
        <h1
          className="hero__name"
          aria-label={`${SITE.firstName} ${SITE.lastName}`}
        >
          <Name />
        </h1>

        <div className="hero__portrait">
          <Image
            src="/portrait-cutout.webp"
            alt={`${SITE.firstName} ${SITE.lastName}`}
            width={1600}
            height={1772}
            priority
            // Above the default 75: this is the one photograph on the site and
            // it is the largest thing on the page, so compression artefacts in
            // the skin would be the first thing a client sees.
            quality={90}
            // The phone value is what the srcset is really chosen from — at
            // 92vw on a 3x screen that asks for roughly 1100px of image, so the
            // source has to be comfortably larger than the box it fills.
            sizes="(max-width: 860px) 92vw, 44vw"
          />
        </div>
      </div>

      <a className="hero__scroll" href="#velar">
        <span>Scroll</span>
        <ArrowDown />
      </a>
    </section>
  );
}
