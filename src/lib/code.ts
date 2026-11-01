import type { CodeSnippet, Lang, Question } from '../types';

/**
 * Snippets de una pregunta: la primaria (`code`) primero y después las variantes.
 * Si una variante repite el lenguaje de la primaria, se ignora.
 */
export function snippetsOf(question: Question): CodeSnippet[] {
  const primary = question.code ? [question.code] : [];
  const variants = Object.values(question.codeVariants ?? {}).filter(
    (snippet): snippet is CodeSnippet => Boolean(snippet),
  );

  const seen = new Set<Lang>();

  return [...primary, ...variants].filter((snippet) => {
    if (seen.has(snippet.language)) return false;
    seen.add(snippet.language);
    return true;
  });
}

export function availableLangs(question: Question): Lang[] {
  return snippetsOf(question).map((snippet) => snippet.language);
}

export function snippetFor(question: Question, lang: Lang): CodeSnippet | undefined {
  return snippetsOf(question).find((snippet) => snippet.language === lang);
}

/** Lenguaje a mostrar primero: el elegido en la sesión si existe, si no la primaria. */
export function preferredSnippet(
  question: Question,
  preferred?: Lang,
): CodeSnippet | undefined {
  const snippets = snippetsOf(question);

  if (preferred) {
    const match = snippets.find((snippet) => snippet.language === preferred);
    if (match) return match;
  }

  return snippets[0];
}
