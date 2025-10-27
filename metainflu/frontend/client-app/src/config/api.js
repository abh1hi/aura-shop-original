/*
  File: src/config/api.js
  Purpose: Centralized API client configuration for Aura Shop.
  It reads the base URL from environment variables and provides a consistent client for all services.
*/

// The base URL for the API is now configured in your .env file (VITE_API_BASE_URL).
// For mobile/Capacitor development, create a .env.local file and set:
// VITE_API_BASE_URL=http://YOUR_COMPUTER_IP:5000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Enhanced API client with error handling
export const apiClient = {
  /**
   * Make HTTP request with proper headers and error handling.
   * @param {string} endpoint - API endpoint (e.g., '/products')
   * @param {object} options - Fetch options
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    // Add auth token if available
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not access localStorage:', e);
    }
    
    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      // Handle responses with no content
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      console.log(`API Response: ${options.method || 'GET'} ${url} - Success`);
      return data;
      
    } catch (error) {
      console.error('API request failed:', {
        url,
        error: error.message,
        options
      });
      throw error;
    }
  },
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data)
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};