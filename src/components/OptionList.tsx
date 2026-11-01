import type { QuestionOption } from '../types';
import { CheckIcon, CrossIcon } from './icons';

interface OptionListProps {
  options: QuestionOption[];
  selectedId: string | null;
  correctId: string;
  revealed: boolean;
  onSelect: (optionId: string) => void;
}

export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function OptionList({
  options,
  selectedId,
  correctId,
  revealed,
  onSelect,
}: OptionListProps) {
  return (
    <ul className="mt-5 space-y-2">
      {options.map((option, index) => {
        const isCorrect = option.id === correctId;
        const isSelected = option.id === selectedId;
        const isWrongChoice = revealed && isSelected && !isCorrect;

        const stateClass = !revealed
          ? 'border-rule bg-surface hover:border-rule-strong hover:bg-inset/60'
          : isCorrect
            ? 'border-good/60 bg-good-soft'
            : isWrongChoice
              ? 'border-bad/60 bg-bad-soft'
              : 'border-rule bg-surface opacity-60';

        return (
          <li key={option.id}>
            <button
              type="button"
              disabled={revealed}
              onClick={() => onSelect(option.id)}
              aria-label={`Opción ${optionLetter(index)}: ${option.text}`}
              className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-[background-color,border-color,color] duration-150 ${stateClass} ${
                revealed ? 'cursor-default' : 'active:scale-[0.995]'
              }`}
            >
              <span
                className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border font-mono text-[11px] ${
                  revealed && isCorrect
                    ? 'border-good/40 bg-good/15 text-good'
                    : isWrongChoice
                      ? 'border-bad/40 bg-bad/15 text-bad'
                      : 'border-rule-strong text-ink-3'
                }`}
                aria-hidden="true"
              >
                {optionLetter(index)}
              </span>

              <span className="min-w-0 flex-1 text-[14.5px] leading-snug text-ink">
                {option.text}
              </span>

              {revealed && isCorrect ? (
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-good">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Correcta
                </span>
              ) : null}

              {isWrongChoice ? (
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-bad">
                  <CrossIcon className="h-3.5 w-3.5" />
                  Tu respuesta
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
