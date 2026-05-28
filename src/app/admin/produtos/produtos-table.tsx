'use client';

import { useMemo, useState, useTransition } from 'react';
import type { Produto } from '@/schemas';
import {
  togglePublicado,
  toggleDestaque,
  deleteProduto,
} from '@/actions/products';
import { generateCopyForProduto, generateCopyBulk } from '@/actions/generate-copy';
import { Icon } from '@/components/ui/icon';
import { inputStyle, primaryAdminBtn, ghostBtn, dangerBtn, fonts, colors } from '@/components/ui/styles';

export function ProdutosTable({ initial }: { initial: Produto[] }) {
  const [items, setItems] = useState(initial);
  const [filterPlat, setFilterPlat] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState<Record<number, string | null>>({});
  const [pending, startTransition] = useTransition();
  const [bulkRunning, setBulkRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = items;
    if (filterPlat !== 'all') r = r.filter((p) => p.plataforma === filterPlat);
    if (filterStatus === 'pub') r = r.filter((p) => p.publicado);
    if (filterStatus === 'rascunho') r = r.filter((p) => !p.publicado);
    if (filterStatus === 'sem-copy') r = r.filter((p) => !p.copy_gerada);
    if (search.trim()) r = r.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [items, filterPlat, filterStatus, search]);

  function setItemBusy(id: number, what: string | null) {
    setBusy((b) => ({ ...b, [id]: what }));
  }

  function onTogglePub(p: Produto) {
    const next = !p.publicado;
    setItems((cur) => cur.map((x) => (x.id === p.id ? { ...x, publicado: next } : x)));
    startTransition(async () => {
      const r = await togglePublicado(p.id, next);
      if (!r.ok) {
        setError(r.error);
        setItems((cur) => cur.map((x) => (x.id === p.id ? { ...x, publicado: !next } : x)));
      }
    });
  }

  function onToggleDest(p: Produto) {
    const next = !p.destaque;
    setItems((cur) => cur.map((x) => (x.id === p.id ? { ...x, destaque: next } : x)));
    startTransition(async () => {
      const r = await toggleDestaque(p.id, next);
      if (!r.ok) {
        setError(r.error);
        setItems((cur) => cur.map((x) => (x.id === p.id ? { ...x, destaque: !next } : x)));
      }
    });
  }

  function onDelete(p: Produto) {
    if (!confirm(`Excluir "${p.nome.slice(0, 60)}"? Esta acao nao pode ser desfeita.`)) return;
    setItemBusy(p.id, 'deleting');
    startTransition(async () => {
      const r = await deleteProduto(p.id);
      setItemBusy(p.id, null);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setItems((cur) => cur.filter((x) => x.id !== p.id));
    });
  }

  function onGenerate(p: Produto) {
    setItemBusy(p.id, 'generating');
    startTransition(async () => {
      const r = await generateCopyForProduto(p.id);
      setItemBusy(p.id, null);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      window.location.reload();
    });
  }

  async function onBulkGenerate() {
    const ids = items.filter((p) => !p.copy_gerada).map((p) => p.id);
    if (ids.length === 0) return;
    if (!confirm(`Gerar copy para ${ids.length} produtos? Custo estimado: $${(ids.length * 0.011).toFixed(2)} USD.`)) return;
    setBulkRunning(true);
    setError(null);
    const r = await generateCopyBulk(ids);
    setBulkRunning(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    window.location.reload();
  }

  return (
    <>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px auto', gap: 10 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            style={inputStyle}
          />
          <select value={filterPlat} onChange={(e) => setFilterPlat(e.target.value)} style={inputStyle}>
            <option value="all">Todas plataformas</option>
            <option value="shopee">Shopee</option>
            <option value="mercadolivre">Mercado Livre</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inputStyle}>
            <option value="all">Todos status</option>
            <option value="pub">Publicado</option>
            <option value="rascunho">Rascunho</option>
            <option value="sem-copy">Sem copy</option>
          </select>
          <button
            onClick={onBulkGenerate}
            disabled={bulkRunning || items.filter((p) => !p.copy_gerada).length === 0}
            style={{ ...primaryAdminBtn, background: '#7c3aed', opacity: bulkRunning ? 0.7 : 1 }}
          >
            <Icon name={bulkRunning ? 'refresh' : 'sparkles'} size={13} style={bulkRunning ? { animation: 'spin 1s linear infinite' } : {}} />
            {bulkRunning ? 'Gerando...' : 'Gerar copies em lote'}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontFamily: fonts.body,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: fonts.body, fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              {['Produto', 'Plataforma', 'Categoria', 'Preco', 'Nota', 'Publicado', 'Destaque', 'Acoes'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '11px 16px',
                    fontFamily: fonts.mono,
                    fontSize: 10.5,
                    color: colors.muted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontWeight: 600,
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', maxWidth: 360 }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: colors.fg, fontWeight: 500 }}>
                    {p.nome}
                  </div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>
                    #{p.id} · {p.platform_id}
                    {!p.copy_gerada && <span style={{ marginLeft: 6, color: '#b45309', fontWeight: 600 }}>· SEM COPY</span>}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>{p.plataforma}</td>
                <td style={{ padding: '12px 16px', color: colors.slate700 }}>
                  {p.categoria ?? <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>pendente</span>}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: fonts.sora, fontWeight: 600 }}>
                  R$ {Number(p.preco_atual).toFixed(2).replace('.', ',')}
                </td>
                <td style={{ padding: '12px 16px', fontFamily: fonts.sora, fontWeight: 600 }}>
                  {p.nota != null ? Number(p.nota).toFixed(1) : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Toggle
                    checked={p.publicado}
                    disabled={!p.copy_gerada || pending}
                    onChange={() => onTogglePub(p)}
                  />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Toggle
                    checked={p.destaque}
                    disabled={!p.publicado || pending}
                    onChange={() => onToggleDest(p)}
                  />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!p.copy_gerada && (
                      <button
                        onClick={() => onGenerate(p)}
                        disabled={busy[p.id] === 'generating'}
                        style={{
                          ...primaryAdminBtn,
                          background: '#7c3aed',
                          padding: '6px 10px',
                          fontSize: 12,
                        }}
                      >
                        <Icon
                          name={busy[p.id] === 'generating' ? 'refresh' : 'sparkles'}
                          size={12}
                          style={busy[p.id] === 'generating' ? { animation: 'spin 1s linear infinite' } : {}}
                        />
                        {busy[p.id] === 'generating' ? 'Gerando...' : 'Gerar'}
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(p)}
                      disabled={busy[p.id] === 'deleting'}
                      style={{ ...dangerBtn, padding: '6px 10px', fontSize: 12 }}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: 40,
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontFamily: fonts.body,
                  }}
                >
                  Nenhum produto com esses filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange()}
      style={{
        width: 36,
        height: 20,
        borderRadius: 99,
        background: checked ? '#2563eb' : '#cbd5e1',
        border: 'none',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        padding: 0,
      }}
      aria-pressed={checked}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.15s',
        }}
      />
    </button>
  );
}
