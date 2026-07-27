const crypto = require("crypto");
const { sql } = require("../lib/db");
const { requireAuth } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const onlyEnabled = req.query.enabled === "1";
    const rows = onlyEnabled
      ? await sql`select * from social_links where enabled = true order by id`
      : await sql`select * from social_links order by id`;
    return res.json(rows);
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const { platform, url } = req.body || {};
    if (!url) return res.status(400).json({ error: "URL is required" });
    const id = crypto.randomUUID();
    const [row] = await sql`
      insert into social_links (id, platform, url, enabled) values (${id}, ${platform}, ${url}, true) returning *
    `;
    return res.json(row);
  }

  res.status(405).end();
};
