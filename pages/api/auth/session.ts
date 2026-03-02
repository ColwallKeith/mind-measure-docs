import type { NextApiRequest, NextApiResponse } from 'next';

const SESSION_COOKIE = 'mm_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    res.setHeader('Set-Cookie', [
      `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
    ]);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', [
      `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    ]);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
