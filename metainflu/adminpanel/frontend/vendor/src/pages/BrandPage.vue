<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">{{ pageTitle }}</h1>

    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="isCreating && !loading" class="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
      <h3 class="font-bold text-lg">Welcome! Let's set up your brand page.</h3>
      <p>Fill out the form below to get started.</p>
    </div>

    <div v-if="brand._id" class="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
      <h3 class="font-bold text-lg mb-2">Your Shareable Brand Page Link</h3>
      <div class="flex items-center space-x-2">
        <input type="text" :value="shareableLink" readonly class="flex-grow bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none">
        <button @click.prevent="copyToClipboard" class="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Copy
        </button>
      </div>
    </div>

    <form @submit.prevent="saveBrandPage" class="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <!-- Form fields remain the same -->
      <div>
        <label for="storeName" class="block text-sm font-medium text-gray-700">Store Name</label>
        <input type="text" id="storeName" v-model="brand.storeName" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., The Rift Store">
      </div>

      <div>
        <label for="tagline" class="block text-sm font-medium text-gray-700">Tagline</label>
        <input type="text" id="tagline" v-model="brand.tagline" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., Quality clothing for all occasions">
      </div>

      <div>
        <label for="aboutUs" class="block text-sm font-medium text-gray-700">About Us</label>
        <textarea id="aboutUs" v-model="brand.aboutUs" rows="4" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Tell your customers about your brand..."></textarea>
      </div>

      <div>
        <label for="logoUrl" class="block text-sm font-medium text-gray-700">Logo URL</label>
        <input type="text" id="logoUrl" v-model="brand.logoUrl" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="https://example.com/logo.png">
      </div>

      <div>
        <label for="heroImageUrl" class="block text-sm font-medium text-gray-700">Hero Image URL</label>
        <input type="text" id="heroImageUrl" v-model="brand.heroImageUrl" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="https://example.com/hero.png">
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900">Social Links</h3>
        <div class="space-y-4 mt-2">
          <div>
            <label for="instagram" class="block text-sm font-medium text-gray-700">Instagram</label>
            <input type="text" id="instagram" v-model="brand.socialLinks.instagram" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="https://instagram.com/yourbrand">
          </div>
          <div>
            <label for="facebook" class="block text-sm font-medium text-gray-700">Facebook</label>
            <input type="text" id="facebook" v-model="brand.socialLinks.facebook" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="https://facebook.com/yourbrand">
          </div>
          <div>
            <label for="twitter" class="block text-sm font-medium text-gray-700">Twitter</label>
            <input type="text" id="twitter" v-model="brand.socialLinks.twitter" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="https://twitter.com/yourbrand">
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900">Choose a Template</h3>
        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div v-for="template in templates" :key="template.id" @click="brand.templateId = template.id" :class="['relative flex flex-col cursor-pointer rounded-lg border focus:outline-none', brand.templateId === template.id ? 'border-primary ring-2 ring-primary' : 'border-gray-300']">
            <img :src="template.imageUrl" alt="template.name" class="rounded-t-lg h-40 w-full object-cover">
            <div class="flex-1 flex p-4">
              <div class="flex flex-col">
                <span class="block text-sm font-medium text-gray-900">{{ template.name }}</span>
                <span class="mt-1 flex items-center text-sm text-gray-500">{{ template.description }}</span>
              </div>
            </div>
            <div v-if="brand.templateId === template.id" class="absolute -top-2 -right-2 h-5 w-5 rounded--full bg-primary flex items-center justify-center">
              <svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          {{ submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import brandService from '../services/brandService';

const isCreating = ref(false);
const brand = ref({
  storeName: '',
  tagline: '',
  aboutUs: '',
  logoUrl: '',
  heroImageUrl: '',
  socialLinks: {
    instagram: '',
    facebook: '',
    twitter: '',
  },
  templateId: 'template-1',
});

const templates = [
  { id: 'template-1', name: 'Classic', description: 'A clean and classic layout.', imageUrl: 'https://placehold.co/600x400/EEE/31343C?text=Classic' },
  { id: 'template-2', name: 'Modern', description: 'A modern and bold layout.', imageUrl: 'https://placehold.co/600x400/31343C/FFF?text=Modern' },
];

const loading = ref(true);
const error = ref(null);

const pageTitle = computed(() => isCreating.value ? 'Create Your Brand Page' : 'Manage Your Brand Page');
const submitButtonText = computed(() => isCreating.value ? 'Create Brand' : 'Save Changes');

const shareableLink = computed(() => {
  if (brand.value && brand.value.storeSlug) {
    // Assuming the client-app is served at the root and uses hash history
    return `${window.location.origin}/#/brand/${brand.value.storeSlug}`;
  }
  return '';
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(shareableLink.value);
  alert('Link copied to clipboard!');
};

onMounted(async () => {
  try {
    const response = await brandService.getMyBrand();
    if (response.data) {
      isCreating.value = false;
      // Ensure socialLinks is an object
      response.data.socialLinks = response.data.socialLinks || {};
      brand.value = response.data;
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      isCreating.value = true; // This is a new brand, so we are in creation mode.
    } else {
      error.value = 'Failed to load brand data.';
    }
  } finally {
    loading.value = false;
  }
});

const saveBrandPage = async () => {
  error.value = null;
  try {
    let response;
    if (isCreating.value) {
      response = await brandService.createBrand(brand.value);
    } else {
      response = await brandService.updateBrand(brand.value._id, brand.value);
    }
    // Update the brand ref with the saved data to ensure UI consistency
    brand.value = response.data;
    isCreating.value = false; // After saving, we are no longer in creation mode.
    alert('Brand page saved successfully!');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save brand page.';
  }
};
</script>