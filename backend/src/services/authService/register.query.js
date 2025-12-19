// In register.query.js
import crypto from "crypto";

const trySavepoint = async (client, name) => {
  try {
    await client.query(`SAVEPOINT ${name}`);
    return true;
  } catch {
    return false;
  }
};

const rollbackToSavepoint = async (client, name) => {
  try {
    await client.query(`ROLLBACK TO SAVEPOINT ${name}`);
  } catch {
    // ignore
  }
};

const releaseSavepoint = async (client, name) => {
  try {
    await client.query(`RELEASE SAVEPOINT ${name}`);
  } catch {
    // ignore
  }
};

export default {
  // Check if user exists by email
  checkUserExists: async (email, client) => {
    const query = "SELECT 1 FROM users WHERE email = $1";
    const result = await client.query(query, [email]);
    return result.rowCount > 0;
  },

  // Create a new user
  createUser: async (full_name, email, password, phone_number, role_id, client) => {
    const sp = "sp_create_user";
    const hasSp = await trySavepoint(client, sp);
    try {
      const query = `
        INSERT INTO users (full_name, email, password, phone_number, role_id, password_status)
        VALUES ($1, $2, $3, $4, $5, 'temporary')
        RETURNING user_id, full_name, email, role_id, password_status
      `;
      const values = [full_name, email, password, phone_number, role_id];
      const result = await client.query(query, values);
      if (hasSp) await releaseSavepoint(client, sp);
      return result.rows[0];
    } catch (err) {
      if (hasSp) {
        await rollbackToSavepoint(client, sp);
        await releaseSavepoint(client, sp);
      }
      // Old schema doesn't include password_status
      if (err?.code !== "42703") throw err;
      
      // Fallback to old schema without password_status
      const fallbackQuery = `
        INSERT INTO users (full_name, email, password, phone_number, role_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING user_id, full_name, email, role_id
      `;
      const values = [full_name, email, password, phone_number, role_id];
      const result = await client.query(fallbackQuery, values);
      return result.rows[0];
    }
  },

  // Create Admin entry linking user to a school
  createAdmin: async (adminData, client) => {
    const { user_id, school_id, created_by } = adminData;
    const sp = "sp_create_admin";
    const hasSp = await trySavepoint(client, sp);
    try {
      const query = `
        INSERT INTO admin (user_id, school_id, created_by, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING admin_id, user_id, school_id
      `;
      const result = await client.query(query, [user_id, school_id, created_by || null]);
      if (hasSp) await releaseSavepoint(client, sp);
      return result.rows[0];
    } catch (err) {
      if (hasSp) {
        await rollbackToSavepoint(client, sp);
        await releaseSavepoint(client, sp);
      }
      if (err?.code !== "42703") throw err;

      const fallbackQuery = `
        INSERT INTO admin (user_id, school_id)
        VALUES ($1, $2)
        RETURNING admin_id, user_id, school_id
      `;
      const result = await client.query(fallbackQuery, [user_id, school_id]);
      return result.rows[0];
    }
  },

  // Create a new school
  createSchool: async (schoolData, client) => {
    const { 
      school_name, 
      code,
      email, 
      phone, 
      address, 
      academic_year,
      status,
      website 
    } = schoolData;

    const sp = "sp_create_school";
    const hasSp = await trySavepoint(client, sp);
    try {
      const query = `
        INSERT INTO school (
          school_name, 
          code,
          email, 
          phone, 
          address, 
          academic_year,
          status,
          website,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING 
          school_id, 
          school_name, 
          code,
          email, 
          phone, 
          address, 
          academic_year,
          status,
          website
      `;

      const result = await client.query(query, [
        school_name,
        code,
        email,
        phone || null,
        address || null,
        academic_year || null,
        status || "active",
        website || null,
      ]);

      if (hasSp) await releaseSavepoint(client, sp);
      return result.rows[0];
    } catch (err) {
      if (hasSp) {
        await rollbackToSavepoint(client, sp);
        await releaseSavepoint(client, sp);
      }
      // Old schema doesn't include code/academic_year/status/created_at/updated_at
      if (err?.code !== "42703") throw err;

      const fallbackQuery = `
        INSERT INTO school (
          school_name,
          email,
          phone,
          address,
          website
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING school_id, school_name, email, phone, address, website
      `;
      const result = await client.query(fallbackQuery, [
        school_name,
        email,
        phone || null,
        address || null,
        website || null,
      ]);
      return result.rows[0];
    }
  },

  // Create password reset token
  createPasswordResetToken: async (user_id, token, expiry, client) => {
    await client.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [user_id]);

    // Try "token/expires_at" schema first
    {
      const sp = "sp_prt_token";
      const hasSp = await trySavepoint(client, sp);
      try {
      await client.query(
        `INSERT INTO password_reset_tokens 
         (user_id, token, expires_at, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [user_id, token, expiry]
      );
        if (hasSp) await releaseSavepoint(client, sp);
      return;
      } catch (err) {
        if (hasSp) {
          await rollbackToSavepoint(client, sp);
          await releaseSavepoint(client, sp);
        }
        if (err?.code !== "42703") throw err;
      }
    }

    // Fallback: "token_hash/email" schema
    const token_hash = crypto.createHash("sha256").update(token).digest("hex");
    const userRes = await client.query("SELECT email FROM users WHERE user_id = $1", [user_id]);
    const email = userRes.rows?.[0]?.email;
    if (!email) {
      throw new Error("Unable to create password reset token: user email not found");
    }

    // Try with expires_at if it exists
    {
      const sp = "sp_prt_hash_expires";
      const hasSp = await trySavepoint(client, sp);
      try {
      await client.query(
        `INSERT INTO password_reset_tokens
          (user_id, token_hash, email, is_used, expires_at, created_at)
         VALUES ($1, $2, $3, false, $4, NOW())`,
        [user_id, token_hash, email, expiry]
      );
        if (hasSp) await releaseSavepoint(client, sp);
      } catch (err) {
        if (hasSp) {
          await rollbackToSavepoint(client, sp);
          await releaseSavepoint(client, sp);
        }
        if (err?.code !== "42703") throw err;

        // Last-resort: schema without expires_at
        const sp2 = "sp_prt_hash";
        const hasSp2 = await trySavepoint(client, sp2);
        try {
          await client.query(
            `INSERT INTO password_reset_tokens
              (user_id, token_hash, email, is_used, created_at)
             VALUES ($1, $2, $3, false, NOW())`,
            [user_id, token_hash, email]
          );
          if (hasSp2) await releaseSavepoint(client, sp2);
        } catch (err2) {
          if (hasSp2) {
            await rollbackToSavepoint(client, sp2);
            await releaseSavepoint(client, sp2);
          }
          throw err2;
        }
      }
    }
  },

  // Get user by ID
  getUserById: async (user_id, client) => {
    const result = await client.query(
      'SELECT user_id, role_id FROM users WHERE user_id = $1',
      [user_id]
    );
    return result.rows[0];
  },

  // Get school by code
  getSchoolByCode: async (code, client) => {
    try {
      const result = await client.query("SELECT * FROM school WHERE code = $1", [code]);
      return result.rows[0];
    } catch (err) {
      if (err?.code === "42703") return null;
      throw err;
    }
  }
};