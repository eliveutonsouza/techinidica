import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

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

export async function isAuthed(): Promise<boolean> {
  const session = await getSession();
  return session.isAdmin === true;
}

export async function requireAuth(): Promise<void> {
  const authed = await isAuthed();
  if (!authed) throw new Error('Nao autorizado');
}
