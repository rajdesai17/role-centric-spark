# Store Rating App

A comprehensive full-stack web application for store ratings with role-based access control (RBAC). Users can rate stores, store owners can view their ratings, and administrators can manage the entire platform.

## 🎯 Project Overview

Store Rating App is a modern web application built with React, TypeScript, and Express.js that enables:
- **Normal Users**: Browse stores, search, and submit ratings (1-5 stars)
- **Store Owners**: View ratings received and analytics for their stores
- **System Administrators**: Manage users, stores, and view platform analytics

## ✅ Features

### User Roles & Permissions
- ✅ **System Administrator**: Full CRUD operations for users and stores
- ✅ **Normal User**: Registration, store browsing, rating submission
- ✅ **Store Owner**: Dashboard with ratings analytics

### Core Functionalities
- ✅ **Authentication**: JWT-based login system for all user types
- ✅ **User Registration**: Normal users can sign up with validation
- ✅ **Store Management**: Add, view, and manage stores
- ✅ **Rating System**: 1-5 star ratings with modification capability
- ✅ **Search & Filtering**: Store search by name/address, admin filters
- ✅ **Dashboard Analytics**: Real-time statistics and data visualization

### Form Validations
- ✅ **Name**: 20-60 characters
- ✅ **Email**: Standard email validation
- ✅ **Password**: 8-16 characters, uppercase + special character
- ✅ **Address**: Max 400 characters
- ✅ **Rating**: 1-5 integer validation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Prisma** ORM for database operations
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (running locally or remotely)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd role-centric-spark
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Configuration**

   Create `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8002/api
   ```

   Create `backend/.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=8002
   NODE_ENV=development
   BCRYPT_ROUNDS=12
   FRONTEND_URL=http://localhost:3000
   ```

   **Important**: Replace `username`, `password`, and `store_rating_db` with your actual PostgreSQL credentials and database name.

4. **Database Setup**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the application**
   
   **Option 1: Using separate terminals**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend development server (in a new terminal)
   npm run dev
   ```

   **Option 2: Using PowerShell (Windows)**
   ```powershell
   # Start backend server
   cd backend
   npm run dev
   
   # In a new PowerShell window, start frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8002

## 📁 Project Structure

```
role-centric-spark/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # UI components (shadcn/ui)
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── user/          # User pages
│   │   └── store-owner/   # Store owner pages
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── prisma/            # Database schema and migrations
└── public/                # Static assets
```

## 🔐 Authentication & Authorization

### User Roles
1. **System Administrator**: Manage all users and stores, view platform analytics
2. **Normal User**: Register, login, browse stores, submit ratings
3. **Store Owner**: View store analytics and ratings dashboard

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based route protection
- Input validation and sanitization
- Rate limiting on API endpoints

## 🎨 UI/UX Features

- Clean, minimalist interface
- Responsive design for all devices
- Intuitive navigation with sidebar
- Real-time search and filtering
- Loading states and error handling
- Toast notifications for user feedback

## 📊 Database Schema

### Core Tables
- **Users**: Authentication and user management
- **Stores**: Store information and ownership
- **Ratings**: User ratings with constraints (one rating per user per store)

### Key Relationships
- Users can have multiple stores (as store owners)
- Users can rate multiple stores
- Each user can only rate a store once (unique constraint)

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npx prisma migrate dev  # Run database migrations
npx prisma generate     # Generate Prisma client
npx prisma studio       # Open Prisma Studio (database GUI)
```

## 🚀 Deployment

### Frontend
```bash
npm run build
```

### Backend
```bash
cd backend
npm run build
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in backend/.env
   - Verify database credentials

2. **Port Already in Use**
   - Backend: Change PORT in backend/.env
   - Frontend: Change port in vite.config.ts

3. **CORS Issues**
   - Ensure FRONTEND_URL in backend/.env matches your frontend URL
   - Check that the backend is running on the correct port

4. **Prisma Migration Issues**
   ```bash
   cd backend
   npx prisma migrate reset  # Reset database (WARNING: deletes all data)
   npx prisma migrate dev    # Run migrations
   ```

---
