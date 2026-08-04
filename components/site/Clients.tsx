/**
 * CLIENTS — the carousel + custom drag cursor.
 *
 * The track is deliberately narrow (33.13vw) and left-aligned so the next
 * slide peeks: the affordance is the composition, not a chevron.
 *
 * The native cursor is suppressed over the track and replaced by a fixed
 * indicator whose arrows scale toward the drag direction.
 *
 * PLACEHOLDER CONTENT: these are structural placeholders, not testimonials.
 * No quote here is attributed to a real person, because inventing one would
 * be fabricating a record. Replace each entry with a real quote you have
 * permission to publish, or delete the section.
 */

import { IconArrowLeftSm, IconArrowRightSm, IconQuote } from "./icons";

const SLOTS = [
  {
    id: 1,
    heading: "Quote headline goes here.",
    body: "Replace with a real quote from someone you've worked with. Keep it to the specific thing they'd actually say — what changed, how fast, what it was like to work together.",
    name: "Name",
    role: "Role",
    org: "Company",
  },
  {
    id: 2,
    heading: "A second quote, shorter.",
    body: "Two to four sentences reads best at this width. Anything longer and the card stops being scannable at the size it's shown.",
    name: "Name",
    role: "Role",
    org: "Company",
  },
  {
    id: 3,
    heading: "And a third.",
    body: "Three is the minimum that makes a carousel feel worth dragging. Below that, consider a static row instead.",
    name: "Name",
    role: "Role",
    org: "Company",
  },
];

export default function Clients() {
  return (
    <section className="testimonial_section section-inset" id="clients">
      <div className="column" id="client_column">
        <p
          className="label"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger="#client_column"
          data-tl-start="top 90%"
          data-tl-from="{'width': '0vw', 'opacity': 0}"
          data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
        >
          Testimonials
        </p>
        <h2
          className="h2-style margin-bottom-s"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger="#client_column"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          From people
          <br />
          I&rsquo;ve worked with
        </h2>
      </div>

      <div className="swiper-main-wrap">
        <div
          className="swiper"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
        >
          <div className="swiper-wrapper">
            {SLOTS.map((s) => (
              <div className="swiper-slide" key={s.id} aria-roledescription="slide">
                <figure className="swiper-card">
                  <div className="swiper-card-top">
                    <p className="swiper-heading">{s.heading}</p>
                    <IconQuote className="swiper-quote-icon" aria-hidden />
                  </div>

                  <blockquote className="swiper-body op80">{s.body}</blockquote>

                  <figcaption className="swiper-card-bottom">
                    <span className="client-img" aria-hidden />
                    <span className="client-info">
                      <span className="client-name">{s.name}</span>
                      <span className="client-text-small">{s.role}</span>
                      <span className="client-text-link">{s.org}</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        <div className="swiper-pagination" role="tablist" aria-label="Choose testimonial" />
      </div>

      <p className="service-placeholder-note">
        Testimonials are placeholders — replace <code>SLOTS</code> in{" "}
        <code>components/site/Clients.tsx</code> with real, permitted quotes, or
        remove the section.
      </p>

      {/* Fixed drag indicator. Lives here so it can be positioned anywhere. */}
      <div className="drag-wrap" aria-hidden>
        <IconArrowLeftSm className="drag-left-icon" />
        <span className="drag-circle">
          <span className="drag-circle-span">Drag</span>
        </span>
        <IconArrowRightSm className="drag-right-icon" />
      </div>
    </section>
  );
}
