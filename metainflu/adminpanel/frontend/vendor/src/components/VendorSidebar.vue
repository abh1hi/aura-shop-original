<template>
  <aside :class="['fixed inset-y-0 left-0 z-50 flex-shrink-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full']">
    <!-- Logo -->
    <div class="flex items-center justify-center p-4 h-20 border-b border-gray-200">
      <router-link to="/">
        <img class="h-10 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg" alt="Workflow">
      </router-link>
    </div>

    <div class="flex flex-col justify-between flex-1 h-full">
      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-4">
        <!-- Store Section -->
        <div>
          <h3 class="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Store</h3>
          <router-link v-for="item in storeNavItems" :key="item.name" :to="item.path" class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100"
            active-class="bg-primary-light text-primary font-semibold">
            <component :is="item.icon" class="w-6 h-6 mr-3" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>

        <!-- Analytics Section -->
        <div>
          <h3 class="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Analytics</h3>
          <router-link v-for="item in analyticsNavItems" :key="item.name" :to="item.path" class="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100"
            active-class="bg-primary-light text-primary font-semibold">
            <component :is="item.icon" class="w-6 h-6 mr-3" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center">
          <img class="h-10 w-10 rounded-full object-cover" :src="user.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'" alt="User avatar">
          <div class="ml-3">
            <p class="text-sm font-semibold text-gray-800">{{ user.name || 'Vendor User' }}</p>
            <p class="text-xs text-gray-500">{{ user.email || 'vendor@example.com' }}</p>
          </div>
        </div>
        <button @click="logout" class="flex items-center w-full px-4 py-2.5 mt-4 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { globalState } from '../main.js';
import authService from '../services/authService';
import { HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, CubeIcon, UserIcon, BellIcon, DocumentTextIcon, BuildingStorefrontIcon } from '@heroicons/vue/24/outline';

// Make isOpen optional with a default true to avoid missing-prop warnings on desktop usage
defineProps({ isOpen: { type: Boolean, default: true } });
const emit = defineEmits(['close-sidebar']);
const router = useRouter();

const user = ref(globalState.user || {});

const storeNavItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
  { name: 'My Brands', path: '/brands', icon: BuildingStorefrontIcon },
  { name: 'Brand Page', path: '/brand', icon: BuildingStorefrontIcon },
  { name: 'Invoices', path: '/invoices', icon: DocumentTextIcon },
];

const analyticsNavItems = [
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'My Tasks', path: '/tasks', icon: ClipboardDocumentListIcon },
];

const logout = () => {
  authService.logout();
  globalState.isLoggedIn = false;
  globalState.user = null;
  emit('close-sidebar');
  router.push({ name: 'Login' });
};
</script>