import type { CSSProperties } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import type { CodeSnippet } from '../types';
import { LANG_LABELS } from '../lib/labels';

SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('tsx', tsx);

/** Tema propio: los colores salen de variables CSS, así sigue el modo claro/oscuro. */
const theme: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: 'var(--code-ink)',
    background: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '12.5px',
    lineHeight: 1.7,
  },
  'pre[class*="language-"]': {
    color: 'var(--code-ink)',
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
    fontSize: '12.5px',
    lineHeight: 1.7,
  },
  comment: { color: 'var(--code-comment)', fontStyle: 'italic' },
  prolog: { color: 'var(--code-comment)' },
  doctype: { color: 'var(--code-comment)' },
  cdata: { color: 'var(--code-comment)' },
  punctuation: { color: 'var(--code-punct)' },
  keyword: { color: 'var(--code-keyword)' },
  builtin: { color: 'var(--code-keyword)' },
  'class-name': { color: 'var(--code-type)' },
  boolean: { color: 'var(--code-number)' },
  number: { color: 'var(--code-number)' },
  string: { color: 'var(--code-string)' },
  char: { color: 'var(--code-string)' },
  annotation: { color: 'var(--code-number)' },
  function: { color: 'var(--code-fn)' },
  'function-variable': { color: 'var(--code-fn)' },
  operator: { color: 'var(--code-punct)' },
  tag: { color: 'var(--code-keyword)' },
  'attr-name': { color: 'var(--code-type)' },
  'attr-value': { color: 'var(--code-string)' },
  property: { color: 'var(--code-type)' },
  variable: { color: 'var(--code-ink)' },
  constant: { color: 'var(--code-number)' },
  symbol: { color: 'var(--code-number)' },
};

interface CodeBlockProps {
  code: CodeSnippet;
  /** Antes de responder no se resaltan líneas: sería spoiler. */
  revealed: boolean;
}

export function CodeBlock({ code, revealed }: CodeBlockProps) {
  const lineCount = code.source.split('\n').length;
  const highlights = new Set(revealed ? (code.highlightLines ?? []) : []);

  return (
    <figure className="code-block overflow-hidden rounded-lg border border-rule bg-code">
      <figcaption className="flex items-center justify-between border-b border-rule px-3.5 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
          {LANG_LABELS[code.language]}
        </span>
        <span className="font-mono text-[10px] tabular text-ink-3">
          {lineCount} líneas
        </span>
      </figcaption>

      <div className="code-grid overflow-x-auto">
        <SyntaxHighlighter
          language={code.language}
          style={theme}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            color: 'var(--code-comment)',
            minWidth: '2.5rem',
            paddingRight: '1rem',
            textAlign: 'right',
            userSelect: 'none',
          }}
          lineProps={(lineNumber) => (highlights.has(lineNumber) ? { className: 'hl' } : {})}
          customStyle={{
            margin: 0,
            padding: '0.875rem 0',
            background: 'transparent',
            overflow: 'visible',
          }}
          codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
        >
          {code.source}
        </SyntaxHighlighter>
      </div>

      {revealed && highlights.size > 0 ? (
        <figcaption className="border-t border-rule px-3.5 py-2 text-[11px] text-ink-3">
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-2 w-2 translate-y-px rounded-[1px] bg-mustard"
          />
          En amarillo, las líneas relevantes.
        </figcaption>
      ) : null}
    </figure>
  );
}
