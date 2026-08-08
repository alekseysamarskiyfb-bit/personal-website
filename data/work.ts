export type WorkItem = {
  kind: "image" | "video";
  /**
   * Video: the file the browser plays. Omitted while the slot is a
   * placeholder — the frame still renders, posterless, with its play mark.
   * Image: the still itself.
   */
  src?: string;
  /** Still behind a video, shown before it decodes and while src is absent. */
  poster?: string;
  /** The chip printed on the frame — "Video 01", "Static 03". It is the only
   *  text the card shows, so keep it to the kind and its two digits. */
  label: string;
  /** What the creative actually is, in two or three words. Never rendered:
   *  it is the image's alt text and the video's accessible name, so a screen
   *  reader gets the work rather than the slot number. */
  alt: string;
};

/**
 * Row one is video, row two is stills — four each, in that order. Turning a
 * placeholder into a real video is one field: give it `src`. Work reads the
 * kind and renders the right element; no component changes.
 */
export const WORK: WorkItem[] = [
  {
    kind: "video",
    poster: "/work/creative-8.jpg",
    label: "Video 01",
    alt: "Affiliate promo",
  },
  {
    kind: "video",
    poster: "/work/creative-2.jpg",
    label: "Video 02",
    alt: "Trading education",
  },
  {
    kind: "video",
    poster: "/work/creative-1.jpg",
    label: "Video 03",
    alt: "Futures results",
  },
  {
    kind: "video",
    poster: "/work/creative-6.jpg",
    label: "Video 04",
    alt: "Signal channel",
  },
  {
    kind: "image",
    src: "/work/creative-7.jpg",
    label: "Static 01",
    alt: "Affiliate offer",
  },
  {
    kind: "image",
    src: "/work/creative-5.jpg",
    label: "Static 02",
    alt: "Signals dashboard",
  },
  {
    kind: "image",
    src: "/work/creative-3.jpg",
    label: "Static 03",
    alt: "Referral program",
  },
  {
    kind: "image",
    src: "/work/creative-4.jpg",
    label: "Static 04",
    alt: "Airdrop teaser",
  },
];
