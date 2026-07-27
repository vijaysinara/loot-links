const { sql } = require("../../lib/db");
const { requireAuth } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  if (!requireAuth(req, res)) return;

  const { ids } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ error: "ids must be a non-empty array" });
  }

  // Small lists (a personal product catalog), so a simple loop is plenty fast.
  for (let i = 0; i < ids.length; i++) {
    await sql`update products set sort_order = ${i + 1} where id = ${ids[i]}`;
  }
  res.json({ ok: true });
};
