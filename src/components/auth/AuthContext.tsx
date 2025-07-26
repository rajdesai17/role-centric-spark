import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('authToken');
        
        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
      // Set loading to false immediately after initialization
      setIsLoading(false);
    };

    // Use setTimeout to ensure this runs after the initial render
    const timer = setTimeout(initializeAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiService.login(email, password);
      if (response.data) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        return { success: true };
      } else {
        console.error('Login failed:', response.error);
        
        // Handle rate limiting specifically
        if (response.error?.includes('Too many authentication attempts') || response.error?.includes('429')) {
          return { 
            success: false, 
            error: 'Too many login attempts. Please wait a few minutes before trying again.' 
          };
        }
        
        return { 
          success: false, 
          error: response.error || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('Too many requests')) {
          return { 
            success: false, 
            error: 'Too many login attempts. Please wait a few minutes before trying again.' 
          };
        }
        return { 
          success: false, 
          error: error.message || 'Network error. Please check your connection.' 
        };
      }
      
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const signup = async (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      if (response.data) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        return true;
      } else {
        console.error('Signup failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword);
      if (response.data) {
        return true;
      } else {
        console.error('Password update failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};