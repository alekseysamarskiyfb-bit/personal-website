import Reveal from "@/components/motion/Reveal";
import { SITE } from "@/data/site";
import { ArrowUpRight, Telegram } from "./icons";

/**
 * The whole site converges here, and it offers exactly one thing to do.
 * `noLeave` because this sits inside the last viewport of the document — its
 * bottom edge can never reach the leave range, so it would fade out and stay
 * out.
 */
export default function Cta() {
  return (
    <section className="section cta-section" id="contact">
      <div className="shell">
        <Reveal className="cta-panel glass" noLeave strength={0.9}>
          <p className="eyebrow">Next step</p>
          <h2 className="display cta-panel__head">
            Send me the brief.
            <br />
            <span className="serif">I&rsquo;ll send back the creative.</span>
          </h2>
          <p className="cta-panel__sub">
            Static, motion, or a full campaign set — write to me on Telegram and
            we can look at what you are running now.
          </p>
          <a
            className="cta cta-panel__button"
            href={SITE.telegram}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Telegram />
            Message me on Telegram
            <ArrowUpRight className="arrow" />
          </a>
          <p className="cta-panel__handle">{SITE.telegramHandle}</p>
        </Reveal>
      </div>
    </section>
  );
}
