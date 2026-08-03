"use client";

import { useEffect, useRef, useState, type UIEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import YearOdometer from "@/components/YearOdometer";
import TextReveal from "@/components/TextReveal";

type Entry = {
  year: string;
  handle: string;
  ago: string;
  teaser: string;
  story: string;
  tags: string[];
};

const entries: Entry[] = [
  {
    year: "2023",
    handle: "@affiliate",
    ago: "3 years ago",
    teaser: "First real campaigns.",
    story:
      "I started as a Junior Performance Designer, producing static, video and animated creatives for Sweepstakes and Crypto paid campaigns — UGC-style ads, landing pages, all of it. No mentor telling me the rules, just a lot of creatives that didn't work, until some did.",
    tags: ["UGC Advertising", "Motion Design"],
  },
  {
    year: "2024",
    handle: "@adprodigies",
    ago: "2 years ago",
    teaser: "Learning to lead.",
    story:
      "I was handed a team of 4 designers at ADPRODIGIES and put in charge of the Search affiliate vertical. Weekly creative review calls with media buyers, internal visual systems for the team, A/B-testing strategy — running that process taught me more about what actually converts than a year of solo production ever did.",
    tags: ["Team Leadership", "Performance Marketing"],
  },
  {
    year: "2025",
    handle: "@ai",
    ago: "1 year ago",
    teaser: "Scaling with AI in the pipeline.",
    story:
      "Prompt engineering and AI-generated ad assets went from experiment to daily workflow. I kept producing across Traffic Place, ADPRODIGIES and a private media-buying team — Sweepstakes, iGaming, affiliate creative — while the volume and speed of what one person could ship kept climbing.",
    tags: ["AI Creative", "Prompt Engineering"],
  },
  {
    year: "2026",
    handle: "@velar",
    ago: "Now",
    teaser: "Building something of my own.",
    story:
      "Senior Performance Creative Designer on a private affiliate team — and founder of Velar Studio. Everything up to this point, the failed creatives, the team lead seat, the AI-assisted pipelines, became the foundation for a real creative production venture, not just a portfolio.",
    tags: ["Founder", "Velar Studio"],
  },
];

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!section || !scroller || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () =>
        Math.max(track.scrollWidth - scroller.clientWidth, 0);

      setPinned(true);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        pinType: "transform",
        anticipatePin: 1,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const amount = getScrollAmount();
          gsap.set(track, { x: -amount * self.progress });
          setProgress(self.progress);
          setActiveIndex(
            Math.min(
              entries.length - 1,
              Math.round(self.progress * (entries.length - 1))
            )
          );
        },
      });

      return () => {
        st.kill();
        gsap.set(track, { clearProps: "x" });
        setPinned(false);
      };
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [openIndex]);

  function handleNativeScroll(e: UIEvent<HTMLDivElement>) {
    if (pinned) return;
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setActiveIndex(
      Math.min(entries.length - 1, Math.round(p * (entries.length - 1)))
    );
  }

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="timeline-section max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline"
    >
      <p className="eyebrow eyebrow-signal mb-4">My Journey</p>
      <TextReveal className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-2xl">
        How I got here.
      </TextReveal>
      <p className="text-lg text-muted max-w-xl mb-14">
        Not a resume — the actual path. Scroll through, click into any year
        for the longer story.
      </p>

      <div className="timeline-pin">
        <div
          ref={scrollerRef}
          onScroll={handleNativeScroll}
          className={`timeline-scroller ${pinned ? "timeline-scroller--pinned" : ""}`}
        >
        <div ref={trackRef} className="timeline-track">
          {entries.map((entry, i) => {
            const open = openIndex === i;
            const active = activeIndex === i;
            return (
              <div
                key={entry.year}
                className={`timeline-card glass ${active ? "timeline-card--active" : ""} ${open ? "timeline-card--open" : ""}`}
              >
                <YearOdometer year={entry.year} className="timeline-card__year" />
                <div className="timeline-card__meta">
                  <span>{entry.handle}</span>
                  <span className="dot">•</span>
                  <span>{entry.ago}</span>
                </div>
                <p className="timeline-card__teaser">{entry.teaser}</p>

                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="timeline-card__toggle focus-ring rounded"
                >
                  {open ? "Show less" : "Read more"}
                  <span className="timeline-card__toggle-icon">+</span>
                </button>

                <div className="timeline-card__expand">
                  <div className="timeline-card__expand-inner">
                    <p className="timeline-card__story">{entry.story}</p>
                    <div className="timeline-card__tags">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="tag text-muted border hairline rounded-full px-3 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        <div className="timeline-progress hidden md:flex">
          <span className="timeline-hint">2023</span>
          <div className="timeline-progress__bar">
            <div
              className="timeline-progress__fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="timeline-hint">Now</span>
        </div>
      </div>
    </section>
  );
}
