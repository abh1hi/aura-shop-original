<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h1>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded">{{ error }}</div>

    <form v-if="!loading" @submit.prevent="handleSubmit" class="space-y-6 bg-white p-8 rounded-lg shadow-md">
      
      <!-- Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" v-model="product.name" required class="mt-1 block w-full border rounded-md"/>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Brand</label>
          <input type="text" v-model="product.brand" class="mt-1 block w-full border rounded-md"/>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea v-model="product.description" rows="4" class="mt-1 block w-full border rounded-md"></textarea>
      </div>

      <!-- Category Hierarchy -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Parent Category</label>
          <select v-model="product.parentCategory" class="mt-1 block w-full border rounded-md">
            <option v-for="pCat in parentCategories" :key="pCat._id" :value="pCat._id">{{ pCat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select v-model="product.category" :disabled="!product.parentCategory" class="mt-1 block w-full border rounded-md">
            <option v-for="cat in filteredCategories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Sub-Category</label>
          <select v-model="product.subCategory" :disabled="!product.category" class="mt-1 block w-full border rounded-md">
            <option v-for="subCat in filteredSubCategories" :key="subCat._id" :value="subCat._id">{{ subCat.name }}</option>
          </select>
        </div>
      </div>

      <!-- Variants, Images, etc. -->
      <!-- ... existing form sections ... -->

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 border-t pt-6">
        <router-link to="/products" class="px-4 py-2 bg-gray-200 rounded-md">Cancel</router-link>
        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Save Product</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '../services/api';

// Data Refs
const product = ref({ name: '', brand: '', description: '', parentCategory: null, category: null, subCategory: null, variants: [], images: [] });
const parentCategories = ref([]);
const allCategories = ref([]);
const allSubCategories = ref([]);
const loading = ref(false);
const error = ref(null);

// Computed Properties
const productId = computed(() => route.params.id);
const isEditMode = computed(() => !!productId.value);

const filteredCategories = computed(() => {
  if (!product.value.parentCategory) return [];
  return allCategories.value.filter(c => c.parentCategory === product.value.parentCategory);
});

const filteredSubCategories = computed(() => {
  if (!product.value.category) return [];
  return allSubCategories.value.filter(sc => sc.category === product.value.category);
});

// Methods
const fetchProduct = async () => { /* ... */ };
const fetchCategories = async () => {
  try {
    const [pCatRes, catRes, subCatRes] = await Promise.all([
      apiClient.get('/../parent-categories'),
      apiClient.get('/../categories'),
      apiClient.get('/../subcategories'),
    ]);
    parentCategories.value = pCatRes.data;
    allCategories.value = catRes.data;
    allSubCategories.value = subCatRes.data;
  } catch (err) {
    error.value = 'Failed to load category data.';
  }
};

const handleSubmit = async () => { /* ... */ };

// Lifecycle Hook
onMounted(async () => {
  loading.value = true;
  await fetchCategories();
  if (isEditMode.value) {
    await fetchProduct();
  }
  loading.value = false;
});

</script>
