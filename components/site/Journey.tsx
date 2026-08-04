/**
 * JOURNEY — the drawn timeline.
 *
 * Cards are absolutely positioned, then pinned by MagneticPositions: each
 * declares which of ITS corners sits on which milestone. Alternating the
 * milestone's x between 62% and 38% — and the card's origin corner with it —
 * is what produces the zig-zag; the spine then curves between those points,
 * drawn by TimelineSpine as you scroll.
 *
 * Content is the real career history, one card per position rather than
 * several roles compressed into one.
 */

const ENTRIES = [
  {
    year: "23",
    period: "Sep 2023 — May 2024",
    role: "Junior Performance Designer",
    org: "Affiliate Marketing Team",
    teaser:
      "Static, video and animated creative for Sweepstakes and Crypto. UGC-style ads and landing pages, straight into paid acquisition.",
    story:
      "My first production seat. Static, video and animated creatives for Sweepstakes and Crypto campaigns, UGC-style advertising content and landing pages — creative made for paid acquisition across several verticals at once. No mentor telling me the rules, just a lot of ads that didn't work until some did.",
  },
  {
    year: "24",
    period: "May — Sep 2024",
    role: "Creative Designer",
    org: "Performance Marketing Team",
    teaser:
      "Search affiliate creative, and the first time I sat in review calls with the media buyers spending against it.",
    story:
      "Static and video creatives for Search affiliate campaigns. This was where creative review calls with media buyers became part of the job — producing performance-oriented assets for paid traffic and hearing, weekly, exactly which of them earned their placement.",
  },
  {
    year: "24",
    period: "Aug 2024 — Aug 2025",
    role: "Team Lead · Performance Creative Designer",
    org: "ADPRODIGIES",
    teaser:
      "Led four designers across the Search affiliate vertical. Built the review process, the visual systems and the testing strategy.",
    story:
      "Leading a team of 4 designers within the Search affiliate vertical. Static, motion and AI-assisted advertising creatives; landing pages and internal visual systems for the team; weekly creative review calls with buyers and designers. Running the iteration workflow and the A/B testing strategy taught me more about what actually converts than a year of solo production ever did.",
  },
  {
    year: "24",
    period: "Nov 2024 — Jul 2025",
    role: "Performance Creative Designer",
    org: "Private Media Buying Team",
    teaser:
      "Static and video for affiliate campaigns, built directly alongside the buyers running them.",
    story:
      "Static and video creatives for affiliate campaigns, plus landing pages, banners and supporting assets. Working directly with media buyers through creative review meant every asset was made against a conversion target rather than a moodboard.",
  },
  {
    year: "25",
    period: "Aug — Nov 2025",
    role: "Motion & Creative Designer",
    org: "ADPRODIGIES",
    teaser:
      "iGaming motion at volume — and the point where AI-assisted assets moved from experiment to pipeline.",
    story:
      "Static, motion and animated creatives for iGaming campaigns. AI-assisted ad creatives and short-form video assets, produced inside high-volume creative pipelines where the constraint stopped being ideas and started being throughput.",
  },
  {
    year: "25",
    period: "Oct 2025 — Apr 2026",
    role: "Performance Creative Designer",
    org: "Traffic Place",
    teaser:
      "Sweepstakes creative built on prompt-engineering workflows, tested against paid social daily.",
    story:
      "Static and motion creatives for Sweepstakes campaigns, AI-generated advertising assets and UGC-style creative. Prompt engineering became a real production workflow here — and everything shipped straight into paid social testing iterations with the buyers.",
  },
  {
    year: "25",
    period: "Dec 2025 — Jun 2026",
    role: "Senior Performance Creative Designer",
    org: "Private Affiliate Team",
    teaser:
      "Full-stack creative ownership: AI and voice-over pipelines, landing pages, and the internal CRM the team works in.",
    story:
      "Static, motion and animated video creatives for affiliate campaigns. AI-assisted creative and UGC-style content, voice-over workflows and AI-generated content pipelines, landing pages and performance-oriented visual assets. I also designed the internal CRM interfaces used by both the designers and the media buyers — the tooling around the work, not just the work.",
  },
];

/* Milestones alternate across the centre line; the card's origin corner
   alternates with them, which is what makes the run zig-zag. */
