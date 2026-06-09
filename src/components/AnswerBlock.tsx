import { Button } from './ui/Button';
import styles from './AnswerBlock.module.css';
import type { Consensus } from '@/lib/types';
import type { T } from '@/lib/format';

interface AnswerBlockProps {
  consensus: Consensus;
  t: T;
  onContribute: () => void;
}

export function AnswerBlock({ consensus, t, onContribute }: AnswerBlockProps) {
  if (!consensus.hasData) {
    return (
      <div className={styles.empty}>
        <div aria-hidden className={styles.emptyIcon}>?</div>
        <h2 className={styles.emptyTitle}>{t.beFirstTitle}</h2>
        <p className={styles.emptySub}>{t.beFirstSub}</p>
        <Button block style={{ marginTop: 18 }} onClick={onContribute}>
          {t.beFirstCta}
        </Button>
      </div>
    );
  }

  const wait = consensus.total > 0;
  const word = wait ? t.wait : t.canGo;
  const sub = wait ? t.answerWaitSub : t.answerGoSub;
  const sceneLabel = consensus.total === 1 ? t.sceneOne : t.sceneMany;

  return (
    <div
      role="region"
      aria-label={word}
      className={`${styles.panel} ${wait ? styles.panelWait : styles.panelGo}`}
    >
      <div className={`${styles.word} ${wait ? styles.wordWait : styles.wordGo}`}>
        {word}
      </div>
      <div className={`${styles.sub} ${wait ? styles.subWait : styles.subGo}`}>
        {sub}
      </div>
      <div
        aria-label={`${consensus.total} ${sceneLabel}`}
        className={`${styles.pill} ${wait ? styles.pillWait : styles.pillGo}`}
      >
        <span className={styles.pillCount}>{consensus.total}</span>
        <span className={wait ? styles.pillLabelWait : styles.pillLabelGo}>{sceneLabel}</span>
      </div>
    </div>
  );
}
