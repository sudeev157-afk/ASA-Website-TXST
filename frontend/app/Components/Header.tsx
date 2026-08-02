"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/landing" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /* Track scroll for potential future use (currently landing has no scroll) */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.inner}>
        {/* ── Logo ── */}
        <Link href="/landing" className={styles.logoLink} aria-label="ASA Home">
          <div className={styles.logoWrapper}>
            <Image
              src="/Logo_ASA.png"
              alt="Association for Statistics and Analytics – Texas State University"
              width={64}
              height={64}
              priority
              className={styles.logoImage}
            />
          </div>
        </Link>

        {/* ── Navigation ── */}
        <nav className={styles.nav} aria-label="Primary navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  <span className={styles.navText}>{label}</span>
                  <motion.span
                    className={styles.navUnderline}
                    layoutId="nav-underline"
                    initial={false}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/join" className={styles.joinBtn}>
            Join Us
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
