<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Content Management</h1>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button 
          @click="activeTab = 'banners'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'banners' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
          Hero Banners
        </button>
        <button 
          @click="activeTab = 'collections'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'collections' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
          Featured Collections
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="mt-8">
      <HeroBannerManager v-if="activeTab === 'banners'" />
      <FeaturedCollectionManager v-if="activeTab === 'collections'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeroBannerManager from '../components/content/HeroBannerManager.vue';
import FeaturedCollectionManager from '../components/content/FeaturedCollectionManager.vue';

const activeTab = ref('banners'); // Default to the banners tab
</script>
