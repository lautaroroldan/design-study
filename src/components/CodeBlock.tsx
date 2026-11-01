import type { CSSProperties } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import type { CodeSnippet, Lang } from '../types';
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
  snippets: CodeSnippet[];
  activeLang: Lang;
  onLangChange?: (lang: Lang) => void;
  /** Antes de responder no se resaltan líneas: sería spoiler. */
  revealed: boolean;
}

export function CodeBlock({
  snippets,
  activeLang,
  onLangChange,
  revealed,
}: CodeBlockProps) {
  const active = snippets.find((snippet) => snippet.language === activeLang) ?? snippets[0];
  const lineCount = active.source.split('\n').length;
  const highlights = new Set(revealed ? (active.highlightLines ?? []) : []);
  const switchable = snippets.length > 1 && onLangChange;

  return (
    <figure className="code-block overflow-hidden rounded-lg border border-rule bg-code">
      <figcaption className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2">
        {switchable ? (
          <div
            role="group"
            aria-label="Lenguaje del código"
            className="flex gap-0.5 rounded-md border border-rule bg-inset p-0.5"
          >
            {snippets.map((snippet) => {
              const isActive = snippet.language === active.language;

              return (
                <button
                  key={snippet.language}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onLangChange(snippet.language)}
                  className={`min-h-7 rounded-[4px] px-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150 ${
                    isActive
                      ? 'bg-surface text-ink shadow-[0_0_0_1px_var(--rule)]'
                      : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  {LANG_LABELS[snippet.language]}
                </button>
              );
            })}
          </div>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
            {LANG_LABELS[active.language]}
          </span>
        )}

        <span className="tabular font-mono text-[10px] text-ink-3">{lineCount} líneas</span>
      </figcaption>

      <div className="code-grid overflow-x-auto">
        <SyntaxHighlighter
          language={active.language}
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
          {active.source}
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
