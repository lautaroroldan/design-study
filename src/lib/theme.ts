export type ThemePreference = 'system' | 'light' | 'dark';

export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'design-study:theme';

/**
 * Se lee también desde el script inline de index.html para aplicar el tema
 * antes del primer paint y evitar el flash.
 */
export function readThemePreference(storage: Storage | undefined = safeStorage()): ThemePreference {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function writeThemePreference(
  preference: ThemePreference,
  storage: Storage | undefined = safeStorage(),
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage bloqueado: la preferencia vive solo en memoria.
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

export function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(
  preference: ThemePreference,
  systemDark: boolean = systemPrefersDark(),
): ResolvedTheme {
  if (preference === 'system') return systemDark ? 'dark' : 'light';
  return preference;
}

/** Aplica el tema al documento y devuelve el tema efectivo. */
export function applyTheme(preference: ThemePreference): ResolvedTheme {
  const resolved = resolveTheme(preference);

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }

  return resolved;
}

/** Auto → Claro → Oscuro → Auto. */
export function nextThemePreference(preference: ThemePreference): ThemePreference {
  if (preference === 'system') return 'light';
  if (preference === 'light') return 'dark';
  return 'system';
}

export const THEME_LABELS: Record<ThemePreference, string> = {
  system: 'Auto',
  light: 'Claro',
  dark: 'Oscuro',
};
