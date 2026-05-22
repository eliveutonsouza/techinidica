import React from 'react';
// Admin pages: Config, Produtos, Automação
const { useState: useApgState, useMemo: useApgMemo, useEffect: useApgEffect, useRef: useApgRef } = React;

// =============================================================================
// CONFIG
// =============================================================================
function AdminConfig() {
  const { toast } = window.useToast();
  const [tab, setTab] = useApgState('shopee');

  const [shopeeConfig, setShopeeConfig] = useApgState({
    app_id: '15832009281',
    secret: 'shopee_demo_XXXXXXXXXXXXXXXXXXXX',
    tracking_id: 'techindica_main',
    ativo: true,
  });
  const [showSecret, setShowSecret] = useApgState(false);
  const [status, setStatus] = useApgState('configured'); // configured | untested | error
  const [testing, setTesting] = useApgState(false);
  const [savedDirty, setSavedDirty] = useApgState(false);

  const onSave = () => {
    toast.loading('Salvando credenciais...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Credenciais salvas', { description: 'Configuração ativa em affiliate_config.' });
      setSavedDirty(false);
    }, 800);
  };
  const onTest = () => {
    setTesting(true);
    const id = toast.loading('Testando conexão com Shopee...');
    setTimeout(() => {
      toast.dismiss(id);
      toast.success('Conexão OK', { description: '1 produto retornado em 312ms · HMAC válido' });
      setStatus('configured');
      setTesting(false);
    }, 1600);
  };

  const statusBadge = {
    configured: { bg: '#dcfce7', fg: '#15803d', label: 'Configurado · Testado' },
    untested:   { bg: '#fef3c7', fg: '#a16207', label: 'Não testado' },
    error:      { bg: '#fee2e2', fg: '#b91c1c', label: 'Falha na conexão' },
  }[status];

  return (
    <window.AdminShell current="config" title="Configurações" subtitle="Credenciais de integração e parâmetros do sistema">
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, gap: 4 }}>
        {[
          { k: 'shopee', label: 'Shopee', enabled: true },
          { k: 'mercadolivre', label: 'Mercado Livre', enabled: false },
          { k: 'openai', label: 'OpenAI', enabled: true },
          { k: 'geral', label: 'Geral', enabled: true },
        ].map((t) => (
          <button key={t.k}
            onClick={() => t.enabled && setTab(t.k)}
            disabled={!t.enabled}
            style={{
              background: 'transparent', border: 'none', padding: '10px 16px',
              fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 500,
              color: tab === t.k ? '#0f172a' : t.enabled ? '#64748b' : '#cbd5e1',
              borderBottom: '2px solid',
              borderColor: tab === t.k ? '#2563eb' : 'transparent',
              cursor: t.enabled ? 'pointer' : 'not-allowed', marginBottom: -1,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            {!t.enabled && (
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>EM BREVE</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'shopee' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          <window.Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 16, color: '#0f172a' }}>
                  Credenciais Shopee Affiliates
                </h3>
                <p style={{ margin: '2px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b' }}>
                  Salvas criptografadas em <code style={codeStyle}>affiliate_config</code>
                </p>
              </div>
              <span style={{
                background: statusBadge.bg, color: statusBadge.fg,
                fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 600,
                padding: '5px 10px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusBadge.fg }} />
                {statusBadge.label}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <FormField label="App ID" required hint="Encontrado no painel Shopee Affiliates">
                <input value={shopeeConfig.app_id}
                  onChange={(e) => { setShopeeConfig({ ...shopeeConfig, app_id: e.target.value }); setSavedDirty(true); }}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Secret Key" required hint="Nunca exposto no frontend. Use a 'olho' pra revelar.">
                <div style={{ position: 'relative' }}>
                  <input type={showSecret ? 'text' : 'password'} value={shopeeConfig.secret}
                    onChange={(e) => { setShopeeConfig({ ...shopeeConfig, secret: e.target.value }); setSavedDirty(true); }}
                    style={{ ...inputStyle, paddingRight: 38 }}
                  />
                  <button type="button" onClick={() => setShowSecret(!showSecret)}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4, display: 'flex' }}>
                    <window.Icon name={showSecret ? 'eyeOff' : 'eye'} size={16} />
                  </button>
                </div>
              </FormField>
              <FormField label="Tracking ID" required hint="Inserido nos links de afiliado para rastrear cliques">
                <input value={shopeeConfig.tracking_id}
                  onChange={(e) => { setShopeeConfig({ ...shopeeConfig, tracking_id: e.target.value }); setSavedDirty(true); }}
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Integração ativa">
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <Toggle checked={shopeeConfig.ativo} onChange={(v) => { setShopeeConfig({ ...shopeeConfig, ativo: v }); setSavedDirty(true); }} />
                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#0f172a' }}>
                    {shopeeConfig.ativo ? 'Coleta automática habilitada' : 'Pausada'}
                  </span>
                </label>
              </FormField>
            </div>

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={onSave} disabled={!savedDirty} style={{ ...window.primaryAdminBtn, opacity: savedDirty ? 1 : 0.5, cursor: savedDirty ? 'pointer' : 'not-allowed' }}>
                <window.Icon name="check" size={14} strokeWidth={3} />
                Salvar alterações
              </button>
              <button onClick={onTest} disabled={testing} style={window.ghostBtn}>
                <window.Icon name="zap" size={14} style={testing ? { animation: 'spin 1s linear infinite' } : {}} />
                {testing ? 'Testando…' : 'Testar conexão'}
              </button>
              {savedDirty && (
                <span style={{ marginLeft: 'auto', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <window.Icon name="alert" size={13} /> Alterações não salvas
                </span>
              )}
            </div>
          </window.Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <window.Card>
              <window.CardHeader title="Como funciona" />
              <ol style={{ margin: '14px 0 0', padding: '0 0 0 18px', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                <li>O sistema usa as credenciais pra gerar uma assinatura <strong>HMAC-SHA1</strong> a cada request.</li>
                <li>A requisição é feita para a API GraphQL da Shopee: <code style={codeStyle}>productOfferV2</code>.</li>
                <li>Os produtos retornados são normalizados (preços em micros → R$) e salvos em <code style={codeStyle}>produtos</code>.</li>
                <li>Cada link recebe o <strong>tracking_id</strong> via parâmetro <code style={codeStyle}>af_sub1</code>.</li>
              </ol>
            </window.Card>
            <window.Card>
              <window.CardHeader title="Segurança" />
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <SecurityItem ok label="Secret armazenado criptografado no banco" />
                <SecurityItem ok label="Secret nunca enviado ao navegador" />
                <SecurityItem ok label="RLS ativa em affiliate_config" />
                <SecurityItem ok label="Apenas service_role pode ler/escrever" />
              </div>
            </window.Card>
          </div>
        </div>
      )}

      {tab === 'openai' && (
        <div style={{ maxWidth: 720 }}>
          <window.Card>
            <window.CardHeader title="OpenAI GPT-4o"
              subtitle="A API key fica em Supabase Secrets (env das Edge Functions), nunca no frontend." />

            <div style={{ marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0', display: 'flex', gap: 12 }}>
              <window.Icon name="check" size={18} strokeWidth={3} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 600, color: '#15803d' }}>
                  OPENAI_API_KEY configurada no Supabase Secrets
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#16a34a', marginTop: 4 }}>
                  openai_key ••••••••••••••••8X4j  ·  edge function: generate-copy
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
              <MiniStat label="Modelo" value="gpt-4o" mono />
              <MiniStat label="Tokens/produto" value="~1.2k" />
              <MiniStat label="Custo médio" value="$0.011" />
            </div>

            <div style={{ marginTop: 18 }}>
              <FormField label="Limite mensal (USD)" hint="Bloqueia novas chamadas se exceder">
                <input type="number" defaultValue={50} style={inputStyle} />
              </FormField>
            </div>
          </window.Card>
        </div>
      )}

      {tab === 'geral' && (
        <div style={{ maxWidth: 720 }}>
          <window.Card>
            <window.CardHeader title="Configurações gerais" />
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <FormField label="Nome do site"><input defaultValue="TechIndica" style={inputStyle} /></FormField>
              <FormField label="URL pública"><input defaultValue="https://techindica.com.br" style={inputStyle} /></FormField>
              <FormField label="E-mail do proprietário"><input defaultValue="eliveuton@techindica.com.br" style={inputStyle} /></FormField>
              <FormField label="Senha admin (VITE_ADMIN_PASSWORD)" hint="Aviso: armazenada em variável de ambiente, não no banco">
                <input type="password" defaultValue="••••••" style={inputStyle} />
              </FormField>
            </div>
          </window.Card>
        </div>
      )}
    </window.AdminShell>
  );
}

function FormField({ label, hint, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#64748b', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8,
  fontFamily: 'DM Sans, system-ui', fontSize: 13.5, outline: 'none', background: '#fff',
};

const codeStyle = {
  fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5,
  background: '#f1f5f9', padding: '1px 5px', borderRadius: 4, color: '#0f172a',
};

function Toggle({ checked, onChange, disabled }) {
  return (
    <span onClick={() => !disabled && onChange?.(!checked)} style={{
      width: 36, height: 20, borderRadius: 99,
      background: checked ? '#2563eb' : '#cbd5e1',
      position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s',
      flexShrink: 0, opacity: disabled ? 0.5 : 1,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.15s',
      }} />
    </span>
  );
}

function SecurityItem({ ok, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%',
        background: ok ? '#dcfce7' : '#fee2e2',
        color: ok ? '#16a34a' : '#dc2626',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <window.Icon name={ok ? 'check' : 'x'} size={10} strokeWidth={4} />
      </span>
      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#334155' }}>{label}</span>
    </div>
  );
}

function MiniStat({ label, value, mono }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>{label}</div>
      <div style={{
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'Sora, system-ui',
        fontWeight: 600, fontSize: 16, color: '#0f172a', marginTop: 2,
      }}>{value}</div>
    </div>
  );
}

// =============================================================================
// PRODUTOS (tabela)
// =============================================================================
function AdminProdutos() {
  const { toast } = window.useToast();
  const [items, setItems] = useApgState(window.PRODUTOS);
  const [filterPlat, setFilterPlat] = useApgState('all');
  const [filterCat, setFilterCat] = useApgState('all');
  const [filterStatus, setFilterStatus] = useApgState('all');
  const [search, setSearch] = useApgState('');
  const [generating, setGenerating] = useApgState({});
  const [confirmDel, setConfirmDel] = useApgState(null);
  const [previewProd, setPreviewProd] = useApgState(null);
  const [bulkOpen, setBulkOpen] = useApgState(false);

  const filtered = useApgMemo(() => {
    let r = items;
    if (filterPlat !== 'all') r = r.filter((p) => p.plataforma === filterPlat);
    if (filterCat !== 'all') r = r.filter((p) => p.categoria === filterCat);
    if (filterStatus === 'pub') r = r.filter((p) => p.publicado);
    if (filterStatus === 'rascunho') r = r.filter((p) => !p.publicado);
    if (filterStatus === 'sem-copy') r = r.filter((p) => !p.copy_gerada);
    if (search.trim()) r = r.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [items, filterPlat, filterCat, filterStatus, search]);

  const togglePublicado = (id) => {
    setItems((cur) => cur.map((p) => p.id === id ? { ...p, publicado: !p.publicado } : p));
    const p = items.find((x) => x.id === id);
    toast.success(p.publicado ? 'Despublicado' : 'Publicado', { description: p.nome.slice(0, 40) + '…' });
  };
  const toggleDestaque = (id) => {
    setItems((cur) => cur.map((p) => p.id === id ? { ...p, destaque: !p.destaque } : p));
  };
  const generateCopy = (id) => {
    setGenerating((g) => ({ ...g, [id]: true }));
    setTimeout(() => {
      setItems((cur) => cur.map((p) => p.id === id ? {
        ...p, copy_gerada: 'Texto gerado por GPT-4o…',
        descricao_curta: 'Resumo gerado por IA — pronto para publicação.',
        categoria: p.categoria || 'fones',
        badge: 'value', nota: 8.4,
        pros: ['Boa autonomia', 'Som equilibrado', 'Bom preço'],
        contras: ['Sem ANC', 'Cabo USB-C não acompanha'],
        specs: { 'Tipo': 'Portátil', 'Bateria': '5h', 'Resistência': 'IP67' },
        publicado: true,
      } : p));
      setGenerating((g) => { const n = { ...g }; delete n[id]; return n; });
      toast.success('Copy gerada', { description: 'Categoria, badge, nota e specs preenchidos.' });
    }, 1800);
  };
  const onDelete = () => {
    const id = confirmDel;
    setItems((cur) => cur.filter((p) => p.id !== id));
    setConfirmDel(null);
    toast.success('Produto excluído', { description: 'Removido também do site público.' });
  };

  return (
    <window.AdminShell current="produtos" title="Produtos" subtitle={`${filtered.length} de ${items.length} produtos`}
      actions={
        <>
          <button onClick={() => setBulkOpen(true)} style={window.ghostBtn}>
            <window.Icon name="sparkles" size={14} /> Gerar copies em lote
          </button>
          <button onClick={() => window.navigate('/admin/automacao')} style={window.primaryAdminBtn}>
            <window.Icon name="plus" size={14} strokeWidth={3} /> Buscar novos
          </button>
        </>
      }
    >
      {/* Filters */}
      <window.Card padding={16}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px 180px', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <window.Icon name="search" size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome..."
              style={{ ...inputStyle, paddingLeft: 32 }}
            />
          </div>
          <SelectInput label="Plataforma" value={filterPlat} onChange={setFilterPlat} options={[
            { v: 'all', l: 'Todas plataformas' }, { v: 'shopee', l: 'Shopee' }, { v: 'mercadolivre', l: 'Mercado Livre' },
          ]} />
          <SelectInput label="Categoria" value={filterCat} onChange={setFilterCat} options={[
            { v: 'all', l: 'Todas categorias' },
            ...window.CATEGORIES.map((c) => ({ v: c.slug, l: c.nome })),
          ]} />
          <SelectInput label="Status" value={filterStatus} onChange={setFilterStatus} options={[
            { v: 'all', l: 'Todos status' }, { v: 'pub', l: 'Publicado' }, { v: 'rascunho', l: 'Rascunho' }, { v: 'sem-copy', l: 'Sem copy' },
          ]} />
        </div>
      </window.Card>

      {/* Table */}
      <div style={{ marginTop: 18, background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, system-ui', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                {['Produto', 'Plataforma', 'Categoria', 'Preço', 'Nota', 'Publicado', 'Destaque', 'Ações'].map((h) => (
                  <th key={h} style={{
                    padding: '11px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
                    color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600,
                    borderBottom: '1px solid #e5e7eb',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        {p.categoria
                          ? <window.ProductImage produto={p} height={44} rounded={8} />
                          : <div style={{ width: 44, height: 44, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><window.Icon name="package" size={18} /></div>
                        }
                      </div>
                      <div style={{ maxWidth: 320 }}>
                        <a href={`#/produto/${p.id}`} onClick={(e) => { e.preventDefault(); window.navigate(`/produto/${p.id}`); }}
                          style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#0f172a', fontWeight: 500, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.nome}
                        </a>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                          #{p.id} · {p.platform_id}
                          {!p.copy_gerada && <span style={{ marginLeft: 6, color: '#b45309', fontWeight: 600 }}>· SEM COPY</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <PlatBadge plat={p.plataforma} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {p.categoria
                      ? <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#475569' }}>{window.CATEGORIES.find((c) => c.slug === p.categoria)?.nome}</span>
                      : <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#94a3b8', fontStyle: 'italic' }}>pendente</span>
                    }
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'Sora, system-ui', fontSize: 13.5, color: '#0f172a', fontWeight: 600 }}>
                      R$ {p.preco_atual.toFixed(2).replace('.', ',')}
                    </div>
                    {p.desconto_pct >= 10 && (
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 1 }}>
                        −{p.desconto_pct}% off
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {p.nota
                      ? <span style={{ fontFamily: 'Sora, system-ui', fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{p.nota.toFixed(1)}</span>
                      : <span style={{ color: '#cbd5e1' }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Toggle checked={p.publicado} onChange={() => togglePublicado(p.id)}
                      disabled={!p.copy_gerada} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Toggle checked={p.destaque} onChange={() => toggleDestaque(p.id)} disabled={!p.publicado} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {!p.copy_gerada && (
                        <button onClick={() => generateCopy(p.id)} disabled={generating[p.id]}
                          style={{
                            background: '#7c3aed', color: '#fff', border: 'none',
                            padding: '6px 10px', borderRadius: 6,
                            fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                          }}>
                          <window.Icon name={generating[p.id] ? 'refresh' : 'sparkles'} size={12}
                            style={generating[p.id] ? { animation: 'spin 1s linear infinite' } : {}} />
                          {generating[p.id] ? 'Gerando...' : 'Gerar copy'}
                        </button>
                      )}
                      <window.Tooltip content="Ver no site">
                        <button onClick={() => setPreviewProd(p)} style={iconActionBtn}>
                          <window.Icon name="eye" size={14} />
                        </button>
                      </window.Tooltip>
                      <window.Tooltip content="Excluir">
                        <button onClick={() => setConfirmDel(p.id)} style={{ ...iconActionBtn, color: '#dc2626' }}>
                          <window.Icon name="trash" size={14} />
                        </button>
                      </window.Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 50, textAlign: 'center', color: '#94a3b8', fontFamily: 'DM Sans, system-ui' }}>
                  Nenhum produto com esses filtros.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#64748b',
        }}>
          <span>Exibindo {filtered.length} de {items.length} produtos</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>●</span> realtime · supabase
          </span>
        </div>
      </div>

      {/* Delete confirmation */}
      <window.Modal open={confirmDel != null} onClose={() => setConfirmDel(null)} title="Excluir produto?"
        footer={
          <>
            <button onClick={() => setConfirmDel(null)} style={window.ghostBtn}>Cancelar</button>
            <button onClick={onDelete} style={window.dangerBtn}>
              <window.Icon name="trash" size={13} /> Excluir definitivamente
            </button>
          </>
        }>
        <p style={{ margin: 0 }}>
          Esta ação não pode ser desfeita. O produto será removido do banco e desaparecerá imediatamente do site público.
        </p>
        {confirmDel && items.find((p) => p.id === confirmDel) && (
          <div style={{ marginTop: 14, padding: 12, background: '#f8fafc', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden' }}>
              {items.find((p) => p.id === confirmDel).categoria
                ? <window.ProductImage produto={items.find((p) => p.id === confirmDel)} height={40} rounded={6} />
                : <div style={{ width: 40, height: 40, background: '#f1f5f9' }} />}
            </div>
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
              {items.find((p) => p.id === confirmDel).nome.slice(0, 60)}…
            </div>
          </div>
        )}
      </window.Modal>

      {/* Preview modal */}
      <window.Modal open={previewProd != null} onClose={() => setPreviewProd(null)} title="Pré-visualização do produto" width={620}
        footer={<><button onClick={() => setPreviewProd(null)} style={window.ghostBtn}>Fechar</button>
          {previewProd && <button onClick={() => { window.navigate(`/produto/${previewProd.id}`); }} style={window.primaryAdminBtn}>
            <window.Icon name="externalLink" size={13} /> Abrir página completa
          </button>}
        </>}>
        {previewProd && (
          <div>
            <window.ProductImage produto={previewProd} height={200} />
            <h4 style={{ margin: '14px 0 6px', fontFamily: 'Sora, system-ui', fontSize: 16, color: '#0f172a' }}>{previewProd.nome}</h4>
            <p style={{ margin: 0, fontFamily: 'DM Sans, system-ui', fontSize: 13.5, color: '#64748b' }}>{previewProd.descricao_curta}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 14, fontFamily: 'DM Sans, system-ui', fontSize: 13 }}>
              <span><strong>Preço:</strong> R$ {previewProd.preco_atual.toFixed(2).replace('.', ',')}</span>
              {previewProd.nota && <span><strong>Nota:</strong> {previewProd.nota.toFixed(1)}/10</span>}
            </div>
          </div>
        )}
      </window.Modal>

      {/* Bulk generation modal */}
      <BulkGenerateModal open={bulkOpen} onClose={() => setBulkOpen(false)} produtos={items.filter((p) => !p.copy_gerada)} />
    </window.AdminShell>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      ...inputStyle, cursor: 'pointer', appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30,
    }}>
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function PlatBadge({ plat }) {
  const cfg = {
    shopee: { bg: '#fff7ed', fg: '#c2410c', label: 'Shopee', dot: '#f05d23' },
    mercadolivre: { bg: '#fefce8', fg: '#854d0e', label: 'Mercado Livre', dot: '#eab308' },
  }[plat];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.fg, padding: '4px 9px', borderRadius: 6,
      fontFamily: 'DM Sans, system-ui', fontSize: 11.5, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

const iconActionBtn = {
  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6,
  padding: 6, cursor: 'pointer', color: '#475569', display: 'inline-flex',
};

// =============================================================================
// BULK GENERATE MODAL
// =============================================================================
function BulkGenerateModal({ open, onClose, produtos }) {
  const { toast } = window.useToast();
  const [qty, setQty] = useApgState(Math.min(10, produtos.length));
  const [running, setRunning] = useApgState(false);
  const [done, setDone] = useApgState(0);
  const [log, setLog] = useApgState([]);
  const timerRef = useApgRef(null);

  useApgEffect(() => { if (!open) { setRunning(false); setDone(0); setLog([]); if (timerRef.current) clearInterval(timerRef.current); } }, [open]);
  useApgEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  const start = () => {
    setRunning(true);
    setDone(0);
    setLog([]);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      const p = produtos[i - 1];
      setDone(i);
      if (p) setLog((l) => [...l, { id: p.id, name: p.nome.slice(0, 50), status: 'ok' }]);
      if (i >= qty) {
        clearInterval(timerRef.current);
        setRunning(false);
        toast.success(`${qty} copies geradas`, { description: 'Custo estimado: $' + (qty * 0.011).toFixed(2) });
      }
    }, 600);
  };

  const pct = qty > 0 ? Math.round((done / qty) * 100) : 0;

  return (
    <window.Modal open={open} onClose={onClose} title="Gerar copies em lote" width={560}
      footer={
        <>
          <button onClick={onClose} style={window.ghostBtn} disabled={running}>{running ? 'Aguarde...' : 'Fechar'}</button>
          {!running && done === 0 && (
            <button onClick={start} style={{ ...window.primaryAdminBtn, background: '#7c3aed' }}>
              <window.Icon name="sparkles" size={13} /> Iniciar geração
            </button>
          )}
        </>
      }>
      <div style={{ display: 'flex', gap: 12, padding: 14, background: '#faf5ff', borderRadius: 10, border: '1px solid #e9d5ff', marginBottom: 16 }}>
        <window.Icon name="sparkles" size={18} style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: '#581c87' }}>
          <strong>{produtos.length}</strong> produtos sem copy. Cada um custa cerca de <strong>$0.011 USD</strong> e demora ~2s. Geração com delay para respeitar rate limit.
        </div>
      </div>

      {!running && done === 0 && (
        <FormField label="Quantidade a processar" hint="Mínimo 1, máximo 50 por execução">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="range" min={1} max={Math.min(50, produtos.length)} value={qty} onChange={(e) => setQty(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#7c3aed' }} />
            <input type="number" min={1} max={Math.min(50, produtos.length)} value={qty} onChange={(e) => setQty(Number(e.target.value))}
              style={{ ...inputStyle, width: 80 }} />
          </div>
        </FormField>
      )}

      {(running || done > 0) && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, system-ui', fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Progresso</span>
            <span style={{ color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{done} / {qty}</span>
          </div>
          <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
              transition: 'width 0.3s',
            }} />
          </div>

          <div style={{
            marginTop: 16, background: '#0f172a', borderRadius: 10, padding: 14,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#86efac', maxHeight: 200, overflow: 'auto',
          }}>
            {log.map((l, i) => (
              <div key={i}>
                <span style={{ color: '#64748b' }}>[{String(i+1).padStart(2,'0')}]</span> ✓ generated copy for #{l.id} <span style={{ color: '#94a3b8' }}>{l.name}…</span>
              </div>
            ))}
            {running && <div style={{ color: '#fbbf24' }}>... processando próximo</div>}
            {!running && done === qty && <div style={{ color: '#22c55e', marginTop: 4 }}>━━ done · {qty} produtos publicados ━━</div>}
          </div>
        </div>
      )}
    </window.Modal>
  );
}

// =============================================================================
// AUTOMACAO
// =============================================================================
function AdminAutomacao() {
  const { toast } = window.useToast();
  const [shopeeRunning, setShopeeRunning] = useApgState(false);
  const [shopeeStep, setShopeeStep] = useApgState(null);
  const [shopeeResult, setShopeeResult] = useApgState(null);
  const [bulkOpen, setBulkOpen] = useApgState(false);

  const runShopee = () => {
    setShopeeRunning(true);
    setShopeeResult(null);
    const steps = [
      { msg: 'Lendo credenciais de affiliate_config…', delay: 500 },
      { msg: 'Gerando assinatura HMAC-SHA1…', delay: 400 },
      { msg: 'Conectando à API GraphQL Shopee…', delay: 700 },
      { msg: '23 produtos encontrados na resposta', delay: 600 },
      { msg: 'Normalizando preços (micros → R$)…', delay: 500 },
      { msg: 'Upsert em produtos…', delay: 600 },
      { msg: 'Registrando em execucoes_log…', delay: 300 },
    ];
    let i = 0;
    const next = () => {
      if (i >= steps.length) {
        setShopeeStep(null);
        setShopeeRunning(false);
        setShopeeResult({ ok: true, encontrados: 23, novos: 18, atualizados: 5 });
        toast.success('Coleta concluída', { description: '18 novos · 5 atualizados' });
        return;
      }
      setShopeeStep(steps[i]);
      setTimeout(() => { i++; next(); }, steps[i].delay);
    };
    next();
  };

  return (
    <window.AdminShell current="automacao" title="Automação" subtitle="Coleta de produtos e geração de copy"
      actions={
        <button onClick={() => setBulkOpen(true)} style={window.primaryAdminBtn}>
          <window.Icon name="sparkles" size={14} /> Gerar copies em lote
        </button>
      }
    >
      {/* Platform cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
        {/* Shopee */}
        <window.Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #f05d23, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 18, color: '#fff', fontWeight: 700, fontFamily: 'Sora, system-ui' }}>S</span>
            </span>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 16, color: '#0f172a' }}>Shopee</h3>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b' }}>API GraphQL · HMAC-SHA1</div>
            </div>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: '#15803d', fontWeight: 600, background: '#dcfce7', padding: '4px 8px', borderRadius: 99 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              Ativo
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
            <MiniStat label="Última coleta" value="há 2h" />
            <MiniStat label="Produtos hoje" value="18" />
            <MiniStat label="Taxa sucesso (7d)" value="96%" />
          </div>

          {shopeeRunning && shopeeStep && (
            <div style={{ background: '#eff6ff', borderRadius: 10, padding: 14, marginBottom: 12, border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <window.Icon name="refresh" size={16} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#1e40af', fontWeight: 500 }}>{shopeeStep.msg}</span>
              </div>
            </div>
          )}

          {shopeeResult && (
            <div style={{ background: '#dcfce7', borderRadius: 10, padding: 14, marginBottom: 12, border: '1px solid #86efac' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <window.Icon name="check" size={16} strokeWidth={3} style={{ color: '#15803d' }} />
                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 600, color: '#15803d' }}>
                  Concluído · {shopeeResult.novos} novos, {shopeeResult.atualizados} atualizados
                </span>
              </div>
            </div>
          )}

          <button onClick={runShopee} disabled={shopeeRunning} style={{
            ...window.primaryAdminBtn, background: '#f05d23', width: '100%', justifyContent: 'center', padding: '12px',
            opacity: shopeeRunning ? 0.7 : 1,
          }}>
            {shopeeRunning ? <window.Icon name="refresh" size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <window.Icon name="play" size={14} />}
            {shopeeRunning ? 'Coletando...' : 'Buscar agora'}
          </button>
        </window.Card>

        {/* Mercado Livre — disabled */}
        <window.Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, opacity: 0.7 }}>
            <span style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #fff159, #facc15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333',
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Sora, system-ui' }}>ML</span>
            </span>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 16, color: '#0f172a' }}>Mercado Livre</h3>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#64748b' }}>Em desenvolvimento</div>
            </div>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: '#64748b', fontWeight: 600, background: '#f1f5f9', padding: '4px 8px', borderRadius: 99 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />
              Em breve
            </span>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, textAlign: 'center', border: '1px dashed #cbd5e1' }}>
            <window.Icon name="package" size={28} style={{ color: '#cbd5e1', display: 'block', margin: '0 auto 10px' }} />
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', maxWidth: 240, margin: '0 auto', lineHeight: 1.5 }}>
              Integração com Mercado Livre Afiliados — disponível na fase pós-MVP.
            </div>
          </div>
        </window.Card>
      </div>

      {/* Scheduler card */}
      <window.Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 15, color: '#0f172a' }}>
              Agendamento automático
            </h3>
            <p style={{ margin: '2px 0 0', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b' }}>
              Execução diária via <code style={codeStyle}>pg_cron</code> · pós-MVP
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b' }}>cron: 0 7 * * *</span>
            <Toggle checked={false} onChange={() => toast.info('Disponível pós-MVP')} />
          </div>
        </div>
      </window.Card>

      {/* Histórico */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontFamily: 'Sora, system-ui', fontWeight: 600, fontSize: 16, color: '#0f172a' }}>
          Histórico de execuções
        </h3>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Sans, system-ui', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                {['Data/hora', 'Plataforma', 'Status', 'Encontrados', 'Publicados', 'Detalhes'].map((h) => (
                  <th key={h} style={{ padding: '11px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {window.EXEC_LOG.map((log) => <ExecRow key={log.id} log={log} />)}
            </tbody>
          </table>
        </div>
      </div>

      <BulkGenerateModal open={bulkOpen} onClose={() => setBulkOpen(false)} produtos={window.PRODUTOS.filter((p) => !p.copy_gerada)} />
    </window.AdminShell>
  );
}

function ExecRow({ log }) {
  const statusColors = {
    success: { bg: '#dcfce7', fg: '#15803d', label: 'Sucesso' },
    error:   { bg: '#fee2e2', fg: '#b91c1c', label: 'Erro' },
    partial: { bg: '#fef3c7', fg: '#a16207', label: 'Parcial' },
  };
  const s = statusColors[log.status];
  const time = new Date(log.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#475569' }}>{time}</td>
      <td style={{ padding: '12px 16px' }}><PlatBadge plat={log.plataforma} /></td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{
          background: s.bg, color: s.fg, padding: '3px 9px', borderRadius: 99,
          fontFamily: 'DM Sans, system-ui', fontSize: 11.5, fontWeight: 600,
        }}>{s.label}</span>
      </td>
      <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>{log.encontrados}</td>
      <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>{log.publicados}</td>
      <td style={{ padding: '12px 16px', fontSize: 12, color: log.erro ? '#b91c1c' : '#94a3b8', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {log.erro || '—'}
      </td>
    </tr>
  );
}

Object.assign(window, {
  AdminConfig, AdminProdutos, AdminAutomacao,
  Toggle, FormField,
});
