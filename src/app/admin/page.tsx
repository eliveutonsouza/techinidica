import { prisma, serializeDates } from '@/lib/prisma';
import { AdminShell } from '@/components/admin/admin-shell';
import { ExecucaoLogSchema, type ExecucaoLog } from '@/schemas';
import { colors, fonts } from '@/components/ui/styles';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard', robots: { index: false, follow: false } };

async function loadStats() {
  const [total, publicados, semCopy, logsRaw] = await prisma.$transaction([
    prisma.produto.count(),
    prisma.produto.count({ where: { publicado: true } }),
    prisma.produto.count({ where: { copy_gerada: null } }),
    prisma.execucaoLog.findMany({ orderBy: { created_at: 'desc' }, take: 5 }),
  ]);

  const logs = logsRaw
    .map((r) => ExecucaoLogSchema.safeParse(serializeDates(r)))
    .filter((r) => r.success)
    .map((r) => r.data as ExecucaoLog);

  return {
    total,
    publicados,
    semCopy,
    ultimaExec: logs[0]?.created_at ?? null,
    logs,
  };
}

export default async function AdminDashboardPage() {
  const stats = await loadStats();

  return (
    <AdminShell current="dashboard" title="Dashboard" subtitle="Visao geral do TechIndica">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 28,
        }}
      >
        <KPI label="Total de produtos" value={stats.total} />
        <KPI label="Publicados" value={stats.publicados} accent={colors.success} />
        <KPI label="Sem copy" value={stats.semCopy} accent={colors.warning} />
        <KPI
          label="Ultima execucao"
          value={stats.ultimaExec ? formatRelative(stats.ultimaExec) : '—'}
          smallValue
        />
      </div>

      <h2
        style={{
          fontFamily: fonts.sora,
          fontSize: 16,
          color: colors.fg,
          margin: '0 0 12px',
        }}
      >
        Execucoes recentes
      </h2>
      {stats.logs.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: '1px dashed #cbd5e1',
            borderRadius: 14,
            padding: 32,
            textAlign: 'center',
            fontFamily: fonts.body,
            fontSize: 13,
            color: colors.muted,
          }}
        >
          Sem execucoes ainda. Va para Automacao e rode uma coleta Shopee.
        </div>
      ) : (
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
                {['Quando', 'Plataforma', 'Status', 'Encontrados', 'Publicados'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      fontFamily: fonts.mono,
                      fontSize: 10.5,
                      color: colors.muted,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.logs.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 16px', fontFamily: fonts.mono, fontSize: 11.5, color: colors.slate700 }}>
                    {formatRelative(l.created_at)}
                  </td>
                  <td style={{ padding: '10px 16px' }}>{l.plataforma}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <StatusBadge status={l.status} />
                  </td>
                  <td style={{ padding: '10px 16px' }}>{l.produtos_encontrados}</td>
                  <td style={{ padding: '10px 16px' }}>{l.produtos_publicados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function KPI({
  label,
  value,
  accent,
  smallValue,
}: {
  label: string;
  value: number | string;
  accent?: string;
  smallValue?: boolean;
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, fontWeight: 500 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.sora,
          fontWeight: 700,
          fontSize: smallValue ? 16 : 26,
          color: accent ?? colors.fg,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'success' | 'error' | 'partial' }) {
  const cfg = {
    success: { bg: '#dcfce7', fg: '#15803d', label: 'Sucesso' },
    error: { bg: '#fee2e2', fg: '#b91c1c', label: 'Erro' },
    partial: { bg: '#fef3c7', fg: '#a16207', label: 'Parcial' },
  }[status];
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.fg,
        padding: '3px 9px',
        borderRadius: 99,
        fontFamily: fonts.body,
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      {cfg.label}
    </span>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}m atras`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h atras`;
  const dd = Math.floor(hr / 24);
  if (dd < 7) return `${dd}d atras`;
  return date.toLocaleDateString('pt-BR');
}
