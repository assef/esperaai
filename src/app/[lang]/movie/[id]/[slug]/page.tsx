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

  const description = buildDescription({ title, year: movie.year, consensus, verdict, isPt });

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

  // ── JSON-LD: FAQPage (only when community has data) ─────────────────────────
  const faqLd = consensus.hasData
    ? buildFaqLd({ title, consensus, verdict, isPt })
    : null;

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <MovieDetailScreen dict={dict} lang={locale} movie={movie} />
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildDescription({
  title,
  year,
  consensus,
  verdict,
  isPt,
}: {
  title: string;
  year: number;
  consensus: ReturnType<typeof computeConsensus>;
  verdict: boolean | null;
  isPt: boolean;
}): string {
  if (!consensus.hasData) {
    return isPt
      ? `${title} (${year}) tem cena pós-crédito? Ainda sem votos da comunidade. Seja o primeiro a informar!`
      : `Does ${title} (${year}) have post-credit scenes? No community votes yet. Be the first to report!`;
  }

  const n = consensus.total;

  if (n === 0) {
    return isPt
      ? `${title} (${year}) NÃO tem cena pós-crédito. Pode sair quando os créditos começarem! Baseado em ${consensus.totalVotes} voto${consensus.totalVotes > 1 ? 's' : ''} da comunidade.`
      : `${title} (${year}) has NO post-credit scenes. You can leave when the credits roll! Based on ${consensus.totalVotes} community vote${consensus.totalVotes > 1 ? 's' : ''}.`;
  }

  const worthSuffix = isPt
    ? verdict === true
      ? ' Vale a pena esperar!'
      : verdict === false
      ? ' Dá pra pular sem culpa.'
      : ''
    : verdict === true
    ? ' Worth staying for!'
    : verdict === false
    ? ' Fine to skip.'
    : '';

  return isPt
    ? `${title} (${year}) TEM ${n} cena${n > 1 ? 's' : ''} pós-crédito!${worthSuffix} Baseado em ${consensus.totalVotes} voto${consensus.totalVotes > 1 ? 's' : ''} da comunidade.`
    : `${title} (${year}) HAS ${n} post-credit scene${n > 1 ? 's' : ''}!${worthSuffix} Based on ${consensus.totalVotes} community vote${consensus.totalVotes > 1 ? 's' : ''}.`;
}

function buildFaqLd({
  title,
  consensus,
  verdict,
  isPt,
}: {
  title: string;
  consensus: ReturnType<typeof computeConsensus>;
  verdict: boolean | null;
  isPt: boolean;
}) {
  const n = consensus.total;
  const questions = [];

  if (isPt) {
    const answerText =
      n === 0
        ? `Não, ${title} não tem cena pós-crédito. Pode sair do cinema quando os créditos começarem.`
        : `Sim, ${title} tem ${n} cena${n > 1 ? 's' : ''} pós-crédito, de acordo com a comunidade.`;

    questions.push({
      '@type': 'Question',
      name: `${title} tem cena pós-crédito?`,
      acceptedAnswer: { '@type': 'Answer', text: answerText },
    });

    if (n > 0 && verdict !== null) {
      questions.push({
        '@type': 'Question',
        name: `Vale a pena esperar os créditos de ${title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            verdict === true
              ? `Sim, vale a pena esperar! A comunidade confirma que as cenas pós-crédito de ${title} valem a espera.`
              : `Não necessariamente. A comunidade acha que dá pra pular as cenas de ${title} sem culpa.`,
        },
      });
    }
  } else {
    const answerText =
      n === 0
        ? `No, ${title} does not have any post-credit scenes. You can leave when the credits start rolling.`
        : `Yes, ${title} has ${n} post-credit scene${n > 1 ? 's' : ''} according to the community.`;

    questions.push({
      '@type': 'Question',
      name: `Does ${title} have post-credit scenes?`,
      acceptedAnswer: { '@type': 'Answer', text: answerText },
    });

    if (n > 0 && verdict !== null) {
      questions.push({
        '@type': 'Question',
        name: `Is it worth staying for the credits of ${title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            verdict === true
              ? `Yes, it's worth staying! The community says the post-credit scenes of ${title} are worth the wait.`
              : `Not really. The community thinks you can skip the post-credit scenes of ${title}.`,
        },
      });
    }
  }

  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions };
}
