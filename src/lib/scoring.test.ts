import { describe, expect, it } from 'vitest';
import type { AnswerRecord, Question, SessionQuestion } from '../types';
import { scoreMessage, summarize } from './scoring';

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

function sessionItem(question: Question): SessionQuestion {
  return { question, options: question.options };
}

const session: SessionQuestion[] = [
  sessionItem(makeQuestion('gof-1')),
  sessionItem(makeQuestion('gof-2', { tag: 'Observer' })),
  sessionItem(makeQuestion('solid-1', { topic: 'solid', tag: 'SRP' })),
  sessionItem(makeQuestion('solid-2', { topic: 'solid', tag: 'DIP' })),
];

const answers: AnswerRecord[] = [
  { questionId: 'gof-1', selectedOptionId: 'b', correct: true },
  { questionId: 'gof-2', selectedOptionId: 'a', correct: false },
  { questionId: 'solid-1', selectedOptionId: 'b', correct: true },
  { questionId: 'solid-2', selectedOptionId: 'b', correct: true },
];

describe('summarize', () => {
  it('calcula puntaje global y accuracy', () => {
    const summary = summarize(answers, session);

    expect(summary.total).toBe(4);
    expect(summary.correct).toBe(3);
    expect(summary.wrong).toBe(1);
    expect(summary.accuracy).toBeCloseTo(0.75);
  });

  it('desglosa por tema', () => {
    const summary = summarize(answers, session);
    const gof = summary.byTopic.find((row) => row.key === 'gof');
    const solid = summary.byTopic.find((row) => row.key === 'solid');

    expect(gof).toMatchObject({ total: 2, correct: 1, accuracy: 0.5 });
    expect(solid).toMatchObject({ total: 2, correct: 2, accuracy: 1 });
  });

  it('ordena las etiquetas de peor a mejor acierto', () => {
    const summary = summarize(answers, session);
    const accuracies = summary.byTag.map((row) => row.accuracy);

    expect(accuracies).toEqual([...accuracies].sort((a, b) => a - b));
    expect(summary.byTag[0].key).toBe('Observer');
  });

  it('lista los errores con la opción elegida', () => {
    const summary = summarize(answers, session);

    expect(summary.mistakes).toHaveLength(1);
    expect(summary.mistakes[0].question.id).toBe('gof-2');
    expect(summary.mistakes[0].selectedOptionId).toBe('a');
  });

  it('no rompe con respuestas vacías', () => {
    const summary = summarize([], session);

    expect(summary).toMatchObject({ total: 0, correct: 0, wrong: 0, accuracy: 0 });
    expect(summary.byTopic).toEqual([]);
    expect(summary.mistakes).toEqual([]);
  });

  it('ignora respuestas de preguntas que no están en la sesión', () => {
    const summary = summarize(
      [{ questionId: 'fantasma', selectedOptionId: 'a', correct: true }],
      session,
    );

    expect(summary.total).toBe(1);
    expect(summary.correct).toBe(1);
    expect(summary.byTopic).toEqual([]);
  });
});

describe('scoreMessage', () => {
  it('responde según el porcentaje', () => {
    expect(scoreMessage(0, 0)).toMatch(/No hay respuestas/);
    expect(scoreMessage(1, 5)).toMatch(/Perfecto/);
    expect(scoreMessage(0.8, 5)).toMatch(/Muy bien/);
    expect(scoreMessage(0.6, 5)).toMatch(/Vas bien/);
    expect(scoreMessage(0.4, 5)).toMatch(/A medio camino/);
    expect(scoreMessage(0.2, 5)).toMatch(/Toca repasar/);
  });
});
