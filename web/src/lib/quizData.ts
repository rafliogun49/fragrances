export type QuizQuestion = {
  key: string;
  questionKey: string;
  options: { value: string; labelKey: string }[];
  multiSelect?: boolean;
  allowCustom?: boolean;
  twoCol?: boolean;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    key: 'vibe',
    questionKey: 'q_vibe',
    options: [
      { value: 'free_spirited', labelKey: 'o_free_spirited' },
      { value: 'magnetic', labelKey: 'o_magnetic' },
      { value: 'dreamy', labelKey: 'o_dreamy' },
      { value: 'bold', labelKey: 'o_bold' },
      { value: 'curious', labelKey: 'o_curious' },
      { value: 'grounded', labelKey: 'o_grounded' },
    ],
  },
  {
    key: 'scene',
    questionKey: 'q_scene',
    options: [
      { value: 'night_market', labelKey: 'o_night_market' },
      { value: 'candles_music', labelKey: 'o_candles_music' },
      { value: 'minimal_apartment', labelKey: 'o_minimal_apartment' },
      { value: 'making_something', labelKey: 'o_making_something' },
      { value: 'dancing', labelKey: 'o_dancing' },
      { value: 'slow_morning', labelKey: 'o_slow_morning' },
    ],
  },
  {
    key: 'how_people_see',
    questionKey: 'q_how_people_see',
    options: [
      { value: 'makes_fun', labelKey: 'o_makes_fun' },
      { value: 'mysterious', labelKey: 'o_mysterious' },
      { value: 'feels_home', labelKey: 'o_feels_home' },
      { value: 'deeply_herself', labelKey: 'o_deeply_herself' },
      { value: 'always_interesting', labelKey: 'o_always_interesting' },
      { value: 'just_goes_for_it', labelKey: 'o_just_goes_for_it' },
    ],
  },
  {
    key: 'scent_draw',
    questionKey: 'q_scent_draw',
    options: [
      { value: 'unfolds', labelKey: 'o_unfolds' },
      { value: 'one_note', labelKey: 'o_one_note' },
      { value: 'clean_real', labelKey: 'o_clean_real' },
      { value: 'warm_familiar', labelKey: 'o_warm_familiar' },
      { value: 'unexpected', labelKey: 'o_unexpected' },
      { value: 'bright_instant', labelKey: 'o_bright_instant' },
    ],
  },
  {
    key: 'occasion',
    questionKey: 'q_occasion',
    multiSelect: true,
    options: [
      { value: 'daily', labelKey: 'o_daily' },
      { value: 'work', labelKey: 'o_work' },
      { value: 'date', labelKey: 'o_date' },
      { value: 'event', labelKey: 'o_event' },
      { value: 'always', labelKey: 'o_always' },
    ],
  },
  {
    key: 'scent_gender',
    questionKey: 'q_scent_gender',
    options: [
      { value: 'masc', labelKey: 'o_masc' },
      { value: 'fem', labelKey: 'o_fem' },
      { value: 'versatile', labelKey: 'o_versatile' },
    ],
  },
  {
    key: 'scent_memory',
    questionKey: 'q_scent_memory',
    options: [
      { value: 'rain', labelKey: 'o_rain' },
      { value: 'morning_coffee', labelKey: 'o_morning_coffee' },
      { value: 'fresh_jasmine', labelKey: 'o_fresh_jasmine' },
      { value: 'temple_incense', labelKey: 'o_temple_incense' },
      { value: 'spice_market', labelKey: 'o_spice_market' },
      { value: 'sun_dried_sheets', labelKey: 'o_sun_dried_sheets' },
    ],
  },
  {
    key: 'hidden_self',
    questionKey: 'q_hidden_self',
    options: [
      { value: 'hopeless_romantic', labelKey: 'o_hopeless_romantic' },
      { value: 'wilder', labelKey: 'o_wilder' },
      { value: 'deeply_tender', labelKey: 'o_deeply_tender' },
      { value: 'darker_complex', labelKey: 'o_darker_complex' },
      { value: 'softer', labelKey: 'o_softer' },
      { value: 'more_playful', labelKey: 'o_more_playful' },
    ],
  },
  {
    key: 'notes_love',
    questionKey: 'q_notes_love',
    multiSelect: true,
    allowCustom: true,
    twoCol: true,
    options: [
      { value: 'floral', labelKey: 'o_note_floral' },
      { value: 'vanilla', labelKey: 'o_note_vanilla' },
      { value: 'jasmine', labelKey: 'o_note_jasmine' },
      { value: 'musk', labelKey: 'o_note_musk' },
      { value: 'citrus', labelKey: 'o_note_citrus' },
      { value: 'oud', labelKey: 'o_note_oud' },
      { value: 'fruity', labelKey: 'o_note_fruity' },
      { value: 'wood', labelKey: 'o_note_wood' },
      { value: 'marine', labelKey: 'o_note_marine' },
      { value: 'spice', labelKey: 'o_note_spice' },
      { value: 'lavender', labelKey: 'o_note_lavender' },
      { value: 'tobacco', labelKey: 'o_note_tobacco' },
    ],
  },
  {
    key: 'notes_avoid',
    questionKey: 'q_notes_avoid',
    multiSelect: true,
    allowCustom: true,
    twoCol: true,
    options: [
      { value: 'floral', labelKey: 'o_note_floral' },
      { value: 'vanilla', labelKey: 'o_note_vanilla' },
      { value: 'jasmine', labelKey: 'o_note_jasmine' },
      { value: 'musk', labelKey: 'o_note_musk' },
      { value: 'citrus', labelKey: 'o_note_citrus' },
      { value: 'oud', labelKey: 'o_note_oud' },
      { value: 'fruity', labelKey: 'o_note_fruity' },
      { value: 'wood', labelKey: 'o_note_wood' },
      { value: 'marine', labelKey: 'o_note_marine' },
      { value: 'spice', labelKey: 'o_note_spice' },
      { value: 'lavender', labelKey: 'o_note_lavender' },
      { value: 'tobacco', labelKey: 'o_note_tobacco' },
    ],
  },
];
