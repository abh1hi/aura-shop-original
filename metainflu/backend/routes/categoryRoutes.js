const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
// Get all categories
router.get('/', categoryController.getCategories);

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Admin-only routes
// Create a new category
router.post('/', protect, admin, categoryController.createCategory);

// Update a category by ID
router.put('/:id', protect, admin, categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router;