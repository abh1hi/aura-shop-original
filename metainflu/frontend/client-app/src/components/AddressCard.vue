<template>
  <div class="border rounded-lg p-4 relative" :class="{ 'border-indigo-500': address.isDefault }">
    <div v-if="address.isDefault" class="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Default</div>
    <p class="font-semibold">{{ address.fullName }}</p>
    <p>{{ address.streetAddress }}</p>
    <p v-if="address.apartment">{{ address.apartment }}</p>
    <p>{{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
    <p>{{ address.country }}</p>
    <p class="mt-2">{{ address.phoneNumber }}</p>
    <div class="mt-4 space-x-2">
      <button @click="$emit('edit', address)" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
      <button @click="$emit('delete', address._id)" class="text-sm font-medium text-red-600 hover:text-red-500">Delete</button>
      <button v-if="!address.isDefault" @click="$emit('setDefault', address._id)" class="text-sm font-medium text-gray-600 hover:text-gray-900">Set as Default</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete', 'setDefault']);
</script>
