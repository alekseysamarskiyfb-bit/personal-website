"use client";

import { useState, ReactNode } from "react";

export default function JourneyItem({
  year,
  teaser,
  children,
  tags,
  now = false,
}: {
  year: string;
  teaser: string;
  children: ReactNode;
  tags?: string[];
  now?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`journey-item ${now ? "journey-item--now" : ""} ${open ? "journey-item--open" : ""}`}>
      <p className="journey-item__year">{year}</p>

      <div>
        <p className="journey-item__teaser">{teaser}</p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="journey-item__toggle focus-ring rounded"
        >
          {open ? "Show less" : "Read more"}
          <span className="journey-item__toggle-icon">+</span>
        </button>

        <div className="journey-item__expand">
          <div className="journey-item__expand-inner">
            <p className="journey-item__story">{children}</p>
            {tags && tags.length > 0 && (
              <div className="journey-item__tags">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="tag text-muted border hairline rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
