<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Hero Banners</h2>
      <button @click="openForm()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Banner</button>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ form.id ? 'Edit' : 'Create' }} Banner</h3>
          <div class="mt-2 px-7 py-3">
            <input type="text" v-model="form.title" placeholder="Title" class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
            <input type="text" v-model="form.subtitle" placeholder="Subtitle" class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
            <input type="text" v-model="form.imageUrl" placeholder="Image URL" class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
            <input type="text" v-model="form.link" placeholder="Link" class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" />
          </div>
          <div class="items-center px-4 py-3">
            <button @click="handleSubmit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">Save</button>
            <button @click="showForm = false" class="ml-2 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Banners List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li v-for="banner in banners" :key="banner._id" class="p-4 flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ banner.title }}</p>
            <p class="text-sm text-gray-500">{{ banner.subtitle }}</p>
          </div>
          <div>
            <button @click="openForm(banner)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
            <button @click="handleDelete(banner._id)" class="text-red-600 hover:text-red-900 ml-4">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../../services/api';

const banners = ref([]);
const showForm = ref(false);
const form = ref({ id: null, title: '', subtitle: '', imageUrl: '', link: '' });

const fetchBanners = async () => {
  const response = await apiClient.get('/content/herobanners');
  banners.value = response.data;
};

const openForm = (banner = null) => {
  if (banner) {
    form.value = { id: banner._id, title: banner.title, subtitle: banner.subtitle, imageUrl: banner.imageUrl, link: banner.link };
  } else {
    form.value = { id: null, title: '', subtitle: '', imageUrl: '', link: '' };
  }
  showForm.value = true;
};

const handleSubmit = async () => {
  if (form.value.id) {
    // Update
    await apiClient.put(`/content/herobanners/${form.value.id}`, form.value);
  } else {
    // Create
    await apiClient.post('/content/herobanners', form.value);
  }
  showForm.value = false;
  fetchBanners(); // Refresh list
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this banner?')) {
    await apiClient.delete(`/content/herobanners/${id}`);
    fetchBanners(); // Refresh list
  }
};

onMounted(fetchBanners);
</script>
