import api from './apiClient';

// Get current vendor's brand (if applicable)
const getMyBrand = () => api.get('/brands/my-brand');

// List all brands (public endpoint assumed)
const getBrands = () => api.get('/brands');

// Create a brand (admin/vendor as permitted)
const createBrand = (brandData) => api.post('/brands', brandData);

// Update a brand
const updateBrand = (id, brandData) => api.put(`/brands/${id}`, brandData);

export default {
  getMyBrand,
  getBrands,
  createBrand,
  updateBrand,
};
