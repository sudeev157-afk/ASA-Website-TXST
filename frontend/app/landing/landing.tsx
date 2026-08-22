"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import anime from "animejs";
import styles from "./landing.module.css";

/* ────────────────────────────────────────────────────────
   Section 2 content — all copy below is placeholder
   ──────────────────────────────────────────────────────── */
const INFO_BLOCKS = [
  {
    title: "About ASA",
    lines: [
      "Placeholder line one describing who we are.",
      "Placeholder line two with a little more detail.",
    ],
  },
  {
    title: "Our Mission",
    lines: [
      "Placeholder line one describing what we set out to do.",
      "Placeholder line two with a little more detail.",
    ],
  },
  {
    title: "Connect with Us",
    lines: [
      "Placeholder line one about meetings and events.",
      "Placeholder line two about how to reach the team.",
    ],
  },
  {
    title: "Benefits",
    lines: [
      "Placeholder line one about what members gain.",
      "Placeholder line two with a little more detail.",
    ],
  },
];

/* ────────────────────────────────────────────────────────
   Hero motif — a ridgeline of drifting kernel densities.

   Sixteen probability densities stacked front to back, each an opaque field
   that occludes the ones behind it. It is a real chart — a ridgeline plot —
   and it is the hero's whole ground rather than an object sitting on it.

   Crucially it never finishes. Every mode drifts on its own slow sinusoid
   (periods of 20–60 seconds, all mutually prime-ish, so the field never
   visibly repeats), which makes it atmosphere rather than an animation that
   plays once and is spent.

   Generation is seeded, so the server-rendered markup and the hydrated
   client agree, and the t = 0 field is what ships in the static HTML.
   ──────────────────────────────────────────────────────── */
/* Drawn at hero proportions and shown with `xMidYMid slice` — the SVG
   equivalent of `background-size: cover`. It always reaches every edge, and
   it crops rather than squashes, so the hills keep their shape on a phone
   instead of being compressed into spikes. */
const VIEW_W = 1440;
const VIEW_H = 900;

const RIDGES = 16;
const SAMPLES = 78; /* points per crest — enough to read as smooth */
const RIDGE_TOP = 150; /* baseline of the furthest ridge */
const RIDGE_GAP = 46; /* between baselines; last lands at 840 */
/* Peaks stand ~4× the gap, so each ridge buries several behind it. That
   occlusion is what separates a ridgeline from a set of wavy lines. */
const RIDGE_AMP = 190;

/** One Gaussian component, with its own slow lateral drift. */
type Mode = {
  mu: number;
  sigma: number;
  w: number;
  drift: number;
  omega: number;
  phase: number;
};

type Ridge = { base: number; modes: Mode[]; scale: number };

/** Small deterministic PRNG — keeps the markup stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildRidges(): Ridge[] {
  const rand = mulberry32(20260815);
  const ridges: Ridge[] = [];

  for (let i = 0; i < RIDGES; i++) {
    const modes: Mode[] = [];
    const count = rand() < 0.45 ? 2 : 3;

    for (let m = 0; m < count; m++) {
      modes.push({
        mu: 100 + rand() * (VIEW_W - 200),
        /* Narrow enough to read as distinct hills rather than broad swells */
        sigma: 58 + rand() * 130,
        w: 0.45 + rand() * 0.8,
        /* How far this peak wanders, and how slowly */
        drift: 60 + rand() * 170,
        omega: 0.045 + rand() * 0.11, // ~21s to ~60s per cycle
        phase: rand() * Math.PI * 2,
      });
    }

    /* Scale off the tallest single mode, not the sum, and never off a
       per-frame maximum: the first keeps peaks tall, the second lets the
       field breathe as modes drift together and apart instead of being
       renormalised flat every frame. */
    const maxW = modes.reduce((a, m) => Math.max(a, m.w), 0);
    ridges.push({
      base: RIDGE_TOP + i * RIDGE_GAP,
      modes,
      scale: RIDGE_AMP / maxW,
    });
  }

  return ridges;
}

const RIDGE_DATA = buildRidges();

/** The crest of one ridge at time `t` (seconds). Pure — the same t always
    yields the same path, which is what lets the server and client agree. */
