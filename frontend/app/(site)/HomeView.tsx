"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ActionButton from "@/components/ui/ActionButton";
import Bento, { type BentoItem } from "@/components/ui/Bento";
import {
  CalendarIcon,
  SparkIcon,
  UsersIcon,
} from "@/components/graphics/Icons";
import LineRise from "@/components/ui/LineRise";
import { Branches } from "@/components/graphics/Motifs";
import Ridgeline from "@/components/graphics/Ridgeline";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { asset } from "@/lib/asset";
import { CONTACT_EMAIL_HREF, INSTAGRAM_URL, JOIN_FORM_URL } from "@/lib/links";
import styles from "./HomeView.module.css";

/* ────────────────────────────────────────────────────────
   The three doors.

   A home page's job is to say what this is and then get out of the way.
   Each tile is the whole target, not just its two words.
   ──────────────────────────────────────────────────────── */
const DOORS: BentoItem[] = [
  {
    word: "About",
    tail: "Who we are and where this goes.",
    Icon: UsersIcon,
    className: styles.tileLead,
    from: { x: -44 },
    href: "/about",
  },
  {
    word: "Membership",
    tail: "Free, and open to every major.",
    Icon: SparkIcon,
    className: styles.tileB,
    from: { x: 44 },
    href: "/membership",
  },
  {
    word: "Events",
    tail: "First meeting, September 16.",
    Icon: CalendarIcon,
    className: styles.tileC,
    from: { x: 44 },
    href: "/events",
  },
];

/* ────────────────────────────────────────────────────────
   Inline icons so the page stays self-contained
   ──────────────────────────────────────────────────────── */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function InstagramIcon() {
  return (
    <svg className={styles.socialIcon} {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className={styles.socialIcon} {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="7.2" cy="7.4" r="1.1" fill="currentColor" stroke="none" />
      <path d="M7.2 10.4V17" />
      <path d="M11.2 17v-3.6a2.7 2.7 0 0 1 5.4 0V17" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className={styles.socialIcon} {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 6.6 8.2 6.1 8.2-6.1" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    external: true,
    Icon: InstagramIcon,
    brandClass: styles.socialInstagram,
  },
  {
    /* TODO: swap "#" for the real profile URL once the page exists. */
    label: "LinkedIn",
    href: "#",
    external: true,
    Icon: LinkedInIcon,
    brandClass: styles.socialLinkedin,
  },
  {
    label: "Email",
    href: CONTACT_EMAIL_HREF,
    external: false,
    Icon: EmailIcon,
    brandClass: styles.socialEmail,
  },
];

/* ────────────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────────────── */
export default function HomeView() {
  return (
    <main className={styles.landing}>
      {/* ══ 1 — who this is ═════════════════════════════
           The drifting ridgeline underneath is untouched: it is this
           page's whole ground, and nothing here sits in its way. */}
      <section
        className={`${styles.heroSection} tone-pine`}
        data-header-theme="dark"
      >
        <Ridgeline className={styles.plotLayer} />

        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            {/* ── TXST lockup ── */}
            <motion.div
              className={styles.txstLockup}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={styles.txstRule} aria-hidden="true" />
              <p className={styles.txstName}>Texas State University</p>
              <p className={styles.txstMeta}>San Marcos, Texas</p>
            </motion.div>

            <LineRise
              as="h1"
              onLoad
              className={styles.display}
              lines={[
                "Association for",
                <>
                  <span className={styles.accent}>Statistics</span> and
                </>,
                <>
                  <span className={styles.accent}>Analytics.</span>
                </>,
              ]}
            />

            <motion.p
              className={styles.sub}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              A student organization for anyone interested in statistics,
              analytics, research, and working with data.
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.7 }}
            >
              <ActionButton href={JOIN_FORM_URL} external>
                Join ASA
              </ActionButton>
              <ActionButton href="/membership" variant="ghost">
                See membership
              </ActionButton>
            </motion.div>
          </div>

          {/* Placeholder art. Swap in a real photo, and a descriptive alt,
              when one is available. */}
          <motion.div
            className={styles.heroMedia}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.heroMediaFrame}>
              <Image
                src={asset("/hero-placeholder.jpg")}
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 45vw"
                className={styles.heroImage}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 2 — the motto ═══════════════════════════════ */}
      <section
        className={`${styles.stage} tone-paper`}
        data-header-theme="light"
      >
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <SectionLabel>Our motto</SectionLabel>

            <LineRise
              className={styles.display}
              lines={[
                "Patterns into",
                <>
                  <span className={styles.accent}>Possibilities.</span>
                </>,
              ]}
            />

            <Reveal delay={0.3}>
              <p className={styles.sub}>
                We run workshops, projects, research, and events. We connect
                students with faculty and people working in the field. And we
                care about using data responsibly.
              </p>
            </Reveal>
          </div>

          <div className={styles.motif}>
            <Branches />
          </div>
        </div>
      </section>

      {/* ══ 3 — where to go next ════════════════════════ */}
      <section className={`${styles.stage} tone-pine`} data-header-theme="dark">
        <div className={styles.inner}>
          <SectionLabel>Start here</SectionLabel>
          <Bento items={DOORS} className={styles.bentoDoors} />
        </div>
      </section>

      {/* ══ 4 — the close ═══════════════════════════════ */}
      <section
        className={`${styles.stage} tone-paper`}
        id="connect"
        data-header-theme="light"
      >
        <div className={styles.inner}>
          <SectionLabel>Let us Connect</SectionLabel>

          <LineRise className={styles.statement} lines={["Come find us."]} />

          <Reveal delay={0.25}>
            <p className={styles.sub}>
              We post what we are doing and when. If you have anything more please email us, we are open to any questions
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <ul className={styles.socialList}>
              {SOCIAL_LINKS.map(({ label, href, external, Icon, brandClass }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={`${styles.socialLink} ${brandClass}`}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <Icon />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>z
    </main>
  );
}
