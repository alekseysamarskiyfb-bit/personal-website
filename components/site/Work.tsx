/**
 * SELECTED WORK — the dark island with the pinned horizontal track.
 *
 * data-theme="dark" is what the ThemeSwitcher watches: the rail inverts
 * itself wherever it overlaps this section.
 *
 * The section is 400vh tall; .work-sticky pins to the BOTTOM (not the top)
 * and the track translates by its measured overflow. .work-sticky-support is
 * sized in JS to the difference, which is what keeps the sticky release
 * correct on a hard refresh.
 */

import { IconArrowUpRight } from "./icons";

const CARDS = [
  { id: "01", title: "Sweepstakes — UGC hooks", tags: ["UGC", "Meta", "Video"], blurb: "Hook-first vertical video built to survive the first two seconds of a cold feed." },
  { id: "02", title: "Crypto — paid static set", tags: ["Static", "Native"], blurb: "A modular static system that let one concept ship as forty placements without redrawing it." },
  { id: "03", title: "iGaming — motion promo", tags: ["Motion", "TikTok"], blurb: "Short-form motion built around a single reveal beat, cut four ways for testing." },
  { id: "04", title: "Search — banner system", tags: ["Banners", "Display"], blurb: "Display banners on a shared grid so the whole vertical could be refreshed in an afternoon." },
  { id: "05", title: "Velar Studio — brand reel", tags: ["Reels", "AI Video"], blurb: "Identity and launch reel for my own studio — the first thing I made purely to my own brief." },
  { id: "06", title: "Sweepstakes — landing hero", tags: ["Landing", "Static"], blurb: "Above-the-fold art direction tuned against live conversion data, not a mock." },
  { id: "07", title: "AI-assisted — UGC ads", tags: ["AI Video", "UGC"], blurb: "Prompt-built talent and scenes, finished by hand where the model still gives itself away." },
  { id: "08", title: "Crypto — carousel ads", tags: ["Carousel", "Meta"], blurb: "Sequential storytelling across frames, each one able to stand alone if it's the only one seen." },
];

export default function Work() {
  return (
    <section className="work_section" id="work" data-theme="dark">
      <div className="work-sticky-support" aria-hidden />

      <div className="work-sticky">
        <div className="work-container">
          <div className="work-top-layout">
            <div className="column">
              <p
                className="label is-secondary"
                data-tl-once
                data-tl-type="trigger"
                data-tl-trigger=".work-sticky"
                data-tl-start="top 80%"
                data-tl-from="{'width': '0vw', 'opacity': 0}"
                data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
              >
                Selected work
              </p>
              <h2
                className="h2-style-white"
                data-tl-once
                data-tl-type="trigger"
                data-tl-trigger=".work-sticky"
                data-tl-start="top 80%"
                data-tl-split="lines"
                data-tl-from="{'yPercent': 100}"
                data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
              >
                Built for the feed,
                <br />
                made to perform
              </h2>
            </div>

            <p
              className="work-top-text"
              data-tl-once
              data-tl-type="trigger"
              data-tl-trigger=".work-sticky"
              data-tl-start="top 80%"
              data-tl-split="lines"
              data-tl-from="{'yPercent': 100}"
              data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
            >
              Vertical-format creative for paid acquisition across Sweepstakes,
              Crypto, iGaming and Search — produced against live test data, not
              a moodboard.
            </p>
          </div>

          {/* padding-left: 55% starts the track inside the viewport, so the
              first card enters from the right instead of sitting flush. */}
          <div className="work-track-wrap">
            <div className="work-track">
              {CARDS.map((card) => (
                <article className="work-card" key={card.id}>
                  <div className="work-card-content">
                    <div className="work-card-content-top-layout">
                      <div className="work-label-wrap">
                        {card.tags.map((t) => (
                          <span className="work-label" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="work-label is-index">{card.id}</span>
                    </div>

                    <div className="work-card-content-bottom-layout">
                      <h3 className="work-card-heading">{card.title}</h3>
                      <p className="work-card-blurb">{card.blurb}</p>
                      <span className="work-card-arrow-wrap" aria-hidden>
                        <span className="work-card-arrow-icon">
                          <IconArrowUpRight className="work-card-arrow" />
                          <IconArrowUpRight className="work-card-arrow-2" />
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
