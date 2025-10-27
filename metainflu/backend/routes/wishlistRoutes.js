const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getWishlist);
router.route('/add').post(protect, addToWishlist);
router.route('/remove/:productId').delete(protect, removeFromWishlist);

module.exports = router;
