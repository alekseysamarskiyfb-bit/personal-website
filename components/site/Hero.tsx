/**
 * HERO
 *
 * Half of this markup is invisible. The transparent "ghost" elements are the
 * targets the rail's real elements get FLIP'd onto — they exist only to be
 * measured. What you actually see in the hero IS the sidebar, transformed.
 *
 *   .mark-ghost        <- .nav-mark flies here
 *   .hero-link-ghost   <- the real <a> from .nav-menu-item flies here
 *   .hero-cta-button   <- .nav-button flies here
 *   .hero-stat-*       <- the rail's stat card innards fly here
 *
 * .hero-card-3 and the two paragraphs are the only genuinely-hero elements;
 * they are revealed by the preloader and scrubbed away again on scroll.
 */

import { WordmarkSVG, WordmarkLetters } from "./Wordmark";
import { NAV_LINKS } from "./navData";
import { IconArrowUpRight, IconLayers } from "./icons";

const TRAITS = [
  "Performance Creative",
  "Growth-minded",
  "Team Lead",
  "AI-assisted",
  "Reliable",
];

export default function Hero() {
  const left = NAV_LINKS.filter((l) => l.side === "left");
  const right = NAV_LINKS.filter((l) => l.side === "right");

  return (
    <section className="hero" id="hero">
      {/* Preloader mark — per-letter so it can stagger. Hidden at t=2 as the
          real mark takes over in the same frame. */}
      <div className="mark-preload-wrap" aria-hidden>
        <WordmarkLetters className="mark-preload" />
      </div>

      <div className="hero-sticky">
        {/* The mark ghost. Sits at the top at full bleed; the rail's mark is
            transformed onto it on load. */}
        <div className="hero-mark-slot" aria-hidden>
          <WordmarkSVG className="mark-ghost" />
          <span className="mark-dot-ghost" />
        </div>

        {/* Hero nav row — transparent ghosts only. The visible links are the
            rail's real anchors, flown here. */}
        <div className="hero-navigation-wrap" aria-hidden>
          <div className="hero-links-ghost-wrapper">
            {left.map((l, i) => (
              <span className="hero-ghost-slot" key={l.id}>
                <span className="hero-link-ghost" data-link-id={l.id}>
                  {l.label}
                </span>
                {i < left.length - 1 && <span className="hero-navigation-sep" />}
              </span>
            ))}
          </div>
          <div className="hero-links-ghost-wrapper is-hero-right-nav-item">
            {right.map((l, i) => (
              <span className="hero-ghost-slot" key={l.id}>
                <span className="hero-link-ghost" data-link-id={l.id}>
                  {l.label}
                </span>
                {i < right.length - 1 && <span className="hero-navigation-sep" />}
              </span>
            ))}
          </div>
        </div>

        {/* Fixed lower band: stat ghosts, headline, buttons, traits card. */}
        <div className="hero-cards-wrap">
          <div className="hero-cards-left" aria-hidden>
            <div className="hero-card hero-card-2">
              <div className="hero-stat-a-bg" />
              <div className="hero-stat-icon-wrap">
                <IconLayers className="hero-stat-a-icon" />
              </div>
              <p className="hero-stat-a-text">10+ Platforms</p>
            </div>

            <div className="hero-card hero-card-1">
              <div className="hero-stat-b-bg" />
              <div className="hero-stat-numb-wrap">
                <span className="hero-stat-b-numb">3+</span>
              </div>
              <p className="hero-stat-b-text">Years in performance</p>
            </div>
          </div>

          <div className="hero-content-layout">
            <h1
              className="hero-heading"
              data-tl-desktop
              data-tl-type="scroll"
              data-tl-trigger=".hero"
              data-tl-start="1% top"
              data-tl-end="15% top"
              data-tl-from="{'opacity': 1, 'filter': 'blur(0px)', 'y': '0vw', 'scale': 1}"
              data-tl-to="{'opacity': 0, 'filter': 'blur(16px)', 'y': '-2.5vw', 'scale': 0.965}"
            >
              Performance Creative,
              <br />
              That Converts.
            </h1>

            <div className="hero-buttons-wrap" aria-hidden>
              <span className="hero-cta-button">Let&rsquo;s Talk</span>
              <span className="hero-button">
                See Work
                <IconArrowUpRight className="nav-button-arrow" />
              </span>
            </div>
          </div>

          {/* Genuinely hero: revealed by the preloader, scrubbed away at 5–20%. */}
          <div
            className="hero-card-3"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="3% top"
            data-tl-end="18% top"
            data-tl-from="{'opacity': 1, 'filter': 'blur(0px)', 'y': '0vw', 'scale': 1}"
            data-tl-to="{'opacity': 0, 'filter': 'blur(14px)', 'y': '-1.6vw', 'scale': 0.94}"
          >
            {TRAITS.map((t) => (
              <div className="hero-card-3-item" key={t}>
                <span className="hero-card-3-dot" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ground row. Both paragraphs mask-reveal at the end of the intro
            and slide out again in the first 10% of scroll. */}
        <div className="hero-container">
          <p
            className="hero-left-text"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="2% top"
            data-tl-end="13% top"
            data-tl-from="{'opacity': 1, 'filter': 'blur(0px)', 'y': '0vw'}"
            data-tl-to="{'opacity': 0, 'filter': 'blur(10px)', 'y': '-1vw'}"
          >
            The performance creative.
            <br />
            That&rsquo;s Oleksii.
          </p>
          <p
            className="hero-right-text"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="3% top"
            data-tl-end="14% top"
            data-tl-from="{'opacity': 1, 'filter': 'blur(0px)', 'y': '0vw'}"
            data-tl-to="{'opacity': 0, 'filter': 'blur(10px)', 'y': '-1vw'}"
          >
            3+ years of static, motion and AI-assisted creative for paid
            acquisition. Founder of Velar Studio.
          </p>
        </div>
      </div>
    </section>
  );
}
