import api from './apiClient';

const getMyBrand = () => {
  return api.get('/brands/my-brand');
};

const createBrand = (brandData) => {
  return api.post('/brands', brandData);
};

const updateBrand = (id, brandData) => {
  return api.put(`/brands/${id}`, brandData);
};

export default {
  getMyBrand,
  createBrand,
  updateBrand,
};

