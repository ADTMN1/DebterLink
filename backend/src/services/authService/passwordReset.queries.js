// src/queries/passwordReset.queries.js
import db from "../../../config/db.config.js";

export const findUserByEmail = async (email) => {
  const q = `
    SELECT user_id, email, password 
    FROM users 
    WHERE email = $1 
    LIMIT 1;
  `;
  const { rows } = await db.query(q, [email]);
  return rows[0] || null;
};


// Insert a new reset token record
export const insertPasswordReset = async ({
  id,
  user_id,
  token_hash,
  email,
  ip_address,
  user_agent,
  expires_at,
}) => {
  const q = `
    INSERT INTO password_reset_tokens
      (id, user_id, token_hash, email, is_used, ip_address, user_agent, expires_at)
    VALUES ($1, $2, $3, $4, false, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    id,
    user_id,
    token_hash,
    email,
    ip_address,
    user_agent,
    expires_at,
  ];
  const { rows } = await db.query(q, values);
  return rows[0];
};

// Find a token record by token_hash
export const findPasswordResetByHash = async (token_hash) => {
  const q = `
    SELECT * FROM password_reset_tokens
    WHERE token_hash = $1
    LIMIT 1;
  `;
  const { rows } = await db.query(q, [token_hash]);
  return rows[0] || null;
};

// Mark token as used
export const markTokenUsed = async (id) => {
  const q = `UPDATE password_reset_tokens SET is_used = true WHERE id = $1 RETURNING *;`;
  const { rows } = await db.query(q, [id]);
  return rows[0];
};

// Delete token (optional cleanup)
export const deleteTokenById = async (id) => {
  const q = `DELETE FROM password_reset_tokens WHERE id = $1;`;
  await db.query(q, [id]);
};

// Optional: delete expired tokens (cron or manual)
export const deleteExpiredTokens = async () => {
  const q = `DELETE FROM password_reset_tokens WHERE expires_at < now();`;
  await db.query(q);
};
