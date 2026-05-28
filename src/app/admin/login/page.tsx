import { isAuthed } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Login',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect('/admin');
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.2), transparent 50%), #0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: 32,
          width: '100%',
          maxWidth: 360,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#fff',
            fontFamily: 'Sora, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          Tech<span style={{ color: '#60a5fa' }}>Indica</span>
        </h1>
        <p
          style={{
            margin: '4px 0 24px',
            color: '#94a3b8',
            fontSize: 13,
          }}
        >
          Painel administrativo. Faca login pra continuar.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
