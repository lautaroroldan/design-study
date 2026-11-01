import { describe, expect, it } from 'vitest';
import type { Question } from '../types';
import {
  accuracyOf,
  byTag,
  byTopic,
  failedQuestionIds,
  failedQuestions,
  overallStats,
  questionProgress,
  weakestTags,
} from './progress';
import type { ProgressMap } from './progress';

function makeQuestion(id: string, overrides: Partial<Question> = {}): Question {
  return {
    id,
    topic: 'gof',
    tag: 'Singleton',
    type: 'concept',
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

function entry(attempts: number, correct: number, lastCorrect = true) {
  return {
    attempts,
    correct,
    lastCorrect,
    lastAttemptAt: '2026-01-01T00:00:00.000Z',
  };
}

const questions: Question[] = [
  makeQuestion('gof-1', { tag: 'Singleton' }),
  makeQuestion('gof-2', { tag: 'Observer' }),
  makeQuestion('solid-1', { topic: 'solid', tag: 'SRP' }),
  makeQuestion('solid-2', { topic: 'solid', tag: 'DIP' }),
];

describe('accuracyOf', () => {
  it('suma intentos y aciertos', () => {
    const progress: ProgressMap = {
      'gof-1': entry(2, 1),
      'solid-1': entry(1, 1),
    };

    expect(accuracyOf(questions, progress)).toEqual({
      attempts: 3,
      correct: 2,
      accuracy: 2 / 3,
    });
  });

  it('devuelve 0 sin intentos', () => {
    expect(accuracyOf(questions, {})).toEqual({ attempts: 0, correct: 0, accuracy: 0 });
  });
});

describe('questionProgress', () => {
  it('devuelve la entrada o null', () => {
    const progress: ProgressMap = { 'gof-1': entry(1, 0, false) };

    expect(questionProgress(progress, 'gof-1')?.attempts).toBe(1);
    expect(questionProgress(progress, 'gof-2')).toBeNull();
  });
});

describe('byTopic y byTag', () => {
  const progress: ProgressMap = {
    'gof-1': entry(2, 1),
    'gof-2': entry(1, 0, false),
    'solid-1': entry(1, 1),
  };

  it('agrupa por tema contando practicadas y totales', () => {
    const gof = byTopic(questions, progress).find((row) => row.key === 'gof');

    expect(gof).toMatchObject({
      totalQuestions: 2,
      practiced: 2,
      attempts: 3,
      correct: 1,
    });
    expect(gof?.accuracy).toBeCloseTo(1 / 3);
  });

  it('incluye las etiquetas sin practicar con 0 intentos', () => {
    const dip = byTag(questions, progress).find((row) => row.key === 'DIP');

    expect(dip).toMatchObject({ attempts: 0, practiced: 0, totalQuestions: 1 });
  });
});

describe('weakestTags', () => {
  it('ordena de peor a mejor y descarta las no practicadas', () => {
    const progress: ProgressMap = {
      'gof-1': entry(1, 1),
      'gof-2': entry(2, 0, false),
      'solid-1': entry(2, 1),
    };

    const weak = weakestTags(questions, progress);

    expect(weak.map((row) => row.key)).toEqual(['Observer', 'SRP', 'Singleton']);
    expect(weak.some((row) => row.key === 'DIP')).toBe(false);
  });

  it('respeta el límite', () => {
    const progress: ProgressMap = {
      'gof-1': entry(1, 1),
      'gof-2': entry(1, 0, false),
      'solid-1': entry(1, 0, false),
      'solid-2': entry(1, 1),
    };

    expect(weakestTags(questions, progress, 2)).toHaveLength(2);
  });
});

describe('overallStats', () => {
  it('cuenta practicadas sobre el total', () => {
    const progress: ProgressMap = {
      'gof-1': entry(1, 1),
      'solid-2': entry(3, 2),
    };

    expect(overallStats(questions, progress)).toEqual({
      totalQuestions: 4,
      practiced: 2,
      attempts: 4,
      correct: 3,
      accuracy: 0.75,
    });
  });
});

describe('failedQuestions', () => {
  it('devuelve solo las que fallaron en el último intento', () => {
    const progress: ProgressMap = {
      'gof-1': entry(3, 1, false),
      'gof-2': entry(1, 1, true),
      'solid-1': entry(2, 0, false),
    };

    expect(failedQuestions(questions, progress).map((q) => q.id)).toEqual([
      'gof-1',
      'solid-1',
    ]);
    expect(failedQuestionIds(progress)).toEqual(['gof-1', 'solid-1']);
  });

  it('saca la pregunta del listado cuando después se acierta', () => {
    const progress: ProgressMap = { 'gof-1': entry(2, 1, true) };

    expect(failedQuestions(questions, progress)).toEqual([]);
  });
});
