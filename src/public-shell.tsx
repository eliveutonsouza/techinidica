import React from 'react';
// Public site shell: Header, Footer
const { useState: usePubState, useEffect: usePubEffect } = React;

function Logo({ size = 28 }) {
  return (
    <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <span style={{
        width: size, height: size, borderRadius: 8,
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
        position: 'relative',
      }}>
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </span>
      <span style={{
        fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 18, color: '#0f172a',
        letterSpacing: -0.2,
      }}>
        Tech<span style={{ color: '#2563eb' }}>Indica</span>
      </span>
    </a>
  );
}

function PublicHeader({ current = null }) {
  const [searchOpen, setSearchOpen] = usePubState(false);
  const [scrolled, setScrolled] = usePubState(false);
  usePubEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
      transition: 'border 0.2s',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <Logo />

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }}
            style={navLinkStyle(current === 'home')}>
            Home
          </a>
          {window.CATEGORIES.slice(0, 4).map((c) => (
            <a key={c.slug} href={`#/categoria/${c.slug}`}
              onClick={(e) => { e.preventDefault(); window.navigate(`/categoria/${c.slug}`); }}
              style={navLinkStyle(current === c.slug)}>
              {c.nome}
            </a>
          ))}
          <CategoriesMore current={current} />
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <window.Tooltip content="Buscar">
            <button onClick={() => setSearchOpen(true)} style={iconBtnStyle}>
              <window.Icon name="search" size={18} />
            </button>
          </window.Tooltip>
          <window.Tooltip content="Tema (em breve)">
            <button style={iconBtnStyle}>
              <window.Icon name="sun" size={18} />
            </button>
          </window.Tooltip>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function CategoriesMore({ current }) {
  const [open, setOpen] = usePubState(false);
  const rest = window.CATEGORIES.slice(4);
  const isActive = rest.some((c) => c.slug === current);
  return (
    <span style={{ position: 'relative' }} onMouseLeave={() => setOpen(false)}>
      <button onMouseEnter={() => setOpen(true)}
        style={{ ...navLinkStyle(isActive), background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Mais <window.Icon name="chevronDown" size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-50%)',
          background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
          boxShadow: '0 12px 32px rgba(0,0,0,0.08)', padding: 6, minWidth: 200, zIndex: 10,
        }}>
          {rest.map((c) => (
            <a key={c.slug} href={`#/categoria/${c.slug}`}
              onClick={(e) => { e.preventDefault(); setOpen(false); window.navigate(`/categoria/${c.slug}`); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#0f172a',
                textDecoration: 'none', borderRadius: 8, fontWeight: 500,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <window.Icon name={c.icone} size={16} style={{ color: '#64748b' }} />
              {c.nome}
            </a>
          ))}
        </div>
      )}
    </span>
  );
}

function SearchModal({ open, onClose }) {
  const [q, setQ] = usePubState('');
  const results = q.trim().length >= 2
    ? window.PRODUTOS.filter((p) => p.publicado && p.nome.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : [];
  usePubEffect(() => { if (!open) setQ(''); }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(2px)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '12vh 16px 16px',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 14, width: '100%', maxWidth: 580,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          <window.Icon name="search" size={18} style={{ color: '#64748b' }} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produtos..."
            style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'DM Sans, system-ui', fontSize: 15 }} />
          <kbd style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#64748b', background: '#f1f5f9', padding: '3px 6px', borderRadius: 4 }}>ESC</kbd>
        </div>
        <div style={{ padding: 8, maxHeight: 380, overflow: 'auto' }}>
          {results.length === 0 && q.trim().length >= 2 && (
            <div style={{ padding: 24, textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#64748b' }}>
              Nenhum produto encontrado para "{q}".
            </div>
          )}
          {q.trim().length < 2 && (
            <div style={{ padding: 12 }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, padding: '4px 10px' }}>
                Categorias populares
              </div>
              {window.CATEGORIES.slice(0, 4).map((c) => (
                <a key={c.slug} href={`#/categoria/${c.slug}`}
                  onClick={(e) => { e.preventDefault(); onClose(); window.navigate(`/categoria/${c.slug}`); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', textDecoration: 'none', borderRadius: 8, fontFamily: 'DM Sans, system-ui', color: '#0f172a' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <window.Icon name={c.icone} size={18} style={{ color: '#64748b' }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{c.nome}</span>
                </a>
              ))}
            </div>
          )}
          {results.map((p) => (
            <a key={p.id} href={`#/produto/${p.id}`}
              onClick={(e) => { e.preventDefault(); onClose(); window.navigate(`/produto/${p.id}`); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, textDecoration: 'none', borderRadius: 8 }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <window.ProductImage produto={p} height={48} rounded={8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#0f172a', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{p.nome}</div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b' }}>R$ {p.preco_atual.toFixed(2).replace('.', ',')} · nota {p.nota?.toFixed(1)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const navLinkStyle = (active) => ({
  fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 500,
  color: active ? '#0f172a' : '#475569',
  textDecoration: 'none', padding: '8px 14px', borderRadius: 8,
  background: active ? '#f1f5f9' : 'transparent',
  transition: 'background 0.15s, color 0.15s',
});

const iconBtnStyle = {
  background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: 8, cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// =============================================================================
// FOOTER
// =============================================================================
function PublicFooter() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb', marginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <window.AffiliateDisclosure />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <Logo />
            <p style={{
              margin: '14px 0 16px', fontFamily: 'DM Sans, system-ui', fontSize: 14,
              color: '#64748b', lineHeight: 1.6, maxWidth: 320,
            }}>
              Recomendações técnicas honestas de produtos de tecnologia. Atualizadas com especificações reais e preços direto da Shopee.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['instagram', 'twitter', 'youtube'].map((s) => (
                <a key={s} href="#" style={{ ...iconBtnStyle, textDecoration: 'none' }}>
                  <window.Icon name={s} size={16} />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Categorias" links={window.CATEGORIES.slice(0, 4).map((c) => ({ label: c.nome, href: `#/categoria/${c.slug}`, slug: c.slug }))} />
          <FooterCol title="Mais" links={window.CATEGORIES.slice(4).map((c) => ({ label: c.nome, href: `#/categoria/${c.slug}`, slug: c.slug }))} />
          <FooterCol title="Sobre" links={[
            { label: 'Como recomendamos', href: '#' },
            { label: 'Política de afiliados', href: '#' },
            { label: 'Privacidade', href: '#' },
            { label: 'Contato', href: '#' },
          ]} />
        </div>
        <div style={{
          marginTop: 32, paddingTop: 20, borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#94a3b8',
        }}>
          <span>© 2026 TechIndica. Todos os direitos reservados.</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>v1.0.0 — Última coleta: hoje às 07:14</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 style={{
        margin: '0 0 14px', fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 12,
        color: '#0f172a', textTransform: 'uppercase', letterSpacing: 0.6,
      }}>{title}</h4>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href}
              onClick={l.slug ? (e) => { e.preventDefault(); window.navigate(`/categoria/${l.slug}`); } : undefined}
              style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#475569', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

Object.assign(window, { Logo, PublicHeader, PublicFooter });
