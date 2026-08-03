const items = [
  "META",
  "TIKTOK",
  "GOOGLE",
  "NATIVE",
  "MIDJOURNEY",
  "RUNWAY",
  "HEYGEN",
  "FIGMA",
  "AFTER EFFECTS",
  "CAPCUT",
];

export default function Marquee() {
  const loops = [0, 1, 2, 3];

  return (
    <div className="marquee overflow-hidden border-y hairline bg-ink-2/60" aria-label="Tools and platforms">
      <div className="marquee-track">
        {loops.map((loop) => (
          <div className="marquee-group" aria-hidden={loop > 0} key={loop}>
            {items.map((item) => (
              <span key={item} className="tag marquee-item text-muted">
                {item}
                <span className="marquee-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
