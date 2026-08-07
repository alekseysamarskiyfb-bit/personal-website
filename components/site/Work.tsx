import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { WORK, type WorkItem } from "@/data/work";

/**
 * One frame, two possible payloads. Every slot is 9:16 regardless of what
 * fills it, so turning a still into a video is a data change — see data/work.ts.
 */
function WorkMedia({ item }: { item: WorkItem }) {
  if (item.kind === "video") {
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
        aria-label={item.title}
        lang={item.lang}
      />
    );
  }

  return (
    <Image
      className="work__media"
      src={item.src}
      alt={item.title}
      lang={item.lang}
      width={506}
      height={900}
      sizes="(max-width: 620px) 84vw, (max-width: 1080px) 44vw, 23vw"
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
              key={item.src}
              index={i % 4}
              strength={0.75}
            >
              <div className="work__frame glass">
                <WorkMedia item={item} />
              </div>
              <div className="work__caption">
                <h3 lang={item.lang}>{item.title}</h3>
                <p>
                  {item.vertical}
                  <span aria-hidden="true"> · </span>
                  {item.market}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
