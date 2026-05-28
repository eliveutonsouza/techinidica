'use client';

import { useState, useTransition } from 'react';
import { saveShopeeConfig, testShopeeConnection } from '@/actions/config';
import { Icon } from '@/components/ui/icon';
import { inputStyle, primaryAdminBtn, ghostBtn, fonts, colors } from '@/components/ui/styles';
import type { SaveShopeeConfigInput } from '@/schemas';

export function ConfigForm({ initial }: { initial: SaveShopeeConfigInput }) {
  const [state, setState] = useState<SaveShopeeConfigInput>(initial);
  const [showSecret, setShowSecret] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  function update<K extends keyof SaveShopeeConfigInput>(key: K, value: SaveShopeeConfigInput[K]) {
    setState((s) => ({ ...s, [key]: value }));
    setDirty(true);
  }

  function onSave() {
    setMsg(null);
    startTransition(async () => {
      const r = await saveShopeeConfig(state);
      if (r.ok) {
        setMsg({ type: 'ok', text: 'Credenciais salvas em affiliate_config.' });
        setDirty(false);
      } else {
        setMsg({ type: 'err', text: r.error });
      }
    });
  }

  function onTest() {
    setMsg(null);
    startTransition(async () => {
      const r = await testShopeeConnection(state);
      if (r.ok) {
        setMsg({
          type: r.data.status === 200 ? 'ok' : 'err',
          text: `Resposta HTTP ${r.data.status}`,
        });
      } else {
        setMsg({ type: 'err', text: r.error });
      }
    });
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 24,
        maxWidth: 720,
      }}
    >
      <h2 style={{ margin: 0, fontFamily: fonts.sora, fontSize: 17, color: colors.fg, fontWeight: 600 }}>
        Shopee Affiliates
      </h2>
      <p style={{ margin: '4px 0 20px', fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>
        Credenciais salvas em <code style={{ fontFamily: fonts.mono, fontSize: 11.5, background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>affiliate_config</code>.
        Em fallback, usa <code style={{ fontFamily: fonts.mono, fontSize: 11.5, background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>SHOPEE_*</code> do env.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="App ID" required>
          <input value={state.app_id} onChange={(e) => update('app_id', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Secret Key" required>
          <div style={{ position: 'relative' }}>
            <input
              type={showSecret ? 'text' : 'password'}
              value={state.secret}
              onChange={(e) => update('secret', e.target.value)}
              style={{ ...inputStyle, paddingRight: 70 }}
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {showSecret ? 'ocultar' : 'mostrar'}
            </button>
          </div>
        </Field>
        <Field label="Tracking ID" required>
          <input value={state.tracking_id} onChange={(e) => update('tracking_id', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Integracao ativa">
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={state.ativo}
              onChange={(e) => update('ativo', e.target.checked)}
            />
            <span style={{ fontSize: 13, color: colors.fg }}>
              {state.ativo ? 'Coleta habilitada' : 'Pausada'}
            </span>
          </label>
        </Field>
      </div>

      {msg && (
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            borderRadius: 8,
            background: msg.type === 'ok' ? '#dcfce7' : '#fee2e2',
            color: msg.type === 'ok' ? '#15803d' : '#991b1b',
            border: `1px solid ${msg.type === 'ok' ? '#86efac' : '#fca5a5'}`,
            fontFamily: fonts.body,
            fontSize: 13,
          }}
        >
          {msg.text}
        </div>
      )}

      <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
        <button
          onClick={onSave}
          disabled={!dirty || pending}
          style={{ ...primaryAdminBtn, opacity: !dirty || pending ? 0.5 : 1 }}
        >
          <Icon name="check" size={13} strokeWidth={3} />
          Salvar
        </button>
        <button onClick={onTest} disabled={pending} style={ghostBtn}>
          <Icon name="zap" size={13} style={pending ? { animation: 'spin 1s linear infinite' } : {}} />
          {pending ? 'Testando...' : 'Testar conexao'}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: fonts.body,
          fontSize: 12.5,
          fontWeight: 600,
          color: colors.fg,
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      {children}
    </div>
  );
}
