<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-sm text-gray-600 mt-1">Manage customers, vendors, and admin accounts</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Search users..." 
              class="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
            <svg class="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <select v-model="roleFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="">All Roles</option>
            <option value="user">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- User Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-gray-900">{{ userStats.total }}</div>
          <p class="text-sm text-gray-600">Total Users</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-blue-600">{{ userStats.customers }}</div>
          <p class="text-sm text-gray-600">Customers</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-purple-600">{{ userStats.vendors }}</div>
          <p class="text-sm text-gray-600">Vendors</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl font-bold text-green-600">{{ userStats.admins }}</div>
          <p class="text-sm text-gray-600">Admins</p>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">User Directory</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="text-center">
                <td colspan="6" class="px-6 py-8">
                  <div class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading users...
                  </div>
                </td>
              </tr>
              <tr v-else-if="!filteredUsers.length" class="text-center">
                <td colspan="6" class="px-6 py-8 text-gray-500">No users found</td>
              </tr>
              <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">{{ getInitials(user.name) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadgeClass(user.role)" class="px-2 py-1 text-xs rounded-full">
                    {{ user.role || 'user' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.lastLoginAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="viewUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                  <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} users
            </div>
            <div class="flex space-x-2">
              <button 
                @click="previousPage" 
                :disabled="currentPage <= 1" 
                class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages" 
                class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiClient from '../services/api';

// Reactive data
const users = ref([]);
const loading = ref(false);
const searchTerm = ref('');
const roleFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalUsers = ref(0);
const totalPages = ref(0);

const userStats = ref({
  total: 0,
  customers: 0,
  vendors: 0,
  admins: 0
});

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value;
  
  if (searchTerm.value) {
    filtered = filtered.filter(user => 
      user.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value);
  }
  
  return filtered;
});

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800';
    case 'vendor': return 'bg-purple-100 text-purple-800';
    default: return 'bg-blue-100 text-blue-800';
  }
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await apiClient.admin.get(`/users?page=${currentPage.value}&pageSize=${pageSize.value}`);
    users.value = response.data.users || response.data;
    totalUsers.value = response.data.total || users.value.length;
    totalPages.value = Math.ceil(totalUsers.value / pageSize.value);
    
    // Calculate user stats
    userStats.value = {
      total: users.value.length,
      customers: users.value.filter(u => u.role === 'user' || !u.role).length,
      vendors: users.value.filter(u => u.role === 'vendor').length,
      admins: users.value.filter(u => u.role === 'admin').length
    };
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

const viewUser = (user) => {
  console.log('Viewing user:', user);
  // Implement user view modal or navigation
};

const editUser = (user) => {
  console.log('Editing user:', user);
  // Implement user edit functionality
};

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) return;
  
  try {
    await apiClient.admin.delete(`/users/${user._id}`);
    await fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchUsers();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchUsers();
  }
};

// Watch for filter changes
watch([searchTerm, roleFilter], () => {
  // Reset to first page when filters change
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  fetchUsers();
});
</script>