"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./SectionLabel.module.css";

/**
 * The small line that names a screen.
 *
 * A rule draws out from the left and the words follow it. It is the only
 * place besides the accent word in a headline where a screen shows which
 * voice it is speaking in, so it is worth the four extra frames.
 */
const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12 } },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  shown: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const words: Variants = {
  hidden: { opacity: 0, x: -8 },
  shown: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SectionLabel({
  children,
  /* Heroes announce themselves on load; the rest wait to be scrolled to. */
  onLoad = false,
  className,
}: {
  children: React.ReactNode;
  onLoad?: boolean;
  className?: string;
}) {
  return (
    <motion.p
      className={`${styles.label} ${className ?? ""}`}
      variants={group}
      initial="hidden"
      {...(onLoad
        ? { animate: "shown" }
        : {
            whileInView: "shown",
            viewport: { once: true, margin: "0px 0px -14% 0px" },
          })}
    >
      <motion.span className={styles.rule} variants={rule} aria-hidden="true" />
      <motion.span className={styles.text} variants={words}>
        {children}
      </motion.span>
    </motion.p>
  );
}
