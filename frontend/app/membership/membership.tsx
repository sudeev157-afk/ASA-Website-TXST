"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ActionButton from "@/app/Components/ActionButton";
import Bento, { type BentoItem } from "@/app/Components/Bento";
import { AnyMajor, OneStep } from "@/app/Components/Motifs";
import {
  BriefcaseIcon,
  ChartIcon,
  MicIcon,
  ResearchIcon,
  ToolsIcon,
  TrophyIcon,
  UsersIcon,
} from "@/app/Components/Icons";
import LineRise from "@/app/Components/LineRise";
import Reveal from "@/app/Components/Reveal";
import SectionLabel from "@/app/Components/SectionLabel";
import { JOIN_FORM_URL } from "@/app/lib/links";
import styles from "./membership.module.css";

/* ────────────────────────────────────────────────────────
   What you get.

   Seven sentences became seven tiles. Projects takes the two-by-two block
   because it is the thing most members actually come for; the rest fill in
   around it.

   `from` is the direction each tile travels in — outside in, so the grid
   assembles rather than sliding in as one block.
   ──────────────────────────────────────────────────────── */
const GETS: BentoItem[] = [
  {
    word: "Projects",
    tail: "Real data, start to finish, with other students.",
    Icon: ChartIcon,
    className: styles.tileLead,
    from: { x: -46 },
  },
  {
    word: "Research",
    tail: "Work with faculty, past the semester.",
    Icon: ResearchIcon,
    className: styles.tileB,
    from: { y: -40 },
  },
  {
    word: "Datathons",
    tail: "A problem, a team, and a clock.",
    Icon: TrophyIcon,
    className: styles.tileC,
    from: { x: 46 },
  },
  {
    word: "Workshops",
    tail: "The tools your classes skip.",
    Icon: ToolsIcon,
    className: styles.tileD,
    from: { x: 46 },
  },
  {
    word: "Speakers",
    tail: "People who do this for a living.",
    Icon: MicIcon,
    className: styles.tileE,
    from: { x: -46 },
  },
  {
    word: "Network",
    tail: "Students, faculty, and industry.",
    Icon: UsersIcon,
    className: styles.tileF,
    from: { y: 46 },
  },
  {
    word: "Careers",
    tail: "Turn the degree into a direction.",
    Icon: BriefcaseIcon,
    className: styles.tileWide,
    from: { y: 46 },
  },
];

/* ────────────────────────────────────────────────────────
   Hero motif — a lattice under a travelling wave.

   A grid of points sized by a wave passing through it. Left alone the
   source drifts; move the cursor and the wave re-centres on it. Faint
   enough to be texture, not an object.
   ──────────────────────────────────────────────────────── */
const GRID_W = 1440;
const GRID_H = 820;
const COLS = 20;
const ROWS = 11;

const R_BASE = 2.6;
const R_AMP = 2.2;
const WAVELENGTH = 128;
const SPEED = 1.5;

type Cell = { x: number; y: number };

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  const stepX = GRID_W / (COLS - 1);
  const stepY = GRID_H / (ROWS - 1);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ x: c * stepX, y: r * stepY });
    }
  }

  return cells;
}

const CELLS = buildCells();

/** Where the wave comes from at time `t`, absent a cursor. */
function driftSource(t: number) {
  return {
    x: GRID_W / 2 + 380 * Math.cos(0.13 * t),
    y: GRID_H / 2 + 190 * Math.sin(0.11 * t),
  };
}

/** One cell's radius — the wave's height at its distance from the source. */
function radiusAt(cell: Cell, t: number, source: { x: number; y: number }) {
  const d = Math.hypot(cell.x - source.x, cell.y - source.y);
  /* The wave loses height as it travels, so the field settles rather than
     rippling evenly all the way out */
  const falloff = 1 / (1 + d / 620);
  return R_BASE + R_AMP * Math.sin(d / WAVELENGTH - t * SPEED) * falloff;
}

/* The t = 0 field, identical on server and client. */
const INITIAL_RADII = CELLS.map((c) => radiusAt(c, 0, driftSource(0)));

