<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p class="text-sm text-gray-600 mt-1">Business intelligence and detailed platform analytics</p>
        </div>
        <div class="flex items-center space-x-4">
          <select v-model="selectedTimeRange" @change="updateAnalytics" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button @click="exportData" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
            Export Data
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full mr-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Revenue Growth</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.revenueGrowth }}%</p>
              <p class="text-xs text-green-600">+${{ formatNumber(analytics.revenueIncrease) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full mr-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Customer Acquisition</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.customerGrowth }}%</p>
              <p class="text-xs text-blue-600">+{{ analytics.newCustomers }} customers</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full mr-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Conversion Rate</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.conversionRate }}%</p>
              <p class="text-xs text-purple-600">{{ analytics.conversions }} conversions</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full mr-4">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Avg Response Time</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.avgResponseTime }}ms</p>
              <p class="text-xs text-yellow-600">{{ analytics.responseTimeChange }}ms change</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Analytics -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Analytics</h3>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div class="text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-500 font-medium">Revenue Chart</p>
              <p class="text-sm text-gray-400">Interactive chart will be implemented here</p>
            </div>
          </div>
        </div>

        <!-- Customer Behavior -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Behavior</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">Average Session Duration</p>
                <p class="text-xs text-gray-500">Time spent on platform</p>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ analytics.avgSessionDuration }}</span>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">Pages per Session</p>
                <p class="text-xs text-gray-500">Average page views per user</p>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ analytics.pagesPerSession }}</span>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">Bounce Rate</p>
                <p class="text-xs text-gray-500">Single page visits</p>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ analytics.bounceRate }}%</span>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-900">Return Rate</p>
                <p class="text-xs text-gray-500">Returning customers</p>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ analytics.returnRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Products by Revenue -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Top Products by Revenue</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(product, index) in topProducts" :key="index">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ product.sales }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">${{ formatNumber(product.revenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Traffic Sources -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Traffic Sources</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="source in trafficSources" :key="source.name" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div :class="['w-4 h-4 rounded-full', source.color]"></div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ source.name }}</p>
                    <p class="text-xs text-gray-500">{{ source.visits }} visits</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-900">{{ source.percentage }}%</p>
                  <div class="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div :class="['h-2 rounded-full', source.color.replace('bg-', 'bg-')]" :style="{ width: source.percentage + '%' }"></div>
                  </div>
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
const selectedTimeRange = ref('30');
const analytics = ref({
  revenueGrowth: 12.5,
  revenueIncrease: 15420,
  customerGrowth: 8.3,
  newCustomers: 147,
  conversionRate: 3.8,
  conversions: 89,
  avgResponseTime: 185,
  responseTimeChange: -12,
  avgSessionDuration: '4m 32s',
  pagesPerSession: 5.7,
  bounceRate: 32.1,
  returnRate: 68.9
});

const topProducts = ref([
  { name: 'Premium T-Shirt', sales: 156, revenue: 7800 },
  { name: 'Designer Jeans', sales: 89, revenue: 12450 },
  { name: 'Running Shoes', sales: 134, revenue: 16080 },
  { name: 'Winter Jacket', sales: 67, revenue: 10050 },
  { name: 'Summer Dress', sales: 98, revenue: 5880 }
]);

const trafficSources = ref([
  { name: 'Organic Search', visits: 2840, percentage: 45, color: 'bg-green-500' },
  { name: 'Direct Traffic', visits: 1580, percentage: 25, color: 'bg-blue-500' },
  { name: 'Social Media', visits: 1264, percentage: 20, color: 'bg-purple-500' },
  { name: 'Paid Ads', visits: 632, percentage: 10, color: 'bg-yellow-500' }
]);

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const updateAnalytics = () => {
  // This would typically fetch new data based on the selected time range
  console.log('Updating analytics for time range:', selectedTimeRange.value);
};

const exportData = () => {
  // Export analytics data
  const data = {
    timeRange: selectedTimeRange.value,
    analytics: analytics.value,
    topProducts: topProducts.value,
    trafficSources: trafficSources.value,
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Lifecycle
onMounted(() => {
  updateAnalytics();
});
</script>