<template>
  <header class="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300 ease-in-out">
    
    <!-- Main Content Area (Collapses when scrolled) -->
    <div :class="['container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300 ease-in-out', isScrolled ? 'max-h-0' : 'max-h-[80px]']">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="text-2xl font-bold text-gray-900">
            {{ logoText }}
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex lg:items-center lg:space-x-10">
          <router-link v-for="item in navigation" :key="item.name" :to="item.href" class="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            {{ item.name }}
          </router-link>
        </nav>

        <!-- Action Icons -->
        <div class="flex items-center space-x-4">
          <button class="icon-link hidden lg:block" aria-label="Search">
            <i class="fas fa-search"></i>
          </button>
          <router-link to="/account" class="icon-link hidden lg:block" aria-label="Account">
            <i class="fas fa-user"></i>
          </router-link>
          <router-link to="/cart" class="icon-link" aria-label="Shopping Cart">
            <i class="fas fa-shopping-bag"></i>
          </router-link>
          <button @click="isMobileMenuOpen = true" class="icon-link lg:hidden" aria-label="Open menu">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Breadcrumb Bar (Always visible when crumbs exist) -->
    <div v-if="breadcrumbs.length > 1" class="container mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex items-center py-2" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
          <li v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="inline-flex items-center">
            <router-link :to="breadcrumb.to" :class="['text-sm font-medium transition-colors', index === breadcrumbs.length - 1 ? 'text-gray-800' : 'text-gray-500 hover:text-primary']">
              <span v-if="index !== 0" class="mx-2 text-gray-400">/</span>
              {{ breadcrumb.text }}
            </router-link>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Mobile Menu (Drawer) -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black/40 z-50 lg:hidden" @click="isMobileMenuOpen = false"></div>
    </transition>
    <transition name="slide-fade">
        <div v-if="isMobileMenuOpen" class="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 lg:hidden">
            <div class="p-6 flex flex-col h-full">
                <div class="flex items-center justify-between mb-10">
                    <h2 class="text-xl font-bold">Menu</h2>
                    <button @click="isMobileMenuOpen = false" class="icon-link" aria-label="Close menu">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <nav class="flex flex-col space-y-6">
                    <router-link v-for="item in navigation" :key="item.name" :to="item.href" class="mobile-nav-link" @click="isMobileMenuOpen = false">
                        {{ item.name }}
                    </router-link>
                </nav>
                <div class="mt-auto pt-6 border-t border-gray-200">
                  <router-link to="/account" class="mobile-nav-link" @click="isMobileMenuOpen = false">Account</router-link>
                  <router-link to="/login" class="mobile-nav-link" @click="isMobileMenuOpen = false">Sign In</router-link>
                </div>
            </div>
        </div>
    </transition>

  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const route = useRoute();

// Mock navigation data
const navigation = [
  { name: 'New Arrivals', href: '/shop/new-arrivals' },
  { name: 'Collections', href: '/shop/collections' },
  { name: 'About', href: '/about' },
];

// Logic to change logo based on route
const logoText = computed(() => {
  if (route.name === 'BrandPage' && route.params.slug) {
    return route.params.slug.toString().charAt(0).toUpperCase() + route.params.slug.toString().slice(1);
  }
  return 'AURA'; // Default site logo
});

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Breadcrumb logic
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(i => i);
  const crumbs = [{ text: 'Home', to: '/' }];
  let path = '';
  pathArray.forEach((pathName) => {
    // Skip 'brand' segment from breadcrumb text
    if (pathName.toLowerCase() === 'brand') return;

    path += `/${pathName}`;
    const crumb = {
      text: pathName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      to: path
    };
    crumbs.push(crumb);
  });
  return crumbs;
});

</script>

<style scoped>
.icon-link {
  @apply text-gray-600 hover:text-primary transition-colors p-2 text-lg;
}

.mobile-nav-link {
    @apply text-2xl font-semibold text-gray-800 hover:text-primary transition-colors;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
