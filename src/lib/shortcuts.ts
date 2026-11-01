export type ShortcutAction =
  | { type: 'select'; index: number }
  | { type: 'next' }
  | { type: 'hint' }
  | { type: 'none' };

export interface ShortcutState {
  revealed: boolean;
  optionCount: number;
  hasHint: boolean;
  /** Foco en un control: dejamos que el navegador maneje Enter y las teclas. */
  interactiveTarget: boolean;
}

/**
 * Traduce una tecla a una acción de la sesión.
 * `1`–`4` eligen opción, `Enter` avanza y `H` muestra la pista.
 */
export function shortcutFor(key: string, state: ShortcutState): ShortcutAction {
  if (state.interactiveTarget) return { type: 'none' };

  if (key === 'Enter') {
    return state.revealed ? { type: 'next' } : { type: 'none' };
  }

  if (key === 'h' || key === 'H') {
    if (state.revealed || !state.hasHint) return { type: 'none' };
    return { type: 'hint' };
  }

  if (/^[1-9]$/.test(key) && !state.revealed) {
    const index = Number(key) - 1;
    if (index < state.optionCount) return { type: 'select', index };
  }

  return { type: 'none' };
}

const INTERACTIVE_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A']);

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== 'object') return false;

  const element = target as HTMLElement & { isContentEditable?: boolean };
  if (element.isContentEditable) return true;

  return INTERACTIVE_TAGS.has(element.tagName);
}
