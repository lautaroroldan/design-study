import { describe, expect, it } from 'vitest';
import type { Question, SessionConfig } from '../types';
import { buildSession, countAvailable, filterQuestions } from './session';
import { createRng, shuffle } from './random';

function makeQuestion(id: string, overrides: Partial<Question> = {}): Question {
  return {
    id,
    topic: 'gof',
    tag: 'Singleton',
    type: 'concept',
    difficulty: 1,
    prompt: `Pregunta ${id}`,
    options: [
      { id: 'a', text: 'Opción A' },
      { id: 'b', text: 'Opción B' },
      { id: 'c', text: 'Opción C' },
      { id: 'd', text: 'Opción D' },
    ],
    correctOptionId: 'b',
    explanation: 'Porque sí.',
    ...overrides,
  };
}

function makeConfig(overrides: Partial<SessionConfig> = {}): SessionConfig {
  return {
    topics: ['gof'],
    tags: [],
    count: 'all',
    type: 'all',
    lang: 'both',
    difficulty: 'all',
    order: 'fixed',
    ...overrides,
  };
}

const bank: Question[] = [
  makeQuestion('gof-1'),
  makeQuestion('gof-2', { tag: 'Observer', type: 'find-violation', difficulty: 2 }),
  makeQuestion('gof-3', {
    tag: 'Observer',
    type: 'identify-pattern',
    difficulty: 3,
    code: { language: 'java', source: 'class A {}', highlightLines: [1] },
  }),
  makeQuestion('solid-1', { topic: 'solid', tag: 'SRP' }),
];

describe('filterQuestions', () => {
  it('filtra por tema', () => {
    const result = filterQuestions(bank, makeConfig({ topics: ['solid'] }));
    expect(result.map((q) => q.id)).toEqual(['solid-1']);
  });

  it('filtra por etiqueta', () => {
    const result = filterQuestions(bank, makeConfig({ tags: ['Observer'] }));
    expect(result.map((q) => q.id)).toEqual(['gof-2', 'gof-3']);
  });

  it('filtra por tipo de ejercicio', () => {
    const result = filterQuestions(bank, makeConfig({ type: 'identify-pattern' }));
    expect(result.map((q) => q.id)).toEqual(['gof-3']);
  });

  it('filtra por dificultad', () => {
    const result = filterQuestions(bank, makeConfig({ difficulty: 2 }));
    expect(result.map((q) => q.id)).toEqual(['gof-2']);
  });

  it('filtra por lenguaje solo las preguntas con código', () => {
    const result = filterQuestions(
      bank,
      makeConfig({ topics: ['gof', 'solid'], lang: 'tsx' }),
    );

    // Las conceptuales no dependen del lenguaje; gof-3 es Java y queda afuera.
    expect(result.map((q) => q.id)).toEqual(['gof-1', 'gof-2', 'solid-1']);
  });

  it('filtra por ids explícitos', () => {
    const result = filterQuestions(
      bank,
      makeConfig({ topics: ['gof', 'solid'], questionIds: ['gof-2', 'solid-1'] }),
    );
    expect(result.map((q) => q.id)).toEqual(['gof-2', 'solid-1']);
  });

  it('sin temas no devuelve nada', () => {
    expect(filterQuestions(bank, makeConfig({ topics: [] }))).toEqual([]);
  });

  it('no muta el banco original', () => {
    const before = JSON.stringify(bank);
    filterQuestions(bank, makeConfig({ topics: ['gof'] }));
    expect(JSON.stringify(bank)).toBe(before);
  });
});

describe('buildSession', () => {
  const allTopics = makeConfig({ topics: ['gof', 'solid'] });

  it('recorta según la cantidad pedida', () => {
    const many = Array.from({ length: 8 }, (_, index) =>
      makeQuestion(`gof-${index + 1}`),
    );

    const session = buildSession(many, { ...allTopics, count: 5 });
    expect(session).toHaveLength(5);
  });

  it('con "todas" devuelve el pool completo', () => {
    const session = buildSession(bank, allTopics);
    expect(session).toHaveLength(bank.length);
  });

  it('con orden fijo respeta el orden del contenido', () => {
    const session = buildSession(bank, allTopics);
    expect(session.map(({ question }) => question.id)).toEqual([
      'gof-1',
      'gof-2',
      'gof-3',
      'solid-1',
    ]);
  });

  it('con orden aleatorio devuelve una permutación distinta', () => {
    const session = buildSession(bank, { ...allTopics, order: 'random' }, createRng(7));
    const ids = session.map(({ question }) => question.id);

    expect(ids).toHaveLength(bank.length);
    expect([...ids].sort()).toEqual(bank.map((q) => q.id).sort());
    expect(ids).not.toEqual(['gof-1', 'gof-2', 'gof-3', 'solid-1']);
  });

  it('es determinística con la misma semilla', () => {
    const first = buildSession(bank, { ...allTopics, order: 'random' }, createRng(42));
    const second = buildSession(bank, { ...allTopics, order: 'random' }, createRng(42));

    expect(first.map((item) => item.question.id)).toEqual(
      second.map((item) => item.question.id),
    );
    expect(first.map((item) => item.options.map((o) => o.id))).toEqual(
      second.map((item) => item.options.map((o) => o.id)),
    );
  });

  it('mezcla las opciones sin perder ninguna ni la correcta', () => {
    const session = buildSession(bank, allTopics, createRng(3));

    for (const { question, options } of session) {
      expect(options).toHaveLength(4);
      expect(options.map((option) => option.id).sort()).toEqual(['a', 'b', 'c', 'd']);
      expect(options.map((option) => option.id)).toContain(question.correctOptionId);
    }
  });

  it('devuelve una sesión vacía si no hay preguntas posibles', () => {
    const session = buildSession(bank, makeConfig({ topics: ['grasp'] }));
    expect(session).toEqual([]);
  });
});

describe('shuffle', () => {
  it('no muta el array original', () => {
    const source = [1, 2, 3, 4];
    const shuffled = shuffle(source, createRng(1));

    expect(source).toEqual([1, 2, 3, 4]);
    expect(shuffled).not.toBe(source);
    expect([...shuffled].sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('countAvailable', () => {
  it('cuenta el pool antes de recortar', () => {
    expect(countAvailable(bank, makeConfig({ topics: ['gof'] }))).toBe(3);
    expect(countAvailable(bank, makeConfig({ topics: ['gof'], tags: ['Observer'] }))).toBe(2);
  });
});
