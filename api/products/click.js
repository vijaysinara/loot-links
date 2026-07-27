const { sql } = require("../../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "Product id required" });

  await sql`update products set clicks = clicks + 1 where id = ${id}`;
  await sql`insert into clicks (product_id) values (${id})`;
  res.json({ ok: true });
};
