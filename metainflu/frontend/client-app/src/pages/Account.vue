<template>
  <div class="account-page">
    <!-- Mobile UI -->
    <div v-if="isMobile">
      <header class="account-header">
        <div class="container">
          <h1 class="header-title">Your Account</h1>
          <div class="profile-info">
            <span class="profile-name">Hello, {{ profileData.name }}</span>
            <div class="avatar">{{ profileInitials }}</div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="container">
          <router-view></router-view>
        </div>
      </main>
    </div>

    <!-- Desktop UI -->
    <div v-else class="desktop-account-page">
      <div class="desktop-container">
        <aside class="desktop-sidebar">
          <div class="profile-summary">
            <div class="avatar-large">{{ profileInitials }}</div>
            <h3>{{ profileData.name }}</h3>
            <p>{{ profileData.email }}</p>
          </div>
          <nav class="desktop-nav">
            <router-link to="/account/orders" class="nav-item" active-class="active">
              <i class="fas fa-box-open"></i>
              <span>My Orders</span>
            </router-link>
            <router-link to="/account/profile" class="nav-item" active-class="active">
              <i class="fas fa-user-edit"></i>
              <span>Edit Profile</span>
            </router-link>
            <router-link to="/account/addresses" class="nav-item" active-class="active">
              <i class="fas fa-map-marker-alt"></i>
              <span>Shipping Addresses</span>
            </router-link>
            <router-link to="/account/payment-methods" class="nav-item" active-class="active">
              <i class="fas fa-credit-card"></i>
              <span>Payment Methods</span>
            </router-link>
            <router-link to="/contact" class="nav-item" active-class="active">
              <i class="fas fa-headset"></i>
              <span>Contact Us</span>
            </router-link>
            <a href="#" @click.prevent="handleLogout" class="nav-item">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </nav>
        </aside>

        <main class="desktop-main-content">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'
import { globalState } from '../main.js'

const router = useRouter()

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const profileData = ref({
  name: globalState.user ? globalState.user.name : 'Guest',
  email: globalState.user ? globalState.user.email : 'guest@example.com',
})

const profileInitials = computed(() => {
  const name = profileData.value.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const handleLogout = () => {
  authService.logout()
  globalState.isLoggedIn = false
  globalState.user = null
  router.push({ name: 'Login' })
}

onMounted(() => {
  if (!globalState.isLoggedIn) {
    router.push({ name: 'Login' })
  }
})
</script>

<style scoped>
/* Base Styles */
.account-page {
  background-color: #f0f2f5;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Mobile Styles */
.account-header {
  background-color: #fff;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.account-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.main-content {
  padding: 2rem 0;
}

/* Desktop Styles */
.desktop-account-page {
  padding: 2rem;
}

.desktop-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.desktop-sidebar {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.profile-summary {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.profile-summary h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.profile-summary p {
  color: #718096;
}

.desktop-nav {
  display: flex;
  flex-direction: column;
}

.desktop-nav .nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: #4a5568;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.desktop-nav .nav-item.active {
  background-color: #f0f2f5;
  color: #000;
  font-weight: 600;
}

.desktop-nav .nav-item:hover {
  background-color: #f7fafc;
}

.desktop-main-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
</style>