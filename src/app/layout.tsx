import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Hanken_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Espera aí — Tem cena pós-crédito?',
  description: 'Descubra rapidamente se um filme tem cena pós-crédito. Colaborativo e gratuito.',
  keywords: ['cena pós-crédito', 'post credit scene', 'cinema', 'filmes'],
  openGraph: {
    title: 'Espera aí',
    description: 'Tem cena pós-crédito? Descubra antes de sair do cinema.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#222018' },
    { media: '(prefers-color-scheme: light)', color: '#f8f7f5' },
  ],
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('esperaai.theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
    }
    var m = location.pathname.match(/^\\/(pt-BR|en-US)/);
    if (m) document.documentElement.lang = m[1];
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="google-adsense-account" content="ca-pub-4812736287777658"/>
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4812736287777658"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
