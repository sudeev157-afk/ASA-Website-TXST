"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import ActionButton from "@/components/ui/ActionButton";
import { JOIN_FORM_URL } from "@/lib/links";
import styles from "./MobileCta.module.css";

/**
 * The join action, kept in the thumb.
 *
 * On a phone the top of the screen is the hardest place to reach and the
 * easiest to forget. This puts the one thing we are asking for within reach
 * of the hand already holding the device, for the whole middle of the page.
 *
 * It stays out of the way at both ends: the hero has its own button, and so
 * does the closing screen, and two of the same button on one screen reads
 * as a nag rather than an offer.
 *
 * Hidden above 900px, where the header's own button never scrolls away.
 */
const SHOW_AFTER = 0.7; // screens scrolled
const HIDE_NEAR_END = 0.86; // fraction of the page

export default function MobileCta() {
  const [show, setShow] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const pastHero = y > window.innerHeight * SHOW_AFTER;
    const nearEnd = scrollYProgress.get() > HIDE_NEAR_END;
    setShow(pastHero && !nearEnd);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          /* Maroon on either ground: it has to read the same over pine and
             over paper, and it is the university's colour on the one action
             the site is actually asking for. */
          className={`${styles.bar} tone-paper`}
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <ActionButton href={JOIN_FORM_URL} external className={styles.button}>
            Join ASA
          </ActionButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
