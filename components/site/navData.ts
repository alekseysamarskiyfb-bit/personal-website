import {
  IconFaq,
  IconHome,
  IconJourney,
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
  /** Renders with the gradient treatment reserved for the venture. */
  feature?: boolean;
};

/**
 * One source of truth for both the sidebar menu (which holds the REAL <a>
 * elements) and the hero row (which holds their transparent ghosts). The
 * ghost engine pairs them by `id`, so the two lists can never drift apart.
 */
export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home", href: "#top", side: "left", Icon: IconHome },
  { id: "journey", label: "Journey", href: "#journey", side: "left", Icon: IconJourney },
  { id: "work", label: "Portfolio", href: "#portfolio", side: "left", Icon: IconWork },
  { id: "what", label: "What You Get", href: "#what-you-get", side: "right", Icon: IconSpark },
  { id: "velar", label: "Velar Studio", href: "#velar", side: "right", Icon: IconQuote, feature: true },
  { id: "faq", label: "FAQ", href: "#faq", side: "right", Icon: IconFaq },
];

export const EMAIL = "oleksii.samarskyii@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/oleksii-samarskyi";

/* ---------------------------------------------------------------------------
   PLACEHOLDER HANDLES — replace before publishing.
   The Telegram CTA is the site's primary conversion point, so these must
   point at real accounts. Structure and styling are complete; only the
   usernames below need changing.
   --------------------------------------------------------------------------- */
export const TELEGRAM_HANDLE = "oleksii";
export const TELEGRAM = `https://t.me/${TELEGRAM_HANDLE}`;
export const INSTAGRAM_HANDLE = "oleksii";
export const INSTAGRAM = `https://instagram.com/${INSTAGRAM_HANDLE}`;
