<template>
  <div 
    class="shop-page" 
    :class="{ 'mobile-view': isMobile, 'desktop-view': !isMobile }"
  >
    <!-- Mobile UI -->
    <div v-if="isMobile">
      <main 
        class="main-content"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="filter-sort-bar" v-if="!showSearch">
          <button @click="toggleFilters" class="filter-button">
            <i class="fas fa-filter"></i>
            <span>Filters</span>
          </button>
          <div class="sort-options">
            <select v-model="sortOption" class="sort-select">
              <option value="new">Newest First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading products...</p>
        </div>

        <div v-else-if="error" class="error-container">
          <i class="fas fa-exclamation-triangle error-icon"></i>
          <p class="error-text">{{ error }}</p>
          <button @click="fetchInitialData" class="retry-btn">Try Again</button>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-container">
          <i class="fas fa-shopping-bag empty-icon"></i>
          <h3>No Products Found</h3>
          <p>Try adjusting your search or filters</p>
          <button @click="clearAllFilters" class="clear-filters-btn">Clear Filters</button>
        </div>

        <div v-else class="products-container">
          <div class="results-info">
            <span class="results-count">{{ filteredProducts.length }} items</span>
          </div>
          
          <transition-group 
            :name="'fade-up'"
            tag="div" 
            :class="[
              'products-list',
              { 'grid-view': viewMode === 'grid' },
              { 'list-view': viewMode === 'list' }
            ]"
          >
            <ProductCard
              v-for="product in displayedProducts"
              :key="product.key"
              :product="product"
              class="product-item"
              @favoriteToggled="onFavoriteToggled"
              @addedToCart="onAddedToCart"
              @showPeek="handleShowPeek"
              @hidePeek="closePeek"
            />
          </transition-group>

          <div v-if="hasMore" class="load-more-container">
            <button 
              @click="loadMore" 
              :disabled="loadingMore"
              class="load-more-btn"
            >
              <span v-if="!loadingMore">Load More</span>
              <div v-else class="loading-spinner small"></div>
            </button>
          </div>
        </div>
      </main>

      <transition name="slide-up">
        <div v-if="showFilters" class="filter-overlay" @click="closeFilters">
          <div 
            class="filter-sheet" 
            @click.stop
            @touchstart="onFilterSheetTouchStart"
            @touchmove="onFilterSheetTouchMove"
            @touchend="onFilterSheetTouchEnd"
          >
            <div class="filter-header">
              <div class="filter-handle"></div>
              <h3>Filters</h3>
              <button @click="closeFilters" class="close-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="filter-content">
              <FilterGroup title="Price Range" :start-open="true">
                <PriceSlider v-model="priceRange" :min="0" :max="1000" />
              </FilterGroup>
              
              <FilterGroup title="Size">
                <div class="size-options">
                  <label v-for="size in availableSizes" :key="size" class="size-option" :class="{ selected: selectedSizes.includes(size) }">
                    <input type="checkbox" :value="size" v-model="selectedSizes"/>
                    <span class="size-label">{{ size }}</span>
                  </label>
                </div>
              </FilterGroup>
              
              <FilterGroup title="Colors">
                <div class="color-options">
                  <label v-for="color in availableColors" :key="color" class="color-option" :class="{ selected: selectedColors.includes(color) }">
                    <input type="checkbox" :value="color" v-model="selectedColors"/>
                    <span class="color-swatch" :style="{ backgroundColor: color }"></span>
                    <span class="color-name">{{ color }}</span>
                  </label>
                </div>
              </FilterGroup>
            </div>
            
            <div class="filter-actions">
              <button @click="clearAllFilters" class="clear-btn">Clear All</button>
              <button @click="applyFilters" class="apply-btn">Apply</button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Desktop UI -->
    <div v-else class="desktop-shop-page">
      <div class="desktop-container">
        <aside class="desktop-filter-sidebar">
          <h3>Filters</h3>
          <div class="filter-content">
            <FilterGroup title="Category" :start-open="true">
              <ul class="category-list">
                <li 
                  v-for="category in categories" 
                  :key="category._id" 
                  :class="{ active: selectedCategoryId === category._id }"
                  @click="selectCategory(category._id)"
                >
                  {{ category.name }}
                </li>
                <li :class="{ active: selectedCategoryId === null }" @click="selectCategory(null)">All</li>
              </ul>
            </FilterGroup>
            <FilterGroup title="Price Range" :start-open="true">
              <PriceSlider v-model="priceRange" :min="0" :max="1000" />
            </FilterGroup>
            <FilterGroup title="Size">
              <div class="size-options">
                <label v-for="size in availableSizes" :key="size" class="size-option" :class="{ selected: selectedSizes.includes(size) }">
                  <input type="checkbox" :value="size" v-model="selectedSizes"/>
                  <span class="size-label">{{ size }}</span>
                </label>
              </div>
            </FilterGroup>
            <FilterGroup title="Colors">
              <div class="color-options">
                <label v-for="color in availableColors" :key="color" class="color-option" :class="{ selected: selectedColors.includes(color) }">
                  <input type="checkbox" :value="color" v-model="selectedColors"/>
                  <span class="color-swatch" :style="{ backgroundColor: color }"></span>
                  <span class="color-name">{{ color }}</span>
                </label>
              </div>
            </FilterGroup>
          </div>
        </aside>

        <main class="desktop-main-content">
          <header class="desktop-header">
            <div class="results-summary">
              <h2>Results</h2>
              <p>{{ filteredProducts.length }} items</p>
            </div>
            <div class="sort-options">
              <label for="sort">Sort by:</label>
              <select id="sort" v-model="sortOption" class="sort-select">
                <option value="new">Newest First</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </header>

          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading products...</p>
          </div>

          <div v-else-if="error" class="error-container">
            <i class="fas fa-exclamation-triangle error-icon"></i>
            <p class="error-text">{{ error }}</p>
            <button @click="fetchInitialData" class="retry-btn">Try Again</button>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="empty-container">
            <i class="fas fa-shopping-bag empty-icon"></i>
            <h3>No Products Found</h3>
            <p>Try adjusting your search or filters</p>
            <button @click="clearAllFilters" class="clear-filters-btn">Clear Filters</button>
          </div>

          <div v-else class="flex flex-wrap gap-4">
            <ProductCard
              v-for="product in displayedProducts"
              :key="product.key"
              :product="product"
              :mobile="false"
              :show-rating="true"
              class="product-item"
              @click="goToProduct(product)"
              @favoriteToggled="onFavoriteToggled"
              @addedToCart="onAddedToCart"
              @showPeek="handleShowPeek"
            />
          </div>

          <div v-if="hasMore" class="load-more-container">
            <button 
              @click="loadMore" 
              :disabled="loadingMore"
              class="load-more-btn"
            >
              <span v-if="!loadingMore">Load More</span>
              <div v-else class="loading-spinner small"></div>
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Peek Modal -->
    <ProductPeekModal
      v-if="showPeek"
      :product="peekProduct"
      :is-visible="showPeek"
      :is-mobile="isMobile"
      @close="closePeek"
      @add-to-cart="onPeekAddToCart"
      @view-product="onPeekViewProduct"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import ProductPeekModal from '../components/ProductPeekModal.vue'
