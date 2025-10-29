<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="text-sm text-gray-600 mt-1">Complete platform overview and analytics</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div :class="['w-3 h-3 rounded-full', isOnline ? 'bg-green-500' : 'bg-red-500']"></div>
            <span class="text-sm text-gray-600">{{ isOnline ? 'Online' : 'Offline' }}</span>
          </div>
          <button @click="refreshData" :disabled="loading" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Key Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Revenue Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-3xl font-bold text-gray-900">${{ formatNumber(dashboardData.summary?.totalRevenue || 0) }}</p>
              <p class="text-sm mt-2" :class="getGrowthClass(dashboardData.summary?.revenueGrowth)">
                <span>{{ formatGrowth(dashboardData.summary?.revenueGrowth) }} from last month</span>
              </p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Orders Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.summary?.totalOrders || 0) }}</p>
              <p class="text-sm mt-2" :class="getGrowthClass(dashboardData.summary?.orderGrowth)">
                <span>{{ formatGrowth(dashboardData.summary?.orderGrowth) }} from last month</span>
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Customers Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Customers</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.summary?.totalCustomers || 0) }}</p>
              <p class="text-sm mt-2" :class="getGrowthClass(dashboardData.summary?.customerGrowth)">
                <span>{{ formatGrowth(dashboardData.summary?.customerGrowth) }} from last month</span>
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Products Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Products</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatNumber(dashboardData.summary?.totalProducts || 0) }}</p>
              <p class="text-sm mt-2 text-gray-500">
                <span>{{ dashboardData.summary?.pendingProducts || 0 }} pending approval</span>
              </p>
            </div>
            <div class="p-3 bg-orange-100 rounded-full">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Conversion Rate</p>
              <p class="text-xl font-bold text-gray-900">{{ dashboardData.summary?.conversionRate || 0 }}%</p>
            </div>
            <div class="text-2xl text-indigo-600">📊</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Avg Order Value</p>
              <p class="text-xl font-bold text-gray-900">${{ dashboardData.summary?.averageOrderValue || 0 }}</p>
            </div>
            <div class="text-2xl text-green-600">💰</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Active Carts</p>
              <p class="text-xl font-bold text-gray-900">{{ dashboardData.summary?.activeCarts || 0 }}</p>
            </div>
            <div class="text-2xl text-yellow-600">🛒</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pending Orders</p>
              <p class="text-xl font-bold text-gray-900">{{ dashboardData.summary?.pendingOrders || 0 }}</p>
            </div>
            <div class="text-2xl text-red-600">⏳</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend (30 Days)</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <div class="text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p class="text-gray-500">Revenue Chart</p>
              <p class="text-sm text-gray-400">Chart implementation placeholder</p>
            </div>
          </div>
        </div>

        <!-- Order Status Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Completed</span>
              <span class="text-sm font-medium text-green-600">{{ dashboardData.summary?.completedOrders || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Pending</span>
              <span class="text-sm font-medium text-yellow-600">{{ dashboardData.summary?.pendingOrders || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Processing</span>
              <span class="text-sm font-medium text-blue-600">{{ dashboardData.summary?.monthlyOrders || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="!dashboardData.recentOrders?.length">
                  <td colspan="4" class="px-6 py-4 text-center text-gray-500">No recent orders</td>
                </tr>
                <tr v-for="order in dashboardData.recentOrders?.slice(0, 5)" :key="order._id">
                  <td class="px-6 py-4 text-sm text-gray-900">#{{ order._id.slice(-6) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ order.user?.name || 'N/A' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">${{ order.totalPrice }}</td>
                  <td class="px-6 py-4">
                    <span :class="getStatusBadgeClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                      {{ order.status || 'pending' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Top Selling Products</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-if="!dashboardData.topSellingProducts?.length" class="text-center text-gray-500 py-8">
                No product sales data available
              </div>
              <div v-for="product in dashboardData.topSellingProducts?.slice(0, 5)" :key="product._id" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span class="text-gray-500 text-xs">IMG</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">{{ product.totalQuantitySold }} sold</p>
                  </div>
                </div>
                <span class="text-sm font-medium text-gray-900">${{ product.totalRevenue }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Overview -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Platform Overview</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.summary?.totalUsers || 0 }}</p>
              <p class="text-sm text-gray-600">Total Users</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.summary?.totalCategories || 0 }}</p>
              <p class="text-sm text-gray-600">Categories</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.summary?.approvedProducts || 0 }}</p>
              <p class="text-sm text-gray-600">Live Products</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.summary?.activeUsersLast30Days || 0 }}</p>
              <p class="text-sm text-gray-600">Active Users</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.summary?.abandonedCarts || 0 }}</p>
              <p class="text-sm text-gray-600">Abandoned Carts</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.summary?.lowStockProducts || 0 }}</p>
              <p class="text-sm text-gray-600">Low Stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import apiClient from '../services/api';

// Reactive data
const dashboardData = ref({});
const loading = ref(false);
const isOnline = ref(true);
let refreshInterval = null;

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

const formatGrowth = (growth) => {
  if (!growth) return '0%';
  const sign = growth > 0 ? '+' : '';
  return `${sign}${growth}%`;
};

const getGrowthClass = (growth) => {
  if (!growth) return 'text-gray-500';
  return growth > 0 ? 'text-green-600' : 'text-red-600';
};

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    const response = await apiClient.admin.get('/dashboard');
    dashboardData.value = response.data;
    isOnline.value = true;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    isOnline.value = false;
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  fetchDashboardData();
};

// Lifecycle
onMounted(() => {
  fetchDashboardData();
  // Set up auto-refresh every 5 minutes
  refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>