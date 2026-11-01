import { describe, expect, it } from 'vitest';
import { parseQuestionFile } from './schema';

const validQuestion = {
  id: 'gof-singleton-001',
  topic: 'gof',
  tag: 'Singleton',
  type: 'concept',
  difficulty: 1,
  prompt: '¿Qué patrón resuelve esto?',
  options: [
    { id: 'a', text: 'Prototype' },
    { id: 'b', text: 'Singleton' },
    { id: 'c', text: 'Builder' },
    { id: 'd', text: 'Flyweight' },
  ],
  correctOptionId: 'b',
  explanation: 'Singleton garantiza una única instancia.',
};

describe('parseQuestionFile', () => {
  it('acepta una pregunta bien formada', () => {
    const [question] = parseQuestionFile([validQuestion], 'gof.ts');

    expect(question.id).toBe('gof-singleton-001');
    expect(question.options).toHaveLength(4);
    expect(question.correctOptionId).toBe('b');
  });

  it('rechaza preguntas con menos de 4 opciones e indica el archivo', () => {
    const broken = {
      ...validQuestion,
      options: validQuestion.options.slice(0, 3),
    };

    expect(() => parseQuestionFile([broken], 'gof.ts')).toThrow(/gof\.ts/);
    expect(() => parseQuestionFile([broken], 'gof.ts')).toThrow(/pregunta #1/);
  });

  it('rechaza una correcta que no existe entre las opciones', () => {
    const broken = { ...validQuestion, correctOptionId: 'z' };

    expect(() => parseQuestionFile([broken], 'solid.ts')).toThrow(
      /correctOptionId.*no es el id de ninguna opción/s,
    );
  });

  it('rechaza ids de opción repetidos', () => {
    const broken = {
      ...validQuestion,
      options: [
        { id: 'a', text: 'Uno' },
        { id: 'a', text: 'Dos' },
        { id: 'c', text: 'Tres' },
        { id: 'd', text: 'Cuatro' },
      ],
    };

    expect(() => parseQuestionFile([broken], 'gof.ts')).toThrow(/no se pueden repetir/);
  });

  it('exige código en los tipos que lo necesitan', () => {
    const broken = { ...validQuestion, type: 'find-violation' };

    expect(() => parseQuestionFile([broken], 'solid.ts')).toThrow(
      /necesita un snippet de código/,
    );
  });

  it('rechaza líneas resaltadas fuera del snippet', () => {
    const broken = {
      ...validQuestion,
      type: 'find-violation',
      code: { language: 'java', source: 'class A {}', highlightLines: [4] },
    };

    expect(() => parseQuestionFile([broken], 'solid.ts')).toThrow(
      /fuera del snippet/,
    );
  });

  it('rechaza explicaciones para opciones inexistentes', () => {
    const broken = {
      ...validQuestion,
      optionExplanations: { z: 'No existe' },
    };

    expect(() => parseQuestionFile([broken], 'gof.ts')).toThrow(
      /explica opciones que no existen/,
    );
  });

  it('rechaza dificultades fuera de 1..3', () => {
    const broken = { ...validQuestion, difficulty: 7 };

    expect(() => parseQuestionFile([broken], 'gof.ts')).toThrow(/difficulty|pregunta #1/);
  });
});
