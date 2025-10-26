<template>
  <div class="filter-group">
    <button @click="toggle" class="filter-group-header">
      <span>{{ title }}</span>
      <i :class="['fas', isOpen ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
    </button>
    <transition name="slide-fade">
      <div v-show="isOpen" class="filter-group-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  startOpen: {
    type: Boolean,
    default: false
  }
})

const isOpen = ref(props.startOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.filter-group {
  border-bottom: 1px solid #e5e5e5;
}

.filter-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.filter-group-content {
  padding-bottom: 1rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px; /* Set a large max-height for transition */
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
