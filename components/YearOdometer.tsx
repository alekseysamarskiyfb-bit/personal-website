"use client";

import { useEffect, useRef, useState } from "react";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
// Each strip holds two 0-9 sets so it can roll a full lap before landing.
const STRIP = [...DIGITS, ...DIGITS];
const CELL_STEP = 100 / STRIP.length;

/**
 * Slot-machine year, like the reference: every digit is a column of 0-9 that
 * rolls into place when the card scrolls in. Driven by a CSS transition, so it
 * needs no animation frames and cannot get stuck mid-roll.
 */
export default function YearOdometer({
  year,
  className = "",
}: {
  year: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRolled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={ref} className={`odometer ${className}`} aria-label={year}>
      {year.split("").map((char, i) => {
        const target = DIGITS.indexOf(char);
        if (target === -1) {
          return (
            <span key={i} aria-hidden>
              {char}
            </span>
          );
        }
        return (
          <span key={i} className="odometer__col" aria-hidden>
            <span
              className="odometer__strip"
              style={{
                transform: rolled
                  ? `translateY(${-(10 + target) * CELL_STEP}%)`
                  : "translateY(0%)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              {STRIP.map((d, j) => (
                <span key={j} className="odometer__cell">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </p>
  );
}
