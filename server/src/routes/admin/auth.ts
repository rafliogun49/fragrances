import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../../env';
import { getAdminUser } from '../../lib/db';
import { verifyPassword, signSession, makeSessionCookie, clearSessionCookie } from '../../lib/auth';

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const adminAuthRouter = new Hono<{ Bindings: Env }>();

adminAuthRouter.post('/login', zValidator('json', LoginSchema), async (c) => {
  const { username, password } = c.req.valid('json');

  const user = await getAdminUser(c.env.DB, username);
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const payload = JSON.stringify({ sub: user.id, username: user.username, iat: Date.now() });
  const token = await signSession(payload, c.env.SESSION_SECRET);
  const cookie = makeSessionCookie(token);

  c.header('Set-Cookie', cookie);
  return c.json({ ok: true, username: user.username });
});

adminAuthRouter.post('/logout', (c) => {
  c.header('Set-Cookie', clearSessionCookie());
  return c.json({ ok: true });
});
