/**
 * ICONS
 *
 * All inline, all `currentColor`, all on a 24-unit grid so they scale with
 * the vw system and inherit theme flips from the ThemeSwitcher without any
 * per-icon colour handling.
 */

type P = React.SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  ...p,
});

export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 10.2 12 3.6l8.5 6.6V20a.9.9 0 0 1-.9.9h-4.7v-6.2H9.1v6.2H4.4a.9.9 0 0 1-.9-.9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const IconJourney = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 20V9m0 0 3.2 3M5 9 1.9 12M19 4v11m0 0 3.1-3M19 15l-3.2-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.1" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const IconWork = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3.6" width="7.4" height="7.4" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.6" y="3.6" width="7.4" height="7.4" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
    <rect x="3" y="13.6" width="7.4" height="7.4" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.6" y="13.6" width="7.4" height="7.4" rx="1.4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.6l2.05 5.9 5.9 2.05-5.9 2.05L12 18.5l-2.05-5.9-5.9-2.05 5.9-2.05z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M18.4 16.4l.75 2.15 2.15.75-2.15.75-.75 2.15-.75-2.15-2.15-.75 2.15-.75z" fill="currentColor" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.9 21.4 8 12 13.1 2.6 8z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M2.6 12.5 12 17.6l9.4-5.1M2.6 16.8 12 21.9l9.4-5.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Both quote bowls are kept inside the 24-unit box — the earlier pair ran to
   x=24.4 and the right-hand glyph was clipped by the viewBox. */
export const IconQuote = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M9.1 5.6C5.6 7 3.4 9.8 3.4 13.4c0 3.2 1.9 5.4 4.5 5.4 2.1 0 3.7-1.5 3.7-3.6 0-1.9-1.3-3.3-3.1-3.3-.35 0-.7.05-.95.12.4-1.6 1.7-3 3.4-3.8zM20.6 5.6C17.1 7 14.9 9.8 14.9 13.4c0 3.2 1.9 5.4 4.5 5.4 2.1 0 3.7-1.5 3.7-3.6 0-1.9-1.3-3.3-3.1-3.3-.35 0-.7.05-.95.12.4-1.6 1.7-3 3.4-3.8z"
      fill="currentColor"
    />
  </svg>
);

export const IconFaq = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9.1" stroke="currentColor" strokeWidth="1.7" />
    <path d="M9.4 9.3a2.7 2.7 0 1 1 3.5 2.6c-.6.2-.9.7-.9 1.3v.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="12" cy="16.8" r="1.05" fill="currentColor" />
  </svg>
);

export const IconLinkedIn = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.2 9.4v9.3M6.2 5.6v.02M10.6 18.7V9.4m0 3.3c0-1.9 1.2-3.3 3.1-3.3s3.3 1.3 3.3 3.5v5.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="m3.6 7.4 7.3 5.1a2 2 0 0 0 2.2 0l7.3-5.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M7.4 16.6 16.6 7.4M9 7.4h7.6V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M15 6.2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.6 4.4 4.4L19 7.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="m6.6 9.4 5.4 5.2 5.4-5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowLeftSm = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 5.5 8 12l7 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowRightSm = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 5.5 16 12l-7 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.6 6.6l10.8 10.8M17.4 6.6 6.6 17.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
