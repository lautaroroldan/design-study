import { Link } from 'react-router-dom';
import { TOPIC_META, TOPICS } from '../content';
import { ArrowLeftIcon } from '../components/icons';

export function Mixed() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
        Modo mixto · Fase 2
      </p>

      <h1 className="mt-3 font-serif text-[32px] leading-[1.1] tracking-tight text-ink sm:text-[42px]">
        Combinar temas, todavía no.
      </h1>

      <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
        Esta pantalla es un marcador de posición. El modo mixto llega en la Fase 2,
        cuando lo confirmes: selección de temas con casillas, filtros por etiqueta,
        mezcla aleatoria y el atajo «Solo las que fallé».
      </p>

      <p className="mt-6 rounded-lg border border-rule bg-surface px-4 py-3 text-[13px] leading-relaxed text-ink-2">
        Mientras tanto, las tres secciones ya funcionan por separado con sesiones
        completas, feedback y resultados.
      </p>

      <div className="mt-8 grid gap-2 border-t border-rule pt-6 sm:grid-cols-3">
        {TOPICS.map((topic) => (
          <Link
            key={topic}
            to={`/${TOPIC_META[topic].slug}`}
            className="flex min-h-11 items-center justify-between gap-2 rounded-md border border-rule bg-surface px-3 text-[13px] text-ink transition-colors duration-150 hover:border-rule-strong hover:bg-inset"
          >
            {TOPIC_META[topic].title}
            <span aria-hidden="true" className="font-mono text-[11px] text-ink-3">
              →
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/"
        className="mt-8 inline-flex min-h-9 items-center gap-1.5 text-[12.5px] text-ink-3 transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Volver al inicio
      </Link>
    </main>
  );
}
