<template>
  <div class="p-4 sm:p-6 space-y-6">
    <div class="flex items-center gap-4">
      <router-link to="/products" class="p-2 rounded-full hover:bg-gray-100">
        <svg class="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </router-link>
      <h1 class="text-2xl font-bold text-text-primary">Add New Product</h1>
    </div>

    <div class="max-w-3xl mx-auto">
      <div class="card p-6 sm:p-8">
        <div v-if="successMessage" class="bg-green-100 text-green-600 p-4 rounded-lg mb-6">{{ successMessage }}</div>
        <div v-if="errorMessage" class="bg-red-100 text-danger p-4 rounded-lg mb-6"><strong>Error:</strong> {{ errorMessage }}</div>

        <form @submit.prevent="saveProduct" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Product Name *</label>
            <input id="name" v-model="newProduct.name" type="text" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" @blur="validateField('name')"/>
            <p v-if="getFieldError('name')" class="text-red-500 text-sm mt-1">{{ getFieldError('name') }}</p>
          </div>

          <!-- Brand (Vendor-Owned) -->
          <div>
            <label for="brand" class="block text-sm font-medium text-text-secondary mb-1">Brand *</label>
            <select id="brand" v-model="selectedBrand" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
              <option value="">Select Brand</option>
              <option v-for="brand in brands" :key="brand._id" :value="brand._id">{{ brand.name }}</option>
            </select>
            <p v-if="getFieldError('brand')" class="text-red-500 text-sm mt-1">{{ getFieldError('brand') }}</p>
            <p class="text-xs text-gray-500 mt-1">Manage your brands under <router-link class="text-primary underline" to="/brands">My Brands</router-link>.</p>
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-text-secondary mb-1">Category</label>
            <select id="category" v-model="newProduct.category" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary">
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
              <option value="new_category">Other (add a new category)</option>
            </select>
          </div>

          <div v-if="newProduct.category === 'new_category'">
            <label for="newCategoryName" class="block text-sm font-medium text-text-secondary mb-1">New Category Name *</label>
            <input id="newCategoryName" v-model="newCategoryName" type="text" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" placeholder="Enter new category name"/>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-text-secondary mb-1">Description *</label>
            <textarea id="description" rows="4" v-model="newProduct.description" class="mt-1 block w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:ring-primary focus:border-primary" @blur="validateField('description')"/>
            <p v-if="getFieldError('description')" class="text-red-500 text-sm mt-1">{{ getFieldError('description') }}</p>
          </div>

          <!-- Variants -->
          <div class="border-t pt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-text-primary">Product Variants *</h3>
              <button type="button" @click="addVariant" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">Add Variant</button>
            </div>

            <div v-if="newProduct.variants.length === 0" class="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">No variants added. Click "Add Variant" to create your first product variant.</div>

            <div v-for="(variant, index) in newProduct.variants" :key="index" class="bg-gray-50 p-4 rounded-lg mb-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="font-medium text-gray-700">Variant {{ index + 1 }}</h4>
                <button type="button" @click="removeVariant(index)" class="text-red-500 hover:text-red-700" v-if="newProduct.variants.length > 1">Remove</button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">SKU *</label>
                  <input v-model="variant.sku" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-300" @blur="validateField(`variants[${index}].sku`)"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Price (₹) *</label>
                  <input v-model.number="variant.price" type="number" min="0" step="0.01" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-300" @blur="validateField(`variants[${index}].price`)"/>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Stock *</label>
                  <input v-model.number="variant.stock" type="number" min="0" class="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 border-gray-300" @blur="validateField(`variants[${index}].stock`)"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex justify-end pt-4">
            <button type="submit" class="px-6 py-3 bg-primary text-white rounded-lg shadow-sm hover:bg-opacity-90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isSaving">{{ isSaving ? 'Saving...' : 'Save Product' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import vendorService from '../services/vendorService'
import categoryService from '../services/categoryService'
import vendorBrandService from '../services/vendorBrandService'
import { productValidation, errorUtils } from '../utils/validation'

const router = useRouter()

const newProduct = ref({
  name: '',
  description: '',
  category: '',
  variants: [{ sku: '', price: 0, stock: 0, attributes: [], status: 'active' }],
  images: [],
  tags: []
})

const categories = ref([])
const brands = ref([])
const selectedBrand = ref('')
const newCategoryName = ref('')
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const validationErrors = ref([])

const getFieldError = computed(() => (fieldName) => errorUtils.getFieldError(validationErrors.value, fieldName))

const validateField = (fieldName) => {
  validationErrors.value = validationErrors.value.filter(e => e.field !== fieldName)
  let errors = []
  if (fieldName === 'name') {
    errors = productValidation.validateText(newProduct.value.name, 'name', 2, 200)
  } else if (fieldName === 'description') {
    errors = productValidation.validateText(newProduct.value.description, 'description', 10, 5000)
  } else if (fieldName === 'brand') {
    if (!selectedBrand.value) errors.push({ field: 'brand', message: 'Brand is required' })
  } else if (fieldName.startsWith('variants[')) {
    const match = fieldName.match(/variants\[(\d+)\]\.(\w+)/)
    if (match) {
      const idx = parseInt(match[1]); const f = match[2]; const v = newProduct.value.variants[idx]
      if (f === 'sku' && (!v.sku || v.sku.trim() === '')) errors.push({ field: fieldName, message: `Variant ${idx + 1}: SKU is required` })
      if (f === 'price' && (!v.price || v.price <= 0)) errors.push({ field: fieldName, message: `Variant ${idx + 1}: Valid price is required` })
      if (f === 'stock' && (v.stock === undefined || v.stock === null || v.stock < 0)) errors.push({ field: fieldName, message: `Variant ${idx + 1}: Stock must be 0 or greater` })
    }
  }
  validationErrors.value.push(...errors)
}

const validateForm = () => {
  validationErrors.value = []
  const errors = productValidation.validateProduct({ ...newProduct.value, brand: selectedBrand.value })
  if (!selectedBrand.value) errors.push({ field: 'brand', message: 'Brand is required' })
  validationErrors.value = errors
  return errors.length === 0
}

const addVariant = () => newProduct.value.variants.push({ sku: '', price: 0, stock: 0, attributes: [], status: 'active' })
const removeVariant = (index) => { if (newProduct.value.variants.length > 1) newProduct.value.variants.splice(index, 1) }

const fetchCategories = async () => { categories.value = await categoryService.getCategories() }
const fetchBrands = async () => { brands.value = await vendorBrandService.getBrands() }

const saveProduct = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  if (!validateForm()) { errorMessage.value = 'Please fix the validation errors before submitting.'; return }
  isSaving.value = true
  try {
    const payload = {
      name: newProduct.value.name.trim(),
      description: newProduct.value.description.trim(),
      brand: selectedBrand.value,
      variants: newProduct.value.variants.map(v => ({ sku: v.sku.trim(), price: parseFloat(v.price) || 0, stock: parseInt(v.stock) || 0, attributes: v.attributes || [], status: v.status || 'active' })),
      images: newProduct.value.images.filter(img => img.url?.trim()),
      tags: newProduct.value.tags,
      categories: newProduct.value.category && newProduct.value.category !== 'new_category' ? [newProduct.value.category] : []
    }
    const created = await vendorService.createProduct(payload)
    successMessage.value = `Product "${created.name}" created successfully!`
    newProduct.value = { name: '', description: '', category: '', variants: [{ sku: '', price: 0, stock: 0, attributes: [], status: 'active' }], images: [], tags: [] }
    selectedBrand.value = ''
    newCategoryName.value = ''
    setTimeout(() => router.push('/products'), 1500)
  } catch (err) {
    errorMessage.value = err.message || 'Failed to save product.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => { await Promise.all([fetchCategories(), fetchBrands()]) })
</script>

<style scoped>
.card { @apply bg-white rounded-lg border border-gray-200; }
</style>
