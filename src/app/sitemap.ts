import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getAllMoviesForSitemap } from '@/lib/movies';

const LOCALES = ['pt-BR', 'en-US'] as const;

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getAllMoviesForSitemap();

  const homePages: MetadataRoute.Sitemap = LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
    alternates: {
      languages: {
        'pt-BR': `${SITE_URL}/pt-BR`,
        'en-US': `${SITE_URL}/en-US`,
        'x-default': `${SITE_URL}/pt-BR`,
      },
    },
  }));

  const moviePages: MetadataRoute.Sitemap = movies.flatMap((m) => [
    {
      url: `${SITE_URL}/pt-BR/movie/${m.id}/${m.ptSlug}`,
      lastModified: m.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          'pt-BR': `${SITE_URL}/pt-BR/movie/${m.id}/${m.ptSlug}`,
          'en-US': `${SITE_URL}/en-US/movie/${m.id}/${m.enSlug}`,
          'x-default': `${SITE_URL}/pt-BR/movie/${m.id}/${m.ptSlug}`,
        },
      },
    },
    {
      url: `${SITE_URL}/en-US/movie/${m.id}/${m.enSlug}`,
      lastModified: m.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          'pt-BR': `${SITE_URL}/pt-BR/movie/${m.id}/${m.ptSlug}`,
          'en-US': `${SITE_URL}/en-US/movie/${m.id}/${m.enSlug}`,
          'x-default': `${SITE_URL}/pt-BR/movie/${m.id}/${m.ptSlug}`,
        },
      },
    },
  ]);

  return [...homePages, ...moviePages];
}
