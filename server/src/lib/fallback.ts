import type { Product, QuizAnswers } from '../types';

// Maps scent_draw answer → scent_texture
const SCENT_DRAW_TO_TEXTURE: Record<string, string> = {
  unfolds: 'deep',
  one_note: 'warm',
  clean_real: 'fresh',
  warm_familiar: 'soft',
  unexpected: 'sharp',
  bright_instant: 'sweet',
};

// Maps scent_gender answer → product.gender
const SCENT_GENDER_TO_PRODUCT_GENDER: Record<string, string> = {
  masc: 'masc',
  fem: 'fem',
  versatile: 'unisex',
};

// Maps scent_memory → scent family keywords
const SCENT_MEMORY_BOOSTS: Record<string, string[]> = {
  rain: ['green', 'fresh', 'aquatic'],
  sweet_kitchen: ['vanilla', 'sweet', 'gourmand'],
  flower_market: ['floral', 'rose', 'jasmine'],
  old_paper: ['woody', 'leather', 'musk'],
  salt_air: ['aquatic', 'marine', 'fresh'],
  warm_wax: ['amber', 'warm', 'vanilla'],
};

// Persona derived from vibe + scene + how_people_see + hidden_self
const VIBE_TO_PERSONA: Record<string, string> = {
  free_spirited: 'playful',
  magnetic: 'sensualist',
  dreamy: 'romantic',
  bold: 'adventurous',
  curious: 'creative',
  grounded: 'minimalist',
};

const SCENE_TO_PERSONA: Record<string, string> = {
  night_market: 'adventurous',
  candles_music: 'romantic',
  minimal_apartment: 'minimalist',
  making_something: 'creative',
  dancing: 'playful',
  slow_morning: 'sensualist',
};

const HOW_PEOPLE_SEE_TO_PERSONA: Record<string, string> = {
  makes_fun: 'playful',
  mysterious: 'sensualist',
  feels_home: 'minimalist',
  deeply_herself: 'romantic',
  always_interesting: 'creative',
  just_goes_for_it: 'adventurous',
};

const HIDDEN_SELF_TO_PERSONAS: Record<string, string[]> = {
  hopeless_romantic: ['romantic'],
  wilder: ['adventurous'],
  deeply_tender: ['romantic', 'minimalist'],
  darker_complex: ['sensualist', 'creative'],
  softer: ['minimalist'],
  more_playful: ['playful'],
};

function derivePersona(answers: QuizAnswers): string {
  const totals: Record<string, number> = {};
  function add(tag: string, w: number) {
    totals[tag] = (totals[tag] ?? 0) + w;
  }

  if (answers.vibe) add(VIBE_TO_PERSONA[answers.vibe] ?? '', 3);
  if (answers.scene) add(SCENE_TO_PERSONA[answers.scene] ?? '', 2);
  if (answers.how_people_see) add(HOW_PEOPLE_SEE_TO_PERSONA[answers.how_people_see] ?? '', 2);
  for (const p of HIDDEN_SELF_TO_PERSONAS[answers.hidden_self] ?? []) add(p, 1);

  let best = '';
  let bestScore = -1;
  for (const [tag, score] of Object.entries(totals)) {
    if (tag && score > bestScore) {
      bestScore = score;
      best = tag;
    }
  }
  return best;
}

function scoreProduct(product: Product, answers: QuizAnswers): number {
  let score = 0;

  // Texture match: +3
  const texture = SCENT_DRAW_TO_TEXTURE[answers.scent_draw];
  if (product.scent_texture && product.scent_texture === texture) {
    score += 3;
  }

  // Gender match: +3 exact, +1 for unisex products regardless of preference
  const preferredGender = SCENT_GENDER_TO_PRODUCT_GENDER[answers.scent_gender];
  if (product.gender) {
    if (product.gender === preferredGender) score += 3;
    else if (product.gender === 'unisex') score += 1;
  }

  // Occasion match: +2 per matching occasion, capped at +4
  const occasionMatches = answers.occasion.filter(occ =>
    occ === 'always' || product.occasion_tags.includes(occ)
  ).length;
  if (answers.occasion.includes('always')) {
    score += Math.min(occasionMatches * 2, 3);
  } else {
    score += Math.min(occasionMatches * 2, 4);
  }

  // Persona-based character tag match: +3
  const persona = derivePersona(answers);
  const charTags = product.character_tags.map(t => t.toLowerCase());
  if (persona && charTags.includes(persona)) {
    score += 3;
  }
  // Secondary persona from hidden_self: +1
  for (const p of HIDDEN_SELF_TO_PERSONAS[answers.hidden_self] ?? []) {
    if (charTags.includes(p)) score += 1;
  }

  // Scent memory bonus: +1
  const memoryWords = SCENT_MEMORY_BOOSTS[answers.scent_memory] ?? [];
  const productWords = [
    product.scent_family.toLowerCase(),
    ...product.scent_tags.map(t => t.toLowerCase()),
  ];
  if (memoryWords.some(w => productWords.some(pw => pw.includes(w)))) {
    score += 1;
  }

  // Notes loved: +2 per match
  const allNotes = [
    ...product.top_notes,
    ...product.heart_notes,
    ...product.base_notes,
  ].map(n => n.toLowerCase());
  for (const note of answers.notes_love ?? []) {
    if (allNotes.some(n => n.includes(note.toLowerCase()))) score += 2;
  }

  // Notes avoided: -3 per match (strong negative)
  for (const note of answers.notes_avoid ?? []) {
    if (allNotes.some(n => n.includes(note.toLowerCase()))) score -= 3;
  }

  return score;
}

export function fallbackScore(products: Product[], answers: QuizAnswers): Product[] {
  const scored = products
    .filter(p => p.is_active === 1)
    .map(p => ({ product: p, score: scoreProduct(p, answers) }))
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  return scored.slice(0, 3).map(s => s.product);
}
