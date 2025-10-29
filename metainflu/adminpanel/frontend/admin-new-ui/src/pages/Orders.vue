<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center text-gray-500"><p>Loading orders...</p></div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Orders Table -->
    <div v-if="data" class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in data.orders" :key="order._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order._id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.user ? order.user.name : 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ (order.totalPrice || 0).toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ order.status }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <a href="#" class="text-indigo-600 hover:text-indigo-900">View</a>
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
const currentPage = ref(1);

const fetchOrders = async () => {
  try {
    loading.value = true;
    const params = { pageNumber: currentPage.value };
    const response = await apiClient.get('/orders', { params });
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

watch(currentPage, fetchOrders);

onMounted(() => {
  fetchOrders();
});
</script>