import FilterGroup from '../components/FilterGroup.vue'
import PriceSlider from '../components/PriceSlider.vue'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import { useCart } from '../composables/useCart'

const router = useRouter()
const { addToCart } = useCart()

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// Reactive data
const allProducts = ref([])
const categories = ref([])
const selectedCategoryId = ref(null)
const sortOption = ref('new')
const viewMode = ref('grid')
const isLoading = ref(true)
const loadingMore = ref(false)
const error = ref(null)
const displayedCount = ref(20)
const showSearch = ref(false)
const showFilters = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

// Peek functionality
const showPeek = ref(false)
const peekProduct = ref(null)
const isPeeking = ref(false)

// Filter options
const priceRange = ref({ min: 0, max: 1000 })
const selectedSizes = ref([])
const selectedColors = ref([])
const availableSizes = ref(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
const availableColors = ref(['Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige'])

// Touch gesture for filter sheet
const filterSheetTouchStartY = ref(0)
const filterSheetTouchCurrentY = ref(0)
const filterSheetSwipeThreshold = 100

// Touch gesture for main content
const touchStartX = ref(0)
const touchEndX = ref(0)
const touchStartY = ref(0)
const touchEndY = ref(0)
const swipeThreshold = 100


// Fixed computed properties with proper variant handling
const productsWithVariants = computed(() => {
  const expanded = []
  
  allProducts.value.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(variant => {
        // Build each "card product" with variant-specific fields
        expanded.push({
          // Base product identity
          _id: product._id,
          key: `${product._id}-${variant._id || variant.sku || variant.price || ''}`,
          name: product.name,
          description: product.description,
          categories: product.categories || [],
          createdAt: product.createdAt,
          
          // Variant-first fields used by ProductCard
          price: Number(variant.price ?? product.price ?? 0),
          stock: Number(variant.stock ?? 0),
          images: Array.isArray(variant.images) && variant.images.length > 0
            ? variant.images.map(img => ({ url: img }))
            : (Array.isArray(product.images) && product.images.length > 0
              ? product.images.map(img => ({ url: img.url || img }))
              : [{ url: 'https://via.placeholder.com/300' }]),
          
          // Extra fields for downstream usage
          sku: variant.sku,
          variantAttributes: Array.isArray(variant.attributes) ? variant.attributes : [],
          currentVariant: {
            _id: variant._id,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            images: variant.images || [],
            attributes: Array.isArray(variant.attributes) ? variant.attributes : []
          },
          
          // Demo fields
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 500) + 50,
          sizes: ['S', 'M', 'L', 'XL']
        })
      })
    } else {
      // Fallback for products without variants
      expanded.push({
        ...product,
        key: product._id,
        price: Number(product.price || 0),
        stock: Number(product.stock || 0),
        images: Array.isArray(product.images) && product.images.length > 0
          ? product.images.map(img => ({ url: img.url || img }))
          : [{ url: 'https://via.placeholder.com/300' }],
        currentVariant: null, // No variant for base products
        variantAttributes: [],
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 500) + 50,
        sizes: ['S', 'M', 'L', 'XL']
      })
    }
  })
  
  return expanded
})

