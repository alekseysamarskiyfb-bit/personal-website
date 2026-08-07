export type Role = {
  title: string;
  company: string;
  /** Omitted where the brief did not state one — never inferred. */
  type?: string;
  period: string;
  location: string;
  points: string[];
};

/**
 * Newest first, exactly as supplied. The two ADPRODIGIES entries are one
 * company with a promotion between them, which is why they share a name and
 * sit adjacent.
 */
export const CAREER: Role[] = [
  {
    title: "Senior Performance Creative Designer",
    company: "Private Affiliate Team",
    type: "Full-time",
    period: "December 2025 — Present",
    location: "Remote · Poland",
    points: [
      "Created static, motion, and animated video creatives for affiliate campaigns.",
      "Developed AI-assisted advertising creatives and UGC-style content.",
      "Designed landing pages and performance-focused visual assets.",
      "Worked with voice-over production workflows and AI-generated content pipelines.",
      "Collaborated closely with media buyers on creative testing and optimization.",
      "Designed internal CRM interfaces for designers and media buyers.",
      "Produced high-volume performance creatives for paid traffic campaigns.",
    ],
  },
  {
    title: "Performance Creative Designer",
    company: "Traffic Place",
    type: "Part-time",
    period: "October 2025 — April 2026",
    location: "Remote · Poland",
    points: [
      "Designed static and motion creatives for Sweepstakes campaigns.",
      "Created AI-generated advertising assets and UGC-style creatives.",
      "Worked with prompt engineering workflows for creative production.",
      "Produced performance-focused creatives for paid social traffic.",
      "Collaborated with media buyers on creative testing and optimization.",
    ],
  },
  {
    title: "Motion & Creative Designer",
    company: "ADPRODIGIES",
    period: "August 2025 — November 2025",
    location: "Remote · Poland",
    points: [
      "Produced static, motion, and animated creatives for iGaming campaigns.",
      "Developed AI-assisted advertising creatives and short-form video assets.",
      "Created performance-focused advertising materials for paid acquisition campaigns.",
      "Worked within high-volume creative production pipelines.",
    ],
  },
  {
    title: "Team Lead / Performance Creative Designer",
    company: "ADPRODIGIES",
    period: "August 2024 — August 2025",
    location: "Remote · Ukraine",
    points: [
      "Led a team of four designers within the Search affiliate vertical.",
      "Produced static, motion, and AI-assisted advertising creatives.",
      "Designed landing pages and internal visual systems.",
      "Conducted weekly creative review meetings with media buyers and designers.",
      "Managed creative iteration workflows and team production processes.",
      "Collaborated on performance optimization and A/B testing strategies.",
      "Created animated video creatives for paid traffic campaigns.",
    ],
  },
  {
    title: "Performance Creative Designer",
    company: "Private Media Buying Team",
    type: "Part-time",
    period: "November 2024 — July 2025",
    location: "Remote · Ukraine",
    points: [
      "Created static and video creatives for affiliate campaigns.",
      "Designed landing pages, banners, and advertising assets.",
      "Collaborated directly with media buyers during creative review sessions.",
      "Produced conversion-focused creatives optimized for paid acquisition.",
    ],
  },
  {
    title: "Creative Designer",
    company: "Performance Marketing Team",
    type: "Full-time",
    period: "May 2024 — September 2024",
    location: "Remote · Ukraine",
    points: [
      "Developed static and video creatives for Search affiliate campaigns.",
      "Participated in weekly creative review sessions with media buyers.",
      "Produced performance-oriented advertising assets for paid traffic.",
    ],
  },
  {
    title: "Junior Performance Designer",
    company: "Affiliate Marketing Team",
    type: "Full-time",
    period: "September 2023 — May 2024",
    location: "Remote · Ukraine",
    points: [
      "Created static, video, and animated creatives for Sweepstakes and Crypto campaigns.",
      "Developed UGC-style advertising content and landing pages.",
      "Produced high-performing creatives for paid acquisition campaigns across multiple affiliate verticals.",
    ],
  },
];
