'use client';

import { logout } from '@/actions/auth';
import { Icon } from '@/components/ui/icon';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 8,
          background: 'transparent',
          border: 'none',
          color: '#64748b',
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 12.5,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Icon name="x" size={12} />
        Sair
      </button>
    </form>
  );
}