const filteredProducts = computed(() => {
  let products = productsWithVariants.value

  // Category filter
  if (selectedCategoryId.value) {
    products = products.filter(p => p.categories.some(c => c._id === selectedCategoryId.value))
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  // Price filter
  if (priceRange.value.min !== null) {
    products = products.filter(p => p.price >= priceRange.value.min)
  }
  if (priceRange.value.max !== null) {
    products = products.filter(p => p.price <= priceRange.value.max)
  }

  // Size filter
  if (selectedSizes.value.length > 0) {
    products = products.filter(p => 
      selectedSizes.value.some(size => p.sizes?.includes(size))
    )
  }

  // Sort products
  const sortFn = {
    'low-high': (a, b) => a.price - b.price,
    'high-low': (a, b) => b.price - a.price,
    'new': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'popular': (a, b) => (b.rating * b.reviews) - (a.rating * a.reviews)
  }[sortOption.value]

  return [...products].sort(sortFn)
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedCount.value)
})

const hasMore = computed(() => {
  return displayedCount.value < filteredProducts.value.length
})

// Methods
const fetchInitialData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [productsData, categoriesData] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories()
    ])
    allProducts.value = productsData
    categories.value = categoriesData
  } catch (err) {
    console.error('Failed to fetch data:', err)
    error.value = 'Failed to load products. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (categoryId) => {
  selectedCategoryId.value = categoryId
  displayedCount.value = 20
}

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchQuery.value = ''
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const onSearch = () => {
  displayedCount.value = 20
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const closeFilters = () => {
  showFilters.value = false
}

const clearAllFilters = () => {
  selectedCategoryId.value = null
  searchQuery.value = ''
  priceRange.value = { min: 0, max: 1000 }
  selectedSizes.value = []
  selectedColors.value = []
  displayedCount.value = 20
}

const applyFilters = () => {
  showFilters.value = false
  displayedCount.value = 20
}

const loadMore = () => {
  loadingMore.value = true
  setTimeout(() => {
    displayedCount.value += 20
    loadingMore.value = false
  }, 500)
}

const goToProduct = (product) => {
  router.push({ name: 'ProductDetail', params: { id: product._id } })
}

const onFavoriteToggled = (data) => {
  console.log('Favorite toggled:', data)
}

// Fixed cart integration using useCart composable
const onAddedToCart = async (eventData) => {
  try {
    const { product, variant } = eventData
    
    // Prepare cart data based on the product structure
    const cartData = {
      productId: product._id,
      quantity: 1
    }

    // Use the variant passed from the event, or fallback to currentVariant
    const selectedVariant = variant || product.currentVariant
    
    if (selectedVariant) {
      cartData.variantId = selectedVariant._id
      cartData.variant = {
        _id: selectedVariant._id,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        attributes: selectedVariant.attributes || [],
        images: selectedVariant.images || [],
        stock: selectedVariant.stock
      }
    }

    console.log('Shop.vue - Adding to cart with data:', cartData)
    await addToCart(cartData)
    console.log('Shop.vue - Successfully added to cart')
    
    // Show success feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  } catch (error) {
    console.error('Shop.vue - Failed to add to cart:', error)
    // Could show toast notification
    alert('Failed to add item to cart. Please try again.')
  }
}

// Peek functionality methods
const handleShowPeek = (product) => {
  peekProduct.value = product
  showPeek.value = true
  isPeeking.value = true
}

const closePeek = () => {
  showPeek.value = false
  peekProduct.value = null
  isPeeking.value = false
}

const onPeekAddToCart = (product) => {
  onAddedToCart({ product })
  closePeek()
}

const onPeekViewProduct = (product) => {
  goToProduct(product)
  closePeek()
}

const onFilterSheetTouchStart = (event) => {
  filterSheetTouchStartY.value = event.touches[0].clientY
}

const onFilterSheetTouchMove = (event) => {
  filterSheetTouchCurrentY.value = event.touches[0].clientY
}

const onFilterSheetTouchEnd = () => {
  if (filterSheetTouchCurrentY.value - filterSheetTouchStartY.value > filterSheetSwipeThreshold) {
    closeFilters()
  }
  filterSheetTouchStartY.value = 0
  filterSheetTouchCurrentY.value = 0
}

const onTouchStart = (event) => {
  if (isPeeking.value) return
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

const onTouchMove = (event) => {
  if (isPeeking.value) return
  touchEndX.value = event.touches[0].clientX
  touchEndY.value = event.touches[0].clientY
}

const onTouchEnd = () => {
  if (isPeeking.value) return
  if (touchStartX.value === 0 || touchEndX.value === 0) return

  const swipeDistanceX = touchEndX.value - touchStartX.value
  const swipeDistanceY = touchEndY.value - touchStartY.value

  if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
    if (swipeDistanceX > swipeThreshold) {
      toggleFilters()
    }
  }

  touchStartX.value = 0
  touchEndX.value = 0
  touchStartY.value = 0
  touchEndY.value = 0
}

// Watchers
watch([selectedCategoryId, sortOption, selectedSizes, selectedColors, priceRange], () => {
  if (!isMobile.value) {
    displayedCount.value = 20
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  fetchInitialData()
})
</script>

<style scoped>
/* Base Styles */
.shop-page {
  min-height: 100vh;
  background-color: #fff;
  color: #1d1d1f;
}

/* Mobile-First Design */
.main-content {
  padding: 0 1rem;
}

.filter-sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e5e5;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #d2d2d7;
  border-radius: 980px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  background: #f5f5f7;
  font-size: 0.9rem;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #0071e3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text, .error-text {
  margin-top: 1rem;
  color: #6e6e73;
}

.error-icon, .empty-icon {
  font-size: 3rem;
  color: #6e6e73;
  margin-bottom: 1rem;
}

.retry-btn, .clear-filters-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #0071e3;
  color: white;
  border: none;
  border-radius: 980px;
  font-weight: 500;
  cursor: pointer;
}

