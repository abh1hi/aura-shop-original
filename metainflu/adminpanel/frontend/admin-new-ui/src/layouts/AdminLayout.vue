<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0">
        <h1 class="text-xl font-semibold text-gray-800">Aura Shop</h1>
      </div>
      
      <div class="flex flex-col justify-between flex-1">
        <nav class="mt-4">
          <router-link to="/dashboard" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Dashboard</span></router-link>
          <router-link to="/products" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Products</span></router-link>
          <router-link to="/orders" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Orders</span></router-link>
          <router-link to="/customers" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Customers</span></router-link>
          <router-link to="/content" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Content</span></router-link>
          <router-link to="/analytics" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Analytics</span></router-link>
          <router-link to="/promotions" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50"><span>Promotions</span></router-link>
        </nav>

        <!-- Footer with Logout and Status -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-600">API Status:</span>
            <div :class="['w-3 h-3 rounded-full', isApiConnected ? 'bg-green-500' : 'bg-red-500']" :title="isApiConnected ? 'Connected' : 'Disconnected'"></div>
          </div>
          <button @click="logout" class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { isApiConnected } from '../store/status';
import apiClient from '../services/api';

const router = useRouter();
let healthCheckInterval = null;

const logout = () => {
  localStorage.removeItem('userInfo');
  router.push('/login');
};

const checkApiHealth = async () => {
  try {
    await apiClient.get('/health');
    isApiConnected.value = true;
  } catch (error) {
    isApiConnected.value = false;
  }
};

onMounted(() => {
  checkApiHealth(); // Initial check
  healthCheckInterval = setInterval(checkApiHealth, 30000); // Check every 30 seconds
});

onUnmounted(() => {
  clearInterval(healthCheckInterval); // Clean up interval
});
</script>

<style>
.router-link-exact-active {
  background-color: #f0f2f5;
  color: #007aff;
  font-weight: 500;
}
</style>