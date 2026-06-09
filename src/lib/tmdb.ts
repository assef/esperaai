import 'server-only';

const BASE = 'https://api.themoviedb.org/3';

function authHeader(): HeadersInit {
  if (!process.env.TMDB_BEARER_TOKEN) throw new Error('Missing env: TMDB_BEARER_TOKEN');
  return { Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}` };
}

async function tmdbGet<T = unknown>(
  path: string,
  params: Record<string, string> = {},
  revalidate = 3600,
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: authHeader(),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export interface TmdbMovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  poster_path: string | null;
}

interface TmdbSearchResponse {
  results: TmdbMovieDetail[];
}

/** Search cached for 1 hour — protects TMDB free tier quota */
export async function tmdbSearch(query: string) {
  return tmdbGet<TmdbSearchResponse>('/search/movie', {
    query,
    include_adult: 'false',
    language: 'pt-BR',
  }, 3600);
}

/** Movie detail cached for 24 hours — only called once per new movie */
export async function tmdbMovieDetail(tmdbId: number) {
  const [pt, en] = await Promise.all([
    tmdbGet<TmdbMovieDetail>(`/movie/${tmdbId}`, { language: 'pt-BR' }, 86400),
    tmdbGet<TmdbMovieDetail>(`/movie/${tmdbId}`, { language: 'en-US' }, 86400),
  ]);
  return { pt, en };
}
