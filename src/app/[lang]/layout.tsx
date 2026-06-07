import { hasLocale } from '@/lib/dictionaries';
import { notFound } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return [{ lang: 'pt-BR' }, { lang: 'en-US' }];
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('lang','${lang}')`,
        }}
      />
      {children}
    </>
  );
}
