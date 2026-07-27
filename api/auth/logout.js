const { clearSessionCookie } = require("../../lib/auth");

module.exports = async (req, res) => {
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.json({ ok: true });
};
