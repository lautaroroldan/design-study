import { describe, expect, it } from 'vitest';
import type { Question } from '../types';
import { availableLangs, preferredSnippet, snippetFor, snippetsOf } from './code';

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'gof-1',
    topic: 'gof',
    tag: 'Adapter',
    type: 'identify-pattern',
    difficulty: 1,
    prompt: 'Pregunta',
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
      { id: 'c', text: 'C' },
      { id: 'd', text: 'D' },
    ],
    correctOptionId: 'a',
    explanation: 'Explicación',
    ...overrides,
  };
}

const java = { language: 'java' as const, source: 'class A {}', highlightLines: [1] };
const tsx = { language: 'tsx' as const, source: 'const A = () => null;' };

describe('snippetsOf', () => {
  it('devuelve la primaria primero y después las variantes', () => {
    const question = makeQuestion({ code: java, codeVariants: { tsx } });

    expect(snippetsOf(question).map((snippet) => snippet.language)).toEqual([
      'java',
      'tsx',
    ]);
  });

  it('ignora la variante que repite el lenguaje de la primaria', () => {
    const question = makeQuestion({ code: java, codeVariants: { java: java } });

    expect(snippetsOf(question)).toHaveLength(1);
  });

  it('devuelve vacío si no hay código', () => {
    expect(snippetsOf(makeQuestion({ type: 'concept' }))).toEqual([]);
  });

  it('funciona con variantes sin primaria en el tipo', () => {
    const question = makeQuestion({ code: undefined, codeVariants: { tsx } });

    expect(snippetsOf(question).map((snippet) => snippet.language)).toEqual(['tsx']);
  });
});

describe('availableLangs', () => {
  it('lista los lenguajes disponibles', () => {
    const question = makeQuestion({ code: java, codeVariants: { tsx } });
    expect(availableLangs(question)).toEqual(['java', 'tsx']);
  });
});

describe('snippetFor y preferredSnippet', () => {
  const question = makeQuestion({ code: java, codeVariants: { tsx } });

  it('busca por lenguaje', () => {
    expect(snippetFor(question, 'tsx')).toEqual(tsx);
    expect(snippetFor(question, 'java')).toEqual(java);
  });

  it('prefiere el lenguaje pedido si existe', () => {
    expect(preferredSnippet(question, 'tsx')?.language).toBe('tsx');
  });

  it('cae en la primaria si el lenguaje pedido no existe', () => {
    expect(preferredSnippet(question, 'java')?.language).toBe('java');
    expect(preferredSnippet(question)?.language).toBe('java');
  });

  it('devuelve undefined sin código', () => {
    expect(preferredSnippet(makeQuestion())).toBeUndefined();
  });
});
