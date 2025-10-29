<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Products</h1>
      <router-link to="/product/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Product
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input 
        type="text" 
        v-model="searchKeyword" 
        placeholder="Search products..." 
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center text-gray-500"><p>Loading products...</p></div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Products Table -->
    <div v-if="data" class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in data.products" :key="product._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.brand }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ product.variants && product.variants.length > 0 ? product.variants[0].price : 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.variants && product.variants.length > 0 ? product.variants[0].stock : 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link :to="`/product/edit/${product._id}`" class="text-indigo-600 hover:text-indigo-900">Edit</router-link>
              <button @click="deleteProduct(product._id)" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="data.pages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <button @click="changePage(data.page - 1)" :disabled="data.page === 1" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Previous</button>
        <span>Page {{ data.page }} of {{ data.pages }}</span>
        <button @click="changePage(data.page + 1)" :disabled="data.page === data.pages" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiClient from '../services/api';

const data = ref(null);
const loading = ref(true);
const error = ref(null);
const searchKeyword = ref('');
const currentPage = ref(1);

const fetchProducts = async () => {
  try {
    loading.value = true;
    const params = {
      pageNumber: currentPage.value,
      keyword: searchKeyword.value,
    };
    const response = await apiClient.get('/products', { params });
    data.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page > 0 && page <= data.value.pages) {
    currentPage.value = page;
  }
};

// Watch for changes in searchKeyword and fetch products
watch(searchKeyword, () => {
  currentPage.value = 1; // Reset to first page on new search
  fetchProducts();
});

// Watch for changes in currentPage and fetch products
watch(currentPage, fetchProducts);

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      // Use the public product route for deletion
      await apiClient.delete(`/../products/${id}`);
      fetchProducts(); // Refresh the list
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete product.';
    }
  }
};

// Initial fetch
onMounted(() => {
  fetchProducts();
});
</script>
