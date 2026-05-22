import React from 'react';
// Public pages: Home, Categoria, Produto
const { useState: usePageState, useEffect: usePageEffect, useMemo: usePageMemo } = React;

// =============================================================================
// HOMEPAGE
// =============================================================================
function HomePage() {
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const destaques = window.PRODUTOS.filter((p) => p.publicado && p.destaque).slice(0, 6);
  const editorPick = destaques.find((p) => p.badge === 'editor') || destaques[0];

  return (
    <div>
      <window.PublicHeader current="home" />

      {/* Hero */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 28px 40px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#eff6ff', color: '#1e40af', padding: '5px 12px', borderRadius: 99,
          fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 600,
          marginBottom: 18,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
          Atualizado em {today}
        </span>
        <h1 style={{
          margin: '0 auto 18px', fontFamily: 'Sora, system-ui', fontWeight: 700,
          fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1.08, letterSpacing: -1.2,
          color: '#0f172a', maxWidth: 880, textWrap: 'balance',
        }}>
          As melhores compras de{' '}
          <span style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>tecnologia</span> em 2026
        </h1>
        <p style={{
          margin: '0 auto', fontFamily: 'DM Sans, system-ui', fontSize: 17, color: '#475569',
          lineHeight: 1.55, maxWidth: 620, textWrap: 'pretty',
        }}>
          Recomendações técnicas honestas com ficha técnica real, prós, contras e os melhores preços da Shopee e do Mercado Livre. Sem patrocínio escondido.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 40, marginTop: 36,
          flexWrap: 'wrap',
        }}>
          {[
            { value: '120+', label: 'produtos analisados' },
            { value: '6', label: 'categorias' },
            { value: '07:14', label: 'última coleta automática' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 28, color: '#0f172a', letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 28px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <span style={{
            fontFamily: 'Sora, system-ui', fontSize: 11, color: '#64748b', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 1.2,
          }}>Explore por categoria</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', maxWidth: 880, margin: '0 auto',
        }}>
          {window.CATEGORIES.map((c) => (
            <a key={c.slug} href={`#/categoria/${c.slug}`}
              onClick={(e) => { e.preventDefault(); window.navigate(`/categoria/${c.slug}`); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 99,
                padding: '10px 18px', textDecoration: 'none',
                fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 500, color: '#334155',
                boxShadow: '0 1px 2px rgba(15,23,42,0.03)',
                transition: 'border-color 0.15s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 7,
                background: `linear-gradient(135deg, ${window.GRADIENTS[c.slug][0]} 0%, ${window.GRADIENTS[c.slug][2]} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                <window.Icon name={c.icone} size={14} strokeWidth={2.5} />
              </span>
              {c.nome}
            </a>
          ))}
        </div>
      </section>

      {/* Main grid: products + sidebar */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* Left column — destaques grid */}
          <div>
            <SectionHeader title="Destaques da semana" subtitle="Selecionados pela IA com base em nota, desconto e popularidade" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
              {destaques.map((p, i) => <window.ProductCard key={p.id} produto={p} posicao={i + 1} />)}
            </div>

            {/* Section by category — Smartwatches */}
            <div style={{ marginTop: 40 }}>
              <SectionByCategory slug="smartwatches" />
            </div>
            <div style={{ marginTop: 40 }}>
              <SectionByCategory slug="fones" />
            </div>
            <div style={{ marginTop: 40 }}>
              <SectionByCategory slug="notebooks" />
            </div>

            {/* Pagination preview */}
            <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 4 }}>
              {[1, 2, 3].map((n) => (
                <button key={n} style={{
                  background: n === 1 ? '#2563eb' : '#fff', color: n === 1 ? '#fff' : '#0f172a',
                  border: '1px solid', borderColor: n === 1 ? '#2563eb' : '#e5e7eb',
                  borderRadius: 8, padding: '8px 12px', fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  minWidth: 36,
                }}>
                  {n}
                </button>
              ))}
              <span style={{ padding: '8px 4px', fontFamily: 'DM Sans, system-ui', color: '#94a3b8' }}>…</span>
              <button style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <window.Icon name="chevronRight" size={14} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 88 }}>
            <SidebarAbout />
            <SidebarFeatured produto={editorPick} />
            <SidebarTopPicks />
            <SidebarSources />
            <SidebarNewsletter />
          </aside>
        </div>
      </section>

      <window.PublicFooter />
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 22, color: '#0f172a', letterSpacing: -0.4 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#64748b' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function SectionByCategory({ slug }) {
  const cat = window.CATEGORIES.find((c) => c.slug === slug);
  const products = window.PRODUTOS.filter((p) => p.publicado && p.categoria === slug).slice(0, 3);
  if (products.length === 0) return null;
  return (
    <div>
      <SectionHeader
        title={`Melhores ${cat.nome.toLowerCase()}`}
        subtitle={`Top ${products.length} avaliados em ficha técnica e custo-benefício`}
        action={
          <a href={`#/categoria/${slug}`}
            onClick={(e) => { e.preventDefault(); window.navigate(`/categoria/${slug}`); }}
            style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Ver todos <window.Icon name="arrowRight" size={13} />
          </a>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {products.map((p, i) => <window.ProductCard key={p.id} produto={p} posicao={i + 1} />)}
      </div>
    </div>
  );
}

// ============= SIDEBAR CARDS =============
function SidebarCard({ children, padding = 22 }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding }}>
      {children}
    </div>
  );
}

function SidebarLabel({ children }) {
  return (
    <div style={{ fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function SidebarAbout() {
  return (
    <SidebarCard>
      <SidebarLabel>Sobre o site</SidebarLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>
          <window.Icon name="zap" size={22} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 15, color: '#0f172a' }}>TechIndica</div>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Recomendações técnicas</div>
        </div>
      </div>
      <p style={{ margin: 0, fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#475569', lineHeight: 1.55 }}>
        Comparamos ficha técnica real e custo-benefício, não opiniões. Análises atualizadas todo dia com dados direto da Shopee Affiliates API e geradas com GPT-4o.
      </p>
      <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
        {[
          { icon: 'twitter', href: '#' },
          { icon: 'instagram', href: '#' },
          { icon: 'youtube', href: '#' },
        ].map((s) => (
          <a key={s.icon} href={s.href} style={{
            width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', textDecoration: 'none',
          }}>
            <window.Icon name={s.icon} size={14} />
          </a>
        ))}
      </div>
    </SidebarCard>
  );
}

function SidebarFeatured({ produto }) {
  if (!produto) return null;
  return (
    <SidebarCard padding={0}>
      <div style={{ padding: '22px 22px 0' }}>
        <SidebarLabel>Editor's pick</SidebarLabel>
      </div>
      <div onClick={() => window.navigate(`/produto/${produto.id}`)}
        style={{ cursor: 'pointer', position: 'relative', margin: '0 22px', borderRadius: 12, overflow: 'hidden' }}>
        <window.ProductImage produto={produto} height={180} rounded={12} />
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <window.Badge kind={produto.badge} size="sm" />
        </div>
      </div>
      <div style={{ padding: '14px 22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#64748b', fontWeight: 500, marginBottom: 6 }}>
          <window.Icon name="clock" size={12} />
          <span>publicado há 2 dias</span>
        </div>
        <h4 style={{
          margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 15, color: '#0f172a', lineHeight: 1.35,
        }}>{produto.nome}</h4>
      </div>
    </SidebarCard>
  );
}

function SidebarTopPicks() {
  const top = window.PRODUTOS.filter((p) => p.publicado).slice(0, 3);
  return (
    <SidebarCard>
      <SidebarLabel>Top da semana</SidebarLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top.map((p, i) => (
          <a key={p.id} href={`#/produto/${p.id}`}
            onClick={(e) => { e.preventDefault(); window.navigate(`/produto/${p.id}`); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{
              fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 22, color: '#cbd5e1',
              width: 24, textAlign: 'center',
            }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#0f172a', fontWeight: 500, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.nome}
              </div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b', marginTop: 2 }}>
                nota {p.nota.toFixed(1)} · R$ {p.preco_atual.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </a>
        ))}
      </div>
    </SidebarCard>
  );
}

function SidebarSources() {
  const sources = [
    { name: 'Shopee Affiliates', sub: 'API GraphQL · HMAC-SHA1', icon: '🛒', color: '#f05d23' },
    { name: 'OpenAI GPT-4o', sub: 'Análise técnica em PT-BR', icon: '✨', color: '#10a37f' },
    { name: 'Mercado Livre', sub: 'Em breve · Integração ML', icon: '🟡', color: '#fff159' },
  ];
  return (
    <SidebarCard>
      <SidebarLabel>Como funcionamos</SidebarLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sources.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: s.color, opacity: 0.95,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 13.5, color: '#0f172a' }}>{s.name}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </SidebarCard>
  );
}

function SidebarNewsletter() {
  const { toast } = window.useToast();
  const [email, setEmail] = usePageState('');
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('E-mail inválido'); return; }
    toast.success('Inscrição confirmada!', { description: 'Você receberá as próximas ofertas no e-mail.' });
    setEmail('');
  };
  return (
    <SidebarCard>
      <SidebarLabel>Receba as ofertas</SidebarLabel>
      <p style={{ margin: '0 0 12px', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
        Toda quinta, um resumo das melhores quedas de preço da semana.
      </p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="seu@email.com"
          style={{
            padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
            fontFamily: 'DM Sans, system-ui', fontSize: 13.5, outline: 'none',
          }}
        />
        <button type="submit" style={{
          padding: '10px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8,
          fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
        }}>
          Quero receber
        </button>
      </form>
      <div style={{ marginTop: 10, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#94a3b8' }}>
        Sem spam. Cancele com um clique.
      </div>
    </SidebarCard>
  );
}

// =============================================================================
// CATEGORIA PAGE
// =============================================================================
function CategoriaPage({ slug }) {
  const cat = window.CATEGORIES.find((c) => c.slug === slug);
  const all = window.PRODUTOS.filter((p) => p.publicado && p.categoria === slug);

  const [sort, setSort] = usePageState('nota');
  const [maxPrice, setMaxPrice] = usePageState(5000);
  const [plat, setPlat] = usePageState('all');

  const filtered = usePageMemo(() => {
    let r = all.filter((p) => p.preco_atual <= maxPrice);
    if (plat !== 'all') r = r.filter((p) => p.plataforma === plat);
    const sorters = {
      nota: (a, b) => b.nota - a.nota,
      desconto: (a, b) => b.desconto_pct - a.desconto_pct,
      barato: (a, b) => a.preco_atual - b.preco_atual,
      caro: (a, b) => b.preco_atual - a.preco_atual,
    };
    return [...r].sort(sorters[sort]);
  }, [all, sort, maxPrice, plat]);

  if (!cat) {
    return (
      <div>
        <window.PublicHeader />
        <div style={{ maxWidth: 1280, margin: '60px auto', padding: 28, textAlign: 'center', fontFamily: 'DM Sans, system-ui', color: '#64748b' }}>
          Categoria não encontrada.
        </div>
      </div>
    );
  }

  return (
    <div>
      <window.PublicHeader current={slug} />

      {/* Page header */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px 24px' }}>
        <nav style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', marginBottom: 18 }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0f172a' }}>{cat.nome}</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <span style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${window.GRADIENTS[slug][0]} 0%, ${window.GRADIENTS[slug][2]} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: `0 8px 20px ${window.GRADIENTS[slug][2]}40`,
          }}>
            <window.Icon name={cat.icone} size={24} strokeWidth={2.2} />
          </span>
          <div>
            <h1 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 36, color: '#0f172a', letterSpacing: -0.8 }}>
              Top {cat.nome.toLowerCase()} para comprar em 2026
            </h1>
            <p style={{ margin: '4px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 15, color: '#64748b' }}>
              {all.length} produtos avaliados · ordenados por nota
            </p>
          </div>
        </div>
      </section>

      {/* Filters bar */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 24px' }}>
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14,
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
            <window.Icon name="filter" size={14} /> Filtros
          </span>
          <FilterGroup label="Plataforma">
            {[
              { v: 'all', l: 'Todas' },
              { v: 'shopee', l: 'Shopee' },
              { v: 'mercadolivre', l: 'Mercado Livre' },
            ].map((o) => (
              <Chip key={o.v} active={plat === o.v} onClick={() => setPlat(o.v)}>{o.l}</Chip>
            ))}
          </FilterGroup>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b', fontWeight: 500 }}>Até R$</span>
            <input type="range" min={100} max={5000} step={100} value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: 140, accentColor: '#2563eb' }} />
            <span style={{ fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 13, color: '#0f172a', minWidth: 70 }}>
              {maxPrice.toLocaleString('pt-BR')}
            </span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b' }}>Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
              padding: '7px 28px 7px 10px', border: '1px solid #e5e7eb', borderRadius: 8,
              fontFamily: 'DM Sans, system-ui', fontSize: 13, background: '#fff', cursor: 'pointer',
            }}>
              <option value="nota">Maior nota</option>
              <option value="desconto">Maior desconto</option>
              <option value="barato">Menor preço</option>
              <option value="caro">Maior preço</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '4px 28px 40px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb' }}>
            <window.Icon name="package" size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, color: '#0f172a' }}>Nenhum produto encontrado</h3>
            <p style={{ margin: '6px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#64748b' }}>
              Tente ajustar os filtros acima.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {filtered.map((p, i) => <window.ProductCard key={p.id} produto={p} posicao={i + 1} />)}
          </div>
        )}
      </section>

      <window.PublicFooter />
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </div>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#334155',
      border: '1px solid', borderColor: active ? '#0f172a' : '#e5e7eb',
      padding: '6px 12px', borderRadius: 99,
      fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 500,
      cursor: 'pointer',
    }}>
      {children}
    </button>
  );
}

