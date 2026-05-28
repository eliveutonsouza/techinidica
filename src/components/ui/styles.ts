import type { CSSProperties } from 'react';

export const primaryBtn: CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: 8,
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: 13.5,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

export const primaryAdminBtn: CSSProperties = {
  ...primaryBtn,
  padding: '8px 14px',
  fontSize: 13,
};

export const ghostBtn: CSSProperties = {
  background: '#fff',
  color: '#0f172a',
  border: '1px solid #e5e7eb',
  padding: '8px 14px',
  borderRadius: 8,
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

export const dangerBtn: CSSProperties = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: 8,
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: 13.5,
  outline: 'none',
  background: '#fff',
  color: '#0f172a',
};

export const codeStyle: CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11.5,
  background: '#f1f5f9',
  padding: '1px 5px',
  borderRadius: 4,
  color: '#0f172a',
};

export const colors = {
  bg: '#ffffff',
  fg: '#0f172a',
  muted: '#64748b',
  border: '#e5e7eb',
  primary: '#2563eb',
  shopee: '#f05d23',
  ml: '#fff159',
  success: '#16a34a',
  warning: '#a16207',
  danger: '#dc2626',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
};

export const fonts = {
  sora: 'Sora, system-ui, sans-serif',
  body: 'DM Sans, system-ui, sans-serif',
  mono: 'JetBrains Mono, monospace',
};

export const GRADIENTS: Record<string, [string, string]> = {
  smartwatches: ['#0ea5e9', '#6366f1'],
  fones: ['#f43f5e', '#ec4899'],
  notebooks: ['#10b981', '#0d9488'],
  monitores: ['#8b5cf6', '#6366f1'],
  tablets: ['#f59e0b', '#ea580c'],
  smartphones: ['#3b82f6', '#06b6d4'],
};
