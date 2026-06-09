'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="detail-layout">
      <div className="detail-back-bar">
        <Link href="/" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14.5, textDecoration: 'none' }}>
          ← Voltar
        </Link>
      </div>
      <div className="detail-main-col" style={{ textAlign: 'center', paddingTop: 40 }}>
        <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 20px' }}>
          Não foi possível carregar este filme.
        </p>
        <button
          onClick={reset}
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            border: 'none',
            borderRadius: 12,
            padding: '12px 24px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
