const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { getUsersAdmin } = require('../controllers/adminController');
const { getOrdersAdmin } = require('../controllers/orderController');
const { getProductsAdmin } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// These routes provide backward compatibility for admin panel components
// that might be calling general API endpoints instead of admin-specific ones

// Dashboard route (redirects to admin dashboard)
router.route('/dashboard')
  .get(protect, admin, getDashboardStats);

// Users route (admin access required)
router.route('/users')
  .get(protect, admin, getUsersAdmin);

// Orders route (admin access required for management)
router.route('/orders')
  .get(protect, admin, getOrdersAdmin);

// Products route (admin access for full product management)
router.route('/products')
  .get(protect, admin, getProductsAdmin);

// Health check for general API
router.route('/health')
  .get((req, res) => {
    res.status(200).json({ 
      status: 'healthy',
      message: 'General API is operational',
      timestamp: new Date().toISOString()
    });
  });

module.exports = router;