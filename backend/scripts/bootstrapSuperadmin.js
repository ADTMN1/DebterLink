import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seedSuperadmin = async () => {
  try {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in .env');
    }

    // 1️⃣ Get the role_id for super_admin
    const roleRes = await pool.query(
      'SELECT role_id FROM roles WHERE role_name = $1',
      ['super_admin']
    );

    if (roleRes.rows.length === 0) {
      throw new Error('Role "super_admin" does not exist in roles table');
    }

    const roleId = roleRes.rows[0].role_id;

    // 2️⃣ Check if superadmin already exists
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('Superadmin already exists.');
      return;
    }

    // 3️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert superadmin into users table
    const userRes = await pool.query(
      `INSERT INTO users (role_id, full_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id`,
      [roleId, 'Super Admin', email, hashedPassword]
    );

    const userId = userRes.rows[0].user_id;

    // 5️⃣ Insert into super_admin table
    await pool.query(
      'INSERT INTO super_admin (user_id) VALUES ($1)',
      [userId]
    );

    console.log('Superadmin created successfully!');
  } catch (err) {
    console.error('Error creating superadmin:', err);
  } finally {
    await pool.end();
  }
};

seedSuperadmin();
