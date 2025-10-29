<template>
  <div v-if="errors.length > 0" :class="containerClass">
    <div v-if="showTitle" class="flex items-center gap-2 mb-2">
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h4 :class="titleClass">{{ title }}</h4>
    </div>
    
    <div v-if="displayMode === 'list'">
      <ul class="list-disc list-inside space-y-1">
        <li v-for="error in errors" :key="error.field" :class="messageClass">
          {{ error.message }}
        </li>
      </ul>
    </div>
    
    <div v-else-if="displayMode === 'inline'" class="space-y-1">
      <p v-for="error in errors" :key="error.field" :class="messageClass">
        {{ error.message }}
      </p>
    </div>
    
    <div v-else-if="displayMode === 'grouped'">
      <div v-for="(fieldErrors, field) in groupedErrors" :key="field" class="mb-2">
        <p class="font-medium text-red-700 capitalize">{{ formatFieldName(field) }}:</p>
        <ul class="list-disc list-inside ml-4">
          <li v-for="message in fieldErrors" :key="message" :class="messageClass">
            {{ message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { errorUtils } from '../utils/validation';

// Props
const props = defineProps({
  errors: {
    type: Array,
    default: () => []
  },
  displayMode: {
    type: String,
    default: 'list', // 'list', 'inline', 'grouped'
    validator: value => ['list', 'inline', 'grouped'].includes(value)
  },
  variant: {
    type: String,
    default: 'error', // 'error', 'warning', 'info'
    validator: value => ['error', 'warning', 'info'].includes(value)
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Please fix the following errors:'
  },
  className: {
    type: String,
    default: ''
  }
});

// Computed properties
const containerClass = computed(() => {
  const baseClasses = 'p-4 rounded-lg border';
  let variantClasses = '';
  
  switch (props.variant) {
    case 'error':
      variantClasses = 'bg-red-50 border-red-200';
      break;
    case 'warning':
      variantClasses = 'bg-yellow-50 border-yellow-200';
      break;
    case 'info':
      variantClasses = 'bg-blue-50 border-blue-200';
      break;
  }
  
  return `${baseClasses} ${variantClasses} ${props.className}`;
});

const titleClass = computed(() => {
  switch (props.variant) {
    case 'error':
      return 'text-red-800 font-semibold';
    case 'warning':
      return 'text-yellow-800 font-semibold';
    case 'info':
      return 'text-blue-800 font-semibold';
    default:
      return 'text-gray-800 font-semibold';
  }
});

const messageClass = computed(() => {
  switch (props.variant) {
    case 'error':
      return 'text-red-700';
    case 'warning':
      return 'text-yellow-700';
    case 'info':
      return 'text-blue-700';
    default:
      return 'text-gray-700';
  }
});

const groupedErrors = computed(() => {
  return errorUtils.groupErrorsByField(props.errors);
});

// Methods
const formatFieldName = (fieldName) => {
  // Convert field names like 'variants[0].sku' to 'Variant 1 SKU'
  if (fieldName.includes('variants[')) {
    const match = fieldName.match(/variants\[(\d+)\]\.(\w+)/);
    if (match) {
      const index = parseInt(match[1]) + 1;
      const field = match[2].toUpperCase();
      return `Variant ${index} ${field}`;
    }
  }
  
  // Convert camelCase to Title Case
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>