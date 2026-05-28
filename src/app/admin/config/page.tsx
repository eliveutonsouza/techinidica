import { createAdminClient } from '@/lib/supabase/admin';
import { AdminShell } from '@/components/admin/admin-shell';
import { SaveShopeeConfigSchema } from '@/schemas';
import { ConfigForm } from './config-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Configuracoes', robots: { index: false, follow: false } };

async function loadShopeeConfig() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('affiliate_config')
    .select('config, ativo')
    .eq('plataforma', 'shopee')
    .maybeSingle();
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
    </AdminShell>
  );
}
