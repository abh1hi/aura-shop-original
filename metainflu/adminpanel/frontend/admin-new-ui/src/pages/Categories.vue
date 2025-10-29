<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Category Management</h1>
        <p class="mt-2 text-sm text-gray-600">
          Manage your e-commerce category hierarchy including parent categories, categories, and subcategories.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
            <span 
              :class="[
                activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ getCategoryCount(tab.id) }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Alert Messages -->
      <div v-if="alert.show" :class="alertClasses" class="mb-6 p-4 rounded-md">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm font-medium">{{ alert.message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button
                @click="hideAlert"
                type="button"
                class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="alert.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' : 'text-red-500 hover:bg-red-100 focus:ring-red-600'"
              >
                <span class="sr-only">Dismiss</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-white shadow rounded-lg">
        <!-- Parent Categories Tab -->
        <div v-if="activeTab === 'parent'" class="p-6">
          <ParentCategoryManager 
            @alert="showAlert"
            @refresh="fetchAllCategories"
          />
        </div>

        <!-- Categories Tab -->
        <div v-if="activeTab === 'category'" class="p-6">
          <CategoryManager 
            :parent-categories="parentCategories"
            @alert="showAlert"
            @refresh="fetchAllCategories"
          />
        </div>

        <!-- Subcategories Tab -->
        <div v-if="activeTab === 'subcategory'" class="p-6">
          <SubCategoryManager 
            :categories="categories"
            :parent-categories="parentCategories"
            @alert="showAlert"
            @refresh="fetchAllCategories"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ParentCategoryManager from '../components/ParentCategoryManager.vue';
import CategoryManager from '../components/CategoryManager.vue';
import SubCategoryManager from '../components/SubCategoryManager.vue';
import apiClient from '../services/api';

// Reactive data
const activeTab = ref('parent');
const parentCategories = ref([]);
const categories = ref([]);
const subCategories = ref([]);

const alert = ref({
  show: false,
  type: 'success',
  message: ''
});

// Tab configuration
const tabs = [
  { id: 'parent', name: 'Parent Categories' },
  { id: 'category', name: 'Categories' },
  { id: 'subcategory', name: 'Subcategories' }
];

// Computed properties
const alertClasses = computed(() => {
  return alert.value.type === 'success' 
    ? 'bg-green-50 border border-green-200 text-green-800'
    : 'bg-red-50 border border-red-200 text-red-800';
});

// Methods
const getCategoryCount = (tabId) => {
  switch (tabId) {
    case 'parent': return parentCategories.value.length;
    case 'category': return categories.value.length;
    case 'subcategory': return subCategories.value.length;
    default: return 0;
  }
};

const showAlert = (type, message) => {
  alert.value = {
    show: true,
    type,
    message
  };
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    hideAlert();
  }, 5000);
};

const hideAlert = () => {
  alert.value.show = false;
};

const fetchAllCategories = async () => {
  try {
    // Fetch all category types in parallel using admin endpoints
    const [parentRes, categoryRes, subCategoryRes] = await Promise.all([
      apiClient.admin.get('/parent-categories'),
      apiClient.get('/categories'), // Use general endpoint for reading
      apiClient.admin.get('/subcategories')
    ]);
    
    parentCategories.value = parentRes.data;
    categories.value = categoryRes.data;
    subCategories.value = subCategoryRes.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    showAlert('error', 'Failed to load categories. Please refresh the page.');
  }
};

// Lifecycle
onMounted(() => {
  fetchAllCategories();
});
</script>