function crestPath(r: Ridge, t: number) {
  let d = "";

  for (let i = 0; i <= SAMPLES; i++) {
    const x = (i / SAMPLES) * VIEW_W;
    let y = 0;

    for (const m of r.modes) {
      const mu = m.mu + m.drift * Math.sin(m.omega * t + m.phase);
      const z = (x - mu) / m.sigma;
      y += m.w * Math.exp(-0.5 * z * z);
    }

    d += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(r.base - y * r.scale).toFixed(1)} `;
  }

  return d;
}

/** The same crest closed down to its baseline, for the occluding fill. */
function fillPath(crest: string, base: number) {
  return `${crest}L ${VIEW_W} ${base} L 0 ${base} Z`;
}

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
    href: "#",
    Icon: InstagramIcon,
    brandClass: styles.socialInstagram,
  },
  {
    label: "LinkedIn",
    href: "#",
    Icon: LinkedInIcon,
    brandClass: styles.socialLinkedin,
  },
  { label: "Email", href: "#", Icon: EmailIcon, brandClass: styles.socialEmail },
];

/* ────────────────────────────────────────────────────────
   Framer Motion variants
   ──────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
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

/* ────────────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  const plotRef = useRef<SVGSVGElement>(null);

  /* ── The field arrives, then keeps drifting ─────────── */
  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;

    const crests = Array.from(plot.querySelectorAll<SVGPathElement>(".js-crest"));
    const fills = Array.from(plot.querySelectorAll<SVGPathElement>(".js-fill"));
    const groups = Array.from(plot.querySelectorAll<SVGGElement>(".js-ridge"));
    if (!crests.length) return;

    const draw = (t: number) => {
      for (let i = 0; i < RIDGE_DATA.length; i++) {
        const d = crestPath(RIDGE_DATA[i], t);
        crests[i].setAttribute("d", d);
        fills[i].setAttribute("d", fillPath(d, RIDGE_DATA[i].base));
      }
    };

    /* Reduced motion: the t = 0 field is already in the markup — leave it
       exactly as it is and never start the clock. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      groups.forEach((g) => g.setAttribute("opacity", "1"));
      return;
    }

    /* The ridges settle in from the back of the field forward. This is the
       only part with a beginning and an end; the drift below has neither. */
    const intro = anime({
      targets: groups,
      opacity: [0, 1],
      translateY: [26, 0],
      duration: 1100,
      delay: anime.stagger(70, { from: "last" }),
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
    });

    /* Perpetual drift. Throttled to ~30fps: the motion is slow enough that
       the extra frames are invisible, and it halves the path rebuilding. */
    let raf = 0;
    let last = 0;
    const started = performance.now();

    const loop = (now: number) => {
      if (now - last >= 33) {
        last = now;
        draw((now - started) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };

    /* Runs only while the hero is on screen — scrolling away stops the work
       rather than leaving it spinning behind the rest of the page. */
    let running = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(plot);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      intro.pause();
      anime.remove(groups);
    };
  }, []);

  return (
    <main className={styles.landing}>
      {/* ══ Section 1 — hero ════════════════════════════ */}
      <section className={styles.heroSection} data-header-theme="dark">
        {/* ── The motif: a drifting ridgeline ──────────────
             The hero's background plane. Stretched edge to edge, behind
             everything, and never finished — the content sits on top of it
             at z-index 10. */}
        <div className={styles.plotLayer} aria-hidden="true">
          <svg
            ref={plotRef}
            className={styles.plot}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            {/* Drawn back to front, so each ridge's opaque fill occludes the
                crests behind it. Rendered at t = 0, which means the static
                HTML already carries a complete field if JavaScript never
                arrives — only the drift needs it. */}
            {RIDGE_DATA.map((ridge, i) => {
              const crest = crestPath(ridge, 0);
              return (
                <g
                  key={i}
                  className={`${styles.ridge} js-ridge`}
                  /* Nearer ridges read brighter — that is what gives the
                     stack its depth */
                  style={
                    {
                      "--depth": (0.32 + (i / RIDGES) * 0.68).toFixed(2),
                    } as React.CSSProperties
                  }
                >
                  <path
                    className={`${styles.ridgeFill} js-fill`}
                    d={fillPath(crest, ridge.base)}
                  />
                  <path
                    className={`${styles.ridgeCrest} js-crest`}
                    d={crest}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Hero content: copy left, photo right ─────── */}
        <div className={styles.heroInner}>
          <motion.section
            className={styles.hero}
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p className={styles.heroEyebrow} variants={fadeUp}>
              Texas State University
            </motion.p>
            <motion.h1 className={styles.heroTitle} variants={fadeUp}>
              Association for<br />
              <span className={styles.heroAccent}>Statistics and Analytics</span>
            </motion.h1>
          </motion.section>

          {/* Mock photo — placeholder art, swap in a real photo (and a
              descriptive alt) when one is available */}
          <motion.div
            className={styles.heroMedia}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className={styles.heroMediaFrame}>
              <Image
                src="/hero-placeholder.jpg"
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

      {/* ══ Section 2 — paper: info blocks, quote, social ═ */}
      <section
        className={`${styles.section} ${styles.sectionLight}`}
        data-header-theme="light"
      >
        <div className={styles.sectionInner}>
          {/* ── Info blocks (left aligned) ──────────────── */}
          <div className={styles.infoColumn}>
            {INFO_BLOCKS.map(({ title, lines }) => (
              <div key={title} className={styles.infoBlock}>
                <h2 className={styles.infoTitle}>{title}</h2>
                <p className={styles.infoText}>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </p>
              </div>
            ))}
          </div>

          {/* ── Centered quote ──────────────────────────── */}
          <blockquote className={styles.quote}>
            <p className={styles.quoteText}>
              &ldquo;Placeholder for quote&rdquo;
            </p>
          </blockquote>

          {/* ── Social buttons (close the section) ──────── */}
          <div className={styles.socialRow}>
            <ul className={styles.socialList}>
              {SOCIAL_LINKS.map(({ label, href, Icon, brandClass }) => (
                <li key={label}>
                  {/* TODO: swap "#" for the real profile URL */}
                  <a href={href} className={`${styles.socialLink} ${brandClass}`}>
                    <Icon />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
