interface MeterProps {
  value: number;
  max: number;
  label: string;
  tone?: 'accent' | 'good' | 'bad';
}

const tones = {
  accent: 'bg-accent',
  good: 'bg-good',
  bad: 'bg-bad',
};

/** Barra fina, sin decoración: sirve para progreso de sesión y desgloses. */
export function Meter({ value, max, label, tone = 'accent' }: MeterProps) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-[3px] w-full overflow-hidden rounded-full bg-inset-strong"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${tones[tone]}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
