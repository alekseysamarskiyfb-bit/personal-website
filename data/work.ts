export type WorkItem = {
  /** Path under /public. For video, the file the browser plays. */
  src: string;
  kind: "image" | "video";
  /** Still shown before a video decodes. Ignored for images. */
  poster?: string;
  title: string;
  vertical: string;
  /** Ad market the creative was cut for. */
  market: string;
  /** BCP-47 tag for titles that are not English, so a screen reader does not
   *  read them with English phonetics. Omitted when the title is English. */
  lang?: string;
};

/**
 * Swapping any still for a video is a two-field change here — `kind: "video"`
 * and an `src` ending in .mp4, with an optional poster. WorkCard reads the
 * kind and renders the right element; no component changes.
 */
export const WORK: WorkItem[] = [
  {
    src: "/work/creative-7.jpg",
    kind: "image",
    title: "Turn Traffic Into Crypto",
    vertical: "Affiliate",
    market: "EN",
  },
  {
    src: "/work/creative-5.jpg",
    kind: "image",
    title: "Trade With Confidence",
    vertical: "Crypto signals",
    market: "EN",
  },
  {
    src: "/work/creative-3.jpg",
    kind: "image",
    title: "Bağlantılarla Kazanç",
    lang: "tr",
    vertical: "Referral",
    market: "TR",
  },
  {
    src: "/work/creative-4.jpg",
    kind: "image",
    title: "Coin Drop",
    vertical: "Crypto",
    market: "EN",
  },
  {
    src: "/work/creative-8.jpg",
    kind: "image",
    title: "Turn Traffic Into Profits",
    vertical: "Affiliate",
    market: "EN",
  },
  {
    src: "/work/creative-2.jpg",
    kind: "image",
    title: "Crypto Trading, Simplified",
    vertical: "Education",
    market: "HI",
  },
  {
    src: "/work/creative-1.jpg",
    kind: "image",
    title: "Möchtest Du Das Trading",
    lang: "de",
    vertical: "Crypto",
    market: "DE",
  },
  {
    src: "/work/creative-6.jpg",
    kind: "image",
    title: "Przestań Tracić Pieniądze",
    lang: "pl",
    vertical: "UGC",
    market: "PL",
  },
];
