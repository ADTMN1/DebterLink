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
        rejectUnauthorized: false, // Allow Neon's SSL certificates
      }
    : false,

  max: Number(process.env.DB_POOL_SIZE) || 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 60000, // Increased to 60 seconds
  statement_timeout: 45000, 
  query_timeout: 45000,
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
  let retries = 3; // Increased retries

  while (retries > 0) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      const transientErrors = [
        "ECONNRESET",
        "ETIMEDOUT",
        "ENOTFOUND",
        "57P01", 
        "40001", 
        "08006", // connection failure
        "08001", // sqlclient unable to establish sqlconnection
      ];

      console.error(`Database error (retries left: ${retries}):`, err.message);

      if (!transientErrors.includes(err.code)) {
        throw err; 
      }

      retries--;
      if (retries > 0) {
        console.log(`Retrying database connection in 1 second...`);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw new Error("Database unavailable after multiple attempts");
}

export default pool;
