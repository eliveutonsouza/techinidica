import React from 'react';
import { createRoot } from 'react-dom/client';
// Router + main app
const { useState: useAppState, useEffect: useAppEffect } = React;

function App() {
  const [route, setRoute] = useAppState(parseHash());

  useAppEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // expose nav helper to other components
  window.navigate = (path) => { window.location.hash = '#' + path; };

  // admin auth gate
  const isAuth = () => localStorage.getItem('techindica:auth') === '1';

  if (route.path === '/') return <window.HomePage />;
  if (route.path.startsWith('/categoria/')) {
    const slug = route.path.split('/')[2];
    return <window.CategoriaPage slug={slug} />;
  }
  if (route.path.startsWith('/produto/')) {
    const id = route.path.split('/')[2];
    return <window.ProdutoPage id={id} />;
  }
  if (route.path === '/admin/login') {
    return <window.AdminLogin />;
  }
  if (route.path.startsWith('/admin')) {
    if (!isAuth()) return <window.AdminLogin />;
    if (route.path === '/admin' || route.path === '/admin/') return <window.AdminDashboard />;
    if (route.path === '/admin/produtos') return <window.AdminProdutos />;
    if (route.path === '/admin/automacao') return <window.AdminAutomacao />;
    if (route.path === '/admin/config') return <window.AdminConfig />;
  }

  // Fallback: home
  return <window.HomePage />;
}

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  return { path: raw };
}

function DemoNav() {
  const [open, setOpen] = useAppState(false);
  const items = [
    { group: 'Site público', links: [
      { label: 'Home', path: '/' },
      { label: 'Categoria · Smartwatches', path: '/categoria/smartwatches' },
      { label: 'Categoria · Fones', path: '/categoria/fones' },
      { label: 'Produto · Mi Band 8 Pro', path: '/produto/101' },
      { label: 'Produto · Sony WF-C700N', path: '/produto/202' },
    ]},
    { group: 'Admin (privado)', links: [
      { label: 'Login', path: '/admin/login' },
      { label: 'Dashboard', path: '/admin' },
      { label: 'Produtos', path: '/admin/produtos' },
      { label: 'Automação', path: '/admin/automacao' },
      { label: 'Configurações', path: '/admin/config' },
    ]},
  ];
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: 16, left: 16, zIndex: 9000,
        background: '#0f172a', color: '#fff', border: 'none',
        padding: '10px 14px', borderRadius: 99,
        fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 7,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      }}>
        <window.Icon name="menu" size={13} />
        {open ? 'Fechar mapa' : 'Mapa do protótipo'}
      </button>
      {open && (
        <div style={{
          position: 'fixed', bottom: 64, left: 16, zIndex: 9000,
          background: '#0f172a', borderRadius: 14, padding: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          minWidth: 260, color: '#cbd5e1',
        }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Navegação · protótipo
          </div>
          {items.map((g) => (
            <div key={g.group} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, marginBottom: 6 }}>
                {g.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {g.links.map((l) => (
                  <a key={l.path} href={`#${l.path}`}
                    onClick={(e) => { e.preventDefault(); window.navigate(l.path); setOpen(false); }}
                    style={{
                      fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#cbd5e1',
                      textDecoration: 'none', padding: '5px 8px', borderRadius: 6,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
            Este menu é apenas para demonstração. No produto real, a rota <code style={{ color: '#93c5fd' }}>/admin/login</code> é acessada via URL direta.
          </div>
        </div>
      )}
    </>
  );
}

function Root() {
  return (
    <window.ToastProvider>
      <App />
      <DemoNav />
    </window.ToastProvider>
  );
}

createRoot(document.getElementById('app')!).render(<Root />);
