import { SparkIcon, ClockIcon } from './ui/Icon';
import styles from './WorthBadge.module.css';
import type { T } from '@/lib/format';

interface WorthBadgeProps {
  verdict: boolean;
  t: T;
}

export function WorthBadge({ verdict, t }: WorthBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={verdict ? styles.iconWorth : styles.iconSkip} aria-hidden>
        {verdict ? <SparkIcon size={16} /> : <ClockIcon size={15} />}
      </span>
      {verdict ? t.worthIt : t.skippable}
    </div>
  );
}
