<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-center text-gray-900">Aura Shop Admin</h1>
      
      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email" required class="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label for="password" class="text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" id="password" required class="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <button type="submit" :disabled="loading" class="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Using a separate axios instance for the public login route

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    const user = response.data;

    // IMPORTANT: Check if the user is an admin
    if (user && user.role === 'admin') {
      localStorage.setItem('userInfo', JSON.stringify(user));
      router.push('/'); // Redirect to the dashboard
    } else {
      error.value = 'Access denied. Only admins can log in.';
      localStorage.removeItem('userInfo'); // Ensure no partial login state
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred during login.';
    localStorage.removeItem('userInfo');
  } finally {
    loading.value = false;
  }
};
</script>
