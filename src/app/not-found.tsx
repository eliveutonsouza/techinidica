import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontFamily: 'Sora, system-ui, sans-serif',
          fontSize: 48,
          margin: 0,
          color: '#0f172a',
        }}
      >
        404
      </h1>
      <p style={{ color: '#64748b', marginTop: 8 }}>Pagina nao encontrada.</p>
      <Link
        href="/"
        style={{
          marginTop: 16,
          background: '#2563eb',
          color: '#fff',
          textDecoration: 'none',
          padding: '10px 18px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Voltar para o inicio
      </Link>
    </main>
  );
}
