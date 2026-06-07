import { SparkIcon, ClockIcon } from './ui/Icon';
import type { T } from '@/lib/format';

interface WorthBadgeProps {
  verdict: boolean;
  t: T;
}

export function WorthBadge({ verdict, t }: WorthBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 14px',
        borderRadius: 12,
        background: 'var(--bg-elev)',
        border: '1px solid var(--hairline)',
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--text)',
      }}
    >
      <span
        style={{
          color: verdict ? 'var(--accent)' : 'var(--faint)',
          display: 'inline-flex',
        }}
        aria-hidden
      >
        {verdict ? <SparkIcon size={16} /> : <ClockIcon size={15} />}
      </span>
      {verdict ? t.worthIt : t.skippable}
    </div>
  );
}
