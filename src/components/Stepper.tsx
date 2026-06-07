import { MinusIcon, PlusIcon } from './ui/Icon';

interface StepperProps {
  id: string;
  label: string;
  desc: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ id, label, desc, value, onChange, min = 0, max = 5 }: StepperProps) {
  const decId = `${id}-dec`;
  const incId = `${id}-inc`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }}>
      <div style={{ flex: 1 }} id={id}>
        <div style={{ fontWeight: 700, fontSize: 15.5 }}>{label}</div>
        <div style={{ color: 'var(--faint)', fontSize: 12.5, marginTop: 2, fontWeight: 500 }}>
          {desc}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} role="group" aria-labelledby={id}>
        <button
          id={decId}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Diminuir ${label}`}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'var(--bg-elev2)',
            border: '1px solid var(--border)',
            color: value <= min ? 'var(--faint)' : 'var(--text)',
            display: 'grid',
            placeItems: 'center',
            opacity: value <= min ? 0.5 : 1,
          }}
        >
          <MinusIcon size={22} />
        </button>

        <div
          aria-live="polite"
          aria-label={`${value} ${label}`}
          style={{
            width: 30,
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 26,
          }}
        >
          {value}
        </div>

        <button
          id={incId}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Aumentar ${label}`}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'var(--bg-elev2)',
            border: '1px solid var(--border)',
            color: value >= max ? 'var(--faint)' : 'var(--text)',
            display: 'grid',
            placeItems: 'center',
            opacity: value >= max ? 0.5 : 1,
          }}
        >
          <PlusIcon size={22} />
        </button>
      </div>
    </div>
  );
}
