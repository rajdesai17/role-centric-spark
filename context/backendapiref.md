# Claude Code Backend Development Prompt

## Task Overview
Build a complete Express.js + TypeScript backend API for a Store Rating Application with PostgreSQL database. The frontend is already implemented and requires specific API endpoints to function properly.

## Project Setup Requirements
```bash
# Initialize the project structure
npm init -y
npm install express cors helmet morgan bcryptjs jsonwebtoken dotenv
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/node typescript ts-node nodemon
npm install prisma @prisma/client
npm install express-validator express-rate-limit
```

## Database Schema (PostgreSQL + Prisma)
Create the following Prisma schema with proper relationships:

### Users Table
- id: UUID (Primary Key)
- name: String (20-60 chars)
- email: String (Unique)
- password: String (Hashed)
- address: String (Optional, max 400 chars)
- role: Enum (SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER)
- createdAt, updatedAt: DateTime

### Stores Table
- id: UUID (Primary Key)
- name: String
- email: String
- address: String
- ownerId: UUID (Foreign Key to Users)
- createdAt, updatedAt: DateTime

### Ratings Table
- id: UUID (Primary Key)
- userId: UUID (Foreign Key to Users)
- storeId: UUID (Foreign Key to Stores)
- rating: Integer (1-5)
- createdAt, updatedAt: DateTime
- Unique constraint: (userId, storeId)

## Required API Endpoints

### Authentication Routes
```typescript
POST /api/auth/login
- Body: { email, password }
- Returns: { user: UserData, token: string }
- Validates credentials and returns JWT

POST /api/auth/register
- Body: { name, email, password, address }
- Creates NORMAL_USER only
- Returns: { user: UserData, token: string }

PUT /api/auth/change-password
- Headers: Authorization: Bearer <token>
- Body: { currentPassword, newPassword }
- Returns: { message: "Password updated successfully" }
```

### System Admin Routes (Protected)
```typescript
GET /api/admin/dashboard
- Returns: { totalUsers: number, totalStores: number, totalRatings: number }

GET /api/admin/users?search=&role=&sortBy=&sortOrder=
- Query params for filtering and sorting
- Returns: { users: UserData[], total: number }

POST /api/admin/users
- Body: { name, email, password, address, role }
- Creates any user type including admins
- Returns: { user: UserData }

GET /api/admin/users/:id
- Returns: { user: UserData, storeRating?: number }

GET /api/admin/stores?search=&sortBy=&sortOrder=
- Returns: { stores: StoreDataWithRating[], total: number }

POST /api/admin/stores
- Body: { name, email, address, ownerId }
- Returns: { store: StoreData }
```

### Normal User Routes (Protected)
```typescript
GET /api/stores?search=
- Search by name and address
- Returns: { stores: StoreWithUserRating[] }

POST /api/ratings
- Body: { storeId, rating }
- Creates new rating
- Returns: { rating: RatingData }

PUT /api/ratings/:id
- Body: { rating }
- Updates existing rating
- Returns: { rating: RatingData }

GET /api/user/profile
- Returns: { user: UserData }
```

### Store Owner Routes (Protected)
```typescript
GET /api/store-owner/dashboard
- Returns: { averageRating: number, totalReviews: number, trend: string }

GET /api/store-owner/ratings
- Returns: { ratings: RatingWithUserData[] }
```

## Authentication & Authorization
- Implement JWT-based authentication
- Create middleware for role-based access control
- Password hashing with bcryptjs (minimum 10 rounds)
- Rate limiting on auth endpoints

## Validation Requirements
Implement express-validator for:
- Name: 20-60 characters
- Email: Valid email format
- Password: 8-16 chars, 1 uppercase, 1 special character
- Address: Max 400 characters
- Rating: Integer 1-5

## Error Handling
- Global error handler middleware
- Consistent error response format
- Proper HTTP status codes
- Validation error formatting

## Security Features
- CORS configuration for frontend (localhost:3000)
- Helmet for security headers
- Input sanitization
- SQL injection prevention (Prisma handles this)
- Rate limiting (auth: 5 requests/15min, others: 100/15min)

## Database Operations
- Proper error handling for database operations
- Transaction support for complex operations
- Efficient queries with proper joins
- Pagination for list endpoints

## Environment Configuration
```env
DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
BCRYPT_ROUNDS=12
```

## Specific Implementation Notes

1. **Rating Calculation**: Calculate average ratings dynamically with aggregation queries
2. **Search Functionality**: Use ILIKE for case-insensitive search on name and address
3. **Sorting**: Support ascending/descending sort on name, email, createdAt
4. **User Data Response**: Never return password in API responses
5. **Store Owner Assignment**: Automatically assign store ownership when creating stores
6. **Demo Data**: Create seed script with sample users, stores, and ratings

## Testing Data Requirements
Create seed data matching the frontend:
- System Admin: admin@test.com / AdminPass123!
- Normal User: user@test.com / UserPass123!
- Store Owner: owner@test.com / OwnerPass123!
- 3+ stores with various ratings
- Multiple ratings distributed across stores

## Project Structure
```
src/
├── controllers/
├── middleware/
├── routes/
├── utils/
├── types/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── app.ts
└── server.ts
```

## Success Criteria
- All frontend demo buttons work correctly
- Authentication flows properly
- Role-based access functions
- Search and filtering work
- Rating system operates correctly
- Admin dashboard displays accurate statistics
- Store owner analytics function properly

Start by setting up the project structure, then implement authentication, followed by the API endpoints in order of complexity.