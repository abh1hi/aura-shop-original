<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-50 pb-safe-bottom">
    <div class="flex justify-around h-16 items-center">
      <router-link to="/" class="bottom-nav-link" aria-label="Home">
        <!-- Replace with actual icons -->
        <i class="fas fa-home"></i>
        <span class="text-xs font-medium">Home</span>
      </router-link>
      <router-link to="/shop" class="bottom-nav-link" aria-label="Shop">
        <i class="fas fa-store"></i>
        <span class="text-xs font-medium">Shop</span>
      </router-link>
      <router-link to="/cart" class="bottom-nav-link relative" aria-label="Cart">
        <i class="fas fa-shopping-bag"></i>
        <span class="text-xs font-medium">Cart</span>
        <span v-if="cartCount > 0" class="absolute -top-1 right-[calc(50%-1.25rem)] bg-primary text-white rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px] ring-1 ring-white">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </router-link>
      <router-link to="/account" class="bottom-nav-link" aria-label="Account">
        <i class="fas fa-user"></i>
        <span class="text-xs font-medium">Account</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

// Mock data for cart count
const cartCount = ref(3);

</script>

<style scoped>
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0.5rem);
}

.bottom-nav-link {
  @apply flex flex-col items-center justify-center text-gray-500 transition-colors duration-200 h-full w-full;
  text-decoration: none;
}

.bottom-nav-link:hover {
  @apply text-primary;
}

.bottom-nav-link.router-link-exact-active {
  @apply text-primary font-semibold;
}

.bottom-nav-link i {
  @apply text-xl mb-1;
}
</style>
