'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main>
      <div className="home-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: '0 0 12px' }}>
          Algo deu errado
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 20px' }}>
          Tente novamente ou volte mais tarde.
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
    </main>
  );
}
