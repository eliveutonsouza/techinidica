'use server';

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginSchema, type ActionResult } from '@/schemas';

export async function login(formData: FormData): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = LoginSchema.safeParse({
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados invalidos' };
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { ok: false, error: 'ADMIN_PASSWORD nao configurado no servidor' };
  }
  if (parsed.data.password !== expected) {
    return { ok: false, error: 'Senha incorreta' };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  return { ok: true, data: { redirectTo: '/admin' } };
}

export async function logout(): Promise<never> {
  const session = await getSession();
  session.destroy();
  redirect('/admin/login');
}