// =============================================================================
// PRODUTO PAGE
// =============================================================================
function ProdutoPage({ id }) {
  const produto = window.PRODUTOS.find((p) => p.id === Number(id));
  const { toast } = window.useToast();
  const [showDiscloseModal, setShowDiscloseModal] = usePageState(false);

  usePageEffect(() => {
    const handler = (e) => {
      const { kind, produto: p } = e.detail;
      toast.info(`Redirecionando para ${kind === 'shopee' ? 'Shopee' : 'Mercado Livre'}…`, { description: p.nome.slice(0, 50) + '…', duration: 2500 });
    };
    window.addEventListener('product:click', handler);
    return () => window.removeEventListener('product:click', handler);
  }, [toast]);

  if (!produto) {
    return (
      <div>
        <window.PublicHeader />
        <div style={{ maxWidth: 800, margin: '60px auto', padding: 28, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Sora, system-ui', color: '#0f172a' }}>Produto não encontrado</h2>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }} style={{ color: '#2563eb', fontFamily: 'DM Sans, system-ui' }}>← Voltar para a home</a>
        </div>
      </div>
    );
  }

  const cat = window.CATEGORIES.find((c) => c.slug === produto.categoria);
  const related = window.PRODUTOS.filter((p) => p.publicado && p.categoria === produto.categoria && p.id !== produto.id).slice(0, 3);

  return (
    <div>
      <window.PublicHeader current={produto.categoria} />

      <article style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px 40px' }}>
        {/* Breadcrumb */}
        <nav style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', marginBottom: 22 }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href={`#/categoria/${cat.slug}`} onClick={(e) => { e.preventDefault(); window.navigate(`/categoria/${cat.slug}`); }} style={{ color: '#64748b', textDecoration: 'none' }}>{cat.nome}</a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0f172a' }}>{produto.nome.slice(0, 40)}…</span>
        </nav>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 36, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 88 }}>
            <window.ProductImage produto={produto} height={400} big />
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  width: 70, height: 70, borderRadius: 8, border: i === 0 ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  overflow: 'hidden', cursor: 'pointer', opacity: i === 0 ? 1 : 0.6,
                }}>
                  <window.ProductImage produto={produto} height={70} rounded={6} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              {produto.badge && <window.Badge kind={produto.badge} size="md" />}
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
                {cat.nome}
              </span>
            </div>
            <h1 style={{ margin: '0 0 14px', fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 30, color: '#0f172a', lineHeight: 1.2, letterSpacing: -0.5 }}>
              {produto.nome}
            </h1>

            {/* Nota */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fef9c3', color: '#854d0e', padding: '6px 12px', borderRadius: 8,
                fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 17,
              }}>
                <window.Icon name="star" size={16} strokeWidth={0} style={{ fill: '#eab308' }} />
                {produto.nota.toFixed(1)} / 10
              </span>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b' }}>
                avaliado por IA · {produto.sales.toLocaleString('pt-BR')} vendidos na Shopee
              </span>
            </div>

            {/* Price */}
            <div style={{
              background: '#f8fafc', borderRadius: 12, padding: 18, marginBottom: 16, border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                {produto.preco_original > produto.preco_atual && (
                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 15, color: '#94a3b8', textDecoration: 'line-through' }}>
                    R$ {produto.preco_original.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <span style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 36, color: '#2563eb', letterSpacing: -0.8 }}>
                  R$ {produto.preco_atual.toFixed(2).replace('.', ',')}
                </span>
                {produto.desconto_pct >= 10 && (
                  <span style={{
                    background: '#16a34a', color: '#fff', padding: '4px 10px', borderRadius: 8,
                    fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 13,
                  }}>−{produto.desconto_pct}% off</span>
                )}
              </div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b', marginTop: 6 }}>
                Preço atualizado há 2h · em 12x de R$ {(produto.preco_atual / 12).toFixed(2).replace('.', ',')} sem juros
              </div>
            </div>

            {/* Buy buttons */}
            <window.BuyButtons link_shopee={produto.link_shopee} link_mercadolivre={produto.link_mercadolivre} size="lg"
              onClick={(kind) => window.dispatchEvent(new CustomEvent('product:click', { detail: { kind, produto } }))} />

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#64748b' }}>
              <window.Icon name="info" size={14} />
              <span>Comissão de afiliado.</span>
              <a onClick={(e) => { e.preventDefault(); setShowDiscloseModal(true); }} href="#"
                style={{ color: '#2563eb', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Como funciona?
              </a>
            </div>

            <p style={{
              margin: '24px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 16, color: '#334155', lineHeight: 1.55,
              fontStyle: 'italic', borderLeft: '3px solid #2563eb', paddingLeft: 14,
            }}>
              "{produto.descricao_curta}"
            </p>
          </div>
        </div>

        {/* Por que recomendamos */}
        <section style={{ marginTop: 50 }}>
          <SectionHeader title="Por que recomendamos" subtitle="Análise gerada por IA com base na ficha técnica e avaliações" />
          <div style={{
            background: '#fff', borderRadius: 14, padding: 28, border: '1px solid #e5e7eb',
            fontFamily: 'DM Sans, system-ui', fontSize: 15, color: '#334155', lineHeight: 1.7,
          }}>
            {produto.copy_gerada.split('\n\n').map((para, i) => (
              <p key={i} style={{ margin: i === 0 ? 0 : '14px 0 0', textWrap: 'pretty' }}>{para}</p>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b' }}>
              <window.Icon name="sparkles" size={14} style={{ color: '#7c3aed' }} />
              Texto gerado por OpenAI GPT-4o · revisado pelo editor.
            </div>
          </div>
        </section>

        {/* Specs */}
        <section style={{ marginTop: 40 }}>
          <SectionHeader title="Ficha técnica" subtitle="Especificações reais validadas pela equipe" />
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, system-ui', fontSize: 14 }}>
              <tbody>
                {Object.entries(produto.specs).map(([k, v], i) => (
                  <tr key={k} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ padding: '14px 22px', fontWeight: 600, color: '#0f172a', width: '38%', borderBottom: i === Object.keys(produto.specs).length - 1 ? 'none' : '1px solid #f1f5f9' }}>{k}</td>
                    <td style={{ padding: '14px 22px', color: '#334155', borderBottom: i === Object.keys(produto.specs).length - 1 ? 'none' : '1px solid #f1f5f9' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros / Contras */}
        <section style={{ marginTop: 40 }}>
          <SectionHeader title="Prós e contras" subtitle="O bom e o ruim, sem rodeios" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <ProConList kind="pros" items={produto.pros} />
            <ProConList kind="contras" items={produto.contras} />
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ marginTop: 44 }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff', borderRadius: 16, padding: '36px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 24, letterSpacing: -0.4 }}>
                Pronto pra levar?
              </h3>
              <p style={{ margin: '6px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 15, color: '#cbd5e1', maxWidth: 480 }}>
                Compre com o melhor preço — comparamos Shopee e Mercado Livre em tempo real.
              </p>
            </div>
            <div style={{ minWidth: 320 }}>
              <window.BuyButtons link_shopee={produto.link_shopee} link_mercadolivre={produto.link_mercadolivre} size="lg" />
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ marginTop: 50 }}>
            <SectionHeader title={`Outras opções em ${cat.nome}`} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              {related.map((p, i) => <window.ProductCard key={p.id} produto={p} posicao={i + 1} compact />)}
            </div>
          </section>
        )}

        <section style={{ marginTop: 40 }}>
          <window.AffiliateDisclosure />
        </section>
      </article>

      <window.PublicFooter />

      <window.Modal open={showDiscloseModal} onClose={() => setShowDiscloseModal(false)} title="Como ganhamos dinheiro"
        footer={<button onClick={() => setShowDiscloseModal(false)} style={primaryBtn}>Entendi</button>}>
        <p style={{ margin: 0 }}>
          Quando você clica em "Ver na Shopee" ou "Ver no Mercado Livre" e finaliza uma compra naquele site, recebemos uma comissão de 2% a 12% sobre o valor — sem custo adicional pra você.
        </p>
        <p style={{ marginTop: 12 }}>
          Nós <strong>não somos pagos</strong> pra recomendar produtos específicos. As notas, prós e contras são gerados a partir da ficha técnica real do produto e revisados pelo editor antes da publicação.
        </p>
        <p style={{ marginTop: 12 }}>
          Se você quer entender melhor o método, confira{' '}
          <a href="#" style={{ color: '#2563eb' }}>nossa página "Como recomendamos"</a>.
        </p>
      </window.Modal>
    </div>
  );
}

function ProConList({ kind, items }) {
  const isPro = kind === 'pros';
  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%',
          background: isPro ? '#dcfce7' : '#fee2e2',
          color: isPro ? '#16a34a' : '#dc2626',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <window.Icon name={isPro ? 'check' : 'x'} size={14} strokeWidth={3} />
        </span>
        <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 17, color: '#0f172a' }}>
          {isPro ? 'Prós' : 'Contras'}
        </h3>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontFamily: 'DM Sans, system-ui', fontSize: 14, color: '#334155', lineHeight: 1.5,
          }}>
            <span style={{ color: isPro ? '#16a34a' : '#dc2626', flexShrink: 0, marginTop: 2 }}>
              <window.Icon name={isPro ? 'check' : 'x'} size={14} strokeWidth={3} />
            </span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

const primaryBtn = {
  background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8,
  fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 600, cursor: 'pointer',
};

Object.assign(window, { HomePage, CategoriaPage, ProdutoPage, primaryBtn });
