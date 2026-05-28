'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  SaveShopeeConfigSchema,
  type ActionResult,
  type SaveShopeeConfigInput,
} from '@/schemas';
import { buildShopeeAuthHeader } from '@/lib/shopee';

export async function saveShopeeConfig(
  input: SaveShopeeConfigInput,
): Promise<ActionResult<null>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const parsed = SaveShopeeConfigSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados invalidos' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('affiliate_config').upsert(
    {
      plataforma: 'shopee',
      config: parsed.data,
      ativo: parsed.data.ativo,
    },
    { onConflict: 'plataforma' },
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/config');
  return { ok: true, data: null };
}

export async function testShopeeConnection(
  input: SaveShopeeConfigInput,
): Promise<ActionResult<{ status: number }>> {
  try {
    await requireAuth();
  } catch {
    return { ok: false, error: 'Nao autorizado' };
  }

  const parsed = SaveShopeeConfigSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Dados invalidos' };

  const auth = buildShopeeAuthHeader(parsed.data.app_id, parsed.data.secret);
  const res = await fetch('https://open-api.affiliate.shopee.com.br/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({
      query: '{ productOfferV2(listType: 0, limit: 1, sortType: 2) { nodes { itemId } } }',
    }),
  });

  return { ok: true, data: { status: res.status } };
}
