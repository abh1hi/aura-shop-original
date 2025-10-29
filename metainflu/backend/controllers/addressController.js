const { validationResult } = require('express-validator');
const User = require('../models/User');

// @desc    Get all shipping addresses for a user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new shipping address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    const newAddress = req.body;

    // If the new address is set as default, unset the current default
    if (newAddress.isDefault) {
      user.shippingAddresses.forEach(addr => (addr.isDefault = false));
    }

    user.shippingAddresses.push(newAddress);
    await user.save();
    res.status(201).json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a shipping address
// @route   PUT /api/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    const addressId = req.params.addressId;
    const updatedAddress = req.body;

    const addressIndex = user.shippingAddresses.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If the updated address is set as default, unset the current default
    if (updatedAddress.isDefault) {
      user.shippingAddresses.forEach(addr => (addr.isDefault = false));
    }

    // Update the address
    user.shippingAddresses[addressIndex] = { ...user.shippingAddresses[addressIndex].toObject(), ...updatedAddress };

    await user.save();
    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a shipping address
// @route   DELETE /api/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addressId = req.params.addressId;

    user.shippingAddresses.pull({ _id: addressId });

    await user.save();
    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Set a shipping address as default
// @route   PATCH /api/addresses/:addressId/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const addressId = req.params.addressId;

    user.shippingAddresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    res.json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
