
import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import AdminLayout from './layouts/AdminLayout.vue';

// Existing Pages
import Dashboard from './pages/Dashboard.vue';
import Products from './pages/Products.vue';
import Orders from './pages/Orders.vue';
import Customers from './pages/Customers.vue';
import Categories from './pages/Categories.vue';
import Content from './pages/Content.vue';
import Analytics from './pages/Analytics.vue';
import Promotions from './pages/Promotions.vue';
import ProductEdit from './pages/ProductEdit.vue';

// New Admin Components
import AdminDashboard from './pages/AdminDashboard.vue';
import PlatformOverview from './pages/PlatformOverview.vue';
import SystemHealth from './pages/SystemHealth.vue';
import LiveMetrics from './pages/LiveMetrics.vue';
import AdminAnalyticsAdvanced from './pages/AdminAnalyticsAdvanced.vue';
import UserManagement from './pages/UserManagement.vue';
import OrderManagement from './pages/OrderManagement.vue';

// Authentication
import Login from './pages/Login.vue';

const routes = [
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      // Dashboard Routes
      { path: 'dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
      { path: 'admin-dashboard', component: AdminDashboard, meta: { title: 'Advanced Dashboard' } },
      { path: 'live-metrics', component: LiveMetrics, meta: { title: 'Live Metrics' } },
      
      // Management Routes
      { path: 'products', component: Products, meta: { title: 'Products' } },
      { path: 'product/new', component: ProductEdit, meta: { title: 'Add Product' } },
      { path: 'product/edit/:id', component: ProductEdit, meta: { title: 'Edit Product' } },
      { path: 'categories', component: Categories, meta: { title: 'Categories' } },
      
      // Order Management
      { path: 'orders', component: Orders, meta: { title: 'Orders' } },
      { path: 'order-management', component: OrderManagement, meta: { title: 'Order Management' } },
      
      // User Management
      { path: 'customers', component: Customers, meta: { title: 'Customers' } },
      { path: 'user-management', component: UserManagement, meta: { title: 'User Management' } },
      
      // Content Management
      { path: 'content', component: Content, meta: { title: 'Content' } },
      
      // Analytics Routes
      { path: 'analytics', component: Analytics, meta: { title: 'Analytics' } },
      { path: 'analytics-advanced', component: AdminAnalyticsAdvanced, meta: { title: 'Advanced Analytics' } },
      { path: 'promotions', component: Promotions, meta: { title: 'Promotions' } },
      
      // System Management
      { path: 'platform-overview', component: PlatformOverview, meta: { title: 'Platform Overview' } },
      { path: 'system-health', component: SystemHealth, meta: { title: 'System Health' } },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Admin Login' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Aura Shop Admin`;
  }
  
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

// Global error handler for navigation
router.onError((error, to) => {
  console.error('Router navigation error:', error);
  console.log('Failed to navigate to:', to);
});

export default router;