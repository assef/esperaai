import { Button } from './ui/Button';
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
      <div
        style={{
          borderRadius: 22,
          padding: '30px 22px',
          textAlign: 'center',
          background: 'var(--bg-elev)',
          border: '1px dashed var(--border)',
        }}
      >
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            margin: '0 auto 14px',
            display: 'grid',
            placeItems: 'center',
            background: 'var(--bg-elev2)',
            color: 'var(--muted)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 30,
          }}
        >
          ?
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {t.beFirstTitle}
        </h2>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: 14.5,
            marginTop: 8,
            marginBottom: 0,
            maxWidth: 280,
            marginInline: 'auto',
            lineHeight: 1.45,
          }}
        >
          {t.beFirstSub}
        </p>
        <Button block style={{ marginTop: 18 }} onClick={onContribute}>
          {t.beFirstCta}
        </Button>
      </div>
    );
  }

  const hasScenes = consensus.total > 0;
  const ink = hasScenes ? 'var(--accent-ink)' : 'var(--text)';
  const panelBg = hasScenes ? 'var(--accent)' : 'var(--bg-elev)';
  const subInk = hasScenes
    ? 'color-mix(in oklab, var(--accent-ink) 78%, var(--accent))'
    : 'var(--muted)';
  const border = hasScenes ? 'none' : '1px solid var(--hairline)';
  const word = hasScenes ? t.wait : t.canGo;
  const sub = hasScenes ? t.answerWaitSub : t.answerGoSub;
  const sceneLabel = consensus.total === 1 ? t.sceneOne : t.sceneMany;

  return (
    <div
      role="region"
      aria-label={word}
      style={{
        borderRadius: 24,
        padding: '26px 22px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: panelBg,
        color: ink,
        border,
        boxShadow: hasScenes
          ? '0 16px 38px color-mix(in oklab, var(--accent) 40%, transparent)'
          : 'none',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: hasScenes ? 64 : 52,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          {word}
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, marginTop: 12, color: subInk }}>
          {sub}
        </div>
        <div
          aria-label={`${consensus.total} ${sceneLabel}`}
          style={{
            marginTop: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            borderRadius: 999,
            background: hasScenes ? 'rgba(255,255,255,0.16)' : 'var(--bg-elev2)',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 17,
            }}
          >
            {consensus.total}
          </span>
          <span style={{ color: subInk, fontWeight: 600 }}>{sceneLabel}</span>
        </div>
      </div>
    </div>
  );
}
