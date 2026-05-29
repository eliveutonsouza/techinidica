import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export type SessionData = {
  isAdmin?: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'fallback-dev-only-secret-min-32-chars-xxxxxx',
  cookieName: 'techindica_admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

/**
 * Returns true when either:
 * 1. iron-session cookie is set (single-password legacy admin), OR
 * 2. Supabase Auth JWT is valid AND user_id exists in admin_users table.
 */
export async function isAuthed(): Promise<boolean> {
  // Fast path: iron-session cookie
  const session = await getSession();
  if (session.isAdmin === true) return true;

  // Supabase Auth path (multi-user) — DB query via Prisma
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const adminUser = await prisma.adminUser.findUnique({
      where: { user_id: user.id },
      select: { id: true },
    });

    return adminUser !== null;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<void> {
  const authed = await isAuthed();
  if (!authed) throw new Error('Nao autorizado');
}
