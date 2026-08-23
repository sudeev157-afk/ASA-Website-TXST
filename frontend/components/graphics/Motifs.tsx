"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./Motifs.module.css";

/**
 * Section motifs.
 *
 * Each one is a diagram of the sentence it sits beside, drawn as a single
 * SVG and assembled by scroll. They are built from the tone's variables
 * only, so the same figure reads on pine and on paper.
 *
 * Every motif follows the same contract: one observer on the <svg>, and
 * children driven through variants. Nothing is hidden behind a transform
 * alone — under reduced motion the figures resolve to a legible resting
 * state rather than disappearing.
 */

const VIEW = "0 0 400 300";

const field: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};

const viewport = { once: true, margin: "0px 0px -18% 0px" } as const;

const ease = [0.22, 1, 0.36, 1] as const;

/** A stroke that draws itself. */
const draw = (duration = 1, delay = 0): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration, delay, ease }, opacity: { duration: 0.2, delay } },
  },
});

/** A mark that arrives in place. */
const pop = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.4 },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease },
  },
});

/* Scaling an SVG shape without this grows it out of the canvas corner —
   the default transform origin is the viewBox origin, not the shape. */
const fromSelf = {
  transformBox: "fill-box",
  transformOrigin: "50% 50%",
} as const;

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <motion.svg
      className={styles.svg}
      viewBox={VIEW}
      role="img"
      aria-label={label}
      variants={field}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
    >
      {children}
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────
   1 — Out of the classroom, into the problem.

   Twenty points begin in a tidy lecture-hall grid and move to where the
   data actually falls; the fit is drawn through them once they land. The
   grid is the coursework, the cloud is the problem, the line is what you
   are there to find.
   ──────────────────────────────────────────────────────── */
const CLASSROOM = Array.from({ length: 20 }, (_, i) => ({
  x: 70 + (i % 5) * 62,
  y: 70 + Math.floor(i / 5) * 55,
}));

/* Scattered about y = 250 − 0.5x, with the residuals fixed rather than
   random so the server and the client draw the same cloud. */
const SCATTER = [
  { x: 58, y: 214 }, { x: 96, y: 206 }, { x: 118, y: 178 }, { x: 141, y: 190 },
  { x: 166, y: 158 }, { x: 74, y: 232 }, { x: 190, y: 166 }, { x: 214, y: 132 },
  { x: 238, y: 148 }, { x: 262, y: 112 }, { x: 108, y: 224 }, { x: 286, y: 124 },
  { x: 310, y: 92 }, { x: 334, y: 104 }, { x: 152, y: 202 }, { x: 358, y: 74 },
  { x: 202, y: 186 }, { x: 250, y: 160 }, { x: 298, y: 138 }, { x: 346, y: 118 },
];

