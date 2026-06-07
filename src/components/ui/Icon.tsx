interface IconProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

const defaults = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SearchIcon({ size = 22, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2.1">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

export function BackIcon({ size = 22, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2.4">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function CloseIcon({ size = 22, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2.4">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon({ size = 22, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2.6">
      <path d="M4 12.5l5 5 11-12" />
    </svg>
  );
}

export function StarIcon({ size = 16, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} fill="currentColor">
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.9 6.1 20.3l1.3-6.5L2.5 9.3l6.6-.8z" />
    </svg>
  );
}

export function ClockIcon({ size = 16, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function UsersIcon({ size = 16, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2">
      <path d="M16 19v-1.5A3.5 3.5 0 0012.5 14h-5A3.5 3.5 0 004 17.5V19" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M19.5 19v-1.2a3 3 0 00-2.3-2.9M15.5 5.2a3 3 0 010 5.6" />
    </svg>
  );
}

export function SunIcon({ size = 18, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
    </svg>
  );
}

export function MoonIcon({ size = 18, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} fill="currentColor">
      <path d="M20 14.5A8 8 0 019.5 4 7 7 0 1020 14.5z" />
    </svg>
  );
}

export function MinusIcon({ size = 24, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2.6">
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon({ size = 24, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2.6">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function EditIcon({ size = 18, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} {...defaults} strokeWidth="2">
      <path d="M4 20h4l10.5-10.5a2 2 0 00-2.8-2.8L5 17v3z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

export function SparkIcon({ size = 18, className, 'aria-hidden': ariaHidden = true }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden={ariaHidden} className={className} fill="currentColor">
      <path d="M12 2l1.8 6.3L20 10l-6.2 1.7L12 18l-1.8-6.3L4 10l6.2-1.7z" />
    </svg>
  );
}
