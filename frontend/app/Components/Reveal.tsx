"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * Scroll reveal. Content rises into place the first time it reaches the
 * viewport and then stays put — the page never re-animates behind the reader,
 * which is what makes long scrolling pages feel unsettled.
 *
 * `MotionConfig reducedMotion="user"` in the root layout means this resolves
 * straight to the final state for anyone who asks for less motion, so nothing
 * here can leave content invisible.
 */
type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds to hold before starting — use to stagger siblings by hand. */
  delay?: number;
  /** Distance travelled, in px. Smaller for dense lists, larger for headings. */
  distance?: number;
};

export default function Reveal({
  delay = 0,
  distance = 28,
  children,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      /* `once` plus a margin that fires a little before the element is fully
         on screen: it has finished arriving by the time it is being read. */
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