export function ScatterFit() {
  return (
    <Field label="A grid of points scattering into data, with a line fitted through them">
      <motion.path className={styles.rule} d="M 40 24 V 262 H 376" variants={draw(0.7)} />

      {CLASSROOM.map((start, i) => (
        <motion.circle
          key={i}
          className={styles.dot}
          r={3.4}
          cx={start.x}
          cy={start.y}
          initial={{ opacity: 0 }}
          variants={{
            hidden: { opacity: 0, cx: start.x, cy: start.y },
            shown: {
              opacity: 1,
              cx: SCATTER[i].x,
              cy: SCATTER[i].y,
              transition: {
                /* The scatter happens after the grid has been read as a
                   grid — the move is the point being made */
                duration: 1.1,
                delay: 0.5 + i * 0.02,
                ease,
              },
            },
          }}
        />
      ))}

      <motion.path
        className={styles.line}
        d="M 52 224 L 364 96"
        variants={draw(1.1, 1.5)}
      />
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   2 — Student-led. Faculty-guided.

   Six students around one advisor: the links are drawn from the middle
   out, so the shape is read as a group with a centre rather than a
   hierarchy with a top.
   ──────────────────────────────────────────────────────── */
const ORBIT = [
  { x: 200, y: 40 }, { x: 320, y: 90 }, { x: 336, y: 216 },
  { x: 200, y: 268 }, { x: 64, y: 216 }, { x: 80, y: 90 },
];

export function Cluster() {
  return (
    <Field label="Six student nodes linked to one faculty node at the centre">
      {ORBIT.map((p, i) => (
        <motion.line
          key={`l${i}`}
          className={styles.rule}
          x1={200}
          y1={154}
          x2={p.x}
          y2={p.y}
          variants={draw(0.55, 0.2 + i * 0.07)}
        />
      ))}

      {ORBIT.map((p, i) => (
        <motion.circle
          key={`n${i}`}
          className={styles.dot}
          cx={p.x}
          cy={p.y}
          r={8.5}
          style={fromSelf}
          variants={pop(0.35 + i * 0.07)}
        />
      ))}

      <motion.circle
        className={styles.dotAccent}
        cx={200}
        cy={154}
        r={13}
        style={fromSelf}
        variants={pop(0.1)}
      />
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   3 — This does not stop at the campus line.

   A boundary, and points that carry on through it. The ones that have
   crossed are the accent; the line itself never moves.
   ──────────────────────────────────────────────────────── */
const CROSSERS = [
  { y: 78, from: 96, to: 330 },
  { y: 126, from: 62, to: 286 },
  { y: 174, from: 108, to: 356 },
  { y: 222, from: 78, to: 302 },
];

export function CampusLine() {
  return (
    <Field label="Points crossing a dashed boundary line and continuing beyond it">
      <motion.line
        className={styles.ruleDashed}
        x1={200}
        y1={30}
        x2={200}
        y2={270}
        variants={draw(0.8)}
      />
      <motion.text className={styles.label} x={200} y={288} textAnchor="middle" style={fromSelf} variants={pop(0.2)}>
        Campus
      </motion.text>

      {CROSSERS.map((c, i) => (
        <g key={i}>
          <motion.line
            className={styles.rule}
            x1={c.from}
            y1={c.y}
            x2={c.to}
            y2={c.y}
            variants={draw(0.9, 0.45 + i * 0.12)}
          />
          <motion.circle
            className={styles.dotAccent}
            r={5.5}
            cy={c.y}
            variants={{
              hidden: { opacity: 0, cx: c.from },
              shown: {
                opacity: 1,
                cx: c.to,
                transition: { duration: 1.05, delay: 0.45 + i * 0.12, ease },
              },
            }}
          />
        </g>
      ))}
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   4 — There is a place for you here.

   A ring with one position vacant, and the piece that fills it arriving
   from outside the figure. The last link only closes once it lands.
   ──────────────────────────────────────────────────────── */
const RING = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
  return { x: 200 + Math.cos(a) * 116, y: 150 + Math.sin(a) * 116 };
});
const VACANT = RING[6];

export function OpenSlot() {
  return (
    <Field label="A ring of nodes with one empty place, filled by a node arriving from outside">
      {RING.map((p, i) => {
        const next = RING[(i + 1) % RING.length];
        return (
          <motion.line
            key={`l${i}`}
            className={styles.rule}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            variants={draw(0.5, i === 5 || i === 6 ? 1.35 : 0.15 + i * 0.06)}
          />
        );
      })}

      {RING.map((p, i) =>
        i === 6 ? null : (
          <motion.circle
            key={`n${i}`}
            className={styles.dot}
            cx={p.x}
            cy={p.y}
            r={8.5}
            style={fromSelf}
            variants={pop(0.2 + i * 0.06)}
          />
        ),
      )}

      {/* The vacancy, held open until it is taken */}
      <motion.circle
        className={styles.shape}
        cx={VACANT.x}
        cy={VACANT.y}
        r={11}
        strokeDasharray="3 5"
        variants={{
          hidden: { opacity: 0 },
          shown: { opacity: [0, 1, 1, 0], transition: { duration: 1.6, times: [0, 0.2, 0.78, 1], delay: 0.3 } },
        }}
      />

      <motion.circle
        className={styles.dotAccent}
        r={10}
        variants={{
          hidden: { opacity: 0, cx: VACANT.x - 130, cy: VACANT.y + 86 },
          shown: {
            opacity: 1,
            cx: VACANT.x,
            cy: VACANT.y,
            transition: { duration: 0.85, delay: 1.05, ease },
          },
        }}
      />
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   5 — You do not need to be a statistics major.

   Seven different shapes, one baseline. The accent rule sweeps the whole
   row rather than picking one out: the figure's argument is that nothing
   here is being sorted.
   ──────────────────────────────────────────────────────── */
const SHAPES = [
  "M -14 14 h 28 v -28 h -28 Z", // square
  "M 0 -16 L 15 12 H -15 Z", // triangle
  "M 0 -17 L 17 0 L 0 17 L -17 0 Z", // diamond
  "M -15 -12 h 30 v 24 h -30 Z", // rectangle
  "M 0 -16 L 15 -5 L 9 14 H -9 L -15 -5 Z", // pentagon
  "M -4 -16 h 8 v 12 h 12 v 8 h -12 v 12 h -8 v -12 h -12 v -8 h 12 Z", // plus
];

export function AnyMajor() {
  return (
    <Field label="Seven different shapes sharing one baseline, swept by a single rule">
      {SHAPES.map((d, i) => (
        <g key={i} transform={`translate(${62 + i * 55} 128)`}>
          <motion.path
            className={styles.shape}
            d={d}
            variants={{
              hidden: { opacity: 0, y: -20 },
              shown: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.1 + i * 0.07, ease },
              },
            }}
          />
        </g>
      ))}

      {/* One baseline under all of them, drawn last */}
      <motion.line
        className={styles.line}
        x1={30}
        y1={186}
        x2={370}
        y2={186}
        variants={draw(1, 0.6)}
      />
      <motion.text className={styles.label} x={200} y={214} textAnchor="middle" style={fromSelf} variants={pop(1.4)}>
        Every major
      </motion.text>
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   6 — One form. That's it.

   The form draws itself, three fields fill, and the accent check closes
   it. Nothing else happens, which is the claim.
   ──────────────────────────────────────────────────────── */
export function OneStep() {
  return (
    <Field label="A single form filling in and being checked off">
      <motion.rect
        className={styles.shape}
        x={64}
        y={30}
        width={272}
        height={240}
        rx={16}
        variants={draw(1.1)}
      />

      {[92, 142, 192].map((y, i) => (
        <motion.line
          key={y}
          className={styles.rule}
          x1={104}
          y1={y}
          x2={296}
          y2={y}
          variants={draw(0.5, 0.75 + i * 0.16)}
        />
      ))}

      <motion.path
        className={styles.line}
        d="M 116 232 l 26 26 l 56 -62"
        variants={draw(0.55, 1.4)}
      />
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   7 — Coming soon.

   A month filling in, one day at a time, with a single day already
   spoken for. The empty cells are the point: the calendar exists, it is
   just not written yet.
   ──────────────────────────────────────────────────────── */
const CELL = 44;
const CELL_GAP = 12;
const CAL_X = 66;
const CAL_Y = 44;
/* The one day that is already claimed */
const MARKED = 12;

export function CalendarFill() {
  return (
    <Field label="A calendar grid filling in, with one day already marked">
      {Array.from({ length: 20 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const marked = i === MARKED;

        return (
          <motion.rect
            key={i}
            className={marked ? styles.shapeAccent : styles.shape}
            x={CAL_X + col * (CELL + CELL_GAP)}
            y={CAL_Y + row * (CELL + CELL_GAP)}
            width={CELL}
            height={CELL}
            rx={8}
            style={fromSelf}
            variants={pop(marked ? 1.1 : 0.1 + i * 0.035)}
          />
        );
      })}

      {/* The claimed day, filled */}
      <motion.circle
        className={styles.dotAccent}
        cx={CAL_X + (MARKED % 5) * (CELL + CELL_GAP) + CELL / 2}
        cy={CAL_Y + Math.floor(MARKED / 5) * (CELL + CELL_GAP) + CELL / 2}
        r={7}
        style={fromSelf}
        variants={pop(1.35)}
      />
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   8 — Every two weeks after that.

   A timeline with the first meeting marked and the ones after it stepping
   away at an even interval, then carrying on past the edge of the figure.
   The measure under the first gap is what names the cadence.
   ──────────────────────────────────────────────────────── */
const TICK_X = [46, 104, 162, 220, 278, 336];
const TICK_Y = 132;

export function Cadence() {
  return (
    <Field label="A timeline of meetings spaced two weeks apart, continuing past the edge">
      <motion.line
        className={styles.rule}
        x1={30}
        y1={TICK_Y}
        x2={352}
        y2={TICK_Y}
        variants={draw(0.9)}
      />
      {/* It keeps going after the figure runs out */}
      <motion.line
        className={styles.ruleDashed}
        x1={352}
        y1={TICK_Y}
        x2={392}
        y2={TICK_Y}
        variants={draw(0.4, 1.1)}
      />

      {TICK_X.map((x, i) => (
        <motion.circle
          key={x}
          className={i === 0 ? styles.dotAccent : styles.dot}
          cx={x}
          cy={TICK_Y}
          r={i === 0 ? 9 : 6}
          /* Later meetings sit further back — they are real, but they are
             not scheduled yet */
          opacity={i === 0 ? 1 : 1 - i * 0.15}
          style={fromSelf}
          variants={pop(0.35 + i * 0.1)}
        />
      ))}

      {/* The measure that names the interval */}
      <motion.path
        className={styles.rule}
        d={`M ${TICK_X[0]} 174 v 12 H ${TICK_X[1]} v -12`}
        variants={draw(0.5, 1.15)}
      />
      <motion.text
        className={styles.label}
        x={(TICK_X[0] + TICK_X[1]) / 2}
        y={210}
        textAnchor="middle"
        style={fromSelf}
        variants={pop(1.5)}
      >
        2 weeks
      </motion.text>
    </Field>
  );
}

/* ────────────────────────────────────────────────────────
   9 — Patterns into possibilities.

   One line comes in, meets a point, and leaves as several. The pattern is
   the single stroke on the left; the possibilities are what it opens onto.
   Nothing about the fan is symmetrical, because the point is that the
   outcomes are not all the same.
   ──────────────────────────────────────────────────────── */
const FAN = [58, 108, 168, 214, 254];

export function Branches() {
  return (
    <Field label="A single line meeting a point and opening into several paths">
      <motion.line
        className={styles.line}
        x1={24}
        y1={150}
        x2={150}
        y2={150}
        variants={draw(0.8)}
      />

      {FAN.map((y, i) => (
        <motion.path
          key={y}
          className={styles.rule}
          /* A curve, not a straight line: the paths lean away from each
             other rather than radiating from a hub */
          d={`M 150 150 C 232 150 246 ${y} 320 ${y}`}
          variants={draw(0.85, 0.85 + i * 0.09)}
        />
      ))}

      {FAN.map((y, i) => (
        <motion.circle
          key={`d${y}`}
          className={styles.dot}
          cx={332}
          cy={y}
          r={5.5}
          style={fromSelf}
          variants={pop(1.5 + i * 0.09)}
        />
      ))}

      <motion.circle
        className={styles.dotAccent}
        cx={150}
        cy={150}
        r={9}
        style={fromSelf}
        variants={pop(0.7)}
      />
    </Field>
  );
}