const NODES = ENTRIES.map((_, i) => ({
  top: `${8 + i * 14}%`,
  left: i % 2 === 0 ? "62%" : "38%",
  origin: i % 2 === 0 ? "bottom right" : "bottom left",
}));

/* Each card's reveal fires at its own point in the container's scroll. */
const STARTS = ENTRIES.map((_, i) => `${-42 + i * 13}% top`);

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
          Not a resume — the actual path. Seven seats in three years, each one
          teaching something the last one couldn&rsquo;t.
        </p>
      </div>

      <div className="about-wrap">
        <div className="about-card-container">
          {/* The spine. TimelineSpine measures the milestones after layout and
              generates the curve through them, so the path always matches
              wherever the cards actually landed. */}
          <div className="about-timeline-wrap" aria-hidden>
            <svg className="about-spine" xmlns="http://www.w3.org/2000/svg">
              <path className="about-spine-track" fill="none" />
              <path className="about-spine-path" fill="none" />
              <g className="about-spine-nodes" />
            </svg>

            <div className="about-timeline-position">
              {NODES.map((n, i) => (
                <span
                  className="about-anchor"
                  key={i}
                  data-connect={`step-${i + 1}`}
                  style={{ top: n.top, left: n.left }}
                />
              ))}
            </div>
          </div>

          {ENTRIES.map((entry, i) => (
            <div
              className={`about-card-wrap ac-${i + 1}`}
              key={i}
              data-origin={NODES[i].origin}
              data-connect={`step-${i + 1}`}
              data-offset={NODES[i].origin.includes("right") ? "-2.4vw, 0" : "2.4vw, 0"}
              data-origin-mobile="top left"
              data-anchor-pos-mobile="top left"
              style={{ top: NODES[i].top, left: 0 }}
            >
              <div
                className="about-card"
                data-tl-desktop
                data-tl-type="trigger"
                data-tl-trigger=".about-card-container"
                data-tl-start={STARTS[i]}
                data-tl-from="{'y': '3.5%', 'opacity': 0, 'scale': 0.97, 'filter': 'blur(10px)'}"
                data-tl-to="{'y': '0%', 'opacity': 1, 'scale': 1, 'filter': 'blur(0px)', 'duration': 1.45, 'delay': 0.2, 'ease': 'expo.out'}"
              >
                <div className="about-card-top">
                  <div
                    className="about-card-year"
                    data-number-count={entry.year}
                    data-tl-desktop
                    data-tl-trigger=".about-card-container"
                    data-tl-start={STARTS[i]}
                    data-tl-to="{'duration': 1.5, 'stagger': 0.1, 'delay': 0.2, 'ease': 'expo.out'}"
                  >
                    {entry.year}
                  </div>
                  <span className="about-card-period">{entry.period}</span>
                </div>

                <h3
                  className="about-card-heading"
                  data-tl-desktop
                  data-tl-type="trigger"
                  data-tl-trigger=".about-card-container"
                  data-tl-start={STARTS[i]}
                  data-tl-split="lines"
                  data-tl-from="{'yPercent': 100}"
                  data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.32, 'ease': 'expo.out'}"
                >
                  {entry.role}
                </h3>

                <p className="about-card-org">{entry.org}</p>

                <p
                  className="op80 about-card-teaser"
                  data-tl-desktop
                  data-tl-type="trigger"
                  data-tl-trigger=".about-card-container"
                  data-tl-start={STARTS[i]}
                  data-tl-split="lines"
                  data-tl-from="{'yPercent': 100}"
                  data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.08, 'delay': 0.42, 'ease': 'expo.out'}"
                >
                  {entry.teaser}
                </p>

                <div className="about-card-bottom-layout">
                  <button
                    type="button"
                    className="about-card-button"
                    aria-expanded="false"
                    data-tl-desktop
                    data-tl-type="trigger"
                    data-tl-trigger=".about-card-container"
                    data-tl-start={STARTS[i]}
                    data-tl-from="{'opacity': 0}"
                    data-tl-to="{'opacity': 1, 'duration': 1.4, 'delay': 0.7, 'ease': 'expo.out'}"
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
                  <h3 className="popup-heading">{entry.role}</h3>
                  <p className="popup-meta">
                    {entry.org} · {entry.period}
                  </p>
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
