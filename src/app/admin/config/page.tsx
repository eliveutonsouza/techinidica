import { prisma } from '@/lib/prisma';
import { AdminShell } from '@/components/admin/admin-shell';
import { SaveShopeeConfigSchema } from '@/schemas';
import { ConfigForm } from './config-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Configuracoes', robots: { index: false, follow: false } };

async function loadShopeeConfig() {
  const data = await prisma.affiliateConfig.findUnique({
    where: { plataforma: 'shopee' },
    select: { config: true, ativo: true },
  });
  if (!data) {
    return { app_id: '', secret: '', tracking_id: 'techindica_main', ativo: true };
  }
  const parsed = SaveShopeeConfigSchema.partial().safeParse(data.config);
  return {
    app_id: parsed.success ? (parsed.data.app_id as string) ?? '' : '',
    secret: parsed.success ? (parsed.data.secret as string) ?? '' : '',
    tracking_id: parsed.success ? (parsed.data.tracking_id as string) ?? 'techindica_main' : 'techindica_main',
    ativo: data.ativo ?? true,
  };
}

export default async function AdminConfigPage() {
  const shopee = await loadShopeeConfig();
  return (
    <AdminShell current="config" title="Configuracoes" subtitle="Credenciais de integracao">
      <ConfigForm initial={shopee} />
      <MLSection />
    </AdminShell>
  );
}

function MLSection() {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 24,
        maxWidth: 720,
        marginTop: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontFamily: 'Sora, system-ui', fontSize: 17, color: '#0f172a', fontWeight: 600 }}>
          Mercado Livre Afiliados
        </h2>
        <span
          style={{
            background: '#fef3c7',
            color: '#92400e',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 99,
            textTransform: 'uppercase' as const,
            letterSpacing: 0.5,
          }}
        >
          Manual
        </span>
      </div>
      <p style={{ margin: '0 0 12px', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
        O ML Afiliados não possui API pública para coleta automática no Brasil. Para adicionar links ML:
      </p>
      <ol style={{ margin: '0 0 12px', padding: '0 0 0 18px', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#334155', lineHeight: 1.8 }}>
        <li>Acesse o <strong>Mercado Livre Afiliados</strong> e gere o link de afiliado do produto.</li>
        <li>Na tabela de <strong>Produtos</strong>, clique no ícone ML de qualquer produto.</li>
        <li>Cole o link gerado — ele será salvo no campo <code style={{ fontFamily: 'JetBrains Mono', fontSize: 11, background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>link_mercadolivre</code>.</li>
        <li>O botão "Mercado Livre" aparece automaticamente na página do produto.</li>
      </ol>
      <p style={{ margin: 0, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: '#94a3b8' }}>
        Comissão média ML: 2–8% CPS (custo por venda).
      </p>
    </div>
  );
}
