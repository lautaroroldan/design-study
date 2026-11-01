import { describe, expect, it } from 'vitest';
import { snippetsOf } from '../lib/code';
import {
  TOPICS,
  allQuestions,
  contentError,
  questionsByTopic,
  tagsForTopic,
} from './index';

const TYPES = ['concept', 'identify-pattern', 'find-violation', 'choose-fix'] as const;

describe('contenido', () => {
  it('carga sin errores de validación', () => {
    expect(contentError).toBeNull();
  });

  it('tiene al menos 10 preguntas por tema', () => {
    for (const topic of TOPICS) {
      expect(questionsByTopic(topic).length, `tema ${topic}`).toBeGreaterThanOrEqual(10);
    }

    expect(allQuestions.length).toBeGreaterThanOrEqual(40);
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

  it('los snippets no superan las 25 líneas, variantes incluidas', () => {
    for (const question of allQuestions) {
      for (const snippet of snippetsOf(question)) {
        expect(
          snippet.source.split('\n').length,
          `${question.id} (${snippet.language}) tiene un snippet largo`,
        ).toBeLessThanOrEqual(25);
      }
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

  it('hay preguntas con código Java y con código React', () => {
    const langs = new Set(
      allQuestions.flatMap((question) =>
        snippetsOf(question).map((snippet) => snippet.language),
      ),
    );

    expect(langs).toEqual(new Set(['java', 'tsx']));
  });

  it('las variantes tienen lenguajes distintos de la primaria', () => {
    for (const question of allQuestions) {
      if (!question.codeVariants) continue;

      for (const [lang, snippet] of Object.entries(question.codeVariants)) {
        expect(snippet?.language, `${question.id} → ${lang}`).toBe(lang);
        expect(lang).not.toBe(question.code?.language);
      }
    }
  });

  it('existen los cuatro tipos de ejercicio', () => {
    for (const type of TYPES) {
      expect(
        allQuestions.some((question) => question.type === type),
        `tipo ${type}`,
      ).toBe(true);
    }
  });

  it('GoF y GRASP tienen identify-pattern; SOLID y GoF tienen choose-fix', () => {
    const hasType = (topic: string, type: string) =>
      allQuestions.some((question) => question.topic === topic && question.type === type);

    expect(hasType('gof', 'identify-pattern')).toBe(true);
    expect(hasType('grasp', 'identify-pattern')).toBe(true);
    expect(hasType('gof', 'choose-fix')).toBe(true);
    expect(hasType('solid', 'choose-fix')).toBe(true);
  });

  it('todas las preguntas tienen pista', () => {
    for (const question of allQuestions) {
      expect(question.hint, `${question.id} sin hint`).toBeTruthy();
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
