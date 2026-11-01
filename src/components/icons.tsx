import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5 8 14.5 16 5.5" />
    </svg>
  );
}

export function CrossIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 10H4M8.5 5.5 4 10l4.5 4.5" />
    </svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2.5a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9Z" />
      <path d="M8 16.5h4M8.5 18.5h3" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="3.4" />
      <path d="M10 1.8v1.6M10 16.6v1.6M1.8 10h1.6M16.6 10h1.6M4.2 4.2l1.1 1.1M14.7 14.7l1.1 1.1M15.8 4.2l-1.1 1.1M5.3 14.7l-1.1 1.1" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 12.2A6.5 6.5 0 0 1 7.8 4 6.5 6.5 0 1 0 16 12.2Z" />
    </svg>
  );
}

export function AutoThemeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 3.5v13" />
      <path d="M10 3.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
