import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.MM_INTERNAL_TOKEN || '';
const LEGACY_COOKIE = 'mm_auth';
const SESSION_COOKIE = 'mm_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

const SECRET = process.env.SUPERUSER_JWT_SECRET || process.env.JWT_SECRET || '';
const REQUIRED_PERMISSION = 'docs_platform_access';

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyJwt(token: string): Promise<{ permissions?: string[] } | null> {
  if (!SECRET) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlDecode(parts[2]);
    const valid = await crypto.subtle.verify('HMAC', key, signature.buffer as ArrayBuffer, data.buffer as ArrayBuffer);
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
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
