/**
 * WHAT YOU GET — the manifesto.
 *
 * One paragraph that writes itself on in the GROUND colour and darkens to
 * black as you scroll — a tonal reveal, not a fade.
 *
 * The gaps in the copy are real: each <span data-connect> is an anchor that a
 * capability chip is magnetically pinned to, so the chips sit INSIDE the
 * sentence rather than beside it. TextReveal's splitter preserves any node
 * carrying data-connect, so the chips survive being split character by
 * character around them.
 */

import { IconLayers, IconSpark, IconWork, IconJourney, IconHome } from "./icons";

const CAPABILITIES = [
  {
    id: "cap-creative",
    label: "Ad creative",
    Icon: IconSpark,
    varHover: 1.45,
    body: "Static, motion and AI-assisted creative for Meta, TikTok, Native and Display — built as testable variants, not one-offs.",
  },
  {
    id: "cap-testing",
    label: "Testing",
    Icon: IconJourney,
    varHover: 1.4,
    body: "A/B structures agreed with the media buyer before production, so every asset answers a question worth asking.",
  },
  {
    id: "cap-brand",
    label: "Direction",
    Icon: IconHome,
    varHover: 1.4,
    body: "Creative direction and the visual systems underneath the ads — templates and rules, so scale doesn't mean drift.",
  },
  {
    id: "cap-ai",
    label: "AI pipeline",
    Icon: IconLayers,
    varHover: 1.5,
    body: "Prompt engineering and generated assets folded into the daily workflow, finished by hand where the model gives itself away.",
  },
  {
    id: "cap-team",
    label: "Team",
    Icon: IconWork,
    varHover: 1.4,
    body: "Leading designers through review cycles, and building the internal systems that keep output consistent.",
  },
];

export default function WhatYouGet() {
  return (
    <section className="what_you_get_section" id="what-you-get">
      <div className="column flex-center text-center">
        <p
          className="label"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger=".what_you_get_section"
          data-tl-start="top 78%"
          data-tl-from="{'width': '0vw', 'opacity': 0}"
          data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
        >
          Capabilities overview
        </p>

        {/* Restores the label -> heading -> lede component every other section
            runs. Without it this block opened straight into the manifesto and
            read as a stray paragraph rather than as a section. */}
        <h2
          className="h2-style margin-bottom-s"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger=".what_you_get_section"
          data-tl-start="top 78%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.7, 'stagger': 0.09, 'delay': 0.25, 'ease': 'expo.out'}"
        >
          What you actually get
        </h2>

        <p className="what_you_get-text">
          Creative, testing and brand thinking combined&nbsp;
          <span className="capa-anchor" data-connect="cap-creative" aria-hidden />
          &nbsp;— turning paid budget into a system that&nbsp;
          <span className="capa-anchor" data-connect="cap-testing" aria-hidden />
          &nbsp;compounds instead of one that just&nbsp;
          <span className="capa-anchor" data-connect="cap-brand" aria-hidden />
          &nbsp;spends. Built to be&nbsp;
          <span className="capa-anchor" data-connect="cap-ai" aria-hidden />
          &nbsp;measured, and&nbsp;
          <span className="capa-anchor" data-connect="cap-team" aria-hidden />
          &nbsp;repeated.
        </p>
      </div>

      {/* Zero-height so the chips float over the paragraph without pushing it. */}
      <div className="capa-cards-wrap" aria-label="Capabilities">
        {CAPABILITIES.map((cap, i) => (
          <div
            className="capa-card"
            key={cap.id}
            data-origin="center center"
            data-connect={cap.id}
            data-anchor-pos="center center"
          >
            <div
              className="capa-card-item"
              tabIndex={0}
              role="button"
              aria-label={cap.label}
              /* No trigger of its own. TextReveal adds .is-revealed to the
                 card as the tonal scrub reaches the words this chip sits
                 between, so the chip arrives exactly where the reader is —
                 which is the whole point of pinning it inline. The old
                 hard-coded 80/63/47/39/25 percentages of the paragraph had no
                 relationship to the chip's place in the sentence. */
            >
              <div className="capa-card-top-item">
                <cap.Icon className="capa-icon" data-var-hover={cap.varHover} />
                <span className="capa-card-label">{cap.label}</span>
              </div>

              {/* 0fr -> 1fr: a true auto-height expand with nothing measured. */}
              <div className="capa-card-bottom">
                <div className="capa-card-bottom-layout">
                  <p className="capa-card-text">{cap.body}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
