# Profile API Postman Testing Guide

## Setup Instructions

1. **Environment Variables:**
   - `base_url`: http://localhost:2000
   - `access_token`: Get this from login endpoint
   - `refresh_token`: Get this from login endpoint

2. **Authentication:**
   All endpoints require Bearer token in Authorization header: `Bearer {{access_token}}`

## API Endpoints

### 1. Get Profile
- **Method:** GET
- **URL:** `{{base_url}}/profile`
- **Headers:** 
  - Authorization: Bearer {{access_token}}
- **Description:** Retrieve user profile information

### 2. Upload Profile Image
- **Method:** POST
- **URL:** `{{base_url}}/profile/image`
- **Headers:**
  - Authorization: Bearer {{access_token}}
  - Content-Type: multipart/form-data
- **Body:** Form-data with key `profile_image` (file)
- **Description:** Upload or update profile image. Image stored in Cloudinary, auto-resized to 500x500 with face detection.
- **File Requirements:** JPG, PNG, GIF, WebP (Max 5MB)

### 3. Update Profile Information
- **Method:** PUT
- **URL:** `{{base_url}}/profile`
- **Headers:**
  - Authorization: Bearer {{access_token}}
  - Content-Type: application/json
- **Body:**
```json
{
    "bio": "Passionate educator with 10+ years of experience",
    "date_of_birth": "1990-05-15",
    "address": "123 Education Street, Learning City, ED 12345",
    "emergency_contact_name": "Jane Smith",
    "emergency_contact_phone": "+1234567890",
    "social_links": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "twitter": "@johndoe",
        "website": "https://johndoe.com"
    },
    "preferences": {
        "theme": "dark",
        "language": "en",
        "notifications": true,
        "email_alerts": true
    }
}
```
- **Description:** Update profile information. All fields are optional.

### 4. Delete Profile Image
- **Method:** DELETE
- **URL:** `{{base_url}}/profile/image`
- **Headers:**
  - Authorization: Bearer {{access_token}}
- **Description:** Delete profile image from both Cloudinary and database

## Database Setup

Before testing, run the migration:
```sql
-- Run this in your PostgreSQL database
-- File: backend/migrations/add_user_profiles.sql
```

## Environment Configuration

Add these to your `.env` file:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Testing Flow

1. **Login First:** Get access and refresh tokens
2. **Get Profile:** Check current profile status
3. **Upload Image:** Test profile image upload
4. **Update Info:** Test profile information update
5. **Delete Image:** Test image deletion (optional)

## Expected Responses

### Success Response Format:
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... }
}
```

### Error Response Format:
```json
{
    "success": false,
    "message": "Error description",
    "errors": [ ... ] // Validation errors if applicable
}
```
