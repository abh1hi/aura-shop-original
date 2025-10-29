const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');

// Brand model - create if not exists
let Brand;
try {
  Brand = require('../models/Brand');
} catch (e) {
  const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true });
  Brand = mongoose.model('Brand', brandSchema);
}

// Middleware: vendor-only guard (assumes req.user.role exists)
const vendorOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin')) return next();
  res.status(403);
  throw new Error('Vendor access only');
};

// List my brands
router.get('/', protect, vendorOnly, asyncHandler(async (req, res) => {
  const brands = await Brand.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(brands);
}));

// Get my specific brand
router.get('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, owner: req.user._id });
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  res.json(brand);
}));

// Create brand
router.post('/', protect, vendorOnly, asyncHandler(async (req, res) => {
  const { name, description, logoUrl } = req.body;
  if (!name || !name.trim()) {
    res.status(422);
    throw new Error('Brand name is required');
  }
  const brand = new Brand({ name: name.trim(), description: description?.trim() || '', logoUrl: logoUrl?.trim() || '', owner: req.user._id });
  const created = await brand.save();
  res.status(201).json(created);
}));

// Update brand
router.put('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const { name, description, logoUrl } = req.body;
  const brand = await Brand.findOne({ _id: req.params.id, owner: req.user._id });
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  if (name !== undefined) brand.name = name.trim();
  if (description !== undefined) brand.description = description.trim();
  if (logoUrl !== undefined) brand.logoUrl = logoUrl.trim();
  const updated = await brand.save();
  res.json(updated);
}));

// Delete brand
router.delete('/:id', protect, vendorOnly, asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id, owner: req.user._id });
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  await brand.deleteOne();
  res.json({ message: 'Brand deleted' });
}));

module.exports = router;
