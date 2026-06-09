'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Wordmark } from './ui/Wordmark';
import { SunIcon, MoonIcon } from './ui/Icon';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const switchLang = (newLang: Locale) => {
    const newPath = pathname.replace(/^\/(pt-BR|en-US)/, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <header className={styles.header}>
      <div>
        <Wordmark />
        <div className={styles.tagline}>{dict.tagline}</div>
      </div>

      <div className={styles.controls}>
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

        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={styles.themeBtn}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={17} />}
        </button>
      </div>
    </header>
  );
}
