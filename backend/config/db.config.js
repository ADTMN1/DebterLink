// config/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for cloud DBs
  },
  max: 5,                 // max clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 10000, // 10s connection timeout
});

// Log successful connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

// Handle errors globally
pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on PostgreSQL client', err);
});

// Optional: Helper to query with automatic retry
export async function query(text, params) {
  let retries = 5;
  while (retries > 0) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error('Query failed, retrying...', err.code || err.message);
      retries--;
      await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
    }
  }
  throw new Error('Database query failed after multiple retries');
}

export default pool;
