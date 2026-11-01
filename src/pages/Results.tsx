import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allQuestions, TOPIC_META } from '../content';
import { scoreMessage, summarize } from '../lib/scoring';
import { TOPIC_SHORT_LABELS } from '../lib/labels';
import { useSessionStore } from '../store/session';
import { Button } from '../components/Button';
import { CodeBlock } from '../components/CodeBlock';
import { Meter } from '../components/Meter';
import { optionLetter } from '../components/OptionList';

export function Results() {
  const questions = useSessionStore((state) => state.questions);
  const answers = useSessionStore((state) => state.answers);
  const config = useSessionStore((state) => state.config);
  const start = useSessionStore((state) => state.start);
  const reset = useSessionStore((state) => state.reset);
  const navigate = useNavigate();

  const summary = useMemo(() => summarize(answers, questions), [answers, questions]);
  const percent = Math.round(summary.accuracy * 100);

  const topics = [...new Set(questions.map(({ question }) => question.topic))];
  const topicLabel = topics.map((topic) => TOPIC_SHORT_LABELS[topic]).join(' · ');

  function handleRepeatMistakes() {
    if (summary.mistakes.length === 0) return;

    const mistakeIds = summary.mistakes.map(({ question }) => question.id);
    const created = start(
      {
        topics: [...new Set(summary.mistakes.map(({ question }) => question.topic))],
        tags: [],
        questionIds: mistakeIds,
        count: 'all',
        type: 'all',
        lang: 'both',
        difficulty: 'all',
        order: 'random',
      },
      allQuestions,
    );

    if (created > 0) navigate('/sesion');
  }

  function handleHome() {
    reset();
    navigate('/');
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
        Sesión terminada · {topicLabel}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-2">
        <p className="flex items-baseline gap-1.5">
          <span className="tabular font-serif text-[64px] leading-none tracking-tight text-ink sm:text-[76px]">
            {summary.correct}
          </span>
          <span className="tabular font-mono text-[15px] text-ink-3">
            / {summary.total}
          </span>
        </p>

        <p className="pb-2 text-[13px] leading-relaxed text-ink-2">
          <span className="tabular font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            {percent}% de acierto
          </span>
          <br />
          {scoreMessage(summary.accuracy, summary.total)}
        </p>
      </div>

      <div className="mt-6 flex gap-1" role="img" aria-label={`${summary.correct} de ${summary.total} respuestas correctas`}>
        {answers.map((answer, index) => (
          <span
            key={`${answer.questionId}-${index}`}
            aria-hidden="true"
            className={`h-1.5 flex-1 rounded-[2px] ${
              answer.correct ? 'bg-good' : 'bg-bad'
            }`}
          />
        ))}
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-good" />
          correcta
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 rounded-[2px] bg-bad" />
          incorrecta
        </span>
      </p>

      <div className="mt-10 grid gap-10 border-t border-rule pt-8 sm:grid-cols-2 sm:gap-8">
        <section aria-labelledby="by-topic">
          <h2
            id="by-topic"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3"
          >
            Por tema
          </h2>
          <ul className="mt-4 space-y-3">
            {summary.byTopic.map((row) => (
              <li key={row.key}>
                <p className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="text-ink">{row.label}</span>
                  <span className="tabular font-mono text-[11px] text-ink-3">
                    {row.correct}/{row.total}
                  </span>
                </p>
                <div className="mt-1.5">
                  <Meter
                    value={row.correct}
                    max={row.total}
                    label={`Aciertos en ${row.label}`}
                    tone={row.accuracy >= 0.6 ? 'good' : 'bad'}
                  />
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-rule pt-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                Aciertos
              </dt>
              <dd className="tabular mt-1 font-serif text-[26px] leading-none text-good">
                {summary.correct}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                Errores
              </dt>
              <dd className="tabular mt-1 font-serif text-[26px] leading-none text-bad">
                {summary.wrong}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="by-tag">
          <h2
            id="by-tag"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3"
          >
            Por etiqueta
          </h2>
          <ul className="mt-4 space-y-3">
            {summary.byTag.map((row) => (
              <li key={row.key}>
                <p className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate text-ink">{row.label}</span>
                  <span className="tabular shrink-0 font-mono text-[11px] text-ink-3">
                    {row.correct}/{row.total}
                  </span>
                </p>
                <div className="mt-1.5">
                  <Meter
                    value={row.correct}
                    max={row.total}
                    label={`Aciertos en ${row.label}`}
                    tone={row.accuracy >= 0.6 ? 'good' : 'bad'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="mistakes" className="mt-12 border-t border-rule pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="mistakes" className="font-serif text-[20px] text-ink">
            Para repasar
          </h2>
          <span className="tabular font-mono text-[11px] text-ink-3">
            {summary.mistakes.length}{' '}
            {summary.mistakes.length === 1 ? 'error' : 'errores'}
          </span>
        </div>

        {summary.mistakes.length === 0 ? (
          <p className="mt-3 rounded-lg border border-good/40 bg-good-soft px-4 py-3 text-[13.5px] text-ink">
            Sin errores en esta sesión. Probá subir la dificultad o mezclar etiquetas.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {summary.mistakes.map(({ question, selectedOptionId }, index) => {
              const correctOption = question.options.find(
                (option) => option.id === question.correctOptionId,
              );
              const selectedOption = question.options.find(
                (option) => option.id === selectedOptionId,
              );
              const correctIndex = question.options.findIndex(
                (option) => option.id === question.correctOptionId,
              );
              const selectedIndex = question.options.findIndex(
                (option) => option.id === selectedOptionId,
              );

              return (
                <li
                  key={question.id}
                  className="rounded-lg border border-rule bg-surface p-4 sm:p-5"
                >
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                    <span className="tabular">
                      Error {String(index + 1).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{TOPIC_SHORT_LABELS[question.topic]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-ink-2">{question.tag}</span>
                  </p>

                  <p className="mt-2 font-serif text-[17px] leading-snug text-ink">
                    {question.prompt}
                  </p>

                  {question.code ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-[12px] text-ink-3 underline decoration-rule-strong underline-offset-2 hover:text-ink">
                        Ver el código
                      </summary>
                      <div className="mt-2">
                        <CodeBlock code={question.code} revealed />
                      </div>
                    </details>
                  ) : null}

                  <p className="mt-3 text-[13px] text-bad">
                    Tu respuesta:{' '}
                    <span className="font-mono text-[11.5px]">
                      {optionLetter(selectedIndex)}
                    </span>{' '}
                    · {selectedOption?.text ?? '—'}
                  </p>
                  <p className="mt-1 text-[13px] text-good">
                    Correcta:{' '}
                    <span className="font-mono text-[11.5px]">
                      {optionLetter(correctIndex)}
                    </span>{' '}
                    · {correctOption?.text ?? '—'}
                  </p>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                    {question.explanation}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row">
        {summary.mistakes.length > 0 ? (
          <Button size="lg" onClick={handleRepeatMistakes} className="sm:flex-1">
            Repetir los errores ({summary.mistakes.length})
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => {
              reset();
              const firstTopic = config?.topics[0];
              navigate(firstTopic ? `/${TOPIC_META[firstTopic].slug}` : '/');
            }}
            className="sm:flex-1"
          >
            Practicar otra sesión
          </Button>
        )}

        <Button size="lg" variant="secondary" onClick={handleHome} className="sm:flex-1">
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
