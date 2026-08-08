export type Service = {
  title: string;
  blurb: string;
};

/**
 * Ordered by what Velar leads with. Vertical video is the studio's centre of
 * gravity; the static work sits behind it because it is what the same brands
 * ask for next, not because it is a second business.
 */
export const VELAR_SERVICES: Service[] = [
  {
    title: "Vertical video ads",
    blurb:
      "Nine-by-sixteen, cut for the first two seconds, made to survive a thumb.",
  },
  {
    title: "Content for creators",
    blurb:
      "Podcasts, streams and channels cut into short-form that earns the next tap.",
  },
  {
    title: "AI-powered content",
    blurb:
      "Generative pipelines used where they earn their place — volume, variation, speed.",
  },
  {
    title: "Instagram Stories",
    blurb:
      "Built for the format rather than cropped into it: full-bleed, tap-paced, thumb-first.",
  },
  {
    title: "Social media posts",
    blurb:
      "Whole content systems rather than one-off posts, so a feed reads as one brand.",
  },
  {
    title: "Static ad creatives",
    blurb:
      "Any platform, any format — one idea rebuilt to fit each placement properly.",
  },
];
