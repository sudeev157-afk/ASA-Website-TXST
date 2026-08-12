"use client";

import { useEffect, useRef, useCallback } from "react";
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
const CROSSFADE_DURATION = 1.5; // seconds to crossfade before video ends

export default function LandingPage() {
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"A" | "B">("A");

  /* ── Seamless video crossfade loop ───────────────── */
  const startCrossfade = useCallback(() => {
    const incoming = activeRef.current === "A" ? videoBRef.current : videoARef.current;
    const outgoing = activeRef.current === "A" ? videoARef.current : videoBRef.current;
    if (!incoming || !outgoing) return;

    // Reset incoming video and start it
    incoming.currentTime = 0;
    incoming.play();

    // Crossfade: fade incoming in, outgoing out
    incoming.style.transition = `opacity ${CROSSFADE_DURATION}s ease`;
    outgoing.style.transition = `opacity ${CROSSFADE_DURATION}s ease`;
    incoming.style.opacity = "1";
    outgoing.style.opacity = "0";

    // Flip active
    activeRef.current = activeRef.current === "A" ? "B" : "A";
  }, []);

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    // B starts hidden
    videoB.style.opacity = "0";
    videoA.style.opacity = "1";

    const onTimeUpdate = () => {
      const active = activeRef.current === "A" ? videoA : videoB;
      if (active.duration && active.currentTime >= active.duration - CROSSFADE_DURATION) {
        startCrossfade();
      }
    };

    videoA.addEventListener("timeupdate", onTimeUpdate);
    videoB.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      videoA.removeEventListener("timeupdate", onTimeUpdate);
      videoB.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [startCrossfade]);

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
      {/* ══ Section 1 — video hero ═══════════════════════ */}
      <section className={styles.heroSection} data-header-theme="dark">
        {/* ── Video Background (crossfade loop) ─────────── */}
        <div className={styles.videoBg}>
          <video
            ref={videoARef}
            className={styles.video}
            autoPlay
            muted
            playsInline
            src="/Video_Backfround.mp4"
          />
          <video
            ref={videoBRef}
            className={styles.video}
            muted
            playsInline
            src="/Video_Backfround.mp4"
          />
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
          <motion.h1 className={styles.heroTitle} variants={fadeUp}>
            Association for<br />
            <span className={styles.heroAccent}>Statistics and Analytics</span>
          </motion.h1>
        </motion.section>

        {/* ── Decorative corner line ────────────────────── */}
        <motion.div
          className={styles.cornerDecor}
          variants={fadeIn}
          initial="hidden"
          animate="show"
        />
      </section>

      {/* ══ Section 2 — white ════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.sectionLight}`}
        data-header-theme="light"
      >
        <div className={styles.sectionInner} />
      </section>

      {/* ══ Section 3 — black ════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.sectionDark}`}
        data-header-theme="dark"
      >
        <div className={styles.sectionInner} />
      </section>

      {/* ══ Section 4 — white ════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.sectionLight}`}
        data-header-theme="light"
      >
        <div className={styles.sectionInner} />
      </section>
    </main>
  );
}
