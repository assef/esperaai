import Link from 'next/link';
import { Poster } from './ui/Poster';
import { ConsensusBadge } from './ConsensusBadge';
import { Dot } from './ui/Dot';
import { StarIcon } from './ui/Icon';
import { computeConsensus } from '@/lib/consensus';
import type { Movie } from '@/lib/types';
import type { T } from '@/lib/format';
import type { Locale } from '@/lib/types';

interface MovieRowProps {
  movie: Movie;
  lang: Locale;
  t: T;
}

export function MovieRow({ movie, lang, t }: MovieRowProps) {
  const consensus = computeConsensus(movie.reports);

  return (
    <Link
      href={`/${lang}/movie/${movie.id}`}
      className="pressable"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        padding: 10,
        borderRadius: 16,
        border: '1px solid var(--hairline)',
        background: 'var(--bg-elev)',
        textDecoration: 'none',
        color: 'var(--text)',
      }}
      aria-label={`${movie.title[lang]}, ${movie.year}`}
    >
      <Poster movie={movie} lang={lang} width={52} height={72} radius={9} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {movie.title[lang]}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 5,
            color: 'var(--muted)',
            fontSize: 12.5,
            fontWeight: 500,
          }}
        >
          <span>{movie.year}</span>
          <Dot />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <StarIcon size={12} />
            {movie.rating.toFixed(1)}
          </span>
        </div>

        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600 }}>
          {!consensus.hasData ? (
            <span style={{ color: 'var(--accent)' }}>{t.beFirstShort}</span>
          ) : consensus.total === 0 ? (
            <span style={{ color: 'var(--faint)' }}>
              {t.rowNoScene} · {t.votesShort(consensus.totalVotes)}
            </span>
          ) : (
            <span style={{ color: 'var(--faint)' }}>{t.confirmedBy(consensus.totalVotes)}</span>
          )}
        </div>
      </div>

      <ConsensusBadge consensus={consensus} />
    </Link>
  );
}
