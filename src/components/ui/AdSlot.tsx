import styles from './AdSlot.module.css';
import type { T } from '@/lib/format';

interface AdSlotProps {
  t: T;
  height?: number;
  slotId?: string;
}

export function AdSlot({ t, height = 100, slotId }: AdSlotProps) {
  return (
    <div
      className={styles.slot}
      aria-label={t.adLabel}
      data-ad-slot={slotId}
      style={{ height }}
    >
      <div className={styles.label} aria-hidden>{t.adLabel}</div>
      <div className={styles.placeholder} aria-hidden>AdSense · 320×{height}</div>
    </div>
  );
}
