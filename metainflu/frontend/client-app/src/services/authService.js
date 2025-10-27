
import { apiClient } from '../config/api';

const register = async (userData) => {
  const data = await apiClient.post('/auth/register', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }));
  }
  return data;
};

const login = async (userData) => {
  const data = await apiClient.post('/auth/login', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }));
  }
  return data;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export default {
  register,
  login,
  logout,
};

