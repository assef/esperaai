import styles from './ConsensusBadge.module.css';
import type { Consensus } from '@/lib/types';

interface ConsensusBadgeProps {
  consensus: Consensus;
  big?: boolean;
}

export function ConsensusBadge({ consensus, big = false }: ConsensusBadgeProps) {
  const sizeClass = big ? styles.big : styles.normal;

  if (!consensus.hasData) {
    return (
      <div
        aria-label="Sem dados"
        className={`${styles.badge} ${sizeClass} ${styles.empty}`}
      >
        ?
      </div>
    );
  }

  const hasScenes = consensus.total > 0;

  return (
    <div
      aria-label={`${consensus.total} ${hasScenes ? 'cenas' : 'cenas (nenhuma)'}`}
      className={`${styles.badge} ${sizeClass} ${hasScenes ? styles.hasScenes : styles.noScenes}`}
    >
      {consensus.total}
    </div>
  );
}
