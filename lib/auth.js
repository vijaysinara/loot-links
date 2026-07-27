// lib/auth.js — a small, dependency-free admin login system.
// The admin password lives in a Vercel environment variable (ADMIN_PASSWORD),
// never in the database or in this code. When it matches, we hand back a
// signed cookie the browser stores automatically; every protected API route
// checks that cookie with requireAuth() before making any changes.
const crypto = require("crypto");

const COOKIE_NAME = "ll_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.SESSION_SECRET || "please-set-SESSION_SECRET-in-vercel";
}

function sign(value) {
  const sig = crypto.createHmac("sha256", secret()).update(value).digest("hex");
  return `${value}.${sig}`;
}

function verify(signed) {
  if (!signed || typeof signed !== "string") return null;
  const dot = signed.lastIndexOf(".");
  if (dot === -1) return null;
  const value = signed.slice(0, dot);
  const sig = signed.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret()).update(value).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [user, ts] = value.split(":");
  if (!user || !ts) return null;
  const age = (Date.now() - Number(ts)) / 1000;
  if (age > MAX_AGE_SECONDS) return null;
  return user;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header.split(";").filter(Boolean).map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
}

function createSessionCookie() {
  const value = `admin:${Date.now()}`;
  const signed = sign(value);
  return `${COOKIE_NAME}=${encodeURIComponent(signed)}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax; Secure`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`;
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  return !!verify(cookies[COOKIE_NAME]);
}

// Call at the top of any route that changes data. Returns true and does
// nothing if the request is authenticated; sends a 401 and returns false otherwise.
function requireAuth(req, res) {
  if (isAuthed(req)) return true;
  res.status(401).json({ error: "Not signed in." });
  return false;
}

module.exports = { createSessionCookie, clearSessionCookie, isAuthed, requireAuth };
