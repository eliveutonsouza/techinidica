'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  ToggleProdutoSchema,
  DeleteProdutoSchema,
  SetMLLinkSchema,
  type ActionResult,
} from '@/schemas';

export async function togglePublicado(
  id: number,
  value: boolean,
): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const parsed = ToggleProdutoSchema.safeParse({ id, value });
  if (!parsed.success) return { ok: false, error: 'Dados invalidos' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('produtos')
    .update({ publicado: parsed.data.value })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/produtos');
  return { ok: true, data: null };
}

export async function toggleDestaque(
  id: number,
  value: boolean,
): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const parsed = ToggleProdutoSchema.safeParse({ id, value });
  if (!parsed.success) return { ok: false, error: 'Dados invalidos' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('produtos')
    .update({ destaque: parsed.data.value })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/produtos');
  return { ok: true, data: null };
}

export async function deleteProduto(id: number): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const parsed = DeleteProdutoSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, error: 'Dados invalidos' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/produtos');
  return { ok: true, data: null };
}

export async function setMercadoLivreLink(
  id: number,
  link: string | null,
): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const parsed = SetMLLinkSchema.safeParse({ id, link_mercadolivre: link || null });
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? 'Dados invalidos' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('produtos')
    .update({ link_mercadolivre: parsed.data.link_mercadolivre })
    .eq('id', parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/produtos');
  revalidatePath(`/produto/${id}`);
  return { ok: true, data: null };
}
