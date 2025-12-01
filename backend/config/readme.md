DebterLink Backend

DebterLink is a modern,digitalschool management system designed specifically for ethiopian schools.the platform helps schools streamline attendance,student performance tracking,communication and reporting in a simple,efficient, and secure way.DebterLink works for primary schools,highschools,colleges, and academics of all sizes.

This README provides instructions for setup, environment configuration, running the server,app, and testing APIs.

Table of Contents

Features

Tech Stack

Prerequisites

Setup

Environment Variables

Running the App

API Endpoints

Testing

Contributing

License

Features

Prerequisites

Node.js v24+

PostgreSQL (Neon recommended)

Redis (optional, for token caching)

npm (Node package manager)

Setup

Clone the repository:

git clone https://github.com/<your-username>/debterlink.git
cd debterlink

Install dependencies:

npm install

Create a .env file in the root directory. See Environment Variables below.

Environment Variables

Your .env file should contain:

PORT=2000
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
REDIS_URL=redis://localhost:6379

# JWT

JWT_ACCESS_SECRET=<your-access-token-secret>
JWT_REFRESH_SECRET=<your-refresh-token-secret>
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Password reset

RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=no-reply@debterlink.com
FRONTEND_URL=https://your-frontend-url.com
RESET_TOKEN_EXPIRY_MINUTES=15

Never commit secrets to Git.

Running the App

Start the development server using nodemon:

nodemon app.js

The server will run on http://localhost:2000 (or the port specified in .env).

API Endpoints

Authentication

Method Endpoint Description
POST /api/auth/register Register a new user
POST /api/auth/login Login user and generate tokens
POST /api/auth/logout Logout user
POST /api/auth/refresh Refresh JWT tokens
POST /api/auth/forgot-password Request password reset
POST /api/auth/reset-password Reset password with token

Roles & Other Resources

/api/admin

/api/teacher

/api/student

/api/parent

Routes are protected using JWT middleware. Role-based access control is enforced.

Testing

Use Postman or Insomnia to test endpoints:

Set headers:

Content-Type: application/json

Test registration:

POST /api/auth/register

Test login, logout, password reset, and refresh token flows.

Contributing

Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Commit changes (git commit -m "Add feature...").

Push to branch (git push origin feature/your-feature).

Create a pull request.

License

This project is licensed under MIT License.
