"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Word-by-word rise on scroll.
 *
 * Deliberately IntersectionObserver + CSS transitions rather than a GSAP
 * tween: this needs no animation frames, so the words still land correctly
 * when rAF is throttled (background tabs, reduced-power modes) instead of
 * leaving a heading permanently blank.
 */
export default function TextReveal({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = children.split(" ");

  return (
    <Tag ref={ref} className={`text-reveal ${visible ? "is-visible" : ""} ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="reveal-word">
          <span
            className="reveal-word__inner"
            style={{ transitionDelay: `${delay + i * 55}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
