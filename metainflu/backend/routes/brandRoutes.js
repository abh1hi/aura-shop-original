const express = require('express');
const router = express.Router();
const {
  getBrandBySlug,
  getMyBrand,
  createBrand,
  updateBrand,
} = require('../controllers/brandController');
const { protect, vendor } = require('../middleware/authMiddleware');

router.route('/').post(protect, vendor, createBrand);
router.route('/my-brand').get(protect, vendor, getMyBrand);
router.route('/:slug').get(getBrandBySlug);
router.route('/:id').put(protect, vendor, updateBrand);

module.exports = router;
