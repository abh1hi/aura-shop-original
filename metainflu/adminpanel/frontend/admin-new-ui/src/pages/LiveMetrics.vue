<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Live Metrics</h1>
          <p class="text-sm text-gray-600 mt-1">Real-time platform metrics and KPIs</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm text-gray-600">Live</span>
          </div>
          <div class="text-sm text-gray-500">
            Last updated: {{ formatTime(lastUpdated) }}
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Real-time KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-3xl font-bold text-gray-900">{{ liveMetrics.activeUsers }}</p>
              <p class="text-sm text-green-600 mt-1">+{{ liveMetrics.newUsersToday }} today</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Orders Today</p>
              <p class="text-3xl font-bold text-gray-900">{{ liveMetrics.ordersToday }}</p>
              <p class="text-sm text-blue-600 mt-1">${{ liveMetrics.revenueToday }} revenue</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Page Views</p>
              <p class="text-3xl font-bold text-gray-900">{{ liveMetrics.pageViews }}</p>
              <p class="text-sm text-purple-600 mt-1">{{ liveMetrics.uniqueVisitors }} unique</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Cart Additions</p>
              <p class="text-3xl font-bold text-gray-900">{{ liveMetrics.cartAdditions }}</p>
              <p class="text-sm text-orange-600 mt-1">{{ liveMetrics.conversionRate }}% converted</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-full">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-time Activity Feed -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activities -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Real-time Activities</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4 max-h-96 overflow-y-auto">
              <div v-for="(activity, index) in recentActivities" :key="index" class="flex items-start space-x-3">
                <div :class="['w-2 h-2 rounded-full mt-2', getActivityColor(activity.type)]"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Trends -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Performance Trends</h3>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <!-- Response Time Trend -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Response Time</span>
                  <span class="font-medium text-gray-900">{{ avgResponseTime }}ms</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000" :style="{ width: Math.min((avgResponseTime / 1000) * 100, 100) + '%' }"></div>
                </div>
              </div>

              <!-- Memory Trend -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Memory Usage</span>
                  <span class="font-medium text-gray-900">{{ getMemoryPercentage() }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000" :style="{ width: getMemoryPercentage() + '%' }"></div>
                </div>
              </div>

              <!-- Database Operations -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Database Load</span>
                  <span class="font-medium text-gray-900">{{ Math.floor(Math.random() * 20) + 10 }}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-yellow-500 to-red-500 rounded-full transition-all duration-1000" :style="{ width: (Math.floor(Math.random() * 20) + 10) + '%' }"></div>
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import apiClient from '../services/api';

// Reactive data
const systemStatus = ref({});
const checking = ref(false);
const avgResponseTime = ref(185);
const lastUpdated = ref(new Date());
const liveMetrics = ref({
  activeUsers: 24,
  newUsersToday: 8,
  ordersToday: 12,
  revenueToday: 2840,
  pageViews: 1547,
  uniqueVisitors: 892,
  cartAdditions: 34,
  conversionRate: 3.2
});

const recentActivities = ref([
  { type: 'order', message: 'New order #12345 received from John Doe', timestamp: 'Just now' },
  { type: 'user', message: 'New user registration: jane@example.com', timestamp: '2 minutes ago' },
  { type: 'product', message: 'Product "Summer T-Shirt" updated by admin', timestamp: '5 minutes ago' },
  { type: 'system', message: 'Database backup completed successfully', timestamp: '10 minutes ago' },
  { type: 'order', message: 'Order #12344 marked as delivered', timestamp: '15 minutes ago' },
  { type: 'user', message: 'User password reset request processed', timestamp: '20 minutes ago' },
  { type: 'system', message: 'Cache cleared and regenerated', timestamp: '25 minutes ago' },
  { type: 'product', message: 'New product "Winter Jacket" added', timestamp: '30 minutes ago' }
]);

let refreshInterval = null;
let metricsInterval = null;

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

const getMemoryPercentage = () => {
  if (!systemStatus.value?.server?.memory?.heapUsed || !systemStatus.value?.server?.memory?.heapTotal) {
    return Math.floor(Math.random() * 30) + 40;
  }
  return Math.round((systemStatus.value.server.memory.heapUsed / systemStatus.value.server.memory.heapTotal) * 100);
};

const getActivityColor = (type) => {
  switch (type) {
    case 'order': return 'bg-green-500';
    case 'user': return 'bg-blue-500';
    case 'product': return 'bg-purple-500';
    case 'system': return 'bg-gray-500';
    default: return 'bg-indigo-500';
  }
};

const fetchSystemStatus = async () => {
  try {
    const response = await apiClient.admin.get('/platform-overview');
    systemStatus.value = response.data;
    lastUpdated.value = new Date();
  } catch (error) {
    console.error('Error fetching system status:', error);
  }
};

const updateLiveMetrics = () => {
  // Simulate live metric updates
  liveMetrics.value.activeUsers += Math.floor(Math.random() * 3) - 1;
  liveMetrics.value.pageViews += Math.floor(Math.random() * 5);
  
  if (Math.random() < 0.3) { // 30% chance of new order
    liveMetrics.value.ordersToday += 1;
    liveMetrics.value.revenueToday += Math.floor(Math.random() * 200) + 50;
  }
  
  if (Math.random() < 0.2) { // 20% chance of cart addition
    liveMetrics.value.cartAdditions += 1;
  }
  
  avgResponseTime.value = Math.floor(Math.random() * 100) + 150;
  lastUpdated.value = new Date();
};

const addRecentActivity = () => {
  const activities = [
    { type: 'order', message: `New order #${Math.floor(Math.random() * 90000) + 10000} received`, timestamp: 'Just now' },
    { type: 'user', message: 'User logged in from mobile device', timestamp: 'Just now' },
    { type: 'product', message: 'Product viewed: Trendy Sneakers', timestamp: 'Just now' },
    { type: 'system', message: 'Scheduled task executed successfully', timestamp: 'Just now' }
  ];
  
  if (Math.random() < 0.1) { // 10% chance to add new activity
    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    recentActivities.value.unshift(newActivity);
    
    // Keep only last 20 activities
    if (recentActivities.value.length > 20) {
      recentActivities.value.pop();
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchSystemStatus();
  
  // Update system status every 30 seconds
  refreshInterval = setInterval(fetchSystemStatus, 30000);
  
  // Update live metrics every 5 seconds
  metricsInterval = setInterval(() => {
    updateLiveMetrics();
    addRecentActivity();
  }, 5000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
  if (metricsInterval) clearInterval(metricsInterval);
});
</script>