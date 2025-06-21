# Role-Based Authentication System

A full-stack web application implementing dynamic role-based authentication and authorization using the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Project Overview

This system provides secure user authentication with three distinct roles: Admin, Editor, and Viewer. Each role has specific permissions and access levels managed dynamically through the database.

## Features

- User registration and login with JWT authentication
- Password hashing using bcrypt
- Three role system: Admin, Editor, Viewer
- Dynamic role assignment via admin interface
- Route protection on both frontend and backend
- Responsive dashboard with role-based UI
- Automatic creation of default test users

## Technology Stack

**Backend:**

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- CORS enabled

**Frontend:**

- Angular (standalone components)
- Angular Router with guards
- HTTP interceptors for token management
- Responsive design

## Installation Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Angular CLI

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/roleauth
JWT_SECRET=my_super_secret_jwt_key_here_keeping_it_long_and_random_because_why_not
JWT_EXPIRES_IN=7d
```

4. Start the backend server:

```bash
npm run dev
```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

The frontend will run on http://localhost:4200

## Default Test Users

The system automatically creates three test users with different roles:

**Admin User:**

- Email: sarah.johnson@roleauth.com
- Password: SecurePass123!
- Role: Admin (Full access to user management, role assignment)

**Editor User:**

- Email: michael.chen@roleauth.com
- Password: EditPass456!
- Role: Editor (Create, read, update permissions)

**Viewer User:**

- Email: emma.rodriguez@roleauth.com
- Password: ViewPass789!
- Role: Viewer (Read-only access)

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/currentUser` - Get current user info

### User Management Routes (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/deactivate` - Deactivate user

### Role Management Routes

- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create new role (Admin only)
- `PUT /api/roles/:id` - Update role (Admin only)
- `DELETE /api/roles/:id` - Delete role (Admin only)

## Application Structure

### Backend Architecture

```
backend/
├── controllers/         # Business logic
├── models/             # Database schemas
├── routes/             # API routes
├── middleware/         # Authentication & authorization
└── server.js          # Entry point
```

### Frontend Architecture

```
frontend/src/app/
├── components/         # UI components
├── services/          # Business services
├── guards/            # Route guards
├── interceptors/      # HTTP interceptors
└── app.component.ts   # Root component
```

## Role Permissions

**Admin:**

- Full system access
- User management
- Role assignment
- Create, read, update, delete operations

**Editor:**

- Create, read, update content
- Cannot delete or manage users
- Limited administrative access

**Viewer:**

- Read-only access
- View content only
- No modification permissions

## Security Features

- JWT-based authentication
- Password hashing with bcrypt (salt rounds: 12)
- Route protection middleware
- Angular route guards
- HTTP interceptors for token management
- Role-based access control

## Usage

1. Access the application at http://localhost:4200
2. Use any of the test user credentials to log in
3. Admin users can manage other users and assign roles through the dashboard
4. Different UI elements are shown based on user roles
5. Unauthorized access attempts are automatically redirected

## Development Notes

- The application uses Angular standalone components (no NgModules)
- MongoDB connection includes automatic role and user initialization
- JWT tokens expire after 7 days (configurable)
- CORS is enabled for cross-origin requests
- All passwords are hashed before storage

## Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error:** Ensure MongoDB is running and the connection string in `.env` is correct
2. **JWT Token Issues:** Check that JWT_SECRET is set in the environment variables
3. **Port Conflicts:** Ensure ports 4200 and 5000 are available
4. **CORS Errors:** Verify the backend CORS configuration allows requests from the frontend URL
