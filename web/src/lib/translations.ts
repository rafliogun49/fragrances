import type { Lang } from './personas';

type Translations = {
  // Quiz UI
  exit: string;
  back: string;
  next: string;
  seeMyMatch: string;
  continue: string;
  selectAll: string;
  customNotePlaceholder: string;

  // Quiz questions
  q_vibe: string;
  q_scene: string;
  q_how_people_see: string;
  q_scent_draw: string;
  q_occasion: string;
  q_scent_gender: string;
  q_scent_memory: string;
  q_hidden_self: string;
  q_notes_love: string;
  q_notes_avoid: string;

  // Q1 options
  o_free_spirited: string;
  o_magnetic: string;
  o_dreamy: string;
  o_bold: string;
  o_curious: string;
  o_grounded: string;

  // Q2 options
  o_night_market: string;
  o_candles_music: string;
  o_minimal_apartment: string;
  o_making_something: string;
  o_dancing: string;
  o_slow_morning: string;

  // Q3 options
  o_makes_fun: string;
  o_mysterious: string;
  o_feels_home: string;
  o_deeply_herself: string;
  o_always_interesting: string;
  o_just_goes_for_it: string;

  // Q4 options
  o_unfolds: string;
  o_one_note: string;
  o_clean_real: string;
  o_warm_familiar: string;
  o_unexpected: string;
  o_bright_instant: string;

  // Q5 options (occasion)
  o_daily: string;
  o_work: string;
  o_date: string;
  o_event: string;
  o_always: string;

  // Q6 options
  o_masc: string;
  o_fem: string;
  o_versatile: string;

  // Q7 options
  o_rain: string;
  o_morning_coffee: string;
  o_fresh_jasmine: string;
  o_temple_incense: string;
  o_spice_market: string;
  o_sun_dried_sheets: string;

  // Q8 options
  o_hopeless_romantic: string;
  o_wilder: string;
  o_deeply_tender: string;
  o_darker_complex: string;
  o_softer: string;
  o_more_playful: string;

  // Q9 + Q10 note options
  o_note_floral: string;
  o_note_jasmine: string;
  o_note_citrus: string;
  o_note_fruity: string;
  o_note_marine: string;
  o_note_lavender: string;
  o_note_vanilla: string;
  o_note_musk: string;
  o_note_oud: string;
  o_note_wood: string;
  o_note_spice: string;
  o_note_tobacco: string;

  // Email gate
  matchReady: string;
  matchReadySub: string;
  emailPlaceholder: string;
  consentLabel: string;
  seeResults: string;
  loading: string;
  notComplete: string;
  backToQuiz: string;
  privacyNote: string;

  // Results
  youAre: string;
  yourMatch: string;
  weFoundYourScent: string;
  matchedByAlgorithm: string;
  yourScentProfile: string;
  twoMoreFragrances: string;
  retakeQuiz: string;
  shopAll: string;

  // No results
  noResults: string;
  noResultsSub: string;
  takeTheQuiz: string;
};

