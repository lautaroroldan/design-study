import { beforeEach, describe, expect, it } from 'vitest';
import {
  THEME_STORAGE_KEY,
  applyTheme,
  nextThemePreference,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
} from './theme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('resolveTheme', () => {
  it('resuelve system según el sistema', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('respeta la preferencia explícita por encima del sistema', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});

describe('persistencia', () => {
  it('por defecto usa system', () => {
    expect(readThemePreference()).toBe('system');
  });

  it('guarda y lee la preferencia', () => {
    writeThemePreference('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(readThemePreference()).toBe('dark');
  });

  it('ignora valores desconocidos', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'violeta');
    expect(readThemePreference()).toBe('system');
  });
});

describe('nextThemePreference', () => {
  it('cicla auto, claro, oscuro', () => {
    expect(nextThemePreference('system')).toBe('light');
    expect(nextThemePreference('light')).toBe('dark');
    expect(nextThemePreference('dark')).toBe('system');
  });
});

describe('applyTheme', () => {
  it('agrega la clase dark en el documento', () => {
    expect(applyTheme('dark')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('la quita al volver a claro', () => {
    applyTheme('dark');
    applyTheme('light');

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
