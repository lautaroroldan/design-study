import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/session';
import { QuestionCard } from '../components/QuestionCard';
import { Meter } from '../components/Meter';
import { ArrowLeftIcon } from '../components/icons';
import { Results } from './Results';

export function Session() {
  const questions = useSessionStore((state) => state.questions);
  const currentIndex = useSessionStore((state) => state.currentIndex);
  const answers = useSessionStore((state) => state.answers);
  const status = useSessionStore((state) => state.status);
  const answer = useSessionStore((state) => state.answer);
  const next = useSessionStore((state) => state.next);
  const reset = useSessionStore((state) => state.reset);
  const config = useSessionStore((state) => state.config);

  const defaultLang = config && config.lang !== 'both' ? config.lang : undefined;

  if (status === 'finished') {
    return <Results />;
  }

  const current = questions[currentIndex];

  if (status === 'idle' || !current) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          Sesión vacía
        </p>
        <h1 className="mt-3 font-serif text-[28px] leading-tight text-ink">
          No hay preguntas para practicar.
        </h1>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-2">
          Armá una sesión desde Patrones GoF, Principios SOLID o Patrones GRASP. Si
          recargaste la página, la sesión en curso se pierde.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-md border border-rule-strong bg-surface px-4 text-sm text-ink transition-colors duration-150 hover:bg-inset"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al inicio
        </Link>
      </main>
    );
  }

  const selectedOptionId = answers[currentIndex]?.selectedOptionId ?? null;
  const revealed = answers.length > currentIndex;
  const isLast = currentIndex + 1 === questions.length;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-6 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          onClick={reset}
          className="-ml-1 inline-flex min-h-9 items-center gap-1.5 rounded-md px-1 text-[12.5px] text-ink-3 transition-colors duration-150 hover:text-ink"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Salir
        </Link>

        <p className="font-mono text-[11px] tabular text-ink-3">
          {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="mt-3">
        <Meter
          value={answers.length}
          max={questions.length}
          label="Progreso de la sesión"
        />
      </div>

      <div className="mt-6">
        <QuestionCard
          key={current.question.id}
          item={current}
          index={currentIndex}
          total={questions.length}
          selectedOptionId={selectedOptionId}
          revealed={revealed}
          isLast={isLast}
          onSelect={answer}
          onNext={next}
          defaultLang={defaultLang}
        />
      </div>

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
        {revealed ? 'Leé la explicación y continuá' : 'Elegí una opción para responder'}
      </p>
    </main>
  );
}
