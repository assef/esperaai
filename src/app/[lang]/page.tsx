import type { Metadata } from 'next';
import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovies } from '@/lib/movies';
import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import { HomeScreen } from './HomeScreen';
import type { Locale } from '@/lib/types';

// Revalidate every 5 minutes so the community list stays fresh without hammering the DB.
// Votes also call revalidatePath() in the server action for instant updates.
export const revalidate = 300;

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const locale = lang as Locale;
  const isPt = locale === 'pt-BR';

  return {
    title: isPt
      ? 'Espera aí — Tem cena pós-crédito?'
      : 'Should I Wait — Post-credit scenes?',
    description: isPt
      ? 'Descubra se um filme tem cena pós-crédito, stinger ou cena depois dos créditos. Sem spoilers, pela comunidade.'
      : 'Find out if a movie has post-credit scenes, a stinger, or mid-credits scene. No spoilers, community-driven.',
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        'pt-BR': `${SITE_URL}/pt-BR`,
        'en-US': `${SITE_URL}/en-US`,
        'x-default': `${SITE_URL}/pt-BR`,
      },
    },
    openGraph: {
      title: isPt
        ? 'Espera aí — Tem cena pós-crédito?'
        : 'Should I Wait — Post-credit scenes?',
      description: isPt
        ? 'Descubra se um filme tem cena pós-crédito. Colaborativo e gratuito.'
        : 'Find out if a movie has post-credit scenes. Community-driven and free.',
      url: `${SITE_URL}/${locale}`,
      locale: isPt ? 'pt_BR' : 'en_US',
      alternateLocale: [isPt ? 'en_US' : 'pt_BR'],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const isPt = locale === 'pt-BR';

  const [dict, initialMovies] = await Promise.all([getDictionary(locale), getMovies()]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EsperaAí',
    url: SITE_URL,
    description: isPt
      ? 'Descubra se um filme tem cena pós-crédito. Colaborativo e gratuito.'
      : 'Find out if a movie has post-credit scenes. Community-driven and free.',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeScreen dict={dict} lang={locale} initialMovies={initialMovies} />
    </>
  );
}
