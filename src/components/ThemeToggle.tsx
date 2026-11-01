import { useEffect, useState } from 'react';
import {
  THEME_LABELS,
  applyTheme,
  nextThemePreference,
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from '../lib/theme';
import { AutoThemeIcon, MoonIcon, SunIcon } from './icons';

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  const className = 'h-4 w-4';

  if (preference === 'light') return <SunIcon className={className} />;
  if (preference === 'dark') return <MoonIcon className={className} />;
  return <AutoThemeIcon className={className} />;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    readThemePreference(),
  );

  useEffect(() => {
    applyTheme(preference);
    writeThemePreference(preference);

    // Con "Auto" el tema sigue al sistema en vivo.
    if (preference !== 'system' || typeof window.matchMedia !== 'function') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  const next = nextThemePreference(preference);

  return (
    <button
      type="button"
      onClick={() => setPreference(next)}
      aria-label={`Tema: ${THEME_LABELS[preference]}. Cambiar a ${THEME_LABELS[next]}.`}
      title={`Tema: ${THEME_LABELS[preference]}`}
      className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-2 text-[12px] text-ink-3 transition-colors duration-150 hover:bg-inset hover:text-ink"
    >
      <ThemeIcon preference={preference} />
      <span className="hidden md:inline">{THEME_LABELS[preference]}</span>
    </button>
  );
}
