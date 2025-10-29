
import axios from 'axios';

// Create main API client for general endpoints
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for general API requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create admin API client for admin-specific endpoints
const adminApiClient = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // Base URL for admin API requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get auth token
const getAuthToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      return token;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  }
  return null;
};

// Add request interceptor to both clients
const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both clients
addAuthInterceptor(apiClient);
addAuthInterceptor(adminApiClient);

// Enhanced API client that automatically chooses the right endpoint
const enhancedApiClient = {
  // General API methods (uses general apiClient)
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },
  post: (url, data, config = {}) => {
    return apiClient.post(url, data, config);
  },
  put: (url, data, config = {}) => {
    return apiClient.put(url, data, config);
  },
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },
  
  // Admin API methods (uses admin apiClient)
  admin: {
    get: (url, config = {}) => {
      return adminApiClient.get(url, config);
    },
    post: (url, data, config = {}) => {
      return adminApiClient.post(url, data, config);
    },
    put: (url, data, config = {}) => {
      return adminApiClient.put(url, data, config);
    },
    delete: (url, config = {}) => {
      return adminApiClient.delete(url, config);
    }
  },
  
  // Utility methods
  getAuthToken,
  
  // Health check method that tries admin endpoint
  healthCheck: async () => {
    try {
      await adminApiClient.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
};

// For backward compatibility, export the enhanced client as default
export default enhancedApiClient;

// Also export individual clients if needed
export { apiClient, adminApiClient };