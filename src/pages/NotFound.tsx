import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/icons';

export function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
        Error 404
      </p>
      <h1 className="mt-3 font-serif text-[30px] leading-tight text-ink">
        Esa página no existe.
      </h1>
      <p className="mt-2 text-[14px] text-ink-2">
        Puede que el enlace esté viejo o mal escrito.
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
