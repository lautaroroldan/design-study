import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Topic } from '../types';
import { TOPICS, TOPIC_META, allQuestions } from '../content';
import { TOPIC_LABELS, TOPIC_SHORT_LABELS } from '../lib/labels';
import {
  byTopic,
  failedQuestions,
  overallStats,
  weakestTags,
} from '../lib/progress';
import { useProgressStore } from '../store/progress';
import { useSessionStore } from '../store/session';
import { Button } from '../components/Button';
import { Meter } from '../components/Meter';
import { MetaLine } from '../components/MetaLine';
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons';

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function Progress() {
  const progress = useProgressStore((state) => state.questions);
  const resetProgress = useProgressStore((state) => state.reset);
  const start = useSessionStore((state) => state.start);
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);

  const overall = overallStats(allQuestions, progress);
  const topics = byTopic(allQuestions, progress);
  const weakest = weakestTags(allQuestions, progress, 5);
  const failed = failedQuestions(allQuestions, progress);

  function practiceTag(tag: string, topic: Topic) {
    const created = start(
      {
        topics: [topic],
        tags: [tag],
        count: 10,
        type: 'all',
        lang: 'both',
        difficulty: 'all',
        order: 'random',
      },
      allQuestions,
    );

    if (created > 0) navigate('/sesion');
  }

  function practiceFailed() {
    if (failed.length === 0) return;

    const topics = TOPICS.filter((topic) =>
      failed.some((question) => question.topic === topic),
    );

    const created = start(
      {
        topics,
        tags: [],
        questionIds: failed.map((question) => question.id),
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

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
      <header className="border-b border-rule pb-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
          Mi progreso
        </p>

        <h1 className="mt-3 font-serif text-[32px] leading-[1.1] tracking-tight text-ink sm:text-[42px]">
          Dónde estás parado.
        </h1>

        <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
          Todo se guarda en este navegador, por pregunta, etiqueta y tema. No hay
          cuentas ni servidores: si cambiás de dispositivo, empezás de cero.
        </p>

        <MetaLine
          className="mt-5"
          items={[
            `${overall.practiced} de ${overall.totalQuestions} preguntas practicadas`,
            `${overall.attempts} intentos`,
            `${percent(overall.accuracy)} de acierto`,
          ]}
        />
      </header>

      {overall.attempts === 0 ? (
        <section className="mt-10 rounded-xl border border-rule bg-surface p-6">
          <h2 className="font-serif text-[20px] text-ink">Todavía no hay datos.</h2>
          <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-2">
            Respondé una sesión y volvé: acá vas a ver tu acierto por tema, las
            etiquetas más débiles y las preguntas que quedaron pendientes.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <Link
                key={topic}
                to={`/${TOPIC_META[topic].slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-rule-strong bg-surface px-3 text-[13px] text-ink transition-colors duration-150 hover:bg-inset"
              >
                {TOPIC_META[topic].title}
                <ArrowRightIcon className="h-3.5 w-3.5 text-ink-3" />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section aria-labelledby="progress-topics" className="mt-10">
            <h2
              id="progress-topics"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3"
            >
              Por tema
            </h2>

            <ul className="mt-4 space-y-5">
              {topics.map((row) => (
                <li key={row.key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-[14px] text-ink">
                      {TOPIC_LABELS[row.key as Topic] ?? row.key}
                    </p>
                    <p className="tabular font-mono text-[11px] text-ink-3">
                      {row.attempts === 0
                        ? 'sin practicar'
                        : `${percent(row.accuracy)} · ${row.practiced}/${row.totalQuestions} practicadas`}
                    </p>
                  </div>
                  <div className="mt-2">
                    <Meter
                      value={row.correct}
                      max={row.attempts}
                      label={`Acierto en ${TOPIC_LABELS[row.key as Topic] ?? row.key}`}
                      tone={row.attempts === 0 ? 'accent' : row.accuracy >= 0.6 ? 'good' : 'bad'}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="progress-weakest" className="mt-10 border-t border-rule pt-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="progress-weakest"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3"
              >
                Etiquetas más débiles
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                top {weakest.length}
              </span>
            </div>

            {weakest.length === 0 ? (
              <p className="mt-3 text-[13px] text-ink-2">
                Todavía no hay etiquetas practicadas.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-rule border-y border-rule">
                {weakest.map((row) => {
                  const question = allQuestions.find((item) => item.tag === row.key);

                  return (
                    <li
                      key={row.key}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-baseline gap-x-2">
                          <span className="truncate text-[14px] text-ink">{row.key}</span>
                          {question ? (
                            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-3">
                              {TOPIC_SHORT_LABELS[question.topic]}
                            </span>
                          ) : null}
                        </p>
                        <div className="mt-1.5 max-w-xs">
                          <Meter
                            value={row.correct}
                            max={row.attempts}
                            label={`Acierto en ${row.key}`}
                            tone={row.accuracy >= 0.6 ? 'good' : 'bad'}
                          />
                        </div>
                      </div>

                      <p className="tabular font-mono text-[11px] text-ink-3">
                        {percent(row.accuracy)} · {row.correct}/{row.attempts}
                      </p>

                      {question ? (
                        <Button
                          variant="secondary"
                          onClick={() => practiceTag(row.key, question.topic)}
                        >
                          Practicar
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section
            aria-labelledby="progress-failed"
            className="mt-10 rounded-xl border border-rule bg-surface p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="progress-failed" className="font-serif text-[19px] text-ink">
                Para repasar
              </h2>
              <span className="tabular font-mono text-[11px] text-ink-3">
                {failed.length} {failed.length === 1 ? 'pregunta' : 'preguntas'}
              </span>
            </div>

            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-ink-2">
              Son las que fallaste en el último intento. Si después las acertás,
              salen de la lista.
            </p>

            <div className="mt-4">
              <Button onClick={practiceFailed} disabled={failed.length === 0}>
                Practicar las falladas
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </section>

          <section className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
            <div>
              <h2 className="text-[13.5px] font-medium text-ink">Reiniciar progreso</h2>
              <p className="mt-1 text-[12.5px] text-ink-3">
                Borra intentos, aciertos y la lista de falladas de este navegador.
              </p>
            </div>

            {confirming ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  className="border-bad/50 text-bad hover:bg-bad-soft"
                  onClick={() => {
                    resetProgress();
                    setConfirming(false);
                  }}
                >
                  Sí, borrar todo
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setConfirming(true)}>
                Reiniciar progreso
              </Button>
            )}
          </section>
        </>
      )}

      <Link
        to="/"
        className="mt-10 inline-flex min-h-9 items-center gap-1.5 text-[12.5px] text-ink-3 transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Volver al inicio
      </Link>
    </main>
  );
}
