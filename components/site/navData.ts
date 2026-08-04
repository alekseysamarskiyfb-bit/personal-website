import {
  IconFaq,
  IconHome,
  IconJourney,
  IconLayers,
  IconQuote,
  IconSpark,
  IconWork,
} from "./icons";

export type NavLink = {
  id: string;
  label: string;
  href: string;
  side: "left" | "right";
  Icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
  /** Narrower glyph — optically corrected so it reads at the same weight. */
  narrow?: boolean;
};

/**
 * One source of truth for both the sidebar menu (which holds the REAL <a>
 * elements) and the hero row (which holds their transparent ghosts). The
 * ghost engine pairs them by `id`, so the two lists can never drift apart.
 */
export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home", href: "#top", side: "left", Icon: IconHome },
  { id: "journey", label: "Journey", href: "#journey", side: "left", Icon: IconJourney },
  { id: "work", label: "Work", href: "#work", side: "left", Icon: IconWork },
  { id: "what", label: "What You Get", href: "#what-you-get", side: "right", Icon: IconSpark },
  { id: "ways", label: "Ways to Work", href: "#ways", side: "right", Icon: IconLayers, narrow: true },
  { id: "clients", label: "Clients", href: "#clients", side: "right", Icon: IconQuote },
  { id: "faq", label: "FAQ", href: "#faq", side: "right", Icon: IconFaq },
];

export const EMAIL = "oleksii.samarskyii@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/oleksii-samarskyi";
