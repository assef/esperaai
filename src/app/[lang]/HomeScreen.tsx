'use client';

import { useMemo, useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { SearchField } from '@/components/SearchField';
import { MovieRow } from '@/components/MovieRow';
import { AdSlot } from '@/components/ui/AdSlot';
import { mkT } from '@/lib/format';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';
import type { Movie } from '@/lib/types';

interface HomeScreenProps {
  dict: Dictionary;
  lang: Locale;
  movies: Movie[];
}

export function HomeScreen({ dict, lang, movies }: HomeScreenProps) {
  const t = mkT(dict);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return null;
    return movies.filter((m) =>
      Object.values(m.title).some((title) => title.toLowerCase().includes(q)),
    );
  }, [q, movies]);

  return (
    <main>
      <h1 className="sr-only">Espera aí</h1>
      <div className="home-container">
        <TopBar dict={dict} lang={lang} />

        <div className="home-search">
          <SearchField t={t} value={query} onChange={setQuery} />
        </div>

        {results ? (
          <section aria-label={t.searchPlaceholder}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--muted)' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 18,
                    color: 'var(--text)',
                  }}
                >
                  {t.noResults}
                </div>
                <div style={{ fontSize: 14, marginTop: 6 }}>{t.searchHint}</div>
              </div>
            ) : (
              <ul
                className="home-movie-grid"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                {results.map((m) => (
                  <li key={m.id}>
                    <MovieRow movie={m} lang={lang} t={t} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 2,
              }}
            >
              <h2
                className="home-heading"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 15,
                  letterSpacing: '0.02em',
                  margin: 0,
                }}
              >
                {t.communityUpdated}
              </h2>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 99,
                  background: 'var(--accent)',
                  boxShadow: '0 0 0 4px var(--accent-soft)',
                }}
              />
            </div>

            <ul
              className="home-movie-grid"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              {movies.slice(0, 4).map((m) => (
                <li key={m.id}>
                  <MovieRow movie={m} lang={lang} t={t} />
                </li>
              ))}
              <li className="home-ad-item">
                <AdSlot t={t} height={100} />
              </li>
              {movies.slice(4).map((m) => (
                <li key={m.id}>
                  <MovieRow movie={m} lang={lang} t={t} />
                </li>
              ))}
            </ul>

            <p
              style={{
                textAlign: 'center',
                color: 'var(--faint)',
                fontSize: 12,
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              {t.free}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
