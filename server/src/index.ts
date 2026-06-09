import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './env';
import { recommendRouter } from './routes/recommend';
import { productsRouter } from './routes/products';
import { adminAuthRouter } from './routes/admin/auth';
import { adminLeadsRouter } from './routes/admin/leads';
import { adminProductsRouter } from './routes/admin/products';

const app = new Hono<{ Bindings: Env }>();

// CORS for local development
app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));

// API routes
app.route('/api/recommend', recommendRouter);
app.route('/api/products', productsRouter);
app.route('/api/admin', adminAuthRouter);
app.route('/api/admin/leads', adminLeadsRouter);
app.route('/api/admin/products', adminProductsRouter);

// Health check
app.get('/api/health', (c) => c.json({ ok: true, ts: new Date().toISOString() }));

// Serve SPA for all other routes (Cloudflare Workers Assets)
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
