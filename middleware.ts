import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.MM_INTERNAL_TOKEN || '';
const COOKIE_NAME = 'mm_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const tokenParam = url.searchParams.get('mm_token');

  if (tokenParam && TOKEN && tokenParam === TOKEN) {
    url.searchParams.delete('mm_token');
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE_NAME, TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return res;
  }

  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie && TOKEN && cookie.value === TOKEN) {
    return NextResponse.next();
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Access Restricted</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: 'Inter', system-ui, sans-serif; background: #f8fafc; color: #334155;
    }
    .card {
      text-align: center; max-width: 420px; padding: 3rem 2.5rem;
      background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .icon { font-size: 2.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; font-weight: 700; color: #204C4C; margin-bottom: 0.5rem; }
    p { font-size: 0.95rem; line-height: 1.6; color: #64748b; margin-bottom: 1.5rem; }
    a {
      display: inline-block; padding: 10px 24px; background: #204C4C; color: white;
      text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
    }
    a:hover { background: #1a3d3d; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>Access Restricted</h1>
    <p>This site is only accessible via the Mind Measure Superuser Portal.</p>
    <a href="https://admin.mindmeasure.co.uk/superuser">Go to Superuser Portal</a>
  </div>
</body>
</html>`,
    { status: 403, headers: { 'Content-Type': 'text/html' } }
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
