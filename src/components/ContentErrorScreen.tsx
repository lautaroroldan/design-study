interface ContentErrorScreenProps {
  error: string;
}

/**
 * Si el contenido no pasa la validación de Zod, la app no arranca a medias:
 * muestra el error exacto para corregir el archivo.
 */
export function ContentErrorScreen({ error }: ContentErrorScreenProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bad">
        Contenido inválido
      </p>
      <h1 className="mt-3 font-serif text-[28px] leading-tight text-ink">
        La app no puede cargar las preguntas.
      </h1>
      <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-2">
        Corregí el archivo indicado y volvé a cargar. El detalle viene de la
        validación con Zod.
      </p>

      <pre className="mt-6 overflow-x-auto rounded-lg border border-bad/40 bg-bad-soft p-4 font-mono text-[12px] leading-relaxed text-ink">
        {error}
      </pre>
    </main>
  );
}
