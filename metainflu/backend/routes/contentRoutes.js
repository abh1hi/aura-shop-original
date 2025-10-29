const express = require('express');
const router = express.Router();
const {
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getFeaturedCollections,
  createFeaturedCollection,
  updateFeaturedCollection,
  deleteFeaturedCollection,
  getContentPreview
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Hero Banner routes
router.route('/herobanners')
  .get(protect, admin, getHeroBanners)
  .post(protect, admin, createHeroBanner);

router.route('/herobanners/:id')
  .put(protect, admin, updateHeroBanner)
  .delete(protect, admin, deleteHeroBanner);

// Featured Collection routes
router.route('/featuredcollections')
  .get(protect, admin, getFeaturedCollections)
  .post(protect, admin, createFeaturedCollection);

router.route('/featuredcollections/:id')
  .put(protect, admin, updateFeaturedCollection)
  .delete(protect, admin, deleteFeaturedCollection);

// Content preview route
router.route('/preview')
  .get(protect, admin, getContentPreview);

module.exports = router;