const { sql } = require("../lib/db");
const { requireAuth } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const rows = await sql`select name, bio, logo from profile where id = 1`;
    return res.json(rows[0] || { name: "Your Brand", bio: "", logo: "" });
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    const { name, bio, logo } = req.body || {};
    await sql`
      insert into profile (id, name, bio, logo) values (1, ${name}, ${bio}, ${logo})
      on conflict (id) do update set name = ${name}, bio = ${bio}, logo = ${logo}
    `;
    return res.json({ ok: true });
  }

  res.status(405).end();
};
