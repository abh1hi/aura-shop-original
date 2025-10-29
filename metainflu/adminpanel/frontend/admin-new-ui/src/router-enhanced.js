
import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import AdminLayout from './layouts/AdminLayout.vue';

// Main Pages
import Dashboard from './pages/Dashboard.vue';
import AdminDashboard from './pages/AdminDashboard.vue';
import Products from './pages/Products.vue';
import Orders from './pages/Orders.vue';
import Customers from './pages/Customers.vue';
import Content from './pages/Content.vue';
import Analytics from './pages/Analytics.vue';
import Promotions from './pages/Promotions.vue';
import ProductEdit from './pages/ProductEdit.vue';

// New Admin Components
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
    redirect: '/admin-dashboard',
    children: [
      // Main Dashboards
      { path: 'dashboard', component: Dashboard },
      { path: 'admin-dashboard', component: AdminDashboard },
      
      // Core Management
      { path: 'products', component: Products },
      { path: 'product/new', component: ProductEdit },
      { path: 'product/edit/:id', component: ProductEdit },
      { path: 'orders', component: Orders },
      { path: 'order-management', component: OrderManagement },
      { path: 'customers', component: Customers },
      { path: 'user-management', component: UserManagement },
      
      // Content & Analytics
      { path: 'content', component: Content },
      { path: 'analytics', component: Analytics },
      { path: 'analytics-advanced', component: AdminAnalyticsAdvanced },
      { path: 'promotions', component: Promotions },
      
      // System Management
      { path: 'platform-overview', component: PlatformOverview },
      { path: 'system-health', component: SystemHealth },
      { path: 'live-metrics', component: LiveMetrics },
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
    next('/login');
  } else if (to.path === '/login' && isAdmin) {
    next('/');
  } else {
    next();
  }
});

export default router;