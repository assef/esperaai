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
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [],
  };
}
