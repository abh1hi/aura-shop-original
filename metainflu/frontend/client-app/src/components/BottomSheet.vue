<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" @click.self="$emit('close')" class="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
    </transition>
    <transition name="slide-up">
      <div v-if="isOpen" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 max-h-[90vh] overflow-y-auto p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">{{ title }}</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

// Prevent background scroll when the sheet is open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}
</style>
