import type { Badge as BadgeType } from '@/schemas';

const CONFIG: Record<string, { bg: string; fg: string; label: string }> = {
  best:    { bg: '#fef3c7', fg: '#92400e', label: 'Editors Choice' },
  value:   { bg: '#dcfce7', fg: '#15803d', label: 'Melhor custo' },
  editor:  { bg: '#dbeafe', fg: '#1e40af', label: 'Recomendado' },
  ios:     { bg: '#f1f5f9', fg: '#0f172a', label: 'iOS' },
  android: { bg: '#dcfce7', fg: '#166534', label: 'Android' },
  popular: { bg: '#fce7f3', fg: '#9f1239', label: 'Popular' },
};

export function ProductBadge({ kind, size = 'sm' }: { kind: BadgeType | string; size?: 'sm' | 'md' }) {
  const cfg = CONFIG[kind];
  if (!cfg) return null;
  const padding = size === 'md' ? '5px 10px' : '3px 8px';
  const fontSize = size === 'md' ? 12 : 11;
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.fg,
        padding,
        borderRadius: 99,
        fontFamily: 'DM Sans, system-ui, sans-serif',
        fontSize,
        fontWeight: 600,
        display: 'inline-block',
      }}
    >
      {cfg.label}
    </span>
  );
}
