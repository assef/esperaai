export function Wordmark() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}
      aria-label="Espera aí"
    >
      Espera{' '}
      <span style={{ color: 'var(--accent)' }}>aí</span>
    </div>
  );
}
