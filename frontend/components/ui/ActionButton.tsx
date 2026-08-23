import Link from "next/link";
import styles from "./ActionButton.module.css";

/**
 * The one thing on a screen you are meant to press.
 *
 * A text link asks to be noticed before it can be used. This does not: it
 * has a filled shape, a real hit area, and it moves under the pointer.
 *
 * Colour comes from the section's tone, so the same button is gold on pine
 * and maroon on paper without either page saying so.
 *
 * A server component — all of its motion is CSS, which means it costs no
 * JavaScript and honours `prefers-reduced-motion` through the global rule.
 */
function Arrow() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 10h12" />
      <path d="m10.8 5.2 4.8 4.8-4.8 4.8" />
    </svg>
  );
}

export default function ActionButton({
  href,
  children,
  variant = "solid",
  /* Anything leaving the site opens in a new tab and says so to a screen
     reader — a form the visitor is halfway through should never be able to
     eat their place on the page */
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  external?: boolean;
  className?: string;
}) {
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  const inner = (
    <>
      <span className={styles.label}>{children}</span>

      {/* Two arrows on one track in a one-arrow window: on hover the track
          slides by exactly one arrow, so the first leaves as the second
          arrives and the button never looks empty mid-gesture. */}
      <span className={styles.window} aria-hidden="true">
        <span className={styles.track}>
          <Arrow />
          <Arrow />
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  );
}
