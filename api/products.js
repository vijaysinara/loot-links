const crypto = require("crypto");
const { sql } = require("../lib/db");
const { requireAuth } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const onlyActive = req.query.active === "1";
    const rows = onlyActive
      ? await sql`select * from products where active = true order by sort_order asc`
      : await sql`select * from products order by sort_order asc`;
    return res.json(rows.map(toClient));
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const p = req.body || {};
    if (!p.title || !p.url || !p.image) {
      return res.status(400).json({ error: "Title, image, and affiliate URL are required." });
    }
    const [{ min_order }] = await sql`select min(sort_order) as min_order from products`;
    const nextOrder = min_order == null ? 1 : min_order - 1;
    const id = crypto.randomUUID();

    const [row] = await sql`
      insert into products (id, title, description, image, url, store, category, featured, active, sort_order)
      values (${id}, ${p.title}, ${p.description || ""}, ${p.image}, ${p.url},
              ${p.store || "Other"}, ${p.category || ""}, ${!!p.featured}, ${p.active !== false}, ${nextOrder})
      returning *
    `;
    return res.json(toClient(row));
  }

  res.status(405).end();
};

function toClient(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    url: row.url,
    store: row.store,
    category: row.category,
    featured: row.featured,
    active: row.active,
    order: row.sort_order,
    clicks: row.clicks,
    createdAt: row.created_at,
  };
}
