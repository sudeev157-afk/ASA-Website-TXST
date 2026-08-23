"use client";

import { MotionConfig } from "framer-motion";

/**
 * Framer Motion animates transforms in JavaScript, so the global
 * `prefers-reduced-motion` rule in globals.css cannot reach it. This makes
 * every motion component in the app honour the OS setting instead —
 * animations resolve instantly to their final state rather than being
 * skipped, so nothing ends up invisible.
 *
 * Client boundary only; `children` stay server-rendered.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
