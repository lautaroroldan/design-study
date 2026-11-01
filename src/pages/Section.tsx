import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { SessionConfig, Topic } from '../types';
import {
  TOPIC_META,
  allQuestions,
  questionsByTopic,
  tagsForTopic,
} from '../content';
import { countAvailable } from '../lib/session';
import { byTag } from '../lib/progress';
import { useProgressStore } from '../store/progress';
import { useSessionStore } from '../store/session';
import {
  QUESTION_TYPE_ORDER,
  SessionConfigPanel,
} from '../components/SessionConfigPanel';
import { ArrowLeftIcon, CheckIcon } from '../components/icons';
import { MetaLine } from '../components/MetaLine';

interface SectionProps {
  topic: Topic;
}

export function Section({ topic }: SectionProps) {
  const meta = TOPIC_META[topic];
  const questions = questionsByTopic(topic);
  const tags = tagsForTopic(topic);

  const types = useMemo(
    () => QUESTION_TYPE_ORDER.filter((type) => questions.some((q) => q.type === type)),
    [questions],
  );

  const [config, setConfig] = useState<SessionConfig>({
    topics: [topic],
    tags: [],
    count: 10,
    type: 'all',
    lang: 'both',
    difficulty: 'all',
    order: 'random',
  });

  const start = useSessionStore((state) => state.start);
  const navigate = useNavigate();
  const progress = useProgressStore((state) => state.questions);

  const tagStats = useMemo(
    () => new Map(byTag(questions, progress).map((row) => [row.key, row])),
    [questions, progress],
  );

  const available = countAvailable(allQuestions, config);
  const activeTag = config.tags?.[0] ?? null;

  function selectTag(tag: string) {
    setConfig((previous) => ({
      ...previous,
      tags: previous.tags?.[0] === tag ? [] : [tag],
    }));
  }

  function handleStart() {
    if (start(config, allQuestions) > 0) {
      navigate('/sesion');
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-12">
      <Link
        to="/"
        className="-ml-1 inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 text-[12.5px] text-ink-3 transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Todas las secciones
      </Link>

      <header className="mt-5 border-b border-rule pb-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
          Capítulo {meta.order} · {meta.short}
        </p>

        <h1 className="mt-3 font-serif text-[32px] leading-[1.1] tracking-tight text-ink sm:text-[42px]">
          {meta.title}
        </h1>

        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-2">
          {meta.intro}
        </p>

        <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ink-2">
          <span
            aria-hidden="true"
            className="mt-[7px] inline-block h-2 w-2 shrink-0 rounded-[1px] bg-mustard"
          />
          {meta.focus}
        </p>

        <MetaLine
          className="mt-5"
          items={[
            `${questions.length} preguntas`,
            `${tags.length} etiquetas`,
            'snippets en Java y React',
          ]}
        />
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-12">
        <section aria-labelledby="tags-title" className="order-last lg:order-none">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="tags-title" className="font-serif text-[19px] text-ink">
              Practicar una etiqueta
            </h2>
            {activeTag ? (
              <button
                type="button"
                onClick={() => setConfig((previous) => ({ ...previous, tags: [] }))}
                className="text-[12px] text-ink-3 underline decoration-rule-strong underline-offset-2 transition-colors duration-150 hover:text-ink"
              >
                Ver todas
              </button>
            ) : null}
          </div>

          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            Elegí una para armar una sesión de un solo tema, o dejá todas para
            mezclarlas.
          </p>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {tags.map(({ tag, total }) => {
              const selected = activeTag === tag;
              const stat = tagStats.get(tag);
              const practiced = (stat?.attempts ?? 0) > 0;

              return (
                <li key={tag}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectTag(tag)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2 text-left transition-[background-color,border-color] duration-150 ${
                      selected
                        ? 'border-accent/50 bg-accent-soft'
                        : 'border-rule bg-surface hover:border-rule-strong hover:bg-inset/50'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {selected ? (
                        <CheckIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                      ) : null}
                      <span className="truncate text-[13.5px] text-ink">{tag}</span>
                    </span>
                    {stat && practiced ? (
                      <span
                        className={`tabular shrink-0 font-mono text-[10px] ${
                          stat.accuracy >= 0.6 ? 'text-good' : 'text-bad'
                        }`}
                        title={`${stat.correct} de ${stat.attempts} intentos`}
                      >
                        {Math.round(stat.accuracy * 100)}%
                      </span>
                    ) : (
                      <span className="tabular shrink-0 font-mono text-[10px] text-ink-3">
                        {total} preg.
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
            El porcentaje aparece cuando ya practicaste esa etiqueta.
          </p>
        </section>

        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:h-fit">
          <SessionConfigPanel
            config={config}
            onChange={(patch) => setConfig((previous) => ({ ...previous, ...patch }))}
            available={available}
            onStart={handleStart}
            types={types}
            activeTag={activeTag}
            onClearTag={() => setConfig((previous) => ({ ...previous, tags: [] }))}
          />
        </aside>
      </div>
    </main>
  );
}
