'use client';

import { SearchIcon, CloseIcon } from './ui/Icon';
import styles from './SearchField.module.css';
import type { T } from '@/lib/format';

interface SearchFieldProps {
  t: T;
  value: string;
  onChange: (v: string) => void;
}

export function SearchField({ t, value, onChange }: SearchFieldProps) {
  return (
    <div className={`search-wrapper ${styles.wrapper}`}>
      <span className={styles.icon} aria-hidden>
        <SearchIcon size={21} />
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label={t.searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        className={styles.input}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className={styles.clearBtn}
        >
          <CloseIcon size={15} />
        </button>
      )}
    </div>
  );
}
