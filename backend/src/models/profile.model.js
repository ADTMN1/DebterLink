import { query } from '../../config/db.config.js';

export class ProfileModel {
  // Get profile by user ID
  static async getByUserId(userId) {
    const sql = `
      SELECT 
        p.profile_id,
        p.user_id,
        p.profile_image_url,
        p.profile_image_public_id,
        p.bio,
        p.date_of_birth,
        p.address,
        p.emergency_contact_name,
        p.emergency_contact_phone,
        p.social_links,
        p.preferences,
        p.created_at,
        p.updated_at,
        u.full_name,
        u.email,
        u.phone_number,
        r.role_name
      FROM user_profiles p
      LEFT JOIN users u ON p.user_id = u.user_id
      LEFT JOIN roles r ON u.role_id = r.role_id
      WHERE p.user_id = $1
    `;
    
    const result = await query(sql, [userId]);
    return result.rows[0] || null;
  }

  // Create or update profile
  static async upsert(userId, profileData) {
    const {
      profile_image_url,
      profile_image_public_id,
      bio,
      date_of_birth,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      social_links,
      preferences
    } = profileData;

    const sql = `
      INSERT INTO user_profiles (
        user_id,
        profile_image_url,
        profile_image_public_id,
        bio,
        date_of_birth,
        address,
        emergency_contact_name,
        emergency_contact_phone,
        social_links,
        preferences
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        profile_image_url = EXCLUDED.profile_image_url,
        profile_image_public_id = EXCLUDED.profile_image_public_id,
        bio = EXCLUDED.bio,
        date_of_birth = EXCLUDED.date_of_birth,
        address = EXCLUDED.address,
        emergency_contact_name = EXCLUDED.emergency_contact_name,
        emergency_contact_phone = EXCLUDED.emergency_contact_phone,
        social_links = EXCLUDED.social_links,
        preferences = EXCLUDED.preferences,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      userId,
      profile_image_url,
      profile_image_public_id,
      bio,
      date_of_birth,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      social_links ? JSON.stringify(social_links) : null,
      preferences ? JSON.stringify(preferences) : null
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  // Update only profile image
  static async updateProfileImage(userId, imageUrl, publicId) {
    const sql = `
      INSERT INTO user_profiles (user_id, profile_image_url, profile_image_public_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        profile_image_url = EXCLUDED.profile_image_url,
        profile_image_public_id = EXCLUDED.profile_image_public_id,
        updated_at = NOW()
      RETURNING profile_image_url, profile_image_public_id
    `;

    const result = await query(sql, [userId, imageUrl, publicId]);
    return result.rows[0];
  }

  // Delete profile image
  static async deleteProfileImage(userId) {
    const sql = `
      UPDATE user_profiles 
      SET profile_image_url = NULL, 
          profile_image_public_id = NULL,
          updated_at = NOW()
      WHERE user_id = $1
      RETURNING profile_image_public_id
    `;

    const result = await query(sql, [userId]);
    return result.rows[0];
  }

  // Check if profile exists
  static async exists(userId) {
    const sql = 'SELECT 1 FROM user_profiles WHERE user_id = $1';
    const result = await query(sql, [userId]);
    return result.rows.length > 0;
  }
}
