import { prisma, serializeDates } from '@/lib/prisma';
import { AdminShell } from '@/components/admin/admin-shell';
import { ExecucaoLogSchema, type ExecucaoLog } from '@/schemas';
import { AutomacaoControls } from './automacao-controls';
import { fonts, colors } from '@/components/ui/styles';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Automacao', robots: { index: false, follow: false } };

async function load(): Promise<ExecucaoLog[]> {
  const rows = await prisma.execucaoLog.findMany({ orderBy: { created_at: 'desc' }, take: 20 });
  return rows
    .map((r) => ExecucaoLogSchema.safeParse(serializeDates(r)))
    .filter((r) => r.success)
    .map((r) => r.data as ExecucaoLog);
}

export default async function AdminAutomacaoPage() {
  const logs = await load();
  return (
    <AdminShell current="automacao" title="Automacao" subtitle="Coleta de produtos e geracao de copy">
      <AutomacaoControls />
      <h2
        style={{
          fontFamily: fonts.sora,
          fontSize: 16,
          margin: '32px 0 12px',
          color: colors.fg,
        }}
      >
        Historico de execucoes
      </h2>
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
              {['Data', 'Plataforma', 'Status', 'Encontrados', 'Publicados', 'Erro'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '11px 16px',
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
            {logs.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 16px', fontFamily: fonts.mono, fontSize: 12 }}>
                  {new Date(l.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td style={{ padding: '10px 16px' }}>{l.plataforma}</td>
                <td style={{ padding: '10px 16px' }}>
                  <StatusBadge status={l.status} />
                </td>
                <td style={{ padding: '10px 16px' }}>{l.produtos_encontrados}</td>
                <td style={{ padding: '10px 16px' }}>{l.produtos_publicados}</td>
                <td
                  style={{
                    padding: '10px 16px',
                    color: l.erro ? '#b91c1c' : '#94a3b8',
                    maxWidth: 280,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {l.erro ?? '—'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 32,
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  Nenhuma execucao registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
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
