<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center text-gray-500">
      <p>Loading dashboard...</p>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Dashboard Content -->
    <div v-if="stats && !loading">
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-sm font-medium text-gray-500">Total Revenue</h3><p class="mt-2 text-3xl font-semibold text-gray-900">${{ (stats.totalRevenue || 0).toFixed(2) }}</p></div>
        <div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-sm font-medium text-gray-500">Total Orders</h3><p class="mt-2 text-3xl font-semibold text-gray-900">{{ stats.totalOrders }}</p></div>
        <div class="bg-white p-6 rounded-lg shadow-md"><h3 class="text-sm font-medium text-gray-500">Total Customers</h3><p class="mt-2 text-3xl font-semibold text-gray-900">{{ stats.totalCustomers }}</p></div>
      </div>

      <!-- Tables Section -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Orders Table -->
        <div class="bg-white rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 p-6">Recent Orders</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in stats.recentOrders" :key="order._id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.user ? order.user.name : 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ (order.totalPrice || 0).toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap"><span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">{{ order.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Selling Products Table -->
        <div class="bg-white rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 p-6">Top-Selling Products</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th></tr></thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in stats.topSellingProducts" :key="product._id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.totalQuantitySold }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/dashboard');
    stats.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
