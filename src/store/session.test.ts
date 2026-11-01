import { beforeEach, describe, expect, it } from 'vitest';
import type { Question, SessionConfig } from '../types';
import { useProgressStore } from './progress';
import { useSessionStore } from './session';

function makeQuestion(id: string): Question {
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
    correctOptionId: 'b',
    explanation: 'Porque sí.',
  };
}

const bank: Question[] = [makeQuestion('gof-1'), makeQuestion('gof-2')];

function makeConfig(): SessionConfig {
  return {
    topics: ['gof'],
    tags: [],
    count: 'all',
    type: 'all',
    lang: 'both',
    difficulty: 'all',
    order: 'fixed',
  };
}

beforeEach(() => {
  useSessionStore.getState().reset();
  useProgressStore.getState().reset();
});

describe('store de sesión', () => {
  it('arranca sin registrar intentos', () => {
    const created = useSessionStore.getState().start(makeConfig(), bank);

    expect(created).toBe(2);
    expect(useProgressStore.getState().questions).toEqual({});
  });

  it('registra el intento correcto en el progreso', () => {
    useSessionStore.getState().start(makeConfig(), bank);
    useSessionStore.getState().answer('b');

    const entry = useProgressStore.getState().questions['gof-1'];

    expect(entry).toMatchObject({ attempts: 1, correct: 1, lastCorrect: true });
    expect(entry.lastAttemptAt).toBeTruthy();
  });

  it('registra el intento incorrecto', () => {
    useSessionStore.getState().start(makeConfig(), bank);
    useSessionStore.getState().answer('a');

    expect(useProgressStore.getState().questions['gof-1']).toMatchObject({
      attempts: 1,
      correct: 0,
      lastCorrect: false,
    });
  });

  it('no registra dos veces la misma pregunta en una sesión', () => {
    useSessionStore.getState().start(makeConfig(), bank);
    useSessionStore.getState().answer('a');
    useSessionStore.getState().answer('b');

    expect(useProgressStore.getState().questions['gof-1'].attempts).toBe(1);
  });

  it('acumula intentos entre sesiones', () => {
    useSessionStore.getState().start(makeConfig(), bank);
    useSessionStore.getState().answer('b');

    useSessionStore.getState().start(makeConfig(), bank);
    useSessionStore.getState().answer('a');

    expect(useProgressStore.getState().questions['gof-1']).toMatchObject({
      attempts: 2,
      correct: 1,
      lastCorrect: false,
    });
  });

  it('avanza solo si la pregunta fue respondida', () => {
    useSessionStore.getState().start(makeConfig(), bank);

    useSessionStore.getState().next();
    expect(useSessionStore.getState().currentIndex).toBe(0);

    useSessionStore.getState().answer('b');
    useSessionStore.getState().next();
    expect(useSessionStore.getState().currentIndex).toBe(1);
  });

  it('termina cuando se avanza en la última pregunta', () => {
    useSessionStore.getState().start(makeConfig(), bank);
    useSessionStore.getState().answer('b');
    useSessionStore.getState().next();
    useSessionStore.getState().answer('b');
    useSessionStore.getState().next();

    expect(useSessionStore.getState().status).toBe('finished');
  });
});
