# Store Rating Application - Development Context

## Project Overview
Full-stack web application for store ratings with role-based access control (RBAC).

## Tech Stack
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL
- **Frontend**: React.js with TypeScript
- **Authentication**: JWT-based
- **ORM**: Prisma (recommended) or TypeORM

## Database Schema

### Users Table
```sql
users (
  id: UUID PRIMARY KEY,
  name: VARCHAR(60) NOT NULL,
  email: VARCHAR(255) UNIQUE NOT NULL,
  password: VARCHAR(255) NOT NULL, -- hashed
  address: VARCHAR(400),
  role: ENUM('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

### Stores Table
```sql
stores (
  id: UUID PRIMARY KEY,
  name: VARCHAR(255) NOT NULL,
  email: VARCHAR(255) NOT NULL,
  address: VARCHAR(400) NOT NULL,
  owner_id: UUID REFERENCES users(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

### Ratings Table
```sql
ratings (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  store_id: UUID REFERENCES stores(id),
  rating: INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  UNIQUE(user_id, store_id) -- One rating per user per store
)
```

## User Roles & Permissions

### System Administrator
- **CRUD Operations**: Users, Stores, Admin users
- **Dashboard**: View total counts (users, stores, ratings)
- **Listings**: All users and stores with filters
- **Filters**: Name, Email, Address, Role
- **User Details**: View complete profile + store rating (if store owner)

### Normal User
- **Account**: Sign up, login, password update
- **Store Browsing**: View all stores, search by name/address
- **Rating System**: Submit/modify ratings (1-5)
- **Store Display**: Name, Address, Overall Rating, User's Rating, Rating Actions

### Store Owner
- **Account**: Login, password update
- **Dashboard**: View ratings received, average rating
- **Analytics**: List of users who rated their store

## Form Validations

### Frontend & Backend Validation Rules
```typescript
const validationRules = {
  name: {
    minLength: 20,
    maxLength: 60,
    required: true
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true
  },
  password: {
    minLength: 8,
    maxLength: 16,
    pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
    required: true
  },
  address: {
    maxLength: 400
  },
  rating: {
    min: 1,
    max: 5,
    type: 'integer'
  }
}
```

## API Endpoints Structure

### Authentication Routes
- `POST /api/auth/register` - Normal user registration
- `POST /api/auth/login` - All user types login
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/change-password` - Update password

### System Admin Routes
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List all users (with filters)
- `POST /api/admin/users` - Create user
- `GET /api/admin/users/:id` - User details
- `GET /api/admin/stores` - List all stores (with filters)
- `POST /api/admin/stores` - Create store

### Normal User Routes
- `GET /api/stores` - List stores (with search)
- `POST /api/ratings` - Submit rating
- `PUT /api/ratings/:id` - Update rating
- `GET /api/user/profile` - Get user profile

### Store Owner Routes
- `GET /api/store-owner/dashboard` - Store ratings dashboard
- `GET /api/store-owner/ratings` - Ratings received

## Frontend Component Structure

### Shared Components
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── Forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── PasswordChangeForm.tsx
│   ├── Tables/
│   │   ├── DataTable.tsx (with sorting)
│   │   ├── UserTable.tsx
│   │   └── StoreTable.tsx
│   └── Common/
│       ├── StarRating.tsx
│       ├── SearchBar.tsx
│       └── FilterPanel.tsx
```

### Page Components
```
├── pages/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Admin/
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   └── StoreManagement.tsx
│   ├── User/
│   │   ├── StoreList.tsx
│   │   └── Profile.tsx
│   └── StoreOwner/
│       └── Dashboard.tsx
```

## Key Features Implementation

### Authentication & Authorization
- JWT tokens for session management
- Role-based route protection
- Middleware for API endpoint protection

### Rating System
- One rating per user per store constraint
- Real-time average calculation
- Rating modification capability

### Search & Filtering
- Store search by name and address
- Admin filters by name, email, address, role
- Debounced search inputs

### Data Tables
- Sortable columns (ascending/descending)
- Pagination for large datasets
- Responsive design

### Form Handling
- Real-time validation
- Error state management
- Success feedback

## Technical Requirements

### Backend Best Practices
- Input validation and sanitization
- Error handling middleware
- Logging system
- Database connection pooling
- Environment configuration
- Password hashing (bcrypt)
- Rate limiting
- CORS configuration

### Frontend Best Practices
- TypeScript strict mode
- Component composition
- Custom hooks for API calls
- Error boundaries
- Loading states
- Responsive design
- Accessibility (ARIA labels)

### Database Best Practices
- Proper indexing
- Foreign key constraints
- Data validation at DB level
- Migration scripts
- Connection pooling

## Environment Variables
```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/store_rating
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
```

## Development Setup
1. Initialize PostgreSQL database
2. Set up backend with Express.js + TypeScript
3. Configure Prisma/TypeORM with database
4. Implement authentication system
5. Create API endpoints with validation
6. Set up React frontend with TypeScript
7. Implement routing and role-based access
8. Create responsive UI components
9. Integrate frontend with backend APIs
10. Add comprehensive error handling

## Testing Considerations
- Unit tests for validation functions
- Integration tests for API endpoints
- Component testing for React components
- E2E tests for critical user flows