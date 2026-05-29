import { createAdminClient } from '@/lib/supabase/admin';
import { AdminShell } from '@/components/admin/admin-shell';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Usuários Admin', robots: { index: false, follow: false } };

interface AdminUser {
  id: number;
  user_id: string;
  role: string;
  nome: string | null;
  created_at: string;
  email?: string;
}

async function loadUsers(): Promise<AdminUser[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('admin_users')
    .select('id, user_id, role, nome, created_at')
    .order('created_at');

  if (!data) return [];

  const { data: authData } = await supabase.auth.admin.listUsers();
  const emailMap = new Map(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? '']),
  );

  return data.map((u) => ({ ...u, email: emailMap.get(u.user_id) }));
}

export default async function AdminUsuariosPage() {
  const users = await loadUsers();

  return (
    <AdminShell current="usuarios" title="Usuários Admin" subtitle="Gerencie quem pode acessar o painel">
      <div
        style={{
          background: '#fff5f5',
          border: '1px solid #fecaca',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 20,
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 13,
          color: '#991b1b',
          lineHeight: 1.6,
        }}
      >
        <strong>Como adicionar um admin:</strong>
        <ol style={{ margin: '6px 0 0', paddingLeft: 18 }}>
          <li>Crie o usuário em <strong>Supabase Dashboard → Authentication → Users</strong>.</li>
          <li>Copie o <code style={{ fontFamily: 'monospace', fontSize: 11, background: '#fee2e2', padding: '1px 4px', borderRadius: 4 }}>user_id</code> gerado.</li>
          <li>Execute no SQL Editor: <code style={{ fontFamily: 'monospace', fontSize: 11, background: '#fee2e2', padding: '1px 4px', borderRadius: 4 }}>INSERT INTO admin_users (user_id, role, nome) VALUES (&#39;&lt;uuid&gt;&#39;, &#39;editor&#39;, &#39;Nome&#39;);</code></li>
          <li>O usuário poderá fazer login em <code>/admin/login</code> com e-mail e senha (suporte a Supabase Auth).</li>
        </ol>
      </div>

      {users.length === 0 ? (
        <div
          style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 10,
            padding: 32,
            textAlign: 'center',
            color: '#64748b',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
          }}
        >
          Nenhum usuário admin cadastrado ainda. Siga as instruções acima.
        </div>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Nome', 'E-mail', 'Role', 'Desde'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 500 }}>{u.nome ?? '—'}</td>
                <td style={{ padding: '10px 12px', color: '#334155' }}>{u.email ?? u.user_id.slice(0, 8) + '...'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span
                    style={{
                      background: u.role === 'owner' ? '#eff6ff' : '#f0fdf4',
                      color: u.role === 'owner' ? '#1d4ed8' : '#15803d',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 99,
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 12 }}>
                  {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
