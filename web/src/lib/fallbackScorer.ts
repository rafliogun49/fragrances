import type { Product, QuizAnswers } from './api';

const SCENT_DRAW_TO_TEXTURE: Record<string, string> = {
  unfolds: 'deep',
  one_note: 'warm',
  clean_real: 'fresh',
  warm_familiar: 'soft',
  unexpected: 'sharp',
  bright_instant: 'sweet',
};

const SCENT_GENDER_TO_PRODUCT_GENDER: Record<string, string> = {
  masc: 'masc',
  fem: 'fem',
  versatile: 'unisex',
};

const SCENT_MEMORY_BOOSTS: Record<string, string[]> = {
  rain: ['green', 'fresh', 'aquatic'],
  sweet_kitchen: ['vanilla', 'sweet', 'gourmand'],
  flower_market: ['floral', 'rose', 'jasmine'],
  old_paper: ['woody', 'leather', 'musk'],
  salt_air: ['aquatic', 'marine', 'fresh'],
  warm_wax: ['amber', 'warm', 'vanilla'],
};

const VIBE_TO_PERSONA: Record<string, string> = {
  free_spirited: 'playful',
  magnetic: 'sensualist',
  dreamy: 'romantic',
  bold: 'adventurous',
  curious: 'creative',
  grounded: 'minimalist',
};

const HIDDEN_SELF_TO_PERSONAS: Record<string, string[]> = {
  hopeless_romantic: ['romantic'],
  wilder: ['adventurous'],
  deeply_tender: ['romantic', 'minimalist'],
  darker_complex: ['sensualist', 'creative'],
  softer: ['minimalist'],
  more_playful: ['playful'],
};

export function clientFallbackScore(products: Product[], answers: QuizAnswers): Product[] {
  const persona = VIBE_TO_PERSONA[answers.vibe] ?? '';

  const scored = products
    .filter(p => p.is_active === 1)
    .map(p => {
      let score = 0;
      const charTags = p.character_tags.map(t => t.toLowerCase());

      const texture = SCENT_DRAW_TO_TEXTURE[answers.scent_draw];
      if (p.scent_texture === texture) score += 3;

      const preferredGender = SCENT_GENDER_TO_PRODUCT_GENDER[answers.scent_gender];
      if (p.gender) {
        if (p.gender === preferredGender) score += 3;
        else if (p.gender === 'unisex') score += 1;
      }

      const occasionMatches = answers.occasion.filter(
        occ => occ === 'always' || p.occasion_tags.includes(occ)
      ).length;
      score += Math.min(occasionMatches * 2, 4);

      if (persona && charTags.includes(persona)) score += 3;
      for (const ps of HIDDEN_SELF_TO_PERSONAS[answers.hidden_self] ?? []) {
        if (charTags.includes(ps)) score += 1;
      }

      const memoryWords = SCENT_MEMORY_BOOSTS[answers.scent_memory] ?? [];
      const productWords = [
        p.scent_family.toLowerCase(),
        ...p.scent_tags.map(t => t.toLowerCase()),
      ];
      if (memoryWords.some(w => productWords.some(pw => pw.includes(w)))) score += 1;

      const allNotes = [...p.top_notes, ...p.heart_notes, ...p.base_notes].map(n => n.toLowerCase());
      for (const note of answers.notes_love ?? []) {
        if (allNotes.some(n => n.includes(note.toLowerCase()))) score += 2;
      }
      for (const note of answers.notes_avoid ?? []) {
        if (allNotes.some(n => n.includes(note.toLowerCase()))) score -= 3;
      }

      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  return scored.slice(0, 3).map(s => s.product);
}
