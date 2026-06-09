import type { Product, QuizAnswers } from '../types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'xiaomi/mimo-v2-flash';
const TIMEOUT_MS = 8000;

const VIBE_LABELS: Record<string, string> = {
  free_spirited: 'Free-spirited',
  magnetic: 'Magnetic',
  dreamy: 'Dreamy',
  bold: 'Bold',
  curious: 'Curious',
  grounded: 'Grounded',
};

const SCENE_LABELS: Record<string, string> = {
  night_market: 'Wandering a night market, trying everything',
  candles_music: 'Curled up with candles and soft music',
  minimal_apartment: 'A minimal, intentional apartment',
  making_something: 'Making something: art, food, a playlist',
  dancing: 'Out dancing until forgetting the time',
  slow_morning: 'A slow morning, coffee, nowhere to be',
};

const HOW_PEOPLE_SEE_LABELS: Record<string, string> = {
  makes_fun: 'Makes everything feel fun',
  mysterious: "Can't quite be put into words",
  feels_home: 'Feels like home',
  deeply_herself: 'Deeply, completely herself',
  always_interesting: 'Always doing something interesting',
  just_goes_for_it: 'Just goes for it',
};

const SCENT_DRAW_LABELS: Record<string, string> = {
  unfolds: 'Something that unfolds — different every hour',
  one_note: 'That one note you can\'t stop smelling',
  clean_real: 'Clean and real, nothing artificial',
  warm_familiar: 'Warm and familiar, like a memory',
  unexpected: 'Something unexpected, almost wrong',
  bright_instant: 'Bright and instant — a mood in one spray',
};

const SCENT_GENDER_LABELS: Record<string, string> = {
  masc: 'Masculine',
  fem: 'Feminine',
  versatile: 'Versatile / Unisex',
};

const SCENT_MEMORY_LABELS: Record<string, string> = {
  rain: 'Rain hitting warm pavement',
  sweet_kitchen: "Someone's kitchen, sweet and warm",
  flower_market: 'A flower market at 7am',
  old_paper: 'Old paper, ink, a quiet room',
  salt_air: 'Salt air and open sky',
  warm_wax: 'Warm wax, low light, a good book',
};

const HIDDEN_SELF_LABELS: Record<string, string> = {
  hopeless_romantic: 'Secretly a hopeless romantic',
  wilder: 'Wilder than they look',
  deeply_tender: 'Deeply tender with loved ones',
  darker_complex: 'Taste that is darker and more complex',
  softer: 'Softer than they seem',
  more_playful: 'Way more playful when feeling safe',
};

const VIBE_TO_PERSONA: Record<string, string> = {
  free_spirited: 'The Spark',
  magnetic: 'The Sensualist',
  dreamy: 'The Romantic',
  bold: 'The Explorer',
  curious: 'The Visionary',
  grounded: 'The Essentialist',
};

function derivePersonaName(answers: QuizAnswers): string {
  return VIBE_TO_PERSONA[answers.vibe] ?? 'The Romantic';
}

function humanizeAnswers(answers: QuizAnswers): string {
  const persona = derivePersonaName(answers);
  const lang = answers.lang ?? 'id';
  const occasionStr = answers.occasion.join(', ');
  return [
    `Persona: ${persona}`,
    `Energy/vibe: ${VIBE_LABELS[answers.vibe] ?? answers.vibe}`,
    `Scene that feels like them: ${SCENE_LABELS[answers.scene] ?? answers.scene}`,
    `How people experience them: ${HOW_PEOPLE_SEE_LABELS[answers.how_people_see] ?? answers.how_people_see}`,
    `Drawn to in a scent: ${SCENT_DRAW_LABELS[answers.scent_draw] ?? answers.scent_draw}`,
    `When they want to smell amazing: ${occasionStr}`,
    `Scent direction preference: ${SCENT_GENDER_LABELS[answers.scent_gender] ?? answers.scent_gender}`,
    `Scent memory: ${SCENT_MEMORY_LABELS[answers.scent_memory] ?? answers.scent_memory}`,
    `Hidden self: ${HIDDEN_SELF_LABELS[answers.hidden_self] ?? answers.hidden_self}`,
    answers.notes_love?.length
      ? `Notes they love: ${answers.notes_love.join(', ')}`
      : null,
    answers.notes_avoid?.length
      ? `*** HARD RULE — NEVER recommend any product containing these notes: ${answers.notes_avoid.join(', ')} ***`
      : null,
    `Response language: ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}`,
  ].filter(Boolean).join('\n');
}

function buildCatalogSummary(products: Product[]): string {
  return products
    .filter(p => p.is_active === 1)
    .map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      scent_family: p.scent_family,
      gender: p.gender,
      texture: p.scent_texture,
      intensity: p.intensity,
      top: p.top_notes,
      heart: p.heart_notes,
      base: p.base_notes,
      tags: p.character_tags,
      occasions: p.occasion_tags,
    }))
    .map(p => JSON.stringify(p))
    .join('\n');
}

type DeepSeekResult = {
  primary_id: number;
  alternate_ids: [number, number];
  explanation: string;
  alt_explanations: [string, string];
};

export async function callDeepSeek(
  apiKey: string,
  answers: QuizAnswers,
  products: Product[]
): Promise<DeepSeekResult> {
  const catalog = buildCatalogSummary(products);
  const userAnswers = humanizeAnswers(answers);
  const lang = answers.lang ?? 'id';
  const langInstruction = lang === 'id'
    ? 'Write all explanation text in Bahasa Indonesia.'
    : 'Write all explanation text in English.';

  const systemPrompt = `You are HMNS fragrance matchmaker. Given a customer's personality profile and our fragrance catalog, recommend the perfect scent that matches who they are.

CATALOG (one product per line, JSON):
${catalog}

Rules:
- Return ONLY valid JSON matching the schema below. No markdown, no prose outside JSON.
- primary_id: the single best matching product id
- alternate_ids: array of exactly 2 other good match product ids
- explanation: 2–3 sentences written directly to the customer (use "you"), referencing their persona and why this fragrance fits who they are
- alt_explanations: array of exactly 2 explanations (2 sentences each) for the alternates — reference the customer's specific personality traits, scent preferences, or occasions from their profile, and explain why this fragrance fits them personally
- ${langInstruction}
- If the customer profile lists notes to avoid, you MUST NOT include any product that contains those notes in primary_id or alternate_ids. This is a strict rule — violating it is a critical error.

Response schema:
{"primary_id": number, "alternate_ids": [number, number], "explanation": "string", "alt_explanations": ["string", "string"]}`;

  const userMessage = `Customer profile:\n${userAnswers}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 512,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.status}`);
    }

    const data = await res.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty OpenRouter response');

    const parsed = JSON.parse(content) as DeepSeekResult;
    if (
      typeof parsed.primary_id !== 'number' ||
      !Array.isArray(parsed.alternate_ids) ||
      parsed.alternate_ids.length < 2
    ) {
      throw new Error('Invalid DeepSeek response structure');
    }

    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}
