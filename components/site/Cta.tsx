/**
 * CTA — the chat simulation.
 *
 * One typing indicator physically travels between the message slots: it types
 * where the reply will appear, moves to where the button will appear, then
 * leaves. Each bubble lands with a 1 -> 1.03 -> 1 overshoot and grows from
 * its bottom-left corner, which is what makes it read as a message arriving.
 *
 * "Experience" is outlined rather than filled — an outlined ghost word inside
 * a solid heading, the one place the type does something other than sit flat.
 */

import { TELEGRAM, TELEGRAM_HANDLE } from "./navData";
import { IconTelegram } from "./icons";

export default function Cta() {
  return (
    <section className="cta_section section-inset" id="contact">
      <div className="column cta-column" id="cta_column">
        <h2
          className="cta_heading"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger="#cta_column"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          Let&rsquo;s build the
          <br />
          <span className="cta-span-heading">creative</span> engine
        </h2>

        <p
          className="max-width-389 op80"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger="#cta_column"
          data-tl-start="top 65%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          Running paid and the creative can&rsquo;t keep up? Or starting a
          channel and want it built properly the first time? Either way, tell me
          what you&rsquo;re working on.
        </p>

        <div className="cta-wrap">
          <div className="cta-avatar" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/avatar.jpeg" alt="" width={64} height={64} />
          </div>

          <div className="cta-column-item">
            {/* Slot 1 — the reply */}
            <div className="cta-chat-grid">
              <div className="cta-chat-grid-item">
                <div className="cta-bubble cta-chat">
                  <p className="cta-text">
                    Send over what you&rsquo;re running and I&rsquo;ll tell you
                    what I&rsquo;d change first. Telegram is fastest.
                  </p>
                </div>
              </div>
            </div>

            {/* Slot 2 — the action */}
            <div className="cta-button-grid">
              <div className="cta-button-grid-item">
                <a
                  className="cta-bubble cta-button"
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-button-hover
                >
                  <IconTelegram className="cta-button-icon" aria-hidden />
                  <p>@{TELEGRAM_HANDLE}</p>
                </a>
              </div>
            </div>

            {/* The traveller. Starts at slot 1, moves to slot 2, then leaves. */}
            <div className="typing-grid" aria-hidden>
              <div className="cta-bubble cta-chat-typing-wrap">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
