const API_BASE_URL = 'http://localhost:8002/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.error || `HTTP error! status: ${response.status}`,
      };
    }
    
    const data = await response.json().catch(() => ({}));
    return { data };
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    address?: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    address?: string;
    role: 'SYSTEM_ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
  }): Promise<ApiResponse<{ user: any }>> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async createStore(storeData: {
    name: string;
    email: string;
    address: string;
    ownerId: string;
  }): Promise<ApiResponse<{ store: any }>> {
    const response = await fetch(`${API_BASE_URL}/admin/stores`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(storeData),
    });
    return this.handleResponse(response);
  }

  async getUsers(search?: string, role?: string): Promise<ApiResponse<{ users: any[]; total: number }>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getStores(search?: string): Promise<ApiResponse<{ stores: any[]; total: number }>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/admin/stores?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getDashboard(): Promise<ApiResponse<{ totalUsers: number; totalStores: number; totalRatings: number }>> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getUserStores(search?: string): Promise<ApiResponse<{ stores: any[] }>> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/stores?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createRating(ratingData: {
    storeId: string;
    rating: number;
  }): Promise<ApiResponse<{ rating: any }>> {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ratingData),
    });
    return this.handleResponse(response);
  }

  async updateRating(ratingId: string, rating: number): Promise<ApiResponse<{ rating: any }>> {
    const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rating }),
    });
    return this.handleResponse(response);
  }

  async getUserProfile(): Promise<ApiResponse<{ user: any }>> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getUserRating(storeId: string): Promise<ApiResponse<{ rating: any }>> {
    const response = await fetch(`${API_BASE_URL}/ratings/${storeId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Store Owner endpoints
  async getStoreOwnerDashboard(): Promise<ApiResponse<{ ratings: any[]; avgRating: number }>> {
    const response = await fetch(`${API_BASE_URL}/store-owner/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getStoreOwnerRatings(): Promise<ApiResponse<{ ratings: any[] }>> {
    const response = await fetch(`${API_BASE_URL}/store-owner/ratings`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(); 