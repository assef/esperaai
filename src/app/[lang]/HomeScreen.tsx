'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';
import { TopBar } from '@/components/TopBar';
import { SearchField } from '@/components/SearchField';
import { MovieRow } from '@/components/MovieRow';
import { MovieRowSkeleton } from '@/components/MovieRowSkeleton';
import { AdSlot } from '@/components/ui/AdSlot';
import { mkT } from '@/lib/format';
import styles from './HomeScreen.module.css';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale, Movie } from '@/lib/types';

interface HomeScreenProps {
  dict: Dictionary;
  lang: Locale;
  initialMovies: Movie[];
}

const SKELETON_COUNT = 5;

export function HomeScreen({ dict, lang, initialMovies }: HomeScreenProps) {
  const t = mkT(dict);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get('s') ?? '');
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState<Movie[] | null>(null);
  const [fetching, setFetching] = useState(false);

  const isStale = query !== deferredQuery;
  const hasQuery = query.trim().length >= 2;
  const showSkeleton = hasQuery && (isStale || fetching);

  useEffect(() => {
    const q = deferredQuery.trim();
    if (q.length < 2) {
      setResults(null);
      setFetching(false);
      return;
    }

    const controller = new AbortController();
    setFetching(true);

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json() as Promise<Movie[]>;
        })
        .then((data) => {
          setResults(data);
          setFetching(false);
          if (data.length === 0) {
            sendGAEvent('event', 'search_no_results', { search_term: q });
          } else {
            sendGAEvent('event', 'search', { search_term: q, results_count: data.length });
          }
        })
        .catch((e: Error) => {
          if (e.name !== 'AbortError') setFetching(false);
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [deferredQuery]);

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (!v.trim()) {
      setResults(null);
      setFetching(false);
    }
  };

  return (
    <main>
      <h1 className="sr-only">Espera aí</h1>
      <div className="home-container">
        <TopBar dict={dict} lang={lang} />

        <div className="home-search">
          <SearchField t={t} value={query} onChange={handleQueryChange} />
        </div>

        {!hasQuery && (
          <p className={styles.intro}>{t.seoIntro}</p>
        )}

        {hasQuery ? (
          <section aria-live="polite" aria-label={t.searchPlaceholder}>
            {showSkeleton ? (
              <ul className={`home-movie-grid ${styles.list}`}>
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <li key={i}><MovieRowSkeleton /></li>
                ))}
              </ul>
            ) : results?.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsTitle}>{t.noResults}</div>
                <div className={styles.noResultsHint}>{t.searchHint}</div>
              </div>
            ) : results ? (
              <ul className={`home-movie-grid ${styles.list}`}>
                {results.map((m) => (
                  <li key={m.id}><MovieRow movie={m} lang={lang} t={t} searchQuery={deferredQuery.trim()} /></li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : (
          <>
            <div className={styles.sectionHeader}>
              <h2 className={`home-heading ${styles.communityHeading}`}>
                {t.communityUpdated}
              </h2>
              <span aria-hidden className={styles.liveDot} />
            </div>

            {initialMovies.length === 0 ? (
              <div className={styles.emptyHint}>{t.searchHint}</div>
            ) : (
              <ul className={`home-movie-grid ${styles.list}`}>
                {initialMovies.slice(0, 4).map((m) => (
                  <li key={m.id}><MovieRow movie={m} lang={lang} t={t} /></li>
                ))}
                <li className="home-ad-item">
                  <AdSlot t={t} height={100} />
                </li>
                {initialMovies.slice(4).map((m) => (
                  <li key={m.id}><MovieRow movie={m} lang={lang} t={t} /></li>
                ))}
              </ul>
            )}

            <p className={styles.footer}>{t.free}</p>
          </>
        )}
      </div>
    </main>
  );
}
