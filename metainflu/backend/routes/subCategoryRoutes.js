
const express = require('express');
const router = express.Router();
const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} = require('../controllers/subCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getSubCategories);
router.route('/:id').get(getSubCategoryById);

// Admin-only routes
router.route('/').post(protect, admin, createSubCategory);
router.route('/:id').put(protect, admin, updateSubCategory).delete(protect, admin, deleteSubCategory);

module.exports = router;
