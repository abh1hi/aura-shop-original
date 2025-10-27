const express = require('express');
const router = express.Router();
const { 
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/:addressId')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route('/:addressId/default').patch(protect, setDefaultAddress);

module.exports = router;
