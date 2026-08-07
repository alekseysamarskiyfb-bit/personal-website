/**
 * The site's motion vocabulary, in one place.
 *
 * Every reveal on the page is the same gesture at different amplitudes:
 * opacity, a blur, and a small vertical move. Sections differ in how far they
 * travel, never in how they behave — that consistency is what reads as
 * "designed" rather than "animated".
 */

export const REVEAL = {
  /** Vertical travel on the way in, in pixels. */
  rise: 44,
  /** Travel on the way out is shorter, so leaving feels like receding. */
  fall: 26,
  /** Blur at the extremes of both phases. */
  blur: 12,
  /** Scrub smoothing, in seconds of catch-up. */
  scrub: 0.55,
  /** Enter phase: from just below the fold to comfortably inside it. The start
   *  is a number because Reveal shifts it per item to stagger a group. */
  enterStart: 93,
  enterEnd: "top 62%",
  /** Leave phase: begins only once the element is genuinely on its way out. */
  leaveStart: "bottom 32%",
  leaveEnd: "bottom 2%",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
