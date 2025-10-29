<template>
  <div class="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">My Brands</h1>
      <button @click="openCreate" class="px-4 py-2 bg-primary text-white rounded">New Brand</button>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{{ error }}</div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="b in brands" :key="b._id" class="border rounded p-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">{{ b.name }}</h2>
          <div class="space-x-2">
            <button @click="openEdit(b)" class="px-3 py-1 bg-blue-500 text-white rounded text-sm">Edit</button>
            <button @click="remove(b._id)" class="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
          </div>
        </div>
        <p class="text-sm text-gray-600 mt-1" v-if="b.description">{{ b.description }}</p>
        <img v-if="b.logoUrl" :src="b.logoUrl" alt="logo" class="mt-2 h-12 object-contain"/>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ editing ? 'Edit Brand' : 'Create Brand' }}</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm mb-1">Name *</label>
            <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2"/>
          </div>
          <div>
            <label class="block text-sm mb-1">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div>
            <label class="block text-sm mb-1">Logo URL</label>
            <input v-model="form.logoUrl" type="url" class="w-full border rounded px-3 py-2"/>
          </div>
        </div>
        <div class="mt-5 flex justify-end gap-2">
          <button @click="close" class="px-4 py-2 rounded border">Cancel</button>
          <button @click="save" class="px-4 py-2 rounded bg-primary text-white">{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import vendorBrandService from '../services/vendorBrandService'

const brands = ref([])
const error = ref('')
const showModal = ref(false)
const editing = ref(false)
const saving = ref(false)
const currentId = ref(null)
const form = ref({ name: '', description: '', logoUrl: '' })

const load = async () => {
  error.value = ''
  try { brands.value = await vendorBrandService.getBrands() } catch (e) { error.value = e.message || 'Failed to load brands' }
}

const openCreate = () => { editing.value = false; currentId.value = null; form.value = { name: '', description: '', logoUrl: '' }; showModal.value = true }
const openEdit = (b) => { editing.value = true; currentId.value = b._id; form.value = { name: b.name, description: b.description || '', logoUrl: b.logoUrl || '' }; showModal.value = true }
const close = () => { showModal.value = false }

const save = async () => {
  if (!form.value.name || !form.value.name.trim()) { error.value = 'Name is required'; return }
  saving.value = true
  try {
    if (editing.value) await vendorBrandService.updateBrand(currentId.value, form.value)
    else await vendorBrandService.createBrand(form.value)
    showModal.value = false
    await load()
  } catch (e) {
    error.value = e.message || 'Save failed'
  } finally {
    saving.value = false
  }
}

const remove = async (id) => {
  if (!confirm('Delete this brand?')) return
  try { await vendorBrandService.deleteBrand(id); await load() } catch (e) { error.value = e.message || 'Delete failed' }
}

onMounted(load)
</script>
