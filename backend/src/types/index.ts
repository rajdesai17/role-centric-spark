export interface UserData {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreData {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreDataWithRating extends StoreData {
  averageRating: number;
  totalRatings: number;
}

export interface StoreWithUserRating extends StoreDataWithRating {
  userRating?: number;
}

export interface RatingData {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingWithUserData extends RatingData {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthRequest extends Request {
  user?: UserData;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  address?: string;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
}

export interface CreateStoreRequest {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export interface CreateRatingRequest {
  storeId: string;
  rating: number;
}

export interface UpdateRatingRequest {
  rating: number;
}