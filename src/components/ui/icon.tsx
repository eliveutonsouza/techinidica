import type { CSSProperties } from 'react';

const ICONS: Record<string, string> = {
  search: 'M11 17a6 6 0 100-12 6 6 0 000 12zM15 15l4 4',
  star: 'M12 2l3 7h7l-6 4 2 8-6-4-6 4 2-8-6-4h7z',
  check: 'M5 13l4 4 10-10',
  x: 'M6 6l12 12M18 6L6 18',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  eyeOff: 'M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A10.4 10.4 0 0112 5c6 0 10 7 10 7-1 1.6-2 3-3.4 4.2M6.6 6.6C3.9 8.4 2 12 2 12s4 7 10 7c1.4 0 2.7-.3 3.9-.8',
  watch: 'M16 5l-1-3H9L8 5v2H6v10h2v2l1 3h6l1-3v-2h2V7h-2V5zM10 9h4v6h-4z',
  headphones: 'M3 17v-5a9 9 0 1118 0v5M3 17a2 2 0 002 2h1v-7H5a2 2 0 00-2 2v3zm18 0a2 2 0 01-2 2h-1v-7h1a2 2 0 012 2v3z',
  laptop: 'M3 5h18v11H3zM2 19h20',
  monitor: 'M3 4h18v12H3zM10 20h4M12 16v4',
  tablet: 'M5 3h14v18H5zM11 18h2',
  smartphone: 'M7 3h10v18H7zM11 18h2',
  package: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8',
  sparkles: 'M5 3v4M3 5h4M19 17v4M17 19h4M12 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  refresh: 'M3 12a9 9 0 019-9c2.4 0 4.6 1 6.2 2.6L21 8M21 3v5h-5M21 12a9 9 0 01-9 9c-2.4 0-4.6-1-6.2-2.6L3 16M3 21v-5h5',
  play: 'M6 4l14 8-14 8z',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
  alert: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  trash: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2',
  externalLink: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
  plus: 'M12 5v14M5 12h14',
  menu: 'M3 6h18M3 12h18M3 18h18',
  arrowRight: 'M5 12h14M13 5l7 7-7 7',
  chevronDown: 'M6 9l6 6 6-6',
  shoppingCart: 'M3 3h2l3 12h13l3-8H6M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2z',
  instagram: 'M16 3H8a5 5 0 00-5 5v8a5 5 0 005 5h8a5 5 0 005-5V8a5 5 0 00-5-5zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01',
  twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 8v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.28 0-.55-.08-.83A7.72 7.72 0 0023 3z',
  youtube: 'M23 7.2a3 3 0 00-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.6A3 3 0 001 7.2C.5 9 .5 12 .5 12s0 3 .5 4.8a3 3 0 002.1 2.1C5 19.5 12 19.5 12 19.5s7 0 8.9-.6a3 3 0 002.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z',
};

export function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  style,
  className,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
