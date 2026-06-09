import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  block?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', block = false, className, style, children, ...props }: ButtonProps) {
  const cls = [
    styles.btn,
    variant === 'primary' ? styles.primary : styles.ghost,
    block ? styles.block : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} style={style} {...props}>
      {children}
    </button>
  );
}
