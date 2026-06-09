import { hasLocale } from '@/lib/dictionaries';
import { getMovie } from '@/lib/movies';
import { slugify } from '@/lib/slug';
import { notFound, redirect } from 'next/navigation';
import type { Locale } from '@/lib/types';

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function MovieRedirectPage({ params }: Props) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const movie = await getMovie(id);
  if (!movie) notFound();
  redirect(`/${lang}/movie/${id}/${slugify(movie.title[lang as Locale])}`);
}
