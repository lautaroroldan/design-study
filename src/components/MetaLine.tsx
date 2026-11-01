interface MetaLineProps {
  items: string[];
  className?: string;
}

/** Línea de metadatos separada por puntos, sin puntos huérfanos al hacer wrap. */
export function MetaLine({ items, className = '' }: MetaLineProps) {
  return (
    <p
      className={`font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink-3 ${className}`}
    >
      {items.join(' · ')}
    </p>
  );
}
