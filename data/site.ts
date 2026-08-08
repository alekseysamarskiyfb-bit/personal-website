export const SITE = {
  firstName: "Oleksii",
  lastName: "Samarskyi",
  role: "Creative & Motion Designer",
  /** The agency he founded. Named in one place so a rebrand is one edit — the
   *  last one ("Velar Studio") was spelled out in five files. */
  agency: "Velar Agency",
  agencyMark: "VELAR",
  /** Every contact affordance on the page points here. One conversion point. */
  telegram: "https://t.me/o_samarskyi",
  telegramHandle: "@o_samarskyi",
  location: "Remote · Poland",
} as const;

export const NAV = [
  { label: "Agency", href: "#velar" },
  { label: "Career", href: "#career" },
  { label: "Work", href: "#work" },
] as const;
