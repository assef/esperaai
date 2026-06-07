import { getDictionary, hasLocale } from '@/lib/dictionaries';
import { getMovies } from '@/lib/movies';
import { notFound } from 'next/navigation';
import { HomeScreen } from './HomeScreen';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, movies] = await Promise.all([getDictionary(lang), getMovies()]);
  return <HomeScreen dict={dict} lang={lang} movies={movies} />;
}
