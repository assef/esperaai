import Image from 'next/image';
import { posterGradient } from '@/lib/poster';
import styles from './Poster.module.css';
import type { Movie, Locale } from '@/lib/types';

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

  const posterPath = movie.posterPath[lang] ?? movie.posterPath['pt-BR'];
  if (posterPath) {
    // Pick the smallest TMDB bucket that covers the rendered size at 2× for crisp HiDPI.
    const tmdbSize = width <= 77 ? 'w154' : width <= 171 ? 'w342' : 'w500';
    return (
      <Image
        className={styles.image}
        src={`https://image.tmdb.org/t/p/${tmdbSize}${posterPath}`}
        alt={title}
        width={width}
        height={height}
        sizes={`${width}px`}
        style={{ borderRadius: radius }}
      />
    );
  }

  const fontSize = Math.max(11, Math.min(20, width * 0.13));
  const padding = width > 90 ? 12 : 8;

  return (
    <div
      className={styles.placeholder}
      aria-label={title}
      style={{ width, height, borderRadius: radius, background: posterGradient(movie.hue) }}
    >
      <div className={styles.texture} aria-hidden />
      <div className={styles.titleWrap} style={{ padding }}>
        <div className={styles.title} style={{ fontSize }}>
          {title}
        </div>
        {showLabel && (
          <div className={styles.tmdbLabel} aria-hidden>pôster TMDB</div>
        )}
      </div>
    </div>
  );
}
