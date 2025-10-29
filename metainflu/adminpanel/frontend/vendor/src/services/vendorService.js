/* Add brand to product creation payload formatting */
// Set the base URL for the backend API
const API_BASE_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/';

const getToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) throw new Error('Vendor not authenticated. Please log in.');
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
};

const handleResponse = async (response) => {
  let errorData; try { errorData = await response.json(); } catch { errorData = { message: `HTTP ${response.status}: ${response.statusText}` }; }
  if (!response.ok) {
    switch (response.status) {
      case 422: {
        let msg = 'Validation failed';
        if (errorData.message) msg = errorData.message;
        else if (errorData.errors) {
          if (Array.isArray(errorData.errors)) msg = `Validation failed: ${errorData.errors.map(e => e.message || e).join(', ')}`;
          else if (typeof errorData.errors === 'object') msg = `Validation failed: ${Object.entries(errorData.errors).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join(', ')}`;
        }
        if (/brand is required/i.test(msg)) throw new Error('Brand is required');
        throw new Error(msg);
      }
      case 401: throw new Error('Authentication failed. Please log in again.');
      case 403: throw new Error('Access denied. You do not have permission for this action.');
      case 404: throw new Error('Resource not found.');
      case 500: throw new Error('Server error. Please try again later.');
      default: throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
  }
  return errorData;
};

const getVendorDashboardStats = async (params) => {
  let url = API_BASE_URL + 'vendor/dashboard/stats';
  if (params) url += `?${new URLSearchParams(params).toString()}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
};

const getDashboardStats = async (params) => {
  const data = await getVendorDashboardStats(params);
  return { ...data, inProgressTasks: 3, completedTasks: 7, upcomingTasks: [{ id: 1, name: 'Update product images', date: '2024-01-15', status: 'In Progress' }, { id: 2, name: 'Review customer feedback', date: '2024-01-16', status: 'Pending' }, { id: 3, name: 'Process refund requests', date: '2024-01-17', status: 'Completed' }] };
};

const getVendorProducts = async () => {
  const res = await fetch(API_BASE_URL + 'vendor/products', { headers: getAuthHeaders() });
  return handleResponse(res);
};

const createProduct = async (productData) => {
  const formatted = {
    name: productData.name?.trim(),
    description: productData.description?.trim(),
    brand: productData.brand || undefined,
    variants: (productData.variants || []).map(v => ({ sku: v.sku?.trim() || `${productData.name?.replace(/\s+/g,'-').toLowerCase()}-${Date.now()}`, price: parseFloat(v.price) || 0, stock: parseInt(v.stock) || 0, attributes: v.attributes || [], status: v.status || 'active' })),
    categories: productData.categories || (productData.category ? [productData.category] : []),
    images: (productData.images || []).filter(img => img.url?.trim()).map((img, i) => ({ url: img.url.trim(), altText: img.altText || '', position: i, isPrimary: i === 0 })),
    tags: productData.tags || [],
    currency: 'INR', isApproved: false, lifecycleStatus: 'active', moderationStatus: 'pending'
  };
  const res = await fetch(API_BASE_URL + 'products', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(formatted) });
  return handleResponse(res);
};

const updateProduct = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}products/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};

const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  await handleResponse(res); return { message: 'Product deleted successfully' };
};

const getVendorOrders = async () => {
  const res = await fetch(API_BASE_URL + 'vendor/orders', { headers: getAuthHeaders() });
  return handleResponse(res);
};

const markOrderShipped = async (orderId, productId) => {
  const res = await fetch(`${API_BASE_URL}vendor/orders/${orderId}/ship`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ productId }) });
  return handleResponse(res);
};

export default { getVendorDashboardStats, getDashboardStats, getVendorProducts, createProduct, updateProduct, deleteProduct, getVendorOrders, markOrderShipped }
