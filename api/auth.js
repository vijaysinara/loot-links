const { createSessionCookie, clearSessionCookie, isAuthed } = require("../lib/auth");

// One function handles the whole /api/auth resource:
//   GET  /api/auth                 -> { loggedIn: true|false }
//   POST /api/auth?action=login    body:{username,password} -> sets session cookie
//   POST /api/auth?action=logout   -> clears session cookie
module.exports = async (req, res) => {
  const { action } = req.query;

  if (req.method === "GET") {
    return res.json({ loggedIn: isAuthed(req) });
  }

  if (req.method === "POST" && action === "login") {
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
    return res.json({ ok: true });
  }

  if (req.method === "POST" && action === "logout") {
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.json({ ok: true });
  }

  res.status(405).end();
};
