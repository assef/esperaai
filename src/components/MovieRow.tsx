'use client';

import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';
import { Poster } from './ui/Poster';
import { ConsensusBadge } from './ConsensusBadge';
import { Dot } from './ui/Dot';
import { StarIcon } from './ui/Icon';
import { computeConsensus } from '@/lib/consensus';
import { slugify } from '@/lib/slug';
import styles from './MovieRow.module.css';
import type { Movie, Locale } from '@/lib/types';
import type { T } from '@/lib/format';

interface MovieRowProps {
  movie: Movie;
  lang: Locale;
  t: T;
  searchQuery?: string;
}

export function MovieRow({ movie, lang, t, searchQuery }: MovieRowProps) {
  const consensus = computeConsensus(movie.reports);
  const qs = searchQuery ? `?s=${encodeURIComponent(searchQuery)}` : '';

  return (
    <Link
      href={`/${lang}/movie/${movie.id}/${slugify(movie.title[lang])}${qs}`}
      className={`pressable ${styles.link}`}
      aria-label={`${movie.title[lang]}, ${movie.year}`}
      onClick={() =>
        sendGAEvent('event', 'select_content', {
          content_type: 'movie',
          item_id: movie.id,
          item_name: movie.title[lang],
        })
      }
    >
      <Poster movie={movie} lang={lang} width={52} height={72} radius={9} />

      <div className={styles.info}>
        <div className={styles.title}>{movie.title[lang]}</div>

        <div className={styles.meta}>
          <span>{movie.year}</span>
          <Dot />
          <span className={styles.metaRating}>
            <StarIcon size={12} />
            {movie.rating.toFixed(1)}
          </span>
        </div>

        <div className={styles.status}>
          {!consensus.hasData ? (
            <span className={styles.beFirst}>{t.beFirstShort}</span>
          ) : consensus.total === 0 ? (
            <span className={styles.noScene}>
              {t.rowNoScene} · {t.votesShort(consensus.totalVotes)}
            </span>
          ) : (
            <span className={styles.confirmed}>{t.confirmedBy(consensus.totalVotes)}</span>
          )}
        </div>
      </div>

      <ConsensusBadge consensus={consensus} />
    </Link>
  );
}
