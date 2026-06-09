import type { Product, Lead } from '../types';

function parseProduct(row: Record<string, unknown>): Product {
  return {
    ...(row as Omit<Product, 'scent_tags' | 'top_notes' | 'heart_notes' | 'base_notes' | 'occasion_tags' | 'character_tags'>),
    scent_tags: JSON.parse((row.scent_tags as string) || '[]'),
    top_notes: JSON.parse((row.top_notes as string) || '[]'),
    heart_notes: JSON.parse((row.heart_notes as string) || '[]'),
    base_notes: JSON.parse((row.base_notes as string) || '[]'),
    occasion_tags: JSON.parse((row.occasion_tags as string) || '[]'),
    character_tags: JSON.parse((row.character_tags as string) || '[]'),
  } as Product;
}

function parseLead(row: Record<string, unknown>): Lead {
  return {
    ...(row as Omit<Lead, 'quiz_answers' | 'recommended_ids'>),
    quiz_answers: JSON.parse((row.quiz_answers as string) || '{}'),
    recommended_ids: JSON.parse((row.recommended_ids as string) || '[]'),
  } as Lead;
}

export async function getActiveProducts(db: D1Database): Promise<Product[]> {
  const result = await db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY name ASC').all();
  return (result.results as Record<string, unknown>[]).map(parseProduct);
}

export async function getAllProducts(db: D1Database): Promise<Product[]> {
  const result = await db.prepare('SELECT * FROM products ORDER BY name ASC').all();
  return (result.results as Record<string, unknown>[]).map(parseProduct);
}

export async function getProductsByIds(db: D1Database, ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(',');
  const result = await db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`).bind(...ids).all();
  const rows = (result.results as Record<string, unknown>[]).map(parseProduct);
  // Return in requested order
  return ids.map(id => rows.find(p => p.id === id)).filter(Boolean) as Product[];
}

export async function getProductById(db: D1Database, id: number): Promise<Product | null> {
  const row = await db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<Record<string, unknown>>();
  if (!row) return null;
  return parseProduct(row);
}

export async function createProduct(db: D1Database, data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await db.prepare(`
    INSERT INTO products (name, slug, type, price_idr, volume_ml, scent_family, scent_tags,
      scent_texture, gender, intensity, top_notes, heart_notes, base_notes, occasion_tags,
      character_tags, time_of_day, description, image_url, product_url, in_stock, is_active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    data.name, data.slug, data.type, data.price_idr, data.volume_ml,
    data.scent_family, JSON.stringify(data.scent_tags), data.scent_texture,
    data.gender, data.intensity, JSON.stringify(data.top_notes),
    JSON.stringify(data.heart_notes), JSON.stringify(data.base_notes),
    JSON.stringify(data.occasion_tags), JSON.stringify(data.character_tags),
    data.time_of_day, data.description, data.image_url, data.product_url,
    data.in_stock, data.is_active
  ).run();
  return result.meta.last_row_id as number;
}

export async function updateProduct(db: D1Database, id: number, data: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
  if (data.type !== undefined) { fields.push('type = ?'); values.push(data.type); }
  if (data.price_idr !== undefined) { fields.push('price_idr = ?'); values.push(data.price_idr); }
  if (data.volume_ml !== undefined) { fields.push('volume_ml = ?'); values.push(data.volume_ml); }
  if (data.scent_family !== undefined) { fields.push('scent_family = ?'); values.push(data.scent_family); }
  if (data.scent_tags !== undefined) { fields.push('scent_tags = ?'); values.push(JSON.stringify(data.scent_tags)); }
  if (data.scent_texture !== undefined) { fields.push('scent_texture = ?'); values.push(data.scent_texture); }
  if (data.gender !== undefined) { fields.push('gender = ?'); values.push(data.gender); }
  if (data.intensity !== undefined) { fields.push('intensity = ?'); values.push(data.intensity); }
  if (data.top_notes !== undefined) { fields.push('top_notes = ?'); values.push(JSON.stringify(data.top_notes)); }
  if (data.heart_notes !== undefined) { fields.push('heart_notes = ?'); values.push(JSON.stringify(data.heart_notes)); }
  if (data.base_notes !== undefined) { fields.push('base_notes = ?'); values.push(JSON.stringify(data.base_notes)); }
  if (data.occasion_tags !== undefined) { fields.push('occasion_tags = ?'); values.push(JSON.stringify(data.occasion_tags)); }
  if (data.character_tags !== undefined) { fields.push('character_tags = ?'); values.push(JSON.stringify(data.character_tags)); }
  if (data.time_of_day !== undefined) { fields.push('time_of_day = ?'); values.push(data.time_of_day); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.image_url !== undefined) { fields.push('image_url = ?'); values.push(data.image_url); }
  if (data.product_url !== undefined) { fields.push('product_url = ?'); values.push(data.product_url); }
  if (data.in_stock !== undefined) { fields.push('in_stock = ?'); values.push(data.in_stock); }
  if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active); }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
}

export async function deleteProduct(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
}

export async function createLead(db: D1Database, lead: Omit<Lead, 'created_at'>): Promise<void> {
  await db.prepare(`
    INSERT INTO leads (id, email, consent, quiz_answers, recommended_ids, ai_explanation, fallback_used, user_agent, referrer)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).bind(
    lead.id, lead.email, lead.consent ? 1 : 0,
    JSON.stringify(lead.quiz_answers),
    JSON.stringify(lead.recommended_ids),
    lead.ai_explanation,
    lead.fallback_used ? 1 : 0,
    lead.user_agent,
    lead.referrer
  ).run();
}

export async function getLeads(
  db: D1Database,
  page: number = 1,
  pageSize: number = 50
): Promise<{ leads: Lead[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const [results, countResult] = await Promise.all([
    db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(pageSize, offset).all(),
    db.prepare('SELECT COUNT(*) as count FROM leads').first<{ count: number }>(),
  ]);
  return {
    leads: (results.results as Record<string, unknown>[]).map(parseLead),
    total: countResult?.count ?? 0,
  };
}

export async function getAllLeads(db: D1Database): Promise<Lead[]> {
  const result = await db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  return (result.results as Record<string, unknown>[]).map(parseLead);
}

export async function getAdminUser(db: D1Database, username: string): Promise<{ id: number; username: string; password_hash: string } | null> {
  return db.prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?').bind(username).first();
}
