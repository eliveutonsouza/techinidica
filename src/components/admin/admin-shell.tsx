import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/icon';
import { LogoutButton } from './logout-button';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'package', href: '/admin' },
  { key: 'produtos', label: 'Produtos', icon: 'shoppingCart', href: '/admin/produtos' },
  { key: 'automacao', label: 'Automacao', icon: 'zap', href: '/admin/automacao' },
  { key: 'config', label: 'Configuracoes', icon: 'menu', href: '/admin/config' },
] as const;

export function AdminShell({
  current,
  title,
  subtitle,
  actions,
  children,
}: {
  current: 'dashboard' | 'produtos' | 'automacao' | 'config';
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside
        style={{
          width: 232,
          background: '#0f172a',
          color: '#cbd5e1',
          padding: '20px 16px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Link
          href="/admin"
          style={{
            fontFamily: 'Sora, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: '#fff',
            textDecoration: 'none',
            marginBottom: 24,
            paddingLeft: 8,
          }}
        >
          Tech<span style={{ color: '#60a5fa' }}>Indica</span>
        </Link>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((n) => {
            const active = n.key === current;
            return (
              <Link
                key={n.key}
                href={n.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: 13.5,
                  color: active ? '#fff' : '#94a3b8',
                  background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                }}
              >
                <Icon name={n.icon} size={15} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 12.5,
              color: '#64748b',
            }}
          >
            <Icon name="externalLink" size={12} />
            Ver site publico
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main style={{ flex: 1, padding: '24px 32px' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24,
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Sora, system-ui, sans-serif',
                fontSize: 22,
                margin: 0,
                color: '#0f172a',
                fontWeight: 600,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: 13.5,
                  color: '#64748b',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
        </header>
        {children}
      </main>
    </div>
  );
}
