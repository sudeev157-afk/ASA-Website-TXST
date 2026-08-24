"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import MobileCta from "./MobileCta";
import { asset } from "@/lib/asset";
import { JOIN_FORM_URL } from "@/lib/links";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
];

/* Fallback probe offset, used until the bar has been measured */
const THEME_PROBE_Y = 96;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [sectionTheme, setSectionTheme] = useState<"light" | "dark" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  /* How far down the page we are. Shown on phones only, where the scroll is
     long and there is no other way to tell. Sprung, so it glides instead of
     twitching with every scroll event. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.3,
  });

  /* Sections may declare `data-header-theme`; otherwise fall back to the route
     (home sits on dark video, every other route is a white page). */
  const isDark = sectionTheme
    ? sectionTheme === "dark"
    : pathname === "/";

  /* Track scroll position and the theme of the section under the header */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      /* Sample at the bar's bottom edge so the swap lands the moment the
         next section has fully taken over behind it */
      const probeY = headerRef.current?.offsetHeight ?? THEME_PROBE_Y;

      const sections =
        document.querySelectorAll<HTMLElement>("[data-header-theme]");
      let theme: "light" | "dark" | null = null;
      sections.forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= probeY && bottom > probeY) {
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

  /* Close the mobile menu whenever the route changes (adjusted during render
     rather than in an effect, so the menu never paints on the new page) */
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  /* While the mobile menu is open: lock page scroll, close on Escape, and
     close if the viewport grows back to desktop width */
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

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
      <Link href="/" className={styles.floatingLogoLink} aria-label="ASA Home">
        <div className={styles.floatingLogoWrapper}>
          {/* The seal is unaltered artwork, served at the size it is drawn
              at. The 1254px original stays in public/ as the master. */}
          <Image
            src={asset("/Logo_ASA_transparent-256.png")}
            alt="Association for Statistics and Analytics – Texas State University"
            width={76}
            height={76}
            priority
            sizes="(max-width: 900px) 52px, 76px"
            className={styles.logoImage}
          />
        </div>
      </Link>

      <div className={styles.inner}>

        {/* ── Navigation (desktop) ── */}
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

            {/* ── CTA (desktop), sitting in the last nav slot ── */}
            <motion.li
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              <Link
                href={JOIN_FORM_URL}
                className={styles.joinBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Us
              </Link>
            </motion.li>
          </ul>
        </nav>
      </div>

      {/* ── Reading progress, along the bar's own bottom edge ── */}
      <motion.span
        className={styles.progress}
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      {/* ── Hamburger (mobile) ── */}
      <button
        type="button"
        className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ""}`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
        <span className={styles.menuBar} />
      </button>

      {/* ── Full-screen menu (mobile) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className={`${styles.mobilePanel} ${isDark ? "tone-pine" : "tone-paper"}`}
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ul className={styles.mobileList}>
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 + i * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={href}
                      className={`${styles.mobileLink} ${
                        isActive ? styles.mobileLinkActive : ""
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <motion.a
              href={JOIN_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileJoinBtn}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.06 + NAV_LINKS.length * 0.06,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Join ASA
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
      <MobileCta />
    </motion.header>
  );
}
