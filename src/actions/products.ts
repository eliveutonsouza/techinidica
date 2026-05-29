'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

  try {
    await prisma.produto.update({ where: { id: parsed.data.id }, data: { publicado: parsed.data.value } });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro' };
  }

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

  try {
    await prisma.produto.update({ where: { id: parsed.data.id }, data: { destaque: parsed.data.value } });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro' };
  }

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

  try {
    await prisma.produto.delete({ where: { id: parsed.data.id } });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro' };
  }

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

  try {
    await prisma.produto.update({
      where: { id: parsed.data.id },
      data: { link_mercadolivre: parsed.data.link_mercadolivre },
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro' };
  }

  revalidatePath('/');
  revalidatePath('/admin/produtos');
  revalidatePath(`/produto/${id}`);
  return { ok: true, data: null };
}
