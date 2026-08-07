import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { WORK, type WorkItem } from "@/data/work";

const SIZES = "(max-width: 620px) 84vw, (max-width: 1080px) 44vw, 23vw";

/**
 * One frame, three possible payloads: a still, a playing video, or a video
 * slot still waiting for its file. Every slot is 9:16 regardless — see
 * data/work.ts.
 */
function WorkMedia({ item }: { item: WorkItem }) {
  if (item.kind === "video") {
    if (!item.src) {
      // Placeholder: the poster holds the frame so the row reads finished,
      // and the play mark says what will live here.
      return item.poster ? (
        <Image
          className="work__media"
          src={item.poster}
          alt=""
          aria-hidden="true"
          width={506}
          height={900}
          sizes={SIZES}
        />
      ) : (
        <div className="work__media work__media--empty" aria-hidden="true" />
      );
    }

    return (
      <video
        className="work__media"
        src={item.src}
        poster={item.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={item.label}
      />
    );
  }

  return (
    <Image
      className="work__media"
      src={item.src as string}
      alt={item.label}
      width={506}
      height={900}
      sizes={SIZES}
    />
  );
}

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="display">
            Selected <span className="serif">work</span>
          </h2>
          <p className="eyebrow">9:16 · paid social</p>
        </Reveal>

        <ul className="work__grid">
          {WORK.map((item, i) => (
            <Reveal
              as="li"
              className="work__item"
              key={item.index}
              index={i % 4}
              strength={0.75}
            >
              <div className="work__frame glass">
                <WorkMedia item={item} />
                <span className="work__sheen" aria-hidden="true" />
                <span className="work__index" aria-hidden="true">
                  {item.index}
                </span>
                {item.kind === "video" ? (
                  <span className="work__play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M9 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
                    </svg>
                  </span>
                ) : null}
              </div>
              <p className="work__label">
                <span className="work__rule" aria-hidden="true" />
                {item.label}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
