<template>
  <div>
    <section class="account-section">
      <h2 class="section-title">Your Orders</h2>
      <div class="options-grid">
        <router-link to="/orders" class="option-card">
          <i class="fas fa-box-open"></i>
          <span>Track & Manage Orders</span>
        </router-link>
        <router-link to="/returns" class="option-card">
          <i class="fas fa-undo-alt"></i>
          <span>Returns & Exchanges</span>
        </router-link>
      </div>
    </section>

    <section class="account-section">
      <h2 class="section-title">Account Settings</h2>
      <div class="options-grid">
        <router-link to="/account/profile" class="option-card">
          <i class="fas fa-user-edit"></i>
          <span>Edit Profile</span>
        </router-link>
        <router-link to="/account/addresses" class="option-card">
          <i class="fas fa-map-marker-alt"></i>
          <span>Shipping Addresses</span>
        </router-link>
        <router-link to="/account/payment-methods" class="option-card">
          <i class="fas fa-credit-card"></i>
          <span>Payment Methods</span>
        </router-link>
        <a href="#" @click.prevent="handleLogout" class="option-card">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
    </section>

    <section class="account-section">
      <h2 class="section-title">Customer Service</h2>
      <div class="options-grid">
        <router-link to="/contact" class="option-card">
          <i class="fas fa-headset"></i>
          <span>Contact Us</span>
        </router-link>
        <router-link to="/faq" class="option-card">
          <i class="fas fa-question-circle"></i>
          <span>FAQ</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import authService from '../services/authService';
import { globalState } from '../main.js';

const router = useRouter();

const handleLogout = () => {
  authService.logout();
  globalState.isLoggedIn = false;
  globalState.user = null;
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.account-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  text-decoration: none;
  color: #111827;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.option-card i {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #4f46e5;
}

.option-card span {
  font-weight: 500;
}
</style>
