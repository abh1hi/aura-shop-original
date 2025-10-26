<template>
  <div class="price-slider">
    <div class="slider-track">
      <div class="slider-range" :style="rangeStyle"></div>
      <input 
        type="range" 
        :min="min" 
        :max="max" 
        :value="modelValue.min" 
        @input="updateMin" 
        class="thumb thumb-left"
      />
      <input 
        type="range" 
        :min="min" 
        :max="max" 
        :value="modelValue.max" 
        @input="updateMax" 
        class="thumb thumb-right"
      />
    </div>
    <div class="slider-values">
      <span>${{ modelValue.min }}</span>
      <span>${{ modelValue.max }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  modelValue: {
    type: Object,
    default: () => ({ min: 0, max: 1000 })
  }
})

const emit = defineEmits(['update:modelValue'])

const rangeStyle = computed(() => {
  const left = (props.modelValue.min / props.max) * 100
  const right = 100 - (props.modelValue.max / props.max) * 100
  return {
    left: `${left}%`,
    right: `${right}%`
  }
})

const updateMin = (event) => {
  let newMin = parseInt(event.target.value)
  if (newMin >= props.modelValue.max) {
    newMin = props.modelValue.max - 1
  }
  emit('update:modelValue', { ...props.modelValue, min: newMin })
}

const updateMax = (event) => {
  let newMax = parseInt(event.target.value)
  if (newMax <= props.modelValue.min) {
    newMax = props.modelValue.min + 1
  }
  emit('update:modelValue', { ...props.modelValue, max: newMax })
}
</script>

<style scoped>
.price-slider {
  padding: 1rem 0;
}

.slider-track {
  position: relative;
  height: 4px;
  background-color: #d2d2d7;
  border-radius: 2px;
  margin: 0 10px;
}

.slider-range {
  position: absolute;
  height: 100%;
  background-color: #0071e3;
  border-radius: 2px;
}

.thumb {
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  width: 100%;
  height: 4px;
  background: transparent;
  pointer-events: none;
  margin: 0;
  padding: 0;
  top: 50%;
  transform: translateY(-50%);
}

.thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 1px solid #d2d2d7;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.slider-values {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  color: #6e6e73;
}
</style>
