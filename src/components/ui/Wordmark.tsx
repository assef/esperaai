import styles from './Wordmark.module.css';

export function Wordmark() {
  return (
    <div className={styles.root} aria-label="Espera aí">
      Espera <span className={styles.accent}>aí</span>
    </div>
  );
}
