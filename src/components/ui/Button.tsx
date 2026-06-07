import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  block?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', block = false, style, children, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    padding: '0 22px',
    borderRadius: 14,
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    fontSize: 16,
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'var(--accent)',
          color: 'var(--accent-ink)',
          boxShadow: '0 8px 20px color-mix(in oklab, var(--accent) 35%, transparent)',
        }
      : {
          background: 'var(--bg-elev)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          height: 50,
          fontSize: 15,
          fontWeight: 600,
        };

  return (
    <button style={{ ...base, ...variantStyle, ...style }} {...props}>
      {children}
    </button>
  );
}
