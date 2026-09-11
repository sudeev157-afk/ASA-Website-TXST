"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";
import styles from "./Board.module.css";

/**
 * The board, drawn as the thing it is: six student officers around one
 * faculty advisor.
 *
 * The layout is the argument. A 2–3–2 honeycomb puts the advisor in the
 * middle and the officers around them as equals — a group with a centre,
 * not a ladder with a top — which is "Student-led. Faculty-guided." said
 * in shape rather than words. It is the figure the Cluster motif used to
 * draw beside the heading, promoted from ornament to the layout itself.
 *
 *   Faces first. A face is found and read before anything else on a page,
 *   and it is what makes a stranger approachable, so the portrait is the
 *   largest thing in every card.
 *
 *   Connected, not just near. A line joining two things groups them more
 *   strongly than placing them close together does, so the links are what
 *   tell a first-time visitor how the board fits together.
 *
 *   One thing different. The advisor is set apart by position and a single
 *   accent rule — easy to find, never larger than the students.
 *
 *   Motion that explains. The links draw outward from the centre and each
 *   officer travels out along its own, so the entrance shows the structure
 *   rather than decorating it. It plays once: movement at the edge of
 *   vision takes attention whether it is wanted or not, so nothing loops
 *   while someone is reading. The one repeating motion is the pulse on a
 *   link the pointer is resting on.
 */

type OfficerSeat = "nw" | "ne" | "e" | "se" | "sw" | "w";
type Seat = "hub" | OfficerSeat;

type BoardMember = {
  role: string;
  name: string;
  major: string;
  /** A path in public/ */
  photo: string;
  /**
   * Where to aim the crop, as a CSS `object-position`. Only for a photo the
   * default framing gets wrong — a tight, passport-style shot comes out as
   * just a face, and aiming lower brings the shoulders back into frame.
   */
  focus?: string;
  /** Where the card sits in the honeycomb on a desktop */
  seat: Seat;
};

/*
   Names, majors and photos are placeholders: drop a headshot into
   public/board/ and point `photo` at it. Photos are cropped to 6:5 from the
   upper third, so a head-and-shoulders shot works without editing — and
   shots taken at the same distance keep every face at the same height,
   which is most of what makes a row of portraits look like a team.

   Listed row by row, as the honeycomb reads, which is also the order a
   screen reader and a phone get.
*/
const Faculty_Advisor = "/board/Advisor.jpg";
const President = "/board/Rohan.png";
const Vice_President = "/board/sudip.jpg";
const IT_Support = "/board/Bibesh.JPEG";
const Treasurer = "/board/Aubrey.jpeg";
const Member_Outreach = "/board/Anthony.jpeg";
const Director_of_Marketing = "/board/Britney.jpeg";

const BOARD: BoardMember[] = [
  { seat: "hub", role: "Faculty Advisor", name: "Dr. Rasim M Musal", major: "Associate Professor - Department of Information Systems & Analytics", photo: Faculty_Advisor },
  { seat: "nw", role: "President", name: "Rohan Dahal", major: "Major: CIS(Business Analytics)", photo: President },
  { seat: "ne", role: "Vice President", name: "Sudip Bhandari", major: "Major: CIS(Business Analytics)", photo: Vice_President },
  { seat: "e", role: "IT Support", name: "Bibesh Timalsina", major: "Major: Computer Science Minor: Data Analytics", photo: IT_Support },
  { seat: "w", role: "Treasurer", name: "Aubrey Dang", major: "Major: CIS(Business Analytics)", photo: Treasurer, focus: "50% 60%" },
  {
    seat: "sw",
    role: "Member Outreach & Events Manager",
    name: "Anthony Ramos",
    major: "Major: Computer Information Systems",
    photo: Member_Outreach,
  },
  {
    seat: "se",
    role: "Director of Marketing & Social Media",
    name: "Britney Zuniga",
    major: "Major: Business Analytics",
    photo: Director_of_Marketing,
  },
];

