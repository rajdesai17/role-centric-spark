# Store Rating Application - Backend API

A complete Express.js + TypeScript backend API for a Store Rating Application with PostgreSQL database and role-based access control.

## Features

- **Authentication & Authorization**: JWT-based with role-based access control
- **User Roles**: System Admin, Normal User, Store Owner
- **Security**: Helmet, CORS, Rate limiting, Input validation
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Express-validator with comprehensive rules
- **Error Handling**: Global error handler with proper HTTP status codes

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Database Setup

1. Install and start PostgreSQL
2. Create a database named `store_rating_db`
3. Update the `.env` file with your database credentials

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy and update the .env file with your database URL
cp .env.example .env
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push database schema:
```bash
npm run db:push
```

5. Seed the database with demo data:
```bash
npm run db:seed
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
BCRYPT_ROUNDS=12
```

## Demo Accounts

The seed script creates these demo accounts for testing:

- **Admin**: admin@test.com / AdminPass123!
- **User**: user@test.com / UserPass123!
- **Store Owner**: owner@test.com / OwnerPass123!

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Normal users only)
- `PUT /api/auth/change-password` - Change password (authenticated)

### Admin Routes (System Admin only)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List users with filtering/sorting
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/stores` - List stores with filtering/sorting
- `POST /api/admin/stores` - Create new store

### User Routes (Authenticated)
- `GET /api/stores` - List all stores with search
- `POST /api/ratings` - Submit store rating
- `PUT /api/ratings/:id` - Update existing rating
- `GET /api/user/profile` - Get user profile

### Store Owner Routes (Store Owner only)
- `GET /api/store-owner/dashboard` - Store analytics dashboard
- `GET /api/store-owner/ratings` - View ratings received

## Database Schema

### Users Table
- id (UUID, Primary Key)
- name (String, 20-60 chars)
- email (String, Unique)
- password (String, Hashed)
- address (String, Optional, max 400 chars)
- role (Enum: SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER)
- createdAt, updatedAt (DateTime)

### Stores Table
- id (UUID, Primary Key)
- name (String)
- email (String)
- address (String)
- ownerId (UUID, Foreign Key to Users)
- createdAt, updatedAt (DateTime)

### Ratings Table
- id (UUID, Primary Key)
- userId (UUID, Foreign Key to Users)
- storeId (UUID, Foreign Key to Stores)
- rating (Integer, 1-5)
- createdAt, updatedAt (DateTime)
- Unique constraint: (userId, storeId)

## Validation Rules

- **Name**: 20-60 characters
- **Email**: Valid email format
- **Password**: 8-16 chars, 1 uppercase, 1 special character
- **Address**: Max 400 characters
- **Rating**: Integer 1-5

## Security Features

- JWT authentication with 24-hour expiration
- Password hashing with bcrypt (12 rounds)
- Rate limiting (auth: 5 req/15min, general: 100 req/15min)
- CORS configuration for frontend
- Helmet for security headers
- Input validation and sanitization

## Error Handling

- Global error handler with consistent response format
- Proper HTTP status codes
- Development vs production error details
- Validation error formatting

## Testing

The backend includes comprehensive seed data for testing:
- 4 users (1 admin, 1 normal user, 2 store owners)
- 3 stores with realistic ratings
- Multiple ratings distributed across stores
- Statistics matching frontend expectations

## Health Check

Check if the server is running:
```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Scripts

- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data