'use client';

import { useEffect, useRef, useState } from 'react';
import { Stepper } from './Stepper';
import { Button } from './ui/Button';
import { CheckIcon } from './ui/Icon';
import type { T } from '@/lib/format';

interface VoteSheetProps {
  t: T;
  movieTitle: string;
  onClose: () => void;
  onSubmit: (payload: { mid: number; post: number; worth: boolean | null }) => void;
}

export function VoteSheet({ t, movieTitle, onClose, onSubmit }: VoteSheetProps) {
  const [mid, setMid] = useState(0);
  const [post, setPost] = useState(0);
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
    onSubmit({ mid, post, worth });
    setDone(true);
    setTimeout(onClose, 1300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: desktop ? undefined : 'column',
        justifyContent: desktop ? 'center' : 'flex-end',
        alignItems: desktop ? 'center' : undefined,
        padding: desktop ? 24 : undefined,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className="animate-fade-in"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
        }}
      />

      {/* Sheet / Modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-sheet-title"
        className={desktop ? 'animate-modal-in noscroll' : 'animate-sheet-up noscroll'}
        style={{
          position: 'relative',
          background: 'var(--bg)',
          borderRadius: desktop ? 22 : '26px 26px 0 0',
          padding: '10px 22px 36px',
          maxHeight: '88svh',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
          width: desktop ? 460 : undefined,
        }}
      >
        {/* Drag handle — mobile only */}
        {!desktop && (
          <div
            aria-hidden
            style={{
              width: 40,
              height: 5,
              borderRadius: 99,
              background: 'var(--border)',
              margin: '6px auto 16px',
            }}
          />
        )}

        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label={t.cancel}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'var(--bg-elev2)',
            border: '1px solid var(--border)',
            borderRadius: 99,
            width: 32,
            height: 32,
            display: 'grid',
            placeItems: 'center',
            color: 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {done ? (
          <div className="animate-pop-in" style={{ textAlign: 'center', padding: '24px 0 30px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                margin: '0 auto 16px',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--accent)',
                color: 'var(--accent-ink)',
              }}
            >
              <CheckIcon size={34} />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 22,
              }}
            >
              {t.thanksTitle}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14.5, marginTop: 8 }}>
              {t.thanksSub}
            </div>
          </div>
        ) : (
          <>
            <h2
              id="vote-sheet-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 21,
                letterSpacing: '-0.02em',
                margin: desktop ? '8px 0 0' : 0,
              }}
            >
              {t.voteTitle}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 6, marginBottom: 0 }}>
              {t.voteSub}
            </p>

            <div style={{ marginTop: 12, borderTop: '1px solid var(--hairline)' }}>
              <Stepper id="mid" label={t.midQ} desc={t.midDesc} value={mid} onChange={setMid} />
              <div style={{ height: 1, background: 'var(--hairline)' }} />
              <Stepper id="post" label={t.postQ} desc={t.postDesc} value={post} onChange={setPost} />
            </div>

            {(mid + post) > 0 && (
              <div style={{ marginTop: 16 }}>
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 9 }}>
                    {t.worthQ}
                  </legend>
                  <div style={{ display: 'flex', gap: 9 }}>
                    {([true, false] as const).map((v) => {
                      const label = v ? t.worthYes : t.worthNo;
                      const selected = worth === v;
                      return (
                        <button
                          key={String(v)}
                          onClick={() => setWorth(worth === v ? null : v)}
                          aria-pressed={selected}
                          style={{
                            flex: 1,
                            height: 46,
                            borderRadius: 12,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-ui)',
                            fontWeight: 700,
                            fontSize: 14.5,
                            background: selected ? 'var(--accent-soft)' : 'var(--bg-elev)',
                            border: selected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                            color: selected ? 'var(--text)' : 'var(--muted)',
                            transition: 'background 0.15s ease, border-color 0.15s ease',
                          }}
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
