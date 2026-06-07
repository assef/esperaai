import type { Consensus } from '@/lib/types';

interface ConsensusBadgeProps {
  consensus: Consensus;
  big?: boolean;
}

export function ConsensusBadge({ consensus, big = false }: ConsensusBadgeProps) {
  const sz = big ? 44 : 38;

  if (!consensus.hasData) {
    return (
      <div
        aria-label="Sem dados"
        style={{
          width: sz,
          height: sz,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--bg-elev2)',
          color: 'var(--faint)',
          border: '1px dashed var(--border)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: big ? 20 : 17,
          flexShrink: 0,
        }}
      >
        ?
      </div>
    );
  }

  const hasScenes = consensus.total > 0;

  return (
    <div
      aria-label={`${consensus.total} ${hasScenes ? 'cenas' : 'cenas (nenhuma)'}`}
      style={{
        width: sz,
        height: sz,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        background: hasScenes ? 'var(--accent)' : 'var(--bg-elev2)',
        color: hasScenes ? 'var(--accent-ink)' : 'var(--faint)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: big ? 22 : 19,
        flexShrink: 0,
        boxShadow: hasScenes
          ? '0 4px 12px color-mix(in oklab, var(--accent) 45%, transparent)'
          : 'none',
      }}
    >
      {consensus.total}
    </div>
  );
}
