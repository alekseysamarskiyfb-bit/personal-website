"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/data/site";
import { REVEAL, prefersReducedMotion } from "@/components/motion/motion";
import { ArrowDown } from "./icons";

const LAST = SITE.lastName.toUpperCase().split("");

/**
 * The hero is the only section that animates on a clock rather than on scroll —
 * it is already in view when the page loads, so there is nothing to scroll it
 * into. Everything after it is scroll-driven.
 *
 * The wordmark is sized purely in vw with `nowrap`, which makes its fit ratio
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
      if (reduced) {
        gsap.set("[data-intro]", { opacity: 1, y: 0, filter: "none" });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay: 0.15,
      });

      tl.from(".hero__pill", {
        y: -22,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.1,
      })
        .from(
          ".hero__meta > *",
          {
            y: 18,
            opacity: 0,
            filter: "blur(8px)",
            duration: 1.1,
            stagger: 0.06,
          },
          "-=0.85",
        )
        .from(
          ".hero__char",
          {
            yPercent: 60,
            opacity: 0,
            filter: "blur(16px)",
            duration: 1.5,
            stagger: 0.045,
          },
          "-=0.95",
        )
        .from(
          ".hero__portrait",
          {
            yPercent: 8,
            scale: 1.05,
            opacity: 0,
            filter: "blur(14px)",
            duration: 1.7,
          },
          "-=1.25",
        )
        .from(
          ".hero__scroll",
          { opacity: 0, y: 14, duration: 1, },
          "-=1.1",
        );

      // The hero leaves the way every other section does. It is scrubbed over
      // its own first screenful, so by the time the studio arrives the hero has
      // fully receded rather than sitting behind it at half opacity.
      gsap.to(".hero__stage, .hero__meta, .hero__scroll", {
        opacity: 0,
        y: -REVEAL.fall,
        filter: `blur(${REVEAL.blur}px)`,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom 45%",
          scrub: REVEAL.scrub,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__meta shell">
        <p className="hero__role">
          {SITE.role.split(" & ")[0]} &amp;
          <br />
          {SITE.role.split(" & ")[1]}
        </p>
        <p className="hero__status">
          <span className="hero__dot" aria-hidden="true" />
          Available for work
          <span className="hero__sep" aria-hidden="true">
            /
          </span>
          {SITE.location}
        </p>
      </div>

      <div className="hero__stage">
        <h1 className="hero__word display" aria-label={`${SITE.firstName} ${SITE.lastName}`}>
          <span className="hero__first">{SITE.firstName}</span>
          <span className="hero__last" aria-hidden="true">
            {LAST.map((char, i) => (
              <span className="hero__char" key={`${char}-${i}`}>
                {char}
              </span>
            ))}
          </span>
        </h1>

        <div className="hero__portrait">
          <Image
            src="/portrait-cutout.webp"
            alt={`${SITE.firstName} ${SITE.lastName}`}
            width={1200}
            height={1800}
            priority
            sizes="(max-width: 860px) 88vw, 46vw"
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
