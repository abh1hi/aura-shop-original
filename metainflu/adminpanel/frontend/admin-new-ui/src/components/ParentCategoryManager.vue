<template>
  <div>
    <!-- Header with Add Button -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Parent Categories</h2>
        <p class="text-sm text-gray-600 mt-1">
          Top-level categories that organize your product catalog.
        </p>
      </div>
      <button
        @click="showModal = true; editingCategory = null; resetForm()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        + Add Parent Category
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    </div>

    <!-- Categories Table -->
    <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="categories.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              No parent categories found. Create your first parent category to get started.
            </td>
          </tr>
          <tr v-for="category in categories" :key="category._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ category.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ category.description || 'No description' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {{ category.slug }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(category.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editCategory(category)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                @click="deleteCategory(category)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Add/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveCategory">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ editingCategory ? 'Edit Parent Category' : 'Add New Parent Category' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Name *</label>
                      <input
                        v-model="form.name"
                        type="text"
                        id="name"
                        required
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter parent category name"
                      >
                    </div>
                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        v-model="form.description"
                        id="description"
                        rows="3"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter description (optional)"
                      ></textarea>
                    </div>
                    <div>
                      <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        v-model="form.image"
                        type="url"
                        id="image"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="processing"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {{ processing ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
              </button>
              <button
                @click="showModal = false"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';

// Emits
const emit = defineEmits(['alert', 'refresh']);

// Reactive data
const categories = ref([]);
const loading = ref(false);
const processing = ref(false);
const showModal = ref(false);
const editingCategory = ref(null);

const form = ref({
  name: '',
  description: '',
  image: ''
});

// Methods
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    image: ''
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await apiClient.admin.get('/parent-categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    emit('alert', 'error', 'Failed to load parent categories');
  } finally {
    loading.value = false;
  }
};

const editCategory = (category) => {
  editingCategory.value = category;
  form.value = {
    name: category.name,
    description: category.description || '',
    image: category.image || ''
  };
  showModal.value = true;
};

const saveCategory = async () => {
  processing.value = true;
  try {
    if (editingCategory.value) {
      // Update existing category
      await apiClient.admin.put(`/parent-categories/${editingCategory.value._id}`, form.value);
      emit('alert', 'success', 'Parent category updated successfully');
    } else {
      // Create new category
      await apiClient.admin.post('/parent-categories', form.value);
      emit('alert', 'success', 'Parent category created successfully');
    }
    
    showModal.value = false;
    await fetchCategories();
    emit('refresh');
  } catch (error) {
    console.error('Error saving parent category:', error);
    const message = error.response?.data?.message || 'Failed to save parent category';
    emit('alert', 'error', message);
  } finally {
    processing.value = false;
  }
};

const deleteCategory = async (category) => {
  if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await apiClient.admin.delete(`/parent-categories/${category._id}`);
    emit('alert', 'success', 'Parent category deleted successfully');
    await fetchCategories();
    emit('refresh');
  } catch (error) {
    console.error('Error deleting parent category:', error);
    const message = error.response?.data?.message || 'Failed to delete parent category';
    emit('alert', 'error', message);
  }
};

// Lifecycle
onMounted(() => {
  fetchCategories();
});
</script>