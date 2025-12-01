// src/services/passwordReset.service.js
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../../Utils/hash.js"; 
import {
  insertPasswordReset,
  findPasswordResetByHash,
  markTokenUsed,
  deleteTokenById,
} from "./passwordReset.queries.js";
import { sendResetEmail } from "../Email/email.service.js";
import("dotenv/config");

export const generateResetTokenRaw = () => {
  const raw = crypto.randomBytes(32).toString("hex"); // 64 chars
  const tokenHash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, tokenHash };
};

export const createPasswordResetForUser = async ({ user, ip, userAgent }) => {
  // user should have id and email
  const { raw, tokenHash } = generateResetTokenRaw();
  const id = uuidv4();
  const expiresMinutes = Number(process.env.RESET_TOKEN_EXPIRY_MINUTES || 15);
  const expires_at = new Date(
    Date.now() + expiresMinutes * 60 * 1000
  ).toISOString();

  // insert into DB
  await insertPasswordReset({
    id,
    user_id: user.user_id ,
    token_hash: tokenHash,
    email: user.email,
    ip_address: ip || null,
    user_agent: userAgent || null,
    expires_at,
  });

  // construct frontend reset URL
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetPath = `${frontendUrl}/reset-password?token=${raw}&id=${id}`; // id optional but may help UX
  // send email (don't await return if you want fire-and-forget, but we await to report errors)
  await sendResetEmail(
    user.email,
    resetPath,
    user.full_name || user.name || ""
  );

  // return raw token for any further handling (normally you don't return raw token in API)
  return { raw, tokenHash, expires_at };
};

export const verifyAndConsumeResetToken = async ({ tokenRaw }) => {
  const tokenHash = crypto.createHash("sha256").update(tokenRaw).digest("hex");
  const record = await findPasswordResetByHash(tokenHash);
  if (!record) return { ok: false, reason: "invalid_token" };

  // check used
  if (record.is_used) return { ok: false, reason: "token_already_used" };

  // check expiry
  const now = new Date();
  const expiresAt = new Date(record.expires_at);
  if (expiresAt < now) return { ok: false, reason: "token_expired" };

  // consume token (mark used)
  await markTokenUsed(record.id);

  // success: returns the record (contains user_id and email)
  return { ok: true, record };
};

export const resetPasswordForRecord = async ({ tokenRaw, newPassword }) => {
  // verify and consume
  const v = await verifyAndConsumeResetToken({ tokenRaw });
  if (!v.ok) return v;

  // hash new password (bcrypt)
  const hashed = await hashPassword(newPassword);

  
  const db = (await import("../config/db.config.js")).default;
  await db.query("UPDATE users SET password = $1 WHERE user_id = $2", [
    hashed,
    v.record.user_id,
  ]);

  // Optionally delete token record
  try {
    await deleteTokenById(v.record.id);
  } catch (e) {
    // non-fatal
    console.warn("Failed to delete token after reset:", e.message || e);
  }

  return { ok: true, user_id: v.record.user_id };
};

