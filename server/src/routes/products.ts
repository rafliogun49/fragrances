import { Hono } from 'hono';
import type { Env } from '../env';
import { getActiveProducts } from '../lib/db';

export const productsRouter = new Hono<{ Bindings: Env }>();

productsRouter.get('/', async (c) => {
  const products = await getActiveProducts(c.env.DB);
  return c.json(products);
});
