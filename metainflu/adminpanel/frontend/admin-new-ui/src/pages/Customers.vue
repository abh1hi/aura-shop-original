<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center text-gray-500"><p>Loading customers...</p></div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Customers Table -->
    <div v-if="data" class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in data.users" :key="user._id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
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

const fetchCustomers = async () => {
  try {
    loading.value = true;
    const params = { pageNumber: currentPage.value };
    const response = await apiClient.get('/users', { params });
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

watch(currentPage, fetchCustomers);

onMounted(() => {
  fetchCustomers();
});
</script>