export const t: Record<Lang, Translations> = {
  en: {
    exit: '✕ Exit',
    back: '← Back',
    next: 'Next →',
    seeMyMatch: 'See my match →',
    continue: 'Continue →',
    selectAll: 'Select all that apply',
    customNotePlaceholder: 'Other notes — type and press Enter',

    q_vibe: 'Your energy, in one word.',
    q_scene: 'Where do you feel most yourself?',
    q_how_people_see: 'What do people always say about you?',
    q_scent_draw: 'How do you want to feel when you\'re wearing your scent?',
    q_occasion: 'When do you want to smell amazing?',
    q_scent_gender: 'How do you want your scent to come across?',
    q_scent_memory: 'Which scent memory is closest to yours?',
    q_hidden_self: 'One thing nobody really knows about you.',
    q_notes_love: 'Which notes do you always gravitate toward?',
    q_notes_avoid: 'Which notes are a hard no for you?',

    o_free_spirited: 'The one who makes the whole room feel lighter',
    o_magnetic: 'Quietly magnetic — people can\'t explain it',
    o_dreamy: 'Always somewhere else in your head — beautifully',
    o_bold: 'First to say yes. First to arrive.',
    o_curious: 'Always noticing what everyone else misses',
    o_grounded: 'Steady. Present. Certain.',

    o_night_market: 'A crowded market at night, everything alive',
    o_candles_music: 'Candlelit, music low, phone face-down',
    o_minimal_apartment: 'A clean, quiet room — only what\'s needed',
    o_making_something: 'Hands busy, something taking shape',
    o_dancing: 'On the dancefloor, completely lost in it',
    o_slow_morning: 'A long morning, coffee still warm',

    o_makes_fun: 'The fun one — always',
    o_mysterious: 'Hard to read, impossible to ignore',
    o_feels_home: 'Easy to be around',
    o_deeply_herself: 'Feels everything so deeply',
    o_always_interesting: 'Always doing something interesting',
    o_just_goes_for_it: 'Just goes for it, every time',

    o_unfolds: 'Transported — like I\'m somewhere else entirely',
    o_one_note: 'Pulled back to it, again and again',
    o_clean_real: 'Clean and effortless',
    o_warm_familiar: 'Wrapped up in something warm',
    o_unexpected: 'Surprising, even to myself',
    o_bright_instant: 'Bright and lifted',

    o_daily: 'My daily ritual',
    o_work: 'At the office',
    o_date: 'A real date',
    o_event: 'A night out',
    o_always: 'Just for me, always',

    o_masc: 'Masculine',
    o_fem: 'Feminine',
    o_versatile: 'Versatile / Unisex',

    o_rain: 'First rain hitting hot pavement',
    o_morning_coffee: 'Morning coffee, steam still rising',
    o_fresh_jasmine: 'Fresh jasmine, just picked',
    o_temple_incense: 'Temple incense, slow and heavy',
    o_spice_market: 'Night market — smoke, spice, all of it',
    o_sun_dried_sheets: 'Clean sheets dried under the sun',

    o_hopeless_romantic: "I'm secretly a hopeless romantic",
    o_wilder: "I'm wilder than I look",
    o_deeply_tender: "I'm deeply tender with the people I love",
    o_darker_complex: "My taste is darker and more complex than I let on",
    o_softer: "I'm softer than I seem",
    o_more_playful: "I'm way more playful when I feel safe",

    o_note_floral: 'Floral',
    o_note_jasmine: 'Jasmine / White Floral',
    o_note_citrus: 'Citrus',
    o_note_fruity: 'Fruity',
    o_note_marine: 'Marine / Watery',
    o_note_lavender: 'Lavender / Herbs',
    o_note_vanilla: 'Vanilla',
    o_note_musk: 'Musk / Amber',
    o_note_oud: 'Oud / Incense',
    o_note_wood: 'Woody',
    o_note_spice: 'Spice / Pepper',
    o_note_tobacco: 'Tobacco / Leather',

    matchReady: 'Your match is ready.',
    matchReadySub: 'Enter your email to see your results — we\'ll save your personalised recommendation.',
    emailPlaceholder: 'you@example.com',
    consentLabel: 'I agree to receive my personalised HMNS recommendation by email.',
    seeResults: 'See my results →',
    loading: 'Finding your match…',
    notComplete: "Looks like you haven't completed the quiz yet.",
    backToQuiz: 'Take the quiz →',
    privacyNote: 'We respect your privacy. No spam, ever.',

    youAre: 'You are',
    yourMatch: 'Your match',
    weFoundYourScent: 'We found your scent.',
    matchedByAlgorithm: '(Matched using our curated algorithm)',
    yourScentProfile: 'Your scent profile',
    twoMoreFragrances: 'Two more fragrances that match your personality — explore them all.',
    retakeQuiz: 'Retake quiz',
    shopAll: 'Shop all HMNS →',

    noResults: 'No results found',
    noResultsSub: 'Take the quiz to get your personalised fragrance recommendation.',
    takeTheQuiz: 'Take the quiz →',
  },

  id: {
    exit: '✕ Keluar',
    back: '← Kembali',
    next: 'Lanjut →',
    seeMyMatch: 'Lihat parfumku →',
    continue: 'Lanjutkan →',
    selectAll: 'Pilih semua yang sesuai',
    customNotePlaceholder: 'Aroma lain — ketik dan tekan Enter',

    q_vibe: 'Energimu, dalam satu kata.',
    q_scene: 'Di mana kamu paling merasa jadi dirimu sendiri?',
    q_how_people_see: 'Apa yang selalu dikatakan orang tentangmu?',
    q_scent_draw: 'Bagaimana kamu ingin merasa saat memakai wewangianmu?',
    q_occasion: 'Kapan kamu ingin bau harum?',
    q_scent_gender: 'Bagaimana kamu ingin aromamu terasa pada orang lain?',
    q_scent_memory: 'Ingatan aroma mana yang paling dekat denganmu?',
    q_hidden_self: 'Satu hal yang tidak banyak orang tahu tentangmu.',
    q_notes_love: 'Aroma apa yang selalu membuatmu tertarik?',
    q_notes_avoid: 'Aroma apa yang jelas bukan untukmu?',

    o_free_spirited: 'Yang bikin suasana jadi lebih ringan',
    o_magnetic: 'Diam-diam memikat — orang tak tahu kenapa',
    o_dreamy: 'Selalu ada di dunianya sendiri — dengan indah',
    o_bold: 'Yang pertama bilang iya. Yang pertama datang.',
    o_curious: 'Selalu memperhatikan yang orang lain lewatkan',
    o_grounded: 'Tenang. Hadir. Yakin.',

    o_night_market: 'Pasar malam yang ramai, semuanya hidup',
    o_candles_music: 'Cahaya lilin, musik pelan, hp dibalik',
    o_minimal_apartment: 'Ruangan bersih dan tenang — hanya yang perlu',
    o_making_something: 'Tangan sibuk, sesuatu sedang terbentuk',
    o_dancing: 'Di dancefloor, sepenuhnya larut',
    o_slow_morning: 'Pagi yang panjang, kopi masih hangat',

    o_makes_fun: 'Selalu bikin suasana menyenangkan',
    o_mysterious: 'Susah ditebak, tidak bisa diabaikan',
    o_feels_home: 'Mudah diajak bersama',
    o_deeply_herself: 'Merasakan segalanya begitu dalam',
    o_always_interesting: 'Selalu ada hal menarik darinya',
    o_just_goes_for_it: 'Langsung saja, setiap saat',

    o_unfolds: 'Terbawa ke tempat lain — sepenuhnya',
    o_one_note: 'Selalu ingin kembali lagi',
    o_clean_real: 'Bersih dan effortless',
    o_warm_familiar: 'Terbungkus sesuatu yang hangat',
    o_unexpected: 'Mengejutkan, bahkan untuk diri sendiri',
    o_bright_instant: 'Cerah dan bersemangat',

    o_daily: 'Rutinitas harianku',
    o_work: 'Di kantor',
    o_date: 'Kencan sungguhan',
    o_event: 'Malam keluar',
    o_always: 'Hanya untukku, setiap saat',

    o_masc: 'Maskulin',
    o_fem: 'Feminin',
    o_versatile: 'Versatile / Unisex',

    o_rain: 'Hujan pertama menghantam aspal yang hangat',
    o_morning_coffee: 'Kopi pagi, asapnya masih mengepul',
    o_fresh_jasmine: 'Melati segar, baru dipetik',
    o_temple_incense: 'Dupa di tempat ibadah, pelan dan berat',
    o_spice_market: 'Pasar malam — asap, rempah, segalanya',
    o_sun_dried_sheets: 'Sprei bersih dijemur di bawah matahari',

    o_hopeless_romantic: 'Diam-diam aku seorang romantis sejati',
    o_wilder: 'Aku lebih liar dari yang terlihat',
    o_deeply_tender: 'Aku sangat lembut dengan orang-orang yang kucintai',
    o_darker_complex: 'Seleraku lebih gelap dan kompleks dari yang kutampilkan',
    o_softer: 'Aku lebih lembut dari yang tampak',
    o_more_playful: 'Aku jauh lebih playful ketika merasa aman',

    o_note_floral: 'Floral',
    o_note_jasmine: 'Jasmine / Bunga Putih',
    o_note_citrus: 'Citrus',
    o_note_fruity: 'Buah / Fruity',
    o_note_marine: 'Marine / Watery',
    o_note_lavender: 'Lavender / Herbal',
    o_note_vanilla: 'Vanilla',
    o_note_musk: 'Musk / Amber',
    o_note_oud: 'Oud / Kemenyan',
    o_note_wood: 'Woody / Kayu',
    o_note_spice: 'Rempah / Lada',
    o_note_tobacco: 'Tembakau / Kulit',

    matchReady: 'Parfummu sudah siap.',
    matchReadySub: 'Masukkan emailmu untuk melihat hasilmu — kami akan menyimpan rekomendasimu.',
    emailPlaceholder: 'kamu@contoh.com',
    consentLabel: 'Saya setuju menerima rekomendasi HMNS personal saya lewat email.',
    seeResults: 'Lihat hasilku →',
    loading: 'Menemukan parfummu…',
    notComplete: 'Sepertinya kamu belum menyelesaikan kuisnya.',
    backToQuiz: 'Ikuti kuis →',
    privacyNote: 'Kami menghormati privasimu. Tidak ada spam.',

    youAre: 'Kamu adalah',
    yourMatch: 'Parfummu',
    weFoundYourScent: 'Kami menemukan aroma untukmu.',
    matchedByAlgorithm: '(Dicocokkan menggunakan algoritma kurasi kami)',
    yourScentProfile: 'Profil aromamu',
    twoMoreFragrances: 'Dua wewangian lain yang cocok dengan kepribadianmu — jelajahi semuanya.',
    retakeQuiz: 'Ulangi kuis',
    shopAll: 'Lihat semua HMNS →',

    noResults: 'Hasil tidak ditemukan',
    noResultsSub: 'Ikuti kuis untuk mendapatkan rekomendasi parfum personalmu.',
    takeTheQuiz: 'Ikuti kuis →',
  },
};
