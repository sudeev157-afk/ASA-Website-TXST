"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ActionButton from "@/app/Components/ActionButton";
import Bento, { type BentoItem } from "@/app/Components/Bento";
import {
  CampusLine,
  Cluster,
  OpenSlot,
  ScatterFit,
} from "@/app/Components/Motifs";
import {
  ChartIcon,
  ResearchIcon,
  SparkIcon,
  TrophyIcon,
} from "@/app/Components/Icons";
import LineRise from "@/app/Components/LineRise";
import Reveal from "@/app/Components/Reveal";
import SectionLabel from "@/app/Components/SectionLabel";
import { AMSTAT_URL, JOIN_FORM_URL } from "@/app/lib/links";
import { mulberry32 } from "@/app/lib/random";
import styles from "./about.module.css";

/* ────────────────────────────────────────────────────────
   Four ways in.

   The whole "you do not need a background" argument, reduced to what a
   reader would actually have to want to do. Learn leads on the largest
   tile; the other three fill in around it.

   `from` is the direction each tile travels in — outside in, so the group
   converges on the grid instead of sliding in as one block.
   ──────────────────────────────────────────────────────── */
const WAYS_IN: BentoItem[] = [
  {
    word: "Learn",
    tail: "Workshops that start where you are.",
    Icon: SparkIcon,
    className: styles.tileLead,
    from: { x: -44 },
  },
  {
    word: "Build",
    tail: "Real data, real mess, a real result.",
    Icon: ChartIcon,
    className: styles.tileB,
    from: { x: 44 },
  },
  {
    word: "Research",
    tail: "Follow a question past the semester.",
    Icon: ResearchIcon,
    className: styles.tileC,
    from: { x: 44 },
  },
  {
    word: "Compete",
    tail: "Datathons, against the clock, with a team.",
    Icon: TrophyIcon,
    className: styles.tileWide,
    from: { y: 48 },
  },
];

const BOARD = [
  "President",
  "Vice President",
  "Treasurer",
  "Secretary",
  "Events & Outreach",
  "Faculty Advisor",
];

/* ────────────────────────────────────────────────────────
   Hero motif — a community graph.

   Points drifting on their own slow sinusoids, with a line drawn between
   any two that come close enough. Nothing is choreographed: the shape of
   the network is emergent. It also answers the pointer, which is the only
   interaction on the page that is purely for its own sake.

   Deliberately sparse and deliberately faint — it is the room the type
   stands in, not a thing on the page.
   ──────────────────────────────────────────────────────── */
const NET_W = 1440;
const NET_H = 900;

const NODE_COUNT = 22;
const LINK_DIST = 260;
const MAX_EDGES = 70;

const PULL_RADIUS = 300;
const PULL_STRENGTH = 44;

type NetNode = {
  bx: number;
  by: number;
  ax: number;
  ay: number;
  wx: number;
  wy: number;
  px: number;
  py: number;
  r: number;
};

function buildNodes(): NetNode[] {
  const rand = mulberry32(20260222);
  const nodes: NetNode[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      bx: 90 + rand() * (NET_W - 180),
      by: 80 + rand() * (NET_H - 160),
      ax: 26 + rand() * 74,
      ay: 22 + rand() * 62,
      wx: 0.05 + rand() * 0.12, // ~50s to ~125s per cycle
      wy: 0.045 + rand() * 0.11,
      px: rand() * Math.PI * 2,
      py: rand() * Math.PI * 2,
      r: 2.4 + rand() * 3,
    });
  }

  return nodes;
}

const NET_NODES = buildNodes();

type Point = { x: number; y: number };

/** Where one node sits at time `t`, after the pointer has had its say. */
function nodeAt(n: NetNode, t: number, pointer: Point | null): Point {
  let x = n.bx + n.ax * Math.sin(n.wx * t + n.px);
  let y = n.by + n.ay * Math.cos(n.wy * t + n.py);

  if (pointer) {
    const dx = pointer.x - x;
    const dy = pointer.y - y;
    const d = Math.hypot(dx, dy);
    if (d < PULL_RADIUS && d > 0.001) {
      /* Squared falloff — felt at the cursor, gone well before its edge */
      const f = (1 - d / PULL_RADIUS) ** 2 * PULL_STRENGTH;
      x += (dx / d) * f;
      y += (dy / d) * f;
    }
  }

  return { x, y };
}

