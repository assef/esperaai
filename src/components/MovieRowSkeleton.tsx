import styles from './MovieRowSkeleton.module.css';

export function MovieRowSkeleton() {
  return (
    <div className={styles.row} aria-hidden>
      <div className={`skeleton ${styles.poster}`} />
      <div className={styles.body}>
        <div className={`skeleton ${styles.lineTitle}`} />
        <div className={`skeleton ${styles.lineMeta}`} />
        <div className={`skeleton ${styles.lineSub}`} />
      </div>
      <div className={`skeleton ${styles.badge}`} />
    </div>
  );
}
