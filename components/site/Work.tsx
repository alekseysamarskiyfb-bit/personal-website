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
  { id: "01", img: "/work/creative-1.jpg", title: "Trading signals — proof hook", tags: ["Static", "Crypto"], blurb: "Result screenshots as the hook: the claim is the creative, so the first frame has to carry the evidence." },
  { id: "02", img: "/work/creative-2.jpg", title: "Crypto — channel funnel", tags: ["Static", "HI market"], blurb: "Built to move cold traffic one step, into the channel, rather than to close in a single frame." },
  { id: "03", img: "/work/creative-3.jpg", title: "Futures — gain stack", tags: ["Static", "TR market"], blurb: "A modular layout that lets the numbers and the language be swapped without redrawing the concept." },
  { id: "04", img: "/work/creative-4.jpg", title: "Trading — question opener", tags: ["Static", "Localised"], blurb: "Opens on the reader's own question, rebuilt per market — the promise stays fixed, the tone does not." },
  { id: "05", img: "/work/creative-5.jpg", title: "Crypto — drop campaign", tags: ["Static", "Set"], blurb: "One visual system across placements — high contrast so the family stays legible at thumbnail size." },
  { id: "06", img: "/work/creative-6.jpg", title: "Signals — social proof", tags: ["Static", "UGC"], blurb: "Social-proof framing built to survive the first two seconds of a cold feed." },
  { id: "07", img: "/work/creative-7.jpg", title: "Futures — CTA variant", tags: ["Static", "A/B"], blurb: "A call-to-action variant produced purely to isolate one question in the test matrix." },
  { id: "08", img: "/work/creative-8.jpg", title: "Crypto — long-form angle", tags: ["Static", "Angle"], blurb: "The patient angle: more copy, slower promise, aimed at a warmer segment of the same audience." },
];

export default function Work() {
  return (
    <section className="work_section" id="portfolio">
      <div className="work-sticky-support" aria-hidden />

      <div className="work-sticky">
        <div className="work-container">
          <div className="work-top-layout">
            <div className="column">
              <p
                className="label"
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
                className="h2-style"
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
Vertical-format creative for paid acquisition — produced against
              live test data, not a moodboard. This set is one crypto campaign,
              localised across markets and split into the angles it was
              actually tested as.
            </p>
          </div>

          {/* padding-left: 55% starts the track inside the viewport, so the
              first card enters from the right instead of sitting flush. */}
          <div className="work-track-wrap">
            <div className="work-track">
              {CARDS.map((card) => (
                <article className="work-card" key={card.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="work-card-media"
                    src={card.img}
                    alt=""
                    width={900}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                  />
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
