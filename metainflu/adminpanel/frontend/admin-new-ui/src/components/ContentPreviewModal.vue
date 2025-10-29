<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
    <div class="relative top-4 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white mb-4">
      <!-- Header -->
      <div class="flex items-center justify-between border-b pb-4 mb-4">
        <h3 class="text-xl leading-6 font-medium text-gray-900">Live Preview</h3>
        <div class="flex items-center space-x-4">
          <select v-model="previewDevice" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="desktop">Desktop (1200px)</option>
            <option value="tablet">Tablet (768px)</option>
            <option value="mobile">Mobile (375px)</option>
          </select>
          <button @click="refreshPreview" class="text-indigo-600 hover:text-indigo-900 text-sm">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Container -->
      <div class="border border-gray-300 rounded-lg overflow-hidden" :class="getPreviewContainerClass()">
        <!-- Browser Header -->
        <div class="bg-gray-100 p-3 border-b border-gray-200 flex items-center space-x-2">
          <div class="flex space-x-1">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="text-sm text-gray-600 bg-white px-3 py-1 rounded border">
            https://yourstore.com {{ previewType === 'banner' ? '/home' : '/collections' }}
          </div>
        </div>
        
        <!-- Preview Content -->
        <div class="bg-white min-h-96 overflow-auto" :style="getPreviewDimensions()">
          <!-- Banner Preview -->
          <div v-if="previewType === 'banner' && previewItem" class="relative">
            <div class="relative h-64 md:h-80 overflow-hidden">
              <!-- Background Image -->
              <div class="absolute inset-0">
                <img 
                  v-if="previewItem.imageUrl" 
                  :src="previewItem.imageUrl" 
                  :alt="previewItem.title" 
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                >
                <div v-else class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              </div>
              
              <!-- Overlay Content -->
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div class="text-center text-white px-4 max-w-2xl">
                  <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ previewItem.title || 'Banner Title' }}</h1>
                  <p class="text-lg md:text-xl mb-6 opacity-90">{{ previewItem.subtitle || 'Banner subtitle description' }}</p>
                  <button v-if="previewItem.link" class="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg">
                    Shop Now
                  </button>
                </div>
              </div>
              
              <!-- Status Badge -->
              <div class="absolute top-4 right-4">
                <span :class="getStatusBadgeClass(previewItem.status)" class="px-3 py-1 text-sm rounded-full font-medium">
                  {{ getStatusText(previewItem.status) }}
                </span>
              </div>
            </div>
            
            <!-- Banner Info Panel -->
            <div class="p-4 bg-gray-50 border-t">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Priority:</span>
                  <span class="ml-2 capitalize">{{ previewItem.priority || 'Medium' }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Order:</span>
                  <span class="ml-2">{{ previewItem.order || 1 }}</span>
                </div>
                <div v-if="previewItem.scheduledStart">
                  <span class="font-medium text-gray-700">Scheduled:</span>
                  <span class="ml-2">{{ formatDateTime(previewItem.scheduledStart) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Collection Preview -->
          <div v-if="previewType === 'collection' && previewItem" class="p-6">
            <!-- Collection Header -->
            <div class="text-center mb-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900">{{ previewItem.title || 'Collection Title' }}</h2>
                <span :class="getStatusBadgeClass(previewItem.status)" class="px-3 py-1 text-sm rounded-full font-medium">
                  {{ getStatusText(previewItem.status) }}
                </span>
              </div>
              <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ previewItem.description || 'Collection description goes here' }}</p>
            </div>
            
            <!-- Products Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <div v-for="product in previewProducts" :key="product._id" class="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <!-- Product Image -->
                <div class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    v-if="product.images?.[0]" 
                    :src="product.images[0]" 
                    :alt="product.name" 
                    class="w-full h-full object-cover hover:scale-105 transition-transform"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                  </div>
                </div>
                
                <!-- Product Info -->
                <div class="p-3">
                  <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
                  <p class="text-lg font-bold text-gray-900">
                    ${{ getProductPrice(product) }}
                  </p>
                  <p v-if="getProductStock(product)" class="text-xs text-gray-500 mt-1">
                    {{ getProductStock(product) }} in stock
                  </p>
                </div>
              </div>
              
              <!-- Add More Products Placeholder -->
              <div v-if="!previewProducts.length" class="col-span-full text-center py-12">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <p class="text-gray-500">No products in this collection</p>
                <p class="text-sm text-gray-400 mt-1">Add products to see them here</p>
              </div>
            </div>
            
            <!-- Collection Stats -->
            <div v-if="previewProducts.length" class="mt-8 p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ previewProducts.length }}</div>
                  <div class="text-sm text-gray-600">Products</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">${{ calculateCollectionValue() }}</div>
                  <div class="text-sm text-gray-600">Total Value</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">${{ calculateAveragePrice() }}</div>
                  <div class="text-sm text-gray-600">Avg Price</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Preview Actions -->
      <div class="flex items-center justify-between pt-4 border-t">
        <div class="text-sm text-gray-500">
          {{ previewType === 'banner' ? 'Banner' : 'Collection' }} Preview - {{ previewDevice }} view
        </div>
        <div class="flex space-x-3">
          <button @click="$emit('edit')" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
            Edit {{ previewType === 'banner' ? 'Banner' : 'Collection' }}
          </button>
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-700">
            Close Preview
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  previewType: String, // 'banner' or 'collection'
  previewItem: Object,
  allProducts: Array
});

