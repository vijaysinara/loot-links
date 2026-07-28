const { sql } = require("../lib/db");
const { requireAuth } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const rows = await sql`select seo_title, seo_description, og_image from settings where id = 1`;
    const s = rows[0] || {};
    return res.json({
      seoTitle: s.seo_title || "",
      seoDescription: s.seo_description || "",
      ogImage: s.og_image || "",
    });
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    const { seoTitle, seoDescription, ogImage } = req.body || {};
    await sql`
      insert into settings (id, seo_title, seo_description, og_image) values (1, ${seoTitle}, ${seoDescription}, ${ogImage})
      on conflict (id) do update set seo_title = ${seoTitle}, seo_description = ${seoDescription}, og_image = ${ogImage}
    `;
    return res.json({ ok: true });
  }

  res.status(405).end();
};
