import { Link } from 'react-router-dom';
import {
  TOPICS,
  TOPIC_META,
  allQuestions,
  questionsByTopic,
  tagsForTopic,
} from '../content';
import { ArrowRightIcon } from '../components/icons';
import { MetaLine } from '../components/MetaLine';

export function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
          Cuaderno de estudio · {allQuestions.length} preguntas
        </p>

        <h1 className="mt-4 max-w-3xl font-serif text-[34px] leading-[1.08] tracking-tight text-ink sm:text-[52px]">
          Diseño de software, pregunta por pregunta.
        </h1>

        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-2">
          Practicá patrones GoF, principios SOLID y patrones GRASP con preguntas de
          opción múltiple, snippets de código y una explicación de por qué cada
          opción falla.
        </p>

        <p className="mt-7 max-w-xl">
          <MetaLine
            items={['5 · 10 · 20 o todas', 'feedback inmediato', 'sin backend']}
          />
        </p>
      </header>

      <section aria-labelledby="index-title" className="mt-14">
        <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-2">
          <h2
            id="index-title"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3"
          >
            Elegí un tema
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
            03 capítulos
          </span>
        </div>

        <ul>
          {TOPICS.map((topic) => {
            const meta = TOPIC_META[topic];
            const questions = questionsByTopic(topic);
            const tags = tagsForTopic(topic).map(({ tag }) => tag);

            return (
              <li key={topic} className="border-b border-rule">
                <Link
                  to={`/${meta.slug}`}
                  className="group flex gap-4 py-6 transition-colors duration-150 sm:gap-6 sm:px-3 sm:hover:bg-surface"
                >
                  <span
                    aria-hidden="true"
                    className="tabular w-7 shrink-0 pt-1 font-serif text-[15px] text-ink-3"
                  >
                    {meta.order}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-[22px] leading-tight text-ink transition-colors duration-150 group-hover:text-accent">
                      {meta.title}
                    </h3>

                    <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-ink-2">
                      {meta.intro}
                    </p>

                    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                      <span>{tags.slice(0, 5).join(' · ')}</span>
                      {tags.length > 5 ? (
                        <span aria-hidden="true">+{tags.length - 5}</span>
                      ) : null}
                      <span aria-hidden="true" className="text-rule-strong">
                        |
                      </span>
                      <span className="tabular">{questions.length} preguntas</span>
                    </p>
                  </div>

                  <ArrowRightIcon className="mt-1.5 h-4 w-4 shrink-0 text-ink-3 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="more-title" className="mt-12">
        <h2
          id="more-title"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3"
        >
          Además
        </h2>

        <div className="mt-3 grid gap-6 border-t border-rule pt-5 sm:grid-cols-2">
          <Link to="/mixto" className="group">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-[17px] text-ink group-hover:text-accent">
                Modo mixto
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-3">
                disponible
              </span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              Combiná los tres temas en una sesión, con filtros por etiqueta y orden
              aleatorio.
            </p>
          </Link>

          <Link to="/progreso" className="group">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-[17px] text-ink group-hover:text-accent">
                Mi progreso
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-3">
                disponible
              </span>
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              Aciertos por tema y etiqueta, las más débiles y las preguntas que
              quedaron pendientes. Se guarda en este navegador.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
