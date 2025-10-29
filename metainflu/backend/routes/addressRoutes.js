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

const { addressValidationRules } = require('../middleware/validators/addressValidator');

router.route('/')
  .get(protect, getAddresses)
  .post(protect, addressValidationRules(), addAddress);

router.route('/:addressId')
  .put(protect, addressValidationRules(), updateAddress)
  .delete(protect, deleteAddress);

router.route('/:addressId/default').patch(protect, setDefaultAddress);

module.exports = router;
