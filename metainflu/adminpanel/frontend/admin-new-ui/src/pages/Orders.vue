<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
      <div class="flex items-center space-x-4">
        <select v-model="statusFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button 
          @click="refreshOrders" 
          :disabled="loading" 
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Order Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" v-if="data">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-gray-900">{{ data.orders?.length || 0 }}</div>
        <p class="text-sm text-gray-600">Total Orders</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-yellow-600">{{ getPendingOrders() }}</div>
        <p class="text-sm text-gray-600">Pending</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-green-600">{{ getCompletedOrders() }}</div>
        <p class="text-sm text-gray-600">Completed</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-blue-600">{{ calculateTotalRevenue() }}</div>
        <p class="text-sm text-gray-600">Total Revenue</p>
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
          Loading orders...
        </div>
      </div>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
      <button @click="retryFetch" class="ml-4 text-red-600 hover:text-red-800 underline">Try Again</button>
    </div>

    <!-- Orders Table -->
    <div v-if="data && !loading" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Order Management</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!filteredOrders.length">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                {{ statusFilter ? `No ${statusFilter} orders found` : 'No orders found' }}
              </td>
            </tr>
            <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ order._id.slice(-8) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.user?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.orderItems?.length || 0 }} items
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ (order.totalPrice || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ order.status || 'pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewOrder(order)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                <select 
                  :value="order.status" 
                  @change="updateOrderStatus(order, $event.target.value)" 
                  class="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data.pages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing page {{ data.page }} of {{ data.pages }} ({{ data.orders?.length || 0 }} orders)
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
const currentPage = ref(1);
const statusFilter = ref('');

// Computed property for filtered orders
const filteredOrders = computed(() => {
  if (!data.value?.orders) return [];
  
  if (!statusFilter.value) return data.value.orders;
  
  return data.value.orders.filter(order => order.status === statusFilter.value);
});

// Helper methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPendingOrders = () => {
  if (!data.value?.orders) return 0;
  return data.value.orders.filter(order => order.status === 'pending').length;
};

const getCompletedOrders = () => {
  if (!data.value?.orders) return 0;
  return data.value.orders.filter(order => order.status === 'delivered').length;
};

const calculateTotalRevenue = () => {
  if (!data.value?.orders) return '$0';
  const total = data.value.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  return '$' + total.toFixed(2);
};

const fetchOrders = async () => {
  try {
    loading.value = true;
    error.value = null;
    const params = { pageNumber: currentPage.value };
    
    // Use admin endpoint to get orders
    const response = await apiClient.admin.get('/orders', { params });
    data.value = response.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load orders. Please try again.';
  } finally {
    loading.value = false;
  }
};

const refreshOrders = () => {
  fetchOrders();
};

const retryFetch = () => {
  error.value = null;
  fetchOrders();
};

const changePage = (page) => {
  if (page > 0 && page <= (data.value?.pages || 1)) {
    currentPage.value = page;
  }
};

const viewOrder = (order) => {
  console.log('Viewing order:', order);
  // TODO: Implement order details view
};

const updateOrderStatus = async (order, newStatus) => {
  try {
    await apiClient.admin.put(`/orders/${order._id}/status`, { status: newStatus });
    order.status = newStatus;
    await refreshOrders(); // Refresh the list
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('Failed to update order status. Please try again.');
  }
};

// Watch for page and filter changes
watch([currentPage, statusFilter], fetchOrders);

onMounted(() => {
  fetchOrders();
});
</script>