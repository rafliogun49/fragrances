export type PersonaTag =
  | 'romantic'
  | 'adventurous'
  | 'creative'
  | 'minimalist'
  | 'playful'
  | 'sensualist';

export type Lang = 'en' | 'id';

export type Persona = {
  tag: PersonaTag;
  name: Record<Lang, string>;
  tagline: Record<Lang, string>;
};

export const PERSONAS: Persona[] = [
  {
    tag: 'romantic',
    name: { en: 'The Romantic', id: 'Si Romantis' },
    tagline: {
      en: 'Tender, emotional, always feeling deeply.',
      id: 'Penuh perasaan, hangat, dan selalu hadir sepenuh hati.',
    },
  },
  {
    tag: 'adventurous',
    name: { en: 'The Explorer', id: 'Si Penjelajah' },
    tagline: {
      en: 'Bold, restless, drawn to the unknown.',
      id: 'Berani, tak kenal diam, selalu ingin menjelajah.',
    },
  },
  {
    tag: 'creative',
    name: { en: 'The Visionary', id: 'Si Visioner' },
    tagline: {
      en: 'Expressive, unconventional, sees beauty differently.',
      id: 'Ekspresif, tidak biasa, melihat keindahan dari sudut yang berbeda.',
    },
  },
  {
    tag: 'minimalist',
    name: { en: 'The Essentialist', id: 'Si Esensialis' },
    tagline: {
      en: 'Refined, intentional, less is always more.',
      id: 'Halus, penuh niat, percaya bahwa sedikit selalu lebih.',
    },
  },
  {
    tag: 'playful',
    name: { en: 'The Spark', id: 'Si Nyala' },
    tagline: {
      en: 'Fun, spontaneous, lights up any room.',
      id: 'Menyenangkan, spontan, dan selalu bikin suasana hidup.',
    },
  },
  {
    tag: 'sensualist',
    name: { en: 'The Sensualist', id: 'Si Sensoris' },
    tagline: {
      en: 'Indulgent, magnetic, devoted to pleasure.',
      id: 'Menggoda, memikat, menikmati setiap detail kehidupan.',
    },
  },
];

// Persona weights per answer
const VIBE_WEIGHTS: Record<string, Partial<Record<PersonaTag, number>>> = {
  free_spirited: { playful: 3 },
  magnetic: { sensualist: 3 },
  dreamy: { romantic: 3 },
  bold: { adventurous: 3 },
  curious: { creative: 3 },
  grounded: { minimalist: 3 },
};

const SCENE_WEIGHTS: Record<string, Partial<Record<PersonaTag, number>>> = {
  night_market: { adventurous: 2 },
  candles_music: { romantic: 2 },
  minimal_apartment: { minimalist: 2 },
  making_something: { creative: 2 },
  dancing: { playful: 2 },
  slow_morning: { sensualist: 2 },
};

const HOW_PEOPLE_SEE_WEIGHTS: Record<string, Partial<Record<PersonaTag, number>>> = {
  makes_fun: { playful: 2 },
  mysterious: { sensualist: 2 },
  feels_home: { minimalist: 2 },
  deeply_herself: { romantic: 2 },
  always_interesting: { creative: 2 },
  just_goes_for_it: { adventurous: 2 },
};

const HIDDEN_SELF_WEIGHTS: Record<string, Partial<Record<PersonaTag, number>>> = {
  hopeless_romantic: { romantic: 2 },
  wilder: { adventurous: 2 },
  deeply_tender: { romantic: 1, minimalist: 1 },
  darker_complex: { sensualist: 1, creative: 1 },
  softer: { minimalist: 2 },
  more_playful: { playful: 2 },
};

function addWeights(
  totals: Record<PersonaTag, number>,
  weights: Partial<Record<PersonaTag, number>>
) {
  for (const [tag, w] of Object.entries(weights)) {
    totals[tag as PersonaTag] = (totals[tag as PersonaTag] ?? 0) + (w ?? 0);
  }
}

export function derivePersona(answers: {
  vibe?: string;
  scene?: string;
  how_people_see?: string;
  hidden_self?: string;
}): PersonaTag {
  const totals: Record<PersonaTag, number> = {
    romantic: 0,
    adventurous: 0,
    creative: 0,
    minimalist: 0,
    playful: 0,
    sensualist: 0,
  };

  if (answers.vibe) addWeights(totals, VIBE_WEIGHTS[answers.vibe] ?? {});
  if (answers.scene) addWeights(totals, SCENE_WEIGHTS[answers.scene] ?? {});
  if (answers.how_people_see) addWeights(totals, HOW_PEOPLE_SEE_WEIGHTS[answers.how_people_see] ?? {});
  if (answers.hidden_self) addWeights(totals, HIDDEN_SELF_WEIGHTS[answers.hidden_self] ?? {});

  let best: PersonaTag = 'romantic';
  let bestScore = -1;
  for (const [tag, score] of Object.entries(totals)) {
    if (score > bestScore) {
      bestScore = score;
      best = tag as PersonaTag;
    }
  }
  return best;
}

export function getPersona(tag: PersonaTag): Persona {
  return PERSONAS.find(p => p.tag === tag) ?? PERSONAS[0];
}
