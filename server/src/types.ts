export type QuizAnswers = {
  vibe: 'free_spirited' | 'magnetic' | 'dreamy' | 'bold' | 'curious' | 'grounded';
  scene: 'night_market' | 'candles_music' | 'minimal_apartment' | 'making_something' | 'dancing' | 'slow_morning';
  how_people_see: 'makes_fun' | 'mysterious' | 'feels_home' | 'deeply_herself' | 'always_interesting' | 'just_goes_for_it';
  scent_draw: 'unfolds' | 'one_note' | 'clean_real' | 'warm_familiar' | 'unexpected' | 'bright_instant';
  occasion: Array<'daily' | 'work' | 'date' | 'event' | 'always'>;
  room_arrival: 'invisible' | 'present' | 'commanding';
  scent_memory: 'rain' | 'sweet_kitchen' | 'flower_market' | 'old_paper' | 'salt_air' | 'warm_wax';
  hidden_self: 'hopeless_romantic' | 'wilder' | 'deeply_tender' | 'darker_complex' | 'softer' | 'more_playful';
  notes_love: string[];
  notes_avoid: string[];
  lang?: 'en' | 'id';
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  type: 'edp' | 'extrait' | 'mist' | 'hair' | 'set';
  price_idr: number;
  volume_ml: number | null;
  scent_family: string;
  scent_tags: string[];
  scent_texture: 'fresh' | 'soft' | 'warm' | 'sharp' | 'deep' | 'sweet' | null;
  gender: 'masc' | 'fem' | 'unisex' | null;
  intensity: 'subtle' | 'balanced' | 'bold' | null;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  occasion_tags: string[];
  character_tags: string[];
  time_of_day: 'morning' | 'evening' | 'all-day';
  description: string | null;
  image_url: string;
  product_url: string;
  in_stock: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  email: string;
  consent: number;
  quiz_answers: QuizAnswers;
  recommended_ids: number[];
  ai_explanation: string | null;
  fallback_used: number;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
};

export type RecommendResponse = {
  primary: Product;
  alternates: Product[];
  explanation: string;
  alt_explanations: string[];
  fallback_used: boolean;
};

