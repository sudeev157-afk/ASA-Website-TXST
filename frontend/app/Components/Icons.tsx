/**
 * Line icons, inline so the pages stay self-contained — no icon font, no
 * runtime request, and they inherit `currentColor` from the tile around
 * them. All drawn on the same 24 × 24 grid at the same stroke weight, which
 * is what keeps a grid of them reading as one set.
 *
 * Server components: they hold no state and never reach the client bundle.
 */

export type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/* Learn — a spark */
export function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M11 2.6 13 8.2 18.6 10.2 13 12.2 11 17.8 9 12.2 3.4 10.2 9 8.2z" />
      <path d="M18 15.4 18.8 17.8 21.2 18.6 18.8 19.4 18 21.8 17.2 19.4 14.8 18.6 17.2 17.8z" />
    </svg>
  );
}

/* Build / Projects — a column chart under construction */
export function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3.4 20.6h17.2" />
      <rect x="4.8" y="12.4" width="3.6" height="5.8" rx="1" />
      <rect x="10.2" y="8.2" width="3.6" height="10" rx="1" />
      <rect x="15.6" y="4.4" width="3.6" height="13.8" rx="1" />
    </svg>
  );
}

/* Research — a scatter with its fitted line */
export function ResearchIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3.4 3.4v17.2h17.2" />
      <path d="M6.6 17.4 19.2 5.8" />
      <circle cx="8.2" cy="16.4" r="1.05" />
      <circle cx="12" cy="12.6" r="1.05" />
      <circle cx="15.4" cy="10.4" r="1.05" />
      <circle cx="17.9" cy="6.9" r="1.05" />
    </svg>
  );
}

/* Compete / Achievement */
export function TrophyIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M7.6 3.4h8.8v5a4.4 4.4 0 0 1-8.8 0z" />
      <path d="M7.6 5H4.9v1.4a3.2 3.2 0 0 0 3.2 3.2" />
      <path d="M16.4 5h2.7v1.4a3.2 3.2 0 0 1-3.2 3.2" />
      <path d="M12 12.9v4.1" />
      <path d="M8.4 20.6h7.2l-.8-3.6H9.2z" />
    </svg>
  );
}

/* Workshops — hands on the tools */
export function ToolsIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M14.4 6.6a3.6 3.6 0 0 1 4.9-4.3l-2.6 2.6 1.9 1.9 2.6-2.6a3.6 3.6 0 0 1-4.3 4.9L5.9 20.1a1.9 1.9 0 0 1-2.7-2.7z" />
      <path d="m6.4 6.4 2.9 2.9" />
    </svg>
  );
}

/* Speakers */
export function MicIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="9.1" y="2.6" width="5.8" height="10.8" rx="2.9" />
      <path d="M5.7 11.4a6.3 6.3 0 0 0 12.6 0" />
      <path d="M12 17.7v3.7" />
      <path d="M8.9 21.4h6.2" />
    </svg>
  );
}

/* Network */
export function UsersIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="8" r="3.1" />
      <path d="M3.3 19.4a5.7 5.7 0 0 1 11.4 0" />
      <path d="M16.4 5.3a3.1 3.1 0 0 1 0 5.7" />
      <path d="M17.6 13.9a5.7 5.7 0 0 1 3.1 5.5" />
    </svg>
  );
}

/* Careers */
export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="2.9" y="7.3" width="18.2" height="12.8" rx="2.2" />
      <path d="M8.7 7.3V5.5a2 2 0 0 1 2-2h2.6a2 2 0 0 1 2 2v1.8" />
      <path d="M2.9 12.4h18.2" />
      <path d="M10.5 12.4h3" />
    </svg>
  );
}

/* Events */
export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3.2" y="5.2" width="17.6" height="15.6" rx="2.4" />
      <path d="M3.2 10.1h17.6" />
      <path d="M8.2 2.9v4.2" />
      <path d="M15.8 2.9v4.2" />
      <path d="M7.6 14.2h2.2" />
      <path d="M14.2 14.2h2.2" />
    </svg>
  );
}
