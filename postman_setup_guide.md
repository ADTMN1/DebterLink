# Debter Link API Testing Guide - Step by Step

## Server Configuration
- **Base URL**: `http://localhost:2000/api`
- **Server Port**: 2000
- **Health Check**: `http://localhost:2000/health`

## User Roles & Credentials
Based on the codebase analysis:

### Super Admin
- **Email**: Set in `.env.local` as `SUPERADMIN_EMAIL`
- **Password**: Set in `.env.local` as `SUPERADMIN_PASSWORD`
- **Role ID**: 1
- **Login Endpoint**: `POST /api/auth/login`

### Role Hierarchy
1. **Super Admin** (role_id: 1) - Can manage schools and create admins
2. **Admin** (role_id: 2) - Can manage school operations
3. **Director** (role_id: 3) - School director
4. **Teacher** (role_id: 4) - Can create assignments, mark attendance
5. **Student** (role_id: 5) - Can view grades and assignments
6. **Parent** (role_id: 6) - Can view child's progress

## Step-by-Step Testing Flow

### Step 1: Server Health Check
```http
GET http://localhost:2000/health
```
Expected: `{"status": "ok"}`

### Step 2: Super Admin Login
```http
POST http://localhost:2000/api/auth/login
Content-Type: application/json

{
    "email": "YOUR_SUPERADMIN_EMAIL",
    "password": "YOUR_SUPERADMIN_PASSWORD"
}
```

Expected Response:
```json
{
    "status": true,
    "message": "Login successful",
    "data": {
        "id": "uuid",
        "full_name": "Super Admin",
        "email": "superadmin@...",
        "role_id": 1,
        "password_status": "permanent",
        "requiresPasswordChange": false
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
}
```

### Step 3: Create School (Super Admin Only)
```http
POST http://localhost:2000/api/super-admin/school
Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "school_name": "Test School",
    "address": "123 Test Street",
    "phone": "+1234567890",
    "email": "info@testschool.com"
}
```

### Step 4: Register Admin User (Super Admin Only)
```http
POST http://localhost:2000/api/auth/register-user
Authorization: Bearer {accessToken}
Content-Type: application/json

{
    "full_name": "Test Admin",
    "email": "admin@testschool.com",
    "role": "admin",
    "school_id": "UUID_FROM_STEP_3"
}
```

### Step 5: Admin Login
```http
POST http://localhost:2000/api/auth/login
Content-Type: application/json

{
    "email": "admin@testschool.com",
    "password": "temporary123"
}
```

### Step 6: Register Teacher (Admin Only)
```http
POST http://localhost:2000/api/auth/register-user
Authorization: Bearer {admin_accessToken}
Content-Type: application/json

{
    "full_name": "Test Teacher",
    "email": "teacher@testschool.com",
    "role": "teacher",
    "subject": "Mathematics"
}
```

### Step 7: Teacher Login & Operations
```http
POST http://localhost:2000/api/auth/login
Content-Type: application/json

{
    "email": "teacher@testschool.com",
    "password": "temporary123"
}
```

### Step 8: Create Assignment (Teacher Only)
```http
POST http://localhost:2000/api/assignment
Authorization: Bearer {teacher_accessToken}
Content-Type: application/json

{
    "title": "Math Assignment 1",
    "description": "Complete exercises 1-20",
    "due_date": "2024-12-25T23:59:59Z",
    "class_id": "CLASS_UUID",
    "subject_id": "SUBJECT_UUID"
}
```

## Important Notes

1. **Default Password**: New users get temporary password "temporary123"
2. **Token Management**: Save accessToken and refreshToken for each role
3. **Role-Based Access**: Each endpoint requires specific role authentication
4. **UUIDs**: Replace placeholder UUIDs with actual values from previous responses

## Postman Collection Setup

1. Create new collection in Postman
2. Set collection variables:
   - `baseUrl`: `http://localhost:2000/api`
   - `superAdminEmail`: Your super admin email
   - `superAdminPassword`: Your super admin password
3. Add authorization scripts to automatically set Bearer token
4. Create folders for each user role
5. Add requests in sequence as shown above

## Testing Checklist

- [ ] Server health check passes
- [ ] Super admin can login
- [ ] Super admin can create school
- [ ] Super admin can register admin user
- [ ] Admin can login with temporary password
- [ ] Admin can register teacher
- [ ] Teacher can login
- [ ] Teacher can create assignments
- [ ] Teacher can mark attendance
- [ ] Register and test student operations
- [ ] Register and test parent operations

## Common Issues

1. **CORS Errors**: Ensure backend allows your origin
2. **Database Connection**: Check DATABASE_URL in .env
3. **Missing Super Admin**: Run bootstrap script if super admin doesn't exist
4. **Token Expiration**: Use refresh token endpoint to get new tokens
