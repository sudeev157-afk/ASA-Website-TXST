import styles from "./PageShell.module.css";

/**
 * Full-viewport shell shared by every route except the landing page (which
 * keeps its own video background). Plain white — content is passed as children.
 */
export default function PageShell({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <main className={styles.shell}>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
