import { useId, type ReactNode } from 'react';
import type { QuestionType, SessionConfig } from '../types';
import { QUESTION_TYPE_LABELS } from '../lib/labels';
import { SegmentedControl } from './SegmentedControl';
import { Button } from './Button';
import { ArrowRightIcon } from './icons';

interface SessionConfigPanelProps {
  config: SessionConfig;
  onChange: (patch: Partial<SessionConfig>) => void;
  available: number;
  onStart: () => void;
  types: QuestionType[];
  activeTag?: string | null;
  onClearTag?: () => void;
  startLabel?: string;
  /** Selectores propios de la página (temas y etiquetas del modo mixto). */
  children?: ReactNode;
}

export const QUESTION_TYPE_ORDER: QuestionType[] = [
  'concept',
  'identify-pattern',
  'find-violation',
  'choose-fix',
];

export function SessionConfigPanel({
  config,
  onChange,
  available,
  onStart,
  types,
  activeTag,
  onClearTag,
  startLabel = 'Empezar',
  children,
}: SessionConfigPanelProps) {
  const typeId = useId();
  const canStart = available > 0;

  return (
    <section
      aria-labelledby="config-title"
      className="rounded-xl border border-rule bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0_/0.04)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="config-title" className="font-serif text-[17px] font-semibold text-ink">
          Configurar sesión
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
          {available} disp.
        </span>
      </div>

      {children ? <div className="mt-5">{children}</div> : null}

      <div className="mt-5 space-y-5">
        <SegmentedControl
          legend="Cantidad de preguntas"
          value={config.count}
          onChange={(count) => onChange({ count })}
          options={[
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 'all', label: 'Todas' },
          ]}
        />

        <div>
          <label
            htmlFor={typeId}
            className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3"
          >
            Tipo de ejercicio
          </label>
          <div className="relative">
            <select
              id={typeId}
              value={config.type}
              onChange={(event) =>
                onChange({ type: event.target.value as SessionConfig['type'] })
              }
              className="min-h-10 w-full appearance-none rounded-md border border-rule-strong bg-surface pl-3 pr-9 text-[13.5px] text-ink transition-colors duration-150 hover:border-ink-3"
            >
              <option value="all">Todos los tipos</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
            >
              <path d="m6 8 4 4 4-4" />
            </svg>
          </div>
        </div>

        <SegmentedControl
          legend="Lenguaje del código"
          value={config.lang}
          onChange={(lang) => onChange({ lang })}
          options={[
            { value: 'both', label: 'Ambos' },
            { value: 'java', label: 'Java' },
            { value: 'tsx', label: 'React' },
          ]}
          hint="Las preguntas conceptuales no dependen del lenguaje."
        />

        <SegmentedControl
          legend="Dificultad"
          value={config.difficulty}
          onChange={(difficulty) => onChange({ difficulty })}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 1, label: 'Básica' },
            { value: 2, label: 'Media' },
            { value: 3, label: 'Difícil' },
          ]}
        />

        <SegmentedControl
          legend="Orden"
          value={config.order}
          onChange={(order) => onChange({ order })}
          options={[
            { value: 'random', label: 'Aleatorio' },
            { value: 'fixed', label: 'Fijo' },
          ]}
        />
      </div>

      {activeTag ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-accent/30 bg-accent-soft px-3 py-2">
          <p className="min-w-0 text-[12.5px] text-ink">
            <span className="text-ink-2">Etiqueta: </span>
            <span className="font-medium">{activeTag}</span>
          </p>
          {onClearTag ? (
            <button
              type="button"
              onClick={onClearTag}
              className="shrink-0 text-[12px] text-ink-2 underline decoration-rule-strong underline-offset-2 hover:text-ink"
            >
              quitar
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 border-t border-rule pt-5">
        <Button
          size="lg"
          onClick={onStart}
          disabled={!canStart}
          className="w-full"
          aria-describedby="config-availability"
        >
          {startLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <p
          id="config-availability"
          className={`mt-2 text-center text-[11.5px] ${canStart ? 'text-ink-3' : 'text-bad'}`}
        >
          {canStart
            ? `${Math.min(
                available,
                config.count === 'all' ? available : config.count,
              )} preguntas en esta sesión`
            : 'No hay preguntas con esta combinación. Probá quitar filtros.'}
        </p>
      </div>
    </section>
  );
}
