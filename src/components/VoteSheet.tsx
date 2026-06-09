'use client';

import { useEffect, useRef, useState } from 'react';
import { Stepper } from './Stepper';
import { Button } from './ui/Button';
import { CheckIcon } from './ui/Icon';
import styles from './VoteSheet.module.css';
import type { T } from '@/lib/format';

interface VoteSheetProps {
  t: T;
  movieTitle: string;
  onClose: () => void;
  onSubmit: (payload: { total: number; worth: boolean | null }) => void;
}

export function VoteSheet({ t, movieTitle, onClose, onSubmit }: VoteSheetProps) {
  const [total, setTotal] = useState(0);
  const [worth, setWorth] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    closeBtnRef.current?.focus();
    return () => {
      (triggerRef.current as HTMLElement)?.focus?.();
    };
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, done]);

  const submit = () => {
    onSubmit({ total, worth });
    setDone(true);
    setTimeout(onClose, 1300);
  };

  return (
    <div className={`${styles.overlay} ${desktop ? styles.overlayDesktop : ''}`}>
      <div
        onClick={onClose}
        aria-hidden
        className={`animate-fade-in ${styles.backdrop}`}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-sheet-title"
        className={`${desktop ? 'animate-modal-in' : 'animate-sheet-up'} noscroll ${styles.sheet} ${desktop ? styles.sheetDesktop : ''}`}
      >
        {!desktop && <div aria-hidden className={styles.handle} />}

        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label={t.cancel}
          className={styles.closeBtn}
        >
          ✕
        </button>

        {done ? (
          <div className={`animate-pop-in ${styles.doneWrap}`}>
            <div className={styles.doneIcon}>
              <CheckIcon size={34} />
            </div>
            <div className={styles.doneTitle}>{t.thanksTitle}</div>
            <div className={styles.doneSub}>{t.thanksSub}</div>
          </div>
        ) : (
          <>
            <h2
              id="vote-sheet-title"
              className={`${styles.title} ${desktop ? styles.titleDesktop : ''}`}
            >
              {t.voteTitle}
            </h2>
            <p className={styles.sub}>{t.voteSub}</p>

            <div className={styles.steppers}>
              <Stepper id="total" label={t.totalQ} desc={t.totalDesc} value={total} onChange={setTotal} />
            </div>

            {total > 0 && (
              <div className={styles.worthWrap}>
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend className={styles.worthLegend}>{t.worthQ}</legend>
                  <div className={styles.worthBtns}>
                    {([true, false] as const).map((v) => {
                      const label = v ? t.worthYes : t.worthNo;
                      const selected = worth === v;
                      return (
                        <button
                          key={String(v)}
                          onClick={() => setWorth(worth === v ? null : v)}
                          aria-pressed={selected}
                          className={`${styles.worthBtn} ${selected ? styles.worthBtnSelected : ''}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            )}

            <Button block style={{ marginTop: 20 }} onClick={submit}>
              {t.submit}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
