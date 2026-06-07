import type { T } from '@/lib/format';

interface AdSlotProps {
  t: T;
  height?: number;
  slotId?: string;
}

export function AdSlot({ t, height = 100, slotId }: AdSlotProps) {
  return (
    <div
      aria-label={t.adLabel}
      data-ad-slot={slotId}
      style={{
        height,
        borderRadius: 14,
        border: '1px dashed var(--border)',
        background: 'repeating-linear-gradient(135deg, var(--bg-elev) 0 10px, var(--bg) 10px 20px)',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 8,
          left: 10,
          fontSize: 9.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'var(--faint)',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        {t.adLabel}
      </div>
      <div
        aria-hidden
        style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: 'var(--faint)' }}
      >
        AdSense · 320×{height}
      </div>
    </div>
  );
}
