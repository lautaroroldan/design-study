import { describe, expect, it } from 'vitest';
import {
  TOPICS,
  allQuestions,
  contentError,
  questionsByTopic,
  tagsForTopic,
} from './index';

describe('contenido de la Fase 1', () => {
  it('carga sin errores de validación', () => {
    expect(contentError).toBeNull();
  });

  it('tiene 10 preguntas por tema', () => {
    for (const topic of TOPICS) {
      expect(questionsByTopic(topic), `tema ${topic}`).toHaveLength(10);
    }

    expect(allQuestions).toHaveLength(30);
  });

  it('todas las preguntas tienen 4 opciones y una correcta entre ellas', () => {
    for (const question of allQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.map((option) => option.id)).toContain(
        question.correctOptionId,
      );
    }
  });

  it('todas las opciones incorrectas tienen explicación', () => {
    for (const question of allQuestions) {
      for (const option of question.options) {
        if (option.id === question.correctOptionId) continue;

        expect(
          question.optionExplanations?.[option.id],
          `${question.id} → opción ${option.id}`,
        ).toBeTruthy();
      }
    }
  });

  it('los snippets no superan las 25 líneas', () => {
    for (const question of allQuestions) {
      if (!question.code) continue;

      expect(
        question.code.source.split('\n').length,
        `${question.id} tiene un snippet largo`,
      ).toBeLessThanOrEqual(25);
    }
  });

  it('los ids son únicos', () => {
    const ids = allQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada tema tiene al menos un ejercicio con código', () => {
    for (const topic of TOPICS) {
      const withCode = questionsByTopic(topic).filter((question) => question.code);
      expect(withCode.length, `tema ${topic}`).toBeGreaterThan(0);
    }
  });

  it('las etiquetas salen del contenido en orden canónico', () => {
    const gofTags = tagsForTopic('gof').map(({ tag }) => tag);

    expect(gofTags[0]).toBe('Singleton');
    expect(gofTags).toContain('Observer');
    expect(tagsForTopic('solid').map(({ tag }) => tag)).toEqual([
      'SRP',
      'OCP',
      'LSP',
      'ISP',
      'DIP',
    ]);
  });
});
