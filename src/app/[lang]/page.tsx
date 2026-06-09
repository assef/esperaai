import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovies } from '@/lib/movies';
import { notFound } from 'next/navigation';
import { HomeScreen } from './HomeScreen';
import type { Locale } from '@/lib/types';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, initialMovies] = await Promise.all([getDictionary(lang), getMovies()]);
  return <HomeScreen dict={dict} lang={lang as Locale} initialMovies={initialMovies} />;
}
