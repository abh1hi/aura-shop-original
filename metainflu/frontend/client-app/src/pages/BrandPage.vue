<template>
  <div v-if="loading" class="text-center py-20">
    <p>Loading brand page...</p>
  </div>
  <div v-else-if="error" class="text-center py-20">
    <p class="text-red-500">{{ error }}</p>
  </div>
  <div v-else>
    <component :is="templateComponent" :brand="brand" :products="products" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import brandService from '../services/brandService';
import Template1 from '../components/brand-templates/Template1.vue';
import Template2 from '../components/brand-templates/Template2.vue';

const route = useRoute();
const brand = ref(null);
const products = ref([]);
const loading = ref(true);
const error = ref(null);

const templates = {
  'template-1': Template1,
  'template-2': Template2,
};

const templateComponent = computed(() => {
  if (brand.value && brand.value.templateId) {
    return templates[brand.value.templateId] || Template1;
  }
  return Template1;
});

onMounted(async () => {
  try {
    const response = await brandService.getBrandBySlug(route.params.slug);
    brand.value = response.data.brand;
    products.value = response.data.products;
  } catch (err) {
    error.value = 'Failed to load brand page.';
  } finally {
    loading.value = false;
  }
});
</script>
