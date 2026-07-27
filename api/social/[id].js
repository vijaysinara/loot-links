const { sql } = require("../../lib/db");
const { requireAuth } = require("../../lib/auth");

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method === "PATCH") {
    if (!requireAuth(req, res)) return;
    const { url, enabled } = req.body || {};
    const [row] = await sql`
      update social_links set
        url = coalesce(${url}, url),
        enabled = coalesce(${enabled}, enabled)
      where id = ${id}
      returning *
    `;
    return res.json(row || null);
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    await sql`delete from social_links where id = ${id}`;
    return res.json({ ok: true });
  }

  res.status(405).end();
};
