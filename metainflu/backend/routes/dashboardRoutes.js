const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard route that redirects to admin dashboard
// This handles any requests that might go to /api/dashboard instead of /api/admin/dashboard
router.route('/dashboard')
  .get(protect, admin, getDashboardStats);

module.exports = router;