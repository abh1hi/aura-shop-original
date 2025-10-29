<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-200 flex-shrink-0">
        <h1 class="text-xl font-semibold text-gray-800">Aura Shop Admin</h1>
      </div>
      
      <div class="flex flex-col justify-between flex-1">
        <nav class="mt-4 overflow-y-auto">
          <!-- Dashboard Section -->
          <div class="px-3 mb-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dashboard</p>
            <router-link to="/dashboard" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Main Dashboard</span>
            </router-link>
            <router-link to="/admin-dashboard" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>Advanced Dashboard</span>
            </router-link>
            <router-link to="/live-metrics" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>Live Metrics</span>
            </router-link>
          </div>

          <!-- Management Section -->
          <div class="px-3 mb-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Management</p>
            <router-link to="/products" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span>Products</span>
            </router-link>
            <router-link to="/categories" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7v2"></path>
              </svg>
              <span>Categories</span>
            </router-link>
            <router-link to="/orders" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Orders</span>
            </router-link>
            <router-link to="/order-management" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <span>Order Management</span>
            </router-link>
            <router-link to="/customers" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <span>Customers</span>
            </router-link>
            <router-link to="/user-management" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>User Management</span>
            </router-link>
            <router-link to="/content" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7v2"></path>
              </svg>
              <span>Content</span>
            </router-link>
          </div>

          <!-- Analytics Section -->
          <div class="px-3 mb-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Analytics & Reports</p>
            <router-link to="/analytics" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Basic Analytics</span>
            </router-link>
            <router-link to="/analytics-advanced" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Advanced Analytics</span>
            </router-link>
            <router-link to="/promotions" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <span>Promotions</span>
            </router-link>
          </div>

          <!-- System Section -->
          <div class="px-3 mb-4">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System & Health</p>
            <router-link to="/platform-overview" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
              <span>Platform Overview</span>
            </router-link>
            <router-link to="/system-health" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors mb-1">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>System Health</span>
            </router-link>
          </div>
        </nav>

        <!-- Footer with API Status and Logout -->
        <div class="p-4 border-t border-gray-200">
          <!-- API Status -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div :class="['w-3 h-3 rounded-full', isApiConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500']" :title="isApiConnected ? 'Connected' : 'Disconnected'"></div>
              <span class="text-sm text-gray-600">{{ isApiConnected ? 'API Connected' : 'API Offline' }}</span>
            </div>
          </div>
          
          <!-- System Info -->
          <div class="text-xs text-gray-500 mb-3">
            <div>Last updated: {{ formatTime(lastUpdated) }}</div>
            <div>Server: {{ serverStatus }}</div>
          </div>
          
          <!-- User Info -->
          <div class="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-md">
            <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ getUserInitials() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ getCurrentUserName() }}</p>
              <p class="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <!-- Logout Button -->
          <button @click="logout" class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
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
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isApiConnected } from '../store/status';
import apiClient from '../services/api';

const router = useRouter();
const lastUpdated = ref(new Date());
const serverStatus = ref('Online');
let healthCheckInterval = null;

const logout = () => {
  localStorage.removeItem('userInfo');
  router.push('/login');
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

const getCurrentUserName = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      return user.name || user.email || 'Admin';
    } catch (error) {
      return 'Admin';
    }
  }
  return 'Admin';
};

const getUserInitials = () => {
  const name = getCurrentUserName();
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const checkApiHealth = async () => {
  try {
    const isHealthy = await apiClient.healthCheck();
    isApiConnected.value = isHealthy;
    if (isHealthy) {
      lastUpdated.value = new Date();
      serverStatus.value = 'Online';
    } else {
      serverStatus.value = 'Degraded';
    }
  } catch (error) {
    isApiConnected.value = false;
    serverStatus.value = 'Offline';
  }
};

onMounted(() => {
  checkApiHealth(); // Initial check
  healthCheckInterval = setInterval(checkApiHealth, 30000); // Check every 30 seconds
});

onUnmounted(() => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval); // Clean up interval
  }
});
</script>

<style>
.router-link-exact-active {
  background-color: #e0f2fe !important;
  color: #0369a1 !important;
  font-weight: 500;
}

.router-link-exact-active svg {
  color: #0369a1;
}

/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: #f1f5f9;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>