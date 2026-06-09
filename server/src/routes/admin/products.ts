import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../../types';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../../lib/db';
import { requireAuth } from '../../lib/auth';

const ProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(['edp', 'extrait', 'mist', 'hair', 'set']),
  price_idr: z.number().int().positive(),
  volume_ml: z.number().int().positive().nullable().optional(),
  scent_family: z.string().min(1),
  scent_tags: z.array(z.string()).default([]),
  scent_texture: z.enum(['fresh', 'soft', 'warm', 'sharp', 'deep', 'sweet']).nullable().optional(),
  gender: z.enum(['masc', 'fem', 'unisex']).nullable().optional(),
  intensity: z.enum(['subtle', 'balanced', 'bold']).nullable().optional(),
  top_notes: z.array(z.string()).default([]),
  heart_notes: z.array(z.string()).default([]),
  base_notes: z.array(z.string()).default([]),
  occasion_tags: z.array(z.string()).default([]),
  character_tags: z.array(z.string()).default([]),
  time_of_day: z.enum(['morning', 'evening', 'all-day']).default('all-day'),
  description: z.string().nullable().optional(),
  image_url: z.string().default(''),
  product_url: z.string().default(''),
  in_stock: z.number().int().min(0).max(1).default(1),
  is_active: z.number().int().min(0).max(1).default(1),
});

export const adminProductsRouter = new Hono<{ Bindings: Env }>();

// Auth middleware
adminProductsRouter.use('/*', async (c, next) => {
  const user = await requireAuth(c.req.header('cookie'), c.env.SESSION_SECRET);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  await next();
});

adminProductsRouter.get('/', async (c) => {
  const products = await getAllProducts(c.env.DB);
  return c.json(products);
});

adminProductsRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
  const product = await getProductById(c.env.DB, id);
  if (!product) return c.json({ error: 'Not found' }, 404);
  return c.json(product);
});

adminProductsRouter.post('/', zValidator('json', ProductSchema), async (c) => {
  const data = c.req.valid('json');
  const id = await createProduct(c.env.DB, {
    ...data,
    volume_ml: data.volume_ml ?? null,
    scent_texture: data.scent_texture ?? null,
    gender: data.gender ?? null,
    intensity: data.intensity ?? null,
    description: data.description ?? null,
  });
  const product = await getProductById(c.env.DB, id);
  return c.json(product, 201);
});

adminProductsRouter.put('/:id', zValidator('json', ProductSchema.partial()), async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
  const existing = await getProductById(c.env.DB, id);
  if (!existing) return c.json({ error: 'Not found' }, 404);

  const data = c.req.valid('json');
  await updateProduct(c.env.DB, id, data as Parameters<typeof updateProduct>[2]);
  const updated = await getProductById(c.env.DB, id);
  return c.json(updated);
});

adminProductsRouter.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);
  const existing = await getProductById(c.env.DB, id);
  if (!existing) return c.json({ error: 'Not found' }, 404);
  await deleteProduct(c.env.DB, id);
  return c.json({ ok: true });
});
