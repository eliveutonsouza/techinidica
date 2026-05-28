import type { CSSProperties, ReactNode } from 'react';

export function Card({
  children,
  padding = 20,
  style,
}: {
  children: ReactNode;
  padding?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h3
        style={{
          margin: 0,
          fontFamily: 'Sora, system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 15,
          color: '#0f172a',
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            margin: '4px 0 0',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 12.5,
            color: '#64748b',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
