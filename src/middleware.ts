import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIX = '/admin';
const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(PROTECTED_PREFIX) || pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const session = request.cookies.get('techindica_admin');
  if (!session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
