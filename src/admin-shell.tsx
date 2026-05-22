import React from 'react';
// Admin pages: Login, Shell, Dashboard
const { useState: useAdminState, useEffect: useAdminEffect, useMemo: useAdminMemo, useRef: useAdminRef } = React;

// =============================================================================
// LOGIN
// =============================================================================
function AdminLogin() {
  const { toast } = window.useToast();
  const [pwd, setPwd] = useAdminState('');
  const [show, setShow] = useAdminState(false);
  const [loading, setLoading] = useAdminState(false);
  const [err, setErr] = useAdminState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!pwd) { setErr('Senha obrigatória.'); return; }
    setLoading(true); setErr(null);
    setTimeout(() => {
      if (pwd === 'admin' || pwd === 'demo' || pwd === '1234') {
        localStorage.setItem('techindica:auth', '1');
        toast.success('Bem-vindo de volta!', { description: 'Sessão iniciada.' });
        window.navigate('/admin');
      } else {
        setErr('Senha incorreta. Tente "demo" ou "admin".');
        toast.error('Senha incorreta');
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid + glow */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, #000 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20,
        padding: 36, width: '100%', maxWidth: 400,
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <window.Icon name="zap" size={20} style={{ color: '#fff' }} strokeWidth={2.5} />
          </span>
          <div>
            <div style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: -0.2 }}>
              TechIndica
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
              Painel Admin
            </div>
          </div>
        </div>

        <h2 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 22, color: '#fff' }}>
          Acesso restrito
        </h2>
        <p style={{ margin: '6px 0 22px', fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#94a3b8' }}>
          Digite a senha de administrador pra continuar.
        </p>

        <form onSubmit={submit}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#cbd5e1', fontWeight: 600, marginBottom: 6 }}>
            Senha
          </label>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <window.Icon name="lock" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input type={show ? 'text' : 'password'} value={pwd} onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••••"
              autoFocus
              style={{
                width: '100%', padding: '11px 40px 11px 38px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid', borderColor: err ? '#dc2626' : 'rgba(255,255,255,0.1)',
                color: '#fff', borderRadius: 10,
                fontFamily: 'DM Sans, system-ui', fontSize: 14, outline: 'none',
              }}
            />
            <button type="button" onClick={() => setShow(!show)} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 6, display: 'flex',
            }}>
              <window.Icon name={show ? 'eyeOff' : 'eye'} size={16} />
            </button>
          </div>
          {err && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#fca5a5', marginBottom: 14,
              background: 'rgba(220, 38, 38, 0.1)', padding: '8px 12px', borderRadius: 8,
            }}>
              <window.Icon name="alert" size={14} /> {err}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 12, borderRadius: 10, border: 'none',
            background: loading ? '#1e40af' : '#2563eb', color: '#fff',
            fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading ? <window.Icon name="refresh" size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: 20, padding: '12px 14px', borderRadius: 10,
          background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#93c5fd', lineHeight: 1.6,
        }}>
          <span style={{ color: '#60a5fa', fontWeight: 600 }}>DEMO</span> · use "demo" ou "admin" como senha<br/>
          <span style={{ color: '#64748b' }}>Em produção: VITE_ADMIN_PASSWORD via .env</span>
        </div>

        <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }}
          style={{ display: 'block', marginTop: 18, textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}

// =============================================================================
// ADMIN SHELL (sidebar + topbar)
// =============================================================================
function AdminShell({ current, children, title, subtitle, actions }) {
  const { toast } = window.useToast();

  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: 'layoutGrid', href: '/admin' },
    { key: 'produtos',  label: 'Produtos',  icon: 'package',    href: '/admin/produtos' },
    { key: 'automacao', label: 'Automação', icon: 'zap',        href: '/admin/automacao' },
    { key: 'config',    label: 'Configurações', icon: 'settings', href: '/admin/config' },
  ];

  const logout = () => {
    localStorage.removeItem('techindica:auth');
    toast.success('Sessão encerrada');
    window.navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#f8fafc',
      display: 'grid', gridTemplateColumns: '232px 1fr',
    }}>
      {/* Sidebar */}
      <aside style={{
        background: '#0f172a', color: '#cbd5e1', padding: '20px 14px',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 8px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <window.Icon name="zap" size={17} style={{ color: '#fff' }} strokeWidth={2.5} />
          </span>
          <div>
            <div style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.1 }}>TechIndica</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>admin panel</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8, flex: 1 }}>
          <SidebarLabel>Operações</SidebarLabel>
          {items.map((it) => (
            <a key={it.key} href={`#${it.href}`}
              onClick={(e) => { e.preventDefault(); window.navigate(it.href); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px',
                fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 500,
                color: current === it.key ? '#fff' : '#94a3b8',
                background: current === it.key ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                borderRadius: 8, textDecoration: 'none',
                borderLeft: current === it.key ? '2px solid #2563eb' : '2px solid transparent',
                paddingLeft: current === it.key ? 10 : 12,
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => current !== it.key && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={(e) => current !== it.key && (e.currentTarget.style.background = 'transparent')}
            >
              <window.Icon name={it.icon} size={16} />
              {it.label}
            </a>
          ))}

          <div style={{ marginTop: 18 }}>
            <SidebarLabel>Site público</SidebarLabel>
            <a href="#/" onClick={(e) => { e.preventDefault(); window.navigate('/'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px',
                fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#94a3b8',
                textDecoration: 'none', borderRadius: 8, paddingLeft: 12,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <window.Icon name="externalLink" size={16} />
              Ver site
            </a>
          </div>
        </nav>

        {/* User block */}
        <div style={{
          marginTop: 'auto', padding: 10, borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora, system-ui', fontWeight: 700, color: '#fff', fontSize: 13,
          }}>E</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Eliveuton</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748b' }}>owner@techindica</div>
          </div>
          <window.Tooltip content="Sair">
            <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <window.Icon name="logout" size={15} />
            </button>
          </window.Tooltip>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '20px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          position: 'sticky', top: 0, zIndex: 20,
        }}>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#64748b',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2,
            }}>
              /admin/{current === 'dashboard' ? '' : current}
            </div>
            <h1 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 22, color: '#0f172a', letterSpacing: -0.3 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: '2px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b' }}>{subtitle}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {actions}
          </div>
        </div>

        <div style={{ padding: 32 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLabel({ children }) {
  return (
    <div style={{
      padding: '8px 12px 6px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
      color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600,
    }}>{children}</div>
  );
}

// =============================================================================
// DASHBOARD
// =============================================================================
function AdminDashboard() {
  const { toast } = window.useToast();
  const total = window.PRODUTOS.length;
  const publicados = window.PRODUTOS.filter((p) => p.publicado).length;
  const semCopy = window.PRODUTOS.filter((p) => !p.copy_gerada).length;
  const ultimoLog = window.EXEC_LOG[0];

  return (
    <window.AdminShell current="dashboard" title="Dashboard" subtitle="Visão geral do sistema, atualizada em tempo real via Supabase Realtime"
      actions={
        <>
          <button onClick={() => { toast.loading('Sincronizando com Supabase…'); setTimeout(() => { toast.dismiss(); toast.success('Sincronizado'); }, 1500); }}
            style={ghostBtn}>
            <window.Icon name="refresh" size={14} /> Atualizar
          </button>
          <button onClick={() => window.navigate('/admin/automacao')} style={primaryAdminBtn}>
            <window.Icon name="zap" size={14} /> Buscar produtos
          </button>
        </>
      }
    >
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard label="Total de produtos" value={total} icon="package" trend="+12 esta semana" trendUp />
        <KpiCard label="Publicados" value={publicados} icon="check" trend={`${Math.round(publicados/total*100)}% do total`} accent="#16a34a" />
        <KpiCard label="Sem copy" value={semCopy} icon="sparkles" trend="aguardando IA" accent="#f59e0b" warning={semCopy > 0} />
        <KpiCard label="Última execução" value="há 2h" icon="clock" trend="07:14 · sucesso" accent="#2563eb" />
      </div>

      {/* Chart + Realtime status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 24 }}>
        {/* Chart card */}
        <Card>
          <CardHeader title="Produtos adicionados" subtitle="Últimos 30 dias · agregado por dia" />
          <div style={{ height: 220, marginTop: 16 }}>
            <ChartLine data={window.CHART_DATA} />
          </div>
        </Card>

        {/* Realtime status */}
        <Card>
          <CardHeader title="Status do sistema" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <StatusRow label="Supabase" status="ok" detail="us-east-1 · 38ms" />
            <StatusRow label="Shopee API" status="ok" detail="HMAC válido" />
            <StatusRow label="OpenAI GPT-4o" status="ok" detail="quota 78% restante" />
            <StatusRow label="Mercado Livre" status="off" detail="integração futura" />
            <StatusRow label="pg_cron" status="warn" detail="manual (MVP)" />
          </div>
        </Card>
      </div>

      {/* Atalhos rápidos + Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Atalhos rápidos" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 14 }}>
            <ShortcutBtn icon="zap" label="Buscar Shopee" sub="Coleta manual" onClick={() => window.navigate('/admin/automacao')} />
            <ShortcutBtn icon="sparkles" label="Gerar copies" sub={`${semCopy} pendentes`} onClick={() => window.navigate('/admin/automacao')} />
            <ShortcutBtn icon="package" label="Ver produtos" sub={`${total} no banco`} onClick={() => window.navigate('/admin/produtos')} />
            <ShortcutBtn icon="key" label="Credenciais" sub="Shopee + ML" onClick={() => window.navigate('/admin/config')} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Atividade recente" action={
            <a onClick={(e) => { e.preventDefault(); window.navigate('/admin/automacao'); }} href="#"
              style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
              Ver histórico
            </a>
          } />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {window.EXEC_LOG.slice(0, 4).map((log) => <ActivityRow key={log.id} log={log} />)}
          </div>
        </Card>
      </div>
    </window.AdminShell>
  );
}

// ============= DASHBOARD HELPERS =============

function Card({ children, padding = 22 }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding }}>
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div>
        <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 15, color: '#0f172a' }}>{title}</h3>
        {subtitle && <p style={{ margin: '2px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#64748b' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function KpiCard({ label, value, icon, trend, trendUp, accent = '#2563eb', warning }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#64748b', fontWeight: 500 }}>{label}</span>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          background: `${accent}15`, color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <window.Icon name={icon} size={15} strokeWidth={2.2} />
        </span>
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 28, color: '#0f172a', letterSpacing: -0.5 }}>{value}</span>
      </div>
      <div style={{ marginTop: 6, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: warning ? '#b45309' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
        {warning && <window.Icon name="alert" size={12} />}
        {trend}
      </div>
    </Card>
  );
}

function ChartLine({ data }) {
  const w = 600, h = 220, pad = 16;
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / max) * (h - pad * 2 - 10);
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaPath = path + ` L ${points[points.length-1][0]} ${h - pad} L ${points[0][0]} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((g, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + g * (h - pad*2)} y2={pad + g * (h - pad*2)} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <path d={areaPath} fill="url(#chartGrad)" />
      <path d={path} fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => i === points.length - 1 && (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="5" fill="#2563eb" />
          <circle cx={p[0]} cy={p[1]} r="9" fill="#2563eb" opacity="0.15" />
        </g>
      ))}
      <text x={pad} y={h - 2} fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94a3b8">há 30 dias</text>
      <text x={w - pad} y={h - 2} textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94a3b8">hoje</text>
      <text x={points[points.length-1][0]} y={points[points.length-1][1] - 12} textAnchor="middle" fontFamily="Sora, system-ui" fontWeight="600" fontSize="12" fill="#2563eb">
        {data[data.length - 1]} hoje
      </text>
    </svg>
  );
}

function StatusRow({ label, status, detail }) {
  const dot = { ok: '#22c55e', warn: '#f59e0b', off: '#94a3b8', err: '#dc2626' }[status];
  const statusLabel = { ok: 'Operacional', warn: 'Atenção', off: 'Inativo', err: 'Falha' }[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Sans, system-ui' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: dot,
          boxShadow: `0 0 0 3px ${dot}30`,
          animation: status === 'ok' ? 'pulse 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: status === 'ok' ? '#16a34a' : status === 'warn' ? '#b45309' : '#64748b' }}>
          {statusLabel}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#94a3b8' }}>{detail}</div>
      </div>
    </div>
  );
}

function ShortcutBtn({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14,
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
    >
      <span style={{
        width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#2563eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <window.Icon name={icon} size={15} />
      </span>
      <div>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{label}</div>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#64748b' }}>{sub}</div>
      </div>
    </button>
  );
}

function ActivityRow({ log }) {
  const statusColors = {
    success: { bg: '#dcfce7', fg: '#15803d', icon: 'check', label: 'Sucesso' },
    error:   { bg: '#fee2e2', fg: '#b91c1c', icon: 'alert', label: 'Erro' },
    partial: { bg: '#fef3c7', fg: '#a16207', icon: 'alert', label: 'Parcial' },
  };
  const s = statusColors[log.status];
  const time = new Date(log.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        width: 28, height: 28, borderRadius: 8, background: s.bg, color: s.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <window.Icon name={s.icon} size={13} strokeWidth={3} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
          {log.encontrados} produtos encontrados · {log.publicados} publicados
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#94a3b8', marginTop: 1 }}>
          {log.plataforma} · {time}
        </div>
      </div>
      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 600, color: s.fg }}>{s.label}</span>
    </div>
  );
}

// =============================================================================
// SHARED ADMIN BUTTONS
// =============================================================================
const primaryAdminBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#0f172a', color: '#fff', border: 'none',
  padding: '9px 14px', borderRadius: 8,
  fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#fff', color: '#334155', border: '1px solid #e5e7eb',
  padding: '8px 13px', borderRadius: 8,
  fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, cursor: 'pointer',
};

const dangerBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: '#dc2626', color: '#fff', border: 'none',
  padding: '9px 14px', borderRadius: 8,
  fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};

Object.assign(window, {
  AdminLogin, AdminShell, AdminDashboard,
  Card, CardHeader,
  primaryAdminBtn, ghostBtn, dangerBtn,
});