type Edge = { x1: number; y1: number; x2: number; y2: number; o: number };

function edgesAt(points: Point[]): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < points.length && edges.length < MAX_EDGES; i++) {
    for (let j = i + 1; j < points.length && edges.length < MAX_EDGES; j++) {
      const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (d >= LINK_DIST) continue;

      edges.push({
        x1: points[i].x,
        y1: points[i].y,
        x2: points[j].x,
        y2: points[j].y,
        o: (1 - d / LINK_DIST) * 0.6,
      });
    }
  }

  return edges;
}

/* The t = 0 field, computed identically on server and client, so the static
   HTML carries a complete graph even if the script never runs. */
const INITIAL_POINTS = NET_NODES.map((n) => nodeAt(n, 0, null));
const INITIAL_EDGES = edgesAt(INITIAL_POINTS);

/* ────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────── */
export default function AboutPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerRef = useRef<Point | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const circles = Array.from(svg.querySelectorAll<SVGCircleElement>(".js-node"));
    const lines = Array.from(svg.querySelectorAll<SVGLineElement>(".js-edge"));
    if (!circles.length) return;

    const draw = (t: number) => {
      const points = NET_NODES.map((n) => nodeAt(n, t, pointerRef.current));

      for (let i = 0; i < points.length; i++) {
        circles[i].setAttribute("cx", points[i].x.toFixed(1));
        circles[i].setAttribute("cy", points[i].y.toFixed(1));
      }

      const edges = edgesAt(points);
      for (let i = 0; i < lines.length; i++) {
        const e = edges[i];
        if (!e) {
          lines[i].setAttribute("opacity", "0");
          continue;
        }
        lines[i].setAttribute("x1", e.x1.toFixed(1));
        lines[i].setAttribute("y1", e.y1.toFixed(1));
        lines[i].setAttribute("x2", e.x2.toFixed(1));
        lines[i].setAttribute("y2", e.y2.toFixed(1));
        lines[i].setAttribute("opacity", e.o.toFixed(3));
      }
    };

    /* ~30fps, and only while the hero is on screen */
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

  /* Client coordinates → viewBox coordinates, undoing the `slice` scale and
     centring so the pull lands under the actual cursor. */
  const trackPointer = (e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg || e.pointerType !== "mouse") return;

    const rect = svg.getBoundingClientRect();
    const scale = Math.max(rect.width / NET_W, rect.height / NET_H);
    pointerRef.current = {
      x: (e.clientX - rect.left - (rect.width - NET_W * scale) / 2) / scale,
      y: (e.clientY - rect.top - (rect.height - NET_H * scale) / 2) / scale,
    };
  };

  return (
    <main className={styles.page}>
      {/* ══ 1 — the claim ═══════════════════════════════ */}
      <section
        className={`${styles.hero} tone-pine`}
        data-header-theme="dark"
        onPointerMove={trackPointer}
        onPointerLeave={() => {
          pointerRef.current = null;
        }}
      >
        <div className={styles.netLayer} aria-hidden="true">
          <svg
            ref={svgRef}
            className={styles.net}
            viewBox={`0 0 ${NET_W} ${NET_H}`}
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <g className={styles.netEdges}>
              {Array.from({ length: MAX_EDGES }, (_, i) => {
                const e = INITIAL_EDGES[i];
                return (
                  <line
                    key={i}
                    className="js-edge"
                    x1={e?.x1 ?? 0}
                    y1={e?.y1 ?? 0}
                    x2={e?.x2 ?? 0}
                    y2={e?.y2 ?? 0}
                    opacity={e ? e.o.toFixed(3) : 0}
                  />
                );
              })}
            </g>
            <g className={styles.netNodes}>
              {INITIAL_POINTS.map((p, i) => (
                <circle
                  key={i}
                  className="js-node"
                  cx={p.x}
                  cy={p.y}
                  r={NET_NODES[i].r}
                />
              ))}
            </g>
          </svg>
        </div>

        <div className={styles.heroInner}>
          <SectionLabel onLoad>About</SectionLabel>

          <LineRise
            as="h1"
            onLoad
            className={styles.display}
            lines={[
              "Curiosity is the",
              <>
                only <span className={styles.accent}>prerequisite.</span>
              </>,
            ]}
          />

          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            We&rsquo;re a student organization at Texas State for anyone
            interested in statistics, analytics, research, and working with
            data.
          </motion.p>
        </div>
      </section>

      {/* ══ 2 — what we actually do ═════════════════════ */}
      <section
        className={`${styles.stage} tone-paper`}
        data-header-theme="light"
      >
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <SectionLabel>In practice</SectionLabel>
            <LineRise
              className={styles.statement}
              lines={[
                "We take what you",
                "learn in a classroom",
                "and point it at a",
                "real problem.",
              ]}
            />
          </div>

          <div className={styles.motif}>
            <ScatterFit />
          </div>
        </div>
      </section>

      {/* ══ 3 — the four ways in ════════════════════════ */}
      <section
        className={`${styles.stage} tone-pine`}
        data-header-theme="dark"
      >
        <div className={styles.inner}>
          <SectionLabel>Four ways in</SectionLabel>

          <Bento items={WAYS_IN} className={styles.bentoWays} />
        </div>
      </section>

      {/* ══ 4 — the board ═══════════════════════════════ */}
      <section
        className={`${styles.stage} tone-paper`}
        data-header-theme="light"
      >
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <SectionLabel>The board</SectionLabel>
            <LineRise
              className={styles.statement}
              lines={["Student-led.", "Faculty-guided."]}
            />

            {/* TODO: names go beside the roles once the officers are set */}
            <ul className={styles.roster}>
              {BOARD.map((role, i) => (
                <li key={role}>
                  <Reveal delay={i * 0.04} distance={14} className={styles.rosterRow}>
                    <span>{role}</span>
                    <span className={styles.rosterName}>To be announced</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.motif}>
            <Cluster />
          </div>
        </div>
      </section>

      {/* ══ 5 — beyond campus ═══════════════════════════ */}
      <section
        className={`${styles.stage} tone-pine`}
        data-header-theme="dark"
      >
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <SectionLabel>Beyond campus</SectionLabel>
            <LineRise
              className={styles.statement}
              lines={["This does not", "stop at the", "campus line."]}
            />
          </div>

          <div className={styles.motif}>
            <CampusLine />
          </div>

          <div className={`${styles.notes} ${styles.spanAll}`}>
            <Reveal delay={0.08}>
              <p className={styles.noteBody}>
                We&rsquo;re working on a connection with the American
                Statistical Association. It would open up resources, events,
                and research outside the university.
              </p>
              <p className={styles.noteMeta}>
                <span className={styles.noteDot} aria-hidden="true" />
                Affiliation in progress
              </p>
              <ActionButton
                href={AMSTAT_URL}
                variant="ghost"
                external
                className={styles.noteAction}
              >
                Visit amstat.org
              </ActionButton>
            </Reveal>

            <Reveal delay={0.16}>
              <p className={styles.noteBody}>
                Analytics turns up in finance, marketing, operations, and
                management. We give you somewhere to practice it before it&rsquo;s
                your job.
              </p>
              <p className={styles.noteMeta}>McCoy College of Business</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 6 — the close ═══════════════════════════════ */}
      <section className={`${styles.close} tone-paper`} data-header-theme="light">
        <div className={`${styles.inner} ${styles.innerSplit}`}>
          <div className={styles.col}>
            <LineRise
              className={styles.display}
              lines={[
                "There is a place",
                <>
                  for <span className={styles.accent}>you</span> here.
                </>,
              ]}
            />
            <Reveal delay={0.2} className={styles.actions}>
              <ActionButton href="/membership">See membership</ActionButton>
              <ActionButton href={JOIN_FORM_URL} variant="ghost" external>
                Join ASA
              </ActionButton>
            </Reveal>
          </div>

          <div className={styles.motif}>
            <OpenSlot />
          </div>
        </div>
      </section>
    </main>
  );
}
