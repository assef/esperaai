'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Wordmark } from './ui/Wordmark';
import { SunIcon, MoonIcon } from './ui/Icon';
import { useTheme } from '@/contexts/ThemeContext';
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
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 4,
      }}
    >
      <div>
        <Wordmark />
        <div style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500, marginTop: 3 }}>
          {dict.tagline}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          role="group"
          aria-label="Idioma / Language"
          style={{
            display: 'flex',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 11,
            padding: 2,
          }}
        >
          {LOCALES.map((l) => (
            <button
              key={l.value}
              onClick={() => switchLang(l.value)}
              aria-pressed={lang === l.value}
              aria-label={l.value}
              style={{
                border: 'none',
                cursor: 'pointer',
                borderRadius: 9,
                padding: '6px 9px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                fontSize: 12,
                background: lang === l.value ? 'var(--accent)' : 'transparent',
                color: lang === l.value ? 'var(--accent-ink)' : 'var(--muted)',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            cursor: 'pointer',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={17} />}
        </button>
      </div>
    </header>
  );
}
