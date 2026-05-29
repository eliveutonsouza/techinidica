import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

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

  // Supabase Auth path (multi-user)
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    return data != null;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<void> {
  const authed = await isAuthed();
  if (!authed) throw new Error('Nao autorizado');
}
