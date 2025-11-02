import axios from 'axios';

// Create admin-specific API client
const adminApiClient = axios.create({
  baseURL: 'https://3czzqk3l-5000.use2.devtunnels.ms/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
adminApiClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API service methods
const adminApi = {
  // Health & System
  health: () => adminApiClient.get('/health'),
  dashboard: () => adminApiClient.get('/dashboard'),
  platformOverview: () => adminApiClient.get('/platform-overview'),

  // User Management
  users: {
    getAll: (params = {}) => adminApiClient.get('/users', { params }),
    getById: (id) => adminApiClient.get(`/users/${id}`),
    create: (userData) => adminApiClient.post('/users', userData),
    update: (id, userData) => adminApiClient.put(`/users/${id}`, userData),
    delete: (id) => adminApiClient.delete(`/users/${id}`),
    updateStatus: (id, status) => adminApiClient.put(`/users/${id}/status`, { status }),
  },

  // Order Management
  orders: {
    getAll: (params = {}) => adminApiClient.get('/orders', { params }),
    getById: (id) => adminApiClient.get(`/orders/${id}`),
    updateStatus: (id, status) => adminApiClient.put(`/orders/${id}/status`, { status }),
    cancel: (id) => adminApiClient.put(`/orders/${id}/cancel`),
    refund: (id, amount) => adminApiClient.post(`/orders/${id}/refund`, { amount }),
  },

  // Product Management
  products: {
    getAll: (params = {}) => adminApiClient.get('/products', { params }),
    getById: (id) => adminApiClient.get(`/products/${id}`),
    create: (productData) => adminApiClient.post('/products', productData),
    update: (id, productData) => adminApiClient.put(`/products/${id}`, productData),
    delete: (id) => adminApiClient.delete(`/products/${id}`),
    approve: (id) => adminApiClient.put(`/products/${id}/approve`),
    reject: (id) => adminApiClient.put(`/products/${id}/reject`),
  },

  // Category Management
  categories: {
    parentCategories: {
      getAll: () => adminApiClient.get('/parent-categories'),
      getById: (id) => adminApiClient.get(`/parent-categories/${id}`),
      create: (data) => adminApiClient.post('/parent-categories', data),
      update: (id, data) => adminApiClient.put(`/parent-categories/${id}`, data),
      delete: (id) => adminApiClient.delete(`/parent-categories/${id}`),
    },
    categories: {
      getAll: () => adminApiClient.get('/categories-direct'),
      getById: (id) => adminApiClient.get(`/categories-direct/${id}`),
      create: (data) => adminApiClient.post('/categories-direct', data),
      update: (id, data) => adminApiClient.put(`/categories-direct/${id}`, data),
      delete: (id) => adminApiClient.delete(`/categories-direct/${id}`),
    },
    subCategories: {
      getAll: () => adminApiClient.get('/subcategories'),
      getById: (id) => adminApiClient.get(`/subcategories/${id}`),
      create: (data) => adminApiClient.post('/subcategories', data),
      update: (id, data) => adminApiClient.put(`/subcategories/${id}`, data),
      delete: (id) => adminApiClient.delete(`/subcategories/${id}`),
    },
    pending: () => adminApiClient.get('/categories/pending'),
    approve: (id) => adminApiClient.put(`/categories/${id}/approve`),
    reject: (id) => adminApiClient.delete(`/categories/${id}`),
  },

  // Content Management
  content: {
    heroBanners: {
      getAll: () => adminApiClient.get('/content/herobanners'),
      create: (data) => adminApiClient.post('/content/herobanners', data),
      update: (id, data) => adminApiClient.put(`/content/herobanners/${id}`, data),
      delete: (id) => adminApiClient.delete(`/content/herobanners/${id}`),
    },
    featuredCollections: {
      getAll: () => adminApiClient.get('/content/featuredcollections'),
      create: (data) => adminApiClient.post('/content/featuredcollections', data),
      update: (id, data) => adminApiClient.put(`/content/featuredcollections/${id}`, data),
      delete: (id) => adminApiClient.delete(`/content/featuredcollections/${id}`),
    },
  },
};

export default adminApi;