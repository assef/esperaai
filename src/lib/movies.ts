import 'server-only';
import type { Movie } from './types';
import { getDb } from './db';
import { tmdbMovieDetail } from './tmdb';

// ── DB schema (new) ────────────────────────────────────────────────────────
// Shared root fields:  tmdbId, originalTitle, year, runtime, rating,
//                      reports, worth, createdAt, updatedAt
// Locale-specific:     locales[] → { lang, title, synopsis, posterPath }
//
// Legacy formats still present in Atlas:
//   v1 – posterPath as string, title/synopsis as { 'pt-BR', 'en-US' } objects
//   v2 – same but posterPath as { 'pt-BR', 'en-US' } object
// docToMovie handles all three transparently.
// ──────────────────────────────────────────────────────────────────────────

type LocaleEntry = {
  lang: string;
  title: string;
  synopsis: string;
  posterPath: string | null;
};

function docToMovie(doc: Record<string, unknown>): Movie {
  const tmdbId = doc.tmdbId as number;
  const fallbackTitle = (doc.originalTitle as string) ?? '';

  let title: Movie['title'];
  let synopsis: Movie['synopsis'];
  let posterPath: Movie['posterPath'];

  if (Array.isArray(doc.locales)) {
    // New schema: locale-specific fields in a locales array
    const locales = doc.locales as LocaleEntry[];
    const pt = locales.find((l) => l.lang === 'pt-BR');
    const en = locales.find((l) => l.lang === 'en-US');
    title = {
      'pt-BR': pt?.title ?? en?.title ?? fallbackTitle,
      'en-US': en?.title ?? pt?.title ?? fallbackTitle,
    };
    synopsis = {
      'pt-BR': pt?.synopsis ?? en?.synopsis ?? '',
      'en-US': en?.synopsis ?? pt?.synopsis ?? '',
    };
    posterPath = {
      'pt-BR': pt?.posterPath ?? null,
      'en-US': en?.posterPath ?? null,
    };
  } else {
    // Legacy schema: flat locale-keyed objects on the root document
    title = (doc.title as Movie['title']) ?? { 'pt-BR': fallbackTitle, 'en-US': fallbackTitle };
    synopsis = (doc.synopsis as Movie['synopsis']) ?? { 'pt-BR': '', 'en-US': '' };
    const raw = doc.posterPath;
    posterPath =
      raw && typeof raw === 'object'
        ? (raw as Movie['posterPath'])
        : { 'pt-BR': (raw as string | null) ?? null, 'en-US': (raw as string | null) ?? null };
  }

  return {
    id: String(tmdbId),
    tmdbId,
    title,
    originalTitle: fallbackTitle,
    year: (doc.year as number) ?? 0,
    runtime: (doc.runtime as number) ?? 0,
    rating: (doc.rating as number) ?? 0,
    hue: tmdbId % 360,
    posterPath,
    reports: (doc.reports as Record<string, number>) ?? {},
    worth: (doc.worth as Movie['worth']) ?? { yes: 0, no: 0 },
    synopsis,
  };
}

export async function getMovies(): Promise<Movie[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection('movies')
      .find(
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
      year,
      runtime: pt.runtime ?? en.runtime ?? 0,
      rating: Math.round((pt.vote_average ?? 0) * 10) / 10,
      locales: [
        {
          lang: 'pt-BR',
          title: pt.title || en.title || pt.original_title,
          synopsis: pt.overview || en.overview || '',
          posterPath: pt.poster_path ?? null,
        },
        {
          lang: 'en-US',
          title: en.title || pt.original_title,
          synopsis: en.overview || pt.overview || '',
          posterPath: en.poster_path ?? null,
        },
      ] as LocaleEntry[],
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

    return docToMovie(doc as Record<string, unknown>);
  } catch (err) {
    console.error('[getMovie] error for id', id, err);
    return null;
  }
}
