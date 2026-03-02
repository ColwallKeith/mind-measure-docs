import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const TOKEN = process.env.MM_INTERNAL_TOKEN || '';
const LEGACY_COOKIE = 'mm_auth';
const SESSION_COOKIE = 'mm_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

const SECRET = process.env.SUPERUSER_JWT_SECRET || process.env.JWT_SECRET || '';
const REQUIRED_PERMISSION = 'docs_platform_access';

async function verifyJwt(token: string): Promise<{ permissions?: string[] } | null> {
  if (!SECRET) return null;
  try {
    const key = new TextEncoder().encode(SECRET);
    const { payload } = await jwtVerify(token, key);
    return payload as { permissions?: string[] };
  } catch {
    return null;
  }
}

function hasAccess(permissions: string[] | undefined): boolean {
  if (!permissions) return false;
  return permissions.includes('super_admin') || permissions.includes(REQUIRED_PERMISSION);
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Legacy mm_token flow (superuser panel link)
  const tokenParam = url.searchParams.get('mm_token');
  if (tokenParam && TOKEN && tokenParam === TOKEN) {
    url.searchParams.delete('mm_token');
    const res = NextResponse.redirect(url);
    res.cookies.set(LEGACY_COOKIE, TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return res;
  }

  // 2. Legacy cookie (from superuser panel)
  const legacyCookie = req.cookies.get(LEGACY_COOKIE);
  if (legacyCookie && TOKEN && legacyCookie.value === TOKEN) {
    return NextResponse.next();
  }

  // 3. JWT session cookie (from login page)
  const sessionCookie = req.cookies.get(SESSION_COOKIE);
  if (sessionCookie) {
    const payload = await verifyJwt(sessionCookie.value);
    if (payload && hasAccess(payload.permissions)) {
      return NextResponse.next();
    }
  }

  // 4. Not authenticated — redirect to login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico|images).*)'],
};
