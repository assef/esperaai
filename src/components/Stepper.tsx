import { MinusIcon, PlusIcon } from './ui/Icon';
import styles from './Stepper.module.css';

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
  return (
    <div className={styles.row}>
      <div className={styles.labelCol} id={id}>
        <div className={styles.labelText}>{label}</div>
        <div className={styles.desc}>{desc}</div>
      </div>

      <div className={styles.controls} role="group" aria-labelledby={id}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Diminuir ${label}`}
          className={`${styles.btn} ${value <= min ? styles.btnDisabled : styles.btnActive}`}
        >
          <MinusIcon size={22} />
        </button>

        <div
          aria-live="polite"
          aria-label={`${value} ${label}`}
          className={styles.value}
        >
          {value}
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Aumentar ${label}`}
          className={`${styles.btn} ${value >= max ? styles.btnDisabled : styles.btnActive}`}
        >
          <PlusIcon size={22} />
        </button>
      </div>
    </div>
  );
}
