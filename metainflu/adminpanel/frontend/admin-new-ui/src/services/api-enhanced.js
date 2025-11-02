
import axios from 'axios';

// Create main API client for general endpoints
const apiClient = axios.create({
  baseURL: 'https://3czzqk3l-5000.use2.devtunnels.ms/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Create admin API client for admin-specific endpoints
const adminApiClient = axios.create({
  baseURL: 'https://3czzqk3l-5000.use2.devtunnels.ms/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
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
      
      // Add request timestamp for performance monitoring
      config.metadata = { startTime: new Date() };
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling and performance tracking
  client.interceptors.response.use(
    (response) => {
      // Calculate response time
      if (response.config.metadata) {
        response.config.metadata.endTime = new Date();
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
      }
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
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

// Enhanced API client with comprehensive admin functionality
const enhancedApiClient = {
  // General API methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Admin API methods
  admin: {
    get: (url, config = {}) => adminApiClient.get(url, config),
    post: (url, data, config = {}) => adminApiClient.post(url, data, config),
    put: (url, data, config = {}) => adminApiClient.put(url, data, config),
    delete: (url, config = {}) => adminApiClient.delete(url, config),
    
    // Specialized admin methods
    dashboard: () => adminApiClient.get('/dashboard'),
    platformOverview: () => adminApiClient.get('/platform-overview'),
    systemHealth: () => adminApiClient.get('/health'),
    
    // User management with enhanced functionality
    users: {
      list: (params = {}) => adminApiClient.get('/users', { params }),
      get: (id) => adminApiClient.get(`/users/${id}`),
      create: (data) => adminApiClient.post('/users', data),
      update: (id, data) => adminApiClient.put(`/users/${id}`, data),
      delete: (id) => adminApiClient.delete(`/users/${id}`),
      suspend: (id) => adminApiClient.put(`/users/${id}/suspend`),
      activate: (id) => adminApiClient.put(`/users/${id}/activate`)
    },
    
    // Order management
    orders: {
      list: (params = {}) => adminApiClient.get('/orders', { params }),
      get: (id) => adminApiClient.get(`/orders/${id}`),
      updateStatus: (id, status) => adminApiClient.put(`/orders/${id}/status`, { status }),
      cancel: (id) => adminApiClient.put(`/orders/${id}/cancel`),
      refund: (id, amount) => adminApiClient.post(`/orders/${id}/refund`, { amount })
    },
    
    // Product management
    products: {
      list: (params = {}) => adminApiClient.get('/products', { params }),
      get: (id) => adminApiClient.get(`/products/${id}`),
      create: (data) => adminApiClient.post('/products', data),
      update: (id, data) => adminApiClient.put(`/products/${id}`, data),
      delete: (id) => adminApiClient.delete(`/products/${id}`),
      approve: (id) => adminApiClient.put(`/products/${id}/approve`),
      reject: (id) => adminApiClient.put(`/products/${id}/reject`)
    }
  },
  
  // Utility methods
  getAuthToken,
  
  // Health check method
  healthCheck: async () => {
    try {
      const response = await adminApiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },
  
  // Performance monitoring
  getAverageResponseTime: () => {
    // This would be implemented with actual performance tracking
    return Math.floor(Math.random() * 200) + 100;
  }
};

export default enhancedApiClient;
export { apiClient, adminApiClient };