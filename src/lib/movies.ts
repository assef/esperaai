import 'server-only';
import type { Movie } from './types';
import { getDb } from './db';
import { tmdbMovieDetail } from './tmdb';

function docToMovie(doc: Record<string, unknown>): Movie {
  const tmdbId = doc.tmdbId as number;
  const raw = doc.posterPath;
  // Backward compat: old docs stored posterPath as a string; new docs store it as { pt-BR, en-US }.
  const posterPath: Movie['posterPath'] =
    raw && typeof raw === 'object'
      ? (raw as Movie['posterPath'])
      : { 'pt-BR': (raw as string | null) ?? null, 'en-US': (raw as string | null) ?? null };
  return {
    id: String(tmdbId),
    tmdbId,
    title: doc.title as Movie['title'],
    originalTitle: (doc.originalTitle as string) ?? '',
    year: (doc.year as number) ?? 0,
    runtime: (doc.runtime as number) ?? 0,
    rating: (doc.rating as number) ?? 0,
    hue: tmdbId % 360,
    posterPath,
    reports: (doc.reports as Record<string, number>) ?? {},
    worth: (doc.worth as Movie['worth']) ?? { yes: 0, no: 0 },
    synopsis: doc.synopsis as Movie['synopsis'],
  };
}

export async function getMovies(): Promise<Movie[]> {
  try {
    const db = await getDb();
    console.log('[getMovies] db connected');
    const docs = await db
      .collection('movies')
      .find(
        // Only movies with at least one vote — movies are cached on first view
        // but should only surface on the home list once the community has voted.
        { $expr: { $gt: [{ $size: { $objectToArray: '$reports' } }, 0] } },
        { sort: { updatedAt: -1 }, limit: 12 },
      )
      .toArray();
    return docs.map((d) => docToMovie(d as Record<string, unknown>));
  } catch {
    return [];
  }
}

export async function getMovie(id: string): Promise<Movie | null> {
  const tmdbId = parseInt(id, 10);
  if (isNaN(tmdbId)) return null;

  try {
    const db = await getDb();

    const existing = await db.collection('movies').findOne({ tmdbId });
    if (existing) return docToMovie(existing as Record<string, unknown>);

    // Not cached — fetch both language variants from TMDB and persist
    const { pt, en } = await tmdbMovieDetail(tmdbId);
    const year = pt.release_date ? new Date(pt.release_date).getFullYear() : 0;

    const doc = {
      tmdbId,
      originalTitle: pt.original_title,
      title: {
        'pt-BR': pt.title || en.title || pt.original_title,
        'en-US': en.title || pt.original_title,
      },
      year,
      runtime: pt.runtime ?? en.runtime ?? 0,
      rating: Math.round((pt.vote_average ?? 0) * 10) / 10,
      posterPath: { 'pt-BR': pt.poster_path ?? null, 'en-US': en.poster_path ?? null },
      synopsis: {
        'pt-BR': pt.overview || en.overview || '',
        'en-US': en.overview || pt.overview || '',
      },
      reports: {} as Record<string, number>,
      worth: { yes: 0, no: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.collection('movies').insertOne(doc);
    } catch (e: unknown) {
      // Duplicate key — concurrent request already cached it
      if ((e as { code?: number }).code === 11000) {
        const concurrent = await db.collection('movies').findOne({ tmdbId });
        if (concurrent) return docToMovie(concurrent as Record<string, unknown>);
      } else {
        throw e;
      }
    }

    return { id: String(tmdbId), hue: tmdbId % 360, ...doc };
  } catch (err) {
    console.error('[getMovie] error for id', id, err);
    return null;
  }
}