/* ── Choreography ─────────────────────────────────────── */
/*
   Clockwise from the top left — the order the links draw in. Each officer
   starts a little way in toward the centre and travels out along its link,
   so the offsets all point back at the advisor.
*/
const ORBIT: Record<OfficerSeat, { turn: number; x: number; y: number }> = {
  nw: { turn: 0, x: 44, y: 52 },
  ne: { turn: 1, x: -44, y: 52 },
  e: { turn: 2, x: -64, y: 0 },
  se: { turn: 3, x: -44, y: -52 },
  sw: { turn: 4, x: 44, y: -52 },
  w: { turn: 5, x: 64, y: 0 },
};

const OFFICER_SEATS = Object.keys(ORBIT) as OfficerSeat[];

const EASE = [0.22, 1, 0.36, 1] as const;

/* The advisor lands first; the links start once it has */
const LINKS_AT = 0.3;
const PER_TURN = 0.07;

const linkDelay = (seat: OfficerSeat) => LINKS_AT + ORBIT[seat].turn * PER_TURN;

type Arrival = { x: number; y: number; delay: number };

/* An officer leaves as its link is halfway out, and lands as it finishes */
function arrival(seat: Seat): Arrival {
  if (seat === "hub") return { x: 0, y: 0, delay: 0 };
  const { x, y } = ORBIT[seat];
  return { x, y, delay: linkDelay(seat) + 0.15 };
}

const seatIn: Variants = {
  hidden: ({ x, y }: Arrival) => ({ opacity: 0, x, y, scale: 0.92 }),
  shown: ({ delay }: Arrival) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

/* The photo opens upward inside a card that is already arriving — the
   heading's rising lines, in a picture */
const photoOpen: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  shown: ({ delay }: Arrival) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.9, delay: delay + 0.12, ease: EASE },
  }),
};

/* …and settles from a slight zoom as it does, like a lens finding focus */
const photoFocus: Variants = {
  hidden: { scale: 1.2 },
  shown: ({ delay }: Arrival) => ({
    scale: 1,
    transition: { duration: 1.3, delay: delay + 0.12, ease: EASE },
  }),
};

const linkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, delay, ease: EASE },
      opacity: { duration: 0.15, delay },
    },
  }),
};

const nodePop: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  shown: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay, ease: EASE },
  }),
};

/* The phone's version of the links: one stem from the advisor down into
   the officers below */
const stemDraw: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  shown: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.6, delay: LINKS_AT, ease: EASE },
  },
};

/* Scaling an SVG shape without this grows it out of the canvas corner */
const fromSelf = {
  transformBox: "fill-box",
  transformOrigin: "50% 50%",
} as const;

/* ── Geometry ─────────────────────────────────────────── */
type Box = { cx: number; cy: number; hw: number; hh: number };
type Link = { x1: number; y1: number; x2: number; y2: number };

const NO_LINK: Link = { x1: 0, y1: 0, x2: 0, y2: 0 };

/* Clear of the card edge by this much, so a node reads as a joint between
   two cards rather than a mark on one of them */
const NODE_GAP = 7;

/* offset* rather than getBoundingClientRect: they ignore transforms, so a
   card mid-entrance still reports where it is going to land */
function boxOf(el: HTMLElement): Box {
  return {
    cx: el.offsetLeft + el.offsetWidth / 2,
    cy: el.offsetTop + el.offsetHeight / 2,
    hw: el.offsetWidth / 2,
    hh: el.offsetHeight / 2,
  };
}

/** Where a ray from the centre of `b` leaves its edge, plus the gap. */
function exit(b: Box, ux: number, uy: number) {
  const t =
    Math.min(
      ux ? b.hw / Math.abs(ux) : Infinity,
      uy ? b.hh / Math.abs(uy) : Infinity,
    ) + NODE_GAP;
  return { x: b.cx + ux * t, y: b.cy + uy * t };
}

/* Each link runs along the line between two card centres, but only the
   part in the gap is drawn — so the network is the true centre-out figure,
   seen through the spaces between the cards. */
