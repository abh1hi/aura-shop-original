const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    updateCartItem
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const { cartValidationRules } = require('../middleware/validators/cartValidator');

router.route('/').get(protect, getCart).post(protect, cartValidationRules(), addToCart).delete(protect, clearCart);
router.route('/:id').delete(protect, removeFromCart).put(protect, updateCartItem);

module.exports = router;