const crypto = require("crypto");
const { sql } = require("../lib/db");
const { requireAuth } = require("../lib/auth");

// One function handles the whole /api/products resource:
//   GET    /api/products              -> list all (admin)
//   GET    /api/products?active=1     -> list active only (public site)
//   POST   /api/products              -> add
//   POST   /api/products?action=reorder  body:{ids:[...]}   -> bulk reorder
//   POST   /api/products?action=click    body:{id}          -> track a click (public)
//   PATCH  /api/products?id=xxx       -> update
//   DELETE /api/products?id=xxx       -> delete
module.exports = async (req, res) => {
  const { id, active, action } = req.query;

  if (req.method === "GET") {
    const rows =
      active === "1"
        ? await sql`select * from products where active = true order by sort_order asc`
        : await sql`select * from products order by sort_order asc`;
    return res.json(rows.map(toClient));
  }

  if (req.method === "POST" && action === "reorder") {
    if (!requireAuth(req, res)) return;
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: "ids must be a non-empty array" });
    }
    for (let i = 0; i < ids.length; i++) {
      await sql`update products set sort_order = ${i + 1} where id = ${ids[i]}`;
    }
    return res.json({ ok: true });
  }

  if (req.method === "POST" && action === "click") {
    // public — visitors trigger this, no auth required
    const { id: clickId } = req.body || {};
    if (!clickId) return res.status(400).json({ error: "Product id required" });
    await sql`update products set clicks = clicks + 1 where id = ${clickId}`;
    await sql`insert into clicks (product_id) values (${clickId})`;
    return res.json({ ok: true });
  }

  if (req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const p = req.body || {};
    if (!p.title || !p.url || !p.image) {
      return res.status(400).json({ error: "Title, image, and affiliate URL are required." });
    }
    const [{ min_order }] = await sql`select min(sort_order) as min_order from products`;
    const nextOrder = min_order == null ? 1 : min_order - 1;
    const newId = crypto.randomUUID();
    const [row] = await sql`
      insert into products (id, title, description, image, url, store, category, featured, active, sort_order)
      values (${newId}, ${p.title}, ${p.description || ""}, ${p.image}, ${p.url},
              ${p.store || "Other"}, ${p.category || ""}, ${!!p.featured}, ${p.active !== false}, ${nextOrder})
      returning *
    `;
    return res.json(toClient(row));
  }

  if (req.method === "PATCH") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ error: "id query param required" });
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
    return res.json(row ? toClient(row) : null);
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    if (!id) return res.status(400).json({ error: "id query param required" });
    await sql`delete from products where id = ${id}`;
    return res.json({ ok: true });
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
