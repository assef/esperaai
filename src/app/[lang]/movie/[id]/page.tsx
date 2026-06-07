import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovie, getMovies } from '@/lib/movies';
import { notFound } from 'next/navigation';
import { MovieDetailScreen } from './MovieDetailScreen';
import type { Locale } from '@/lib/types';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateStaticParams() {
  const movies = await getMovies();
  const locales: Locale[] = ['pt-BR', 'en-US'];
  return locales.flatMap((lang) => movies.map((m) => ({ lang, id: m.id })));
}

export async function generateMetadata({ params }: Props) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return {};
  const movie = await getMovie(id);
  if (!movie) return {};
  return {
    title: `${movie.title[lang as Locale]} — Tem cena pós-crédito? | Espera aí`,
    description: `Descubra se ${movie.title[lang as Locale]} tem cena pós-crédito. Informado pela comunidade.`,
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, movie] = await Promise.all([getDictionary(lang), getMovie(id)]);
  if (!movie) notFound();
  return <MovieDetailScreen dict={dict} lang={lang} movie={movie} />;
}
