-- ============================================
--  User Profiles Migration
-- ============================================

-- Create user_profiles table
CREATE TABLE user_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    profile_image_url TEXT,
    profile_image_public_id TEXT,
    bio TEXT,
    date_of_birth DATE,
    address TEXT,
    emergency_contact_name VARCHAR(120),
    emergency_contact_phone VARCHAR(20),
    social_links JSONB, -- Store social media links as JSON
    preferences JSONB, -- Store user preferences as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
