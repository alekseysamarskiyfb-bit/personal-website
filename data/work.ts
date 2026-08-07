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
  /** The one line printed under the frame. Videos read "Video 1"; stills read
   *  their category and creative number. Nothing else is captioned. */
  label: string;
  /** Two digits, drawn as the chip on the frame. */
  index: string;
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
    label: "Video 1",
    index: "01",
  },
  {
    kind: "video",
    poster: "/work/creative-2.jpg",
    label: "Video 2",
    index: "02",
  },
  {
    kind: "video",
    poster: "/work/creative-1.jpg",
    label: "Video 3",
    index: "03",
  },
  {
    kind: "video",
    poster: "/work/creative-6.jpg",
    label: "Video 4",
    index: "04",
  },
  {
    kind: "image",
    src: "/work/creative-7.jpg",
    label: "Affiliate · Creative 1",
    index: "05",
  },
  {
    kind: "image",
    src: "/work/creative-5.jpg",
    label: "Crypto signals · Creative 2",
    index: "06",
  },
  {
    kind: "image",
    src: "/work/creative-3.jpg",
    label: "Referral · Creative 3",
    index: "07",
  },
  {
    kind: "image",
    src: "/work/creative-4.jpg",
    label: "Crypto · Creative 4",
    index: "08",
  },
];
