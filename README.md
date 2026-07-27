# LootLinks — Database-Connected Version

The same premium affiliate link-in-bio site and admin dashboard as before, now backed by a real, shared **Neon Postgres** database via **Vercel**, instead of browser-only localStorage.

👉 **New here? Start with [`SETUP-CHECKLIST.md`](./SETUP-CHECKLIST.md)** — a plain-English, click-by-click guide with no coding required.

## Project structure

```
loot-links-vercel/
├── index.html, admin/*.html     ← same pages as before (now call a real API)
├── assets/js/db.js              ← the only file that changed shape: same function
│                                   names (DB.Products.add, etc.) but now `async`
│                                   and backed by fetch() calls instead of localStorage
├── api/                         ← Vercel Serverless Functions (your backend)
│   ├── profile.js, settings.js
│   ├── social.js, social/[id].js
│   ├── products.js, products/[id].js, products/reorder.js, products/click.js
│   ├── analytics/summary.js, analytics/visit.js
│   └── auth/login.js, logout.js, session.js
├── lib/
│   ├── db.js                    ← Neon Postgres connection
│   └── auth.js                  ← signed-cookie session auth (no extra packages)
├── schema.sql                   ← run once in the Neon SQL Editor
├── package.json                 ← one dependency: @neondatabase/serverless
└── .env.example                 ← the environment variables you'll set in Vercel
```

## How auth works

There's no users table and no password stored in the database. `ADMIN_USERNAME` / `ADMIN_PASSWORD` live only as Vercel environment variables; `api/auth/login.js` checks against them and, if correct, sets a signed `httpOnly` cookie (`lib/auth.js`). Every route that changes data calls `requireAuth(req, res)` first.

## Local development

```bash
npm install -g vercel   # one-time, if you haven't used the Vercel CLI before
vercel link             # connect this folder to your Vercel project
vercel env pull .env.development.local
vercel dev              # runs the site + API locally at http://localhost:3000
```

## Extending this

- **Real image storage**: images are currently stored as base64 text directly in the `products.image` column — fine for a personal catalog, but swap in [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) if you want dedicated file storage later. Add an `api/upload.js` route that returns a URL, and store that URL instead.
- **Multiple admins**: add a `users` table and check against it in `api/auth/login.js` instead of the single env-var pair.
- **Rate limiting / spam protection on clicks**: `api/products/click.js` is currently open to anyone — fine for normal traffic, but add IP-based throttling if you ever see abuse.

See `SETUP-CHECKLIST.md` for the actual deploy steps.
