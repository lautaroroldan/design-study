import type { Lang, SessionQuestion } from '../types';
import {
  DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  TOPIC_SHORT_LABELS,
} from '../lib/labels';
import { CodeViewer } from './CodeViewer';
import { OptionList, optionLetter } from './OptionList';
import { Button } from './Button';
import { ArrowRightIcon, CheckIcon, CrossIcon } from './icons';

interface QuestionCardProps {
  item: SessionQuestion;
  index: number;
  total: number;
  selectedOptionId: string | null;
  revealed: boolean;
  isLast: boolean;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  /** Lenguaje por defecto según el filtro de la sesión. */
  defaultLang?: Lang;
}

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="flex items-center gap-1" title={`Dificultad: ${DIFFICULTY_LABELS[level]}`}>
      <span className="sr-only">Dificultad: {DIFFICULTY_LABELS[level]}</span>
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-[1px] ${
            step <= level ? 'bg-ink-2' : 'bg-rule-strong'
          }`}
        />
      ))}
    </span>
  );
}

export function QuestionCard({
  item,
  index,
  total,
  selectedOptionId,
  revealed,
  isLast,
  onSelect,
  onNext,
  defaultLang,
}: QuestionCardProps) {
  const { question, options } = item;
  const isCorrect = selectedOptionId === question.correctOptionId;
  const correctOption = options.find((option) => option.id === question.correctOptionId);
  const correctIndex = options.findIndex((option) => option.id === question.correctOptionId);

  const distractors = options.filter(
    (option) =>
      option.id !== question.correctOptionId && question.optionExplanations?.[option.id],
  );

  return (
    <article className="fade-up rounded-xl border border-rule bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0_/0.04)] sm:p-7">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
        <span className="tabular">
          Ficha {String(index + 1).padStart(2, '0')}
        </span>
        <span aria-hidden="true">/</span>
        <span className="tabular">{String(total).padStart(2, '0')}</span>
        <span aria-hidden="true" className="text-rule-strong">
          ·
        </span>
        <span>{TOPIC_SHORT_LABELS[question.topic]}</span>
        <span aria-hidden="true" className="text-rule-strong">
          ·
        </span>
        <span>{QUESTION_TYPE_LABELS[question.type]}</span>
        {/* La etiqueta es la respuesta en la mayoría de los ejercicios: recién se muestra al responder. */}
        {revealed ? (
          <>
            <span aria-hidden="true" className="text-rule-strong">
              ·
            </span>
            <span className="text-ink-2">{question.tag}</span>
          </>
        ) : null}
        <span className="ml-auto">
          <DifficultyDots level={question.difficulty} />
        </span>
      </div>

      <h2 className="mt-3 font-serif text-xl leading-snug text-ink sm:text-[23px]">
        {question.prompt}
      </h2>

      {question.code ? (
        <div className="mt-4">
          <CodeViewer question={question} defaultLang={defaultLang} revealed={revealed} />
        </div>
      ) : null}

      <OptionList
        options={options}
        selectedId={selectedOptionId}
        correctId={question.correctOptionId}
        revealed={revealed}
        onSelect={onSelect}
      />

      <div aria-live="polite">
        {revealed ? (
          <section className="fade-up mt-6 border-t border-rule pt-5">
            <p
              className={`flex items-center gap-2 text-sm font-semibold ${
                isCorrect ? 'text-good' : 'text-bad'
              }`}
            >
              {isCorrect ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CrossIcon className="h-4 w-4" />
              )}
              {isCorrect ? 'Respuesta correcta' : 'No era esa'}
            </p>

            {!isCorrect && correctOption ? (
              <p className="mt-2 text-[13.5px] text-ink-2">
                La correcta era{' '}
                <span className="font-mono text-[12px] text-ink">
                  {optionLetter(correctIndex)}
                </span>{' '}
                · <span className="font-medium text-ink">{correctOption.text}</span>.
              </p>
            ) : null}

            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
              {question.explanation}
            </p>

            {distractors.length > 0 ? (
              <dl className="mt-4 max-w-[68ch] space-y-2 border-l border-rule pl-4">
                {distractors.map((option) => {
                  const optionIndex = options.findIndex(
                    (candidate) => candidate.id === option.id,
                  );

                  return (
                    <div key={option.id}>
                      <dt className="text-[12.5px] font-medium text-ink">
                        <span className="mr-1.5 font-mono text-[11px] text-ink-3">
                          {optionLetter(optionIndex)}
                        </span>
                        {option.text}
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-relaxed text-ink-2">
                        {question.optionExplanations?.[option.id]}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}

            <div className="mt-6 flex items-center justify-end">
              <Button size="lg" onClick={onNext} autoFocus>
                {isLast ? 'Ver resultados' : 'Siguiente'}
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
