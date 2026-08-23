"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { IconProps } from "@/components/graphics/Icons";
import styles from "./Bento.module.css";

/**
 * A bento grid whose tiles assemble as the section is scrolled to.
 *
 * Each tile carries the direction it comes from, so the group converges on
 * the grid from the outside in rather than all sliding the same way — which
 * is what makes it read as assembly rather than a list fading up. One
 * observer on the grid drives the whole set through variants; the tiles
 * never watch the viewport for themselves.
 *
 * The layout itself is not here. Each page supplies `className` for the
 * grid (its own `grid-template-areas`) and a per-item `className` naming
 * the area, so one component serves two different arrangements.
 */
export type BentoItem = {
  word: string;
  tail: string;
  Icon: (props: IconProps) => React.ReactElement;
  /** The page's class for this tile — grid area, and the size of its type */
  className?: string;
  /** Where it travels in from, in px */
  from: { x?: number; y?: number };
  /** Give a tile a destination and the whole tile becomes the target */
  href?: string;
  external?: boolean;
};

const grid: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/* Inherited from the tile, so it needs no observer of its own: the mark
   settles just after the tile it belongs to has landed. */
const mark: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.86 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] },
  },
};

const tile: Variants = {
  hidden: ({ x = 0, y = 0 }: BentoItem["from"]) => ({
    opacity: 0,
    x,
    y,
    /* Landing from slightly under full size is what gives the arrival its
       snap — without it the slide reads as a drift */
    scale: 0.94,
  }),
  shown: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Bento({
  items,
  className,
  /* Numbering helps a set of seven; a set of four does not need it */
  numbered = false,
}: {
  items: BentoItem[];
  className?: string;
  numbered?: boolean;
}) {
  return (
    <motion.ul
      className={`${styles.grid} ${className ?? ""}`}
      variants={grid}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -16% 0px" }}
    >
      {items.map(({ word, tail, Icon, className: area, from, href, external }, i) => (
        <motion.li
          key={word}
          className={`${styles.tile} ${area ?? ""}`}
          variants={tile}
          custom={from}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.span className={styles.iconWrap} variants={mark}>
            <Icon className={styles.icon} />
          </motion.span>

          <div>
            <h3 className={styles.word}>
              {/* The link sits on the word, so it is what a screen reader
                  announces, but its ::after covers the tile — the whole
                  card is the target, not just the two words. */}
              {href ? (
                external ? (
                  <a
                    className={styles.wordLink}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {word}
                  </a>
                ) : (
                  <Link className={styles.wordLink} href={href}>
                    {word}
                  </Link>
                )
              ) : (
                word
              )}
            </h3>
            <p className={styles.tail}>{tail}</p>
          </div>

          {numbered && (
            <span className={styles.index} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );
}
