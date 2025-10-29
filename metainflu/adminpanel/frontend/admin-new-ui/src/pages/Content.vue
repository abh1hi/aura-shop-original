<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Content Management</h1>
          <p class="text-sm text-gray-600 mt-1">Manage hero banners and featured collections with preview and scheduling</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-500">
            {{ activeTab === 'banners' ? banners.length : collections.length }} items
          </div>
          <button @click="refreshContent" :disabled="loading" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50">
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Enhanced Tabs with Status Indicators -->
      <div class="border-b border-gray-200 bg-white rounded-t-lg px-6">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            @click="activeTab = 'banners'"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
              activeTab === 'banners' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Hero Banners</span>
            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{{ banners.length }}</span>
          </button>
          <button 
            @click="activeTab = 'collections'"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
              activeTab === 'collections' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7v2"></path>
            </svg>
            <span>Featured Collections</span>
            <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{{ collections.length }}</span>
          </button>
          <button 
            @click="activeTab = 'preview'"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
              activeTab === 'preview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>Live Preview</span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="bg-white rounded-b-lg shadow-sm min-h-96">
        <!-- Hero Banners Tab -->
        <div v-if="activeTab === 'banners'" class="p-6">
          <!-- Filters and Actions -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <select v-model="bannerStatusFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
              </select>
              <input v-model="bannerSearchTerm" placeholder="Search banners..." class="border border-gray-300 rounded-md px-3 py-2 text-sm w-64">
            </div>
            <button @click="openBannerForm()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Add Banner</span>
            </button>
          </div>

          <!-- Banners Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="loading" class="col-span-full flex justify-center py-12">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading banners...
              </div>
            </div>
            <div v-else-if="!filteredBanners.length" class="col-span-full text-center py-12 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p>No banners found</p>
            </div>
            <div v-for="banner in filteredBanners" :key="banner._id" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <!-- Banner Preview Image -->
              <div class="h-40 bg-gray-100 overflow-hidden">
                <img v-if="banner.imageUrl" :src="banner.imageUrl" :alt="banner.title" class="w-full h-full object-cover" @error="handleImageError">
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Banner Info -->
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ banner.title }}</h3>
                  <span :class="getBannerStatusClass(banner.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ getBannerStatusText(banner.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ banner.subtitle || banner.description }}</p>
                
                <!-- Scheduling Info -->
                <div v-if="banner.scheduledStart || banner.scheduledEnd" class="text-xs text-gray-500 mb-3">
                  <div v-if="banner.scheduledStart">Start: {{ formatDateTime(banner.scheduledStart) }}</div>
                  <div v-if="banner.scheduledEnd">End: {{ formatDateTime(banner.scheduledEnd) }}</div>
                </div>
                
                <!-- Actions -->
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <button @click="previewBanner(banner)" class="text-blue-600 hover:text-blue-900 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Preview
                    </button>
                    <button @click="openBannerForm(banner)" class="text-indigo-600 hover:text-indigo-900 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </button>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="toggleBannerStatus(banner)" class="text-green-600 hover:text-green-900 text-sm">
                      {{ banner.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button @click="deleteBanner(banner._id)" class="text-red-600 hover:text-red-900 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Collections Tab -->
        <div v-if="activeTab === 'collections'" class="p-6">
          <!-- Filters and Actions -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <select v-model="collectionStatusFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <input v-model="collectionSearchTerm" placeholder="Search collections..." class="border border-gray-300 rounded-md px-3 py-2 text-sm w-64">
            </div>
            <button @click="openCollectionForm()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Add Collection</span>
            </button>
          </div>

          <!-- Collections Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="loading" class="col-span-full flex justify-center py-12">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading collections...
              </div>
            </div>
            <div v-else-if="!filteredCollections.length" class="col-span-full text-center py-12 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7v2"></path>
              </svg>
              <p>No collections found</p>
            </div>
            <div v-for="collection in filteredCollections" :key="collection._id" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <!-- Collection Preview -->
              <div class="p-4 border-b border-gray-100">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ collection.title }}</h3>
                  <span :class="getCollectionStatusClass(collection.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ getCollectionStatusText(collection.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-3">{{ collection.description }}</p>
                <div class="text-sm text-gray-500">
                  <span class="font-medium">{{ collection.products?.length || 0 }}</span> products included
                </div>
              </div>
              
              <!-- Product Preview Grid -->
              <div class="p-4">
                <div class="grid grid-cols-3 gap-2 mb-4">
                  <div v-for="product in collection.products?.slice(0, 6)" :key="product._id" class="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover" @error="handleImageError">
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                  </div>
                  <div v-if="collection.products?.length > 6" class="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <span class="text-sm text-gray-500">+{{ collection.products.length - 6 }}</span>
                  </div>
                </div>
                
                <!-- Collection Actions -->
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <button @click="previewCollection(collection)" class="text-blue-600 hover:text-blue-900 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Preview
                    </button>
                    <button @click="openCollectionForm(collection)" class="text-indigo-600 hover:text-indigo-900 text-sm">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </button>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="toggleCollectionStatus(collection)" class="text-green-600 hover:text-green-900 text-sm">
                      {{ collection.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button @click="deleteCollection(collection._id)" class="text-red-600 hover:text-red-900 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Preview Tab -->
        <div v-if="activeTab === 'preview'" class="p-6">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Live Website Preview</h3>
            <div class="flex items-center space-x-4 mb-4">
              <select v-model="previewDevice" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="desktop">Desktop View</option>
                <option value="tablet">Tablet View</option>
                <option value="mobile">Mobile View</option>
              </select>
              <button @click="refreshPreview" class="text-indigo-600 hover:text-indigo-900 text-sm">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh Preview
              </button>
            </div>
          </div>
          
          <!-- Preview Container -->
          <div class="border border-gray-300 rounded-lg overflow-hidden" :class="getPreviewContainerClass()">
            <div class="bg-gray-100 p-2 border-b border-gray-200 flex items-center space-x-2">
              <div class="flex space-x-1">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div class="text-sm text-gray-600">{{ previewUrl }}</div>
            </div>
            
            <!-- Preview Content -->
            <div class="bg-white" style="min-height: 600px;">
              <!-- Hero Banners Preview -->
              <div class="mb-8">
                <h4 class="text-lg font-semibold p-4 border-b">Hero Banners (Live)</h4>
                <div class="space-y-4 p-4">
                  <div v-for="banner in publishedBanners" :key="banner._id" class="relative h-64 rounded-lg overflow-hidden">
                    <img v-if="banner.imageUrl" :src="banner.imageUrl" :alt="banner.title" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span class="text-white text-xl font-bold">{{ banner.title }}</span>
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div class="text-center text-white">
                        <h3 class="text-2xl font-bold mb-2">{{ banner.title }}</h3>
                        <p class="text-lg mb-4">{{ banner.subtitle }}</p>
                        <button v-if="banner.link" class="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Featured Collections Preview -->
              <div>
                <h4 class="text-lg font-semibold p-4 border-b">Featured Collections (Live)</h4>
                <div class="p-4 space-y-6">
                  <div v-for="collection in publishedCollections" :key="collection._id" class="border rounded-lg p-4">
                    <h5 class="text-xl font-semibold mb-2">{{ collection.title }}</h5>
                    <p class="text-gray-600 mb-4">{{ collection.description }}</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div v-for="product in collection.products?.slice(0, 4)" :key="product._id" class="bg-gray-100 rounded-lg p-3">
                        <div class="aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden">
                          <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover">
                        </div>
                        <h6 class="text-sm font-medium truncate">{{ product.name }}</h6>
                        <p class="text-sm text-gray-500">${{ product.variants?.[0]?.price || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Banner Form Modal -->
    <div v-if="showBannerForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="text-center">
          <h3 class="text-xl leading-6 font-medium text-gray-900">{{ bannerForm.id ? 'Edit' : 'Create' }} Hero Banner</h3>
          <div class="mt-6 text-left space-y-4">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" v-model="bannerForm.title" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="bannerForm.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" v-model="bannerForm.subtitle" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input type="url" v-model="bannerForm.imageUrl" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input type="url" v-model="bannerForm.link" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <!-- Scheduling Section -->
            <div v-if="bannerForm.status === 'scheduled'" class="border-t pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">Schedule Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <input type="datetime-local" v-model="bannerForm.scheduledStart" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                  <input type="datetime-local" v-model="bannerForm.scheduledEnd" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
            </div>

            <!-- Priority and Order -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input type="number" v-model="bannerForm.order" min="1" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select v-model="bannerForm.priority" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <!-- Preview in Modal -->
            <div v-if="bannerForm.imageUrl" class="border-t pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">Preview</h4>
              <div class="relative h-48 rounded-lg overflow-hidden border">
                <img :src="bannerForm.imageUrl" :alt="bannerForm.title" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div class="text-center text-white">
                    <h3 class="text-xl font-bold mb-1">{{ bannerForm.title || 'Banner Title' }}</h3>
                    <p class="text-sm">{{ bannerForm.subtitle || 'Banner subtitle' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="flex items-center justify-between px-4 py-3 mt-6 border-t">
            <div class="flex space-x-2">
              <button @click="saveDraft('banner')" class="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                Save as Draft
              </button>
            </div>
            <div class="flex space-x-2">
              <button @click="handleBannerSubmit" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
                {{ bannerForm.status === 'draft' ? 'Save Draft' : bannerForm.status === 'scheduled' ? 'Schedule' : 'Publish' }}
              </button>
              <button @click="showBannerForm = false" class="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Collection Form Modal -->
    <div v-if="showCollectionForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div class="text-center">
          <h3 class="text-xl leading-6 font-medium text-gray-900">{{ collectionForm.id ? 'Edit' : 'Create' }} Featured Collection</h3>
          <div class="mt-6 text-left space-y-4">
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" v-model="collectionForm.title" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="collectionForm.status" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="collectionForm.description" rows="3" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>

            <!-- Scheduling Section -->
            <div v-if="collectionForm.status === 'scheduled'" class="border-t pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">Schedule Settings</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                  <input type="datetime-local" v-model="collectionForm.scheduledStart" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                  <input type="datetime-local" v-model="collectionForm.scheduledEnd" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
            </div>
            
            <!-- Product Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Select Products *</label>
              <div class="border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div v-for="product in allProducts" :key="product._id" class="flex items-center space-x-2">
                    <input type="checkbox" :value="product._id" v-model="collectionForm.products" class="form-checkbox h-4 w-4 text-indigo-600" />
                    <span class="text-sm text-gray-700">{{ product.name }}</span>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ collectionForm.products.length }} products selected</p>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="flex items-center justify-between px-4 py-3 mt-6 border-t">
            <div class="flex space-x-2">
              <button @click="saveDraft('collection')" class="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                Save as Draft
              </button>
            </div>
            <div class="flex space-x-2">
              <button @click="handleCollectionSubmit" class="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">
                {{ collectionForm.status === 'draft' ? 'Save Draft' : collectionForm.status === 'scheduled' ? 'Schedule' : 'Publish' }}
              </button>
              <button @click="showCollectionForm = false" class="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../services/api';

// Reactive data
const activeTab = ref('banners');
const banners = ref([]);
const collections = ref([]);
const allProducts = ref([]);
const loading = ref(false);

// Modal states
const showBannerForm = ref(false);
const showCollectionForm = ref(false);

// Form data
const bannerForm = ref({
  id: null, 
  title: '', 
  subtitle: '', 
  imageUrl: '', 
  link: '',
  status: 'draft',
  scheduledStart: '',
  scheduledEnd: '',
  order: 1,
  priority: 'medium'
});

const collectionForm = ref({
  id: null, 
  title: '', 
  description: '', 
  products: [],
  status: 'draft',
  scheduledStart: '',
  scheduledEnd: ''
});

// Preview settings
const previewDevice = ref('desktop');
const previewUrl = 'localhost:5173 (Preview)';

// Search and filter
const bannerStatusFilter = ref('');
const collectionStatusFilter = ref('');
const bannerSearchTerm = ref('');
const collectionSearchTerm = ref('');

// Computed properties
const filteredBanners = computed(() => {
  let filtered = banners.value;
  
  if (bannerStatusFilter.value) {
    filtered = filtered.filter(banner => banner.status === bannerStatusFilter.value);
  }
  
  if (bannerSearchTerm.value) {
    filtered = filtered.filter(banner => 
      banner.title?.toLowerCase().includes(bannerSearchTerm.value.toLowerCase()) ||
      banner.subtitle?.toLowerCase().includes(bannerSearchTerm.value.toLowerCase())
    );
  }
  
  return filtered;
});

const filteredCollections = computed(() => {
  let filtered = collections.value;
  
  if (collectionStatusFilter.value) {
    filtered = filtered.filter(collection => collection.status === collectionStatusFilter.value);
  }
  
  if (collectionSearchTerm.value) {
    filtered = filtered.filter(collection => 
      collection.title?.toLowerCase().includes(collectionSearchTerm.value.toLowerCase()) ||
      collection.description?.toLowerCase().includes(collectionSearchTerm.value.toLowerCase())
    );
  }
  
  return filtered;
});

const publishedBanners = computed(() => {
  return banners.value.filter(banner => banner.status === 'published');
});

const publishedCollections = computed(() => {
  return collections.value.filter(collection => collection.status === 'published');
});

// Methods
const formatDateTime = (dateString) => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleString();
};

const getBannerStatusClass = (status) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getBannerStatusText = (status) => {
  switch (status) {
    case 'published': return 'Live';
    case 'draft': return 'Draft';
    case 'scheduled': return 'Scheduled';
    case 'expired': return 'Expired';
    default: return 'Unknown';
  }
};

const getCollectionStatusClass = (status) => {
  return getBannerStatusClass(status);
};

const getCollectionStatusText = (status) => {
  return getBannerStatusText(status);
};

const getPreviewContainerClass = () => {
  switch (previewDevice.value) {
    case 'mobile': return 'max-w-sm mx-auto';
    case 'tablet': return 'max-w-2xl mx-auto';
    default: return 'w-full';
  }
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMMTYgNE0xNiA0SDE2LjAxTTE2IDRWNEg0VjE2SDIwVjEySDIwLjAxIiBzdHJva2U9IiM5Q0E3QzIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
};

// CRUD operations
const fetchBanners = async () => {
  try {
    loading.value = true;
    const response = await apiClient.admin.get('/content/herobanners');
    banners.value = response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
  } finally {
    loading.value = false;
  }
};

const fetchCollections = async () => {
  try {
    loading.value = true;
    const response = await apiClient.admin.get('/content/featuredcollections');
    collections.value = response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
  } finally {
    loading.value = false;
  }
};

const fetchAllProducts = async () => {
  try {
    const response = await apiClient.admin.get('/products', { params: { limit: 1000 } });
    allProducts.value = response.data.products || response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const refreshContent = async () => {
  await Promise.all([fetchBanners(), fetchCollections(), fetchAllProducts()]);
};

const openBannerForm = (banner = null) => {
  if (banner) {
    bannerForm.value = {
      id: banner._id,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      link: banner.link || '',
      status: banner.status || 'draft',
      scheduledStart: banner.scheduledStart || '',
      scheduledEnd: banner.scheduledEnd || '',
      order: banner.order || 1,
      priority: banner.priority || 'medium'
    };
  } else {
    bannerForm.value = {
      id: null,
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '',
      status: 'draft',
      scheduledStart: '',
      scheduledEnd: '',
      order: 1,
      priority: 'medium'
    };
  }
  showBannerForm.value = true;
};

const openCollectionForm = (collection = null) => {
  if (collection) {
    collectionForm.value = {
      id: collection._id,
      title: collection.title || '',
      description: collection.description || '',
      products: collection.products?.map(p => p._id || p) || [],
      status: collection.status || 'draft',
      scheduledStart: collection.scheduledStart || '',
      scheduledEnd: collection.scheduledEnd || ''
    };
  } else {
    collectionForm.value = {
      id: null,
      title: '',
      description: '',
      products: [],
      status: 'draft',
      scheduledStart: '',
      scheduledEnd: ''
    };
  }
  showCollectionForm.value = true;
};

const handleBannerSubmit = async () => {
  try {
    if (bannerForm.value.id) {
      await apiClient.admin.put(`/content/herobanners/${bannerForm.value.id}`, bannerForm.value);
    } else {
      await apiClient.admin.post('/content/herobanners', bannerForm.value);
    }
    showBannerForm.value = false;
    await fetchBanners();
  } catch (error) {
    console.error('Error saving banner:', error);
    alert('Error saving banner. Please try again.');
  }
};

const handleCollectionSubmit = async () => {
  try {
    if (collectionForm.value.id) {
      await apiClient.admin.put(`/content/featuredcollections/${collectionForm.value.id}`, collectionForm.value);
    } else {
      await apiClient.admin.post('/content/featuredcollections', collectionForm.value);
    }
    showCollectionForm.value = false;
    await fetchCollections();
  } catch (error) {
    console.error('Error saving collection:', error);
    alert('Error saving collection. Please try again.');
  }
};

const saveDraft = async (type) => {
  if (type === 'banner') {
    bannerForm.value.status = 'draft';
    await handleBannerSubmit();
  } else {
    collectionForm.value.status = 'draft';
    await handleCollectionSubmit();
  }
};

const toggleBannerStatus = async (banner) => {
  const newStatus = banner.status === 'published' ? 'draft' : 'published';
  try {
    await apiClient.admin.put(`/content/herobanners/${banner._id}`, { ...banner, status: newStatus });
    await fetchBanners();
  } catch (error) {
    console.error('Error updating banner status:', error);
  }
};

const toggleCollectionStatus = async (collection) => {
  const newStatus = collection.status === 'published' ? 'draft' : 'published';
  try {
    await apiClient.admin.put(`/content/featuredcollections/${collection._id}`, { ...collection, status: newStatus });
    await fetchCollections();
  } catch (error) {
    console.error('Error updating collection status:', error);
  }
};

const deleteBanner = async (id) => {
  const banner = banners.value.find(b => b._id === id);
  if (!confirm(`Are you sure you want to delete "${banner?.title}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await apiClient.admin.delete(`/content/herobanners/${id}`);
    await fetchBanners();
  } catch (error) {
    console.error('Error deleting banner:', error);
  }
};

const deleteCollection = async (id) => {
  const collection = collections.value.find(c => c._id === id);
  if (!confirm(`Are you sure you want to delete "${collection?.title}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await apiClient.admin.delete(`/content/featuredcollections/${id}`);
    await fetchCollections();
  } catch (error) {
    console.error('Error deleting collection:', error);
  }
};

const previewBanner = (banner) => {
  // Open preview modal or navigate to preview
  console.log('Previewing banner:', banner);
};

const previewCollection = (collection) => {
  // Open preview modal or navigate to preview
  console.log('Previewing collection:', collection);
};

const refreshPreview = () => {
  // Refresh the preview content
  console.log('Refreshing preview for device:', previewDevice.value);
};

// Lifecycle
onMounted(() => {
  refreshContent();
});
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>