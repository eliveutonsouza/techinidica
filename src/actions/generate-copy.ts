'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateProductCopy } from '@/lib/openai';
import { type ActionResult } from '@/schemas';

export async function generateCopyForProduto(
  id: number,
): Promise<ActionResult<{ id: number }>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const produto = await prisma.produto.findUnique({
    where: { id },
    select: { id: true, nome: true, preco_atual: true, plataforma: true },
  });

  if (!produto) {
    return { ok: false, error: 'Produto nao encontrado' };
  }

  let result;
  try {
    result = await generateProductCopy({
      nome: produto.nome,
      preco_atual: Number(produto.preco_atual),
      plataforma: produto.plataforma,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro na OpenAI';
    return { ok: false, error: msg };
  }

  try {
    await prisma.produto.update({
      where: { id },
      data: {
        categoria: result.categoria,
        descricao_curta: result.descricao_curta,
        copy_gerada: result.copy_gerada,
        badge: result.badge,
        nota: result.nota !== undefined ? String(result.nota) : undefined,
        pros: result.pros,
        contras: result.contras,
        specs: result.specs,
        publicado: true,
      },
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro ao salvar' };
  }

  revalidatePath('/');
  revalidatePath('/admin/produtos');
  return { ok: true, data: { id } };
}

export async function generateCopyBulk(
  ids: number[],
): Promise<ActionResult<{ sucesso: number; falhas: number }>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  let sucesso = 0;
  let falhas = 0;
  for (const id of ids) {
    const r = await generateCopyForProduto(id);
    if (r.ok) sucesso++;
    else falhas++;
    await new Promise((res) => setTimeout(res, 400));
  }

  return { ok: true, data: { sucesso, falhas } };
}
