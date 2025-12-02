const API_BASE_URL = 'https://api-wedding.fanz8ap.workers.dev/api';

export const api = {
  baseURL: API_BASE_URL,
  
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('admin_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text || 'Request failed' };
        }
      }
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Admin endpoints
  async getGuests() {
    return this.request('/admin/guests');
  },

  async getInvitations() {
    return this.request('/admin/invitations');
  },

  async getGuest(id) {
    return this.request(`/admin/guests/${id}`);
  },

  async updateGuest(id, data) {
    return this.request(`/admin/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteGuest(id) {
    return this.request(`/admin/guests/${id}`, {
      method: 'DELETE',
    });
  },

  async getRSVPs() {
    return this.request('/admin/confirmations');
  },

  async getRSVP(id) {
    return this.request(`/admin/confirmations/${id}`);
  },

  async updateRSVP(id, data) {
    return this.request(`/admin/confirmations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getStats() {
    return this.request('/admin/stats');
  },
};

export default api;

