'use client';

import { SearchIcon, CloseIcon } from './ui/Icon';
import type { T } from '@/lib/format';

interface SearchFieldProps {
  t: T;
  value: string;
  onChange: (v: string) => void;
}

export function SearchField({ t, value, onChange }: SearchFieldProps) {
  return (
    <div
      className="search-wrapper"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        height: 54,
        padding: '0 16px',
        borderRadius: 16,
        background: 'var(--bg-elev)',
        border: '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--faint)', display: 'inline-flex', flexShrink: 0 }} aria-hidden>
        <SearchIcon size={21} />
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label={t.searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: 'var(--text)',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: 16.5,
          minWidth: 0,
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          style={{
            border: 'none',
            background: 'var(--bg-elev2)',
            color: 'var(--muted)',
            cursor: 'pointer',
            width: 26,
            height: 26,
            borderRadius: 99,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <CloseIcon size={15} />
        </button>
      )}
    </div>
  );
}
