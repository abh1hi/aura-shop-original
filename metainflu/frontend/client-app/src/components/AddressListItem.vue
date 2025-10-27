<template>
  <div 
    @click="$emit('select')" 
    class="p-4 border rounded-lg cursor-pointer transition-all duration-200"
    :class="{ 
      'bg-indigo-50 border-indigo-500 shadow-sm': selected, 
      'bg-white hover:bg-gray-50': !selected 
    }"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="font-semibold text-gray-800">{{ address.fullName }}</p>
        <p class="text-sm text-gray-600">{{ address.streetAddress }}</p>
        <p class="text-sm text-gray-600">{{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
      </div>
      <span v-if="address.isDefault" class="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">Default</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select']);
</script>
