const { sql } = require("../../lib/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  await sql`insert into visits default values`;
  res.json({ ok: true });
};
