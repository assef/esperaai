import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE_URL } from '@/lib/site';

export const alt = 'Espera aí — Tem cena pós-crédito?';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isPt = lang === 'pt-BR';

  const font = await readFile(
    join(process.cwd(), 'public/fonts/SpaceGrotesk-Bold.ttf'),
  );

  const headline = isPt ? 'Espera aí?' : 'Should I wait?';
  const sub = isPt
    ? 'Tem cena pós-crédito?\nInformado pela comunidade.'
    : 'Post-credit scenes?\nTold by the community.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0e0c0a',
          padding: '60px',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '7px',
            borderRadius: '99px',
            background: '#e93954',
          }}
        />
        <div
          style={{
            fontFamily: 'SpaceGrotesk',
            fontWeight: 700,
            fontSize: '96px',
            color: '#f6f5f2',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontFamily: 'SpaceGrotesk',
            fontWeight: 700,
            fontSize: '30px',
            color: '#a7a4a0',
            textAlign: 'center',
            lineHeight: 1.45,
            whiteSpace: 'pre',
          }}
        >
          {sub}
        </div>
        <div
          style={{
            marginTop: '12px',
            padding: '8px 20px',
            borderRadius: '99px',
            background: '#191714',
            border: '1px solid #36322f',
            fontFamily: 'SpaceGrotesk',
            fontWeight: 700,
            fontSize: '17px',
            color: '#74716e',
            letterSpacing: '0.04em',
          }}
        >
          {SITE_URL.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'SpaceGrotesk', data: font, style: 'normal', weight: 700 }],
    },
  );
}
