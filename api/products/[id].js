const { sql } = require("../../lib/db");
const { requireAuth } = require("../../lib/auth");

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method === "PATCH") {
    if (!requireAuth(req, res)) return;
    const p = req.body || {};
    const [row] = await sql`
      update products set
        title       = coalesce(${p.title}, title),
        description = coalesce(${p.description}, description),
        image       = coalesce(${p.image}, image),
        url         = coalesce(${p.url}, url),
        store       = coalesce(${p.store}, store),
        category    = coalesce(${p.category}, category),
        featured    = coalesce(${p.featured}, featured),
        active      = coalesce(${p.active}, active)
      where id = ${id}
      returning *
    `;
    return res.json(row || null);
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    await sql`delete from products where id = ${id}`;
    return res.json({ ok: true });
  }

  res.status(405).end();
};
