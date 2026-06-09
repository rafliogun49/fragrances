import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from '../types';
import { getActiveProducts, getProductsByIds, createLead } from '../lib/db';
import { callDeepSeek } from '../lib/deepseek';
import { fallbackScore } from '../lib/fallback';

const QuizAnswersSchema = z.object({
  vibe: z.enum(['free_spirited', 'magnetic', 'dreamy', 'bold', 'curious', 'grounded']),
  scene: z.enum(['night_market', 'candles_music', 'minimal_apartment', 'making_something', 'dancing', 'slow_morning']),
  how_people_see: z.enum(['makes_fun', 'mysterious', 'feels_home', 'deeply_herself', 'always_interesting', 'just_goes_for_it']),
  scent_draw: z.enum(['unfolds', 'one_note', 'clean_real', 'warm_familiar', 'unexpected', 'bright_instant']),
  occasion: z.array(z.enum(['daily', 'work', 'date', 'event', 'always'])).min(1),
  room_arrival: z.enum(['invisible', 'present', 'commanding']),
  scent_memory: z.enum(['rain', 'sweet_kitchen', 'flower_market', 'old_paper', 'salt_air', 'warm_wax']),
  hidden_self: z.enum(['hopeless_romantic', 'wilder', 'deeply_tender', 'darker_complex', 'softer', 'more_playful']),
  notes_love: z.array(z.string()).default([]),
  notes_avoid: z.array(z.string()).default([]),
  lang: z.enum(['en', 'id']).optional(),
});

const RecommendBodySchema = z.object({
  email: z.string().email(),
  consent: z.boolean(),
  answers: QuizAnswersSchema,
});

function generateId(): string {
  return crypto.randomUUID();
}

export const recommendRouter = new Hono<{ Bindings: Env }>();

recommendRouter.post(
  '/',
  zValidator('json', RecommendBodySchema),
  async (c) => {
    const body = c.req.valid('json');
    const { email, consent, answers } = body;

    const products = await getActiveProducts(c.env.DB);
    if (products.length === 0) {
      return c.json({ error: 'No products available' }, 503);
    }

    let primaryProduct;
    let alternates;
    let explanation = '';
    let altExplanations: string[] = ['', ''];
    let fallbackUsed = false;

    try {
      const result = await callDeepSeek(c.env.DEEPSEEK_API_KEY, answers, products);
      const allIds = [result.primary_id, ...result.alternate_ids];
      const fetched = await getProductsByIds(c.env.DB, allIds);

      primaryProduct = fetched[0];
      alternates = fetched.slice(1, 3);
      explanation = result.explanation;
      altExplanations = result.alt_explanations as [string, string];

      if (!primaryProduct) throw new Error('Primary product not found in DB');
    } catch (err) {
      console.error('DeepSeek failed, using fallback:', err);
      fallbackUsed = true;
      const top3 = fallbackScore(products, answers);
      primaryProduct = top3[0];
      alternates = top3.slice(1, 3);
      const occasionStr = answers.occasion.join(', ');
      explanation = `Based on your scent instincts and the moments that matter to you (${occasionStr}), ${primaryProduct?.name ?? 'this fragrance'} is your closest match from the HMNS collection.`;
      altExplanations = [
        alternates[0] ? `${alternates[0].name} shares your sensory preferences and ${alternates[0].scent_family} character.` : '',
        alternates[1] ? `${alternates[1].name} suits your lifestyle with its ${alternates[1].intensity ?? 'balanced'} intensity.` : '',
      ];
    }

    if (!primaryProduct) {
      return c.json({ error: 'Could not determine recommendation' }, 500);
    }

    const recommendedIds = [primaryProduct.id, ...(alternates?.map(p => p.id) ?? [])];

    const leadId = generateId();
    await createLead(c.env.DB, {
      id: leadId,
      email,
      consent: consent ? 1 : 0,
      quiz_answers: answers,
      recommended_ids: recommendedIds,
      ai_explanation: explanation,
      fallback_used: fallbackUsed ? 1 : 0,
      user_agent: c.req.header('user-agent') ?? null,
      referrer: c.req.header('referer') ?? null,
    });

    return c.json({
      primary: primaryProduct,
      alternates: alternates ?? [],
      explanation,
      alt_explanations: altExplanations,
      fallback_used: fallbackUsed,
    });
  }
);
