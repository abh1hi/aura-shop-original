<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Featured Collections</h2>
      <button @click="openForm()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Collection</button>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900 text-center">{{ form.id ? 'Edit' : 'Create' }} Collection</h3>
          <div class="mt-4 px-7 py-3">
            <input type="text" v-model="form.title" placeholder="Title" class="w-full px-3 py-2 mb-3 text-sm border rounded" />
            <textarea v-model="form.description" placeholder="Description" class="w-full px-3 py-2 mb-3 text-sm border rounded"></textarea>
            
            <h4 class="font-semibold mb-2">Select Products:</h4>
            <div class="h-64 overflow-y-auto border rounded p-2">
              <div v-for="product in allProducts" :key="product._id">
                <label class="flex items-center space-x-3">
                  <input type="checkbox" :value="product._id" v-model="form.products" class="form-checkbox h-5 w-5 text-blue-600" />
                  <span>{{ product.name }}</span>
                </label>
              </div>
            </div>

          </div>
          <div class="items-center px-4 py-3 text-center">
            <button @click="handleSubmit" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Save</button>
            <button @click="showForm = false" class="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Collections List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li v-for="collection in collections" :key="collection._id" class="p-4 flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ collection.title }}</p>
            <p class="text-sm text-gray-500">{{ collection.products.length }} products</p>
          </div>
          <div>
            <button @click="openForm(collection)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
            <button @click="handleDelete(collection._id)" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../../services/api';

const collections = ref([]);
const allProducts = ref([]);
const showForm = ref(false);
const form = ref({ id: null, title: '', description: '', products: [] });

const fetchCollections = async () => {
  const response = await apiClient.get('/content/featuredcollections');
  collections.value = response.data;
};

const fetchAllProducts = async () => {
  // Fetch all products (no pagination) for the multi-select
  const response = await apiClient.get('/products', { params: { pageNumber: 1, limit: 1000 } }); // Adjust limit as needed
  allProducts.value = response.data.products;
};

const openForm = (collection = null) => {
  if (collection) {
    form.value = { 
      id: collection._id, 
      title: collection.title, 
      description: collection.description, 
      products: collection.products.map(p => p._id) // We need just the IDs for the form
    };
  } else {
    form.value = { id: null, title: '', description: '', products: [] };
  }
  showForm.value = true;
};

const handleSubmit = async () => {
  if (form.value.id) {
    await apiClient.put(`/content/featuredcollections/${form.value.id}`, form.value);
  } else {
    await apiClient.post('/content/featuredcollections', form.value);
  }
  showForm.value = false;
  fetchCollections();
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this collection?')) {
    await apiClient.delete(`/content/featuredcollections/${id}`);
    fetchCollections();
  }
};

onMounted(() => {
  fetchCollections();
  fetchAllProducts();
});
</script>
