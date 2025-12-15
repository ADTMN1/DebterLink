import bcrypt from "bcryptjs";
import db from "../config/db.config.js";
import { v4 as uuidv4 } from "uuid";

const createUser = async ({ full_name, email, password, phone, role_id }) => {
  const hash = await bcrypt.hash(password, 12);

  await db.query(
    `INSERT INTO users (user_id, full_name, email, password, phone_number, role_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO NOTHING`,
    [uuidv4(), full_name, email, hash, phone, role_id]
  );
};

const run = async () => {
  console.log("🚀 Bootstrapping system admins...");

  await createUser({
    full_name: "Super Admin",
    email: "natnaelabebaw31@gmail.com",
    password: "SuperAdmin@123",
    phone: "0900000000",
    role_id: 6,
  });

  await createUser({
    full_name: "Admin",
    email: "admin@gmail.com",
    password: "Admin@123",
    phone: "0911111111",
    role_id: 5,
  });

  console.log("✅ Super Admin & Admin created");
  process.exit(0);
};

run().catch(err => {
  console.error("❌ Bootstrap failed:", err);
  process.exit(1);
});