/* ────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────── */
export default function MembershipPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dots = Array.from(svg.querySelectorAll<SVGCircleElement>(".js-dot"));
    if (!dots.length) return;

    const draw = (t: number) => {
      const source = pointerRef.current ?? driftSource(t);
      for (let i = 0; i < dots.length; i++) {
        dots[i].setAttribute("r", radiusAt(CELLS[i], t, source).toFixed(2));
      }
    };

    /* ~30fps, one attribute per dot, and only while the hero is on screen */
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
    observer.observe(svg);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const trackPointer = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg || e.pointerType !== "mouse") return;

    const rect = svg.getBoundingClientRect();
    const scale = Math.max(rect.width / GRID_W, rect.height / GRID_H);
    pointerRef.current = {
      x: (e.clientX - rect.left - (rect.width - GRID_W * scale) / 2) / scale,
      y: (e.clientY - rect.top - (rect.height - GRID_H * scale) / 2) / scale,
    };
  };

  return (
    <main className={styles.page}>
      {/* ══ 1 — the price ═══════════════════════════════ */}
      <section
        className={`${styles.hero} tone-pine`}
        data-header-theme="dark"
        onPointerMove={trackPointer}
        onPointerLeave={() => {
          pointerRef.current = null;
        }}
      >
        <div className={styles.gridLayer} aria-hidden="true">
          <svg
            ref={svgRef}
            className={styles.grid}
            viewBox={`0 0 ${GRID_W} ${GRID_H}`}
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <g className={styles.gridDots}>
              {CELLS.map((c, i) => (
                <circle
                  key={i}
                  className="js-dot"
                  cx={c.x}
                  cy={c.y}
                  r={INITIAL_RADII[i].toFixed(2)}
                />
              ))}
            </g>
          </svg>
        </div>

        <div className={styles.heroInner}>
          <SectionLabel onLoad>Membership</SectionLabel>

          <LineRise
            as="h1"
            onLoad
            className={styles.display}
            lines={[
              "It costs",
              <>
                <span className={styles.accent}>nothing.</span>
              </>,
            ]}
          />

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            It&rsquo;s open to every major at Texas State. No dues. No
            prerequisites. No background needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
          >
            <ActionButton href={JOIN_FORM_URL} external>
              Join ASA, it&rsquo;s free
            </ActionButton>
          </motion.div>
        </div>
      </section>

      {/* ══ 2 — what you get ════════════════════════════ */}
      <section
        className={`${styles.stage} tone-paper`}
        data-header-theme="light"
      >
        <div className={styles.inner}>
          <SectionLabel>What you get</SectionLabel>

          <Bento items={GETS} className={styles.bentoGets} numbered />
        </div>
      </section>

      {/* ══ 3 — who it is for ═══════════════════════════ */}
      <section
        className={`${styles.stage} tone-pine`}
        data-header-theme="dark"
      >
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <SectionLabel>Who it is for</SectionLabel>

            <LineRise
              className={styles.statement}
              lines={[
                "You don't need",
                "to be a statistics",
                "major. You need",
                "to be interested.",
              ]}
            />

            <Reveal delay={0.15}>
              <p className={styles.sub}>
                Maybe you like data. Maybe research, business, or tech.
                Maybe you just want to build something outside class.
              </p>
            </Reveal>
          </div>

          <div className={styles.motif}>
            <AnyMajor />
          </div>
        </div>
      </section>

      {/* ══ 4 — the close ═══════════════════════════════ */}
      <section className={`${styles.close} tone-paper`} data-header-theme="light">
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <LineRise
              className={styles.display}
              lines={[
                "One form.",
                <>
                  <span className={styles.accent}>That&rsquo;s it.</span>
                </>,
              ]}
            />

            <Reveal delay={0.2} className={styles.actions}>
              <ActionButton href={JOIN_FORM_URL} external>
                Fill out the form
              </ActionButton>
              <ActionButton href="/about" variant="ghost">
                About ASA
              </ActionButton>
            </Reveal>

            <Reveal delay={0.3}>
              <p className={styles.footnote}>
                You can also join the national American Statistical
                Association through our student chapter here at Texas State.
              </p>
            </Reveal>
          </div>

          <div className={styles.motif}>
            <OneStep />
          </div>
        </div>
      </section>
    </main>
  );
}
