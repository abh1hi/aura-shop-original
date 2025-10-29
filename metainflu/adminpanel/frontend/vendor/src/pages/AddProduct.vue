<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link to="/products" class="p-2 rounded-full hover:bg-gray-100">
        <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </router-link>
      <h1 class="text-2xl font-bold text-text-primary">Add New Product</h1>
    </div>

    <div class="max-w-3xl mx-auto">
      <div class="card p-6 sm:p-8">
        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-100 text-green-600 p-4 rounded-lg mb-6">
          {{ successMessage }}
        </div>
        
        <!-- Error Messages -->
        <div v-if="errorMessage" class="bg-red-100 text-danger p-4 rounded-lg mb-6">
          <strong>Error:</strong> {{ errorMessage }}
        </div>
        
        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <h4 class="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
          <ul class="list-disc list-inside text-red-700 space-y-1">
            <li v-for="error in validationErrors" :key="error.field">{{ error.message }}</li>
          </ul>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-6">
          <!-- Product Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Product Name *</label>
            <input 
              type="text" 
              id="name" 
              v-model="newProduct.name" 
              :class="[
                'mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary',
                getFieldError('name') ? 'border-red-500 bg-red-50' : ''
              ]"
              placeholder="Enter product name"
              @blur="validateField('name')"
            >
            <p v-if="getFieldError('name')" class="text-red-500 text-sm mt-1">{{ getFieldError('name') }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-text-secondary mb-1">Description *</label>
            <textarea 
              id="description" 
              rows="4" 
              v-model="newProduct.description" 
              :class="[
                'mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary',
                getFieldError('description') ? 'border-red-500 bg-red-50' : ''
              ]"
              placeholder="Describe your product in detail..."
              @blur="validateField('description')"
            ></textarea>
            <p v-if="getFieldError('description')" class="text-red-500 text-sm mt-1">{{ getFieldError('description') }}</p>
            <p class="text-gray-500 text-xs mt-1">{{ newProduct.description.length }}/5000 characters</p>
          </div>

          <!-- Category Selection -->
          <div>
            <label for="category" class="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <select 
              id="category" 
              v-model="newProduct.category" 
              class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              <option value="new_category">Other (add a new category)</option>
            </select>
          </div>

          <!-- New Category Name -->
          <div v-if="newProduct.category === 'new_category'">
            <label for="newCategoryName" class="block text-sm font-medium text-text-secondary mb-1">New Category Name *</label>
            <input 
              type="text" 
              id="newCategoryName" 
              v-model="newCategoryName" 
              class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" 
              placeholder="Enter new category name"
            >
          </div>

          <!-- Product Variants Section -->
          <div class="border-t pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-text-primary">Product Variants *</h3>
              <button 
                type="button" 
                @click="addVariant" 
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                Add Variant
              </button>
            </div>
            
            <div v-if="newProduct.variants.length === 0" class="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              No variants added. Click "Add Variant" to create your first product variant.
            </div>
            
            <div v-for="(variant, index) in newProduct.variants" :key="index" class="bg-gray-50 p-4 rounded-lg mb-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-700">Variant {{ index + 1 }}</h4>
                <button 
                  type="button" 
                  @click="removeVariant(index)" 
                  class="text-red-500 hover:text-red-700"
                  v-if="newProduct.variants.length > 1"
                >
                  Remove
                </button>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- SKU -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">SKU *</label>
                  <input 
                    type="text" 
                    v-model="variant.sku" 
                    :class="[
                      'w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500',
                      getFieldError(`variants[${index}].sku`) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    ]"
                    placeholder="e.g., PROD-001"
                    @blur="validateField(`variants[${index}].sku`)"
                  >
                  <p v-if="getFieldError(`variants[${index}].sku`)" class="text-red-500 text-xs mt-1">
                    {{ getFieldError(`variants[${index}].sku`) }}
                  </p>
                </div>
                
                <!-- Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Price (₹) *</label>
                  <input 
                    type="number" 
                    v-model.number="variant.price" 
                    :class="[
                      'w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500',
                      getFieldError(`variants[${index}].price`) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    ]"
                    min="0" 
                    step="0.01"
                    placeholder="0.00"
                    @blur="validateField(`variants[${index}].price`)"
                  >
                  <p v-if="getFieldError(`variants[${index}].price`)" class="text-red-500 text-xs mt-1">
                    {{ getFieldError(`variants[${index}].price`) }}
                  </p>
                </div>
                
                <!-- Stock -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Stock *</label>
                  <input 
                    type="number" 
                    v-model.number="variant.stock" 
                    :class="[
                      'w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500',
                      getFieldError(`variants[${index}].stock`) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    ]"
                    min="0"
                    placeholder="0"
                    @blur="validateField(`variants[${index}].stock`)"
                  >
                  <p v-if="getFieldError(`variants[${index}].stock`)" class="text-red-500 text-xs mt-1">
                    {{ getFieldError(`variants[${index}].stock`) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Images -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <label class="block text-sm font-medium text-text-secondary">Product Images</label>
              <button 
                type="button" 
                @click="addImage" 
                class="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Add Image
              </button>
            </div>
            
            <div v-for="(image, index) in newProduct.images" :key="index" class="flex gap-2 mb-2">
              <input 
                type="url" 
                v-model="image.url" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="https://example.com/image.jpg"
              >
              <input 
                type="text" 
                v-model="image.altText" 
                class="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Alt text"
              >
              <button 
                type="button" 
                @click="removeImage(index)" 
                class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-text-secondary mb-1">Tags</label>
            <input 
              type="text" 
              id="tags" 
              v-model="tagsInput" 
              class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" 
              placeholder="Enter tags separated by commas (e.g., electronics, gadget, mobile)"
              @input="updateTags"
            >
            <p class="text-gray-500 text-xs mt-1">Separate tags with commas</p>
            <div v-if="newProduct.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
              <span 
                v-for="(tag, index) in newProduct.tags" 
                :key="index" 
                class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <button 
              type="submit" 
              class="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
              :disabled="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import vendorService from '../services/vendorService';
import categoryService from '../services/categoryService';
import { productValidation, errorUtils } from '../utils/validation';

const router = useRouter();

// Form data
const newProduct = ref({
  name: '',
  description: '',
  category: '',
  variants: [{
    sku: '',
    price: 0,
    stock: 0,
    attributes: [],
    status: 'active'
  }],
  images: [],
  tags: []
});

const newCategoryName = ref('');
const tagsInput = ref('');
const categories = ref([]);
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const validationErrors = ref([]);

// Computed properties
const getFieldError = computed(() => {
  return (fieldName) => {
    return errorUtils.getFieldError(validationErrors.value, fieldName);
  };
});

// Methods
const validateField = (fieldName) => {
  // Remove existing errors for this field
  validationErrors.value = validationErrors.value.filter(error => error.field !== fieldName);
  
  // Validate specific field
  let errors = [];
  
  if (fieldName === 'name') {
    errors = productValidation.validateText(newProduct.value.name, 'name', 2, 200);
  } else if (fieldName === 'description') {
    errors = productValidation.validateText(newProduct.value.description, 'description', 10, 5000);
  } else if (fieldName.startsWith('variants[')) {
    // Extract variant index and field from fieldName like "variants[0].sku"
    const match = fieldName.match(/variants\[(\d+)\]\.(\w+)/);
    if (match) {
      const variantIndex = parseInt(match[1]);
      const variantField = match[2];
      const variant = newProduct.value.variants[variantIndex];
      
      if (variantField === 'sku' && (!variant.sku || variant.sku.trim() === '')) {
        errors.push({ field: fieldName, message: `Variant ${variantIndex + 1}: SKU is required` });
      } else if (variantField === 'price' && (!variant.price || variant.price <= 0)) {
        errors.push({ field: fieldName, message: `Variant ${variantIndex + 1}: Valid price is required` });
      } else if (variantField === 'stock' && (variant.stock === undefined || variant.stock === null || variant.stock < 0)) {
        errors.push({ field: fieldName, message: `Variant ${variantIndex + 1}: Stock must be 0 or greater` });
      }
    }
  }
  
  validationErrors.value.push(...errors);
};

const validateForm = () => {
  validationErrors.value = [];
  
  // Validate entire product
  const errors = productValidation.validateProduct(newProduct.value);
  validationErrors.value = errors;
  
  return errors.length === 0;
};

const addVariant = () => {
  newProduct.value.variants.push({
    sku: '',
    price: 0,
    stock: 0,
    attributes: [],
    status: 'active'
  });
};

const removeVariant = (index) => {
  if (newProduct.value.variants.length > 1) {
    newProduct.value.variants.splice(index, 1);
    // Remove validation errors for removed variant
    validationErrors.value = validationErrors.value.filter(error => 
      !error.field.startsWith(`variants[${index}]`)
    );
  }
};

const addImage = () => {
  newProduct.value.images.push({
    url: '',
    altText: '',
    position: newProduct.value.images.length,
    isPrimary: newProduct.value.images.length === 0
  });
};

const removeImage = (index) => {
  newProduct.value.images.splice(index, 1);
  // Update positions
  newProduct.value.images.forEach((img, i) => {
    img.position = i;
    img.isPrimary = i === 0;
  });
};

const updateTags = () => {
  newProduct.value.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

const fetchCategories = async () => {
  try {
    categories.value = await categoryService.getCategories();
  } catch (err) {
    console.error('Error fetching categories:', err);
    errorMessage.value = 'Could not load categories.';
  }
};

const saveProduct = async () => {
  // Clear previous messages
  errorMessage.value = '';
  successMessage.value = '';
  
  // Validate form
  if (!validateForm()) {
    errorMessage.value = 'Please fix the validation errors before submitting.';
    return;
  }
  
  // Additional validation for new category
  if (newProduct.value.category === 'new_category') {
    if (!newCategoryName.value.trim()) {
      errorMessage.value = 'Please enter a name for the new category.';
      return;
    }
  }
  
  isSaving.value = true;
  
  try {
    // Prepare product payload
    const productPayload = {
      name: newProduct.value.name.trim(),
      description: newProduct.value.description.trim(),
      variants: newProduct.value.variants.map(variant => ({
        ...variant,
        sku: variant.sku.trim()
      })),
      images: newProduct.value.images.filter(img => img.url.trim()),
      tags: newProduct.value.tags,
      categories: newProduct.value.category && newProduct.value.category !== 'new_category' 
        ? [newProduct.value.category] 
        : [],
      newCategoryName: newProduct.value.category === 'new_category' 
        ? newCategoryName.value.trim() 
        : undefined
    };
    
    const createdProduct = await vendorService.createProduct(productPayload);
    
    successMessage.value = `Product "${createdProduct.name}" created successfully!`;
    if (newProduct.value.category === 'new_category') {
      successMessage.value += ' The new category is pending admin approval.';
    }
    
    // Reset form
    newProduct.value = {
      name: '',
      description: '',
      category: '',
      variants: [{
        sku: '',
        price: 0,
        stock: 0,
        attributes: [],
        status: 'active'
      }],
      images: [],
      tags: []
    };
    newCategoryName.value = '';
    tagsInput.value = '';
    validationErrors.value = [];
    
    // Redirect after delay
    setTimeout(() => {
      router.push('/products');
    }, 2000);
    
  } catch (err) {
    console.error('Error saving product:', err);
    errorMessage.value = err.message || 'Failed to save product. Please try again.';
  } finally {
    isSaving.value = false;
  }
};

// Initialize
onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
/* Custom styles if needed */
.card {
  @apply bg-white rounded-lg border border-gray-200;
}
</style>