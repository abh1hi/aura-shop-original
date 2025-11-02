<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <router-link to="/products" class="p-2 rounded-full hover:bg-gray-100">
        <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold text-text-primary">Edit Product</h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Product Form -->
    <div v-else-if="product">
      <!-- Desktop View -->
      <div class="hidden md:block max-w-3xl mx-auto">
        <div class="card p-6 sm:p-8">
          <!-- Success Message -->
          <div v-if="successMessage" class="bg-green-100 text-green-600 p-4 rounded-lg mb-6">
            {{ successMessage }}
          </div>
          
          <!-- Error Messages -->
          <ValidationMessage 
            v-if="errorMessage"
            :errors="[{ field: 'general', message: errorMessage }]"
            :show-title="false"
            class="mb-6"
          />
          
          <!-- Validation Errors -->
          <ValidationMessage 
            v-if="validationErrors.length > 0"
            :errors="validationErrors"
            display-mode="grouped"
            class="mb-6"
          />

          <form @submit.prevent="saveProduct" class="space-y-6">
            <!-- Product Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Product Name *</label>
              <input 
                type="text" 
                id="name" 
                v-model="product.name" 
                :class="[
                  'mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary',
                  getFieldError('name') ? 'border-red-500 bg-red-50' : ''
                ]"
                placeholder="Enter product name"
                @blur="validateField('name')"
              >
              <p v-if="getFieldError('name')" class="text-red-500 text-sm mt-1">{{ getFieldError('name') }}</p>
            </div>

            <!-- Brand Selection -->
            <div>
              <label for="brand" class="block text-sm font-medium text-text-secondary mb-1">Brand</label>
              <select 
                id="brand" 
                v-model="selectedBrand" 
                class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="">Select Brand</option>
                <option v-for="brand in brands" :key="brand._id" :value="brand._id">{{ brand.storeName }}</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-text-secondary mb-1">Description *</label>
              <textarea 
                id="description" 
                rows="4" 
                v-model="product.description" 
                :class="[
                  'mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary',
                  getFieldError('description') ? 'border-red-500 bg-red-50' : ''
                ]"
                placeholder="Describe your product in detail..."
                @blur="validateField('description')"
              ></textarea>
              <p v-if="getFieldError('description')" class="text-red-500 text-sm mt-1">{{ getFieldError('description') }}</p>
              <p class="text-gray-500 text-xs mt-1">{{ (product.description || '').length }}/5000 characters</p>
            </div>

            <!-- Category Selection -->
            <div>
              <label for="category" class="block text-sm font-medium text-text-secondary mb-1">Category</label>
              <select 
                id="category" 
                v-model="selectedCategory" 
                class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="">Select Category</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              </select>
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
              
              <div v-if="product.variants.length === 0" class="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                No variants found. Click "Add Variant" to create a product variant.
              </div>
              
              <div v-for="(variant, index) in product.variants" :key="variant._id || index" class="bg-gray-50 p-4 rounded-lg mb-4">
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-medium text-gray-700">Variant {{ index + 1 }}</h4>
                  <button 
                    type="button" 
                    @click="removeVariant(index)" 
                    class="text-red-500 hover:text-red-700"
                    v-if="product.variants.length > 1"
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
                      @blur="validateField(`variants[${index}].stock`)"
                    >
                    <p v-if="getFieldError(`variants[${index}].stock`)" class="text-red-500 text-xs mt-1">
                      {{ getFieldError(`variants[${index}].stock`) }}
                    </p>
                  </div>
                </div>
                
                <!-- Variant Status -->
                <div class="mt-3">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select v-model="variant.status" class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
              
              <div v-for="(image, index) in product.images" :key="image._id || index" class="flex gap-2 mb-2">
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
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="image.isPrimary" 
                    @change="setPrimaryImage(index)"
                    class="mr-1"
                  >
                  <label class="text-xs text-gray-600 mr-2">Primary</label>
                </div>
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
                placeholder="Enter tags separated by commas"
                @input="updateTags"
              >
              <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span 
                  v-for="(tag, index) in product.tags" 
                  :key="index" 
                  class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Product Status -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="lifecycleStatus" class="block text-sm font-medium text-text-secondary mb-1">Lifecycle Status</label>
                <select 
                  id="lifecycleStatus" 
                  v-model="product.lifecycleStatus" 
                  class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Features</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" v-model="product.isFeatured" class="mr-2">
                    <span class="text-sm">Featured Product</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="product.isArchived" class="mr-2">
                    <span class="text-sm">Archived</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between pt-6">
              <button 
                type="button" 
                @click="deleteProductConfirm" 
                class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                :disabled="isSaving"
              >
                Delete Product
              </button>
              
              <button 
                type="submit" 
                class="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Update Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Mobile View -->
      <div class="block md:hidden">
        <div class="card p-6 sm:p-8">
          <!-- Tabs -->
          <div class="border-b border-gray-200 mb-4">
            <nav class="-mb-px flex space-x-4" aria-label="Tabs">
              <button @click="currentTab = 'general'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', currentTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                General
              </button>
              <button @click="currentTab = 'variants'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', currentTab === 'variants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                Variants
              </button>
              <button @click="currentTab = 'images'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', currentTab === 'images' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                Images
              </button>
              <button @click="currentTab = 'details'" :class="['whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm', currentTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                Details
              </button>
            </nav>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-6">
            <!-- General Tab -->
            <div v-if="currentTab === 'general'">
              <!-- Product Name -->
              <div>
                <label for="name-mobile" class="block text-sm font-medium text-text-secondary mb-1">Product Name *</label>
                <input 
                  type="text" 
                  id="name-mobile" 
                  v-model="product.name" 
                  :class="[
                    'mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary',
                    getFieldError('name') ? 'border-red-500 bg-red-50' : ''
                  ]"
                  placeholder="Enter product name"
                  @blur="validateField('name')"
                >
                <p v-if="getFieldError('name')" class="text-red-500 text-sm mt-1">{{ getFieldError('name') }}</p>
              </div>

              <!-- Brand Selection -->
              <div>
                <label for="brand-mobile" class="block text-sm font-medium text-text-secondary mb-1">Brand</label>
                <select 
                  id="brand-mobile" 
                  v-model="selectedBrand" 
                  class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Brand</option>
                  <option v-for="brand in brands" :key="brand._id" :value="brand._id">{{ brand.storeName }}</option>
                </select>
              </div>

              <!-- Description -->
              <div>
                <label for="description-mobile" class="block text-sm font-medium text-text-secondary mb-1">Description *</label>
                <textarea 
                  id="description-mobile" 
                  rows="4" 
                  v-model="product.description" 
                  :class="[
                    'mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary',
                    getFieldError('description') ? 'border-red-500 bg-red-50' : ''
                  ]"
                  placeholder="Describe your product in detail..."
                  @blur="validateField('description')"
                ></textarea>
                <p v-if="getFieldError('description')" class="text-red-500 text-sm mt-1">{{ getFieldError('description') }}</p>
                <p class="text-gray-500 text-xs mt-1">{{ (product.description || '').length }}/5000 characters</p>
              </div>

              <!-- Category Selection -->
              <div>
                <label for="category-mobile" class="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <select 
                  id="category-mobile" 
                  v-model="selectedCategory" 
                  class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Category</option>
                  <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
                </select>
              </div>
            </div>

            <!-- Variants Tab -->
            <div v-if="currentTab === 'variants'">
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
                
                <div v-if="product.variants.length === 0" class="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  No variants found. Click "Add Variant" to create a product variant.
                </div>
                
                <div v-for="(variant, index) in product.variants" :key="variant._id || index" class="bg-gray-50 p-4 rounded-lg mb-4">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="font-medium text-gray-700">Variant {{ index + 1 }}</h4>
                    <button 
                      type="button" 
                      @click="removeVariant(index)" 
                      class="text-red-500 hover:text-red-700"
                      v-if="product.variants.length > 1"
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
                        @blur="validateField(`variants[${index}].stock`)"
                      >
                      <p v-if="getFieldError(`variants[${index}].stock`)" class="text-red-500 text-xs mt-1">
                        {{ getFieldError(`variants[${index}].stock`) }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Variant Status -->
                  <div class="mt-3">
                    <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    <select v-model="variant.status" class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Images Tab -->
            <div v-if="currentTab === 'images'">
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
                
                <div v-for="(image, index) in product.images" :key="image._id || index" class="flex gap-2 mb-2">
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
                  <div class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="image.isPrimary" 
                      @change="setPrimaryImage(index)"
                      class="mr-1"
                    >
                    <label class="text-xs text-gray-600 mr-2">Primary</label>
                  </div>
                  <button 
                    type="button" 
                    @click="removeImage(index)" 
                    class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Details Tab -->
            <div v-if="currentTab === 'details'">
              <!-- Tags -->
              <div>
                <label for="tags-mobile" class="block text-sm font-medium text-text-secondary mb-1">Tags</label>
                <input 
                  type="text" 
                  id="tags-mobile" 
                  v-model="tagsInput" 
                  class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" 
                  placeholder="Enter tags separated by commas"
                  @input="updateTags"
                >
                <div v-if="product.tags && product.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                  <span 
                    v-for="(tag, index) in product.tags" 
                    :key="index" 
                    class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Product Status -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="lifecycleStatus-mobile" class="block text-sm font-medium text-text-secondary mb-1">Lifecycle Status</label>
                  <select 
                    id="lifecycleStatus-mobile" 
                    v-model="product.lifecycleStatus" 
                    class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-text-secondary mb-1">Features</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox" v-model="product.isFeatured" class="mr-2">
                      <span class="text-sm">Featured Product</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" v-model="product.isArchived" class="mr-2">
                      <span class="text-sm">Archived</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between pt-6">
              <button 
                type="button" 
                @click="deleteProductConfirm" 
                class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                :disabled="isSaving"
              >
                Delete Product
              </button>
              
              <button 
                type="submit" 
                class="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Update Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">Product not found or you don't have permission to edit it.</p>
      <router-link to="/products" class="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
        Back to Products
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vendorService from '../services/vendorService';
import categoryService from '../services/categoryService';
import vendorBrandService from '../services/vendorBrandService';
import { productValidation, errorUtils } from '../utils/validation';
import ValidationMessage from '../components/ValidationMessage.vue';

const route = useRoute();
const router = useRouter();

// Reactive data
const product = ref(null);
const categories = ref([]);
const brands = ref([]);
const selectedCategory = ref('');
const selectedBrand = ref('');
const tagsInput = ref('');
const isLoading = ref(true);
const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const validationErrors = ref([]);
const currentTab = ref('general');

// Computed
const getFieldError = computed(() => {
  return (fieldName) => {
    return errorUtils.getFieldError(validationErrors.value, fieldName);
  };
});

// Methods
const validateField = (fieldName) => {
  // Remove existing errors for this field
  validationErrors.value = validationErrors.value.filter(error => error.field !== fieldName);
  
  let errors = [];
  
  if (fieldName === 'name') {
    errors = productValidation.validateText(product.value.name, 'name', 2, 200);
  } else if (fieldName === 'description') {
    errors = productValidation.validateText(product.value.description, 'description', 10, 5000);
  } else if (fieldName.startsWith('variants[')) {
    const match = fieldName.match(/variants\[(\d+)\]\.(\w+)/);
    if (match) {
      const variantIndex = parseInt(match[1]);
      const variantField = match[2];
      const variant = product.value.variants[variantIndex];
      
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
  const errors = productValidation.validateProduct({ ...product.value, brand: selectedBrand.value });
  validationErrors.value = errors;
  return errors.length === 0;
};

const addVariant = () => {
  product.value.variants.push({
    sku: '',
    price: 0,
    stock: 0,
    attributes: [],
    status: 'active'
  });
};

const removeVariant = (index) => {
  if (product.value.variants.length > 1) {
    product.value.variants.splice(index, 1);
    validationErrors.value = validationErrors.value.filter(error => 
      !error.field.startsWith(`variants[${index}]`)
    );
  }
};

const addImage = () => {
  if (!product.value.images) {
    product.value.images = [];
  }
  product.value.images.push({
    url: '',
    altText: '',
    position: product.value.images.length,
    isPrimary: product.value.images.length === 0
  });
};

const removeImage = (index) => {
  product.value.images.splice(index, 1);
  // Update positions and primary status
  product.value.images.forEach((img, i) => {
    img.position = i;
    if (i === 0 && product.value.images.length > 0) {
      img.isPrimary = true;
    } else if (img.isPrimary && i !== 0) {
      img.isPrimary = false;
    }
  });
};

const setPrimaryImage = (index) => {
  product.value.images.forEach((img, i) => {
    img.isPrimary = i === index;
  });
};

const updateTags = () => {
  product.value.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

const fetchProduct = async () => {
  try {
    const productId = route.params.id;
    const products = await vendorService.getVendorProducts();
    const foundProduct = products.find(p => p._id === productId);
    
    if (foundProduct) {
      product.value = { ...foundProduct };
      
      // Ensure variants array exists
      if (!product.value.variants || product.value.variants.length === 0) {
        product.value.variants = [{
          sku: 'default-sku',
          price: 0,
          stock: 0,
          attributes: [],
          status: 'active'
        }];
      }
      
      // Ensure images array exists
      if (!product.value.images) {
        product.value.images = [];
      }
      
      // Set category
      if (product.value.categories && product.value.categories.length > 0) {
        selectedCategory.value = product.value.categories[0]._id || product.value.categories[0];
      }

      // Set brand
      if (product.value.brand) {
        selectedBrand.value = product.value.brand._id || product.value.brand;
      }
      
      // Set tags input
      if (product.value.tags) {
        tagsInput.value = product.value.tags.join(', ');
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    errorMessage.value = 'Failed to load product details.';
  } finally {
    isLoading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    categories.value = await categoryService.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchBrands = async () => {
  try {
    const response = await vendorBrandService.getBrands();
    brands.value = response.data;
  } catch (error) {
    console.error('Failed to fetch brands:', error);
  }
};

const saveProduct = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  
  if (!validateForm()) {
    errorMessage.value = 'Please fix the validation errors before submitting.';
    return;
  }
  
  isSaving.value = true;
  
  try {
    // Prepare update payload
    const updatePayload = {
      name: product.value.name?.trim(),
      description: product.value.description?.trim(),
      brand: selectedBrand.value,
      variants: product.value.variants.map(variant => ({
        ...variant,
        sku: variant.sku?.trim()
      })),
      images: product.value.images?.filter(img => img.url?.trim()) || [],
      tags: product.value.tags || [],
      categories: selectedCategory.value ? [selectedCategory.value] : [],
      lifecycleStatus: product.value.lifecycleStatus,
      isFeatured: product.value.isFeatured,
      isArchived: product.value.isArchived
    };
    
    const updatedProduct = await vendorService.updateProduct(product.value._id, updatePayload);
    
    successMessage.value = `Product "${updatedProduct.name}" updated successfully!`;
    
    // Update local product data
    product.value = { ...updatedProduct };
    validationErrors.value = [];
    
  } catch (error) {
    console.error('Error updating product:', error);
    errorMessage.value = error.message || 'Failed to update product. Please try again.';
  } finally {
    isSaving.value = false;
  }
};

const deleteProductConfirm = async () => {
  if (confirm(`Are you sure you want to delete "${product.value.name}"? This action cannot be undone.`)) {
    try {
      await vendorService.deleteProduct(product.value._id);
      router.push('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      errorMessage.value = error.message || 'Failed to delete product.';
    }
  }
};

// Initialize
onMounted(() => {
  Promise.all([
    fetchProduct(),
    fetchCategories(),
    fetchBrands()
  ]);
});
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg border border-gray-200;
}
</style>