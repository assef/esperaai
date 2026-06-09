import { type NextRequest } from 'next/server';
import { tmdbSearch } from '@/lib/tmdb';
import { getDb } from '@/lib/db';
import type { Movie } from '@/lib/types';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return Response.json([]);

  try {
    // TMDB fetch is cached (1h) to protect the free-tier quota.
    const data = await tmdbSearch(q);
    const tmdbResults = (data.results ?? []).slice(0, 8);

    // Enrich with live vote data from DB — single query, always fresh.
    const tmdbIds = tmdbResults.map((m) => m.id);
    const db = await getDb();
    const dbDocs = await db
      .collection('movies')
      .find({ tmdbId: { $in: tmdbIds } }, { projection: { tmdbId: 1, reports: 1, worth: 1 } })
      .toArray();

    const dbMap = new Map(
      dbDocs.map((d) => [
        d.tmdbId as number,
        {
          reports: (d.reports as Record<string, number>) ?? {},
          worth: (d.worth as { yes: number; no: number }) ?? { yes: 0, no: 0 },
        },
      ]),
    );

    const movies: Movie[] = tmdbResults.map((m) => {
      const db = dbMap.get(m.id);
      return {
        id: String(m.id),
        tmdbId: m.id,
        title: { 'pt-BR': m.title, 'en-US': m.original_title },
        originalTitle: m.original_title,
        year: m.release_date ? parseInt(m.release_date.slice(0, 4), 10) : 0,
        runtime: 0,
        rating: Math.round(m.vote_average * 10) / 10,
        hue: m.id % 360,
        posterPath: m.poster_path ?? null,
        reports: db?.reports ?? {},
        worth: db?.worth ?? { yes: 0, no: 0 },
        synopsis: { 'pt-BR': m.overview ?? '', 'en-US': m.overview ?? '' },
      };
    });

    return Response.json(movies);
  } catch (err) {
    console.error('[/api/search]', err);
    return Response.json([], { status: 500 });
  }
}
