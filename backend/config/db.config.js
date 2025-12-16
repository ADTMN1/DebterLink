// config/db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const isProd = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: isProd
    ? {
        rejectUnauthorized: true, // prevent MITM
      }
    : false,

  max: Number(process.env.DB_POOL_SIZE) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,

  statement_timeout: 15000, // 15s
  query_timeout: 15000,
});

let logged = false;
pool.on("connect", () => {
  if (!logged) {
    console.log("✅ PostgreSQL pool connected");
    logged = true;
  }
});

pool.on("error", (err) => {
  console.error("🚨 PostgreSQL pool error", err);
  process.exit(1);
});

export async function query(text, params = []) {
  let retries = 3;

  while (retries > 0) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      const transientErrors = [
        "ECONNRESET",
        "ETIMEDOUT",
        "57P01", 
        "40001", 
      ];

      if (!transientErrors.includes(err.code)) {
        throw err; 
      }

      retries--;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  throw new Error("Database unavailable");
}

export default pool;
