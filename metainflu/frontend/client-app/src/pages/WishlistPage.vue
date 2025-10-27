<template>
  <div class="wishlist-page container mx-auto p-4 md:p-6">
    <PageHeader title="My Wishlist" />

    <div v-if="loading" class="text-center py-12">
      <p class="text-lg text-gray-500">Loading your wishlist...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="!wishlist || wishlist.length === 0" class="text-center py-20">
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
      <p class="text-gray-500 mb-6">Looks like you haven't added anything to your wishlist yet.</p>
      <router-link to="/shop" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        Explore Products
      </router-link>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      <ProductCard 
        v-for="product in wishlist" 
        :key="product._id" 
        :product="product"
        :mobile="true"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWishlist } from '../composables/useWishlist';
import ProductCard from '../components/ProductCard.vue';
import PageHeader from '../components/PageHeader.vue';

const { wishlist, loading, error, fetchWishlist } = useWishlist();

onMounted(() => {
  fetchWishlist();
});
</script>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
