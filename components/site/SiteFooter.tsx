/**
 * FOOTER — the wordmark image trail + FAQ.
 *
 * The trail images are appended INSIDE the mark's SVG, so they are clipped to
 * the letterforms: the pictures only ever appear within the name. A <clipPath>
 * built from the same text does the clipping, and #image-trail-group is where
 * ImageTrail injects.
 *
 * FAQ opens via grid-template-rows 0fr -> 1fr, so the panel animates to its
 * true auto height without measuring anything.
 */

import { EMAIL, INSTAGRAM, LINKEDIN, TELEGRAM, TELEGRAM_HANDLE } from "./navData";
import { MARK_H, MARK_W, WORD, WORD_LABEL } from "./Wordmark";
import { IconArrowUpRight, IconInstagram, IconTelegram, IconLinkedIn, IconMail } from "./icons";

const FAQS = [
  {
    q: "What do you actually produce?",
    a: "Static, motion and AI-assisted creative for paid acquisition — plus the brand and system work underneath it. In practice that's hooks, variants, landing heroes and the templates that let a team keep shipping them.",
  },
  {
    q: "Do you work with the media buyer or separately?",
    a: "With them, always. The test structure gets agreed before production, so each asset answers a question. Creative made without knowing what's being tested is just decoration.",
  },
  {
    q: "How do you use AI?",
    a: "As a production accelerator, not a replacement. Prompt-built scenes and talent where it saves real time, finished by hand wherever the model gives itself away. The judgement about what to make is still the job.",
  },
  {
    q: "What's the fastest you can start?",
    a: "Depends on the shape of the work. A focused sprint can usually start within a week or two; ongoing engagements are scheduled around existing commitments. Telegram is the fastest way to ask.",
  },
  {
    q: "Do you take equity or rev-share?",
    a: "Open to it alongside a base, for products I'd use myself. Not as the whole arrangement.",
  },
  {
    q: "What is Velar Studio?",
    a: "My own creative production venture — the same loop of create, test, read the numbers and iterate, run as a studio rather than as one freelancer. There is a section on it above.",
  },
];

export default function SiteFooter() {
  return (
    <footer className="footer section-inset" id="footer">
      {/* Hover the mark to scatter real ad creatives inside the letterforms. */}
      <div
        className="footer-logo"
        data-trail-images="/work/creative-1.jpg,/work/creative-2.jpg,/work/creative-3.jpg,/work/creative-4.jpg,/work/creative-5.jpg,/work/creative-6.jpg,/work/creative-7.jpg,/work/creative-8.jpg"
      >
        {/* Geometry and the word itself come from Wordmark, so this copy of
            the mark can never drift from the rail/hero one. */}
        <svg
          className="footer-logo-icon"
          viewBox={`0 0 ${MARK_W} ${MARK_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={WORD_LABEL}
        >
          <defs>
            <clipPath id="footer-mark-clip">
              <text
                x="0"
                y={MARK_H}
                textLength={MARK_W}
                lengthAdjust="spacing"
                className="mark-svg-text"
              >
                {WORD}
              </text>
            </clipPath>
          </defs>

          <text
            x="0"
            y={MARK_H}
            textLength={MARK_W}
            lengthAdjust="spacing"
            fill="currentColor"
            className="mark-svg-text footer-mark-fill"
          >
            {WORD}
          </text>

          {/* Trail images land here, clipped to the letterforms. */}
          <g id="image-trail-group" clipPath="url(#footer-mark-clip)" />
        </svg>
      </div>

      {/* The FAQ anchor lives HERE, not on the <footer>. The footer opens with
          the full-bleed decorative wordmark, so "FAQ" in the nav scrolled to a
          screen of letterforms with the questions still below the fold. */}
      <div className="column faq-column-main" id="faq">
        <p
          className="label"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger=".faq-column-main"
          data-tl-start="top 90%"
          data-tl-from="{'width': '0vw', 'opacity': 0}"
          data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
        >
          FAQ
        </p>
        <h2
          className="h2-style margin-bottom-s"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger=".faq-column-main"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          Questions,
          <br />
          answered
        </h2>

        <div className="faq-column">
          {FAQS.map((item, i) => (
            <div className="faq" key={i}>
              <button
                type="button"
                className="faq-toggle"
                aria-expanded="false"
                aria-controls={`faq-answer-${i}`}
              >
                <span className="faq-heading">{item.q}</span>
                <span className="faq-icon" aria-hidden>
                  <span className="faq-icon-item">
                    <span className="faq-icon-h-line" />
                    <span className="faq-icon-v-line" />
                  </span>
                </span>
              </button>

              <div className="faq-answer-wrap" id={`faq-answer-${i}`}>
                <div className="faq-answer-item">
                  <p className="faq-answer op80">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-menu-item">
          <span className="footer-menu-label">Elsewhere</span>
          <a className="footer-link" href={TELEGRAM} target="_blank" rel="noopener noreferrer">
            <IconTelegram className="footer-link-glyph" aria-hidden />
            Telegram
            <IconArrowUpRight className="footer-link-arrow" />
          </a>
          <a className="footer-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
            <IconInstagram className="footer-link-glyph" aria-hidden />
            Instagram
            <IconArrowUpRight className="footer-link-arrow" />
          </a>
          <a className="footer-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            <IconLinkedIn className="footer-link-glyph" aria-hidden />
            LinkedIn
            <IconArrowUpRight className="footer-link-arrow" />
          </a>
          <a className="footer-link" href={`mailto:${EMAIL}`}>
            <IconMail className="footer-link-glyph" aria-hidden />
            Email
            <IconArrowUpRight className="footer-link-arrow" />
          </a>
        </div>

        <p className="footer-colophon op80">
          © {new Date().getFullYear()} Oleksii Samarskyi — Performance creative
          &amp; growth. Founder of Velar Studio.
        </p>
      </div>
    </footer>
  );
}
