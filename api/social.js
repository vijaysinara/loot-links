const crypto = require("crypto");
const { sql } = require("../lib/db");
const { requireAuth } = require("../lib/auth");

// One function handles the whole /api/social resource:
//   GET    /api/social            -> list all
//   GET    /api/social?enabled=1  -> list only enabled
//   POST   /api/social            -> add
//   PATCH  /api/social?id=xxx     -> update
//   DELETE /api/social?id=xxx     -> delete
module.exports = async (req, res) => {
  const { id, enabled } = req.query;

  if (req.method === "GET") {
    const rows =
      enabled === "1"
        ? await sql`select * from social_links where enabled = true order by id`
        : await sql`select * from social_links order by id`;
    return res.json(rows);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const { platform, url } = req.body || {};
    if (!url) return res.status(400).json({ error: "URL is required" });
    const newId = crypto.randomUUID();
    const [row] = await sql`
      insert into social_links (id, platform, url, enabled) values (${newId}, ${platform}, ${url}, true) returning *
    `;
    return res.json(row);
  }

  if (req.method === "PATCH") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ error: "id query param required" });
    const { url, enabled: newEnabled } = req.body || {};
    const [row] = await sql`
      update social_links set
        url = coalesce(${url}, url),
        enabled = coalesce(${newEnabled}, enabled)
      where id = ${id}
      returning *
    `;
    return res.json(row || null);
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ error: "id query param required" });
    await sql`delete from social_links where id = ${id}`;
    return res.json({ ok: true });
  }

  res.status(405).end();
};
