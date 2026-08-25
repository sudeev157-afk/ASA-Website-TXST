import Image from "next/image";
import Link from "next/link";
import Ridgeline from "@/components/graphics/Ridgeline";
import { asset } from "@/lib/asset";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  INSTAGRAM_URL,
  JOIN_FORM_URL,
} from "@/lib/links";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    external: true,
    icon: (
      <svg className={styles.socialSvg} {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    /* TODO: swap "#" for the real profile URL once the page exists. */
    label: "LinkedIn",
    href: "#",
    external: true,
    icon: (
      <svg className={styles.socialSvg} {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="7.2" cy="7.4" r="1.1" fill="currentColor" stroke="none" />
        <path d="M7.2 10.4V17" />
        <path d="M11.2 17v-3.6a2.7 2.7 0 0 1 5.4 0V17" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: CONTACT_EMAIL_HREF,
    external: false,
    icon: (
      <svg className={styles.socialSvg} {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.8 6.6 8.2 6.1 8.2-6.1" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* The same drifting field as the home hero, seen at a shallower crop.
          It runs only while the footer is actually on screen. */}
      <Ridgeline className={styles.plotLayer} preserveAspectRatio="xMidYMax slice" />

      <div className={styles.footerInner}>
        {/* ── Brand column ── */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logoLink} aria-label="ASA Home">
            <span className={styles.logoWrap}>
              <Image
                src={asset("/Logo_ASA_transparent-256.png")}
                alt="Association for Statistics and Analytics"
                width={56}
                height={56}
                className={styles.logoImage}
              />
            </span>
          </Link>
          <p className={styles.tagline}>Patterns into Possibilities.</p>
          <p className={styles.brandBlurb}>
            A student organization at Texas State University for anyone
            interested in statistics, analytics, research, and working with
            data.
          </p>
          <span className={styles.copyright}>
            © {year} ASA TXST. All rights reserved.
          </span>
        </div>

        {/* ── Quick Links column ── */}
        <div className={styles.linksColumn}>
          <h3>Quick Links</h3>
          <ul className={styles.linksList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.linkItem}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={JOIN_FORM_URL}
                className={styles.linkItem}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join ASA
              </a>
            </li>
          </ul>
        </div>

        {/* ── Connect column ── */}
        <div className={styles.connectColumn}>
          <h3>Connect With Us</h3>
          <p className={styles.connectDetail}>
            Twice a month on Wednesdays
          </p>
          <p className={styles.connectDetail}>
            5:00PM - 6:00PM
          </p>
          <p className={styles.connectDetail}>
            McCoy Building, Room 240
          </p>
          <p className={styles.connectDetail}>
            Texas State University, San Marcos
          </p>
          <a href={CONTACT_EMAIL_HREF} className={styles.connectEmail}>
            {CONTACT_EMAIL}
          </a>
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map(({ label, href, external, icon }) => (
              <a
                key={label}
                href={href}
                className={styles.socialIconLink}
                aria-label={label}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
