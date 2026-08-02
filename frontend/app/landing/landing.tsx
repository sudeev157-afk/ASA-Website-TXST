"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import anime from "animejs";
import styles from "./landing.module.css";

/* ────────────────────────────────────────────────────────
   Framer Motion variants
   ──────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.6 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" as const },
  },
};

/* ────────────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* ── Anime.js: floating ambient particles ────────── */
  useEffect(() => {
    const container = particleContainerRef.current;
    if (!container) return;

    // Create particle elements
    const PARTICLE_COUNT = 35;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement("div");
      el.className = styles.particle;
      // Random size between 2px and 6px
      const size = 2 + Math.random() * 4;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      // Random starting position
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      container.appendChild(el);
      particles.push(el);
    }

    // Animate each particle with anime.js
    particles.forEach((el, i) => {
      anime({
        targets: el,
        translateX: () => anime.random(-120, 120),
        translateY: () => anime.random(-120, 120),
        opacity: [
          { value: 0, duration: 0 },
          { value: () => 0.15 + Math.random() * 0.35, duration: 1200 },
          { value: 0, duration: 1200 },
        ],
        scale: [0.5, () => 1 + Math.random() * 0.8],
        duration: () => 4000 + Math.random() * 6000,
        delay: i * 180,
        loop: true,
        easing: "easeInOutSine",
        direction: "alternate",
      });
    });

    return () => {
      particles.forEach((el) => el.remove());
      anime.remove(particles);
    };
  }, []);

  /* ── Anime.js: glow pulse ────────────────────────── */
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    anime({
      targets: glow,
      opacity: [0.35, 0.6],
      scale: [1, 1.15],
      duration: 5000,
      easing: "easeInOutQuad",
      direction: "alternate",
      loop: true,
    });

    return () => {
      anime.remove(glow);
    };
  }, []);

  return (
    <main className={styles.landing}>
      {/* ── Video Background (dummy placeholder) ──────── */}
      <div className={styles.videoBg}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          poster=""
        >
          {/* Replace src with your HLS .m3u8 via hls.js or a direct mp4 */}
          <source src="" type="video/mp4" />
        </video>
        {/* Dark gradient overlay */}
        <div className={styles.videoOverlay} />
      </div>

      {/* ── Ambient glow (anime.js controlled) ────────── */}
      <div ref={glowRef} className={styles.ambientGlow} />

      {/* ── Floating particles (anime.js controlled) ──── */}
      <div ref={particleContainerRef} className={styles.particleField} />

      {/* ── Hero Content ──────────────────────────────── */}
      <motion.section
        className={styles.hero}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p className={styles.heroTag} variants={fadeUp}>
          Association for Statistics &amp; Analytics
        </motion.p>

        <motion.h1 className={styles.heroTitle} variants={fadeUp}>
          Data-Driven
          <br />
          <span className={styles.heroAccent}>Futures Start Here.</span>
        </motion.h1>

        <motion.p className={styles.heroSub} variants={fadeUp}>
          Empowering Texas State students through analytics workshops, industry
          networking, and a community built on curiosity.
        </motion.p>

        <motion.div className={styles.heroCtas} variants={fadeUp}>
          <a href="/join" className={styles.ctaPrimary}>
            Become a Member
          </a>
          <a href="/events" className={styles.ctaSecondary}>
            Explore Events
          </a>
        </motion.div>
      </motion.section>

      {/* ── Decorative corner line ────────────────────── */}
      <motion.div
        className={styles.cornerDecor}
        variants={fadeIn}
        initial="hidden"
        animate="show"
      />
    </main>
  );
}
