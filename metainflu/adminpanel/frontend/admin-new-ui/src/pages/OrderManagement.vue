<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
          <p class="text-sm text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <div class="flex items-center space-x-4">
          <select v-model="statusFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Search orders..." 
            class="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Order Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-gray-900">{{ orderStats.total }}</div>
          <p class="text-sm text-gray-600">Total Orders</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-yellow-600">{{ orderStats.pending }}</div>
          <p class="text-sm text-gray-600">Pending</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-blue-600">{{ orderStats.processing }}</div>
          <p class="text-sm text-gray-600">Processing</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ orderStats.delivered }}</div>
          <p class="text-sm text-gray-600">Delivered</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-red-600">{{ orderStats.cancelled }}</div>
          <p class="text-sm text-gray-600">Cancelled</p>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
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
              <tr v-if="loading" class="text-center">
                <td colspan="7" class="px-6 py-8">
                  <div class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading orders...
                  </div>
                </td>
              </tr>
              <tr v-else-if="!filteredOrders.length" class="text-center">
                <td colspan="7" class="px-6 py-8 text-gray-500">No orders found</td>
              </tr>
              <tr v-for="order in filteredOrders" :key="order._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ order._id.slice(-6) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ order.user?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ order.orderItems?.length || 0 }} items
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ order.totalPrice || order.total }}
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiClient from '../services/api';

// Reactive data
const orders = ref([]);
const loading = ref(false);
const searchTerm = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalOrders = ref(0);
const totalPages = ref(0);

const orderStats = ref({
  total: 0,
  pending: 0,
  processing: 0,
  delivered: 0,
  cancelled: 0
});

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  if (searchTerm.value) {
    filtered = filtered.filter(order => 
      order._id?.includes(searchTerm.value) ||
      order.user?.name?.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value);
  }
  
  return filtered;
});

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
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

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await apiClient.admin.get('/orders');
    orders.value = response.data.orders || response.data;
    
    // Calculate order stats
    orderStats.value = {
      total: orders.value.length,
      pending: orders.value.filter(o => o.status === 'pending').length,
      processing: orders.value.filter(o => o.status === 'processing').length,
      delivered: orders.value.filter(o => o.status === 'delivered').length,
      cancelled: orders.value.filter(o => o.status === 'cancelled').length
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

const viewOrder = (order) => {
  console.log('Viewing order:', order);
  // Implement order details view
};

const updateOrderStatus = async (order, newStatus) => {
  try {
    await apiClient.admin.put(`/orders/${order._id}/status`, { status: newStatus });
    order.status = newStatus;
    
    // Update stats
    await fetchOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchOrders();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchOrders();
  }
};

// Lifecycle
onMounted(() => {
  fetchOrders();
});
</script>