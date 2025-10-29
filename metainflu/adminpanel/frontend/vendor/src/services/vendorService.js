/*
  File: metainflu/frontend/client/src/services/vendorService.js
  Purpose: Centralized API calls for the Vendor Panel, secured by the vendor's JWT token.
  API routes hit the backend's /api/vendor/ endpoints for protected actions, and 
  /api/products/ for product management.
*/

// Set the base URL for the backend API
const API_BASE_URL = 'https://3czzqk3l-5000.use2.devtunnels.ms/api/';

/**
 * Helper function to retrieve the vendor's token from local storage.
 * @returns {string | null} The JWT token.
 */
const getToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return JSON.parse(user).token;
  }
  return null;
};

/**
 * Helper function to create authentication headers.
 * @returns {object} Headers object.
 */
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error('Vendor not authenticated. Please log in.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Helper function to handle API responses and errors
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 */
const handleResponse = async (response) => {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
  }

  if (!response.ok) {
    console.error('API Error Response:', errorData);
    
    // Handle different HTTP status codes
    switch (response.status) {
      case 400:
        throw new Error(errorData.message || 'Bad request. Please check your input.');
      case 401:
        throw new Error('Authentication failed. Please log in again.');
      case 403:
        throw new Error('Access denied. You do not have permission for this action.');
      case 404:
        throw new Error('Resource not found.');
      case 422:
        // Handle validation errors specifically
        let validationMessage = 'Validation failed';
        
        if (errorData.message) {
          validationMessage = errorData.message;
        } else if (errorData.errors) {
          // Handle different error formats
          if (Array.isArray(errorData.errors)) {
            // Array of error objects
            const errorMessages = errorData.errors.map(err => {
              if (typeof err === 'string') return err;
              if (err.message) return err.message;
              if (err.msg) return err.msg;
              return JSON.stringify(err);
            });
            validationMessage = `Validation failed: ${errorMessages.join(', ')}`;
          } else if (typeof errorData.errors === 'object') {
            // Object with field errors
            const errorMessages = [];
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach(msg => errorMessages.push(`${field}: ${msg}`));
              } else if (typeof messages === 'string') {
                errorMessages.push(`${field}: ${messages}`);
              } else {
                errorMessages.push(`${field}: ${JSON.stringify(messages)}`);
              }
            });
            validationMessage = `Validation failed: ${errorMessages.join(', ')}`;
          } else {
            validationMessage = `Validation failed: ${JSON.stringify(errorData.errors)}`;
          }
        }
        
        throw new Error(validationMessage);
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
  }

  return errorData;
};

/**
 * Fetches vendor-specific dashboard statistics.
 * @param {object} params - Query parameters for filtering.
 * @returns {Promise<object>} Dashboard stats.
 */
const getVendorDashboardStats = async (params) => {
  try {
    let url = API_BASE_URL + 'vendor/dashboard/stats';
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('getVendorDashboardStats failed:', error);
    throw error;
  }
};

/**
 * FIXED: Add the missing getDashboardStats function that MyTasks.vue is calling
 * This is a wrapper for getVendorDashboardStats with task-specific data
 * @param {object} params - Query parameters for filtering.
 * @returns {Promise<object>} Dashboard stats with task information.
 */
const getDashboardStats = async (params) => {
  try {
    // For now, return mock task data since the backend doesn't have task endpoints yet
    // In a real implementation, you would call a tasks endpoint or extend the dashboard stats
    const dashboardData = await getVendorDashboardStats(params);
    
    // Add mock task data until backend task management is implemented
    return {
      ...dashboardData,
      inProgressTasks: 3,
      completedTasks: 7,
      upcomingTasks: [
        {
          id: 1,
          name: 'Update product images',
          date: '2024-01-15',
          status: 'In Progress'
        },
        {
          id: 2,
          name: 'Review customer feedback',
          date: '2024-01-16',
          status: 'Pending'
        },
        {
          id: 3,
          name: 'Process refund requests',
          date: '2024-01-17',
          status: 'Completed'
        }
      ]
    };
  } catch (error) {
    console.error('getDashboardStats failed:', error);
    throw error;
  }
};

/**
 * Fetches products owned by the current vendor.
 * @returns {Promise<Array>} Array of products.
 */
const getVendorProducts = async () => {
  try {
    const response = await fetch(API_BASE_URL + 'vendor/products', {
      headers: getAuthHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('getVendorProducts failed:', error);
    throw error;
  }
};

/**
 * Creates a new product with proper validation and error handling.
 * @param {object} productData - Data for the new product.
 * @returns {Promise<object>} The created product.
 */
const createProduct = async (productData) => {
  try {
    console.log('Creating product with data:', productData);
    
    // Ensure required fields are present and properly formatted
    const formattedProductData = {
      name: productData.name?.trim(),
      description: productData.description?.trim(),
      // Handle variants - ensure we always have at least one variant
      variants: productData.variants && productData.variants.length > 0 ? 
        productData.variants.map(variant => ({
          sku: variant.sku?.trim() || `${productData.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stock) || 0,
          attributes: variant.attributes || [],
          status: variant.status || 'active'
        })) : [{
          sku: `${productData.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          price: parseFloat(productData.price) || 0,
          stock: parseInt(productData.stock) || 0,
          attributes: [],
          status: 'active'
        }],
      // Handle categories
      categories: productData.categories || (productData.category ? [productData.category] : []),
      // Handle images
      images: productData.images && Array.isArray(productData.images) ? 
        productData.images.filter(img => img.url?.trim()).map((img, index) => ({
          url: img.url.trim(),
          altText: img.altText || '',
          position: index,
          isPrimary: index === 0
        })) : [],
      // Handle tags
      tags: productData.tags && Array.isArray(productData.tags) ? productData.tags : [],
      // Default values
      currency: 'INR',
      isApproved: false,
      lifecycleStatus: 'active',
      moderationStatus: 'pending'
    };

    console.log('Formatted product data:', formattedProductData);

    const response = await fetch(API_BASE_URL + 'products', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formattedProductData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('createProduct failed:', error);
    throw error;
  }
};

/**
 * Updates an existing product.
 * @param {string} productId - The ID of the product to update.
 * @param {object} productData - The updated product data.
 * @returns {Promise<object>} The updated product.
 */
const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('updateProduct failed:', error);
    throw error;
  }
};

/**
 * Deletes a product.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<object>} A success message.
 */
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    await handleResponse(response);
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error('deleteProduct failed:', error);
    throw error;
  }
};

/**
 * Fetches orders for products owned by the current vendor.
 * @returns {Promise<Array>} Array of relevant orders.
 */
const getVendorOrders = async () => {
  try {
    const response = await fetch(API_BASE_URL + 'vendor/orders', {
      headers: getAuthHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('getVendorOrders failed:', error);
    throw error;
  }
};

/**
 * Updates the status of an order to 'shipped'.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} productId - The ID of the product in the order.
 * @returns {Promise<object>} The updated order object.
 */
const markOrderShipped = async (orderId, productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}vendor/orders/${orderId}/ship`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('markOrderShipped failed:', error);
    throw error;
  }
};

export default {
  getVendorDashboardStats,
  getDashboardStats, // FIXED: Added missing function
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorOrders,
  markOrderShipped,
};