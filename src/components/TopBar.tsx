'use client';

import { usePathname, useRouter } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';
import { Wordmark } from './ui/Wordmark';
import styles from './TopBar.module.css';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/types';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'pt-BR', label: 'PT' },
  { value: 'en-US', label: 'EN' },
];

interface TopBarProps {
  dict: Dictionary;
  lang: Locale;
}

export function TopBar({ dict, lang }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLang = (newLang: Locale) => {
    if (newLang === lang) return;
    sendGAEvent('event', 'language_switch', { from: lang, to: newLang });
    const newPath = pathname.replace(/^\/(pt-BR|en-US)/, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <header className={styles.header}>
      <div>
        <Wordmark />
        <div className={styles.tagline}>{dict.tagline}</div>
      </div>

      <div
        role="group"
        aria-label="Idioma / Language"
        className={styles.langGroup}
      >
        {LOCALES.map((l) => (
          <button
            key={l.value}
            onClick={() => switchLang(l.value)}
            aria-pressed={lang === l.value}
            aria-label={l.value}
            className={`${styles.langBtn} ${lang === l.value ? styles.langActive : styles.langInactive}`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}
