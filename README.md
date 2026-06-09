# HMNS Fragrance Finder

An AI-powered perfume recommender for [HMNS](https://madeforhmns.com). Visitors take a short personality quiz, leave their email, and receive a personalized fragrance match — primary pick + two alternates — with a written explanation of why it suits them.

Built on Cloudflare Workers + D1, deployed via GitHub.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript |
| Routing / Data | TanStack Router + Query + Table |
| Styling | Tailwind CSS + CSS variables |
| Backend | Hono on Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| AI | DeepSeek Chat API (OpenAI-compatible) |

---

## Project Structure

```
├── web/              # React frontend (Vite)
│   └── src/
│       ├── routes/   # TanStack Router pages
│       ├── components/
│       └── lib/
├── server/           # Hono Worker (API)
│   └── src/
│       ├── routes/
│       └── lib/
├── migrations/       # D1 schema + seed SQL
├── wrangler.toml     # Cloudflare Worker config
└── package.json      # Root scripts
```

---

## Local Development

### Prerequisites

- Node.js 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm i -g wrangler`)
- A [DeepSeek API key](https://platform.deepseek.com/)

### Setup

```bash
# Install dependencies
npm install
cd web && npm install && cd ..

# Create local secrets file
cp .dev.vars.example .dev.vars
# Fill in DEEPSEEK_API_KEY and SESSION_SECRET in .dev.vars

# Seed local D1 database
npm run db:migrate:local

# Start dev server (Vite + Wrangler in parallel)
npm run dev
```

App runs at `http://localhost:5173` (Vite proxies `/api/*` to the Worker on `:8787`).

### Environment variables

Create `.dev.vars` (never committed):

```
DEEPSEEK_API_KEY=your_key_here
SESSION_SECRET=any_random_string_32_chars
```

---

## Deployment to Cloudflare

### 1. Create D1 database

```bash
wrangler d1 create hmns-db
```

Copy the `database_id` into `wrangler.toml`.

### 2. Set Worker secrets

```bash
wrangler secret put DEEPSEEK_API_KEY
wrangler secret put SESSION_SECRET
```

### 3. Run migrations on remote D1

```bash
wrangler d1 execute hmns-db --remote --file=migrations/001_schema.sql
wrangler d1 execute hmns-db --remote --file=migrations/002_seed.sql
```

### 4. Deploy via GitHub

Connect the repo to **Cloudflare Workers Builds** (Cloudflare dashboard → Workers & Pages → Create → Connect to Git).

Build settings:
- **Build command:** `npm run build`
- **Deploy command:** `wrangler deploy`

Or use the GitHub Actions workflow (`.github/workflows/deploy.yml`) with these repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Every push to `main` triggers a deploy.

---

## Admin

The admin dashboard lives at `/admin`. Default credentials are seeded in `migrations/002_seed.sql` — **change the password hash before deploying to production**.

Generate a new PBKDF2 hash:

```bash
node -e "
const { subtle } = globalThis.crypto;
const enc = new TextEncoder();
subtle.importKey('raw', enc.encode('your_password'), 'PBKDF2', false, ['deriveBits'])
  .then(k => subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt:enc.encode('hmns'), iterations:100000 }, k, 256))
  .then(b => console.log(Buffer.from(b).toString('hex')));
"
```

Then update the hash in `migrations/002_seed.sql` and re-run the migration.

---

## Features

- **Quiz** — 10-question personality + scent preference flow, one question per screen
- **AI recommendations** — DeepSeek picks 1 primary + 2 alternates with a personalized explanation; falls back to a deterministic tag scorer if the API is unavailable
- **Lead capture** — email + consent saved before results are shown; exportable as CSV from the admin
- **Catalog page** — browseable `/catalog` with search and type filters
- **Admin catalog CRUD** — add, edit, delete products without touching code
- **Bilingual** — EN / ID toggle on quiz and results
