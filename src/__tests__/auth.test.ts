import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('sessionOptions', () => {
  it('uses SESSION_SECRET when set', async () => {
    process.env.SESSION_SECRET = 'this-is-a-32-char-or-longer-secret-xx';
    const mod = await import('@/lib/auth');
    expect(mod.sessionOptions.password).toBe('this-is-a-32-char-or-longer-secret-xx');
  });

  it('sets the cookie name and httpOnly', async () => {
    const mod = await import('@/lib/auth');
    expect(mod.sessionOptions.cookieName).toBe('techindica_admin');
    expect(mod.sessionOptions.cookieOptions?.httpOnly).toBe(true);
  });
});
