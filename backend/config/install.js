import { readFileSync } from "fs";
import { Client } from "pg";
import dotenv from "dotenv";
import { join , dirname } from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("__filename:", __filename);
console.log("__dirname:", __dirname);

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    const schemaPath = join(__dirname, "schema.sql"); // ✅ fixed path
    console.log("Reading schema from:", schemaPath);

    const schema = readFileSync(schemaPath, "utf8");
    await client.query(schema);

    console.log("All tables created successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
})();
