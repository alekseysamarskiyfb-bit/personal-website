/**
 * JOURNEY — the magnetic timeline.
 *
 * Cards are absolutely positioned down a spine, then pinned by
 * MagneticPositions: each declares which of ITS corners sits on which anchor
 * point. Alternating bottom-left / bottom-right origins produce the zig-zag.
 *
 * Reveal windows are staggered per card via data-tl-start, and the rail
 * itself advances in keyframed pulses that land on each card rather than
 * scrubbing linearly.
 */

const ENTRIES = [
  {
    year: "2023",
    short: "23",
    handle: "@affiliate",
    ago: "3 years ago",
    heading: "First real campaigns",
    teaser:
      "Junior performance designer. Static, video and animated creative for Sweepstakes and Crypto. No mentor, a lot of ads that didn't work — until some did.",
    story:
      "I started as a Junior Performance Designer, producing static, video and animated creatives for Sweepstakes and Crypto paid campaigns — UGC-style ads, landing pages, all of it. No mentor telling me the rules, just a lot of creatives that didn't work, until some did.",
    origin: "bottom right",
  },
  {
    year: "2024",
    short: "24",
    handle: "@adprodigies",
    ago: "2 years ago",
    heading: "Learning to lead",
    teaser:
      "Handed a team of 4 and the Search affiliate vertical. Running the review process taught me more about what converts than a year of solo production.",
    story:
      "I was handed a team of 4 designers at ADPRODIGIES and put in charge of the Search affiliate vertical. Weekly creative review calls with media buyers, internal visual systems for the team, A/B-testing strategy — running that process taught me more about what actually converts than a year of solo production ever did.",
    origin: "bottom left",
  },
  {
    year: "2025",
    short: "25",
    handle: "@ai",
    ago: "1 year ago",
    heading: "Scaling with AI in the pipeline",
    teaser:
      "Prompt engineering and AI-generated assets went from experiment to daily workflow. The volume one person could ship kept climbing.",
    story:
      "Prompt engineering and AI-generated ad assets went from experiment to daily workflow. I kept producing across Traffic Place, ADPRODIGIES and a private media-buying team — Sweepstakes, iGaming, affiliate creative — while the volume and speed of what one person could ship kept climbing.",
    origin: "bottom right",
  },
  {
    year: "2026",
    short: "26",
    handle: "@velar",
    ago: "Now",
    heading: "Building something of my own",
    teaser:
      "Senior Performance Creative Designer — and founder of Velar Studio. Everything before this became the foundation for a real venture.",
    story:
      "Senior Performance Creative Designer on a private affiliate team — and founder of Velar Studio. Everything up to this point, the failed creatives, the team lead seat, the AI-assisted pipelines, became the foundation for a real creative production venture, not just a portfolio.",
    origin: "bottom left",
  },
];

/* Each card's reveal fires at its own point in the container's scroll. */
const STARTS = ["-45% top", "-15% top", "15% top", "45% top"];
/* Cards magnet their BOTTOM corner onto these, so an anchor at 0% would hang
   the whole card above the container and into the section header. Starting at
   18% gives the first card room to sit inside its own run. */
const TOPS = ["18%", "40%", "62%", "84%"];

