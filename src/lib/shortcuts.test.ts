import { describe, expect, it } from 'vitest';
import { isInteractiveTarget, shortcutFor, type ShortcutState } from './shortcuts';

const base: ShortcutState = {
  revealed: false,
  optionCount: 4,
  hasHint: true,
  interactiveTarget: false,
};

describe('shortcutFor', () => {
  it('elige una opción con 1–4', () => {
    expect(shortcutFor('1', base)).toEqual({ type: 'select', index: 0 });
    expect(shortcutFor('4', base)).toEqual({ type: 'select', index: 3 });
  });

  it('ignora números fuera del rango de opciones', () => {
    expect(shortcutFor('5', base)).toEqual({ type: 'none' });
    expect(shortcutFor('0', base)).toEqual({ type: 'none' });
  });

  it('no permite elegir después de responder', () => {
    expect(shortcutFor('2', { ...base, revealed: true })).toEqual({ type: 'none' });
  });

  it('Enter avanza solo cuando ya respondió', () => {
    expect(shortcutFor('Enter', base)).toEqual({ type: 'none' });
    expect(shortcutFor('Enter', { ...base, revealed: true })).toEqual({ type: 'next' });
  });

  it('H pide la pista solo si hay y no respondió', () => {
    expect(shortcutFor('h', base)).toEqual({ type: 'hint' });
    expect(shortcutFor('H', base)).toEqual({ type: 'hint' });
    expect(shortcutFor('h', { ...base, hasHint: false })).toEqual({ type: 'none' });
    expect(shortcutFor('h', { ...base, revealed: true })).toEqual({ type: 'none' });
  });

  it('no hace nada si el foco está en un control', () => {
    const focused = { ...base, interactiveTarget: true };

    expect(shortcutFor('1', focused)).toEqual({ type: 'none' });
    expect(shortcutFor('Enter', focused)).toEqual({ type: 'none' });
    expect(shortcutFor('h', focused)).toEqual({ type: 'none' });
  });

  it('ignora teclas sin acción', () => {
    expect(shortcutFor('a', base)).toEqual({ type: 'none' });
    expect(shortcutFor('Escape', base)).toEqual({ type: 'none' });
  });
});

describe('isInteractiveTarget', () => {
  it('detecta controles y enlaces', () => {
    expect(isInteractiveTarget(document.createElement('button'))).toBe(true);
    expect(isInteractiveTarget(document.createElement('input'))).toBe(true);
    expect(isInteractiveTarget(document.createElement('a'))).toBe(true);
    expect(isInteractiveTarget(document.createElement('div'))).toBe(false);
    expect(isInteractiveTarget(null)).toBe(false);
  });
});
