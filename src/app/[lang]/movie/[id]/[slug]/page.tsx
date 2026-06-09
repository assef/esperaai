import type { Metadata } from 'next';
import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovie } from '@/lib/movies';
import { slugify } from '@/lib/slug';
import { computeConsensus, worthVerdict } from '@/lib/consensus';

import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import { MovieDetailScreen } from '../MovieDetailScreen';
import type { Locale } from '@/lib/types';

interface Props {
  params: Promise<{ lang: string; id: string; slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const movie = await getMovie(id);
  if (!movie) return {};
  const locale = lang as Locale;
  const isPt = locale === 'pt-BR';
  const title = movie.title[locale];
  const ptSlug = slugify(movie.title['pt-BR']);
  const enSlug = slugify(movie.title['en-US']);
  const consensus = computeConsensus(movie.reports);
  const verdict = worthVerdict(movie.worth);
  const canonicalSlug = isPt ? ptSlug : enSlug;

  const description = buildDescription({ title, year: movie.year, consensus, isPt });

  return {
    title: isPt
      ? `${title} tem cena pós-crédito?`
      : `Does ${title} have post-credit scenes?`,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/movie/${id}/${canonicalSlug}`,
      languages: {
        'pt-BR': `${SITE_URL}/pt-BR/movie/${id}/${ptSlug}`,
        'en-US': `${SITE_URL}/en-US/movie/${id}/${enSlug}`,
        'x-default': `${SITE_URL}/pt-BR/movie/${id}/${ptSlug}`,
      },
    },
    openGraph: {
      title: isPt
        ? `${title} tem cena pós-crédito?`
        : `Does ${title} have post-credit scenes?`,
      description,
      url: `${SITE_URL}/${locale}/movie/${id}/${canonicalSlug}`,
      type: 'video.movie',
      locale: isPt ? 'pt_BR' : 'en_US',
      alternateLocale: [isPt ? 'en_US' : 'pt_BR'],
    },
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const [dict, movie] = await Promise.all([getDictionary(locale), getMovie(id)]);
  if (!movie) notFound();

  const isPt = locale === 'pt-BR';
  const title = movie.title[locale];
  const slug = slugify(title);
  const pageUrl = `${SITE_URL}/${locale}/movie/${movie.id}/${slug}`;
  const posterPath = movie.posterPath[locale] ?? movie.posterPath['pt-BR'];
  const consensus = computeConsensus(movie.reports);
  const verdict = worthVerdict(movie.worth);
  const totalVotes =
    Object.values(movie.reports).reduce((a, b) => a + b, 0) +
    movie.worth.yes +
    movie.worth.no;

  // ── JSON-LD: Movie ──────────────────────────────────────────────────────────
  const movieLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    url: pageUrl,
    ...(movie.synopsis[locale] && { description: movie.synopsis[locale] }),
    ...(movie.year && { datePublished: String(movie.year) }),
    ...(movie.runtime > 0 && { duration: `PT${movie.runtime}M` }),
    ...(posterPath && { image: `https://image.tmdb.org/t/p/w500${posterPath}` }),
    ...(movie.rating > 0 &&
      totalVotes > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: movie.rating,
          bestRating: 10,
          ratingCount: totalVotes,
        },
      }),
  };

  // ── JSON-LD: BreadcrumbList ─────────────────────────────────────────────────
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'EsperaAí',
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <MovieDetailScreen dict={dict} lang={locale} movie={movie} />
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildDescription({
  title,
  year,
  consensus,
  isPt,
}: {
  title: string;
  year: number;
  consensus: ReturnType<typeof computeConsensus>;
  isPt: boolean;
}): string {
  if (!consensus.hasData) {
    return isPt
      ? `${title} (${year}) tem cena pós-crédito? Ainda sem dados. Vote na nossa comunidade e ajude outros fãs!`
      : `Does ${title} (${year}) have post-credit scenes? No data yet. Vote and help the community!`;
  }

  const n = consensus.total;
  const votes = consensus.totalVotes;

  if (n === 0) {
    // No scenes: reveal fully — there's nothing more to see on the page about scenes,
    // but users visit to vote, check details, or explore other movies.
    return isPt
      ? `${title} (${year}) não tem cena pós-crédito. Pode sair tranquilo! Confirmado por ${votes} voto${votes > 1 ? 's' : ''} da comunidade.`
      : `${title} (${year}) has no post-credit scenes. You can leave safely! Confirmed by ${votes} community vote${votes > 1 ? 's' : ''}.`;
  }

  // Has scenes: tease the count and worth verdict so users click through for the full answer.
  return isPt
    ? `${title} (${year}) TEM cena pós-crédito! Quantas? Vale a pena esperar? Veja o resultado de ${votes} voto${votes > 1 ? 's' : ''} da comunidade.`
    : `${title} (${year}) HAS post-credit scenes! How many? Worth staying? See the result from ${votes} community vote${votes > 1 ? 's' : ''}.`;
}
