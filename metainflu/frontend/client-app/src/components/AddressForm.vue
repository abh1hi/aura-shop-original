<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <MapSelector :initial-center="mapCenter" @location-updated="handleLocationUpdate" />

    <div>
      <label class="block text-sm font-medium text-gray-700">Address Type</label>
      <select v-model="form.addressType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        <option>Home</option>
        <option>Work</option>
        <option>Other</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Full Name</label>
      <input type="text" v-model="form.fullName" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Street Address</label>
      <input type="text" v-model="form.streetAddress" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Apartment, suite, etc. (Optional)</label>
      <input type="text" v-model="form.apartment" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-gray-700">City</label>
        <input type="text" v-model="form.city" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">State / Province</label>
        <input type="text" v-model="form.state" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
            <label class="block text-sm font-medium text-gray-700">Postal Code</label>
            <input type="text" v-model="form.postalCode" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700">Country</label>
            <input type="text" v-model="form.country" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Phone Number</label>
      <input type="tel" v-model="form.phoneNumber" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="flex items-center">
      <input type="checkbox" v-model="form.isDefault" id="isDefault" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
      <label for="isDefault" class="ml-2 block text-sm text-gray-900">Set as default address</label>
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
        <button type="button" @click="$emit('cancel')" class="w-full sm:w-auto justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
        <button type="submit" class="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Address</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import MapSelector from './MapSelector.vue';
import { reverseGeocode } from '../utils/geocoding';

const props = defineProps({
  address: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['save', 'cancel']);

const form = ref({});

const mapCenter = computed(() => {
  if (props.address.latitude && props.address.longitude) {
    return [props.address.latitude, props.address.longitude];
  }
  return [51.505, -0.09]; // Default center
});

watch(() => props.address, (newAddress) => {
  form.value = { ...newAddress };
}, { immediate: true, deep: true });

const handleLocationUpdate = async ({ latitude, longitude }) => {
  try {
    const addressDetails = await reverseGeocode(latitude, longitude);
    form.value.streetAddress = `${addressDetails.road || ''} ${addressDetails.house_number || ''}`.trim();
    form.value.city = addressDetails.city || addressDetails.town || addressDetails.village || '';
    form.value.state = addressDetails.state || '';
    form.value.postalCode = addressDetails.postcode || '';
    form.value.country = addressDetails.country || '';
    form.value.latitude = latitude;
    form.value.longitude = longitude;
  } catch (error) {
    console.error('Failed to update address from map:', error);
    // Optionally show a user-facing error message
  }
};

const handleSubmit = () => {
  emit('save', form.value);
};
</script>
