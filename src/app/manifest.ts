import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EsperaAí — Tem cena pós-crédito?',
    short_name: 'EsperaAí',
    description:
      'Descubra se um filme tem cena pós-crédito. Colaborativo e gratuito.',
    start_url: '/pt-BR',
    display: 'standalone',
    background_color: '#0e0c0a',
    theme_color: '#0e0c0a',
    orientation: 'portrait',
    lang: 'pt-BR',
    categories: ['entertainment', 'movies'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [],
  };
}