const emit = defineEmits(['close', 'edit']);

const previewDevice = ref('desktop');

// Computed
const previewProducts = computed(() => {
  if (props.previewType !== 'collection' || !props.previewItem?.products) {
    return [];
  }
  
  // If products are just IDs, find them in allProducts
  return props.previewItem.products.map(productId => {
    if (typeof productId === 'object') return productId;
    return props.allProducts?.find(p => p._id === productId) || { _id: productId, name: 'Product Not Found' };
  }).filter(Boolean);
});

// Methods
const getPreviewContainerClass = () => {
  switch (previewDevice.value) {
    case 'mobile': return 'max-w-sm mx-auto';
    case 'tablet': return 'max-w-2xl mx-auto';
    default: return 'w-full';
  }
};

const getPreviewDimensions = () => {
  switch (previewDevice.value) {
    case 'mobile': return { width: '375px', margin: '0 auto' };
    case 'tablet': return { width: '768px', margin: '0 auto' };
    default: return { width: '100%' };
  }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'published': return 'LIVE';
    case 'draft': return 'DRAFT';
    case 'scheduled': return 'SCHEDULED';
    case 'expired': return 'EXPIRED';
    default: return 'UNKNOWN';
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleString();
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMMTYgNE0xNiA0SDE2LjAxTTE2IDRWNEg0VjE2SDIwVjEySDIwLjAxIiBzdHJva2U9IiM5Q0E3QzIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
};

const getProductPrice = (product) => {
  return product.variants?.[0]?.price || product.price || '0.00';
};

const getProductStock = (product) => {
  const stock = product.variants?.[0]?.inventory || product.variants?.[0]?.stock || product.stock;
  return stock ? `${stock} units` : null;
};

const calculateCollectionValue = () => {
  const total = previewProducts.value.reduce((sum, product) => {
    const price = parseFloat(getProductPrice(product)) || 0;
    return sum + price;
  }, 0);
  return total.toFixed(2);
};

const calculateAveragePrice = () => {
  if (!previewProducts.value.length) return '0.00';
  const total = parseFloat(calculateCollectionValue());
  return (total / previewProducts.value.length).toFixed(2);
};

const refreshPreview = () => {
  emit('refresh');
};

// Watch for device changes to update preview
watch(previewDevice, () => {
  console.log('Preview device changed to:', previewDevice.value);
});
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Responsive preview scaling */
@media (max-width: 768px) {
  .relative.top-4 {
    top: 1rem;
    margin: 1rem;
  }
}
</style>