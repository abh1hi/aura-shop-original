/*
  File: metainflu/backend/routes/adminRoutes.js
  Purpose: This file defines the API routes for admin-related endpoints.
  It uses middleware to protect these routes, ensuring only authenticated admins can access them.
*/
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUsersAdmin,
  getPendingCategories,
  approveCategory,
  rejectCategory,
} = require('../controllers/adminController');
const { getDashboardStats, getPlatformOverview } = require('../controllers/dashboardController');
const { getProductsAdmin } = require('../controllers/productController');
const { getOrdersAdmin, updateOrderStatusAdmin } = require('../controllers/orderController');
const {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getFeaturedCollections,
  createFeaturedCollection,
  updateFeaturedCollection,
  deleteFeaturedCollection,
} = require('../controllers/contentController');

// Import category controllers for admin access
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {
  getParentCategories,
  getParentCategoryById,
  createParentCategory,
  updateParentCategory,
  deleteParentCategory,
} = require('../controllers/parentCategoryController');

const {
  getSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require('../controllers/subCategoryController');

const { protect, admin } = require('../middleware/authMiddleware');

// All routes in this file are protected by admin middleware
router.use(protect, admin);

// Health Check
router.route('/health').get((req, res) => res.status(200).json({ message: 'Admin API is healthy' }));

// Dashboard & Platform Overview
router.route('/dashboard').get(getDashboardStats);
router.route('/platform-overview').get(getPlatformOverview);

// User management
router.route('/users').get(getUsersAdmin);

// Product management
router.route('/products').get(getProductsAdmin);

// Order management
router.route('/orders').get(getOrdersAdmin);
router.route('/orders/:id/status').put(updateOrderStatusAdmin);

// Category management (legacy - for approval workflow)
router.route('/categories/pending').get(getPendingCategories);
router.route('/categories/:id/approve').put(approveCategory);
router.route('/categories/:id').delete(rejectCategory); // Using DELETE to reject/delete

// Direct Category Management - Admin can directly manage all category types
// Parent Categories
router.route('/parent-categories').get(getParentCategories).post(createParentCategory);
router.route('/parent-categories/:id').get(getParentCategoryById).put(updateParentCategory).delete(deleteParentCategory);

// Categories
router.route('/categories-direct').get(getCategories).post(createCategory);
router.route('/categories-direct/:id').get(getCategoryById).put(updateCategory).delete(deleteCategory);

// Subcategories
router.route('/subcategories').get(getSubCategories).post(createSubCategory);
router.route('/subcategories/:id').get(getSubCategoryById).put(updateSubCategory).delete(deleteSubCategory);

// Content Management - Hero Banners
router.route('/content/herobanners').get(getHeroBanners).post(createHeroBanner);
router.route('/content/herobanners/:id').put(updateHeroBanner).delete(deleteHeroBanner);

// Content Management - Featured Collections
router.route('/content/featuredcollections').get(getFeaturedCollections).post(createFeaturedCollection);
router.route('/content/featuredcollections/:id').put(updateFeaturedCollection).delete(deleteFeaturedCollection);

module.exports = router;