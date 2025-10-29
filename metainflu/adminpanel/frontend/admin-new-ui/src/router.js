
import { createRouter, createWebHistory } from 'vue-router';

import AdminLayout from './layouts/AdminLayout.vue';
import Dashboard from './pages/Dashboard.vue';
import Products from './pages/Products.vue';
import Orders from './pages/Orders.vue';
import Customers from './pages/Customers.vue';
import Categories from './pages/Categories.vue'; // Import Categories page
import Content from './pages/Content.vue';
import Analytics from './pages/Analytics.vue';
import Promotions from './pages/Promotions.vue';
import ProductEdit from './pages/ProductEdit.vue'; // Import the new component

import Login from './pages/Login.vue';

const routes = [
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'products', component: Products },
      { path: 'product/new', component: ProductEdit }, // Add route
      { path: 'product/edit/:id', component: ProductEdit }, // Edit route
      { path: 'orders', component: Orders },
      { path: 'customers', component: Customers },
      { path: 'categories', component: Categories }, // Add Categories route
      { path: 'content', component: Content },
      { path: 'analytics', component: Analytics },
      { path: 'promotions', component: Promotions },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userInfo = localStorage.getItem('userInfo');
  let user = null;
  let isAdmin = false;

  if (userInfo) {
    try {
      user = JSON.parse(userInfo);
      isAdmin = user && user.role === 'admin';
    } catch (e) {
      console.error('Error parsing user info from localStorage', e);
      localStorage.removeItem('userInfo');
    }
  }

  if (requiresAuth && !isAdmin) {
    // If the route requires auth and the user is not an admin, redirect to login.
    next('/login');
  } else if (to.path === '/login' && isAdmin) {
    // If the user is an admin and tries to visit the login page, redirect to dashboard.
    next('/');
  } else {
    // Otherwise, proceed as normal.
    next();
  }
});

export default router;