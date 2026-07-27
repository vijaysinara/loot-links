const { createSessionCookie } = require("../../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validPass) {
    return res.status(500).json({ error: "ADMIN_PASSWORD is not set on the server yet." });
  }
  if (username !== validUser || password !== validPass) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }
  res.setHeader("Set-Cookie", createSessionCookie());
  res.json({ ok: true });
};
