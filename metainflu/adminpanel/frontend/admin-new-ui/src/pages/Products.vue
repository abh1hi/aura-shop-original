<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Products</h1>
      <div class="flex items-center space-x-4">
        <select v-model="approvalFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">All Products</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending Approval</option>
          <option value="rejected">Rejected</option>
        </select>
        <router-link to="/product/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Product
        </router-link>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input 
        type="text" 
        v-model="searchKeyword" 
        placeholder="Search products..." 
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        @click="refreshProducts" 
        :disabled="loading" 
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <!-- Product Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" v-if="data">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-gray-900">{{ data.products?.length || 0 }}</div>
        <p class="text-sm text-gray-600">Total Products</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-green-600">{{ getApprovedProducts() }}</div>
        <p class="text-sm text-gray-600">Approved</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-yellow-600">{{ getPendingProducts() }}</div>
        <p class="text-sm text-gray-600">Pending</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-red-600">{{ getLowStockProducts() }}</div>
        <p class="text-sm text-gray-600">Low Stock</p>
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="bg-white rounded-lg shadow-md p-8">
      <div class="text-center text-gray-500">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading products...
        </div>
      </div>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
      <button @click="retryFetch" class="ml-4 text-red-600 hover:text-red-800 underline">Try Again</button>
    </div>

    <!-- Products Table -->
    <div v-if="data && !loading" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Product Inventory</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!filteredProducts.length">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                {{ searchKeyword || approvalFilter ? 'No products found matching your criteria' : 'No products found' }}
              </td>
            </tr>
            <tr v-for="product in filteredProducts" :key="product._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-gray-500 text-xs">IMG</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500">{{ product.category?.name || 'No category' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.brand || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="product.variants && product.variants.length > 0">
                  ${{ getMinPrice(product.variants) }} - ${{ getMaxPrice(product.variants) }}
                </div>
                <div v-else>N/A</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div v-if="product.variants && product.variants.length > 0">
                  {{ getTotalStock(product.variants) }} units
                </div>
                <div v-else>N/A</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getApprovalStatusClass(product.isApproved)" class="px-2 py-1 text-xs rounded-full">
                  {{ getApprovalStatus(product.isApproved) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(product.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link :to="`/product/edit/${product._id}`" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</router-link>
                <button @click="toggleApproval(product)" class="text-blue-600 hover:text-blue-900 mr-4">
                  {{ product.isApproved ? 'Reject' : 'Approve' }}
                </button>
                <button @click="deleteProduct(product._id)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data.pages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing page {{ data.page }} of {{ data.pages }} ({{ data.products?.length || 0 }} products)
        </div>
        <div class="flex space-x-2">
          <button 
            @click="changePage(data.page - 1)" 
            :disabled="data.page === 1" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="changePage(data.page + 1)" 
            :disabled="data.page === data.pages" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import apiClient from '../services/api';

const data = ref(null);
const loading = ref(true);
const error = ref(null);
const searchKeyword = ref('');
const approvalFilter = ref('');
const currentPage = ref(1);

// Computed property for filtered products
const filteredProducts = computed(() => {
  if (!data.value?.products) return [];
  
  let filtered = data.value.products;
  
  // Filter by approval status
  if (approvalFilter.value === 'approved') {
    filtered = filtered.filter(product => product.isApproved === true);
  } else if (approvalFilter.value === 'pending') {
    filtered = filtered.filter(product => product.isApproved === false || product.isApproved === undefined);
  } else if (approvalFilter.value === 'rejected') {
    filtered = filtered.filter(product => product.isApproved === false);
  }
  
  return filtered;
});

// Helper methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getMinPrice = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return Math.min(...variants.map(v => v.price || 0));
};

const getMaxPrice = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return Math.max(...variants.map(v => v.price || 0));
};

const getTotalStock = (variants) => {
  if (!variants || variants.length === 0) return 0;
  return variants.reduce((total, variant) => total + (variant.inventory || variant.stock || 0), 0);
};

const getApprovalStatus = (isApproved) => {
  if (isApproved === true) return 'Approved';
  if (isApproved === false) return 'Rejected';
  return 'Pending';
};

const getApprovalStatusClass = (isApproved) => {
  if (isApproved === true) return 'bg-green-100 text-green-800';
  if (isApproved === false) return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const getApprovedProducts = () => {
  if (!data.value?.products) return 0;
  return data.value.products.filter(product => product.isApproved === true).length;
};

const getPendingProducts = () => {
  if (!data.value?.products) return 0;
  return data.value.products.filter(product => product.isApproved !== true).length;
};

const getLowStockProducts = () => {
  if (!data.value?.products) return 0;
  return data.value.products.filter(product => {
    if (!product.variants || product.variants.length === 0) return false;
    const totalStock = getTotalStock(product.variants);
    return totalStock <= 10 && totalStock > 0;
  }).length;
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    const params = {
      pageNumber: currentPage.value,
      keyword: searchKeyword.value,
    };
    
    // Use admin endpoint to get products with full access
    const response = await apiClient.admin.get('/products', { params });
    data.value = response.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load products. Please try again.';
  } finally {
    loading.value = false;
  }
};

const refreshProducts = () => {
  fetchProducts();
};

const retryFetch = () => {
  error.value = null;
  fetchProducts();
};

const changePage = (page) => {
  if (page > 0 && page <= (data.value?.pages || 1)) {
    currentPage.value = page;
  }
};

const toggleApproval = async (product) => {
  const action = product.isApproved ? 'reject' : 'approve';
  const actionText = product.isApproved ? 'reject' : 'approve';
  
  if (!confirm(`Are you sure you want to ${actionText} "${product.name}"?`)) {
    return;
  }
  
  try {
    if (product.isApproved) {
      await apiClient.admin.put(`/products/${product._id}/reject`);
    } else {
      await apiClient.admin.put(`/products/${product._id}/approve`);
    }
    
    await refreshProducts();
  } catch (error) {
    console.error('Error updating product approval:', error);
    alert('Failed to update product status. Please try again.');
  }
};

const deleteProduct = async (id) => {
  const product = data.value.products.find(p => p._id === id);
  if (!confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    // Use admin endpoint for product deletion
    await apiClient.admin.delete(`/products/${id}`);
    await refreshProducts(); // Refresh the list
  } catch (err) {
    console.error('Error deleting product:', err);
    error.value = err.response?.data?.message || 'Failed to delete product.';
  }
};

// Watch for changes in searchKeyword and fetch products
watch(searchKeyword, () => {
  currentPage.value = 1; // Reset to first page on new search
  fetchProducts();
});

// Watch for approval filter changes
watch(approvalFilter, () => {
  currentPage.value = 1; // Reset to first page on filter change
});

// Watch for changes in currentPage and fetch products
watch(currentPage, fetchProducts);

// Initial fetch
onMounted(() => {
  fetchProducts();
});
</script>