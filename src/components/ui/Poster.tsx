import { posterGradient } from '@/lib/movies';
import type { Movie } from '@/lib/types';
import type { Locale } from '@/lib/types';

interface PosterProps {
  movie: Movie;
  lang: Locale;
  width: number;
  height: number;
  radius?: number;
  showLabel?: boolean;
}

export function Poster({ movie, lang, width, height, radius = 14, showLabel = false }: PosterProps) {
  const title = movie.title[lang];

  if (movie.posterPath) {
    return (
      <img
        src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
        alt={title}
        width={width}
        height={height}
        style={{ borderRadius: radius, objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }

  const fontSize = Math.max(11, Math.min(20, width * 0.13));

  return (
    <div
      aria-label={title}
      style={{
        width,
        height,
        borderRadius: radius,
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        background: posterGradient(movie.hue),
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.10,
          backgroundImage: 'repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 9px)',
        }}
      />
      <div style={{ position: 'relative', padding: width > 90 ? 12 : 8 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#fff',
            fontSize,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            textShadow: '0 1px 6px rgba(0,0,0,0.45)',
            overflowWrap: 'break-word',
          }}
        >
          {title}
        </div>
        {showLabel && (
          <div
            aria-hidden
            style={{
              marginTop: 6,
              fontFamily: 'ui-monospace, monospace',
              fontSize: 9,
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            pôster TMDB
          </div>
        )}
      </div>
    </div>
  );
}
