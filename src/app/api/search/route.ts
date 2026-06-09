import { type NextRequest } from 'next/server';
import { tmdbSearch } from '@/lib/tmdb';
import type { Movie } from '@/lib/types';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return Response.json([]);

  try {
    const data = await tmdbSearch(q);
    const movies: Movie[] = (data.results ?? []).slice(0, 8).map((m) => ({
      id: String(m.id),
      tmdbId: m.id,
      title: {
        'pt-BR': m.title,
        'en-US': m.original_title,
      },
      originalTitle: m.original_title,
      year: m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 0,
      runtime: 0,
      rating: Math.round(m.vote_average * 10) / 10,
      hue: m.id % 360,
      posterPath: m.poster_path ?? null,
      reports: {},
      worth: { yes: 0, no: 0 },
      synopsis: { 'pt-BR': m.overview ?? '', 'en-US': m.overview ?? '' },
    }));
    return Response.json(movies);
  } catch (err) {
    console.error('[/api/search]', err);
    return Response.json([], { status: 500 });
  }
}
