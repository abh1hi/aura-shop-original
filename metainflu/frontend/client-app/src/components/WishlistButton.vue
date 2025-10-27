<template>
  <button @click.stop.prevent="toggleWishlist" class="p-2 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="{ 'fill-red-500 stroke-red-500': isInWishlist }">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useWishlist } from '../composables/useWishlist';

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const { wishlist, addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();

const isInWishlist = computed(() => isProductInWishlist(props.productId));

const toggleWishlist = () => {
  if (isInWishlist.value) {
    removeFromWishlist(props.productId);
  } else {
    addToWishlist(props.productId);
  }
};
</script>
