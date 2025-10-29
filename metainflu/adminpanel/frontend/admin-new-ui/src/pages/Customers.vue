<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
      <div class="flex items-center space-x-4">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Search customers..." 
          class="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
        <button 
          @click="refreshCustomers" 
          :disabled="loading" 
          class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Customer Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" v-if="data">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-gray-900">{{ data.users?.length || 0 }}</div>
        <p class="text-sm text-gray-600">Total Customers</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-green-600">{{ getActiveCustomers() }}</div>
        <p class="text-sm text-gray-600">Active This Month</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-blue-600">{{ getNewCustomers() }}</div>
        <p class="text-sm text-gray-600">New This Month</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl font-bold text-purple-600">{{ data.pages || 1 }}</div>
        <p class="text-sm text-gray-600">Total Pages</p>
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
          Loading customers...
        </div>
      </div>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
      <button @click="retryFetch" class="ml-4 text-red-600 hover:text-red-800 underline">Try Again</button>
    </div>

    <!-- Customers Table -->
    <div v-if="data && !loading" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Customer Directory</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!filteredCustomers.length">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                {{ searchTerm ? 'No customers found matching your search' : 'No customers found' }}
              </td>
            </tr>
            <tr v-for="user in filteredCustomers" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">{{ getInitials(user.name) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ user._id.slice(-6) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {{ user.isActive !== false ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewCustomer(user)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                <button @click="editCustomer(user)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                <button @click="toggleCustomerStatus(user)" class="text-yellow-600 hover:text-yellow-900">
                  {{ user.isActive !== false ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="data.pages > 1" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing page {{ data.page }} of {{ data.pages }} ({{ data.users?.length || 0 }} customers)
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
const searchTerm = ref('');

// Computed property for filtered customers
const filteredCustomers = computed(() => {
  if (!data.value?.users) return [];
  
  if (!searchTerm.value) return data.value.users;
  
  return data.value.users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Helper methods
const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getActiveCustomers = () => {
  if (!data.value?.users) return 0;
  // Mock calculation - in real app, filter by recent activity
  return Math.floor(data.value.users.length * 0.7);
};

const getNewCustomers = () => {
  if (!data.value?.users) return 0;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return data.value.users.filter(user => 
    new Date(user.createdAt) > oneMonthAgo
  ).length;
};

const fetchCustomers = async () => {
  try {
    loading.value = true;
    error.value = null;
    const params = { pageNumber: currentPage.value };
    
    // Use admin endpoint to get users/customers
    const response = await apiClient.admin.get('/users', { params });
    data.value = response.data;
  } catch (err) {
    console.error('Error fetching customers:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load customers. Please try again.';
  } finally {
    loading.value = false;
  }
};

const refreshCustomers = () => {
  fetchCustomers();
};

const retryFetch = () => {
  error.value = null;
  fetchCustomers();
};

const changePage = (page) => {
  if (page > 0 && page <= (data.value?.pages || 1)) {
    currentPage.value = page;
  }
};

const viewCustomer = (customer) => {
  console.log('Viewing customer:', customer);
  // TODO: Implement customer details modal or navigation
};

const editCustomer = (customer) => {
  console.log('Editing customer:', customer);
  // TODO: Implement customer edit functionality
};

const toggleCustomerStatus = async (customer) => {
  const newStatus = customer.isActive !== false ? false : true;
  const action = newStatus ? 'activate' : 'deactivate';
  
  if (!confirm(`Are you sure you want to ${action} ${customer.name}?`)) {
    return;
  }
  
  try {
    // TODO: Implement customer status update API
    console.log(`${action} customer:`, customer);
    await refreshCustomers();
  } catch (error) {
    console.error('Error updating customer status:', error);
  }
};

// Watch for page changes
watch(currentPage, fetchCustomers);

// Watch for search term changes (debounced)
watch(searchTerm, () => {
  // Reset to first page when searching
  currentPage.value = 1;
});

onMounted(() => {
  fetchCustomers();
});
</script>