import Image from "next/image";
import Link from "next/link";
import { JOIN_FORM_URL } from "@/app/lib/links";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/landing" },
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
    href: "#",
    icon: (
      <svg className={styles.socialSvg} {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
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
    href: "mailto:asa@txstate.edu",
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
      <div className={styles.footerInner}>
        {/* ── Brand column ── */}
        <div className={styles.brand}>
          <Link href="/landing" className={styles.logoLink} aria-label="ASA Home">
            <span className={styles.logoWrap}>
              <Image
                src="/Logo_ASA_transparent-256.png"
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
            Texas State University, San Marcos
          </p>
          <a href="mailto:asa@txstate.edu" className={styles.connectEmail}>
            asa@txstate.edu
          </a>
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                className={styles.socialIconLink}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
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
