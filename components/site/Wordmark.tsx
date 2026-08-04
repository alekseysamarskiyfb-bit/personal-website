/**
 * WORDMARK — two renderings of the same mark, for two different jobs.
 *
 * WordmarkSVG  — the rail + hero-ghost pair. Must survive being FLIP'd from
 *   8.4vw up to 94.44vw (~11x). Transform-scaling HTML text at that factor
 *   rasterises once and then stretches the bitmap, so it goes soft for the
 *   whole scrub. An SVG re-rasterises at every size, so the engine animates
 *   its width/height instead of its scale and the glyphs stay razor sharp.
 *   `textLength` + `lengthAdjust="spacing"` locks the mark to the box width
 *   without distorting glyph shapes, which also makes it immune to a font
 *   swap changing the metrics mid-load.
 *
 * WordmarkLetters — preloader only. Per-letter masking and a 0.2 stagger are
 *   the signature of the intro, and that needs one maskable box per glyph,
 *   which a single <text> cannot give. Both renderings are pinned to the same
 *   box via --mark-w / --mark-aspect / --mark-cap, so the handoff at t=2 is a
 *   single-frame swap with no visible shift.
 */

const WORD = "OLEKSII";

export function WordmarkSVG({
  className = "",
  ...rest
}: { className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`mark-svg ${className}`}
      /* 464 x 150 is the mark's NATURAL box, measured from the live font
         rather than assumed: Anton's cap height is 0.8672em, so a 173px size
         puts the caps at exactly 150 units and "OLEKSII" sets 464 units wide.
         Locking textLength to that width means the mark renders untouched
         with the real face and only re-spaces if a fallback loads — a font
         swap can never change the mark's footprint mid-FLIP. Baseline sits on
         the viewBox floor, so the box IS the cap height with no slack. */
      viewBox="0 0 464 150"
      preserveAspectRatio="xMinYMid meet"
      role="img"
      aria-label="Oleksii"
      {...rest}
    >
      <text
        x="0"
        y="150"
        textLength="464"
        lengthAdjust="spacing"
        fill="currentColor"
        className="mark-svg-text"
      >
        {WORD}
      </text>
    </svg>
  );
}

export function WordmarkLetters({ className = "" }: { className?: string }) {
  return (
    <span className={`mark-letters ${className}`} role="img" aria-label="Oleksii">
      {WORD.split("").map((char, i) => (
        <span className="mark-letter-mask" key={i} aria-hidden>
          <span className="mark-letter">{char}</span>
        </span>
      ))}
    </span>
  );
}
