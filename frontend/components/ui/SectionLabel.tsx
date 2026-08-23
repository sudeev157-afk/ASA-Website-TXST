"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./SectionLabel.module.css";

/**
 * The line that names a screen.
 *
 * It used to lead with a drawn rule, which at label size read as a stray
 * dash sitting next to the words rather than as part of them. The weight
 * now does that work instead: the label is set bold and large enough to be
 * a title in its own right, and it rises into place as one piece.
 */
const label: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
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
      variants={label}
      initial="hidden"
      {...(onLoad
        ? { animate: "shown" }
        : {
            whileInView: "shown",
            viewport: { once: true, margin: "0px 0px -14% 0px" },
          })}
    >
      {children}
    </motion.p>
  );
}
