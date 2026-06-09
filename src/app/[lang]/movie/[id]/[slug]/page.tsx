import type { Metadata } from 'next';
import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovie } from '@/lib/movies';
import { slugify } from '@/lib/slug';
import { computeConsensus } from '@/lib/consensus';
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

  const description = isPt
    ? `${title} (${movie.year}) tem cena pós-crédito? ${
        consensus.hasData
          ? consensus.total === 0
            ? 'Não tem cena pós-crédito. Pode sair!'
            : `Sim, tem ${consensus.total} cena${consensus.total > 1 ? 's' : ''} pós-crédito.`
          : 'Descubra e vote na nossa comunidade.'
      }`
    : `Does ${title} (${movie.year}) have post-credit scenes? ${
        consensus.hasData
          ? consensus.total === 0
            ? 'No post-credit scenes. You can go!'
            : `Yes, there ${consensus.total === 1 ? 'is' : 'are'} ${consensus.total} post-credit scene${consensus.total > 1 ? 's' : ''}.`
          : 'Find out and vote in our community.'
      }`;

  const canonicalSlug = isPt ? ptSlug : enSlug;

  return {
    title: isPt
      ? `${title} — Tem cena pós-crédito?`
      : `${title} — Post-credit scenes?`,
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
        ? `${title} — Tem cena pós-crédito?`
        : `${title} — Post-credit scenes?`,
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

  const posterPath = movie.posterPath[locale] ?? movie.posterPath['pt-BR'];
  const totalVotes =
    Object.values(movie.reports).reduce((a, b) => a + b, 0) +
    movie.worth.yes +
    movie.worth.no;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title[locale],
    url: `${SITE_URL}/${locale}/movie/${movie.id}/${slugify(movie.title[locale])}`,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MovieDetailScreen dict={dict} lang={locale} movie={movie} />
    </>
  );
}
