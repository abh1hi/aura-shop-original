import api from './apiClient';

const getBrands = () => api.get('/vendor/brands');
const getBrand = (id) => api.get(`/vendor/brands/${id}`);
const createBrand = (data) => api.post('/vendor/brands', data);
const updateBrand = (id, data) => api.put(`/vendor/brands/${id}`, data);
const deleteBrand = (id) => api.delete(`/vendor/brands/${id}`);

export default { getBrands, getBrand, createBrand, updateBrand, deleteBrand };
