import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovie } from '@/lib/movies';
import { notFound } from 'next/navigation';
import { MovieDetailScreen } from './MovieDetailScreen';
import type { Locale } from '@/lib/types';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const movie = await getMovie(id);
  if (!movie) return {};
  const locale = lang as Locale;
  return {
    title: `${movie.title[locale]} — Tem cena pós-crédito? | Espera aí`,
    description: `Descubra se ${movie.title[locale]} tem cena pós-crédito. Informado pela comunidade.`,
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, movie] = await Promise.all([getDictionary(lang), getMovie(id)]);
  if (!movie) notFound();
  return <MovieDetailScreen dict={dict} lang={lang as Locale} movie={movie} />;
}