function measure(wrap: HTMLElement): Partial<Record<OfficerSeat, Link>> {
  const boxes = new Map<Seat, Box>();
  wrap
    .querySelectorAll<HTMLElement>("[data-seat]")
    .forEach((el) => boxes.set(el.dataset.seat as Seat, boxOf(el)));

  const hub = boxes.get("hub");
  const links: Partial<Record<OfficerSeat, Link>> = {};
  if (!hub) return links;

  for (const seat of OFFICER_SEATS) {
    const b = boxes.get(seat);
    if (!b) continue;

    const dx = b.cx - hub.cx;
    const dy = b.cy - hub.cy;
    const d = Math.hypot(dx, dy) || 1;
    const from = exit(hub, dx / d, dy / d);
    const to = exit(b, -dx / d, -dy / d);

    links[seat] = { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  }

  return links;
}

/* ── Board ────────────────────────────────────────────── */
export default function Board() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<Partial<Record<OfficerSeat, Link>>>({});
  /* The card the pointer is on. Lights its link — or every link, for the
     advisor — and dims the rest. */
  const [active, setActive] = useState<Seat | null>(null);
  const reduceMotion = useReducedMotion();

  /* A ResizeObserver reports once as soon as it starts observing, and
     again whenever the cards reflow — a wrapped role, a late font, a
     narrower window — so this one subscription covers every case. */
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new ResizeObserver(() => setLinks(measure(wrap)));
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      className={styles.constellation}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      <svg className={styles.links} aria-hidden="true" focusable="false">
        {OFFICER_SEATS.map((seat) => {
          const l = links[seat] ?? NO_LINK;
          const on = active === "hub" || active === seat;
          const delay = linkDelay(seat);

          return (
            <g
              key={seat}
              className={cn(styles.link, on ? styles.linkOn : active && styles.linkDim)}
            >
              <motion.line
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                custom={delay}
                variants={linkDraw}
              />
              <motion.circle
                className={styles.nodeHub}
                cx={l.x1}
                cy={l.y1}
                r={3.5}
                style={fromSelf}
                custom={delay}
                variants={nodePop}
              />
              <motion.circle
                className={styles.node}
                cx={l.x2}
                cy={l.y2}
                r={3.5}
                style={fromSelf}
                custom={delay + 0.4}
                variants={nodePop}
              />

              {/* Guidance running out from the advisor to whoever is
                  being pointed at */}
              {on && !reduceMotion && (
                <motion.circle
                  className={styles.pulse}
                  r={2.6}
                  initial={{ cx: l.x1, cy: l.y1, opacity: 0 }}
                  animate={{
                    cx: [l.x1, l.x2],
                    cy: [l.y1, l.y2],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.35,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      <ul className={styles.board}>
        {BOARD.map(({ seat, role, name, major, photo, focus }) => {
          const arr = arrival(seat);
          const isHub = seat === "hub";

          return (
            <motion.li
              key={role}
              data-seat={seat}
              className={cn(styles.seat, styles[seat])}
              custom={arr}
              variants={seatIn}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActive(seat);
              }}
              onPointerLeave={() => setActive(null)}
            >
              {/* The lift is on its own layer: the entrance's delay would
                  otherwise ride along on the way back down from a hover */}
              <motion.div
                className={styles.lift}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card
                  className={cn(
                    styles.member,
                    isHub && styles.memberHub,
                    isHub && active && active !== "hub" && styles.memberLinked,
                  )}
                >
                  <motion.div className={styles.photo} custom={arr} variants={photoOpen}>
                    <motion.div className={styles.photoFocus} custom={arr} variants={photoFocus}>
                      {/* The name sits directly under the photo and says who
                          it is, so the image itself is decorative */}
                      <Image
                        src={asset(photo)}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 900px) 45vw, 380px"
                        className={styles.photoImg}
                        style={focus ? { objectPosition: focus } : undefined}
                      />
                    </motion.div>
                  </motion.div>

                  <CardHeader className={styles.memberBody}>
                    <CardTitle className={styles.memberName}>{name}</CardTitle>
                    <p className={styles.memberRole}>{role}</p>
                    <CardDescription className={styles.memberMajor}>
                      {major}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              {isHub && (
                <motion.svg
                  className={styles.stem}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                  variants={stemDraw}
                >
                  <path
                    d="M50 0V50M0 50H100M0 50V100M100 50V100"
                    vectorEffect="non-scaling-stroke"
                  />
                </motion.svg>
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
