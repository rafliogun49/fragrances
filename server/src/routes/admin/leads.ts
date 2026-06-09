import { Hono } from 'hono';
import type { Env } from '../../env';
import { getLeads, getAllLeads } from '../../lib/db';
import { requireAuth } from '../../lib/auth';

export const adminLeadsRouter = new Hono<{ Bindings: Env }>();

// Auth middleware
adminLeadsRouter.use('/*', async (c, next) => {
  const user = await requireAuth(c.req.header('cookie'), c.env.SESSION_SECRET);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  await next();
});

adminLeadsRouter.get('/', async (c) => {
  const pageStr = c.req.query('page') ?? '1';
  const pageSizeStr = c.req.query('pageSize') ?? '50';
  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(pageSizeStr, 10) || 50));

  const { leads, total } = await getLeads(c.env.DB, page, pageSize);
  return c.json({
    leads,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
});

adminLeadsRouter.get('/export.csv', async (c) => {
  const leads = await getAllLeads(c.env.DB);

  const headers = ['id', 'email', 'consent', 'created_at', 'fallback_used', 'recommended_ids', 'ai_explanation',
    'vibe', 'scene', 'how_people_see', 'scent_draw', 'occasion',
    'room_arrival', 'scent_memory', 'hidden_self'];

  const rows = leads.map(lead => {
    const a = lead.quiz_answers;
    return [
      lead.id,
      lead.email,
      lead.consent,
      lead.created_at,
      lead.fallback_used,
      JSON.stringify(lead.recommended_ids),
      (lead.ai_explanation ?? '').replace(/"/g, '""'),
      a?.vibe ?? '',
      a?.scene ?? '',
      a?.how_people_see ?? '',
      a?.scent_draw ?? '',
      Array.isArray(a?.occasion) ? a.occasion.join(';') : (a?.occasion ?? ''),
      a?.room_arrival ?? '',
      a?.scent_memory ?? '',
      a?.hidden_self ?? '',
    ].map(v => `"${v}"`).join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="hmns-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});
