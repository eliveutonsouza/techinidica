import { createAdminClient } from '@/lib/supabase/admin';
import { AdminShell } from '@/components/admin/admin-shell';
import { ProdutoSchema, type Produto } from '@/schemas';
import { ProdutosTable } from './produtos-table';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Produtos', robots: { index: false, follow: false } };

async function load(): Promise<Produto[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('produtos')
    .select('*')
    .order('created_at', { ascending: false });
  return (data ?? [])
    .map((p) => ProdutoSchema.safeParse(p))
    .filter((r) => r.success)
    .map((r) => r.data as Produto);
}

export default async function AdminProdutosPage() {
  const produtos = await load();
  return (
    <AdminShell
      current="produtos"
      title="Produtos"
      subtitle={`${produtos.length} produto${produtos.length === 1 ? '' : 's'} no banco`}
    >
      <ProdutosTable initial={produtos} />
    </AdminShell>
  );
}
