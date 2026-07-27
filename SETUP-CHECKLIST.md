# LootLinks — Setup Checklist (Real Database Version)

This version is connected to a real, shared database (Neon Postgres) through Vercel — so every visitor sees the same live data, and you can manage it from your phone or laptop, anywhere.

**You don't need to write or understand any code.** Just follow these steps in order, clicking where it says click, and pasting where it says paste.

---

## ✅ Step 1 — Put this project on GitHub

1. Go to [github.com](https://github.com) and log in (make a free account if you don't have one).
2. Click the **+** in the top right → **New repository**. Name it `loot-links`, keep it Private or Public, click **Create repository**.
3. On the new repo's page, click **uploading an existing file**, then drag in the whole unzipped `loot-links-vercel` folder. Click **Commit changes**.

*(If you're comfortable with GitHub Desktop instead, that works too — same result.)*

## ✅ Step 2 — Connect it to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in (you can use your GitHub account to sign in — easiest option).
2. Click **Add New → Project**.
3. Find your `loot-links` repo in the list and click **Import**.
4. Leave all the settings on their defaults and click **Deploy**.
5. Wait ~1 minute. You'll get a live link like `https://loot-links-yourname.vercel.app` — **it won't work perfectly yet**, that's expected, we still need the database and passwords. Keep going.

## ✅ Step 3 — Create the database

1. In your new Vercel project, click the **Storage** tab at the top.
2. Click **Create Database**.
3. Choose **Neon (Postgres)** from the list.
4. Click through the prompts, choosing the **Free** plan, then **Connect** it to your project.
5. Vercel automatically saves a secret connection code (`DATABASE_URL`) for you — you don't need to copy or type anything here.

## ✅ Step 4 — Set up the database's "shelves" (tables)

1. Still on the Storage tab, click **Open in Neon** (or "Open in Neon Console").
2. In the Neon website, find the **SQL Editor** in the left sidebar. Click it.
3. Open the file `schema.sql` from your project folder (open it in Notepad/TextEdit — no coding needed, just copying).
4. **Select all the text** in that file, **copy** it, then **paste** it into the Neon SQL Editor box.
5. Click **Run**. You should see a success message. That's it — your database now has everything it needs, plus two sample products to start.

## ✅ Step 5 — Set your admin password

1. Back in Vercel, go to your project → **Settings → Environment Variables**.
2. Add these three, one at a time (type the **Name**, then the **Value**, then click **Save**):

   | Name | Value |
   |---|---|
   | `ADMIN_USERNAME` | `admin` (or anything you like) |
   | `ADMIN_PASSWORD` | a strong password you'll remember |
   | `SESSION_SECRET` | any long random string — mash your keyboard, e.g. `k3jf92md0sk29fjWlmzalq` |

3. Go to the **Deployments** tab, click the **⋯** menu on the latest deployment, and click **Redeploy** so these new settings take effect.

## ✅ Step 6 — Try it out

1. Visit `https://your-project-name.vercel.app` — you should see your live site with the 2 sample products.
2. Visit `https://your-project-name.vercel.app/admin/login.html` and log in with the username/password you set in Step 5.
3. Try adding a product, editing your profile, or adding a social link — then refresh the public page and watch it appear.

## ✅ Step 7 — Add the link to Instagram

Instagram app → your profile → **Edit profile** → **Website** → paste your `https://your-project-name.vercel.app` link → **Done**.

---

## If something doesn't work

- **"Failed to load site data" on the public page** → Step 4 was likely skipped or the SQL didn't run — go back to the Neon SQL Editor and re-run `schema.sql`.
- **Can't log in to admin** → Double check `ADMIN_USERNAME` / `ADMIN_PASSWORD` in Vercel exactly match what you're typing, and make sure you clicked **Redeploy** after adding them (env vars only apply after a redeploy).
- **Changes in admin don't show on the public page** → Hard-refresh the public page (Ctrl+Shift+R / Cmd+Shift+R) — the browser may be caching the old page.

## What's different from the "quick start" version

The earlier version of this project stored everything in your browser only (`localStorage`) — perfect for trying it out instantly with zero setup, but not shared across devices/visitors. This version replaces that with:
- A real shared **Neon Postgres database** (see `schema.sql` for the exact structure)
- Small serverless functions in `/api` that read/write that database (open any file in there if you're ever curious what it does — each one is short and commented in plain English)
- Real server-side admin login (`ADMIN_USERNAME` / `ADMIN_PASSWORD` in Vercel, never stored in the database)

Everything else — the look, the admin dashboard pages, adding/editing/reordering products — works exactly the same as before.
