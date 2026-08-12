"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/landing" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  { label: "Contact Us", href: "/contact" },
];

/* Y offset the header samples to decide which section sits beneath it */
const THEME_PROBE_Y = 80;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [sectionTheme, setSectionTheme] = useState<"light" | "dark" | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  /* Sections may declare `data-header-theme`; otherwise fall back to the route
     (landing sits on dark video, every other route is a white page). */
  const isDark = sectionTheme
    ? sectionTheme === "dark"
    : pathname.startsWith("/landing");

  /* Track scroll position and the theme of the section under the header */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections =
        document.querySelectorAll<HTMLElement>("[data-header-theme]");
      let theme: "light" | "dark" | null = null;
      sections.forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= THEME_PROBE_Y && bottom > THEME_PROBE_Y) {
          theme = el.dataset.headerTheme === "light" ? "light" : "dark";
        }
      });
      setSectionTheme(theme);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <motion.header
      ref={headerRef}
      className={`${styles.header} ${isDark ? styles.dark : ""} ${
        scrolled ? styles.scrolled : ""
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Logo moved outside header box ── */}
      <Link href="/landing" className={styles.floatingLogoLink} aria-label="ASA Home">
        <div className={styles.floatingLogoWrapper}>
          <Image
            src="/Logo_ASA_transparent.png"
            alt="Association for Statistics and Analytics – Texas State University"
            width={110}
            height={110}
            priority
            className={styles.logoImage}
          />
        </div>
      </Link>

      <div className={styles.inner}>

        {/* ── Navigation ── */}
        <nav className={styles.nav} aria-label="Primary navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles.navText}>{label}</span>
                    {isActive && (
                      <motion.span
                        className={styles.navUnderline}
                        layoutId="nav-underline"
                        initial={false}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
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
