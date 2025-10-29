<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p class="text-sm text-gray-600 mt-1">System status, performance metrics, and platform health</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div :class="['w-3 h-3 rounded-full', systemStatus?.database?.status === 'connected' ? 'bg-green-500' : 'bg-red-500']"></div>
            <span class="text-sm text-gray-600">{{ systemStatus?.database?.status === 'connected' ? 'Database Connected' : 'Database Offline' }}</span>
          </div>
          <button @click="refreshData" :disabled="loading" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50">
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- System Health Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Server Status -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Server Status</h3>
            <div class="p-2 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l5 5L20 7"></path>
              </svg>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Uptime</span>
              <span class="text-sm font-medium text-gray-900">{{ formatUptime(systemStatus?.server?.uptime) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Platform</span>
              <span class="text-sm font-medium text-gray-900">{{ systemStatus?.server?.platform || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Node.js Version</span>
              <span class="text-sm font-medium text-gray-900">{{ systemStatus?.server?.version || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Database Health -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Database Health</h3>
            <div :class="['p-2 rounded-full', systemStatus?.database?.status === 'connected' ? 'bg-green-100' : 'bg-red-100']">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Status</span>
              <span class="text-sm font-medium text-green-600">Connected</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Collections</span>
              <span class="text-sm font-medium text-gray-900">{{ Object.keys(systemStatus?.database?.collections || {}).length }}</span>
            </div>
          </div>
        </div>

        <!-- API Health -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">API Health</h3>
            <div class="p-2 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Response Time</span>
              <span class="text-sm font-medium text-gray-900">< 200ms</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Success Rate</span>
              <span class="text-sm font-medium text-green-600">99.9%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Database Collections Overview -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Database Collections</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-for="(count, collection) in systemStatus?.database?.collections" :key="collection" class="text-center">
              <div class="text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(count) }}</div>
              <div class="text-sm text-gray-600 capitalize">{{ collection }}</div>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: getCollectionPercentage(count) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

// Reactive data
const systemStatus = ref({});
const loading = ref(false);

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const formatUptime = (uptime) => {
  if (!uptime) return 'N/A';
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const getCollectionPercentage = (count) => {
  const maxCount = Math.max(...Object.values(systemStatus.value?.database?.collections || {}));
  return maxCount > 0 ? (count / maxCount) * 100 : 0;
};

const fetchSystemStatus = async () => {
  try {
    loading.value = true;
    const response = await apiClient.admin.get('/platform-overview');
    systemStatus.value = response.data;
  } catch (error) {
    console.error('Error fetching system status:', error);
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  fetchSystemStatus();
};

// Lifecycle
onMounted(() => {
  fetchSystemStatus();
});
</script>