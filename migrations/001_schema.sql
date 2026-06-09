-- HMNS Fragrance Recommender — D1 Schema
-- Run: wrangler d1 execute hmns-db --local --file=migrations/001_schema.sql

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('edp','extrait','mist','hair','set')),
  price_idr INTEGER NOT NULL,
  volume_ml INTEGER,
  scent_family TEXT NOT NULL,
  scent_tags TEXT NOT NULL DEFAULT '[]',
  scent_texture TEXT CHECK(scent_texture IN ('fresh','soft','warm','sharp','deep','sweet')),
  gender TEXT CHECK(gender IN ('masc','fem','unisex')),
  intensity TEXT CHECK(intensity IN ('subtle','balanced','bold')),
  top_notes TEXT NOT NULL DEFAULT '[]',
  heart_notes TEXT NOT NULL DEFAULT '[]',
  base_notes TEXT NOT NULL DEFAULT '[]',
  occasion_tags TEXT NOT NULL DEFAULT '[]',
  character_tags TEXT NOT NULL DEFAULT '[]',
  time_of_day TEXT NOT NULL DEFAULT 'all-day' CHECK(time_of_day IN ('morning','evening','all-day')),
  description TEXT,
  image_url TEXT NOT NULL DEFAULT '',
  product_url TEXT NOT NULL DEFAULT '',
  in_stock INTEGER NOT NULL DEFAULT 1,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 0,
  quiz_answers TEXT NOT NULL DEFAULT '{}',
  recommended_ids TEXT NOT NULL DEFAULT '[]',
  ai_explanation TEXT,
  fallback_used INTEGER NOT NULL DEFAULT 0,
  user_agent TEXT,
  referrer TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
