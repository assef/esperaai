import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getMovie } from '@/lib/movies';
import { SITE_URL } from '@/lib/site';
import { computeConsensus, worthVerdict } from '@/lib/consensus';
import type { Locale } from '@/lib/types';

export const alt = 'Post-credit scene info';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const locale = (['pt-BR', 'en-US'].includes(lang) ? lang : 'pt-BR') as Locale;
  const isPt = locale === 'pt-BR';

  const [movie, font] = await Promise.all([
    getMovie(id),
    readFile(join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.ttf')),
  ]);

  if (!movie) {
    return new ImageResponse(
      <div
        style={{ width: '100%', height: '100%', background: '#0e0c0a', display: 'flex' }}
      />,
      size,
    );
  }

  const consensus = computeConsensus(movie.reports);
  const verdict = worthVerdict(movie.worth);
  const posterPath = movie.posterPath[locale] ?? movie.posterPath['pt-BR'];
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w342${posterPath}`
    : null;

  const hasScenes = consensus.hasData && consensus.total > 0;
  const answerText = !consensus.hasData
    ? isPt ? 'Vote agora' : 'Vote now'
    : consensus.total === 0
    ? isPt ? 'PODE SAIR' : 'YOU CAN GO'
    : isPt ? 'ESPERE' : 'WAIT';

  const answerColor = hasScenes ? '#e93954' : consensus.hasData ? '#f6f5f2' : '#74716e';
  const answerBg = hasScenes ? '#1a0608' : '#191714';
  const answerBorder = hasScenes ? '#4a1018' : '#36322f';

  const scenesLine = hasScenes
    ? `${consensus.total} ${
        consensus.total === 1
          ? isPt ? 'cena pós-crédito' : 'post-credit scene'
          : isPt ? 'cenas pós-crédito' : 'post-credit scenes'
      }`
    : null;

  const worthLine =
    verdict === true
      ? isPt ? 'Vale a pena esperar' : 'Worth the wait'
      : verdict === false
      ? isPt ? 'Dá pra pular' : 'Fine to skip'
      : null;

  const titleFontSize = movie.title[locale].length > 28 ? '40px' : movie.title[locale].length > 18 ? '48px' : '56px';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0e0c0a',
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            style={{ width: '280px', height: '100%', objectFit: 'cover', flexShrink: 0 }}
            alt=""
          />
        ) : (
          <div
            style={{
              width: '280px',
              height: '100%',
              flexShrink: 0,
              background: '#191714',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
            }}
          >
            🎬
          </div>
        )}

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 52px',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontFamily: 'SpaceGrotesk',
              fontWeight: 700,
              fontSize: titleFontSize,
              color: '#f6f5f2',
              letterSpacing: '-0.025em',
              lineHeight: 1.06,
            }}
          >
            {movie.title[locale]}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'SpaceGrotesk',
              fontWeight: 700,
              fontSize: '20px',
              color: '#74716e',
            }}
          >
            <span>{movie.year}</span>
            {movie.rating > 0 && (
              <>
                <span>·</span>
                <span style={{ color: '#a7a4a0' }}>★ {movie.rating.toFixed(1)}</span>
              </>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '8px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '11px 22px',
                borderRadius: '14px',
                background: answerBg,
                border: `1px solid ${answerBorder}`,
                fontFamily: 'SpaceGrotesk',
                fontWeight: 700,
                fontSize: '32px',
                color: answerColor,
                letterSpacing: '-0.02em',
              }}
            >
              {answerText}
            </div>

            {(scenesLine || worthLine) && (
              <div
                style={{
                  fontFamily: 'SpaceGrotesk',
                  fontWeight: 700,
                  fontSize: '17px',
                  color: '#74716e',
                }}
              >
                {[scenesLine, worthLine].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 'auto',
              fontFamily: 'SpaceGrotesk',
              fontWeight: 700,
              fontSize: '15px',
              color: '#3d3a37',
              letterSpacing: '0.04em',
            }}
          >
            {SITE_URL.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'SpaceGrotesk', data: font, style: 'normal', weight: 700 }],
    },
  );
}