.results-info {
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #6e6e73;
}

.products-list.grid-view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.products-list.list-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.load-more-btn {
  padding: 1rem 2rem;
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  border-radius: 980px;
  font-weight: 500;
  cursor: pointer;
}

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.filter-sheet {
  background: #fff;
  width: 100%;
  max-height: 90vh;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.15);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
}

.filter-handle {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background-color: #d2d2d7;
  border-radius: 2px;
}

.filter-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  flex-grow: 1;
  padding-top: 1.5rem;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-input {
  flex: 1;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  background: #f5f5f7;
  font-size: 1rem;
  text-align: center;
}

.price-separator {
  color: #6e6e73;
}

.size-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

.size-option {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  padding: 0.75rem;
  transition: all 0.2s ease;
}

.size-option input[type="checkbox"] {
  display: none;
}

.size-option .size-label {
  font-size: 1rem;
  font-weight: 500;
}

.size-option input[type="checkbox"]:checked + .size-label {
  color: #0071e3;
}

.size-option.selected {
  border-color: #0071e3;
  background-color: #f0f9ff;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 1rem;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.color-option input[type="checkbox"] {
  display: none;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #d2d2d7;
  transition: all 0.2s ease;
}

.color-option.selected .color-swatch {
  box-shadow: 0 0 0 2px #0071e3;
}

.color-name {
  font-size: 0.8rem;
  color: #6e6e73;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
  background: #fff;
}

.clear-btn, .apply-btn {
  flex: 1;
  padding: 1rem;
  border-radius: 980px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
}

.clear-btn {
  background: #f5f5f7;
  border: 1px solid #d2d2d7;
  color: #1d1d1f;
}

.apply-btn {
  background: #0071e3;
  border: 1px solid #0071e3;
  color: white;
}

/* Desktop Styles */
.desktop-shop-page {
  padding: 2rem 3rem;
}

.desktop-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  max-width: 1600px;
  margin: 0 auto;
}

.desktop-filter-sidebar {
  position: sticky;
  top: 2rem;
  height: calc(100vh - 4rem);
  overflow-y: auto;
}

.desktop-filter-sidebar h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-list li {
  padding: 0.5rem 0;
  cursor: pointer;
  font-weight: 400;
  color: #1d1d1f;
  transition: color 0.2s;
}

.category-list li.active {
  font-weight: 600;
}

.desktop-main-content {
  min-width: 0;
}

.desktop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-summary h2 {
  font-size: 1.8rem;
  font-weight: 700;
}

.results-summary p {
  color: #6e6e73;
  margin-top: 0.25rem;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .filter-sheet,
.slide-up-leave-to .filter-sheet {
  transform: translateY(100%);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>