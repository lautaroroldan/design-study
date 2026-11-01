import { useId } from 'react';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  title?: string;
}

interface SegmentedControlProps<T extends string | number> {
  legend: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  hint?: string;
}

/**
 * Grupo de radios nativo (flechas del teclado incluidas) con estética segmentada.
 * Uso radios reales para no perder teclado, foco ni semántica.
 */
export function SegmentedControl<T extends string | number>({
  legend,
  value,
  options,
  onChange,
  hint,
}: SegmentedControlProps<T>) {
  const name = useId();

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3">
        {legend}
      </legend>

      <div className="inline-flex w-full flex-wrap gap-1 rounded-lg border border-rule bg-inset p-1">
        {options.map((option) => {
          const checked = option.value === value;

          return (
            <label
              key={String(option.value)}
              title={option.title}
              className={`min-w-0 flex-1 ${
                option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                className={`flex min-h-10 items-center justify-center rounded-md px-2 text-[13px] leading-tight text-ink-2 transition-colors duration-150 hover:text-ink peer-checked:bg-surface peer-checked:font-medium peer-checked:text-ink peer-checked:shadow-[0_0_0_1px_var(--rule)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                  option.disabled ? 'opacity-40' : ''
                }`}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      {hint ? <p className="mt-2 text-xs text-ink-3">{hint}</p> : null}
    </fieldset>
  );
}
