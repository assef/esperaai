import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://esperaai.com",
  ),
  title: {
    template: "%s | Espera aí",
    default: "Espera aí — Tem cena pós-crédito?",
  },
  description:
    "Descubra se um filme tem cena pós-crédito. Sem spoilers, pela comunidade.",
  keywords: [
    "cena pós-crédito",
    "post credit scene",
    "stinger",
    "cena depois dos créditos",
    "vale a pena esperar os créditos",
    "post credit scenes",
    "cinema",
    "filmes",
  ],
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
  },
  appleWebApp: {
    title: 'EsperaAí',
    statusBarStyle: 'default',
  },
  openGraph: {
    siteName: "EsperaAí",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#222018" },
    { media: "(prefers-color-scheme: light)", color: "#f8f7f5" },
  ],
};

// Set <html lang> to match the locale before first paint, avoiding a flash.
const langScript = `(function(){try{var m=location.pathname.match(/^\\/(pt-BR|en-US)/);if(m)document.documentElement.lang=m[1];}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
        <meta name="google-adsense-account" content="ca-pub-4812736287777658" />
      </head>
      <body className="min-h-full">
        {children}
        <GoogleAnalytics gaId="G-7L3ZS3SY2Q" />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4812736287777658"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
