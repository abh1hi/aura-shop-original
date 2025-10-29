
import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/admin', // Base URL for all admin API requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    // Get user info from local storage
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
