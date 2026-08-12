import Image from "next/image";
import styles from "./PageShell.module.css";

/**
 * Full-viewport background shell shared by every route except the landing
 * page (which uses its own video background). Content is passed as children.
 */
export default function PageShell({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <main className={styles.shell}>
      {/* ── Image background ──────────────────────────── */}
      <div className={styles.imageBg}>
        <Image
          src="/default_except_landing.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        {/* Dark gradient overlay */}
        <div className={styles.imageOverlay} />
      </div>

      {/* ── Page content ──────────────────────────────── */}
      <div className={styles.content}>{children}</div>
    </main>
  );
}
