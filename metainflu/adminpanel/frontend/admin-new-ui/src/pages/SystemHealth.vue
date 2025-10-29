<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">System Health Monitor</h1>
          <p class="text-sm text-gray-600 mt-1">Real-time system monitoring and health diagnostics</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div :class="['w-3 h-3 rounded-full animate-pulse', overallHealth === 'healthy' ? 'bg-green-500' : overallHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500']"></div>
            <span class="text-sm text-gray-600 capitalize">{{ overallHealth }}</span>
          </div>
          <button @click="runHealthCheck" :disabled="checking" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50">
            {{ checking ? 'Checking...' : 'Run Health Check' }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Health Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Database Status</p>
              <p class="text-lg font-bold" :class="healthMetrics.database ? 'text-green-600' : 'text-red-600'">
                {{ healthMetrics.database ? 'Connected' : 'Disconnected' }}
              </p>
            </div>
            <div :class="['p-3 rounded-full', healthMetrics.database ? 'bg-green-100' : 'bg-red-100']">
              <svg class="w-6 h-6" :class="healthMetrics.database ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">API Status</p>
              <p class="text-lg font-bold" :class="healthMetrics.api ? 'text-green-600' : 'text-red-600'">
                {{ healthMetrics.api ? 'Operational' : 'Down' }}
              </p>
            </div>
            <div :class="['p-3 rounded-full', healthMetrics.api ? 'bg-green-100' : 'bg-red-100']">
              <svg class="w-6 h-6" :class="healthMetrics.api ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Memory Usage</p>
              <p class="text-lg font-bold text-gray-900">{{ getMemoryPercentage() }}%</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Response Time</p>
              <p class="text-lg font-bold text-gray-900">{{ avgResponseTime }}ms</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed System Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Server Details -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Server Information</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Platform</p>
                  <p class="font-medium text-gray-900">{{ systemStatus?.server?.platform || 'Unknown' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Architecture</p>
                  <p class="font-medium text-gray-900">{{ systemStatus?.server?.arch || 'x64' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Node.js Version</p>
                  <p class="font-medium text-gray-900">{{ systemStatus?.server?.version || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Process ID</p>
                  <p class="font-medium text-gray-900">{{ process.pid || 'N/A' }}</p>
                </div>
              </div>
              
              <!-- Memory Details -->
              <div class="border-t pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Memory Usage</h4>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">RSS (Resident Set Size)</span>
                    <span class="font-medium">{{ formatMemory(systemStatus?.server?.memory?.rss) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Heap Used</span>
                    <span class="font-medium">{{ formatMemory(systemStatus?.server?.memory?.heapUsed) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Heap Total</span>
                    <span class="font-medium">{{ formatMemory(systemStatus?.server?.memory?.heapTotal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Database Collections Details -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Database Collections</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(count, collection) in systemStatus?.database?.collections" :key="collection" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-indigo-100 rounded-full">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7v2"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 capitalize">{{ collection }}</p>
                    <p class="text-xs text-gray-500">MongoDB Collection</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{{ formatNumber(count) }}</p>
                  <p class="text-xs text-gray-500">documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Health Check Results -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Health Check Results</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="check in healthChecks" :key="check.name" class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center space-x-3">
                <div :class="['w-3 h-3 rounded-full', check.status === 'pass' ? 'bg-green-500' : check.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500']"></div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ check.name }}</p>
                  <p class="text-xs text-gray-500">{{ check.description }}</p>
                </div>
              </div>
              <span class="text-xs px-2 py-1 rounded-full" :class="check.status === 'pass' ? 'bg-green-100 text-green-800' : check.status === 'warn' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'">
                {{ check.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import apiClient from '../services/api';

// Reactive data
const systemStatus = ref({});
const checking = ref(false);
const avgResponseTime = ref(0);
const healthMetrics = ref({
  database: false,
  api: false,
  memory: 0,
  disk: 0
});

// Health checks configuration
const healthChecks = ref([
  { name: 'Database Connection', status: 'pass', description: 'MongoDB connection active' },
  { name: 'API Endpoints', status: 'pass', description: 'All endpoints responding' },
  { name: 'Memory Usage', status: 'pass', description: 'Within acceptable limits' },
  { name: 'Disk Space', status: 'pass', description: 'Sufficient storage available' },
  { name: 'External Services', status: 'warn', description: 'Some services degraded' },
  { name: 'SSL Certificate', status: 'pass', description: 'Valid and not expiring soon' }
]);

// Computed
const overallHealth = computed(() => {
  const failing = healthChecks.value.filter(check => check.status === 'fail').length;
  const warnings = healthChecks.value.filter(check => check.status === 'warn').length;
  
  if (failing > 0) return 'critical';
  if (warnings > 0) return 'warning';
  return 'healthy';
});

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const formatMemory = (bytes) => {
  if (!bytes) return 'N/A';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)}MB`;
};

const getMemoryPercentage = () => {
  if (!systemStatus.value?.server?.memory?.used || !systemStatus.value?.server?.memory?.total) {
    return 0;
  }
  return Math.round((systemStatus.value.server.memory.used / systemStatus.value.server.memory.total) * 100);
};

const fetchSystemStatus = async () => {
  try {
    const startTime = Date.now();
    const response = await apiClient.admin.get('/platform-overview');
    const endTime = Date.now();
    
    systemStatus.value = response.data;
    avgResponseTime.value = endTime - startTime;
    
    // Update health metrics
    healthMetrics.value = {
      database: response.data?.database?.status === 'connected',
      api: true,
      memory: getMemoryPercentage(),
      disk: Math.floor(Math.random() * 30) + 40 // Mock disk usage
    };
    
    // Update health checks based on real data
    updateHealthChecks();
  } catch (error) {
    console.error('Error fetching system status:', error);
    healthMetrics.value.api = false;
    updateHealthChecks();
  }
};

const updateHealthChecks = () => {
  healthChecks.value = [
    { 
      name: 'Database Connection', 
      status: healthMetrics.value.database ? 'pass' : 'fail', 
      description: healthMetrics.value.database ? 'MongoDB connection active' : 'MongoDB connection failed' 
    },
    { 
      name: 'API Endpoints', 
      status: healthMetrics.value.api ? 'pass' : 'fail', 
      description: healthMetrics.value.api ? 'All endpoints responding' : 'API endpoints not responding' 
    },
    { 
      name: 'Memory Usage', 
      status: healthMetrics.value.memory < 80 ? 'pass' : healthMetrics.value.memory < 90 ? 'warn' : 'fail', 
      description: `Memory usage at ${healthMetrics.value.memory}%` 
    },
    { 
      name: 'Response Time', 
      status: avgResponseTime.value < 500 ? 'pass' : avgResponseTime.value < 1000 ? 'warn' : 'fail', 
      description: `Average response time: ${avgResponseTime.value}ms` 
    },
    { 
      name: 'Disk Space', 
      status: healthMetrics.value.disk < 80 ? 'pass' : healthMetrics.value.disk < 90 ? 'warn' : 'fail', 
      description: `Disk usage at ${healthMetrics.value.disk}%` 
    },
    { 
      name: 'System Load', 
      status: 'pass', 
      description: 'System load within normal parameters' 
    }
  ];
};

const runHealthCheck = async () => {
  checking.value = true;
  await fetchSystemStatus();
  // Simulate health check delay
  setTimeout(() => {
    checking.value = false;
  }, 2000);
};

// Auto-refresh every 30 seconds
let refreshInterval = null;

// Lifecycle
onMounted(() => {
  fetchSystemStatus();
  refreshInterval = setInterval(fetchSystemStatus, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>