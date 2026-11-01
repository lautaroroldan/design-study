import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/icons';

export function Progress() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
        Mi progreso · Fase 3
      </p>

      <h1 className="mt-3 font-serif text-[32px] leading-[1.1] tracking-tight text-ink sm:text-[42px]">
        Tu progreso, más adelante.
      </h1>

      <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-2">
        En la Fase 3 esta página muestra los aciertos por tema, las cinco etiquetas
        más débiles y un botón para reiniciar el progreso. Todo queda en
        localStorage: no hay backend ni cuentas.
      </p>

      <p className="mt-6 rounded-lg border border-rule bg-surface px-4 py-3 text-[13px] leading-relaxed text-ink-2">
        Hoy el puntaje vive solo en la pantalla de resultados de cada sesión. Si
        recargás, se pierde.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex min-h-10 items-center gap-2 rounded-md border border-rule-strong bg-surface px-4 text-sm text-ink transition-colors duration-150 hover:bg-inset"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver al inicio
      </Link>
    </main>
  );
}
