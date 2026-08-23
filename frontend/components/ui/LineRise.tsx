"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./LineRise.module.css";

/**
 * Line reveal. Each line sits in a clipped box and slides up from beneath
 * it, one after the next — the type arrives as a gesture rather than fading
 * in. Lines are passed in explicitly rather than being wrapped
 * automatically, because a mask only works if the break points are known.
 *
 * One observer on the wrapper drives every line through variants, rather
 * than each line watching the viewport for itself.
 *
 * Under `prefers-reduced-motion` the lines are never offset in the first
 * place (see LineRise.module.css) — a mask that does not open would leave
 * the text clipped out of sight, which is the one failure a reveal must
 * never have.
 */
const lineVariants: Variants = {
  /* Past 100%, because the clip box is taller than the line box by the
     descender room it makes (see LineRise.module.css). At 108% a sliver of
     the line still showed below the fold. */
  hidden: { y: "128%" },
  shown: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LineRise({
  lines,
  className,
  delay = 0,
  stagger = 0.075,
  /* Heroes animate as soon as the page loads; everything further down
     waits until it is scrolled to. */
  onLoad = false,
  as: Tag = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
  onLoad?: boolean;
  as?: "h1" | "h2" | "p" | "div";
}) {
  const container: Variants = {
    hidden: {},
    shown: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      {...(onLoad
        ? { animate: "shown" }
        : {
            whileInView: "shown",
            viewport: { once: true, margin: "0px 0px -14% 0px" },
          })}
    >
      <Tag className={className}>
        {lines.map((line, i) => (
          /* The clip. `overflow: hidden` on a block whose only child is the
             moving line is the whole mechanism. */
          <span key={i} className={styles.clip}>
            <motion.span className={styles.line} variants={lineVariants}>
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
