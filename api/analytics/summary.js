const { sql } = require("../../lib/db");
const { requireAuth } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (!requireAuth(req, res)) return;

  const [{ count: totalVisitors }] = await sql`select count(*)::int from visits`;
  const [{ count: totalClicks }] = await sql`select count(*)::int from clicks`;
  const [{ count: todayClicks }] = await sql`
    select count(*)::int from clicks where created_at::date = now()::date
  `;
  const top = await sql`
    select p.title, count(c.id)::int as clicks
    from clicks c join products p on p.id = c.product_id
    group by p.title
    order by clicks desc
    limit 1
  `;
  const days = await sql`
    select
      d::date as date,
      (select count(*)::int from clicks where created_at::date = d::date) as clicks,
      (select count(*)::int from visits where created_at::date = d::date) as visitors
    from generate_series(now()::date - interval '6 days', now()::date, interval '1 day') as d
    order by d asc
  `;

  res.json({
    totalVisitors,
    totalClicks,
    todayClicks,
    topProduct: top[0] || null,
    days: days.map((d) => ({ date: d.date, clicks: d.clicks, visitors: d.visitors })),
  });
};
