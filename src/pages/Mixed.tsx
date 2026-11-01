import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { SessionConfig, Topic } from '../types';
import {
  TOPICS,
  TOPIC_META,
  allQuestions,
  questionsByTopic,
  tagsForTopic,
} from '../content';
import { countAvailable } from '../lib/session';
import { failedQuestions } from '../lib/progress';
import { useProgressStore } from '../store/progress';
import { useSessionStore } from '../store/session';
import {
  QUESTION_TYPE_ORDER,
  SessionConfigPanel,
} from '../components/SessionConfigPanel';
import { Button } from '../components/Button';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '../components/icons';
import { MetaLine } from '../components/MetaLine';

export function Mixed() {
  const [config, setConfig] = useState<SessionConfig>({
    topics: [...TOPICS],
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

  const available = countAvailable(allQuestions, config);
  const selectedTags = config.tags ?? [];
  const failedInTopics = failedQuestions(allQuestions, progress).filter((question) =>
    config.topics.includes(question.topic),
  );

  const types = useMemo(
    () =>
      QUESTION_TYPE_ORDER.filter((type) =>
        allQuestions.some(
          (question) => config.topics.includes(question.topic) && question.type === type,
        ),
      ),
    [config.topics],
  );

  const groups = config.topics.map((topic) => ({
    topic,
    tags: tagsForTopic(topic),
  }));

  function patch(next: Partial<SessionConfig>) {
    setConfig((previous) => ({ ...previous, ...next }));
  }

  function toggleTopic(topic: Topic) {
    setConfig((previous) => {
      const isSelected = previous.topics.includes(topic);
      const nextTopics = isSelected
        ? previous.topics.filter((item) => item !== topic)
        : [...previous.topics, topic];

      // Al sacar un tema, sus etiquetas dejan de tener sentido.
      const allowed = new Set(
        nextTopics.flatMap((item) => tagsForTopic(item).map(({ tag }) => tag)),
      );

      return {
        ...previous,
        topics: TOPICS.filter((item) => nextTopics.includes(item)),
        tags: (previous.tags ?? []).filter((tag) => allowed.has(tag)),
      };
    });
  }

  function toggleTag(tag: string) {
    setConfig((previous) => {
      const tags = previous.tags ?? [];
      return {
        ...previous,
        tags: tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
      };
    });
  }

  function handleStart() {
    if (start(config, allQuestions) > 0) {
      navigate('/sesion');
    }
  }

  function startFailed() {
    if (failedInTopics.length === 0) return;

    const topics = TOPICS.filter((topic) =>
      failedInTopics.some((question) => question.topic === topic),
    );

    const created = start(
      {
        topics,
        tags: [],
        questionIds: failedInTopics.map((question) => question.id),
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
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:py-12">
      <header className="border-b border-rule pb-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
          Modo mixto
        </p>

        <h1 className="mt-3 font-serif text-[32px] leading-[1.1] tracking-tight text-ink sm:text-[42px]">
          Mezclá los tres temas.
        </h1>

        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ink-2">
          Elegí qué temas entran, filtrá por etiquetas si querés y armá una sesión
          con preguntas de GoF, SOLID y GRASP mezcladas en orden aleatorio.
        </p>

        <MetaLine
          className="mt-5"
          items={[`${allQuestions.length} preguntas`, '4 tipos de ejercicio', 'Java y React']}
        />
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-12">
        <section aria-labelledby="mixed-tags" className="order-last lg:order-none">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="mixed-tags" className="font-serif text-[19px] text-ink">
              Filtrar por etiqueta
            </h2>
            {selectedTags.length > 0 ? (
              <button
                type="button"
                onClick={() => patch({ tags: [] })}
                className="text-[12px] text-ink-3 underline decoration-rule-strong underline-offset-2 transition-colors duration-150 hover:text-ink"
              >
                Limpiar ({selectedTags.length})
              </button>
            ) : null}
          </div>

          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            Opcional. Sin etiquetas elegidas, entra todo el contenido de los temas
            seleccionados.
          </p>

          {config.topics.length === 0 ? (
            <p className="mt-4 rounded-lg border border-rule bg-surface px-4 py-3 text-[13px] text-ink-2">
              Elegí al menos un tema para ver sus etiquetas.
            </p>
          ) : (
            <div className="mt-5 space-y-5">
              {groups.map(({ topic, tags }) => (
                <div key={topic}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
                    {TOPIC_META[topic].title}
                  </p>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {tags.map(({ tag, total }) => {
                      const selected = selectedTags.includes(tag);

                      return (
                        <li key={tag}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleTag(tag)}
                            className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-left transition-[background-color,border-color] duration-150 ${
                              selected
                                ? 'border-accent/50 bg-accent-soft'
                                : 'border-rule bg-surface hover:border-rule-strong hover:bg-inset/50'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              {selected ? (
                                <CheckIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
                              ) : null}
                              <span className="truncate text-[13px] text-ink">{tag}</span>
                            </span>
                            <span className="tabular shrink-0 font-mono text-[10px] text-ink-3">
                              {total}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-lg border border-rule bg-surface px-4 py-4">
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium text-ink">Solo las que fallé</span>
              <span className="tabular font-mono text-[11px] text-ink-3">
                {failedInTopics.length}
              </span>
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
              {failedInTopics.length > 0
                ? 'Arma la sesión con las preguntas que fallaste en el último intento, dentro de los temas elegidos.'
                : 'Todavía no hay preguntas falladas con estos temas. Aparecen acá a medida que practicás.'}
            </p>

            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={startFailed}
              disabled={failedInTopics.length === 0}
            >
              Practicar las falladas
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-6 text-[12px] leading-relaxed text-ink-3">
            {config.topics.length} de {TOPICS.length} temas ·{' '}
            {config.topics.reduce((total, topic) => total + questionsByTopic(topic).length, 0)}{' '}
            preguntas en el pool
          </p>
        </section>

        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:h-fit">
          <SessionConfigPanel
            config={config}
            onChange={patch}
            available={available}
            onStart={handleStart}
            types={types}
            startLabel="Empezar mezcla"
          >
            <fieldset>
              <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-3">
                Temas
              </legend>

              <div className="space-y-1.5">
                {TOPICS.map((topic) => {
                  const checked = config.topics.includes(topic);
                  const total = questionsByTopic(topic).length;

                  return (
                    <label
                      key={topic}
                      className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition-colors duration-150 ${
                        checked
                          ? 'border-accent/40 bg-accent-soft'
                          : 'border-rule bg-surface hover:bg-inset/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTopic(topic)}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      <span className="flex-1 text-[13px] text-ink">
                        {TOPIC_META[topic].title}
                      </span>
                      <span className="tabular font-mono text-[10px] text-ink-3">
                        {total} preg.
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </SessionConfigPanel>

          {config.topics.length === 0 ? (
            <p className="mt-3 text-center text-[12px] text-bad">
              Seleccioná al menos un tema.
            </p>
          ) : null}
        </aside>
      </div>

      <div className="mt-10 border-t border-rule pt-5">
        <p className="text-[12.5px] text-ink-3">
          {selectedTags.length > 0
            ? `Filtrando ${selectedTags.length} etiqueta(s).`
            : 'Sin filtro de etiquetas: entra todo.'}
        </p>

        <Link
          to="/"
          className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-[12.5px] text-ink-3 transition-colors duration-150 hover:text-ink"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
