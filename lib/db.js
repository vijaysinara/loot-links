// lib/db.js — one shared connection to your Neon Postgres database.
// Every /api/*.js file imports { sql } from here to run queries.
const { neon } = require("@neondatabase/serverless");

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set — add it in Vercel → Settings → Environment Variables.");
}

const sql = neon(process.env.DATABASE_URL);

module.exports = { sql };
