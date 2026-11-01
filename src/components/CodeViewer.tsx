import { useState } from 'react';
import type { Lang, Question } from '../types';
import { preferredSnippet, snippetsOf } from '../lib/code';
import { CodeBlock } from './CodeBlock';

interface CodeViewerProps {
  question: Question;
  /** Lenguaje que la sesión prefiere (filtro Java/React). */
  defaultLang?: Lang;
  revealed: boolean;
}

/** Bloque de código con selector Java/React cuando la pregunta tiene las dos variantes. */
export function CodeViewer({ question, defaultLang, revealed }: CodeViewerProps) {
  const snippets = snippetsOf(question);
  const first = preferredSnippet(question, defaultLang) ?? snippets[0];
  const [activeLang, setActiveLang] = useState<Lang>(first?.language ?? 'java');

  if (!first) return null;

  return (
    <CodeBlock
      snippets={snippets}
      activeLang={activeLang}
      onLangChange={setActiveLang}
      revealed={revealed}
    />
  );
}