export default function Journey() {
  return (
    <section className="about-section section-inset" id="journey">
      <div className="column">
        <p
          className="label"
          data-tl-type="trigger"
          data-tl-trigger=".about-section"
          data-tl-start="top 90%"
          data-tl-from="{'width': '0vw', 'opacity': 0}"
          data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
        >
          My Journey
        </p>
        <h2
          className="h2-style margin-bottom-s"
          data-tl-type="trigger"
          data-tl-trigger=".about-section"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          How I got here
        </h2>
        <p
          className="max-width-389 op80"
          data-tl-type="trigger"
          data-tl-trigger=".about-section"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          Not a resume — the actual path. Three years of ads that failed, ads
          that worked, and learning to tell the difference before spending the
          budget.
        </p>
      </div>

      <div className="about-wrap">
        <div className="about-card-container">
          {/* The spine. Anchor points are invisible; cards magnet onto them. */}
          <div className="about-timeline-wrap" aria-hidden>
            <div className="about-timeline-overflow">
              <div
                className="about-timeline-rail"
                data-tl-desktop
                data-tl-type="scroll"
                data-tl-trigger=".about-card-container"
                data-tl-start="top 90%"
                data-tl-end="bottom 80%"
                data-tl-from="{'height': '0%'}"
                data-tl-to="{'keyframes': [{'height': '25%', 'duration': 2}, {'height': '50%', 'duration': 1.5}, {'height': '75%', 'duration': 2}, {'height': '100%', 'duration': 1.5}], 'ease': 'none'}"
              />
            </div>
            <div className="about-timeline-position">
              {ENTRIES.map((e, i) => (
                <span
                  className="about-anchor"
                  key={e.year}
                  data-connect={`step-${i + 1}`}
                  style={{ top: TOPS[i] }}
                />
              ))}
            </div>
          </div>

          {ENTRIES.map((entry, i) => (
            <div
              className={`about-card-wrap ac-${i + 1}`}
              key={entry.year}
              data-origin={entry.origin}
              data-connect={`step-${i + 1}`}
              data-offset={entry.origin.includes("right") ? "-1.6vw, 0" : "1.6vw, 0"}
              data-origin-mobile="top left"
              data-anchor-pos-mobile="top left"
              style={{ top: TOPS[i] }}
            >
              <div
                className="about-card"
                data-tl-desktop
                data-tl-type="trigger"
                data-tl-trigger=".about-card-container"
                data-tl-start={STARTS[i]}
                data-tl-from="{'y': '9%', 'opacity': 0, 'scale': 0.86, 'filter': 'blur(12px)'}"
                data-tl-to="{'y': '0%', 'opacity': 1, 'scale': 1, 'filter': 'blur(0px)', 'duration': 1.25, 'delay': 0.25, 'ease': 'expo.out'}"
              >
                <div
                  className="about-card-year"
                  data-number-count={entry.short}
                  data-tl-desktop
                  data-tl-trigger=".about-card-container"
                  data-tl-start={STARTS[i]}
                  data-tl-to="{'duration': 1.5, 'stagger': 0.1, 'delay': 0.2, 'ease': 'expo.out'}"
                >
                  {entry.short}
                </div>

                <h3
                  className="about-card-heading"
                  data-tl-desktop
                  data-tl-type="trigger"
                  data-tl-trigger=".about-card-container"
                  data-tl-start={STARTS[i]}
                  data-tl-split="lines"
                  data-tl-from="{'yPercent': 100}"
                  data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'expo.out'}"
                >
                  {entry.heading}
                </h3>

                <p
                  className="op80"
                  data-tl-desktop
                  data-tl-type="trigger"
                  data-tl-trigger=".about-card-container"
                  data-tl-start={STARTS[i]}
                  data-tl-split="lines"
                  data-tl-from="{'yPercent': 100}"
                  data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.4, 'ease': 'expo.out'}"
                >
                  {entry.teaser}
                </p>

                <div className="about-card-bottom-layout">
                  <div className="about-card-bottom-layout-left">
                    <p
                      className="about-card-bottom-text"
                      data-tl-desktop
                      data-tl-type="trigger"
                      data-tl-trigger=".about-card-container"
                      data-tl-start={STARTS[i]}
                      data-tl-split="lines"
                      data-tl-from="{'yPercent': 100}"
                      data-tl-to="{'yPercent': 0, 'duration': 0.4, 'stagger': 0.1, 'delay': 0.6, 'ease': 'expo.out'}"
                    >
                      {entry.handle} · {entry.ago}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="about-card-button"
                    aria-expanded="false"
                    data-tl-desktop
                    data-tl-type="trigger"
                    data-tl-trigger=".about-card-container"
                    data-tl-start={STARTS[i]}
                    data-tl-from="{'opacity': 0}"
                    data-tl-to="{'opacity': 1, 'duration': 1.4, 'delay': 0.8, 'ease': 'expo.out'}"
                  >
                    Read more
                  </button>
                </div>
              </div>

              {/* Expanded story. Ends at scale 1.02 — deliberately proud of
                  the card it replaces, so the swap reads as a lift. */}
              <div className="popup-card-wrap">
                <div className="popup-card">
                  <div className="popup-card-top-item">
                    <span>{entry.year}</span>
                    <button type="button" className="popup-close" aria-label="Close">
                      <span className="popup-close-icon">
                        <span className="popup-close-path-1" />
                        <span className="popup-close-path-2" />
                      </span>
                    </button>
                  </div>
                  <h3 className="popup-heading">{entry.heading}</h3>
                  <p className="popup-body">{entry.story}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
