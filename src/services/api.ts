const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data || data;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.data.user));
      return data.data;
    }
    
    throw new Error(data.message || 'Login failed');
  }

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Locations endpoints
  async getLocations(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/locations?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getLocation(id: string) {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createLocation(locationData: any) {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(locationData)
    });
    return this.handleResponse(response);
  }

  async updateLocation(id: string, locationData: any) {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(locationData)
    });
    return this.handleResponse(response);
  }

  async deleteLocation(id: string) {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async pingLocation(id: string) {
    const response = await fetch(`${API_BASE_URL}/locations/${id}/ping`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Monitoring endpoints
  async getMonitoringLogs(params?: { 
    page?: number; 
    limit?: number; 
    location_id?: string; 
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.location_id) queryParams.append('location_id', params.location_id);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);

    const response = await fetch(`${API_BASE_URL}/monitoring/logs?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getMonitoringStats(period?: string) {
    const queryParams = period ? `?period=${period}` : '';
    const response = await fetch(`${API_BASE_URL}/monitoring/stats${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Alerts endpoints
  async getAlerts(params?: { 
    page?: number; 
    limit?: number; 
    unread_only?: boolean;
    type?: string;
    location_id?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unread_only) queryParams.append('unread_only', 'true');
    if (params?.type) queryParams.append('type', params.type);
    if (params?.location_id) queryParams.append('location_id', params.location_id);

    const response = await fetch(`${API_BASE_URL}/alerts?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markAlertAsRead(id: string) {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/read`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async markAllAlertsAsRead() {
    const response = await fetch(`${API_BASE_URL}/alerts/read-all`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getUnreadAlertsCount() {
    const response = await fetch(`${API_BASE_URL}/alerts/unread-count`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Dashboard endpoint
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Manual monitoring trigger
  async triggerMonitoring() {
    const response = await fetch(`${API_BASE_URL}/monitoring/trigger`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();