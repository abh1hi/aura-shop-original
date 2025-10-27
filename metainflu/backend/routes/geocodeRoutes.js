const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/geocodeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/reverse', protect, reverseGeocode);

module.exports = router;
