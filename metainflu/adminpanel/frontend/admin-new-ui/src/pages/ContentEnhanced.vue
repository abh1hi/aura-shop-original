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
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ contentStats.banners || 0 }} banners, {{ contentStats.collections || 0 }} collections</span>
          </div>
          <button @click="refreshContent" :disabled="loading" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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

          <!-- Banner Status Overview -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-600">{{ getBannersBy('published').length }}</div>
              <div class="text-sm text-gray-600">Published</div>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-yellow-600">{{ getBannersBy('draft').length }}</div>
              <div class="text-sm text-gray-600">Drafts</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ getBannersBy('scheduled').length }}</div>
              <div class="text-sm text-gray-600">Scheduled</div>
            </div>
            <div class="bg-red-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-red-600">{{ getBannersBy('expired').length }}</div>
              <div class="text-sm text-gray-600">Expired</div>
            </div>
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
              <p class="text-lg font-medium mb-2">No banners found</p>
              <button @click="openBannerForm()" class="text-indigo-600 hover:text-indigo-500">Create your first banner</button>
            </div>
            
            <!-- Banner Cards -->
            <div v-for="banner in filteredBanners" :key="banner._id" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <!-- Banner Preview Image -->
              <div class="relative h-40 bg-gray-100 overflow-hidden">
                <img v-if="banner.imageUrl" :src="banner.imageUrl" :alt="banner.title" class="w-full h-full object-cover" @error="handleImageError">
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400">
                  <span class="text-white text-lg font-bold">{{ banner.title || 'No Title' }}</span>
                </div>
                
                <!-- Status Badge -->
                <div class="absolute top-2 right-2">
                  <span :class="getBannerStatusClass(banner.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                    {{ getBannerStatusText(banner.status) }}
                  </span>
                </div>
                
                <!-- Priority Badge -->
                <div v-if="banner.priority === 'high'" class="absolute top-2 left-2">
                  <span class="bg-red-500 text-white px-2 py-1 text-xs rounded-full font-medium">
                    HIGH PRIORITY
                  </span>
                </div>
              </div>
              
              <!-- Banner Info -->
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ banner.title || 'Untitled Banner' }}</h3>
                  <span class="text-sm text-gray-500">#{{ banner.order || 1 }}</span>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ banner.subtitle || 'No subtitle' }}</p>
                
                <!-- Scheduling Info -->
                <div v-if="banner.scheduledStart || banner.scheduledEnd" class="text-xs text-gray-500 mb-3 bg-blue-50 p-2 rounded">
                  <div v-if="banner.scheduledStart" class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Start: {{ formatDateTime(banner.scheduledStart) }}
                  </div>
                  <div v-if="banner.scheduledEnd" class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    End: {{ formatDateTime(banner.scheduledEnd) }}
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex items-center justify-between">
                  <div class="flex space-x-2">
                    <button @click="previewBanner(banner)" class="text-blue-600 hover:text-blue-900 text-sm flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Preview
                    </button>
                    <button @click="openBannerForm(banner)" class="text-indigo-600 hover:text-indigo-900 text-sm flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </button>
                  </div>
                  <div class="flex space-x-2">
                    <button @click="toggleBannerStatus(banner)" class="text-green-600 hover:text-green-900 text-sm">
                      {{ banner.status === 'published' ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button @click="deleteBanner(banner._id, banner.title)" class="text-red-600 hover:text-red-900 text-sm">
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

          <!-- Collection Status Overview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-600">{{ getCollectionsBy('published').length }}</div>
              <div class="text-sm text-gray-600">Published</div>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-yellow-600">{{ getCollectionsBy('draft').length }}</div>
              <div class="text-sm text-gray-600">Drafts</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ getCollectionsBy('scheduled').length }}</div>
              <div class="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>

          <!-- Collections List -->
          <div class="space-y-4">
            <div v-if="loading" class="flex justify-center py-12">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading collections...
              </div>
            </div>
            <div v-else-if="!filteredCollections.length" class="text-center py-12 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7v2"></path>
              </svg>
              <p class="text-lg font-medium mb-2">No collections found</p>
              <button @click="openCollectionForm()" class="text-purple-600 hover:text-purple-500">Create your first collection</button>
            </div>
            
            <!-- Collection Cards -->
            <div v-for="collection in filteredCollections" :key="collection._id" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">{{ collection.title || 'Untitled Collection' }}</h3>
                    <span :class="getCollectionStatusClass(collection.status)" class="px-2 py-1 text-xs rounded-full font-medium">
                      {{ getCollectionStatusText(collection.status) }}
                    </span>
                  </div>
                  <p class="text-gray-600 mb-2 line-clamp-2">{{ collection.description || 'No description available' }}</p>
                  <div class="text-sm text-gray-500">
                    <span class="font-medium">{{ collection.products?.length || 0 }}</span> products included
                  </div>
                </div>
              </div>
              
              <!-- Product Preview Thumbnails -->
              <div v-if="collection.products?.length" class="mb-4">
                <div class="grid grid-cols-6 gap-2">
                  <div v-for="product in collection.products.slice(0, 6)" :key="product._id" class="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                  </div>
                  <div v-if="collection.products.length > 6" class="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                    <span class="text-xs text-gray-500 font-medium">+{{ collection.products.length - 6 }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Scheduling Info -->
              <div v-if="collection.scheduledStart || collection.scheduledEnd" class="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded">
                <div class="font-medium mb-1">Scheduling:</div>
                <div v-if="collection.scheduledStart">Start: {{ formatDateTime(collection.scheduledStart) }}</div>
                <div v-if="collection.scheduledEnd">End: {{ formatDateTime(collection.scheduledEnd) }}</div>
              </div>
              
              <!-- Collection Actions -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div class="flex space-x-3">
                  <button @click="previewCollection(collection)" class="text-blue-600 hover:text-blue-900 text-sm flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Preview
                  </button>
                  <button @click="openCollectionForm(collection)" class="text-indigo-600 hover:text-indigo-900 text-sm flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                </div>
                <div class="flex space-x-3">
                  <button @click="toggleCollectionStatus(collection)" class="text-green-600 hover:text-green-900 text-sm">
                    {{ collection.status === 'published' ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button @click="deleteCollection(collection._id, collection.title)" class="text-red-600 hover:text-red-900 text-sm">
                    Delete
                  </button>
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
              <h4 class="text-md font-medium text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Schedule Settings
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label>
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

            <!-- Live Preview in Modal -->
            <div v-if="bannerForm.title && bannerForm.imageUrl" class="border-t pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">Live Preview</h4>
              <div class="relative h-48 rounded-lg overflow-hidden border">
                <img :src="bannerForm.imageUrl" :alt="bannerForm.title" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div class="text-center text-white">
                    <h3 class="text-xl font-bold mb-1">{{ bannerForm.title }}</h3>
                    <p class="text-sm">{{ bannerForm.subtitle }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="flex items-center justify-between px-4 py-3 mt-6 border-t">
            <div class="flex space-x-2">
              <button @click="saveBannerDraft" class="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                Save as Draft
              </button>
              <button v-if="bannerForm.id" @click="previewBanner(bannerForm)" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Preview
              </button>
            </div>
            <div class="flex space-x-2">
              <button @click="handleBannerSubmit" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
                {{ bannerForm.status === 'draft' ? 'Save Draft' : bannerForm.status === 'scheduled' ? 'Schedule Banner' : 'Publish Banner' }}
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
              <h4 class="text-md font-medium text-gray-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Schedule Settings
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time *</label>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Select Products * ({{ collectionForm.products.length }} selected)</label>
              <div class="border border-gray-300 rounded-md p-4 max-h-64 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div v-for="product in allProducts" :key="product._id" class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <input type="checkbox" :value="product._id" v-model="collectionForm.products" class="form-checkbox h-4 w-4 text-indigo-600" />
                    <div class="flex-1">
                      <span class="text-sm text-gray-700">{{ product.name }}</span>
                      <span class="text-xs text-gray-500 ml-2">${{ product.variants?.[0]?.price || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="flex items-center justify-between px-4 py-3 mt-6 border-t">
            <div class="flex space-x-2">
              <button @click="saveCollectionDraft" class="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                Save as Draft
              </button>
              <button v-if="collectionForm.id" @click="previewCollection(collectionForm)" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Preview
              </button>
            </div>
            <div class="flex space-x-2">
              <button @click="handleCollectionSubmit" class="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">
                {{ collectionForm.status === 'draft' ? 'Save Draft' : collectionForm.status === 'scheduled' ? 'Schedule Collection' : 'Publish Collection' }}
              </button>
              <button @click="showCollectionForm = false" class="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <ContentPreviewModal 
      :show="showPreview" 
      :preview-type="previewType" 
      :preview-item="previewItem" 
      :all-products="allProducts"
      @close="showPreview = false"
      @edit="editFromPreview"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../services/api';
import ContentPreviewModal from '../components/ContentPreviewModal.vue';

// Reactive data
const activeTab = ref('banners');
const banners = ref([]);
const collections = ref([]);
const allProducts = ref([]);
const loading = ref(false);

// Content statistics
const contentStats = ref({
  banners: 0,
  collections: 0
});

// Modal states
const showBannerForm = ref(false);
const showCollectionForm = ref(false);
const showPreview = ref(false);

// Preview data
const previewType = ref('banner');
const previewItem = ref(null);

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
  
  return filtered.sort((a, b) => (a.order || 1) - (b.order || 1));
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

// Helper methods
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
    case 'published': return 'LIVE';
    case 'draft': return 'DRAFT';
    case 'scheduled': return 'SCHEDULED';
    case 'expired': return 'EXPIRED';
    default: return 'UNKNOWN';
  }
};

const getCollectionStatusClass = getBannerStatusClass;
const getCollectionStatusText = getBannerStatusText;

const getBannersBy = (status) => {
  return banners.value.filter(banner => banner.status === status);
};

const getCollectionsBy = (status) => {
  return collections.value.filter(collection => collection.status === status);
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMMTYgNE0xNiA0SDE2LjAxTTE2IDRWNEg0VjE2SDIwVjEySDIwLjAxIiBzdHJva2U9IiM5Q0E3QzIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
};

// CRUD operations
const fetchBanners = async () => {
  try {
    const response = await apiClient.admin.get('/content/herobanners');
    banners.value = response.data || [];
    contentStats.value.banners = banners.value.length;
  } catch (error) {
    console.error('Error fetching banners:', error);
    banners.value = [];
  }
};

const fetchCollections = async () => {
  try {
    const response = await apiClient.admin.get('/content/featuredcollections');
    collections.value = response.data || [];
    contentStats.value.collections = collections.value.length;
  } catch (error) {
    console.error('Error fetching collections:', error);
    collections.value = [];
  }
};

const fetchAllProducts = async () => {
  try {
    const response = await apiClient.admin.get('/products', { params: { limit: 1000 } });
    allProducts.value = response.data.products || response.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    allProducts.value = [];
  }
};

const refreshContent = async () => {
  loading.value = true;
  await Promise.all([fetchBanners(), fetchCollections(), fetchAllProducts()]);
  loading.value = false;
};

// Form methods
const openBannerForm = (banner = null) => {
  if (banner) {
    bannerForm.value = {
      id: banner._id,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      link: banner.link || '',
      status: banner.status || 'draft',
      scheduledStart: banner.scheduledStart ? new Date(banner.scheduledStart).toISOString().slice(0, 16) : '',
      scheduledEnd: banner.scheduledEnd ? new Date(banner.scheduledEnd).toISOString().slice(0, 16) : '',
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
      order: (banners.value.length + 1),
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
      scheduledStart: collection.scheduledStart ? new Date(collection.scheduledStart).toISOString().slice(0, 16) : '',
      scheduledEnd: collection.scheduledEnd ? new Date(collection.scheduledEnd).toISOString().slice(0, 16) : ''
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
    loading.value = true;
    if (bannerForm.value.id) {
      await apiClient.admin.put(`/content/herobanners/${bannerForm.value.id}`, bannerForm.value);
    } else {
      await apiClient.admin.post('/content/herobanners', bannerForm.value);
    }
    showBannerForm.value = false;
    await fetchBanners();
  } catch (error) {
    console.error('Error saving banner:', error);
    alert('Error saving banner. Please check your inputs and try again.');
  } finally {
    loading.value = false;
  }
};

const handleCollectionSubmit = async () => {
  try {
    loading.value = true;
    if (collectionForm.value.id) {
      await apiClient.admin.put(`/content/featuredcollections/${collectionForm.value.id}`, collectionForm.value);
    } else {
      await apiClient.admin.post('/content/featuredcollections', collectionForm.value);
    }
    showCollectionForm.value = false;
    await fetchCollections();
  } catch (error) {
    console.error('Error saving collection:', error);
    alert('Error saving collection. Please check your inputs and try again.');
  } finally {
    loading.value = false;
  }
};

const saveBannerDraft = async () => {
  bannerForm.value.status = 'draft';
  await handleBannerSubmit();
};

const saveCollectionDraft = async () => {
  collectionForm.value.status = 'draft';
  await handleCollectionSubmit();
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

const deleteBanner = async (id, title) => {
  if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await apiClient.admin.delete(`/content/herobanners/${id}`);
    await fetchBanners();
  } catch (error) {
    console.error('Error deleting banner:', error);
  }
};

const deleteCollection = async (id, title) => {
  if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
    return;
  }
  
  try {
    await apiClient.admin.delete(`/content/featuredcollections/${id}`);
    await fetchCollections();
  } catch (error) {
    console.error('Error deleting collection:', error);
  }
};

// Preview methods
const previewBanner = (banner) => {
  previewType.value = 'banner';
  previewItem.value = banner;
  showPreview.value = true;
};

const previewCollection = (collection) => {
  previewType.value = 'collection';
  previewItem.value = collection;
  showPreview.value = true;
};

const editFromPreview = () => {
  showPreview.value = false;
  if (previewType.value === 'banner') {
    openBannerForm(previewItem.value);
  } else {
    openCollectionForm(previewItem.value);
  }
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